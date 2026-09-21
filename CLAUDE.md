# CLAUDE.md

Project instructions for Claude Code in this repository.

## Branches

- **Never work on `main`.** Every feature or fix starts on its own branch, cut from the latest `main` (`git fetch` first, so the branch starts from what is published).
- **Name the branch and its commits for the work**, plainly and in the repository's existing style: what the change does, not how it was made. For example `hero-motion`, `quote-of-the-day`, `fix-404-spacing`.
- **Finish through a pull request**, squashed into a single commit on `main`, with a message that describes the whole change. (GitHub calls them pull requests; a merge request is the same thing.) Open it with `gh pr create`, merge it with `gh pr merge --squash --delete-branch`, and delete the local branch too. Never enable auto-merge.
- **Merging into `main` publishes the site**, so it needs the same explicit go-ahead as a push.
- **Bring the branch up to date with `main` before merging**, then rebuild and re-check it.
- **When another session is already working in this repository, take a separate worktree** (`git worktree add ../varshil-anavadia-<branch> -b <branch>`), so each session has its own checkout. The local preview serves whichever build ran last, so only one session drives it at a time.

## Publishing

- **Never push to `main` without the owner's explicit go-ahead.** Every push publishes to the live site through GitHub Pages. Show changes in the local preview first.
- **When a feature was built with options, don't pick one silently before shipping.** Ask which option is wanted.

## Local preview

- `npm run preview:local` is the way in: it builds with the dev panel and serves the result on port 4321, reachable on the LAN for phone testing.
- The preview serves whatever the last build wrote to `dist/`. It does not rebuild on its own.
- The owner reviews changes there with the local dev panel ("Top Secret Tools"), which only exists in a build made with `PUBLIC_DEV_PANEL=1`.
- **After any production build (`npm run build`, e.g. to check what GitHub Pages will publish), always rebuild the panel version before finishing:** `PUBLIC_DEV_PANEL=1 npx astro build`. Never leave `dist/` holding a production build, or the panel disappears from the local preview.
- **Before sharing phone links, confirm the Mac's current network address** with `ipconfig getifaddr en0`. It changes.

## Checking work

- **Check visual changes at phone width (390px) and in both light and dark mode** before calling them done. The dev panel's theme switch forces either mode.
- **Whenever the dev panel changes, confirm the production build contains nothing from it:** no `dev-panel` anywhere in `dist/` after `npm run build`.
- **Every animation needs a still version under `prefers-reduced-motion`**, and should pause while it is off screen or the tab is hidden.

## Design

- **The design source of truth is the Personal Portfolio Design System in Claude Design** (project id `d708aeee-8a4f-4afd-9a63-76771f71ba00`, a copy of Modernist), with the Type System and wireframes snapshotted in `design/`. `src/styles/design-system.css` is its stylesheet. Prototype new visual ideas locally, then record the result in Claude Design.

## Data and privacy

- **The repository is public.** Never commit private data. Quote authors stay out of `src/data/quotes.json`.
- **Quotes:** the owner's working copy is a private Google Sheet (`1jZk5j9XmP78ocRAIVSQ_E-NNuaLacfFJR3vmlcK8BO4`). New quotes are appended to the end of `src/data/quotes.json` with the date they are added, and are never backdated, reordered or deleted, or the rotation changes for past and current days.

## Assets and tools

- **After replacing `public/hero-portrait.webp`, run `python3 scripts/make-paper.py`** to rebuild the paper cutout behind it.
- **Local-only tools go in the dev panel** (`src/components/DevPanel.astro`), with inline scripts and styles so they never reach the published build.
