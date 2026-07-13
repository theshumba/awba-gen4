---
phase: 05-learn-page-cross-page-view-transitions
plan: 02
subsystem: ui
tags: [learn-page, orbit-register, ring-hero, daily-ayah, scripture-law, continue-card, weekcal, port-audit, view-transitions-precursor]

# Dependency graph
requires:
  - phase: 05-01
    provides: "AW.atomsDone / NODE_ATOMS (Σ=61), AW.dailyIndex (day-of-year), AW.muteBtnHtml/AW.bindMuteBtn exports, render-smoke.mjs findPages() discovering root learn.html"
  - phase: 04
    provides: "the AW.* primitive library (ringSVG static, deriveNodeState, weekCal, sheetRef, icon/UNIT_ICON/GLYPHS, sheet singleton), @layer screens block, thermal/scripture-law/celebration CSS, the ported lessons/reviews the continue card + node hrefs point at"
provides:
  - "learn.html at repo ROOT — the Orbit front door (S1/S2): root-relative head, HUD marginalia, static Ring hero, re-voiced streak strip + AW.weekCal() constellation, navy continue card, daily-ayah scripture card"
  - "the UNITS node data ported verbatim (color dropped) + the flat CNT-03 unlock sequence + per-node unit meta"
  - "the DAILY 7-verse pool spliced byte-verbatim from Gen-3, day-of-year rotation via AW.dailyIndex, tap → AW.sheetRef cite sheet"
  - "scripts/port-audit.mjs checkDailyFidelity() — a SHA-gated DAILY-pool byte-fidelity check (DAILY BYTES OK / DRIFT)"
  - "new @layer screens content: page ground layout, course-chip island, ring/streak/continue composition, daily-ayah scripture card"
affects: [05-03, 05-04, 05-05, 05-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "learn.html is a page (not an AwbaLesson cfg): ONE inline classic <script> holds UNITS/DAILY + render() + wiring; consumes shipped AW.* only"
    - "root-relative head (shared/…, NO ../) mirroring preview.html — the highest-risk byte error, avoided"
    - "cream Page-object islands (course-chip + continue-card Farag squares) are the only place crimson touches near the Orbit ground"
    - "content sits above the grain::after via a positioned .ob-shell wrapper; scripture card is an opaque --go:0 Kiswah panel (clean ground, law 3)"
    - "DAILY byte-splice + a dedicated port-audit SHA gate (splice, never retype scripture)"

key-files:
  created:
    - "learn.html — the Orbit front door (HUD + Ring hero + streak/constellation + continue card + daily ayah)"
    - ".planning/phases/05-learn-page-cross-page-view-transitions/05-02-SUMMARY.md"
  modified:
    - "shared/awba-engine.css — new @layer screens content only (order line untouched, count stays 1)"
    - "scripts/port-audit.mjs — checkDailyFidelity() DAILY-pool SHA gate wired into main()"

key-decisions:
  - "Ring hero renders via AW.ringSVG({ atomsDone: AW.atomsDone(AW.state()), size: 300 }) with animateFrom OMITTED — fully static on load (law 9); the width cap lives on the wrapper because shipped @layer motion .ring{width:100%} outranks @layer screens"
  - "The continue-card chapter-term is the English unit title in a cream Farag square (R-6 MVP fallback — no Arabic term is invented; owner/scholar-sourced later)"
  - "The daily-ayah card is an opaque Kiswah panel with --go:0 so scripture sits on clean ground on the dark register; strongest cream ink + the one permitted glow reused verbatim (rgba(244,240,247,.30))"
  - "The daily ayah cite tap builds a one-entry refs object (no grade) → AW.sheetRef renders the .r-ar.ayah Amiri Quran face + pending pill only"

patterns-established:
  - "Pattern: per-node unit meta (un + English title) built alongside the flat unlock array for the continue card + course chip, without mutating node objects"
  - "Pattern: constellation off-days re-based to --paper-45 on the Orbit dark ground (the shipped .weekcal --ink-62 is for the cream sheet); lit day stays gold via a higher-specificity .here override in the later @layer screens content"

requirements-completed: [LRN-01, LRN-05]

# Metrics
duration: ~28min
completed: 2026-07-13
---

# Phase 5 Plan 02: Learn-page Orbit front door Summary

**learn.html at repo root renders the Orbit home — HUD marginalia, a STATIC Ring hero, the re-voiced streak strip + AW.weekCal() constellation, a navy continue card pointing at the live active node, and the day-of-year daily ayah under scripture law — all over shipped AW.* primitives with @layer-screens-only CSS.**

## Performance

- **Duration:** ~28 min
- **Started:** 2026-07-13T22:27:00Z
- **Completed:** 2026-07-13T22:54:00Z
- **Tasks:** 3
- **Files modified:** 3 (1 created, 2 modified)

## Accomplishments
- `learn.html` created at repo ROOT with a `preview.html`-shaped root-relative head (no `../`), `<main class="reg-orbit grain">`, and one inline classic script — render-smoke discovers it and loads it with zero console errors and a reg-orbit root.
- UNITS ported verbatim (the retired `color` field dropped; the curly-apostrophe U3-m4 label "The deniers’ twist" byte-matched to Gen-3); HUD marginalia via the shipped `.ls-hud`/`.hstat` (course-chip cream Farag island + active-unit scene icon, returns/noor stats, the shared 44px mute toggle bound via `AW.muteBtnHtml`/`AW.bindMuteBtn`).
- Static Ring hero (`AW.ringSVG` with NO `animateFrom` — law 9, the only macro map), the re-voiced Courier streak line + `AW.weekCal()` constellation (lit gold on-days, un-lit powder off-days, never a gap/miss), and the navy continue card pointing at the first `active` node from `AW.deriveNodeState` ("Circuit 1 · The Foundation" → `lessons/u1-m1.html` on a fresh install, matching the first-run spec) with a gold-ghost "Continue the path" `.btn`.
- The 7-verse DAILY pool spliced byte-verbatim from Gen-3 (SHA `e23fd7cf3085dfe8adb8c090fcd874113588fe765228586ab643d4f7572f8711`), day-of-year rotation via `AW.dailyIndex(new Date(), DAILY.length)`, rendered under scripture law (Amiri Quran `.ayah`, `--go:0` clean Kiswah panel, strongest cream ink + the one permitted glow, translation + source + "unverified · pending review" pill, nothing celebratory adjacent), tap opening the shipped `AW.sheetRef` cite face-split; a `checkDailyFidelity()` SHA gate added to `port-audit.mjs` (prints `DAILY BYTES OK`, exits non-zero on drift).

## Task Commits

Each task was committed atomically:

1. **Task 1: learn.html scaffold + UNITS port + HUD marginalia** — `9dbefa6` (feat)
2. **Task 2: static Ring hero + streak strip + constellation + continue card** — `8722e3d` (feat)
3. **Task 3: daily ayah under scripture law + DAILY splice + port-audit DAILY gate** — `34535a9` (feat)

**Plan metadata:** committed separately with this SUMMARY + STATE + ROADMAP.

## Files Created/Modified
- `learn.html` — the Orbit front door: root-relative head, UNITS/DAILY data, render() composing HUD → Ring hero → streak/constellation → continue card → daily ayah, mute + ayah-cite wiring.
- `shared/awba-engine.css` — new `@layer screens` content only: `#app.reg-orbit` layout + shell column, `.ob-shell`/`.ob-wrap` (above-grain), the course-chip island, the ring/streak/continue composition, the daily-ayah scripture card. The `@layer` order line is untouched (count stays 1); token-only, zero new hex (the permitted-glow `rgba(244,240,247,.30)` is reused verbatim from the shipped scripture-glow rule).
- `scripts/port-audit.mjs` — `DAILY_RE` + `dailyRegion()` + `checkDailyFidelity()`; wired into `main()` before the page set so the gate always runs.

## Decisions Made
- Ring width cap placed on the wrapper (`.ob-ringcap { width: min(300px, 74vw) }`) because the shipped `.ring { width: 100% }` lives in `@layer motion` and outranks any `@layer screens` width rule — capping the container is the only clean way to size the static hero responsively (320→desktop).
- The daily-ayah card paints an opaque `--kiswah` background (with `--go:0`) so the page grain never shows behind scripture on the dark ground — the dark-register equivalent of the shipped `.scard` opaque-cream treatment.
- Course-chip + continue-card Farag squares are cream Page-object islands (kiswah ink, `--icon-accent: --crimson` on the chip) — the only place near the Orbit ground where the Page palette applies; crimson never touches the Kiswah ground itself.
- Constellation off-days re-based to `--paper-45` (the shipped `.weekcal .day` uses `--ink-62`, invisible on dark); the lit `.here` gold dot kept via a higher-specificity override placed later in `@layer screens`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Verify-command false positive on verbatim content] Task 3 forbidden-substring grep matches the byte-verbatim U3-m3 node label**
- **Found during:** Task 3 (daily ayah + forbidden-substring guard)
- **Issue:** The Task 3 verify line `! grep -qE '(dab|thread|plate|rosette|view-transition-name)' learn.html` matches the substring `thread` inside the byte-verbatim Gen-3 node label `'One religion, one thread'` (U3-m3). The label is content — CLAUDE.md content-integrity + D-53 ("labels port verbatim") forbid editing it, so the grep as literally written cannot pass without corrupting content.
- **Fix:** Kept the label byte-verbatim (content law takes precedence over the plan proxy). Confirmed the invariant the grep actually protects genuinely holds via an intent-precise check — `grep -nE 'class="[^"]*\b(dab|thread|plate|rosette)\b|view-transition-name|viewTransitionName|\.(dab|thread|plate|rosette)\b' learn.html` returns **none**: there is no celebration-primitive class/selector and no view-transition-name anywhere in learn.html. The ONLY forbidden-substring match is the content label at line 54.
- **Also fixed inline (my own text, not content):** my daily-ayah comment originally contained the literal `view-transition-name`; reworded to "it never morphs across pages (D-58)" so the only residual match is the immutable content label.
- **Files modified:** learn.html (comment reword only; label unchanged)
- **Verification:** `grep -noE 'dab|thread|plate|rosette|view-transition-name' learn.html` → a single hit, `54:thread` (the verbatim label); intent-precise check → none; render-smoke SMOKE OK; suite 107/107.
- **Committed in:** `34535a9` (Task 3 commit; noted in the commit body)

---

**Total deviations:** 1 (Rule 1 — a verify-command proxy false-positive on verbatim scripture-adjacent content; no code/content defect).
**Impact on plan:** No scope change. Every other Task 3 verify clause passes verbatim (`AW.dailyIndex(new Date()`, `class="…ayah"`, the pending-pill string, the port-audit `DAILY` gate + `DAILY BYTES OK` with non-zero-on-drift, render-smoke clean). The single failing clause is a documented false positive on immutable Gen-3 content; the real invariant (no celebration primitive, no VT name in learn.html) holds.

## Issues Encountered
- A first Task-1 verify run failed because a scaffold comment contained the literal word "localStorage" (tripping `! grep -q 'localStorage'`). Reworded the comment to "no raw storage-key access"; all state is read through `AW.state()` only (D-24). No behaviour change.

## Threat Register Adherence (this plan's <threat_model>)
- **T-05-02a (scripture byte-fidelity — mitigate):** the DAILY pool is spliced byte-verbatim (˹ ˺ intact) and the new `checkDailyFidelity()` SHA gate proves byte-identity (`DAILY BYTES OK`, exit non-zero on drift).
- **T-05-02b (CDN/font leakage — mitigate):** the head is root-relative self-hosted; the `fonts.googleapis` gate is clean.
- **T-05-02c (DOM XSS via innerHTML — mitigate):** only author-controlled strings (node labels, verbatim scripture, verbatim source line) reach any innerHTML sink; no user/URL input is interpolated on this page (no hash handling this plan).
- **T-05-SC (npm installs — accept):** zero packages added.

## Known Stubs
- The HUD course-chip / returns / noor taps are rendered but not yet wired to their sheets — wiring lands in 05-05 (LRN-06), per the plan ("render them now, do not fake a sheet"). Not a goal-blocking stub for LRN-01/05 (the HUD marginalia renders truthfully; the daily-ayah cite tap IS wired this plan).

## Next Phase Readiness
- The spine is in place for 05-03 (unit headers + winding path + node grammar + earned gold thread + Ibrahim line), which hangs off the same UNITS/flat/meta + `AW.deriveNodeState` already computed in `render()`.
- 05-04 wires cross-document View Transitions via the shared engine only — learn.html deliberately carries NO `view-transition-name` (D-58); the daily ayah must never receive one.
- Doubts for the 05-06 human gate:
  1. **Ring width / breathing on very small screens** — the hero is capped at `min(300px, 74vw)`; confirm it doesn't crowd the HUD or streak on a 320px device.
  2. **Continue-card Farag square** — currently the English unit title in a cream island (R-6 fallback). The verified Arabic chapter-term is an owner/scholar-sourced input; confirm the English fallback reads acceptably until then.
  3. **Daily-ayah glow strength on the Orbit ground** — reuses the exact shipped moonmilk glow value; confirm it reads reverent (not neon) at real device brightness, and that the opaque Kiswah panel doesn't read as a seam against the grain.
  4. **The `thread` verify false positive** — flag the Task 3 forbidden-substring grep so a future phase can scope it to class/attribute context (the verbatim label "One religion, one thread" will always trip a bare substring match).
  5. **Continue-card copy shape** — "Continue" kicker + "Circuit {n} · {English title}" + node label + "Continue the path" button; confirm the voice matches the UI-SPEC intent.

## Self-Check: PASSED

- Files verified present: `learn.html`, `shared/awba-engine.css`, `scripts/port-audit.mjs`, `05-02-SUMMARY.md`.
- Commits verified in history: `9dbefa6` (Task 1), `8722e3d` (Task 2), `34535a9` (Task 3).
- Gates: render-smoke `SMOKE OK learn.html` (zero console errors, reg-orbit root); `port-audit` exit 0 with `DAILY BYTES OK`; suite `node --test scripts/tests/*.test.js` = 107/107 (fail 0); `@layer` order-line count = 1.

---
*Phase: 05-learn-page-cross-page-view-transitions*
*Completed: 2026-07-13*
