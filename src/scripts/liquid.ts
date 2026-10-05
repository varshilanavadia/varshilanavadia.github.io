// A small liquid, simulated: what pours into the bracket button (src/components/
// BracketButton.astro). About a thousand particles in a tank a little larger than the
// button. Ink pours in at the top right corner and wells up at the bottom left, the two
// corners the button's brackets sit in; it falls, runs along the floor, meets, and rises
// until the button is under it. Let go, it drains out through the bottom left.
//
// The method is FLIP, the one film and game liquids are made with. The particles carry the
// liquid: where it is and how fast it moves. A coarse grid under them does the one thing
// particles cannot do for themselves, which is to make the liquid keep its volume: each
// step, the particles hand their velocities to the grid, the grid pushes those velocities
// about until no cell has more flowing into it than out of it, and the particles take the
// corrected velocities back. That is what makes it pile up, level out and slosh instead of
// falling through itself. Two things here make it thick rather than watery: the particles
// take most of their new velocity from the grid outright (which smooths the flow, as
// treacle does) rather than adding the grid's change to their own, and every step the grid's
// velocities are blended with their neighbours'.
//
// After Matthias Müller's FLIP demo, Ten Minute Physics no. 18
// (matthias-research.github.io/pages/tenMinutePhysics/18-flip.html), MIT License, Copyright
// 2022 Matthias Müller: the grid, the transfers either way, the pressure solve with its
// correction for particles crowding, and pushing particles apart are his, rewritten here in
// TypeScript for a tank with y pointing down. The taps, the drain, the thickening and the
// sizing to a button are this site's.
//
// Kept apart from the page, and free of anything a browser has, so that test/ can run it:
// test/liquid.test.js pours a button full and drains it.

const FLUID = 0;
const AIR = 1;
const SOLID = 2;

/** A cell, in pixels: the grid's coarseness. A particle is 0.3 of it across its radius. */
const H = 6;
const R = 0.3 * H;
/** How far the tank reaches past the button: at the sides and under it, so that its walls and
    floor are out of sight; and above, so that "full" stands clear over the button's top. */
export const SIDE = 6;
export const FLOOR = 6;
const HEAD = 20;
/** The liquid's level when full, above the button's top: clear of it by more than a wave, and
    by more than the lit edge the button's filter draws along the surface. */
const OVER = 12;
/** How hard a crowded cell pushes back: the share of its excess it sheds in a step. */
const FIRM = 0.5;
/** Pixels a second, a second: enough to cross the button in a fifth of a second from rest. */
const GRAVITY = 2800;
/** Seconds a step. The page runs two a frame. */
export const STEP = 1 / 120;
/** How much of a particle's new velocity is its own plus the grid's change (lively), the rest
    being the grid's outright (thick). And how far each grid velocity moves towards its
    neighbours' average each step. */
const LIVELY = 0.1;
const THICK = 0.35;

export const pour = (width: number, height: number, random: () => number = Math.random) => {
  // The grid: one solid cell all round, the rest open. Cells are numbered down each column,
  // i * ny + j, with j growing downwards as y does on a page.
  const nx = Math.ceil((width + 2 * SIDE) / H) + 2;
  const ny = Math.ceil((height + HEAD + FLOOR) / H) + 2;
  const cells = nx * ny;
  /** The tank's own top left corner, measured from the button's: add it to a particle's
      place to get where it is on the button. Its floor is FLOOR under the button's foot. */
  const ox = -SIDE - H;
  const oy = height + FLOOR + H - ny * H;
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
  // crowding the pressure solve holds the liquid to (`rest`, in particles a cell). `most` is
  // room for a tank filled to the brim at that packing; it is never all used, since the
  // liquid is full when it stands OVER above the button's top (`brimming`, below), which
  // leaves air under the lid.
  const packed = 1 / (2 * Math.sqrt(3) * R * R);
  const most = Math.ceil(nx * ny * H * H * packed);
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

  const add = (x: number, y: number, vx: number, vy: number) => {
    if (count >= most) return;
    pos[2 * count] = x;
    pos[2 * count + 1] = y;
    vel[2 * count] = vx;
    vel[2 * count + 1] = vy;
    count++;
  };

  // A tap: a line the liquid enters across, at a speed and in a direction. Rows of particles
  // are laid along it as fast as the stream carries the last row clear, so the stream is as
  // dense as the liquid at rest, with every other row set half a particle across and each
  // particle a little out of true, so that it does not arrive as a lattice.
  const SPEED = 380;
  const tap = (x0: number, x1: number, y: number, dx: number, dy: number) => {
    let run = 0;
    let odd = false;
    return () => {
      run += SPEED * STEP;
      const gap = Math.sqrt(3) * R;
      while (run >= gap) {
        run -= gap;
        odd = !odd;
        for (let x = x0 + (odd ? R : 0); x <= x1; x += 2 * R) {
          add(x - ox + (random() - 0.5) * R + dx * run, y - oy + (random() - 0.5) * R + dy * run, dx * SPEED, dy * SPEED);
        }
      }
    };
  };
  // Down and in from just above the top right corner; up and in from just under the bottom
  // left. A tenth of the button wide each, so that a wider button fills in the same time.
  const stream = 0.1 * width;
  const taps = [
    tap(width - 1 - stream, width - 1, -8, -0.34, 0.94),
    tap(1, 1 + stream, height + 2, 0.34, -0.94),
  ];

  // Gravity, straight down while it fills. While it drains the button tips, in effect: half
  // of gravity again pulls towards the drain's side, so the liquid runs to that corner
  // rather than waiting to find it, however wide the button.
  const move = (tipped: boolean) => {
    for (let i = 0; i < count; i++) {
      if (tipped) vel[2 * i] -= STEP * GRAVITY * 0.5;
      vel[2 * i + 1] += STEP * GRAVITY;
      pos[2 * i] += vel[2 * i] * STEP;
      pos[2 * i + 1] += vel[2 * i + 1] * STEP;
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
        const c = clamp(Math.floor(pos[2 * i] / H), 0, nx - 1) * ny + clamp(Math.floor(pos[2 * i + 1] / H), 0, ny - 1);
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
  // that it pushes particles away: that is what stops the liquid slowly losing volume. Done
  // over and over, a little too hard each time, which settles sooner.
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

  // The drain: a pocket in the bottom left corner, a quarter of the button wide and mostly
  // under it, that takes whatever reaches it, up to a set number of particles a step (more
  // for a wider button). Once only a film is left on the floor, out of sight, the rest goes
  // at once.
  const drain = () => {
    const x1 = H + SIDE + 0.25 * width;
    const y0 = (ny - 1) * H - 14;
    const take = Math.ceil(0.1 * width);
    let taken = 0;
    for (let i = count - 1; i >= 0 && taken < take; i--) {
      if (pos[2 * i] < x1 && pos[2 * i + 1] > y0) {
        count--;
        pos[2 * i] = pos[2 * count];
        pos[2 * i + 1] = pos[2 * count + 1];
        vel[2 * i] = vel[2 * count];
        vel[2 * i + 1] = vel[2 * count + 1];
        taken++;
      }
    }
    if (count < most * 0.05) count = 0;
  };

  // Full: liquid in every cell of the row that lies OVER above the button's top, wall to
  // wall. Read off the grid as the particles last marked it, so a splash that reaches the
  // row in one place does not count, and a wave that drops below it starts the taps again.
  const brim = clamp(Math.floor((-OVER - oy) / H), 1, ny - 2);
  const brimming = () => {
    for (let i = 1; i < nx - 1; i++) if (kind[i * ny + brim] !== FLUID) return false;
    return true;
  };

  return {
    /** Where each particle is, and how fast it moves, two numbers apiece, from the tank's
        own corner. */
    pos,
    vel,
    /** The tank's corner, from the button's: a particle is at pos + (ox, oy) on the button. */
    ox,
    oy,
    get count() {
      return count;
    },
    /** Whether the button is under liquid, with room to spare. */
    get full() {
      return count > 0 && brimming();
    },
    /** One step of STEP seconds: filling while it is wanted, draining while it is not. */
    step(wanted: boolean) {
      if (wanted && !(count && brimming())) for (const run of taps) run();
      if (!wanted && count) drain();
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
    /** Take over another tank's liquid, as it stands: for a button that has changed size. */
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
