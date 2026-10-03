// The thought-of-the-day picker, src/scripts/pick-thought.js: the file the home page inlines,
// loaded here as it ships. Run with `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const pickThought = vm.runInNewContext(`${readFileSync('src/scripts/pick-thought.js', 'utf8')}\n;pickThought`);
const EPOCH = Date.UTC(2026, 0, 1);
const dayNumber = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return Math.floor((Date.UTC(y, m - 1, d) - EPOCH) / 86400000);
};
const thoughts = JSON.parse(readFileSync('src/data/thoughts.json', 'utf8'));
const THOUGHTS = thoughts.map((t) => [t.text, dayNumber(t.added)]);
const FIRST = Math.min(...THOUGHTS.map(([, added]) => added)) + 1;
const YEARS = 3 * 366;

test('picks exactly the schedule the page picked before the picker moved', () => {
  const fixture = JSON.parse(readFileSync('test/fixtures/thought-schedule.json', 'utf8'));
  const inputs = fixture.inputs.map(([i, d]) => [String(i), d]);
  for (const [day, want] of fixture.days) {
    const got = pickThought(inputs, day);
    assert.equal(got === null ? null : Number(got[0]), want, `day ${day}`);
  }
});

test('the same day always gives the same thought', () => {
  for (let d = FIRST; d < FIRST + 400; d++) assert.deepEqual(pickThought(THOUGHTS, d), pickThought(THOUGHTS, d));
});

test('nothing before the first eligible day, and nothing from an empty list', () => {
  assert.equal(pickThought(THOUGHTS, FIRST - 1), null);
  assert.equal(pickThought([], FIRST + 10), null);
});

test('each round shows every thought in its pool exactly once', () => {
  let start = FIRST;
  while (start < FIRST + YEARS) {
    const pool = THOUGHTS.filter(([, added]) => added < start);
    const shown = [];
    for (let d = start; d < start + pool.length; d++) shown.push(pickThought(THOUGHTS, d));
    assert.deepEqual(new Set(shown), new Set(pool), `round starting on day ${start}`);
    assert.equal(shown.length, new Set(shown).size, `a repeat within the round starting on day ${start}`);
    start += pool.length;
  }
});

test('no thought shows two days running, across round boundaries too', () => {
  for (let d = FIRST + 1; d < FIRST + YEARS; d++) {
    assert.notEqual(pickThought(THOUGHTS, d)[0], pickThought(THOUGHTS, d - 1)[0], `days ${d - 1} and ${d}`);
  }
});

test('a thought never shows on or before the day it was added', () => {
  for (let d = FIRST; d < FIRST + YEARS; d++) assert.ok(pickThought(THOUGHTS, d)[1] < d, `day ${d}`);
});

test('appending a thought changes no day up to the day it is added', () => {
  for (const offset of [0, 7, 40, 200]) {
    const added = FIRST + offset;
    const longer = [...THOUGHTS, ['A new thought', added]];
    for (let d = FIRST; d <= added; d++) assert.deepEqual(pickThought(longer, d), pickThought(THOUGHTS, d), `added on day ${added}, day ${d}`);
  }
});
