// Holds the built site in dist/ to what may be published. Both workflows run it after the
// build: the pull request's check, and the deploy, before anything is uploaded, so a push
// straight to main is held to it too.
//
//   npm run build && node scripts/check-build.mjs
//
// Fails, saying why, if:
//   - anything mentions dev-panel: the local dev panel (src/components/DevPanel.astro, whose
//     class is that name) renders only in a build made with PUBLIC_DEV_PANEL=1, and its script
//     and styles are inline, so a published build must not carry the word anywhere;
//   - the pages are not exactly / and /404: a third means a prototype escaped into src/pages,
//     and the repository is public, so it would publish. Update the list when a real page is
//     added;
//   - the analytics tag is missing from the home page, or no longer runs only on the site's
//     own address (astro.config.mjs's site, as the sitemap gives it);
//   - anything carries an email address or a mailto: link. The site shows none: the Contact
//     form posts to Formspree by the form's id (src/site.ts), and the owner's address is in
//     Formspree's settings only.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const PAGES = ['404.html', 'index.html'];
const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const files = walk(DIST);
const problems = [];

const panel = files.filter((f) => readFileSync(f, 'latin1').includes('dev-panel'));
if (panel.length) problems.push(`the dev panel reached the build, in ${panel.map((f) => relative(DIST, f)).join(', ')}`);

const pages = files.filter((f) => f.endsWith('.html')).map((f) => relative(DIST, f)).sort();
if (pages.join() !== PAGES.join()) problems.push(`the pages changed: expected ${PAGES.join(', ')}, found ${pages.join(', ')}`);

const home = readFileSync(join(DIST, 'index.html'), 'utf8');
const site = readFileSync(join(DIST, 'sitemap-index.xml'), 'utf8').match(/<loc>(https?:\/\/[^<]+)<\/loc>/)?.[1];
const host = site && new URL(site).hostname;
if (!home.includes('googletagmanager.com/gtag/js')) problems.push('the analytics tag is missing from the home page');
else if (!host || !home.includes(`"${host}"`) || !home.includes('location.hostname === HOST')) {
  problems.push(`the analytics tag no longer runs only on the site's own address (${host ?? 'not found in the sitemap'})`);
}

// Text files only: the bytes of a font or an image can spell anything.
const TEXT = /\.(html|js|css|xml|txt|json|webmanifest|svg)$/;
const ADDRESS = /mailto:|[\w.%+-]+@[\w-]+(\.[\w-]+)*\.[a-z]{2,}/i;
const addressed = files.filter((f) => TEXT.test(f) && ADDRESS.test(readFileSync(f, 'utf8')));
if (addressed.length) problems.push(`an email address reached the build, in ${addressed.map((f) => relative(DIST, f)).join(', ')}`);

if (problems.length) {
  console.error(`The build is not fit to publish:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`The build holds: no dev panel, pages ${PAGES.join(' and ')}, analytics on ${host} only, no email address.`);
