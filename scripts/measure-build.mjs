// What the built site in dist/ ships, by weight: every .js, .css and .html file, raw, gzipped
// (-9) and as brotli (quality 11), with totals, and the scripts and styles Astro inlines into
// the home page counted on their own, since code it inlines is in no .js file. This is how
// the README's stack decision was measured; run it before and after a change that adds
// script, styles or a dependency, and put both sets of numbers in the pull request.
//
//   npm run build && node scripts/measure-build.mjs [dist]
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';

const DIST = process.argv[2] || 'dist';
const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const size = (buf) => ({
  raw: buf.length,
  gzip: gzipSync(buf, { level: 9 }).length,
  brotli: brotliCompressSync(buf, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length,
});
const line = (s, label) => console.log(`${String(s.raw).padStart(8)} ${String(s.gzip).padStart(8)} ${String(s.brotli).padStart(8)}   ${label}`);

console.log('     raw     gzip   brotli');
const totals = {};
for (const file of walk(DIST).sort()) {
  const ext = extname(file);
  if (!['.js', '.css', '.html'].includes(ext)) continue;
  const s = size(readFileSync(file));
  line(s, relative(DIST, file));
  const t = (totals[ext] ??= { raw: 0, gzip: 0, brotli: 0, files: 0 });
  t.raw += s.raw; t.gzip += s.gzip; t.brotli += s.brotli; t.files++;
}
console.log('totals');
for (const [ext, t] of Object.entries(totals)) line(t, `${t.files} ${ext} file${t.files === 1 ? '' : 's'}`);

// Inline in the home page. The JSON-LD block is data, not script, and is left out.
const home = readFileSync(join(DIST, 'index.html'), 'utf8');
const inline = (re) => Buffer.from([...home.matchAll(re)].map((m) => m[1]).join('\n'));
line(size(inline(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g)), 'inline <script> in index.html');
line(size(inline(/<style[^>]*>([\s\S]*?)<\/style>/g)), 'inline <style> in index.html');
