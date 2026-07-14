---
phase: 07-pwa-shell-offline-delivery
plan: 01
subsystem: infra
tags: [pwa, manifest, web-app-manifest, headless-chrome, sips, static-assets]

# Dependency graph
requires:
  - phase: 06-accessibility-rtl-typography-hardening
    provides: closed a11y/RTL/typography baseline (suite 154/0/0, all standing gates green) that this plan builds on without touching product source
provides:
  - the installable-PWA shell (lantern app-icon family, manifest.webmanifest, index.html base-URL redirect, learn.html install head links)
  - a permanent pwa-audit.mjs exit-code gate joining the standing suite
affects: [07-02-service-worker-offline, 07-03-install-nudge-readme-regression]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Raster asset generation via the same headless-Chrome binary render-smoke.mjs already locates (zero new dependency) — an HTML wrapper page inlines a source SVG, screenshot at exact target pixel size with a solid background (no transparency), smaller sizes derived via sips -z"
    - "PWA manifest icon srcs + start_url/scope are RELATIVE (no leading slash) so the app installs unchanged at a GitHub Pages project subpath or a custom-domain root"
    - "pwa-audit.mjs follows the render-smoke/rtl-audit/contrast-audit template: dependency-free Node core only, exit-code-first, prints a single OK line on success"

key-files:
  created:
    - icons/icon-src.svg
    - icons/icon-maskable-src.svg
    - icons/icon-512.png
    - icons/icon-maskable-512.png
    - icons/icon-192.png
    - icons/apple-touch-icon-180.png
    - manifest.webmanifest
    - index.html
    - scripts/tests/pwa-audit.mjs
  modified:
    - learn.html

key-decisions:
  - "Icon art re-inked from the shipped AW.KIT lantern paths (shared/awba-engine.js) unchanged, wrapped in a <g> with color:#D9A441 (--gold) + --icon-accent:#D9A441 so both currentColor and var(--icon-accent) references resolve to gold without editing a single path"
  - "Plain icon art scaled to ~57% of the 512 frame (scale 1.05 off a computed lantern bounding-box center); maskable art scaled to ~46% (scale 0.85), leaving a comfortable margin inside the ~40%-radius maskable safe-zone circle"
  - "pwa-audit.mjs reads PNG IHDR bytes directly (offset 16/20) for a zero-dependency pixel-dimension check instead of shelling out to sips, keeping the gate consistent with the rest of the suite's zero-dependency posture"

requirements-completed: [PLT-02]

duration: 10min
completed: 2026-07-14
---

# Phase 07 Plan 01: PWA Shell Icons + Manifest + Redirect Summary

**Installable PWA shell: gold-on-Kiswah lantern icon family rasterised via headless Chrome, manifest.webmanifest with relative paths, index.html→learn.html redirect, and a permanent pwa-audit.mjs gate — no service worker yet (07-02).**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-07-14T19:39:00Z (approx.)
- **Completed:** 2026-07-14T19:48:47Z
- **Tasks:** 3/3 completed
- **Files modified:** 10 (9 created, 1 modified)

## Accomplishments
- Generated the lantern app-icon family (192/512/maskable-512/apple-touch-180) by rasterising an Athar-treated SVG (the surviving `AW.KIT.lantern` scene, re-inked `--gold` on `#131013`) through the same headless-Chrome binary `render-smoke.mjs` locates — zero new dependency.
- Wrote `manifest.webmanifest` (valid JSON, relative `start_url`/`scope`, full icon family incl. a `maskable` purpose entry) and `index.html` as a redirect-to-`learn.html` that is itself installable (meta-refresh + `location.replace` + a plain `<a>` fallback).
- Added the manifest + apple-touch-icon links to `learn.html`'s `<head>` only — the inline page `<script>` untouched, `localStorage` grep stays 0.
- Built `scripts/tests/pwa-audit.mjs`, a permanent dependency-free exit-code gate validating the manifest, icon files, and redirect/head-link wiring — joins the full standing gate set.

## Task Commits

Each task was committed atomically:

1. **Task 1: lantern app-icon family (192/512/maskable/apple-touch)** - `03c22dc` (feat)
2. **Task 2: manifest.webmanifest + index.html redirect + head links** - `0706fdc` (feat)
3. **Task 3: scripts/tests/pwa-audit.mjs permanent gate** - `9233d69` (feat)

## Files Created/Modified
- `icons/icon-src.svg` - source SVG for the plain icon (lantern art ~57% of frame, gold on `#131013`)
- `icons/icon-maskable-src.svg` - source SVG for the maskable icon (lantern art ~46% of frame, safe-zone padded)
- `icons/icon-512.png` / `icons/icon-maskable-512.png` - rasterised 512×512 masters (headless Chrome, no alpha)
- `icons/icon-192.png` / `icons/apple-touch-icon-180.png` - derived via `sips -z` (192×192, 180×180, no alpha)
- `manifest.webmanifest` - the Web App Manifest (name/short_name Awba, `start_url` `learn.html`, `scope` `./`, standalone, dark theme, 3-icon family)
- `index.html` - the base-URL redirect page (meta-refresh + `location.replace` + `<a>` fallback), carries the install head trio
- `learn.html` - `<head>` gained `<link rel="manifest">` + `<link rel="apple-touch-icon">` next to the existing `theme-color`
- `scripts/tests/pwa-audit.mjs` - the new permanent PWA manifest/icon/redirect exit-code gate

## Decisions Made
- Icon art was scaled off a computed bounding-box center of the lantern's halo path (approx. (125,151) in the original 240×300 viewBox) rather than the viewBox geometric center, so the visually-weighted art sits centered in the 512×512 frame rather than skewed toward the top (the halo extends further down than up).
- Kept both decorative accent-spark paths (`var(--icon-accent)`) in the icon art, re-inked gold like the rest — they read as small highlight flecks at 512px and shrink cleanly to single gold dots at 192/180px without visual noise.
- `pwa-audit.mjs` checks pixel dimensions via a hand-rolled PNG IHDR reader (bytes 16/20) rather than shelling out to `sips`, matching the zero-dependency, Node-core-only posture of every other `scripts/tests/*.mjs` gate in this repo.

## Deviations from Plan

None — plan executed exactly as written. The task `<action>` blocks specified sonnet-mechanical asset generation via headless Chrome + `sips`, all three tasks completed with the exact approach and commit messages given, and all task-level `<verify>` blocks (plus the plan-level `<verification>` block) pass exit 0.

## Issues Encountered
None. Headless Chrome screenshot succeeded on the first attempt for both the plain and maskable renders (no fallback to `rsvg-convert`/`qlmanage` was needed).

## User Setup Required
None - no external service configuration required.

## Known Stubs
None. `index.html` is intentionally a thin redirect (per D-70), not a stub — it is the designed permanent shape of the base-URL page, not a placeholder for future content.

## Threat Flags
None. `manifest.webmanifest` and `index.html` are new same-origin static assets with no new network endpoints, auth paths, or schema — they extend the existing static-file surface (GitHub Pages, zero build) already covered by the phase's non-negotiables.

## Doubts for the Ship Gate

- **Icon visual treatment is an owner-ledger walk item per D-69** — the mechanism (headless-Chrome raster of an Athar-treated SVG) is fixed and verified, but the exact scale/padding ratios (57%/46%) were my own judgment call within the plan's stated ranges (`≤~62%` plain / `≤~56%` maskable). Worth a human glance at `icons/icon-512.png` and `icons/icon-maskable-512.png` before the final ship walk to confirm the lantern reads clearly at small home-screen sizes (192px, and especially the OS-cropped maskable variants on Android).
- **`index.html`'s plain `<a>` fallback text ("Continue to Awba")** is a functional placeholder copy choice, not reviewed against brand voice guidelines — low-stakes since it is a near-instant redirect most users will never see, but flagged in case the owner wants specific wording.
- Icon PNGs are committed as binary static assets (no build step) — if the lantern art or gold value ever changes in `shared/awba-engine.js`/`shared/awba-engine.css`, the icon SVGs/PNGs will need manual regeneration (not automatically kept in sync); worth a one-line note in the eventual `README.md` (D-73, 07-03).

## Next Phase Readiness
- The installable shell (icons + manifest + redirect + head links) is complete and gated — 07-02 (the hand-written service worker) can now precache `learn.html` + the 20-page app surface + `shared/awba-engine.css`/`.js` + fonts + `grain.png` + these 4 icon files without any further shell changes.
- `manifest.webmanifest`'s icon `src` list (`icons/icon-192.png`, `icons/icon-512.png`, `icons/icon-maskable-512.png`) and `icons/apple-touch-icon-180.png` are the exact 4 files 07-02's precache list should include per the phase objective.
- No blockers. Full suite held 154/154/fail 0/todo 0; render-smoke 21/21; port-audit/validate-content/glyph-coverage/contrast-audit/rtl-audit all exit 0; `pwa-audit.mjs` joins the gate at exit 0.

---
*Phase: 07-pwa-shell-offline-delivery*
*Completed: 2026-07-14*

## Self-Check: PASSED

All 10 claimed files found on disk; all 3 commit hashes (`03c22dc`, `0706fdc`, `9233d69`) found in `git log --oneline --all`.
