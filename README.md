# varshil-anavadia

Personal website. Currently a Coming Soon page: the hero and footer from the landing wireframe.

Built with [Astro](https://astro.build) as a static site, hosted on GitHub Pages at https://varshilanavadia.github.io.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview  # serve the build locally
npm run preview:local  # build with the local dev panel and serve it on your network
```

The local dev panel, "Top Secret Tools", is a strip docked along the top of the window, closed by default (tap its label, or press the backtick key). It shortens the page rather than covering it, and holds controls for checking the site: a Light / Dark / Device theme switch, the panel's own placement (top or foot), and a day stepper that previews any day's quote of the day. It appears in `npm run dev` and `npm run preview:local` only; the GitHub Pages build never includes it. Add controls in `src/components/DevPanel.astro`.

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages through `.github/workflows/deploy.yml`.

## Layout

- `src/layouts/Base.astro` is the frame every page shares: head basics and icons, the bar of profile links, and the footer's copyright line. The profile links themselves live in `src/site.ts`.
- `src/pages/index.astro` is the home page, including the hero name marquee script.
- `src/pages/404.astro` is the not-found page. GitHub Pages serves it, with a 404 status, for any address that has no file. It is kept out of search results and the sitemap.
- `src/styles/design-system.css` is the stylesheet of the Personal Portfolio Design System, the owner's design system in Claude Design (a copy of Modernist), with its Google Fonts import removed, since fonts are self-hosted through Fontsource.
- `src/styles/site.css` holds the wireframe's tokens (type scale, spacing, leading, ink roles) and the page layout. Dark mode follows the device setting: one block swaps the base colour tokens to the deep green `#0E2E1D` ground and the Type System's inverted inks.
- `public/hero-paper.png` is the paper behind the portrait: the figure's outline grown outward. It is generated from the portrait, so after replacing `public/hero-portrait.webp` run `python3 scripts/make-paper.py` (needs Pillow and NumPy).
- `public/assets/`, `public/favicon.ico` and `public/site.webmanifest` are the icon set from Claude Design's Favicon Spec (VA monogram, #134B2E ink on #D3F0DE). Regenerate them from the drawings in Symbol.dc.html rather than editing them by hand.
- `design/` is a snapshot of the Claude Design project taken on 12 Sep 2026: the landing wireframe, the Type System, and project notes. Claude Design is still the source of truth for the design.
