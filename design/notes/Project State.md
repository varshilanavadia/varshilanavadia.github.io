# Project state

Last updated: 26 Aug 2026

Personal site landing page. Two specification documents drive the build; the wireframe
is the design artefact they describe.

## Files

- `Personal Site Landing Wireframes.dc.html` — the landing page design. Ink, leading and sizes
  are all on the spec's tokens as of step 6, and everything is still a div except the sticky
  bar, which carries C3's nav. Source of truth for content (copy, timeline entries, activity
  stats, contact questions).
- `Typography Specification.dc.html` — 29 pages, twelve sections. Scale, roles, leading, ink,
  states, exceptions, gaps, and §12 specimens as of 24 Aug 2026. §09 spans five pages; §04
  five; §01 four, two of them mono's remit; §02 and §05 two each; §12 three. The cover's
  contents table is the map and was rebuilt with the specimens.
- `Type System.dc.html` — 32 pages, eighteen sections. **The governing document.** All nine open
  decisions were settled 24 Aug 2026, so the two-part structure is gone: §01–§17 state the system,
  §18 records the eleven answers. Three sections added 25 Aug 2026 — inverted type, buttons, forms.
  Supersedes `Typography Specification`, which is now history.
- `Semantic Mapping.dc.html` — 24 pages. Which HTML element carries each type role. Eight decisions,
  all settled, plus the mapping table itself — which `Type System` §16 points at rather than
  restating. On the new tokens and the 29-role set as of 25 Aug 2026.
- Explorations: `Button Design`, `Button Explorations`, `Contact Design`,
  `Contact Form Explorations`, `Mono Candidates`, `Movement Header Explorations`,
  `Timeline Date Explorations`, `Writing Section Explorations`.

## Typography spec — fix order from the review

Eight problems were found and ordered. All eight are applied as of 24 Aug 2026.

1. **Done** — ink value, focus ring, link indicator. `--ink-3` is `#737373` (4.60:1 on
   `--sheet-alt`, the darkest ground; ratios in §07 are stated against it as worst case).
   Focus ring: 2px `--ink` outline, 2px offset, `:focus-visible`. Link underline moved to
   `--ink-3`. The sticky bar's carve-out is written into §09 under a *Carved out of §08*
   group: the four nav labels draw no ring because the brackets are the indicator, the
   wordmark keeps its, and §08's Focus ring row now points at it. The mapping's page 08 and
   the spec agree.
2. **Done** — rem and re-anchored scale. Eight steps `--t-2`…`--t5`, anchored on the 20px
   body, declared in rem with px as reference. Spacing scale and measures also in rem.
   Retired the 13px exception into `--t-2` (0.8rem) with a Micro label role. Step 6 added a
   ninth step, `--t6`, for the hero name.
3. **Done** — leading is role-driven, not size-driven. §05's band column replaced.
4. **Done** — mono ink rule and an Inline code role. All 12 inline mono runs unified on
   `--ink-3`.
5. **Done, 19 Aug 2026** — the six uppercase label roles are four. Not three: auditing the
   site found a seventh live form the spec never declared, and it earned a name.
   See `Label Role Consolidation.dc.html` for the three turns of working.
6. **Done, 24 Aug 2026** — clamp rules on 21 Aug, then one scale and one measure across all
   five files. Its own section below.
7. **Done** — §10-01 is reframed as a conformance failure in the present tense, citing
   1.4.10 Reflow at a 320px-equivalent width and 1.4.4 Resize Text at 200% zoom.
8. **Done, 24 Aug 2026** — §12 specimens, three pages, and a fifth §04 page for the elements
   summary. Its own section below.

## Semantic mapping — the eight picks

All settled. Reasoning is on each decision's own page; the log is page 18.

| | Decision | Chosen | Note |
|---|---|---|---|
| A | The page title | **A1** | Hero name is the h1; wordmark is a link home. Rule: the h1 is whatever visible text names the page — if nothing does, it is hidden (A3). |
| B | The four section names | **B2** | Hidden h2 per section. Design unchanged. |
| C | The nav labels | **C3** | Links carrying `aria-current="location"`; the open state is drawn and folded in (page 08). |
| D | The timeline entry | **D1** | Role is an h3, organisation a `p`, date a `time`. Seven entries. |
| E | The movement grid | **E3** | Label/value pairs per card. **Diverges from the recommendation (E1, a table).** |
| F | The writing row | **F1** | Each row an `article`, title as h3 and link. |
| G | The contact field | **G2** | Label is the question alone; number and type marker `aria-hidden`. |
| H | The clamped excerpt | **H3** | **A third position, not one of the two offered.** |

### The two divergences, and why

**E: recommended a table, decided pairs.** Two facts arrived after the options were
written. The cards will be fed live from Strava or Coros, so the stat set varies by
activity — a ride carries pace, a yoga session only a duration — and a table's premise is
that every row answers the same columns, leaving empty cells announced as "Pace, row 4:
blank". And each card is to be a component; a table keeps its headers outside the rows, so
the card could not own its own markup and the parent would have to know every stat type in
advance. Comparison was the argument for a table, and there is none to draw between a yoga
duration and a ride distance.

**H: neither H1 nor H2.** Both assumed text longer than the three lines shown and argued
over where the remainder goes. The excerpt is instead authored as a two or three line
summary, complete in itself, and the clamp is insurance against one running long. Nothing
is hidden, so the same words are seen and heard.

Both are kept visible in the log — the Recommended column is retained beside the Chosen
column so the divergences are readable rather than tidied away.

## The mapping table — done

`Semantic Mapping` §04. Page 20 is the table: all 25 roles of the type spec's §03 and §04
against their elements, two columns, grouped as headings/display, body/meta, interface and
specification documents, with a From column citing the decision (A–H) or the label-role
reading (§05, page 22). Page 21 carries the four findings that only appear once the column
of elements exists:

1. A role is not an element — Row title is an h3 in the timeline and writing rows and a
   `label` in the contact form; Meta label spreads widest (dt, time, a).
2. Heading levels follow depth and stop at h3.
3. The element carries no size — three roles map to h1 at three sizes.
4. The three hidden roles are the mono ones — field index, field type, micro label.

That page previously flagged Meta label's sticky-bar link as decided but not buildable.
C3's open state settles it, so every row in the table is now buildable.

## C3 open state — settled and folded in

`Nav Open State Explorations.dc.html`. Four candidates explored (1a–1d), **2a is the
chosen design**: the wireframe's crossfade untouched while closed; the set pushes open on
focus, hover or tap; dark ink marks the section you are in and brackets mark the label focus
is on. See **`C3 Handoff.md`** for the full behaviour, the five animation phases and the
traps behind them.

The three questions that blocked the mapping are answered, and are recorded on Semantic
Mapping page 08:

- **The element** — a plain `a` in both states, real fragment href, no `aria-expanded`.
  The collapse hides nothing from assistive technology, so there is no disclosure to
  announce.
- **The mark** — `aria-current="location"`, absent rather than `false` over the hero. The
  mark tracks scroll position, so `page` would claim a navigation that never happened.
- **Focus** — no ring on the labels; the brackets are the focus indicator, and §08 of the
  type spec takes an exception for the sticky bar. Scroll no longer reclaims the brackets
  while focus is in the set: ink is where you are, brackets are where focus is.

Behaviour settled alongside them, built into 2a and staying in the exploration file:

- **Hover intent** — 100ms before opening, cancelled if the pointer leaves; closing stays
  immediate, and focus or a click still opens at once.
- **Shut on activation** — a click or Enter navigates and collapses the row. Safe because
  the destination becomes the current section, so the label left inked at the gutter is the
  one holding focus; nothing is stranded on an invisible link. This replaced Escape, which
  would have had to move focus on the user's behalf.
- **Tab re-opens** — while the row is shut, a Tab from inside the nav is swallowed: the row
  opens and focus stays put, and the next Tab advances. Shift+Tab and a Tab from the
  wordmark always pass through. Accepted knowing it announces nothing to a screen reader.
- **Reduced motion** — the row snaps between two states with no transition; `prime` and
  `closing` are skipped and `max-width` is dropped, so the measured-width trap cannot fire.
  Same triggers, same resting bar. The stay-permanently-open alternative was rejected: the
  collapsed bar is a design decision, not a motion effect.
- **Leading gaps** — the 40px gap leads labels 2–4 instead of trailing 1–3, so the row is
  never wider than what it draws. It used to measure 40px closer to the wordmark than it
  looked, which would have corrupted the narrow-screen budget.
- **44px tap targets** — 12px above and 13px below a 19px line box, with the bar's own
  padding cut from 16px to 13px. Total height stays 71px, so the wordmark and the scroll
  spy's 72px handover constant do not move. The row's placeholder `min-height` had to go
  from 38px to 44px or the bar shrank to 65px while stacked. The underline moved onto an
  inner span so the current-section mark stays on the word, and the brackets take the same
  offset.

Two known costs, both accepted: on desktop the taller box makes hover fire ~12px above and
below the word (the 100ms delay absorbs it), and on touch only the single current label is
tappable until the row opens, so 44px may be re-decided when the narrow bar is designed.

Applied to `Personal Site Landing Wireframes.dc.html`. The four stacked `#lbl-*` divs and
their `html[data-active=…]` opacity rules are gone; the bar now holds a `nav > ul > li > a`
set drawn by the logic class, with the five phases, hover intent, Tab-to-reopen, shut-on-
activation and reduced-motion snap ported as they stand in 2a. The helmet spy is still the
only place the boundary maths lives — it keeps writing `data-active` on `<html>`, and a
`MutationObserver` reads it into state, so `data-past-hero` and the back-to-top button are
untouched.

One value was re-derived rather than copied. The exploration cut the bar's padding to 13px
to hold its own 71px bar; the wireframe's bar is 63px, so the same rule (the bar gives back
what the links take) puts its padding at 9px. 44px targets, 63px bar, wordmark and the 72px
handover all unmoved. The wordmark is still a div — decision A's markup is part of the
semantic migration, not this port.

## Next

1. **The narrow hero and the narrow bar** (D7 and D8). Both are settled as type — two lines at t5,
   and a current label beside an abbreviated t0 wordmark — and neither is built. This is the design
   work the whole narrow-screen fix waits on, and `Type System` §13 already says what the type does.
2. **The four knowing absences in `Type System`:** projected type (so no deck has a floor), tables
   (one role, despite both documents being mostly tables), a second button, and motion. Which of
   them matters depends on what gets built next.
3. **The writing row's date and read time** — whether they follow the timeline's rail into mono. The
   one question older than the nine, still open, still blocking nothing.
4. **The article page** — deferred by decision, 19 Aug 2026. §13 proposes its nine roles; the page
   will argue with them when somebody draws it.
5. **Narrow screens for the sticky bar.** Not a variant of 2a but its own design: four
   labels plus the wordmark do not fit a phone. Candidates are the same row scrolled
   horizontally, a downward stack like 1b, or a single current label with no set. The touch
   -target question lands here too, so this is one exploration, not two.
2. **The seven instances off their role**, on the spec's §09 page at footer 23. One property
   each, one visible change each, so each is a decision rather than a fix. The contact email
   is the one that touches a ratified rule; the specimen pages mark four of the seven.
3. **The writing row's date and read-time** — whether group 4 of mono's remit reaches a rail
   whose entries are uppercase labels. Small, and it blocks nothing.
4. **The two spec documents' own measure.** They run 89 to 91 characters against the 54ch
   they now declare. Narrowing them reflows 25 letter pages laid out to fit, so it is its own
   piece of work.
5. **The article page** (§11-02) — deferred by decision, 19 Aug 2026. It stays listed as a gap
   in §11 because the spec has no article-page roles, but it is not queued work: the design
   comes later. Nothing else in the queue waits on it.
6. **The mapping document has its own stale text.** Its page 22 still says the type spec "has
   six uppercase label roles… and a proposal to merge them into three" — step 5 left it behind,
   and it is an argument rather than a number, so it needs a pass of its own.

## Step 6 — one scale, one measure — 24 Aug 2026

Two populations of token names became one, and the measure moved from pixels to characters.

**The renaming.** The site files declared `--t0` as 16px where the spec declared it as 20px, so
the same name meant different sizes and no site file could adopt a spec token by name. The site
took the spec's names: every reference shifted down a step (t0→t-1, t1→t0 … t6→t5), px became
rem, and the spacing block went to rem alongside. Nothing moved on screen. Four sizes changed
by less than a quarter-pixel where the rem values round differently from the old px ladder —
25→24.96, 31→31.2, 49→48.8, 61→60.96.

**The hero came onto the scale.** It was 92px, ratified in §09 as `--t-hero` because reaching it
on the ladder would have cost two steps for one word. It is now 76.16px at a new `--t6`, one
step above t5 and rounded by the scale's own rule (3.81 × 1.25 = 4.7625 → 4.76rem; §09's
parenthetical 4.77 had compounded in pixels first). Nine steps, no exception, and §02 gained a
second page for the declaration block and that history.

**The measure is in characters.** `--measure: 46ch`, about 70 characters at any size — Figtree's
1ch is 0.641em against an average character advance of 0.422em, so one ch buys 1.52 characters.
It replaces two rem caps that were the same measure in disguise: 38em and 38.75em, which are 90
and 92 characters, not the 76 §05 claimed. That old figure had assumed half an em per character.

**Corrected 24 Aug 2026, same day.** The token was first declared at 54ch. The probe that
measured it had not actually loaded Figtree — `document.fonts.ready` resolved before the
stylesheet registered the face, so the numbers were the sandbox's default sans. Re-measured with
`document.fonts.load()` awaited first, Figtree's 1ch is 0.641em, not 0.556em, and 54ch was 82
characters — outside the 45–75 target the change existed to satisfy. 46ch is the right value.
The lesson is in the working notes: await the face, then measure, and sanity-check any font
metric against a known-absent control family.
Prose takes the token — lede, supporting note, caption. Headings keep a rem cap, because a
heading's cap fits it to the page column rather than to a reading measure, and ch on a bold
display line is a poor proxy. Body / excerpt still takes neither and is bounded by its row;
Feature title joined it there, since the clamp work had already given the row the width.

**The mono column.** The contact form's field-type gutter is `12ch`, the same 111.7px the 7rem
held, restated in the unit that means something for mono and re-measured against Plex as §04
asked. The widest live type is 6ch, so half the column is slack; it can tighten when the
questions need the room.

**What the sweep found.** With one scale, an instance can be held against its declaration for
the first time. Seven did not match, each by a single property, and none was changed — they are
on the new §09 page, *Instances off their role*. One of them — Feature title's 56.25rem cap,
which the clamp work had already made dead — was corrected in §04 rather than listed, and an
eighth turned up while step 8 drew the specimens, so the page lists seven. The sharpest is the contact email: mono at t2, where §01
permits mono above t0 for display figures alone. §10 gained a third gap with them: no role
covers a row of links, Meta label having been retired in step 5.

**Also folded in.** Both site documents and the mapping were still requesting Figtree 500, so
all five files now load the six declared faces and §10-02 says so rather than promising it.
§11's suggested order was rewritten, and its measure entry now names the one thing still open
there: these two documents' own prose.

## Leading standardised in the spec documents — 18 Aug 2026

The ink migration covered ink and rules; leading was only corrected in the landing wireframe.
`Button Design` and `Contact Design` still set it as literals, so both now declare the
`--lh-*` block beside their `--s*` and `--t*` tokens and reference it throughout — 34 values
in the button document, 16 in the contact one, 50 in total, none left. `Typography
Specification` was already clean.

Mapped by role, per §05 rather than by nearest value:

- Document title at t5 → `--lh-tight`. Section headings at t2/t3 and the button-field names →
  `--lh-snug`, which moves five button headings from 1.2 to 1.15 and three contact questions
  with them (row title).
- Body, ledes, table-cell prose and supporting notes → `--lh-body`. This is most of the count,
  and moves 1.4 and 1.45 up to 1.5.
- The contact field index and type markers stay at 1.6 as `--lh-mono` (records); the mono
  **answers** go to `--lh-body`, since §05 lists mono answer under running text, not records.
- The contact link row was already 1.3 and is now `--lh-normal`.

Two things this pass deliberately did not touch. The `13px` literals in the button document
(11 of them, not the two recorded here at the time) and the `2px` nudges are size and spacing,
not leading; the literals went onto `--t-2` in step 6. And the uppercase labels in both documents set no leading at all, so they inherit
`--lh-body` from `body` where §05 asks for `--lh-normal`; they are single-line, so nothing
renders differently, but it is a real gap rather than a clean state.

## Clamp rules — written in and swept, 21 Aug 2026

Working in `Clamp Rules Explorations.dc.html` (turn 1, the writing list with every tweak;
turn 2, the four roles that wrap).

- **Body / excerpt** clamps at 3 lines and takes **no measure**. Its width comes from the row:
  to the image where there is one, to the row's own edge where there is not — the same edge
  the title runs to. §05's 45–75 target does not apply to it, because it is a truncated
  preview rather than reading text. The trailing "…" is drawn by the clamp itself.
- **Feature title** clamps at 1 line.
- **Row title** and **Lede** do not clamp, and this is a decision rather than an omission —
  record them as `none` so the next reader does not guess. Revisit only on request.
- **Maximum 3 tags.** Measured, 3 is the exact ceiling: the left column runs 99.2px against
  the excerpt's 98, level within a pixel, so the excerpt still governs row height. At 4 the
  tags take over and the clamp stops holding the grid.
- **Eligibility:** only a role inside a repeating row may clamp.
- **Mechanism:** the four properties travel together, and they fail two different ways.
  Missing `display` or `-webkit-box-orient` and the clamp does not fire at all; missing
  `overflow` and it fires but the remainder paints outside the box onto the row below, while
  every measurement of the grid still reads as healthy.
- **Two prohibitions**, which retire two live wireframe artifacts: no `text-overflow` inside a
  clamp (inert — the clamp draws its own ellipsis), and no `text-wrap: balance` on a one-line
  clamp (nothing to balance).

**Written in.** §04 carries a clamp value on each of the four wrapping roles, beside size,
weight, leading and ink — `clamp 1`, `clamp 3`, `clamp none`, `clamp none`. Body / excerpt
lost its 42.5rem and now reads *bounded by the row* — including in §05's caps list, which had
kept assigning it 42.5rem, and in that block's closing claim that nothing at t0 or below runs
the full column. §05's one trailing sentence became the
full rule: eligibility, the four properties, the two failure modes, the two prohibitions, and
the note that a clamp only holds a grid while it is the tallest child. §09 gained a *Tags per
writing row* ratification with the 99.2 / 98 arithmetic.

Both additions overflowed their pages and were silently clipped — `section.page` is a hard
1056px with `overflow:hidden`, so nothing errors and the type just disappears. The whole
*Wrapping and overflow* block now has its own page, §06 at footer 15, and the tag entry has its own §09
page at footer 19, *Constraints between roles* — a rule belonging to neither role alone, which
would be lost filed under either. 23 pages at the time; 25 after step 6.

**Swept.** The wireframe's article title lost `text-wrap: balance` (nothing to balance on one
line), and the excerpt lost both the inert `text-overflow: ellipsis` and the `max-width: 900px`
the row now supplies. Two `text-wrap: balance` remain in the file, on the timeline's org lines
— unclamped, so legitimate.

**Found while measuring, not clamp work.** Two live instances looked as though they drifted from
their declarations, both size-only: the hero's positioning line at t1 against Lede's t0, the
timeline's role line at t2 against Row title's t1. Step 6 showed both were the naming gap and
not drift at all — 20px is the spec's t0 and the site's t1, 25px is the spec's t1 and the
site's t2. Both matched all along.

## Mono's remit — ratified 19 Aug 2026

All five candidate groups are in. Built as toggles in `Mono Remit Explorations.dc.html` — one
tweak rings every candidate in red, another switches each group between Figtree and Plex — and
assessed against the site as built.

**The five groups**, now two pages of their own in §01 at footers 03 and 04 — the five groups, then the boundary and group 4's justification:

1. **Verbatim machine strings** — token names, CSS values, code, paths. *Mono value, Inline code.*
2. **Structured identifiers** — the numbered gutter down the contact fields. *Field index.*
3. **Type classifications and typed input** — machine type names, answers, the email address.
   *Field type, Mono answer.*
4. **Figures that align down a column** — distances, durations, paces, dates in a rail.
   *Activity figure, Date rail.*
5. **Display figures** — figures large enough to read as instrumentation.
   *Movement header figures*, the only role permitted above t0.

Bounded by two existing rules: mono annotating Figtree takes `--ink-3` (§01's softening rule),
and only group 5 may sit above t0. Mono never carries prose, headings, block-naming labels, or
anything that wraps — mono answer is the one run that may, capped at three lines.

**Group 4 needed an argument**, since `tabular-nums` was already free. It aligns digits but not
the letters beside them, and these figures carry units — mi, bpm, /100m — so a column of them
stays ragged in Figtree. Mono aligns the whole string, and the unit is part of the record.

**Applied to the wireframe.** Movement header figures at t4 · 700 (group 5, and §03 had declared
this role since the first draft while the site rendered it in Figtree — now built). Activity card
figures and the timeline date rail to mono 400, dropping the 600 weight and the date rail's
0.5px tracking, both of which were Figtree-era compensation.

**Not applied, deliberately.** The writing row's date and read-time sit in a rail and align down
a column, so group 4 arguably reaches them — but both are currently uppercase Label-role labels,
and switching them would move two systems at once. Left as a question for the article page,
where the same rail appears again.

## The site is on IBM Plex Mono — 19 Aug 2026

Points 1 and 2 of mono's remit, settled ahead of the remit itself. Auditing mono found the
three site files disagreeing about it at a more basic level than "which roles may carry it".

- **Contact Design was on JetBrains Mono** — a different face from the one §01 declares, eight
  stacks of it, loaded at weights 400 and 500 while the section renders a 700 email address,
  so that string was faux-bold. Now IBM Plex Mono at 400 and 700, matching the two spec
  documents. The helmet comment explaining `font-size-adjust:0.5` cited JetBrains' x-height
  and now cites Plex's 0.516 against Figtree's 0.500, the figure §01 uses.
- **The landing wireframe loaded no mono webfont at all.** Its single mono string sat on the
  bare system stack at a raw 13px with no adjust, so it rendered at whatever x-height the
  reader's system mono has and §01's match did not apply. Now on the declared stack with
  `font-size-adjust:0.5`, and the 13px literal folded into `--t-2` while it was open.
- **Button Design has no mono at all**, so it loads none. Nothing to change.

Two things this surfaced and did not fix. §03 declares Movement header figures as t3 mono ·
700, "the only mono above t0" — the wireframe renders those figures in Figtree at t4 with
`tabular-nums`, so the role as declared does not exist. And `Date Rail Alignment
Explorations.dc.html` is still on JetBrains Mono; it is an exploration, not a site file, but
its measured numbers were taken with that face loaded.

**A naming gap this exposed.** The site files declared `--t0` as 16px while the spec's
re-anchored scale had `--t0` at 20px and `--t-1` at 16px, and the site had no negative steps
at all, so the same token names meant different sizes in the two populations. Closed by step 6
on 24 Aug 2026: the site took the spec's names.

**Still open:** mono's remit proper — what mono is *for* — and reconciling the six declared
mono roles against it. Movement header figures is the one that decides how the movement header
and the stat rows look.

## Label roles consolidated — 19 Aug 2026

Six uppercase label roles became four. The working is in `Label Role Consolidation.dc.html`,
three turns, each one changing the answer.

**The four roles.** All share one form — uppercase, `--lh-normal`, no wrap, and a size
**inherited from the block they sit in** — and differ on three axes that each mean something:

- **Eyebrow** — 700 · ls 1px · `--ink`. Names a block at heading weight. h2 or h3.
- **Block label** — 600 · ls 1px · `--ink` or `--ink-3`. Names a block without heading
  weight, so it does not compete with the title beneath. Not a heading.
- **Column header** — 700 · ls 0.5px · `--ink`. Always `th`. Renamed from Table header.
- **Label** — 600 · ls 0.5px · `--ink` or `--ink-3`. Annotates a value.

Tracking says what it does (1px names a block, 0.5px annotates a value), weight says whether
it is structural, ink says whether it carries information. Retired: Kicker, Meta label,
Status label, Micro label.

**What each turn changed.** Turn 1 laid out the six roles measured at their real values and
found five pairs differing on exactly one property, two of them on ink alone. Turn 2 counted
the live uses and killed the premise of the whole exercise: Kicker has **zero** uses in the
site — all 18 are in the two spec documents' own chrome — so the one value change was free.
Turn 3 audited every uppercase label in the three site files and found two harder things.

**The two findings from the audit.** §04 declared every label at t-1; **no label in the site
is at t-1** — the wireframe runs t0 and t1, and t-1 was the spec documents' own density
written into the role as though it were the system's. So the label roles now declare no size
and inherit it from their block, following the pattern §04 already used for Inline code. And
tracking does not follow weight: the site pairs 600 with 1px in four places — the sticky nav,
contact's "Or skip the form", the button document's "Component spec" and "For designers".
That form is what became Block label, and it is why the count is four rather than three.

**Applied.** §04's three role pages rewritten; Status label and Micro label rows deleted; and
a fourth §04 page, *Roles — the label group*, added at footer 11 to carry the axes and the
retired names (it overflowed the this-document page by 205px, clipping the retired-names
paragraph entirely). Footers from §05 onward renumbered, 19 pages. §01's
weight table, §02's Carries column, §03's mono reference, §05's tracking table and §09's
sticky-bar entry all updated. The mapping's role tables renamed — three rows now share the
Label name and differ only in the element their context demands, which is the point that page
was written to make.

**One site fix came with it.** The movement header's "This week" was t1 · 700 · 0.5px ·
`--ink` — Column header's exact values, with no table near it. By behaviour it is an eyebrow,
so it went to 1px.

**Checked in step 6.** The five live site labels that were off §04 on size are all reading their
size from the block they sit in, which is what the inherited-size rule asks for; none of them
needs a value. The sweep's findings are elsewhere — seven non-label instances that do not match
their role.

## §09 is closed — 18 Aug 2026

All three corrections and both carve-outs are now recorded or applied, and §09 spans three
pages. The date-rail offset was the last of them.

**The date rail — 1C, shared baseline.** Four options were built and measured in
`Date Rail Alignment Explorations.dc.html` (baselines from a zero-height inline probe, cap
heights from the rendered glyph's ascent, so the numbers are the real render rather than
assumed font metrics). Measuring changed the answer: §09 described the 17px as sitting the
date on the title's cap line, but the cap tops were 11.8px apart and the baselines 1.5px, so
the number was an eyeballed approximation of a shared baseline. Two other findings — the
offset is in the **writing row**, not the timeline, which §09 and this file both had wrong;
and 1B, a token-derived nudge, was further from the current look than 1C while keeping two
off-token values.

Applied to the writing row: it is now a grid, `grid-template-columns:160px 1fr` with
`align-items:first baseline`, so the browser holds the date on the title's first baseline.
Measured Δbaseline is 0.00px across all three rows, titles still clamp to one line. The 17px
nudge and the date's `line-height:1` are both gone and the date is back on `--lh-normal`; a
literal `1.3` on the read-time in the same block went to the token with it. Read-time and
excerpt now start at the same y, 8px lower than before for read-time. The thumbnail stays a
flex sibling outside the grid so a text-only row gets no phantom column.

Only one literal leading value is left in the wireframe: `line-height:1` on the activity-card
placeholder label, an alignment fix, which §09's off-token entry now names on its own.

## The two stragglers — folded in 18 Aug 2026

The migration left two off-token surfaces in the landing wireframe, both grounds rather than
ink: the article row's `#faf9f7` hover and the image placeholder's `#f5f5f5` hatch stripe.
Both now use `--sheet-alt`, so every ground in the wireframe is one §07 names. The hatch
reads very slightly warmer than before. `#000` in the metaball field and the `#e9e8e6` desk
ground stay off-token by decision; the type-probe overlay is dev chrome.

## The ink migration — applied 17 Aug 2026

Ran once, across the three site files §09 scopes: the landing wireframe, the contact section
and the button. The eight exploration files are untouched, per §09's *not migrated* note.

- **Tokens, not values.** Each file's helmet now declares `--ink`, `--ink-2`, `--ink-3`,
  `--ink-deco`, `--rule-strong`, `--rule`, `--rule-faint`, `--sheet` and `--sheet-alt`
  beside the `--s*` and `--t*` tokens it already had, and every ink and rule literal
  references them. Six retired greys collapsed into three ink tokens: `#999`, `#888`,
  `#b0b0b0` and `#767676` → `--ink-3`; `#666` and `#777` → `--ink-2`.
- **Hairlines are rules, not deco.** `#ccc` and `#bbb` went to `--rule` rather than
  `--ink-deco`, so `--ink-deco` still has no instance anywhere — which is what §07 claims.
- **The two `#999` borders** turned out to be one glyph: the trailing chevron of the
  back-to-top arrow, not a rule. It took `--ink-3`, keeping the light/dark pair that reads
  as motion, and clearing 3:1 on its own rather than leaning on the `--ink` chevron above.
- **Default text ink.** All three files left body text at the browser's pure black. They now
  set `color: var(--ink)`, so nothing inherits #000 where §07 says #111.
- **§09's corrections rode along** in the wireframe: weight 500 → 600 on the movement date
  range, and the five off-token leading values onto `--lh-snug` / `--lh-body` /
  `--lh-normal`. The two values of `1` stayed, being alignment fixes rather than leading.
- **One surface moved.** The movement header's panel was `#f8f7f5`, darker than any named
  surface, and `--ink-3` on it measured 4.43:1 — the one AA failure left after the swap. The
  panel is now `--sheet-alt` (4.53:1). §09's *Grounds with no guarantee* note originally named
  `#f5f5f5` and `#faf9f7` as the grounds carrying no guarantee; both were folded into
  `--sheet-alt` on 18 Aug 2026, so the note now states the rule generically.
- **Not touched:** px sizes (that is step 6), `#000` in the metaball field, the placeholder
  surfaces §07 does not name (`#f5f5f5`, `#faf9f7`), the `#e9e8e6` desk ground, and the
  type-probe overlay.

### What it left open

- **The 17px date-rail offset**, the third §09 correction. It needs a baseline rule rather
  than a value swap, so it was left rather than half-done. Still open.
- **The sticky bar's label leading** — closed 18 Aug 2026. It stays at 1.2 rather than
  `--lh-normal`, and §09 now ratifies it: at `--t0` the 19.2px line box plus 12px above and
  13px below is the 44px tap target, `--lh-normal` would make it 45.8px, and the bar would
  grow past 63px and move the scroll spy's 72px handover constant. Scoped to those four
  labels; the value may only move if padding, bar height and the constant are re-derived
  together.

## Deferred by agreement

Landmarks and reading order — page-structure decisions rather than typography, recorded on
Semantic Mapping page 23. C3 settles part of the first: the labels are links, so the
sticky bar takes a `nav` landmark. E3 creates the reading-order case worth watching, since
the cards invert label and value in markup relative to the display.

## Working notes

- Both spec documents are `doc-page` letter documents. Measure page fit by **summing children plus
  padding against the 1056px sheet**, not with `scrollHeight − clientHeight`: the sheets are scaled
  to the viewport, and the scaled container rounds differently from the layout — the same page read
  165px over and then 0px over on consecutive calls. Never sum child heights alone; that misses
  padding and margins.
- When a page overruns, move a block to another page. Trimming prose by eye does not
  converge; it took several rounds to learn that twice.
- Content in the mapping's specimens is verbatim from the wireframe. Read the file rather
  than completing a sentence from memory — that produced three fabrications, including an
  invented timeline entry and a stat the cards do not carry.
- State that drifts (counts of what is decided) is kept in one place only: the log's
  Chosen column. Page titles and ledes describe the document, not the tally.
- Inserting a mapping page renumbers every footer after it, and `Project State.md` cites
  page numbers. Renumber descending in one pass and re-grep for stale references.
- When generalising per-panel logic in the explorations file, check every hardcoded state
  key. One missed `'E'` left 2b's clicks driving 2a's scroll container, which read as
  "navigation is broken" rather than as a wiring mistake.
- An orange outline round a label in the preview is editor chrome, not the design. Confirm
  by reading computed `outline-style` before changing anything.
- Measuring a webfont: `document.fonts.ready` is not enough — it resolves before a `<link>`
  stylesheet has registered its faces, and the measurement silently reports the fallback.
  `await document.fonts.load('400 100px Figtree')` first, and measure a deliberately absent
  family alongside as a control: if the two agree, the real face never loaded.

## Step 8 — specimens and the elements summary — 24 Aug 2026

The last of the eight, and two separate things under one number.

**§12 Specimens, three pages.** Every role was declared on its own; nothing in the document
showed two roles beside each other at the size they are actually set, which is the only way to
see whether a decision holds. Five fragments now do: a writing row, a timeline entry, a contact
field, the movement header and the sticky bar, each with a legend naming its roles and their
declarations.

- **Cropped, never scaled.** The page column is 688px against the wireframe's 1440px, so each
  fragment is the left of its block at full size. Reduced to fit, a 20px lede would be drawn at
  10px and prove nothing. Two consequences are stated on the pages: the writing row's excerpt
  clamps three lines sooner than it does on the page, and the sticky bar had to be drawn twice —
  closed with the wordmark, then the open label set without it, because the two together do not
  fit 688px.
- **Drawn as §04 declares, not as the site renders.** Where they disagree the legend carries a
  §09 mark. Four of the seven are visible in these fragments: the tags (drawn uppercase, set
  sentence case), the date rail (drawn t0, set t-1), the field index (drawn 700, inherits 400),
  and the timeline organisation line, which answers to no role and is drawn as the site has it.
- **Content verbatim from the wireframe**, dated on the page. It is a snapshot and will drift.

**An eighth instance off its role**, found while writing the legends: the timeline date rail
renders at t-1 where §04's Date rail declares t0 mono. Everything else about it matches. It is
on the §09 page with the rest, which brings that page to seven entries.

**The elements summary** is a fifth §04 page rather than a copy of the mapping table. The table
stays in `Semantic Mapping` §04 — restating 25 rows in both documents would rebuild the
two-population problem step 6 spent a day closing — and the spec page carries the four findings
the column of elements produces, plus a pointer. The sharpest of them is that the three hidden
roles are the three mono ones: the mono register and the accessibility tree draw the same
boundary, and neither was designed with the other in mind.

**Also corrected.** The cover was carrying a stale contents table from a much shorter draft
(page numbers that stopped at 15) and a summary strip that still said eight steps, t-2 – t5.
Both rebuilt: fourteen rows against the real footers, nine steps, t-2 – t6. The lede's claim
that undecided things "appear on the last two pages" now names §10 and §11, which is where they
actually are.

## Type System — a new draft, 24 Aug 2026

The old specification recorded decisions as they were made and could not govern a new artefact:
it knew one viewport, two kinds of page, and had holes in its own role set. `Type System.dc.html`
is the draft that can, split into what is derivable and what is not.

**Part one, 16 sections.** Foundations and mono's remit, the nine-step scale, all 25 roles in three
tables, the label group, leading and measure, case and tracking, wrapping and clamping, ink and
grounds, interactive states, ratified exceptions, the elements summary, and three specimen pages.
Four sections are new and did not exist before:

- **§10 Print.** The sheet is a hard 816 × 1056px box with a 688 × 976px column; prose at t-1,
  which is exactly 12pt at 96dpi; t-2 is the floor and never carries a sentence. States the failure
  mode that has cost this project the most time — overflow is silent, so measure
  `scrollHeight − clientHeight` and move blocks rather than trimming prose. Plus the A4 rule: lay
  out to a 666px column if a document must serve both sheets.
- **§11 Font loading.** Measured fallback metrics — Figtree x-height 0.500, Arial 0.519, Helvetica
  0.523, system-ui 0.508 — with the `size-adjust` each implies and the advance ratio each costs.
  Names one fallback (Arial, 96.4%) rather than a cascade, because metrics can only be tuned for
  the face actually named.
- **§12 Long-form.** Nine roles for an article: four existing ones reused, three new (article body
  at `--ink` rather than `--ink-2`, subhead, blockquote), and what is deliberately absent — no pull
  quote, no drop cap, no small caps, since Figtree has no small-cap axis and synthesising them
  would break the x-height match §01 exists to protect.
- **§13 Narrow screens.** The mechanism only: two anchors at 1440 and 320, display roles
  interpolating with `clamp()`, and body fixed at t0 at every width. With the measured budget —
  272px at 320px — and the note that the layout half is part two's.

**Part two, nine decisions.** D1 the activity card's step · D2 the email above t0 · D3 three of one
property each (index weight, tag case, rail step) · D4 the organisation line · D5 the row of links ·
D6 type and space · D7 the hero at 320px · D8 the bar at 320px · D9 what the document governs.
Every candidate is drawn at real size with its declaration and the case for it, and each carries a
recommendation marked *my pick*. D7 and D8 are drawn inside 272px and 320px frames, so they are
what a phone would actually show.

**An eighth instance off its role, and a tenth open question.** D3 and D4 fold in the seven from the
step 6 sweep; D5 folds in §10's missing link role; D9 is new — the exploration files are formally
out of scope today, which is how a retired typeface stayed loaded in one of them.

## The eleven answers, applied — 24 Aug 2026

Marked on the document's own checkboxes, then folded in. Four changed the site, two are design work,
five changed only what the document says.

| | Decision | Answer | What moved |
|---|---|---|---|
| D1 | The activity card's step | t1 type, t0 figures | Wireframe: card type up a step; Activity figure amended down to t0 |
| D2 | The email above t0 | Group 5 widens | §01: a typed identifier that is its block's primary action may sit above t0 |
| D3a | Field index weight | 700 | Contact Design: the index is bold |
| D3b | The tags | Sentence case | §03 Label now exempts text somebody typed |
| D3c | Date rail step | t-1 | §03: the role came down to meet the site |
| D4 | The organisation line | New role, Row subtitle | t0 · 400 · --lh-normal · --ink-2 |
| D5 | The row of links | New role, Standalone link | t0 · 600 · --lh-normal · --ink; the wireframe footer left --ink-2 |
| D6 | Type and space | Block gaps take the line box | --s4 → 30px, --s5 → 60px in four files |
| D7 | The hero at 320px | Two lines at t5, break authored | §13 only; not built |
| D8 | The bar at 320px | Current label + t0 abbreviated wordmark | §03 and §13; not built |
| D9 | Scope | Anything that outlives its turn | Stated on the document's opening page |

**D1 was remeasured after it was chosen.** Marked as t1 · t1 — the roles win — but three figures at t1
need about 350px of a 365px card, so the third clipped on Ride and Run. The card type stayed at t1 and
Activity figure came down to t0 instead, which is what the site had all along and needs no exception.
The lesson: a role whose instances sit in a fixed-width cell has to be measured against that cell
before the role wins the argument.

**The role set is 27.** Row subtitle and Standalone link were the last two gaps — the two things live
on the site that answered to nothing.

**D6 was the largest edit and the cheapest one.** The tokens were retuned rather than renamed, so not
a single reference had to change: `--s4` is 1.875rem and `--s5` is 3.75rem, which are one and two
body line boxes. Every block gap in the project tightened by 10px and every section gap by 4px in one
pass. The spec's own page margins moved with them, so §10's print numbers are now 30/60 with a
696 × 996px column, and the A4 fallback column is 674px.

**Part two deleted itself,** which is what it was built to do: eleven pages of candidates became one
page of record. The checkbox mechanism went with it. The specimens were redrawn as settled — tags in
sentence case, the rail at t-1, the index bold, the organisation line labelled Row subtitle — and
their §17 marks are gone, because there is nothing left to disagree with.

## Three sections closed — 25 Aug 2026

The document was comprehensive for what the project had built, not for what it might build. Three
gaps were the real ones, and two of the three folded into existing sections rather than becoming new
numbers, which is why the renumber only cost §10 onward one step.

**§08 gained inverted type.** The palette had three greys and one ground, so type on anything dark had
no declared value — the old rule only warned that nothing darker than `--sheet-alt` carried a
guarantee. The inverted set is derived, not chosen: the dark ground is `--ink` itself, and each
inverted ink is the grey clearing the same ratio on #111 that its counterpart clears on `--sheet-alt`
— `--ink-inv` #fff at 18.88:1, `--ink-inv-2` #9f9f9f at 7.13:1, `--ink-inv-3` #7c7c7c at 4.52:1, plus
`--rule-inv` #2c2c2c, which sits 1.35:1 off #111, within 0.01 of the 1.36:1 #ddd manages off white. `--ink-inv-3`
landing within nine values of `--ink-3`'s own #737373 is a nice accident.

**The first draft of that page had every derived figure wrong.** #a6a6a6 and #808080 were near-misses
that mirrored nothing; 60% over white was written as #7a7a7a, which is 4.29:1 and so *below* the 4.5
the sentence guaranteed; and `--rule-inv` was #3a3a3a on a claim about matching #ddd that was never
computed. Correcting them also exposed two pre-existing errors in §08's own palette table — it
printed 19:1, 7.5:1 and 4.6:1 under a column headed *On sheet*, while the prose says ratios are
stated against `--sheet-alt`, where the true figures are 18.10, 7.15 and 4.55. Third time this project has
shipped a number taken from arithmetic done in the wrong space (after the 54ch measure and the
76.25px "existing step"). The habit that catches it: on any page whose claim is *derived*, recompute
every printed figure from the stated inputs before the page ships.

Type on a photograph got the rule the old §08 only gestured at, and the number is arithmetic: 60%
`--ink` scrim over a pure-white pixel composites to #707070, which is 4.95:1 against white — so white
type clears 4.5:1 over **any** image. 70% gives #585858 and 7.11:1. Activity figure's `--sheet` declaration was always a
stand-in and is now `--ink-inv` over a 60% scrim.

**§09 gained buttons — and my premise was wrong.** I said `Button Design` had more variants than the
system names. It has one, and it already declares focus, active and disabled as "not yet specified"
with intended directions. So the page documents the one control and names those three as gaps rather
than inventing a variant set. It also promotes a real finding: the label is pure #000, which §08 says
is not in the system. That is arithmetic rather than preference — a `difference` blend means the
operands decide the result, and #000 over the plate with `--sheet` over the fill are the only two
declared values the blend can produce. It is now the fifth ratified exception.

**§10 Forms is new, and mostly reuse.** Nine parts, five of them existing roles doing the same job
elsewhere: the question is Row title, help text is exactly Caption, a legend is Block label. Two new
roles only — Error message and Counter — bringing the set to 29. The required marker is reuse of a
*mechanism* rather than a role: the type column already reads *string* or *email*, so a required field
reads *string · required*.

**Error is signalled without hue,** by decision — the palette has no colour and adding one red for one
message would have made the monochrome a rule with an exception. Three signals stack instead: the field
rule goes to `--rule-strong` at 2px, the message sits at t-1 · 600 · `--ink` where Caption would be
(the only 600 in a field that is otherwise 400), and the type column appends *· error* in mono. It
satisfies 1.4.1 without needing to, since there is no colour to depend on. §09's states gained invalid
and read-only, the latter distinguished from disabled on a real basis: a read-only field holds a value
worth reading.

**The exceptions section split in two** rather than being trimmed, which is §11's own rule about page
overflow applied to itself for the first time.

**A method note, earned the hard way.** Two rounds of review on that one page found seven wrong
figures, and the second round found an edit I had reported as applied that never matched — the target
string sat inside a `<span>`, so the replace silently no-op'd while an adjacent edit logged 'ok'.
Both habits are now non-negotiable on derived pages: recompute every printed figure from its stated
inputs, and assert the match count of every replacement rather than reading a neighbour's success.

**Still absent, and now knowingly:** tables get one role despite both documents being mostly tables;
nothing on motion beyond the button's reduced-motion note; nothing on hyphenating prose; and nothing on
projected type, so a deck out of this project has no floor.

## The wireframe conforms to Type System — 26 Aug 2026

The wireframe was on the new tokens, scale and leading already; what it had never taken was the
three sections closed on 25 Aug — inverted type, buttons, forms — plus four single-property
omissions. `Personal Site Landing Wireframes (archive 26 Aug 2026).dc.html` is the state before
this pass. Twenty-one replacements, every one asserted on its match count.

**The inverted set is now declared and used.** The four tokens sit beside the inks in the helmet.
The activity cards were the only dark ground in the file and were entirely off it: the two scrim
gradients were pure black rather than `--ink`, the card type and the activity figures were
`--sheet`, and the card date was a raw `rgba(255,255,255,0.85)`. All three now take `--ink-inv`.

**The date's ink is the one place the system forces a flatter design.** §08 licenses white over a
60% scrim against *any* image; a secondary inverted grey has no such guarantee — `--ink-inv-2` on
the composite this gradient makes of a white pixel measures about 2:1. So the card date is white
like the type above it, and the hierarchy is carried by size and weight (t-1 · 400 against
t1 · 600) rather than by opacity. Slightly brighter than before, and correct.

**The contact block took §10.** Its three field labels were t-1 · 600 · `--ink-3`, which answered
to nothing; the question is Row title, so they are t1 · 600 · `--ink`. The three filled values are
Mono answer — Plex at t0 · 400 · `--lh-body` · `--ink`, entered rather than placeholder ink. The
message is the one mono run allowed to wrap and is **not** clamped: §06 lets only a role inside a
repeating row clamp, and a single field is not one. Measured after: 174px of content in a 174px
box, so it fits with no slack — a longer message will need the box to grow.

**Standalone links took the §09 underline**, 1px `--ink-3` at rest moving to `--ink` on hover, on
the three footer links only. The bar's nav labels keep the bracket carve-out, and
`a:hover` no longer shifts colour, which §09 forbids.

**Four omissions, one property each.** Stat cell labels had no leading and inherited `--lh-body`
where Label asks `--lh-normal`; the source line under the cards had the same gap as a Caption; the
tags were missing Label's 0.5px tracking, which the specimen draws and the site did not; Row title
declares `text-wrap: balance` and the timeline roles did not carry it. Stat values gained the
declared `no wrap`.

**Not touched, deliberately.** The bracket buttons' `#000` label is the fifth ratified exception.
The activity placeholder's `line-height:1` is the one ratified off-token leading. The writing row's
date and read time stay in Figtree — whether group 4 reaches them is still the open question, and
moving them here would have answered it by accident. The narrow hero and bar (D7, D8) remain
unbuilt: they are design work, not conformance.

## The hero name is a band — 26 Aug 2026

From a reference screenshot the user supplied: the name runs oversized across the foot of the hero,
bleeding off both edges, with the figure standing in front of it. Only the name moved — the rule and
the positioning line stay where they were in the right column, and the portrait slot is untouched.

**Mechanically:** the hero is `position:relative` with `overflow:hidden`; the name is absolutely
placed at `bottom:0`, centred with a translate, `white-space:nowrap`, at `z-index:0`. Both columns
went to `z-index:1`, so a cutout portrait interrupts the letters and the white space around the
figure lets them through. `pointer-events:none` on the band, since it is 200px of type across a
clickable region.

**The size is off the scale, by decision.** Measured at 1440: 160px renders 1196, 170px 1270, 180px
1345, 200px 1494. The canvas is 1440, so **200px is the first 10px increment that bleeds** — 27px off
each side — and that is the rule the declaration now states rather than a number somebody liked.
Reaching it on the ladder would cost four more steps for one instance, which is the argument step 6
used to retire `--t-hero`; this is that exception coming back, and §03 says so with a date. A
`heroNameSize` tweak spans 120–300px so the bleed can be dialled without editing the declaration.

**The band sits in front of the portrait**, at `z-index:2`, so the letters cross the figure rather
than disappearing behind it — the reference's reading, asked for 26 Aug 2026. The consequence is
`--ink` type over an image whose luminance is unknown, which §08 licenses in neither direction: the
scrim table says an unscrimmed image carries no type. It stands as the project's first knowing
type-on-image divergence. Two licensed ways out if it ever matters: white at `--ink-inv` over a 60%
`--ink` scrim behind the band only, or the mirror rule — a 60% `--sheet` veil composites any pixel to
at least #999, where `--ink` clears 6.64:1 — which §08 could derive as easily as it derived the dark one.

**The portrait slides on a `portraitShift` tweak**, 0–200px, default 160. It is a `translateX` and not
a margin: as a margin the flex item shrank against its own `aspect-ratio`, which took 300px off the
hero's height as a side effect of moving the figure 240px. 200 is the cap because past it the figure
reaches the positioning line and the two columns share a `z-index`, so the sentence paints on the
sweater.

**It is `--ink` on `--sheet`, not white on the photograph.** The reference sets its name in white over
the image. §08 licenses `--ink-inv` over a 60% `--ink` scrim, and only #fff clears an arbitrary
image — the portrait here is a slot the reader fills, so its luminance is unknown and a scrim across
the hero would fight the cutout the composition depends on. Dark type on the sheet keeps a guarantee wherever the figure is not.

**t6 now has no instance**, exactly like t-2 before it was retired this morning. Not acted on: the
scale's top step is worth keeping declared while the article page (§13) is still unbuilt and could
want a page title above t5.

## t-2 retired from the site — 26 Aug 2026

Staged retirement, and the site half is done. Twelve instances across the three site files went to
t-1 and the token is out of all three declarations: the activity placeholder's label in the
wireframe, and eleven annotation labels in `Button Design` — the same eleven 13px literals step 6
had folded onto t-2 in the first place. `Contact Design` only ever declared it. The type probe's
map lost its floor entry with it.

**The documents keep it, for now.** `Type System` holds 653 references and `Semantic Mapping` eight,
which is nearly every table cell across 56 letter sheets; at t-1 those rows are 25% taller on pages
that clip in silence, so re-typesetting them is its own piece of work rather than a side effect of
this one. The scale is still nine steps and §02's t-2 row now says why: it is this document's table
density, nothing on the site, and no role ever named it. When the documents come off it the scale is
eight steps.

**The note that recorded this did not fit.** Written as its own block on §02's declaration page it
overflowed by 207px, so it became one table cell instead — which is where a reader looks t-2 up
anyway. Third time the rule holds: when a page overruns, move the fact somewhere it belongs rather
than trimming prose until it fits.

**Two pages in `Type System` were already overflowing**, found while measuring this one and not
caused by it. Both are fixed.

§08 Inverted type ran ~150px past its sheet and was clipping the tail of the scrim paragraph — the
sentence recording that Activity figure's `--sheet` was a stand-in for `--ink-inv`, which is the one
thing on that page the wireframe was changed to obey. It is now **two pages**: the inverted ink set
(p16) and type on a photograph (p16b), split where the subject changes rather than where the sheet
ran out. §08 spans 14–16, the document is 33 pages, all 32 footers renumbered in one descending pass
and the cover's contents table moved with them — eleven rows from §09 onward. §09 Buttons ran 2px
over and lost 8px of one inner gap.

**The measurement that found them was wrong twice first.** `scrollHeight − clientHeight` read 165
and then 0 on the same page, because these sheets are scaled to the viewport and the scaled box
rounds differently than the layout does. Summing children plus padding against the 1056px sheet is
the reading that held still. The working note about measuring page fit needs that caveat: measure
the content, not the container, when the container is scaled.

## The contact section is the new design — 26 Aug 2026

The wireframe's contact block — three boxed inputs with sample content in them, and a centred row
of links under it — is replaced by the design from `Contact Design.dc.html`: a numbered field list
with a 12ch mono gutter on the left, and a 400px column on the right carrying the email address and
the three links. The button and the ⌘↵ hint travel with it. The section wrapper, its
`scroll-margin-top` and its comment anchor are unchanged, so the scroll spy and the sticky bar
do not know anything happened.

**Five type corrections went in during the port**, each one an instance the source file had off its
role:

- The **field index** inherited `--ink-3` from the gutter and had no tabular figures. §03 declares
  it at `--ink` — bold *and* dark is what makes the number outrank the type beneath it.
- The **0 / 2000** counter was inheriting the gutter's t-1 with no tabular figures. It gained the
  figures, and then the role came to it: Counter is **t-1** as of 26 Aug 2026, amended from t-2 in
  §10. The gutter is index, type and counter in one column, and a third size there is a step nobody
  reads as meaningful — weight and ink already separate the three. Same move as D3c brought the date
  rail down to meet the site. One instance in the project, so the amendment cost one row.
- The **questions** gained the `text-wrap: balance` Row title declares.
- **Or skip the form** set no leading; Block label asks `--lh-normal`.
- The **three links** underlined in `--rule` at #ddd. §09's link is a 1px `--ink-3` underline moving
  to `--ink`, which is also the mechanism the footer links took earlier today, so the file now has
  one underline rather than two.

**The form shows its empty state**, which the old block did not: placeholder answers at `--ink-3`
with a caret on the first row. That is §09's rule about entered text — `--ink-3` is the placeholder
and `--ink` means a field has content — so the state is now legible from the ink alone. The sample
name, email and message that used to be in this section are gone with the boxes.

**Contact Design's one tweak came across and was then retired**, 26 Aug 2026. `matchQuestionSize`
raised the answers to the question's step so a row read as an exchange at one voice; the answer is
that the question stays a step above. Every other row in the design sets its title above its content
— Row title t1 over Row subtitle t0 in the timeline, Feature title t3 over the excerpt in the writing
rows — so matching them would give one shape two rules. The answer is already distinguished on three
axes (Plex against Figtree, 400 against 600, `--ink-3` against `--ink`), and size would be a fourth
signal doing settled work. t0 is also the body step, and Mono answer is the one mono run that wraps,
which makes it running text. If the one-voice reading ever wins, the honest way there is dropping the
question to t0 rather than raising the answer — which costs Row title its step, which is the first
argument again. `Contact Design` keeps the tweak; it is the exploration record.

`Contact Design.dc.html` is untouched and is still the place that document lives. CLAUDE.md's plan
to turn it into a section spec is unaffected by this port.

## Four more — 26 Aug 2026

Same day, second pass. The focus ring is the one that came with a control.

**§09's focus ring was declared and then removed, by decision.** It went in as 2px `--ink` at 2px
offset on `:focus-visible`, with a `focusRings` tweak that forced every ring visible at once for
review. Both are out again at the user's request, 26 Aug 2026 — the rings are not wanted here.
So focus falls to the browser default in this file, and §09's ring is a knowing divergence rather
than an omission. The nav labels' carve-out is unaffected: their inline `outline:none` never
depended on the rule.

**The bracket buttons sit behind reduced motion.** One media query kills transitions inside
`[data-metaball]`, brackets and spill blobs alike; the hover values still apply, so what remains is
§09's instant fill. `!important` is load-bearing here — the blob transitions are inline styles
written by `renderVals`, and nothing else outranks them.

**The type probe was lying.** Its px→token map still read the pre-step-6 names, so hovering 20px
type reported t1 where the system says t0. Rebuilt against the nine live steps, t-2 at 13 through
t6 at 76.

**§12's fallback replaced the cascade.** The body stack was five families deep, which is four
untuned outcomes; it is now Figtree, then a `Figtree Fallback` face that maps to Arial at
`size-adjust: 96.4%`. The ascent and descent overrides §12 also asks for are **not** in — they need
the same measurement and it has not been taken, so the comment says so rather than carrying an
invented number. The mono stack is untouched: its per-instance `font-size-adjust: 0.5` already
normalises whatever face answers.

**Still unapplied, both design work.** §14's narrow-screen mechanism — the page is still
`min-width: 1440px` with no `clamp()` on a display role — which waits on D7 and D8 being drawn.
And Semantic Mapping's A–H: everything is a div except the sticky bar.

## Retiring the old specification — 25 Aug 2026

`Typography Specification` is stamped **superseded** on its cover, with a pointer to `Type System` and
a plain statement that where the two disagree the new one is right. Kept in the project as history
rather than deleted — the corrections it records are worth being able to find — but no longer
maintained. It had already drifted: D6 retuned `--s4` and `--s5` in four files and this was not one of
them, so it still declares 40 and 64, and it predates the inverted set, forms, buttons, the four new
roles and the corrected §08 ratios. Two overlapping documents that disagree is the two-population
problem step 6 closed, except this time the stale one is the one titled *Specification*.

**`Semantic Mapping` was the opposite case** — the one companion document still doing a job, since
`Type System` §16 deliberately points at its role-to-element table instead of restating 29 rows. It
took the new tokens, gained `--t6` and `--measure` (which it had never carried), and gained the four
roles named in the last two days: Row subtitle → `p` (D4), Standalone link → `a` (D5), Error message →
`p` and Counter → `output` (§10). `output` is the interesting one — a character counter is a calculated
result, which is exactly what that element is for, and nothing else in the project uses it.

**The insertion broke the table and the check missed it.** The helper that added those four rows spliced
each one inside the preceding row rather than after it — it stopped at the third cell's closing tag
instead of the row's own — so every new role became a fourth flex item in an existing row. Nothing
looked wrong vertically, and the fit probe only measured `scrollHeight − clientHeight`, so it reported
a clean page while *Counter* sat 347px off the right edge of an `overflow:hidden` sheet, silently
clipped. That is §11's documented failure mode reproducing itself in the check meant to catch it. The
probe now measures both axes, and the padding change made in that pass was treating an overflow the
misplacement had faked.

**Then a third pass found three more, all of them things this turn had asserted rather than checked.**
The table claimed to hold all twenty-nine roles and held twenty-seven — `Date rail` and `Activity
figure` appeared nowhere in the document, which matters because `Type System` §16 defers to this table
instead of restating it, so both documents were silent on the same two roles. Added as `time` and
`li`: the rail is a machine-readable date, and the card figures are a list of measurements with no
labels, so `dd` without `dt` would have been wrong. The page now says what is true — twenty-nine roles
across thirty-one rows, since `Label` carries three different elements.

The cover's contents table was off by one from *C The nav labels* onward, because C runs to three pages
and the table said two; it also contradicted its own lede, which correctly cited page 19. Rebuilt
against the real footers. And the lede still pointed readers at "the typography specification" —
retired in this same turn, and missed because the earlier sweep looked for *type spec* and this one was
spelled out in full.

**The table now runs 4px rows**, not the 8px it started at. Thirty-one rows and two headers on one
sheet is a real density decision rather than a squeeze, and it is in character: `Type System` §10 puts
table cells and legends at the bottom of the scale precisely because they are not sentences. My earlier
note that the table "keeps its original row rhythm" was wrong when written — the 8px was never
restored, and saying so now is cheaper than pretending otherwise.

Its page 22 also stopped arguing about a merge that finished three days ago: the six label roles became
four in step 5, and the page now says why the merge kept an eyebrow and a column header apart — heading
structure and table structure are not interchangeable however alike they look.
