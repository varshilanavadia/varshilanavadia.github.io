# varshil-anavadia

Personal website, one page: the hero, About, Work, and a footer carrying the thought of the day. Movement and Contact are still to come; a section appears on the page and in the bar only once it is built.

Built with [Astro](https://astro.build) as a static site, hosted on GitHub Pages at https://varshilanavadia.github.io.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview  # serve the build locally
npm run preview:local  # build with the local dev panel and serve it on your network
```

The local dev panel, "Top Secret Tools", is a strip docked along the top of the window, closed by default (tap its label, or press the backtick key). It shortens the page rather than covering it, and holds controls for checking the site: a Light / Dark / Device theme switch, and a day stepper that previews any day's thought of the day. It appears in `npm run dev` and `npm run preview:local` only; the GitHub Pages build never includes it. Add controls in `src/components/DevPanel.astro`.

## Stack

The site is framework-free, by decision (3 Oct 2026): Astro components, CSS, and small scripts of its own. No React, no Tailwind, no animation library. Work on later sections follows this, or measures again before changing it.

- **CSS first.** Motion is CSS wherever CSS can do it: an animation tied to the scroll position (`animation-timeline`), a transition on the site's one spring, a `<details>` for anything that opens. A script is written only for what CSS cannot do (the bar's menu and its section marks), in the file that needs it.
- **One spring.** `src/scripts/spring.ts` works out a damped spring as a CSS `linear()` easing while the site builds, and `Base.astro` hands it to every page as `--spring` and `--spring-time`. Anything that moves, moves on it.
- **References are read, not installed.** motion.dev, kokonutui and bklit are sources of interaction ideas. An idea is rebuilt in the site's own markup and tokens, and credited in a comment, as `HeroGradient.astro` credits shadergradient. Their code would bring their look with it (Tailwind's base layer, shadcn's tokens and rounded cards), and the site has its own.
- **Charts are drawn at build time.** The Movement section's charts are to be inline SVG that Astro writes from the data while building, so the figures are in the HTML for a visitor without JavaScript and for a crawler, with CSS and a small script for hover. A bklit chart, tried as it installs, puts nothing in the page until React has loaded and run.
- **Every motion has a still version** under `prefers-reduced-motion`, and every section reads in full without JavaScript.

What the decision was measured against: each row is a real build of this site, weighed by `scripts/measure-build.mjs` (gzip, in thousands of bytes; JS counts the scripts Astro inlines into the home page). The alternatives were built in scratch copies and are not in the repository.

| Build | JS | CSS |
| --- | --- | --- |
| Before: the Coming Soon page | 12.7 | 6.0 |
| After: About, Work and the bar's navigation, framework-free | 13.4 (+0.7) | 8.1 (+2.1) |
| The `motion` package for the same kinds of motion (`animate`, `scroll`, `inView`, `stagger`, `spring`) | +21.4 | 0 |
| The same through `motion/mini`, where it can stand in | +8.4 | 0 |
| One React island that does nothing (`@astrojs/react`) | +70.8 | 0 |
| A kokonutui component as it installs (React, Tailwind 4, shadcn, Motion) | +121.9 | +5.8 |
| A bklit line chart as it installs (the same, with visx and d3) | +164.1 | +6.2 |

What each would add to keep up: `motion` is one dependency (four packages) and its API. A React island is three packages, a JSX setup in `tsconfig.json`, and a second way of writing components. kokonutui and bklit come through the shadcn CLI: about 330 to 370 more packages, a `components.json`, a Tailwind stylesheet of shadcn tokens whose names collide with the design system's (`--color-accent`, `--radius-*`), dark mode by a `.dark` class the site does not use, and the components' source copied into `src/` (65 files for one bklit chart), to be restyled out of their rounded look and kept in step by hand. Framework-free adds only the code in this repository, which nothing but Astro can break.

If a later interaction needs what CSS and a short script cannot do well (a gesture-driven spring, a layout animation), add `motion` for that one thing, import only the functions used, and measure before and after.

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages through `.github/workflows/deploy.yml`. Every pull request into `main` is built by `.github/workflows/check.yml`, with the same install and build. Both run the same gates, and publish nothing if one fails:

- `npm test`: the tests in `test/`, on Node's built-in runner. They pin the thought of the day's rotation (`src/scripts/pick-thought.js`, which the home page inlines) to the schedule it has always picked, and check its promises: every thought once per round, never two days running, and nothing already shown changes when a thought is added. They also pin the site's spring (`src/scripts/spring.ts`) to the curve the bar has always moved on.
- `npm run typecheck` (`scripts/typecheck.mjs`): Astro's checker, `@astrojs/check` on TypeScript 6, over the `.astro` files, the scripts Astro bundles and `src/site.ts`. It fails on errors only; warnings and hints are listed. Scripts marked `is:inline` and the plain `.js` and `.mjs` files are not type-checked. It also fails if the checker didn't run, which `astro check` alone reports as a pass. TypeScript stays at 6 until the checker supports 7, and Dependabot is told not to propose 7.
- `scripts/check-build.mjs`: the build is fit to publish. No dev panel in it, only `/` and `/404`, and the analytics tag running on the site's own address only.
- `scripts/check-thoughts.mjs`: `src/data/thoughts.json` against the version it replaces. Thoughts are only added at the end, with only `text` and a real `added` date; nothing is deleted, moved or redated. A correction to an earlier thought's text fails the pull request's check until the owner labels it `thoughts-approved`.

The Node version is `.nvmrc`'s, and both workflows pin their actions to commits rather than tags.

Dependabot (`.github/dependabot.yml`) opens a weekly pull request for newer npm packages and another for newer actions, skipping releases less than a week old. They go through the check like any other change, though the check doesn't run the two Pages actions: a bad bump of either fails only when publishing after the merge, and the site already live stays up.

## Layout

- `src/layouts/Base.astro` is the frame every page shares: head basics and icons, the Google Analytics tag, the bar, and the footer's copyright line. The analytics tag runs only on the published address, so `npm run dev` and the local previews are never counted.
- The bar holds the home page's section links on the left and the profile links on the right, both listed in `src/site.ts`. To add a section to the bar, add it to `sections` there with the `id` of its `<section>`. The link of the section being read is marked (`aria-current="location"`, a 2px rule under the word), and a link stops its section just below the bar. Where the links do not fit on one line, on a phone or with larger text, the bar shows a Menu button and the links open as a panel: `Base.astro` measures whether they fit rather than switching at a set width, so the bar needs no change when a link is added. Without JavaScript the links wrap onto more lines.
- `src/pages/index.astro` is the home page: the hero name marquee, the portrait's depth effect (the pointer where there is one, the phone's tilt otherwise), the sections, and the thought of the day, which is picked in the browser from the visitor's local date out of `src/data/thoughts.json`. Its description, for search results and shared links, is drawn from the About text.
- `src/components/About.astro` is the About section: the owner's own words, and where he is based, beside a contour map with its marker on Austin. The opening sentence inks in as it is scrolled past, a CSS scroll-driven animation with no script; where a browser has none (Firefox today), under reduced motion and under Increase Contrast, it is simply in full ink.
- `src/components/Work.astro` is the Work section: roles, education and skills from `src/data/work.ts`. Each role is a `<details>` row that opens on the site's spring to show what was done there and the tools used.
- `src/components/HeroGradient.astro` is the moving gradient behind the home page's hero and its bar: shadergradient.co's Universe preset, ported to plain WebGL rather than loaded as the React package, in the colours set by `--hero-gradient-1` to `3` in `site.css`, and fading out into the page from `--hero-fade` percent of the way down the figure. It also runs the bar on scroll: clear at the top, sliding away as the page scrolls down and back as glass when it scrolls up, a bar on a computer and a floating capsule on a phone or tablet (`--glass-*` in `site.css`, which the tilt hint's pill shares), made solid for anyone who has turned on Reduce Transparency, Increase Contrast or a high-contrast theme. The hero arrives on a wash of the gradient's own colours, and the moving gradient fades in over it.
- `src/components/ContourMap.astro` is the drifting contour map, behind the 404's band and, as a map of where the owner is based, in the About section.
- `src/pages/404.astro` is the not-found page. GitHub Pages serves it, with a 404 status, for any address that has no file. It is kept out of search results and the sitemap.
- `src/styles/design-system.css` is the stylesheet of the Personal Portfolio Design System, the owner's design system in Claude Design (a copy of Modernist), with its Google Fonts import removed, since fonts are self-hosted through Fontsource.
- `src/styles/site.css` holds the wireframe's tokens (type scale, spacing, ink roles), the bar, the frame every section shares (`.section`, with the leading set) and the hero's layout; a section's own styles are in its component. Dark mode follows the device setting: one block swaps the base colour tokens to the deep green `#0E2E1D` ground and the Type System's inverted inks.
- `public/hero-paper.webp` is the paper behind the portrait: the figure's outline grown outward, as a lossless WebP mask that the home page preloads. It is generated from the portrait, so after replacing `public/hero-portrait.webp` run `python3 scripts/make-paper.py` (needs Pillow and NumPy).
- `public/assets/`, `public/favicon.ico` and `public/site.webmanifest` are the icon set from Claude Design's Favicon Spec (VA monogram, #134B2E ink on #D3F0DE). Regenerate them from the drawings in Symbol.dc.html rather than editing them by hand.
