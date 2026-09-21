# CLAUDE.md

Project instructions for Claude Code in this repository. Read `README.md` first: what the site is, how it is built, where things live.

Rules only: the reasoning lives in commit messages and code comments. Delete a rule once it stops applying.

## Branches

- Never work on `main`. Start every feature or fix on its own branch, cut from the latest `main` (`git fetch` first).
- Name the branch and its commits for the change, in the repository's existing style: `hero-motion`, `quote-of-the-day`, `fix-404-spacing`.
- Finish through a pull request, squashed into one commit on `main`, with a message describing the whole change. Open it with `gh pr create`.
- If a worktree holds the branch, remove the worktree before merging.
- Merge with `gh pr merge --squash --delete-branch`, then confirm both ends are gone: `git branch`, `git ls-remote --heads origin`.
- Never enable auto-merge.
- Merging into `main` publishes the site: it needs the same explicit go-ahead as a push.
- Before merging, check the branch against the current `main`, not the `main` it was cut from: merge `main` in and rebuild, or trial-merge (`git merge --no-commit --no-ff main`, rebuild, check, `git merge --abort`). A clean textual merge is not the check.
- When another session is working in this repository, take a worktree: `git worktree add ../varshil-anavadia-<branch> -b <branch>`. Two checkouts may serve at once, never on the same port.

## Publishing

- Never push to `main` without the owner's explicit go-ahead. Show changes in the local preview first.
- When a feature was built with options, ask which one to ship. Never pick silently.
- After merging, watch the Pages run for the merge commit, then fetch the published file and find the thing that changed. That the page loads proves nothing.

## Local preview

- `npm run preview:local` builds with the dev panel and serves it on port 4321, reachable on the LAN. A second checkout: `PUBLIC_DEV_PANEL=1 npx astro build && npx astro preview --host --port 4322`.
- Run it again after any `npm run build`, or the panel disappears from the preview.
- Before sharing phone links, read the current address: `ipconfig getifaddr en0`.

## Checking work

- Check visual changes at phone width (390px) and in all three theme states: device default, forced light, forced dark. The dev panel's switch forces the last two; the device default is its own code path.
- Rehearse the pull request's check before opening it (`.github/workflows/check.yml`): `npm run build`, then `grep -r dev-panel dist/`, which must find nothing. Rebuild the panel version afterwards.
- Never merge a red check, or one that has not reported.
- Give every animation a still version under `prefers-reduced-motion`, and pause it while off screen or hidden.

## Design

- The design source of truth is the Personal Portfolio Design System in Claude Design (project `d708aeee-8a4f-4afd-9a63-76771f71ba00`). `src/styles/design-system.css` is its stylesheet.
- Prototype visual ideas locally, then record the result in Claude Design. A visual decision is not finished until Claude Design has it.
- List what a pull request changes or reveals under a "To record in Claude Design" heading in its body; move what is still outstanding after the merge into `design/OUTSTANDING.md`.
- `design/` is a snapshot of Claude Design. Re-take it after anything changes there; never hand-edit a file inside it.
- The paper cutout behind the portrait is `#fff` in both modes. Check anything drawn on it against white, not against the page. See `--on-paper` in `src/styles/site.css`.

## Data and privacy

- The repository is public. Never commit private data. Quote authors stay out of `src/data/quotes.json`.
- Quotes come from the owner's private Google Sheet (`1jZk5j9XmP78ocRAIVSQ_E-NNuaLacfFJR3vmlcK8BO4`). Append new ones to `src/data/quotes.json` with the date they are added. Never change a date already in the file, and never reorder or delete entries. The first import's shared `2026-09-01` stays as it is.

## Assets and tools

- After replacing `public/hero-portrait.webp`, run `python3 scripts/make-paper.py`.
- Keep throwaway prototypes in `scratch/`, which git ignores, never in `src/pages/`, where every `.astro` becomes a published route. Delete them once the decision is made: a route in `dist/` other than `/` and `/404` means one escaped.
- Put local-only tools in the dev panel (`src/components/DevPanel.astro`), with inline scripts and styles.
