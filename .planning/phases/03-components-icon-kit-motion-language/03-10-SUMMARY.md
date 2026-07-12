---
phase: 03-components-icon-kit-motion-language
plan: 10
subsystem: ui
tags: [prayer-clock, sky, data-sky, css-tint, reduced-motion, awba-prefs, node-test, athar]

# Dependency graph
requires:
  - phase: 03 (03-06 tokens + base re-ground)
    provides: the §3.2 [data-sky] tint painter over the Kiswah Orbit ground + the --apricot token
  - phase: 03 (03-09 motion vocabulary)
    provides: the @keyframes breathe + .sky-breathe ambient + the dual-trigger reduced-motion quieting
  - phase: 02 (state/prefs layer)
    provides: AW.prefs.get(k,d) get-with-default seam + AW.state() stars + the D-16 local-date discipline
provides:
  - a PURE now->temperature function (AW.skyTemp) mapping the local prayer clock to five canvas temperatures
  - manual prayerTimes + skyMode:"manual"|"off" prefs (default schedule) with NO awba_prefs schema bump
  - boot wiring that stamps document.documentElement.dataset.sky (+ mirrors onto the .reg-orbit home shell)
  - the --dawn subordinate horizon-apricot progress glow (AW.skyDawn + .reg-orbit::before), reduced-motion-safe
affects: [03-11 preview, 03-12 human visual gate, Phase 5 Learn page (wires exact atomsDone into the Ring caller + prayer-times settings)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pure now->temperature function of (now, times, mode); LOCAL getHours/getMinutes only, never UTC — deterministic with fixed-now fixtures"
    - "get-with-default extension of defaultPrefs (add fields, do NOT bump CURRENT) so existing v1 blobs load untouched"
    - "hoisted function declarations near RING so the parse-time boot-stamp above can call them"
    - "static ambient information (the tint) survives reduced motion; only the breathe pulse is gated off"

key-files:
  created:
    - scripts/tests/sky.test.js
  modified:
    - shared/awba-engine.js
    - shared/awba-engine.css

key-decisions:
  - "skyTemp uses Dhuhr as the dawn->day boundary (Duha is not in the manual times) — matches the plan's fixed-now behavior fixtures exactly; asr is stored but not a temperature boundary"
  - "SKY functions authored as hoisted `function` declarations near RING (per placement law) while the parse-time boot-stamp block calls them — hoisting resolves the parse-order gap without a second DOM touch or a timer"
  - "boot stamps dataset.sky on BOTH <html> (canonical, §7.2) and any .reg-orbit home shell, because the §3.2 painter is .reg-orbit[data-sky]::after (attribute must sit on the ground element for the ::after to paint)"
  - "--dawn boot value derived from a coarse completed-nodes proxy (nodes/19*65) until Phase 5 wires the exact atomsDone into the Ring caller; skyDawn stays a pure min(0.6, atomsDone/65) primitive"

patterns-established:
  - "Prayer-clock Sky: manual times are the v1 floor — no device-location API, no network, no timers; re-evaluated on visibility/DOMContentLoaded events only"
  - "The --dawn degree is a bottom-horizon apricot glow (distinct from the top prayer-clock tint) so it reads as subordinate ambience, never the metric"

requirements-completed: [MOT-01, MOT-04]

# Metrics
duration: ~22min
completed: 2026-07-12
---

# Phase 3 Plan 10: Prayer-clock Sky Summary

**A manual-times prayer clock (no device-location, no network) that maps the local clock to five canvas temperatures — lastthird/dawn/day/dusk/night — painted as the §3.2 tint over the Kiswah Orbit ground, plus a capped `--dawn` horizon-apricot progress glow that is ambient, never the metric.**

## Performance

- **Duration:** ~22 min
- **Completed:** 2026-07-12
- **Tasks:** 2
- **Files modified:** 3 (2 modified, 1 created)

## Accomplishments
- `AW.skyTemp(now, times, mode)` — a pure, deterministic now→temperature function reading LOCAL `getHours()/getMinutes()` only (D-16 discipline), returning `lastthird`/`dawn`/`day`/`dusk`/`night`, and `day` for `skyMode:"off"`; references no device-location or network path (T-03-10 mitigated).
- `prayerTimes` (05:00/13:00/16:30/19:30/21:00) + `skyMode:"manual"` added to `defaultPrefs()` **without** bumping `CURRENT` — the critical plan law: an existing v1 `awba_prefs` blob (soundMuted/motion) keeps working untouched; every Sky read falls back to its default via `AW.prefs.get(k, d)`.
- Boot wiring stamps `document.documentElement.dataset.sky` (and mirrors it onto the `.reg-orbit` home shell so the §3.2 painter fires), and sets `--dawn`; re-evaluated on `visibilitychange`/`DOMContentLoaded` — event-driven, no timers.
- `--dawn` horizon glow (`AW.skyDawn` capped at 0.6 + `.reg-orbit::before`): a faint bottom-horizon apricot, layered under the Ring, static (survives reduced motion), distinct from the top prayer-clock tint so it can never be mistaken for the progress ring.
- `scripts/tests/sky.test.js` (8 tests) proving the five temperatures, inclusive window boundaries, a Maghrib shift moving the dusk boundary, `skyMode:off⇒day`, determinism, no location/network path, fresh-install defaults, and v1-blob survival with no schema bump.

## Task Commits

1. **Task 1: pure temperature fn + prayerTimes/skyMode defaults + boot dataset.sky + --dawn wiring** — `7a1ed4b` (feat)
2. **Task 2: --dawn horizon glow (CSS) + sky.test.js** — `0e80cb4` (feat)

**Plan metadata:** committed with STATE/ROADMAP (this docs commit)

## Files Created/Modified
- `shared/awba-engine.js` — hoisted `skyTemp`/`skyDawn`/`skyDefaultTimes`/`skyMinutes` (SKY block near RING) + `AW.skyTemp`/`AW.skyDawn`; `prayerTimes`/`skyMode` added to `defaultPrefs()` (no CURRENT bump); boot-stamp block extended with `applySky()` + `--dawn` + visibility/DOMContentLoaded re-evaluation.
- `shared/awba-engine.css` — `.reg-orbit::before` `--dawn` horizon-apricot glow (opacity `var(--dawn, 0)`, z-index 0 under the Ring), in `@layer base` beside the `[data-sky]` tints.
- `scripts/tests/sky.test.js` — node:test coverage of the five temperatures + the manual/off contract + no-location assertion + no-schema-bump v1 survival.

## Decisions Made
- **Dhuhr is the dawn→day boundary.** The manual times table has no Duha; the plan's own behavior fixtures (06:00⇒dawn, 14:00⇒day) define the boundary at Dhuhr, which the implementation follows exactly. `asr` is stored (completeness/future) but is not a temperature boundary.
- **Hoisting reconciles placement with parse-order.** The SKY functions are authored near RING (placement law), but the parse-time boot-stamp block earlier in the file must call them; authoring them as hoisted `function` declarations makes them callable from the boot block without a second guarded DOM touch or a timer.
- **dataset.sky stamped on both `<html>` and the `.reg-orbit` home shell.** The §3.2 painter is `.reg-orbit[data-sky]::after`, so the attribute must reach a `.reg-orbit` ground element for the tint to paint; `<html>` remains the canonical carrier per §7.2 and the home-shell mirror makes the tint actually render.
- **`--dawn` boot value is a coarse progress proxy** (completed nodes / 19 × 65) until Phase 5 wires the exact `atomsDone` into the Ring caller; `AW.skyDawn` itself stays the pure `min(0.6, atomsDone/65)` primitive the spec specifies.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `.sky-breathe` + its dual-trigger reduced-motion gating already ship from plan 09 — not re-declared**
- **Found during:** Task 2 (CSS)
- **Issue:** The plan's Task 2 action (written against pre-wave-4 line numbers) instructs adding `.sky-breathe` and gating it under both reduced-motion triggers. Wave 4 (plan 03-09) already added `.sky-breathe` / `.sky-breathe.halo` (lines 975-976) AND gated them under both `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]` with `animation: none !important` (lines 992, 998-1000), with `--dur-amb` deliberately left un-collapsed. Re-declaring would duplicate the rules and disturb plan-09 content.
- **Fix:** Left plan-09's `.sky-breathe` + gating untouched; added only the new `--dawn` glow. The plan's intent (sky-breathe present and gated under both triggers, `--dawn` glow added, static tint preserved) is fully satisfied, and every Task 2 verify grep still passes (`sky-breathe`, `--dawn`, both reduced-motion triggers, layer-order line count == 1).
- **Files modified:** shared/awba-engine.css (additive `--dawn` glow only)
- **Verification:** Task 2 verify block passed verbatim; full suite 53/0; sky.test.js 8/0.
- **Committed in:** `0e80cb4`

**2. [Rule 2 - Missing Critical] Home-shell mirror + DOMContentLoaded so the §3.2 tint actually paints**
- **Found during:** Task 1 (boot wiring)
- **Issue:** Setting `dataset.sky` on `document.documentElement` alone (as the must-have specifies) sets `--sky-tint` via the global `[data-sky="X"]` rule but does NOT trigger the tint painter, because the painter is `.reg-orbit[data-sky]::after` — the `::after` box is only generated when the `.reg-orbit` ground element itself carries `[data-sky]`. At parse-time boot the home shell may not exist yet.
- **Fix:** `applySky()` stamps both `<html>` (canonical, §7.2) and any existing `.reg-orbit` home shell, and re-runs on `DOMContentLoaded` (event, not a timer) to catch the shell if boot ran first. Keeps `<html>` as the canonical carrier while making the tint paint whenever a `.reg-orbit` home root exists.
- **Files modified:** shared/awba-engine.js
- **Verification:** Rasterised a five-cell strip (each cell `.reg-orbit` + `data-sky`) via headless Chrome — the tints paint and read as times of day.
- **Committed in:** `7a1ed4b`

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 missing-critical). No architectural changes, no scope creep.
**Impact on plan:** Both keep the feature faithful to the spec's intent and actually functional; neither adds surface beyond §7.

## Issues Encountered
- **Gated literal in comments (JS).** The Task 1 verify uses `! grep -qE 'geolocation|getCurrentPosition' shared/awba-engine.js`, so the literal words cannot appear even in a comment (a false-pass/fail trap prior executors hit). Comments use "device-location API" / "no network" instead; the sky.test.js no-location assertion escapes the literal in its own regex to keep the test file clean of the token. Verified: `grep -cE 'geolocation|getCurrentPosition' shared/awba-engine.js` → 0.

## Self-Check: Visual
Rasterised a strip of all five temperatures (`.reg-orbit` + `data-sky`, `--dawn:.5`) via headless Chrome: **lastthird** reads as the deepest violet (last third of night), **dawn** as apricot warmth from the top (post-Fajr brightness), **day** as the neutral unwarmed black world, **dusk** as violet, **night** as deeper violet — the five visually read as times of day, and the `--dawn` apricot glow sits subordinately at the bottom horizon, under the ring marker, distinct from the top prayer-clock tint. (Strip artifact in the session scratchpad, not committed.)

## Next Phase Readiness
- The second flagship (prayer-clock Sky, manual-times floor) is built and proven ahead of the lesson port, ready for 03-11 (new preview injects the Sky over the Orbit ground) and the 03-12 human §9 gate item 8 ("the sky matches the time of day without feeling like a fake reward").
- **Owner/human-gate items (§7.5 acc. 5/6):** last-third violet reading "like night" and the `--dawn` warmth reading as ambient (not the metric) are visual judgments for the §9 gate.
- **Phase 5 wiring:** replace the coarse boot `--dawn` proxy with the exact `atomsDone` the Ring caller computes, and add the prayer-times settings screen that writes the same `prayerTimes` blob (location-aware is a future enhancement that writes the same shape).

## Self-Check: PASSED

- `scripts/tests/sky.test.js` — FOUND
- `.planning/phases/03-components-icon-kit-motion-language/03-10-SUMMARY.md` — FOUND
- Commit `7a1ed4b` (Task 1) — FOUND
- Commit `0e80cb4` (Task 2) — FOUND
- `shared/awba-engine.js` — `skyTemp`/`skyDawn` present; `grep -cE 'geolocation|getCurrentPosition'` → 0
- `shared/awba-engine.css` — `.reg-orbit::before` `--dawn` glow present; layer-order line count == 1
- Suite: 53 pass / 0 fail (baseline 45 + 8 sky); `validate-content.js --self-test` OK

---
*Phase: 03-components-icon-kit-motion-language*
*Completed: 2026-07-12*
