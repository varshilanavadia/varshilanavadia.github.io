# CLAUDE.md

Project instructions for Claude Code in this repository.

## Branches

- **Never work on `main`.** Every feature or fix starts on its own branch, cut from the latest `main` (`git fetch` first, so the branch starts from what is published).
- **Name the branch and its commits for the work**, plainly and in the repository's existing style: what the change does, not how it was made. For example `hero-motion`, `quote-of-the-day`, `fix-404-spacing`.
- **Finish through a pull request**, squashed into a single commit on `main`, with a message that describes the whole change. Open it with `gh pr create`. (GitHub calls them pull requests; a merge request is the same thing.)
- **Remove the worktree first if the branch is checked out in one.** `--delete-branch` cannot delete a branch a worktree holds, and when that fails it leaves the remote branch behind as well, so neither end is cleaned up.
- **Merge with `gh pr merge --squash --delete-branch`**, then confirm both ends are gone: `git branch` locally, `git ls-remote --heads origin` on GitHub.
- **Never enable auto-merge.**
- **Merging into `main` publishes the site**, so it needs the same explicit go-ahead as a push.
- **Before merging, check the branch against the current `main`, not the `main` it was cut from.** Either merge `main` in and rebuild, or trial-merge when you only need to see the combined result: `git merge --no-commit --no-ff main`, rebuild, check, `git merge --abort`. A clean textual merge is not the check: two changes can merge without conflict and still interact on screen, which is what you are looking for.
- **When another session is already working in this repository, take a separate worktree** (`git worktree add ../varshil-anavadia-<branch> -b <branch>`), so each session has its own checkout. Each checkout has its own `dist/`, so both can serve at once on different ports: the main checkout keeps 4321, a worktree takes the next free one.

## Publishing

- **Never push to `main` without the owner's explicit go-ahead.** Every push publishes to the live site through GitHub Pages. Show changes in the local preview first.
- **When a feature was built with options, don't pick one silently before shipping.** Ask which option is wanted.
- **After merging, watch the deploy and confirm the change is live.** Watch the Pages run for the merge commit (`deploy.yml` queues rather than cancels, so the newest run may not be yours), then fetch the published file and look for the thing that changed. That the page loads proves nothing: until the new build lands, the old one is still being served.

## Local preview

- **`npm run preview:local` builds with the dev panel and serves it** on port 4321, reachable on the LAN for phone testing. Run it again after any `npm run build`, or `dist/` is left holding a production build and the panel disappears from the preview. A second checkout serves on another port: `PUBLIC_DEV_PANEL=1 npx astro build && npx astro preview --host --port 4322`.
- The preview serves whatever the last build wrote to `dist/`. It does not rebuild on its own.
- The owner reviews changes there with the local dev panel ("Top Secret Tools"), which only exists in a build made with `PUBLIC_DEV_PANEL=1`.
- **Before sharing phone links, confirm the Mac's current network address** with `ipconfig getifaddr en0`. It changes.

## Checking work

- **Check visual changes at phone width (390px) and in all three theme states:** device default, forced light, forced dark. The dev panel's switch forces the last two. The device default is a separate code path, the `prefers-color-scheme` block, so a change to the `:root` set alone can reach it without showing up in either forced mode.
- **The pull request build is the gate** (`.github/workflows/check.yml`): `npm run build`, then `grep -r dev-panel dist/`, which must find nothing. Rehearse it locally before opening the pull request, then rebuild the panel version. Never merge a red one, or one that has not reported yet.
- **Every animation needs a still version under `prefers-reduced-motion`**, and should pause while it is off screen or the tab is hidden.

## Design

- **The design source of truth is the Personal Portfolio Design System in Claude Design** (project id `d708aeee-8a4f-4afd-9a63-76771f71ba00`, a copy of Modernist), with the Type System and wireframes snapshotted in `design/`. `src/styles/design-system.css` is its stylesheet. Prototype new visual ideas locally, then record the result in Claude Design.
- **`design/` is a snapshot of Claude Design, not a copy to edit.** Re-take it after anything changes there, and never hand-edit a file inside it, or the snapshot becomes a fork. It runs downstream; `design/OUTSTANDING.md` runs the other way, what the site owes Claude Design.
- **A visual decision is not finished until Claude Design has it.** List what a pull request changes or reveals under a "To record in Claude Design" heading in its body, and move anything still outstanding after the merge into `design/OUTSTANDING.md`, so it does not leave with the branch.
- **The paper cutout behind the portrait is `#fff` in both modes**, the one surface that does not follow the theme. Check anything drawn on it for contrast against white, not against the page. `--on-paper` in `src/styles/site.css` carries the numbers and why the semantic accent cannot be used there.

## Data and privacy

- **The repository is public.** Never commit private data. Quote authors stay out of `src/data/quotes.json`.
- **Quotes:** the owner's working copy is a private Google Sheet (`1jZk5j9XmP78ocRAIVSQ_E-NNuaLacfFJR3vmlcK8BO4`). New quotes are appended to the end of `src/data/quotes.json` with the date they are added. Once a quote is in the file its date never changes, and quotes are never reordered or deleted, or the rotation changes for past and current days. The first import is the exception and stays: all 38 carry `2026-09-01` on purpose, so the set was eligible at once.

## Assets and tools

- **After replacing `public/hero-portrait.webp`, run `python3 scripts/make-paper.py`** to rebuild the paper cutout behind it.
- **Throwaway prototypes live outside the build.** Put them in `scratch/`, which git ignores, never in `src/pages/`: every `.astro` there becomes a published route, and the repository is public. Delete them once the decision is made. The site publishes two routes, `/` and `/404`; a third in `dist/` means something escaped.
- **Local-only tools go in the dev panel** (`src/components/DevPanel.astro`), with inline scripts and styles so they never reach the published build.
