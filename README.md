# varshil-anavadia

Personal website. Currently a Coming Soon page: the hero and footer from the landing wireframe.

Built with [Astro](https://astro.build) as a static site, hosted on GitHub Pages at https://varshilanavadia.github.io.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview  # serve the build locally
```

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages through `.github/workflows/deploy.yml`.

## Layout

- `src/pages/index.astro` is the page, including the hero name marquee script.
- `src/styles/modernist.css` is the Modernist design system stylesheet, copied from Claude Design with its Google Fonts import removed, since fonts are self-hosted through Fontsource.
- `src/styles/site.css` holds the wireframe's tokens (type scale, spacing, leading, ink roles) and the page layout.
- `public/assets/`, `public/favicon.ico` and `public/site.webmanifest` are the icon set from Claude Design's Favicon Spec (VA monogram, #134B2E ink on #D3F0DE). Regenerate them from the drawings in Symbol.dc.html rather than editing them by hand.
- `design/` is a snapshot of the Claude Design project taken on 12 Sep 2026: the landing wireframe, the Type System, and project notes. Claude Design is still the source of truth for the design.
