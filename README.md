# varshil-anavadia

Personal website. Currently a Coming Soon page: the hero, a statement, and a footer carrying the thought of the day.

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

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages through `.github/workflows/deploy.yml`. Every pull request into `main` is built by `.github/workflows/check.yml`, with the same install and build, and fails if anything from the dev panel reached the build. Both pin their actions to commits rather than tags.

Dependabot (`.github/dependabot.yml`) opens a weekly pull request for newer npm packages and another for newer actions, skipping releases less than a week old. They go through the check like any other change, though the check doesn't run the two Pages actions: a bad bump of either fails only when publishing after the merge, and the site already live stays up.

## Layout

- `src/layouts/Base.astro` is the frame every page shares: head basics and icons, the Google Analytics tag, the bar of profile links, and the footer's copyright line. The profile links themselves live in `src/site.ts`. The analytics tag runs only on the published address, so `npm run dev` and the local previews are never counted.
- `src/pages/index.astro` is the home page: the hero name marquee, the portrait's depth effect (the pointer where there is one, the phone's tilt otherwise), and the thought of the day, which is picked in the browser from the visitor's local date out of `src/data/thoughts.json`.
- `src/components/HeroGradient.astro` is the moving gradient behind the home page's hero and its bar of links: shadergradient.co's Universe preset, ported to plain WebGL rather than loaded as the React package, in the colours set by `--hero-gradient-1` to `3` in `site.css`, and fading out into the page from `--hero-fade` percent of the way down the figure. It also runs the bar on scroll: clear at the top, sliding away as the page scrolls down and back as glass when it scrolls up, a bar on a computer and a floating capsule on a phone or tablet (`--glass-*` in `site.css`, which the tilt hint's pill shares), made solid for anyone who has turned on Reduce Transparency, Increase Contrast or a high-contrast theme. The hero arrives on a wash of the gradient's own colours, and the moving gradient fades in over it.
- `src/components/ContourMap.astro` is the drifting contour map, used full strength behind the 404's band and fainter behind the home page's statement.
- `src/pages/404.astro` is the not-found page. GitHub Pages serves it, with a 404 status, for any address that has no file. It is kept out of search results and the sitemap.
- `src/styles/design-system.css` is the stylesheet of the Personal Portfolio Design System, the owner's design system in Claude Design (a copy of Modernist), with its Google Fonts import removed, since fonts are self-hosted through Fontsource.
- `src/styles/site.css` holds the wireframe's tokens (type scale, spacing, leading, ink roles) and the page layout. Dark mode follows the device setting: one block swaps the base colour tokens to the deep green `#0E2E1D` ground and the Type System's inverted inks.
- `public/hero-paper.webp` is the paper behind the portrait: the figure's outline grown outward, as a lossless WebP mask that the home page preloads. It is generated from the portrait, so after replacing `public/hero-portrait.webp` run `python3 scripts/make-paper.py` (needs Pillow and NumPy).
- `public/assets/`, `public/favicon.ico` and `public/site.webmanifest` are the icon set from Claude Design's Favicon Spec (VA monogram, #134B2E ink on #D3F0DE). Regenerate them from the drawings in Symbol.dc.html rather than editing them by hand.
