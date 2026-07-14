---
phase: 06-accessibility-rtl-typography-hardening
plan: 06
subsystem: ui
tags: [accessibility, aria, focus-management, dialog, keyboard, learn-page, athar]

# Dependency graph
requires:
  - phase: 06-01
    provides: "the a11y probe suite (a11y-keyboard/a11y-dialogs) with the state-in-name + overlay-contract assertions todo-staged"
  - phase: 06-04
    provides: "AW._trapFocus(overlayEl)→untrap() shared containment helper + AW.sheet(html, label) named/focus-into/trapped sheet"
provides:
  - "every .onode carries a state-in-name aria-label ({label}, {state phrase}) composed in nodeHtml() — the STATE.md Pending Todo (path-node accessible names) is closed"
  - "#streakStrip is a native <button> (working Enter/Space) with a page-authored UA-chrome reset"
  - "the daily-ayah <section> keeps its isolated scripture reading (law 3) and exposes a native inner <button class=oayah-cite> opening AW.sheetRef (R-9)"
  - "the .npop node popup dialog contract: aria-modal + aria-labelledby→.np-label + tabindex=-1 + focus-move-on-open + AW._trapFocus + focus-return-if-connected"
  - "the .ofest Festival: AW._trapFocus self-loop + focus-return to the chest node re-queried after render() (Pitfall 6)"
  - "learn sheet callers pass natural AW.sheet(html, label) accessible names"
affects: [06-07 (the human accessibility gate walk), phase-7 (PWA/service-worker precache of learn.html)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "consume-not-reimplement: the two page-owned overlays (.npop, .ofest) attach the ONE shared AW._trapFocus helper — never a bespoke trap"
    - "R-9 scripture-safe affordance: keep the sacred <section>/.ayah isolated reading; move the operable, keyboard/SR-owning control to a native inner button"
    - "page-authored @layer screens block in learn.html for the two conversions' seam styling (zero new tokens/hex; the register :focus-visible ring rides in from the engine grammar)"

key-files:
  created: []
  modified:
    - "learn.html — node state-in-name, streak-strip button + reset, ayah Read-the-citation button + wiring, popup dialog contract + trap + return, Festival trap + focus-return, sheet-caller labels"
    - "scripts/tests/a11y-keyboard.test.js — un-todo state-in-name + native streak strip + native ayah affordance (residue 0)"
    - "scripts/tests/a11y-dialogs.test.js — un-todo the 5 popup + 2 Festival assertions (residue 0)"

key-decisions:
  - "Dropped the ayah <section>'s stale aria-label along with role=button/tabindex — an aria-label on a non-interactive <section> would create a spurious named-region landmark; the affordance name now lives on the oayah-cite button"
  - "Threaded nodeId (not the untrap disposer) as a 3rd closeFestival arg; stored the untrap on overlay.__festUntrap to avoid a 4th arg through both close call sites"
  - "Fixed id 'npLabel' on the singleton popup's .np-label (only one .npop ever exists → no duplicate-id risk)"
  - "comingSoonSheet refactored to build html into a var and call AW.sheet(html, label) on one line — gives the tab-name accessible name AND a single-line AW.sheet(...,...) the verify greps for"

patterns-established:
  - "Focus-return-if-connected: closePop returns focus to the trigger only when popNode.isConnected, skipping the render() detach path"
  - "Festival focus-return re-queries app.querySelector('.onode[data-id=nodeId]') AFTER render() rebuilds the path — never the destroyed pre-render node"

requirements-completed: [ACC-01, ACC-02]

# Metrics
duration: 30 min
completed: 2026-07-14
---

# Phase 6 Plan 06: Learn Front-Door A11y Hardening Summary

**Every path node announces its state, the streak + daily-verse cards are keyboard-operable (the ayah keeps its reverence), and both page-owned overlays are proper dialogs that trap focus and hand it back — flipping the last a11y-keyboard + a11y-dialogs `{ todo }` assertions to GREEN (whole suite todo 0).**

## Performance

- **Duration:** ~30 min
- **Started:** 2026-07-14T12:15Z (approx)
- **Completed:** 2026-07-14T12:45Z
- **Tasks:** 3 (each TDD RED→GREEN, one atomic commit)
- **Files modified:** 3

## Accomplishments
- **Node state-in-name (D-64/ACC-02):** `nodeHtml()` composes `aria-label="{nd.label}, {state phrase}"` from `data-kind` + `data-nstate` per the UI-SPEC state-phrase table (lesson/review locked→"locked", active→"available", done→"complete, N of 3 stars"; chest locked→"locked", available→"ready to open", done→"opened"). The STATE.md Pending Todo is closed.
- **The two conversions (D-62/R-9):** `#streakStrip` div→native `<button>` (working Enter/Space); the daily-ayah `<section>` keeps its isolated `.ayah` scripture reading and gains a native inner `<button class="oayah-cite">Read the citation</button>` — quiet Courier marginalia on the Orbit ground, the register gold focus ring, a hairline underline as the only affordance cue (law 3/7 respected — the sacred Arabic is never flattened into a control label).
- **Node popup dialog contract (D-63):** `.npop` gains `aria-modal` + `aria-labelledby`→`.np-label` id + `tabindex="-1"`; focus moves onto the dialog on open (the locked slip has no CTA); `AW._trapFocus` attached and disposed in `closePop`; focus returns to `popNode` when `popNode.isConnected` (skipped in the render() detach path).
- **Festival trap + focus-return (D-63/Pitfall 6):** `openFestival` attaches the shared trap (self-loop on `.ofest-close`); `closeFestival` disposes it, keeps the shipped `render()`, then re-queries the chest node by `data-id` AFTER render() and focuses it. The claim-before-open +25 ordering and the shipped role/aria-modal/name/Escape/focus-on-open are untouched.
- **Sheet-caller names (R-10):** `openStreakSheet`/`openNoorSheet`/`openSwitcher` + the Practice/Profile/More coming-soon sheets pass natural `AW.sheet(html, label)` accessible names.

## Task Commits

Each task was committed atomically (TDD RED confirmed before each GREEN):

1. **Task 1: node state-in-name + streak-strip button + ayah Read-the-citation** — `c82e6df` (feat) — un-todo a11y-keyboard (3 assertions) → residue 0
2. **Task 2: node popup dialog contract — aria-modal + name + focus + trap + return** — `bc24a85` (feat) — un-todo a11y-dialogs popup (5 assertions) → residue 2
3. **Task 3: Festival trap + focus-return-after-render + sheet-caller names** — `3ea3acb` (feat) — un-todo a11y-dialogs Festival (2 assertions) → residue 0; whole suite todo 0

**RED confirmations:**
- T1: 3 keyboard assertions failed on un-todo (exit 1) before implementation.
- T2: 5 popup assertions failed (`fail 5`) before implementation.
- T3: 2 Festival assertions failed (`fail 2`) before implementation.

## Files Created/Modified
- `learn.html` — nodeHtml aria-label composition; streak-strip div→button; ayah section (drop role/tabindex/aria-label) + inner oayah-cite button + wiring; a page-authored `@layer screens` `<style>` block (button reset + oayah-cite marginalia); popup dialog contract in openPopFor/closePop (+ module-scope `popUntrap`); Festival trap + focus-return in openFestival/closeFestival (nodeId threaded); sheet-caller labels.
- `scripts/tests/a11y-keyboard.test.js` — un-todo state-in-name + native streak strip + native ayah affordance.
- `scripts/tests/a11y-dialogs.test.js` — un-todo the 5 popup + 2 Festival assertions.

## Decisions Made
- **The oayah-cite styling + streak-strip reset live in learn.html, not the engine CSS.** The plan scoped this to `learn.html` + the two test files (never `shared/awba-engine.js/.css`). The new visible control needs styling and the div→button conversion needs a UA-chrome reset, so a minimal `@layer screens` `<style>` block was added to learn.html (a content block for the already-declared `screens` layer — never the name-list order line). This matches the UI-SPEC S6 ("the only new CSS is @layer screens composition") and learn.html's own header note. Zero new tokens, zero new hex — every value is a shipped variable (`--font-marg`, `--fs-marg`, `--paper-62`, `--paper-45`, `--cream`). The register `:focus-visible` gold ring rides in automatically from the engine grammar (never touched here).
- **Dropped the ayah section's `aria-label`** (see Deviations).
- **Festival untrap stored on `overlay.__festUntrap`**, nodeId threaded as a 3rd `closeFestival` arg through both the Escape closure and the click handler — cleaner than a 4th arg or a module-scope var that could leak across overlays.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Dropped the ayah `<section>`'s stale `aria-label`**
- **Found during:** Task 1 (ayah conversion)
- **Issue:** The plan directed dropping `role="button"`/`tabindex` from `<section id="ayahHost">` but was silent on its `aria-label="Open the full citation for this verse"`. Leaving an `aria-label` on a now-non-interactive `<section>` turns it into a spuriously-named region landmark in the SR landmark tree and misdescribes the container (the section no longer "opens" anything — the button does).
- **Fix:** Removed the `aria-label` alongside `role`/`tabindex`; the affordance name now lives on the native `oayah-cite` button ("Read the citation"), and the `.ayah` keeps its isolated scripture reading.
- **Files modified:** learn.html
- **Verification:** a11y-keyboard GREEN (ayah affordance present); rtl-audit GREEN (`.ayah` still rtl+isolate+Amiri Quran); render-smoke + contrast-audit GREEN; the T1 verify's `! grep -qE 'id="ayahHost"[^>]*role="button"'` passes and `grep -qE 'aria-label'` still matches (HUD/chip/nav/streak labels remain).
- **Committed in:** c82e6df (Task 1 commit)

**2. [Rule 3 - Blocking] Added a UA button-chrome reset for `#streakStrip` + affordance styling for `.oayah-cite`**
- **Found during:** Task 1 (streak-strip + ayah conversions)
- **Issue:** Converting `.ob-streak` div→`<button>` without a chrome reset would surface the browser default button border/background/padding (the engine `.ob-streak` class only sets flex/gap/animation, not a reset) — a visual regression. The new `oayah-cite` control needs its quiet-marginalia styling. The engine CSS is out of scope for this plan.
- **Fix:** A minimal page-authored `@layer screens` `<style>` block in learn.html: `#streakStrip` chrome reset (appearance/background/border/padding/font/color) and `.oayah-cite` marginalia styling (Courier `--font-marg`, `--fs-marg`, `--paper-62`, hairline underline, 44px tap target, `:active` paper-press, reduced-motion + hover-media guards). Zero new tokens/hex.
- **Files modified:** learn.html
- **Verification:** render-smoke `SMOKE OK learn.html`; contrast-audit `CONTRAST OK` (the `--paper-62`-on-Kiswah button text ≈6.7:1, well above 4.5:1); no gated literal (incl. `view-transition-name`, `gold-bg`, `poppins`, `confetti`) in learn.html; a11y-keyboard streak-strip GREEN.
- **Committed in:** c82e6df (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 missing-critical, 1 blocking).
**Impact on plan:** Both are within the sanctioned `learn.html` seam and inherent to the tasks (a scripture-safe section + a native operable button/control). No mechanics/copy/layout redesign; no scope creep; the engine JS/CSS was never touched.

## Issues Encountered
None. All three tasks executed RED→GREEN on the first implementation pass; every plan `<verify>` block passed verbatim.

## Verification (final)
- **Full suite:** `tests 154`, `pass 154`, `fail 0`, `todo 0`.
- **Todo residues:** a11y-announce 0 / a11y-dialogs 0 / a11y-keyboard 0.
- **localStorage:** learn.html `0` · shared/awba-engine.js `13` (unchanged).
- **Audits:** render-smoke exit 0 (`SMOKE OK learn.html`), rtl-audit exit 0 (`RTL OK`), contrast-audit exit 0 (`CONTRAST OK`).
- **Gated literals in learn.html:** all 0, including `view-transition-name` (the shared-element morph declarations remain owned by the 05-04 engine, never learn.html).
- **Preserved:** the +25 claim-before-open ordering (`__awbaClaimChest` sets +25 BEFORE `openFestival`) — the +25-survives-Escape test stays GREEN; the shipped popup singleton/outside-tap/Escape/aria-expanded and Festival role/aria-modal/name/Escape/focus-on-open scaffolds untouched.

## Known Stubs
None introduced. The Practice/Profile/More coming-soon sheets and the `unverified · pending review` scripture pills are pre-existing by-design states (LRN-06/LRN-07, owner-ledger), not new stubs.

## Doubts for the 06-07 human gate
- **R-8 (carried from the UI-SPEC):** the review timer's non-colour cue remains announcement-only — no visible Courier seconds readout was added (a deferred owner-ledger choice). Not in this plan's scope, restated for the gate walk.
- **oayah-cite affordance discoverability:** on touch devices (no `:hover`) the button reads as a quiet underlined marginalia line under the ayah pill with a 44px tap target. This was tuned deliberately quiet under the ayah's reverence budget (law 3/7) — worth a human eyes-on at the gate walk to confirm the "Read the citation" invitation reads clearly enough without competing with the scripture.
- **`<button>` with `<div>` children on `#streakStrip`:** valid in the DOM (the HTML parser nests them; `tagName === 'BUTTON'`), renders and tests GREEN, but is technically a phrasing-content violation. Left as-is to preserve the shipped `.ss-line`/`.ss-const` block structure per the plan ("keep the classes + block styling").

## Next Phase Readiness
- ACC-01 (keyboard operability + the two conversions) + ACC-02 (node names) + D-63 (popup/Festival focus management) are live on the learn front door with mechanics + reverence intact. The whole a11y probe suite is GREEN with `todo 0`.
- Ready for **06-07** (the human accessibility gate walk) to re-confirm the flipped assertions and evaluate the doubts above.

## Self-Check: PASSED
- `06-06-SUMMARY.md` exists on disk.
- All three task commits present: `c82e6df`, `bc24a85`, `3ea3acb`.
- Full suite `fail 0` / `todo 0`; residues 0/0/0; render-smoke + rtl-audit + contrast-audit exit 0; no gated literal (incl. `view-transition-name`) in learn.html; localStorage learn 0 / engine 13.

---
*Phase: 06-accessibility-rtl-typography-hardening*
*Completed: 2026-07-14*
