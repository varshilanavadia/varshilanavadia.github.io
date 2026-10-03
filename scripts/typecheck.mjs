// Type-checks the site with Astro's checker (@astrojs/check, on TypeScript 6): the .astro
// files, their frontmatter and the scripts Astro bundles, and src/site.ts. Scripts marked
// is:inline and the plain .js and .mjs files are not type-checked. Both workflows run it.
//
//   npm run typecheck
//
// Fails, saying why, if:
//   - the checker finds an error. Warnings and hints are listed, but pass;
//   - the checker did not run. When it can't load its packages, as on TypeScript 7, which it
//     does not support yet, `astro check` says so and exits 0, as if it had passed. So a run
//     counts only if it ends with the checker's own "Result (N files)", N above 0.
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

// stdin closed, so if astro ever offers to install a missing package, it can't wait for a yes.
const run = spawnSync(join('node_modules', '.bin', 'astro'), ['check', '--minimumFailingSeverity', 'error'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});
process.stdout.write(run.stdout ?? '');
process.stderr.write(run.stderr ?? '');

const files = Number(`${run.stdout}${run.stderr}`.match(/Result \((\d+) files?\)/)?.[1] ?? 0);
if (run.error || run.status !== 0) {
  console.error(`The type check failed${run.error ? `: ${run.error.message}` : ''}.`);
  process.exit(1);
}
if (!files) {
  console.error('The type check did not run: the checker gave no result, so nothing was checked. Is @astrojs/check installed, on a TypeScript it supports?');
  process.exit(1);
}
console.log(`The type check ran over ${files} files: no errors.`);
