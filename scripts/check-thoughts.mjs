// Holds src/data/thoughts.json to what the thought of the day needs (src/scripts/pick-thought.js
// works the rotation out from the whole list, so changing its past reshuffles days already
// shown, and today's): compares a new version of the file with the one it replaces.
//
//   node scripts/check-thoughts.mjs <before.json> <after.json> [--allow-edits]
//
// Fails, saying why, if the new version:
//   - has an entry with any key but "text" and "added" (who said a thought stays out: the
//     repository is public), an empty text, or a date that is not a real day as YYYY-MM-DD;
//   - is shorter, or has any earlier entry moved, removed or redated: new thoughts go only at
//     the end, with the date they are added, never before the last one;
//   - corrects the text of an earlier thought, unless --allow-edits is given. A correction
//     reshuffles nothing, but it is the owner's to approve: the pull request's check passes
//     --allow-edits only once the owner has labelled the pull request thoughts-approved, and
//     it lists each correction either way. Publishing passes it, the approval having been
//     given on the pull request.
import { readFileSync } from 'node:fs';

const [beforePath, afterPath, flag] = process.argv.slice(2);
if (!beforePath || !afterPath) {
  console.error('usage: node scripts/check-thoughts.mjs <before.json> <after.json> [--allow-edits]');
  process.exit(2);
}
const allowEdits = flag === '--allow-edits';
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const before = read(beforePath);
const after = read(afterPath);

const problems = [];
const isDay = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && new Date(`${s}T00:00:00Z`).toISOString().slice(0, 10) === s;
after.forEach((t, i) => {
  const n = i + 1;
  const keys = Object.keys(t ?? {});
  const extra = keys.filter((k) => k !== 'text' && k !== 'added');
  if (extra.length) problems.push(`entry ${n} has ${extra.map((k) => `"${k}"`).join(', ')}: only "text" and "added" may be stored, and who said a thought stays out of this public file`);
  if (typeof t?.text !== 'string' || !t.text.trim()) problems.push(`entry ${n} has no text`);
  if (!isDay(t?.added)) problems.push(`entry ${n}'s date "${t?.added}" is not a real day written YYYY-MM-DD`);
  if (i > 0 && isDay(t?.added) && isDay(after[i - 1]?.added) && t.added < after[i - 1].added) problems.push(`entry ${n} is dated ${t.added}, before the entry above it (${after[i - 1].added}): new thoughts go at the end with the date they are added`);
});

if (after.length < before.length) problems.push(`${before.length - after.length} entr${before.length - after.length === 1 ? 'y was' : 'ies were'} removed: earlier thoughts are never deleted`);
const edits = [];
before.forEach((was, i) => {
  const now = after[i];
  if (!now) return;
  if (now.added !== was.added) problems.push(`entry ${i + 1} was dated ${was.added} and is now ${now.added}: an earlier date never changes`);
  if (now.text !== was.text) {
    // A text that now stands elsewhere in the list means entries moved, not a correction.
    if (before.some((b) => b.text === now.text)) problems.push(`entry ${i + 1} now holds what was another entry: earlier thoughts are never reordered`);
    else edits.push(`entry ${i + 1}:\n    was: ${was.text}\n    now: ${now.text}`);
  }
});

if (edits.length) {
  console.log(`Corrections to ${edits.length} earlier thought${edits.length === 1 ? '' : 's'}:\n  ${edits.join('\n  ')}`);
  if (!allowEdits) problems.push(`the correction${edits.length === 1 ? ' above is' : 's above are'} not approved: once the owner has read ${edits.length === 1 ? 'it' : 'them'}, they label the pull request thoughts-approved`);
}
const added = after.length - before.length;
if (problems.length) {
  console.error(`thoughts.json does not hold to its rules:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`thoughts.json: ${after.length} thoughts, ${added > 0 ? `${added} added at the end` : 'none added'}${edits.length ? `, ${edits.length} approved correction${edits.length === 1 ? '' : 's'}` : ''}. Holds to its rules.`);
