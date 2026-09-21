# CLAUDE.md

Project instructions for Claude Code in this repository.

## Branches

- **Never work on `main`.** Every feature or fix starts on its own branch, cut from the latest `main` (`git fetch` first, so the branch starts from what is published).
- **Name the branch and its commits for the work**, plainly and in the repository's existing style: what the change does, not how it was made. For example `hero-motion`, `quote-of-the-day`, `fix-404-spacing`.
- **Finish through a pull request**, squashed into a single commit on `main`, with a message that describes the whole change. (GitHub calls them pull requests; a merge request is the same thing.) Open it with `gh pr create`. If the branch is checked out in a worktree, remove the worktree first: `--delete-branch` cannot delete a branch a worktree holds. Merge with `gh pr merge --squash --delete-branch`, then confirm both ends are gone, locally with `git branch` and on GitHub with `git ls-remote --heads origin`. Never enable auto-merge.
- **Merging into `main` publishes the site**, so it needs the same explicit go-ahead as a push.
- **Before merging, check the branch against the current `main`, not the `main` it was cut from.** Either merge `main` in and rebuild, or trial-merge when you only need to see the combined result: `git merge --no-commit --no-ff main`, rebuild, check, `git merge --abort`. A clean textual merge is not the check: two changes can merge without conflict and still interact on screen, which is what you are looking for.
- **When another session is already working in this repository, take a separate worktree** (`git worktree add ../varshil-anavadia-<branch> -b <branch>`), so each session has its own checkout. Each checkout has its own `dist/`, so both can serve at once on different ports: the main checkout keeps 4321, a worktree takes the next free one. Running two is how a branch is compared against what is published. What they must never share is a port.

## Publishing

- **Never push to `main` without the owner's explicit go-ahead.** Every push publishes to the live site through GitHub Pages. Show changes in the local preview first.
- **When a feature was built with options, don't pick one silently before shipping.** Ask which option is wanted.

## Local preview

- `npm run preview:local` is the way in: it builds with the dev panel and serves the result on port 4321, reachable on the LAN for phone testing. A second checkout serves on another port: `PUBLIC_DEV_PANEL=1 npx astro build && npx astro preview --host --port 4322`.
- The preview serves whatever the last build wrote to `dist/`. It does not rebuild on its own.
- The owner reviews changes there with the local dev panel ("Top Secret Tools"), which only exists in a build made with `PUBLIC_DEV_PANEL=1`.
- **After any production build (`npm run build`, e.g. to check what GitHub Pages will publish), always rebuild the panel version before finishing:** `PUBLIC_DEV_PANEL=1 npx astro build`. Never leave `dist/` holding a production build, or the panel disappears from the local preview.
- **Before sharing phone links, confirm the Mac's current network address** with `ipconfig getifaddr en0`. It changes.

## Checking work

- **Check visual changes at phone width (390px) and in all three theme states:** device default, forced light, forced dark. The dev panel's switch forces the last two. The device default is a separate code path, the `prefers-color-scheme` block, so a change to the `:root` set alone can reach it without showing up in either forced mode.
- **The pull request build is the gate** (`.github/workflows/check.yml`): it runs `npm run build` and fails if `dev-panel` appears anywhere in `dist/`. Do not merge a red one, and do not merge before it reports.
- **Before opening the pull request, run the same check locally:** `npm run build`, then `grep -r dev-panel dist/`, which should find nothing. Rebuild the panel version afterwards (see Local preview).
- **Every animation needs a still version under `prefers-reduced-motion`**, and should pause while it is off screen or the tab is hidden.

## Design

- **The design source of truth is the Personal Portfolio Design System in Claude Design** (project id `d708aeee-8a4f-4afd-9a63-76771f71ba00`, a copy of Modernist), with the Type System and wireframes snapshotted in `design/`. `src/styles/design-system.css` is its stylesheet. Prototype new visual ideas locally, then record the result in Claude Design.
- **A visual decision is not finished until Claude Design has it.** List what a pull request changes or reveals under a "To record in Claude Design" heading in its body, and move anything still outstanding after the merge into `design/OUTSTANDING.md`, so it does not leave with the branch.
- **The paper cutout behind the portrait is `#fff` in both modes.** It is the one surface on the page that does not follow the theme, so anything drawn on it has to be legible against white rather than against the page. Check the contrast against `#fff`. The semantic `--color-accent` is not safe here: in the dark it resolves to `accent-400`, which is 1.9:1 on white. Read a ramp step instead, which stays put across modes (`accent-700` is 5.2:1).

## Data and privacy

- **The repository is public.** Never commit private data. Quote authors stay out of `src/data/quotes.json`.
- **Quotes:** the owner's working copy is a private Google Sheet (`1jZk5j9XmP78ocRAIVSQ_E-NNuaLacfFJR3vmlcK8BO4`). New quotes are appended to the end of `src/data/quotes.json` with the date they are added. Once a quote is in the file its date never changes, and quotes are never reordered or deleted, or the rotation changes for past and current days. The first import is the exception and stays as it is: all 38 carry `2026-09-01`, chosen so the whole set was eligible on the day it landed rather than sitting inert until the next midnight.

## Assets and tools

- **After replacing `public/hero-portrait.webp`, run `python3 scripts/make-paper.py`** to rebuild the paper cutout behind it.
- **Local-only tools go in the dev panel** (`src/components/DevPanel.astro`), with inline scripts and styles so they never reach the published build.
