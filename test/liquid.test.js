// The bracket button's liquid, src/scripts/liquid.ts: poured into a button and drained out of
// it here, with no browser, to hold it to what the button relies on. It fills in about a
// second and then covers the button with nothing showing through; nothing escapes the tank
// or blows up; it holds its level once full; it drains promptly; and a wider button fills
// as fast. Loaded as it is written; Node strips the types. Run with `npm test`.
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

test('a button fills in about a second, and is then covered completely', () => {
  const liquid = pour(142, 56, dice());
  const steps = fill(liquid);
  assert.ok(liquid.full, 'it never filled');
  assert.ok(seconds(steps) > 0.6 && seconds(steps) < 1.4, `it took ${seconds(steps).toFixed(2)}s`);
  assert.equal(covered(liquid, 142, 56), 1);
});

test('once full it stays full and stays put: no gap opens as it settles, and it stops taking more', () => {
  const liquid = pour(142, 56, dice());
  fill(liquid);
  for (let i = 0; i < 60; i++) liquid.step(true);
  const settled = liquid.count;
  for (let i = 0; i < 240; i++) {
    liquid.step(true);
    assert.equal(covered(liquid, 142, 56), 1, `a gap ${seconds(i).toFixed(2)}s after settling`);
  }
  // A wave may dip under the brim and let the taps top it up, but not by much.
  assert.ok(liquid.count - settled < settled * 0.05, `it took on ${liquid.count - settled} more`);
});

test('nothing leaves the tank, and nothing blows up', () => {
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
    // The tank reaches 6px past the button at the sides and foot, and 20px over its top,
    // rounded out to whole cells of 6px.
    assert.ok(x > -12 && x < width + 12 && y > -28 && y < height + 12, `a particle got out, to ${x.toFixed(1)}, ${y.toFixed(1)}`);
  }
});

test('let go, it drains to nothing within a second and a half', () => {
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

test('a button more than twice as wide fills as fast, and as completely', () => {
  const liquid = pour(334, 56, dice());
  const steps = fill(liquid);
  assert.ok(liquid.full, 'it never filled');
  assert.ok(seconds(steps) < 1.4, `it took ${seconds(steps).toFixed(2)}s`);
  assert.equal(covered(liquid, 334, 56), 1);
});

test('a tank of another size takes over the liquid where it stands', () => {
  const first = pour(142, 56, dice());
  for (let i = 0; i < 60; i++) first.step(true);
  const next = pour(150, 56, dice());
  next.inherit(first);
  assert.equal(next.count, first.count);
  for (let i = 0; i < first.count; i++) {
    assert.ok(Math.abs(next.pos[2 * i] + next.ox - (first.pos[2 * i] + first.ox)) < 1e-3);
    assert.ok(Math.abs(next.pos[2 * i + 1] + next.oy - (first.pos[2 * i + 1] + first.oy)) < 1e-3);
  }
  // And carries on from there to full.
  fill(next);
  assert.ok(next.full);
});
