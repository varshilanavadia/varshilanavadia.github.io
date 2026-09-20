# CLAUDE.md

Project instructions for Claude Code in this repository.

## Publishing

- **Never push to `main` without the owner's explicit go-ahead.** Every push publishes to the live site through GitHub Pages. Show changes in the local preview first.
- **When a feature was built with options, don't pick one silently before shipping.** Ask which option is wanted.

## Local preview

- The local preview (`astro preview` on port 4321, also reachable on the LAN for phone testing) serves whatever the last build wrote to `dist/`. It does not rebuild on its own.
- The owner reviews changes there with the local dev panel ("Top Secret Tools"), which only exists in a build made with `PUBLIC_DEV_PANEL=1`.
- **After any production build (`npm run build`, e.g. to check what GitHub Pages will publish), always rebuild the panel version before finishing:** `PUBLIC_DEV_PANEL=1 npx astro build`. Never leave `dist/` holding a production build, or the panel disappears from the local preview.
- **Before sharing phone links, confirm the Mac's current network address** with `ipconfig getifaddr en0`. It changes.

## Checking work

- **Check visual changes at phone width (390px) and in both light and dark mode** before calling them done. The dev panel's theme switch forces either mode.
- **Whenever the dev panel changes, confirm the production build contains nothing from it:** no `dev-panel` anywhere in `dist/` after `npm run build`.

## Data and privacy

- **The repository is public.** Never commit private data. Quote authors stay out of `src/data/quotes.json`.
- **Quotes:** the owner's working copy is a private Google Sheet (`1jZk5j9XmP78ocRAIVSQ_E-NNuaLacfFJR3vmlcK8BO4`). New quotes are appended to the end of `src/data/quotes.json` with the date they are added, and are never backdated, reordered or deleted, or the rotation changes for past and current days.

## Assets and tools

- **After replacing `public/hero-portrait.webp`, run `python3 scripts/make-paper.py`** to rebuild the paper cutout behind it.
- **Local-only tools go in the dev panel** (`src/components/DevPanel.astro`), with inline scripts and styles so they never reach the published build.
