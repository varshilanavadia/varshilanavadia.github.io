// A small liquid, simulated: the ink that spreads across the bracket button (src/components/
// BracketButton.astro), seen from above, as a thick liquid poured onto a table is. About a
// thousand particles on a patch of surface a little larger than the button. Ink is poured on
// at the top right corner and at the bottom left, the two corners the button's brackets sit
// in, each stream aimed at the other. Each runs out as a tongue, slows as the surface drags
// on it, and swells sideways as more arrives behind; the two meet in the middle and close up,
// and the ink goes on spreading until the button is covered. Let go, it is drawn back to the
// two corners, parting in the middle first.
//
// The picture is the site's own: the same one its nine circles drew by rote (BracketButton
// still pours those where there is no script), made to behave rather than follow paths.
//
// The method is FLIP, the one film and game liquids are made with. The particles carry the
// liquid: where it is and how fast it moves. A coarse grid under them does the one thing
// particles cannot do for themselves, which is to make the liquid keep its volume: each
// step, the particles hand their velocities to the grid, the grid pushes those velocities
// about until no cell has more flowing into it than out of it, and the particles take the
// corrected velocities back. That is what makes ink arriving behind push the ink in front
// outwards, and two bodies of it join when they touch. Three things make it a thick liquid
// on a surface rather than water in a tank. There is no gravity in the picture: it is seen
// from above. The surface drags on it, more in some places than in others, so that it slows
// as it spreads and its edge does not advance evenly. And it is thick: the particles take
// most of their new velocity from the grid outright rather than adding the grid's change to
// their own, and every step the grid's velocities are blended with their neighbours'.
//
// After Matthias Müller's FLIP demo, Ten Minute Physics no. 18
// (matthias-research.github.io/pages/tenMinutePhysics/18-flip.html), MIT License, Copyright
// 2022 Matthias Müller: the grid, the transfers either way, the pressure solve with its
// correction for particles crowding, and pushing particles apart are his, rewritten here in
// TypeScript. The pouring, the drawing back, the surface's drag and its unevenness, the
// thickening and the sizing to a button are this site's.
//
// Kept apart from the page, and free of anything a browser has, so that test/ can run it:
// test/liquid.test.js covers a button with it and draws it back.

const FLUID = 0;
const AIR = 1;
const SOLID = 2;

/** A cell, in pixels: the grid's coarseness. A particle is 0.3 of it across its radius. */
const H = 6;
const R = 0.3 * H;
/** How far the patch of surface reaches past the button, all round, so that its walls are
    out of sight. */
export const SIDE = 6;
/** Seconds a step. The page runs two a frame. */
export const STEP = 1 / 120;
/** How hard a crowded cell pushes back: the share of its excess it sheds in a step. */
const FIRM = 0.5;
/** How much of a particle's new velocity is its own plus the grid's change (lively), the rest
    being the grid's outright (thick). And how far each grid velocity moves towards its
    neighbours' average each step. */
const LIVELY = 0.1;
const THICK = 0.35;
/** How fast the ink leaves the tap, in pixels a second; and the share of its speed the
    surface takes from it each second, on average and give or take from place to place. */
const SPEED = 300;
const DRAG = 5;
const UNEVEN = 0.6;
/** Drawn back: how hard each particle is pulled to its nearer corner, in pixels a second, a
    second; and how close to the corner it is taken up. */
const PULL = 4200;
const MOUTH = 16;

export const pour = (width: number, height: number, random: () => number = Math.random) => {
  // The grid: one solid cell all round, the rest open, centred on the button. Cells are
  // numbered down each column, i * ny + j, with j growing downwards as y does on a page.
  const nx = Math.ceil((width + 2 * SIDE) / H) + 2;
  const ny = Math.ceil((height + 2 * SIDE) / H) + 2;
  const cells = nx * ny;
  /** The patch's own top left corner, measured from the button's: add it to a particle's
      place to get where it is on the button. */
  const ox = (width - nx * H) / 2;
  const oy = (height - ny * H) / 2;
  const u = new Float32Array(cells);
  const v = new Float32Array(cells);
  const wu = new Float32Array(cells);
  const wv = new Float32Array(cells);
  const beforeU = new Float32Array(cells);
  const beforeV = new Float32Array(cells);
  const open = new Float32Array(cells);
  const kind = new Int8Array(cells);
  const crowd = new Float32Array(cells);
  for (let i = 1; i < nx - 1; i++) for (let j = 1; j < ny - 1; j++) open[i * ny + j] = 1;

  // The particles. At their closest they pack one to every 2R by root-three R, which is the
  // crowding the pressure solve holds the liquid to (`rest`, in particles a cell), and `room`
  // is the whole patch at that packing. Jostled as they are, they cover the patch with fewer:
  // it is under ink from about 0.85 of that, so `enough` is 0.9, and the taps stop there.
  const packed = 1 / (2 * Math.sqrt(3) * R * R);
  const room = (nx - 2) * (ny - 2) * H * H * packed;
  const enough = Math.round(room * 0.9);
  const most = Math.ceil(room);
  const pos = new Float32Array(2 * most);
  const vel = new Float32Array(2 * most);
  let count = 0;
  const rest = packed * H * H;

  // For finding a particle's neighbours: a second, finer grid of bins, a particle and a bit across.
  const bin = 1 / (2.2 * R);
  const bx = Math.floor(nx * H * bin) + 1;
  const by = Math.floor(ny * H * bin) + 1;
  const inBin = new Int32Array(bx * by);
  const firstIn = new Int32Array(bx * by + 1);
  const ids = new Int32Array(most);

  const clamp = (x: number, lo: number, hi: number) => (x < lo ? lo : x > hi ? hi : x);
  const cellAt = (x: number, y: number) => clamp(Math.floor(x / H), 0, nx - 1) * ny + clamp(Math.floor(y / H), 0, ny - 1);

  // The two corners the ink comes from and goes back to: the patch's top right and bottom
  // left. And the way from the first to the second, which is the way its stream is aimed.
  const tr = [(nx - 1) * H, H];
  const bl = [H, (ny - 1) * H];
  const span = Math.hypot(bl[0] - tr[0], bl[1] - tr[1]);
  const aim = [(bl[0] - tr[0]) / span, (bl[1] - tr[1]) / span];

  // The surface: how much it drags, cell by cell. Uneven, as any surface is, in patches three
  // cells across with soft edges, and dealt afresh every time the ink has all gone, so that
  // no two spreads have the same edge.
  const grip = new Float32Array(cells);
  const roughen = () => {
    const bw = Math.ceil(nx / 3) + 1;
    const bh = Math.ceil(ny / 3) + 1;
    const patches = Float32Array.from({ length: bw * bh }, () => random());
    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < ny; j++) {
        const fx = i / 3;
        const fy = j / 3;
        const x0 = Math.floor(fx);
        const y0 = Math.floor(fy);
        const tx = fx - x0;
        const ty = fy - y0;
        const at = (x: number, y: number) => patches[Math.min(x, bw - 1) * bh + Math.min(y, bh - 1)];
        const here = at(x0, y0) * (1 - tx) * (1 - ty) + at(x0 + 1, y0) * tx * (1 - ty) + at(x0, y0 + 1) * (1 - tx) * ty + at(x0 + 1, y0 + 1) * tx * ty;
        grip[i * ny + j] = DRAG * (1 + UNEVEN * (2 * here - 1));
      }
    }
  };
  roughen();

  const add = (x: number, y: number, vx: number, vy: number) => {
    if (count >= most) return;
    pos[2 * count] = x;
    pos[2 * count + 1] = y;
    vel[2 * count] = vx;
    vel[2 * count + 1] = vy;
    count++;
  };

  // A tap: a short line the ink enters across, just in from a corner, at SPEED and aimed
  // along (dx, dy). Rows of particles are laid along it as fast as the stream carries the last
  // row clear, so the stream is as dense as the liquid at rest, with every other row set half
  // a particle across and each particle a little out of true, so that it does not arrive as a
  // lattice. A twentieth of the button's width to either side of its middle, so that a wider
  // button is covered in the same time.
  const reach = 0.052 * width;
  const tap = (corner: number[], dx: number, dy: number) => {
    const cx = corner[0] + dx * (reach + 6);
    const cy = corner[1] + dy * (reach + 6);
    let run = 0;
    let odd = false;
    return () => {
      run += SPEED * STEP;
      const gap = Math.sqrt(3) * R;
      while (run >= gap) {
        run -= gap;
        odd = !odd;
        for (let s = -reach + (odd ? R : 0); s <= reach; s += 2 * R) {
          const x = cx - dy * s + dx * run + (random() - 0.5) * R;
          const y = cy + dx * s + dy * run + (random() - 0.5) * R;
          add(x, y, dx * SPEED, dy * SPEED);
        }
      }
    };
  };
  const taps = [tap(tr, aim[0], aim[1]), tap(bl, -aim[0], -aim[1])];

  // A step's travel. The surface takes its share of each particle's speed, by where the
  // particle is. Being drawn back, each is also pulled towards the nearer of the two corners.
  const move = (back: boolean) => {
    for (let i = 0; i < count; i++) {
      const x = pos[2 * i];
      const y = pos[2 * i + 1];
      const slow = Math.max(0, 1 - grip[cellAt(x, y)] * STEP);
      let vx = vel[2 * i] * slow;
      let vy = vel[2 * i + 1] * slow;
      if (back) {
        const toTr = Math.hypot(tr[0] - x, tr[1] - y);
        const toBl = Math.hypot(bl[0] - x, bl[1] - y);
        const home = toTr < toBl ? tr : bl;
        const far = Math.max(1, Math.min(toTr, toBl));
        vx += ((home[0] - x) / far) * PULL * STEP;
        vy += ((home[1] - y) / far) * PULL * STEP;
      }
      vel[2 * i] = vx;
      vel[2 * i + 1] = vy;
      pos[2 * i] = x + vx * STEP;
      pos[2 * i + 1] = y + vy * STEP;
    }
  };

  // No two particles closer than a particle: each pair that is, is moved apart by half the
  // overlap each. Found through the bins: a particle's neighbours are in its bin or the
  // eight round it.
  const separate = () => {
    inBin.fill(0);
    const binOf = (i: number) =>
      clamp(Math.floor(pos[2 * i] * bin), 0, bx - 1) * by + clamp(Math.floor(pos[2 * i + 1] * bin), 0, by - 1);
    for (let i = 0; i < count; i++) inBin[binOf(i)]++;
    let first = 0;
    for (let b = 0; b < bx * by; b++) {
      first += inBin[b];
      firstIn[b] = first;
    }
    firstIn[bx * by] = first;
    for (let i = 0; i < count; i++) ids[--firstIn[binOf(i)]] = i;

    const near = 2 * R;
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < count; i++) {
        const px = pos[2 * i];
        const py = pos[2 * i + 1];
        const cx = Math.floor(px * bin);
        const cy = Math.floor(py * bin);
        for (let xi = Math.max(cx - 1, 0); xi <= Math.min(cx + 1, bx - 1); xi++) {
          for (let yi = Math.max(cy - 1, 0); yi <= Math.min(cy + 1, by - 1); yi++) {
            const b = xi * by + yi;
            for (let k = firstIn[b]; k < firstIn[b + 1]; k++) {
              const q = ids[k];
              if (q === i) continue;
              let dx = pos[2 * q] - px;
              let dy = pos[2 * q + 1] - py;
              const d2 = dx * dx + dy * dy;
              if (d2 > near * near || d2 === 0) continue;
              const d = Math.sqrt(d2);
              const s = (0.5 * (near - d)) / d;
              dx *= s;
              dy *= s;
              pos[2 * i] -= dx;
              pos[2 * i + 1] -= dy;
              pos[2 * q] += dx;
              pos[2 * q + 1] += dy;
            }
          }
        }
      }
    }
  };

  // The walls: a particle past one is put back at it and loses its speed into it.
  const contain = () => {
    const x0 = H + R;
    const x1 = (nx - 1) * H - R;
    const y0 = H + R;
    const y1 = (ny - 1) * H - R;
    for (let i = 0; i < count; i++) {
      const x = pos[2 * i];
      const y = pos[2 * i + 1];
      if (x < x0 || x > x1) {
        pos[2 * i] = clamp(x, x0, x1);
        vel[2 * i] = 0;
      }
      if (y < y0 || y > y1) {
        pos[2 * i + 1] = clamp(y, y0, y1);
        vel[2 * i + 1] = 0;
      }
    }
  };

  // How crowded each cell is: every particle shared out among the four cells whose centres
  // are nearest it, by how near.
  const crowding = () => {
    crowd.fill(0);
    const half = 0.5 * H;
    for (let i = 0; i < count; i++) {
      const x = clamp(pos[2 * i], H, (nx - 1) * H);
      const y = clamp(pos[2 * i + 1], H, (ny - 1) * H);
      const x0 = Math.floor((x - half) / H);
      const tx = (x - half - x0 * H) / H;
      const x1 = Math.min(x0 + 1, nx - 2);
      const y0 = Math.floor((y - half) / H);
      const ty = (y - half - y0 * H) / H;
      const y1 = Math.min(y0 + 1, ny - 2);
      crowd[x0 * ny + y0] += (1 - tx) * (1 - ty);
      crowd[x1 * ny + y0] += tx * (1 - ty);
      crowd[x1 * ny + y1] += tx * ty;
      crowd[x0 * ny + y1] += (1 - tx) * ty;
    }
  };

  // Velocities between particles and grid. The grid keeps u, the speed across, on each cell's
  // left edge and v, the speed down, on its top edge; a particle shares with, or reads from,
  // the four such points round it. To the grid: each point gets the weighted average of the
  // particles near it, and a cell with a particle in it becomes liquid. From the grid: see
  // LIVELY, above.
  const transfer = (toGrid: boolean) => {
    const half = 0.5 * H;
    if (toGrid) {
      beforeU.set(u);
      beforeV.set(v);
      u.fill(0);
      v.fill(0);
      wu.fill(0);
      wv.fill(0);
      for (let c = 0; c < cells; c++) kind[c] = open[c] ? AIR : SOLID;
      for (let i = 0; i < count; i++) {
        const c = cellAt(pos[2 * i], pos[2 * i + 1]);
        if (kind[c] === AIR) kind[c] = FLUID;
      }
    }
    for (let part = 0; part < 2; part++) {
      const f = part ? v : u;
      const before = part ? beforeV : beforeU;
      const w = part ? wv : wu;
      const sx = part ? half : 0;
      const sy = part ? 0 : half;
      const back = part ? 1 : ny;
      for (let i = 0; i < count; i++) {
        const x = clamp(pos[2 * i], H, (nx - 1) * H);
        const y = clamp(pos[2 * i + 1], H, (ny - 1) * H);
        const x0 = Math.min(Math.floor((x - sx) / H), nx - 2);
        const tx = (x - sx - x0 * H) / H;
        const x1 = Math.min(x0 + 1, nx - 2);
        const y0 = Math.min(Math.floor((y - sy) / H), ny - 2);
        const ty = (y - sy - y0 * H) / H;
        const y1 = Math.min(y0 + 1, ny - 2);
        const d0 = (1 - tx) * (1 - ty);
        const d1 = tx * (1 - ty);
        const d2 = tx * ty;
        const d3 = (1 - tx) * ty;
        const c0 = x0 * ny + y0;
        const c1 = x1 * ny + y0;
        const c2 = x1 * ny + y1;
        const c3 = x0 * ny + y1;
        if (toGrid) {
          const pv = vel[2 * i + part];
          f[c0] += pv * d0;
          w[c0] += d0;
          f[c1] += pv * d1;
          w[c1] += d1;
          f[c2] += pv * d2;
          w[c2] += d2;
          f[c3] += pv * d3;
          w[c3] += d3;
        } else {
          // A point counts only if liquid is on one side of it or the other.
          const a0 = kind[c0] !== AIR || kind[c0 - back] !== AIR ? d0 : 0;
          const a1 = kind[c1] !== AIR || kind[c1 - back] !== AIR ? d1 : 0;
          const a2 = kind[c2] !== AIR || kind[c2 - back] !== AIR ? d2 : 0;
          const a3 = kind[c3] !== AIR || kind[c3 - back] !== AIR ? d3 : 0;
          const sum = a0 + a1 + a2 + a3;
          if (sum > 0) {
            const grid = (a0 * f[c0] + a1 * f[c1] + a2 * f[c2] + a3 * f[c3]) / sum;
            const change = (a0 * (f[c0] - before[c0]) + a1 * (f[c1] - before[c1]) + a2 * (f[c2] - before[c2]) + a3 * (f[c3] - before[c3])) / sum;
            vel[2 * i + part] = (1 - LIVELY) * grid + LIVELY * (vel[2 * i + part] + change);
          }
        }
      }
      if (toGrid) {
        for (let c = 0; c < cells; c++) if (w[c] > 0) f[c] /= w[c];
      }
    }
    if (toGrid) {
      // Nothing flows through a wall: a point on a solid cell keeps the nothing it had.
      for (let i = 0; i < nx; i++) {
        for (let j = 0; j < ny; j++) {
          const c = i * ny + j;
          const solid = kind[c] === SOLID;
          if (solid || (i > 0 && kind[c - ny] === SOLID)) u[c] = beforeU[c];
          if (solid || (j > 0 && kind[c - 1] === SOLID)) v[c] = beforeV[c];
        }
      }
    }
  };

  // Thickness: each velocity the particles gave the grid moves part of the way to the average
  // of those its neighbours were given, so that liquid drags on the liquid beside it. Only
  // between points that have liquid at them and are not on a wall: a wall's stay at nothing.
  const thicken = () => {
    for (let part = 0; part < 2; part++) {
      const f = part ? v : u;
      const w = part ? wv : wu;
      const before = part ? beforeV : beforeU;
      const back = part ? 1 : ny;
      const live = (c: number) => w[c] > 0 && open[c] > 0 && open[c - back] > 0;
      before.set(f);
      for (let i = 1; i < nx - 1; i++) {
        for (let j = 1; j < ny - 1; j++) {
          const c = i * ny + j;
          if (!live(c)) continue;
          let sum = 0;
          let n = 0;
          for (const near of [c - ny, c + ny, c - 1, c + 1]) {
            if (live(near)) {
              sum += before[near];
              n++;
            }
          }
          if (n) f[c] += THICK * (sum / n - before[c]);
        }
      }
    }
  };

  // The grid's one job. For each liquid cell, what flows out less what flows in should be
  // nothing; where it is not, the difference is shared out among the cell's open sides.
  // A cell more crowded than liquid at rest is told it has less flowing out than it has, so
  // that it pushes particles away: that is what spreads the ink that piles up behind a tap,
  // and what stops the liquid slowly losing volume. Done over and over, a little too hard
  // each time, which settles sooner.
  const keepVolume = () => {
    beforeU.set(u);
    beforeV.set(v);
    for (let pass = 0; pass < 40; pass++) {
      for (let i = 1; i < nx - 1; i++) {
        for (let j = 1; j < ny - 1; j++) {
          const c = i * ny + j;
          if (kind[c] !== FLUID) continue;
          const l = open[c - ny];
          const r = open[c + ny];
          const t = open[c - 1];
          const b = open[c + 1];
          const sides = l + r + t + b;
          if (sides === 0) continue;
          let out = u[c + ny] - u[c] + v[c + 1] - v[c];
          const squeeze = crowd[c] / rest - 1;
          if (squeeze > 0) out -= (FIRM * squeeze * H) / STEP;
          const p = (-out / sides) * 1.9;
          u[c] -= l * p;
          u[c + ny] += r * p;
          v[c] -= t * p;
          v[c + 1] += b * p;
        }
      }
    }
  };

  // Drawn back: whatever comes within MOUTH of either corner is taken up, so many particles
  // a step at each (more for a wider button). Once only a little is left, tucked in the
  // corners and out of sight, the rest goes at once, and the surface is dealt afresh.
  const takeUp = () => {
    const take = Math.ceil(0.045 * width);
    for (const corner of [tr, bl]) {
      let taken = 0;
      for (let i = count - 1; i >= 0 && taken < take; i--) {
        if (Math.hypot(pos[2 * i] - corner[0], pos[2 * i + 1] - corner[1]) < MOUTH) {
          count--;
          pos[2 * i] = pos[2 * count];
          pos[2 * i + 1] = pos[2 * count + 1];
          vel[2 * i] = vel[2 * count];
          vel[2 * i + 1] = vel[2 * count + 1];
          taken++;
        }
      }
    }
    if (count < room * 0.04) {
      count = 0;
      roughen();
    }
  };

  return {
    /** Where each particle is, and how fast it moves, two numbers apiece, from the patch's
        own corner. */
    pos,
    vel,
    /** The patch's corner, from the button's: a particle is at pos + (ox, oy) on the button. */
    ox,
    oy,
    /** How far past the button the patch's walls are, at the sides and at the top and foot. */
    past: [-ox - H, -oy - H],
    get count() {
      return count;
    },
    /** Whether there is ink enough to cover the button, which is when the taps stop. */
    get full() {
      return count >= enough;
    },
    /** One step of STEP seconds: spreading while it is wanted, drawn back while it is not. */
    step(wanted: boolean) {
      if (wanted && count < enough) for (const run of taps) run();
      if (!wanted && count) takeUp();
      if (!count) return;
      move(!wanted);
      separate();
      contain();
      transfer(true);
      crowding();
      thicken();
      keepVolume();
      transfer(false);
    },
    /** Take over another patch's liquid, as it stands: for a button that has changed size. */
    inherit(from: { pos: Float32Array; vel: Float32Array; count: number; ox: number; oy: number }) {
      count = Math.min(from.count, most);
      vel.set(from.vel.subarray(0, 2 * count));
      for (let i = 0; i < count; i++) {
        pos[2 * i] = from.pos[2 * i] + from.ox - ox;
        pos[2 * i + 1] = from.pos[2 * i + 1] + from.oy - oy;
      }
    },
  };
};
