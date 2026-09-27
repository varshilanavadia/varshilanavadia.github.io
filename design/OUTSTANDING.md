# Outstanding with Claude Design

What the site and Claude Design still owe each other, in both directions. See CLAUDE.md, Design.

## The site owes Claude Design

Visual decisions the site has made that the Personal Portfolio Design System does not record
yet. Each one leaves this list when Claude Design has it.

- **The system's name.** It is still titled after Modernist there, and the landing wireframe
  still carries the "- Modernist DS" suffix. The site calls it the Personal Portfolio Design
  System (20 Sep 2026).
- **The dark ground token.** `#0E2E1D` is the site's dark-mode ground and the dark colour in
  the Favicon Spec and the Share Card, but it has no name in the system, and §08 still says
  the inverted set's ground is `--ink` (20 Sep 2026).
- **A token for the paper cutout.** The paper behind the portrait is `#fff` in both modes, a
  surface the system has no name for, and nothing there says which inks are legible on it
  (20 Sep 2026).
- **The paper cutout's width.** The paper grows the figure's outline by 30px of the source
  image, doubled from 15: about 22px at the portrait's full 605px width and 10px at its 280px
  floor on a phone (27 Sep 2026).
- **Dark mode, the 404 page, the contour map and the paper cutout** as built. The handoff
  prompt covering these is in the session notes; none of it is recorded yet (20 Sep 2026).
- **The tilt hint.** "Tap to tilt", a micro label role in the hero's top-right corner: mono
  at 0.75rem in `--ink-3`, shown only on a phone or tablet whose motion sensors wait to be
  asked (iOS today), fading in 1.5 seconds after the page and out for good on the first
  gesture (21 Sep 2026).
- **The hero gradient.** shadergradient.co's Universe preset, moving behind the hero and the
  bar: mid green `#60B37D`, sea glass `#A8D8D0` and the portrait's yellow `#F2D16B` in the
  light; the dark ground, deep teal `#1E5A4E` and olive gold `#6B5E10` in the dark
  (`--hero-gradient-1` to `3`). It fades out into the page along an eased curve from 55% of the
  way down the figure in the light and 75% in the dark (`--hero-fade`). The system has no
  role for a moving background (27 Sep 2026).
- **The bar over the gradient.** On the home page the bar runs on transparent over the hero,
  with no rule, and turns solid with its rule once the page scrolls past the hero. The rule
  between the hero and the statement is gone (27 Sep 2026).
- **The bar's links a size up.** t0 in bold on every page, up from the C3 nav label's t-1 at
  600, so they count as large text on the gradient. There they rest in `--on-gradient` (the
  dark ground in the light, `--ink-2` in the dark), hover to `--on-gradient-hover` (a
  near-black green, and `--ink`), and take a two-tone focus ring: that hover colour on a band
  of the page's ground (27 Sep 2026).

## The snapshot owes the site

- **`design/` needs re-taking.** The Type System, the landing wireframe and the `_ds`
  stylesheet are all from 12 September; the Favicon Spec is from the 17th. They predate the
  system's rename, dark mode, the quote of the day, the docked dev panel, the contour map, the
  portrait depth, the paper accent and the hero gradient. Re-take after the rename lands, so
  it is one pass.
