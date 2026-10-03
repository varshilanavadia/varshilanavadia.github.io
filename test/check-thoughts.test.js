// scripts/check-thoughts.mjs, run as the checks run it, on made-up versions of the list.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'thoughts-'));
const base = [
  { text: 'First.', added: '2026-09-01' },
  { text: 'Second.', added: '2026-09-01' },
  { text: 'Third.', added: '2026-09-20' },
];
let n = 0;
const check = (after, ...flags) => {
  const b = join(dir, `before-${n}.json`), a = join(dir, `after-${n++}.json`);
  writeFileSync(b, JSON.stringify(base));
  writeFileSync(a, JSON.stringify(after));
  const r = spawnSync(process.execPath, ['scripts/check-thoughts.mjs', b, a, ...flags], { encoding: 'utf8' });
  return { ok: r.status === 0, out: r.stdout + r.stderr };
};

test('passes the list unchanged, and with thoughts added at the end', () => {
  assert.ok(check(base).ok);
  assert.ok(check([...base, { text: 'Fourth.', added: '2026-10-03' }, { text: 'Fifth.', added: '2026-10-03' }]).ok);
});

test('fails a deletion', () => {
  const r = check([base[0], base[2]]);
  assert.ok(!r.ok);
  assert.match(r.out, /removed/);
});

test('fails a reorder', () => {
  const r = check([base[1], base[0], base[2]]);
  assert.ok(!r.ok);
  assert.match(r.out, /reordered/);
});

test('fails a thought slipped in before the end', () => {
  assert.ok(!check([base[0], { text: 'Inserted.', added: '2026-09-01' }, base[1], base[2]]).ok);
});

test('fails a changed date, and a date before the one above it', () => {
  assert.match(check([base[0], { ...base[1], added: '2026-09-02' }, base[2]]).out, /never changes/);
  assert.match(check([...base, { text: 'Backdated.', added: '2026-09-10' }]).out, /before the entry above/);
});

test('fails any key but text and added, as an author would be', () => {
  const r = check([...base, { text: 'Fourth.', added: '2026-10-03', author: 'Someone' }]);
  assert.ok(!r.ok);
  assert.match(r.out, /"author"/);
});

test('fails a date that is not a real YYYY-MM-DD day, and an empty text', () => {
  assert.ok(!check([...base, { text: 'Fourth.', added: '10/3/2026' }]).ok);
  assert.ok(!check([...base, { text: 'Fourth.', added: '2026-02-30' }]).ok);
  assert.ok(!check([...base, { text: ' ', added: '2026-10-03' }]).ok);
});

test('a corrected text fails until approved, and is listed either way', () => {
  const corrected = [base[0], { ...base[1], text: 'Second, corrected.' }, base[2]];
  const unapproved = check(corrected);
  assert.ok(!unapproved.ok);
  assert.match(unapproved.out, /was: Second\.\n\s+now: Second, corrected\./);
  assert.match(unapproved.out, /thoughts-approved/);
  const approved = check(corrected, '--allow-edits');
  assert.ok(approved.ok);
  assert.match(approved.out, /was: Second\./);
});

test('approval covers corrections only, never a deletion or a reorder', () => {
  assert.ok(!check([base[0], base[2]], '--allow-edits').ok);
  assert.ok(!check([base[1], base[0], base[2]], '--allow-edits').ok);
});
