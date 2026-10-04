// The site's spring, src/scripts/spring.ts: what Base.astro hands every page as --spring and
// --spring-time. Loaded here as it is written; Node strips the types. Run with `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spring } from '../src/scripts/spring.ts';

const samples = (easing) => easing.slice('linear('.length, -1).split(', ').map(Number);

test('gives exactly the spring the bar moved on before it was shared', () => {
  // What the function returned inside HeroGradient.astro, where the browser worked it out.
  const { easing, time } = spring();
  assert.equal(time.toFixed(2), '0.56');
  assert.equal(
    easing,
    'linear(0, 0.0102, 0.0374, 0.0771, 0.1254, 0.1795, 0.2368, 0.2956, 0.3543, 0.4118, 0.4672, 0.52, 0.5697, 0.6161, 0.6591, 0.6986, 0.7347, 0.7674, 0.797, 0.8236, 0.8473, 0.8685, 0.8872, 0.9037, 0.9182, 0.9309, 0.9419, 0.9515, 0.9598, 0.9669, 0.9729, 0.9781, 0.9825, 0.9862, 0.9892, 0.9918, 0.9939, 0.9957, 0.9971, 0.9982, 0.9991, 0.9998, 1.0004, 1.0008, 1.0011, 1.0013, 1.0014, 1.0015, 1.0015, 1.0015, 1.0015, 1.0014, 1.0013, 1.0013, 1.0012, 1.0011, 1)',
  );
});

test('starts at rest, ends exactly on its target, and is sampled every 10ms', () => {
  for (const [visual, bounce] of [[0.35, 0.1], [0.2, 0], [0.6, 0.3], [1, 0.5]]) {
    const { easing, time } = spring(visual, bounce);
    const points = samples(easing);
    assert.equal(points[0], 0);
    assert.equal(points.at(-1), 1);
    assert.equal(points.length, Math.round(time / 0.01) + 1, `${visual}, ${bounce}`);
    assert.ok(points.every(Number.isFinite));
  }
});

test('the bounce is too small to see: the default never passes its target by half a percent', () => {
  assert.ok(Math.max(...samples(spring().easing)) < 1.005);
});

test('with no bounce it never passes its target at all', () => {
  assert.ok(Math.max(...samples(spring(0.35, 0).easing)) <= 1);
});
