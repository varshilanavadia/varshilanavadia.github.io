// The bracket button's liquid, src/scripts/liquid.ts: spread over a button and drawn back off
// it here, with no browser, to hold it to what the button relies on. It covers the button in
// about a second, with nothing showing through; nothing escapes the patch or blows up; once
// there is enough it takes no more and comes to rest; it is drawn back promptly; and a wider
// button is covered as fast. Loaded as it is written; Node strips the types. Run with
// `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pour, STEP } from '../src/scripts/liquid.ts';

// The same liquid every run: a small generator in place of Math.random.
const dice = () => {
  let seed = 7;
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
};
const seconds = (steps) => steps * STEP;

// The share of the button, taken in 2px squares, that has a particle within 4.6px of it,
// which is how wide the button draws one. All of it means nothing shows through.
const covered = (liquid, width, height) => {
  const size = 2;
  const reach = 4.6;
  const cols = Math.ceil(width / size);
  const rows = Math.ceil(height / size);
  const hit = new Uint8Array(cols * rows);
  for (let i = 0; i < liquid.count; i++) {
    const x = liquid.pos[2 * i] + liquid.ox;
    const y = liquid.pos[2 * i + 1] + liquid.oy;
    for (let cx = Math.max(0, Math.floor((x - reach) / size)); cx <= Math.min(cols - 1, Math.floor((x + reach) / size)); cx++) {
      for (let cy = Math.max(0, Math.floor((y - reach) / size)); cy <= Math.min(rows - 1, Math.floor((y + reach) / size)); cy++) {
        if ((cx * size + 1 - x) ** 2 + (cy * size + 1 - y) ** 2 <= reach * reach) hit[cx * rows + cy] = 1;
      }
    }
  }
  return hit.reduce((sum, one) => sum + one, 0) / hit.length;
};
// Steps until it reports full, or the limit.
const fill = (liquid, limit = 360) => {
  let steps = 0;
  while (!liquid.full && steps < limit) {
    liquid.step(true);
    steps++;
  }
  return steps;
};

// Steps until the button is covered, or the limit.
const cover = (liquid, width, height, limit = 360) => {
  let steps = 0;
  while (covered(liquid, width, height) < 1 && steps < limit) {
    liquid.step(true);
    steps++;
  }
  return steps;
};

test('a button is covered in about a second, completely', () => {
  const liquid = pour(142, 56, dice());
  const steps = cover(liquid, 142, 56);
  assert.equal(covered(liquid, 142, 56), 1, 'it never covered the button');
  assert.ok(seconds(steps) > 0.6 && seconds(steps) < 1.4, `it took ${seconds(steps).toFixed(2)}s`);
});

test('once there is enough it takes no more, stays covered and comes to rest', () => {
  const liquid = pour(142, 56, dice());
  fill(liquid);
  assert.ok(liquid.full, 'the taps never stopped');
  const enough = liquid.count;
  for (let i = 0; i < 60; i++) liquid.step(true);
  for (let i = 0; i < 240; i++) {
    liquid.step(true);
    assert.equal(covered(liquid, 142, 56), 1, `a gap ${seconds(i).toFixed(2)}s after settling`);
  }
  assert.equal(liquid.count, enough);
  let fastest = 0;
  for (let i = 0; i < liquid.count; i++) fastest = Math.max(fastest, Math.hypot(liquid.vel[2 * i], liquid.vel[2 * i + 1]));
  assert.ok(fastest < 10, `still moving at ${fastest.toFixed(0)}px a second`);
});

test('nothing leaves the patch, and nothing blows up', () => {
  const width = 142;
  const height = 56;
  const liquid = pour(width, height, dice());
  for (let i = 0; i < 300; i++) liquid.step(true);
  for (let i = 0; i < 40; i++) liquid.step(false);
  assert.ok(liquid.count > 0);
  for (let i = 0; i < liquid.count; i++) {
    const x = liquid.pos[2 * i] + liquid.ox;
    const y = liquid.pos[2 * i + 1] + liquid.oy;
    assert.ok(Number.isFinite(x) && Number.isFinite(y), 'a particle is nowhere');
    // The patch reaches 6px past the button all round, rounded out to whole cells of 6px.
    assert.ok(x > -12 && x < width + 12 && y > -12 && y < height + 12, `a particle got out, to ${x.toFixed(1)}, ${y.toFixed(1)}`);
  }
});

test('let go, it is drawn back to nothing within a second and a half', () => {
  const liquid = pour(142, 56, dice());
  fill(liquid);
  let steps = 0;
  while (liquid.count && steps < 600) {
    liquid.step(false);
    steps++;
  }
  assert.equal(liquid.count, 0);
  assert.ok(seconds(steps) < 1.5, `it took ${seconds(steps).toFixed(2)}s`);
});

test('it comes from the two corners the brackets sit in, and goes back to them', () => {
  const width = 142;
  const height = 56;
  const liquid = pour(width, height, dice());
  // A tenth of a second in, all of it is within reach of the top right or the bottom left.
  for (let i = 0; i < 12; i++) liquid.step(true);
  assert.ok(liquid.count > 0);
  const toCorner = (i) => {
    const x = liquid.pos[2 * i] + liquid.ox;
    const y = liquid.pos[2 * i + 1] + liquid.oy;
    return Math.min(Math.hypot(x - width, y), Math.hypot(x, y - height));
  };
  for (let i = 0; i < liquid.count; i++) assert.ok(toCorner(i) < 70, `ink ${toCorner(i).toFixed(0)}px from either corner`);
  // Covered, then half drawn back: what is left is nearer the corners than the middle.
  fill(liquid);
  for (let i = 0; i < 60; i++) liquid.step(true);
  const all = liquid.count;
  while (liquid.count > all / 2) liquid.step(false);
  let sum = 0;
  for (let i = 0; i < liquid.count; i++) sum += toCorner(i);
  assert.ok(sum / liquid.count < 45, `what is left averages ${(sum / liquid.count).toFixed(0)}px from a corner`);
});

test('a button more than twice as wide is covered as fast, and as completely', () => {
  const liquid = pour(334, 56, dice());
  const steps = cover(liquid, 334, 56);
  assert.equal(covered(liquid, 334, 56), 1, 'it never covered the button');
  assert.ok(seconds(steps) < 1.5, `it took ${seconds(steps).toFixed(2)}s`);
});

test('a patch of another size takes over the liquid where it stands', () => {
  const first = pour(142, 56, dice());
  for (let i = 0; i < 60; i++) first.step(true);
  const next = pour(150, 56, dice());
  next.inherit(first);
  assert.equal(next.count, first.count);
  for (let i = 0; i < first.count; i++) {
    assert.ok(Math.abs(next.pos[2 * i] + next.ox - (first.pos[2 * i] + first.ox)) < 1e-3);
    assert.ok(Math.abs(next.pos[2 * i + 1] + next.oy - (first.pos[2 * i + 1] + first.oy)) < 1e-3);
  }
  // And carries on from there until the wider button is covered.
  cover(next, 150, 56);
  assert.equal(covered(next, 150, 56), 1);
});
