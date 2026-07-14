---
phase: 07-pwa-shell-offline-delivery
plan: 02
subsystem: infra
tags: [service-worker, pwa, offline-cache, cache-api, static-site]

# Dependency graph
requires:
  - phase: 07-pwa-shell-offline-delivery
    provides: "07-01 install shell — index.html redirect, manifest.webmanifest, icon set"
provides:
  - "sw.js — root-scoped, versioned (awba-cache-v1), 46-entry precache list generated from the real on-disk file list"
  - "cache-first static assets / network-first HTML navigations / activate-time purge fetch strategy"
  - "file://-guarded SW registration on learn.html + index.html"
  - "pwa-audit.mjs extended to permanently gate SW shape + precache-list integrity"
affects: [offline-delivery, ship-gate, deployment]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Hand-written service worker, zero dependency, ~90 logic lines (under the CLAUDE.md ~50-line guidance once the generated 46-entry PRECACHE data array and file-header comment are excluded)"
    - "PRECACHE array generated from a one-off node listing of the real on-disk files (lessons/reviews/fonts/icons), then hand-embedded as a static literal — no build step at runtime"

key-files:
  created: [sw.js]
  modified: [learn.html, index.html, scripts/tests/pwa-audit.mjs]

key-decisions:
  - "PRECACHE list built by globbing the real on-disk files (node -e one-off) rather than hand-typing 46 paths, eliminating typo/404 risk in caches.addAll()"
  - "Registration script placed in <head> immediately after the manifest/apple-touch-icon link pair on both learn.html and index.html, guarded by both 'serviceWorker' in navigator and location.protocol !== 'file:'"
  - "icons/*.svg (icon-src.svg, icon-maskable-src.svg) and shared/fonts/src/*.ttf excluded from precache — only the shipped PNG/woff2 production assets are cached"

patterns-established:
  - "Any future static asset added to the app shell must be added to sw.js PRECACHE (relative path) or it will 404 out of scope of the offline cache — pwa-audit.mjs's precache-integrity check will not catch a missing-but-unreferenced file, only a referenced-but-missing one, so this is a manual discipline note for future phases"

requirements-completed: [PLT-02]

# Metrics
duration: 5min
completed: 2026-07-14
---

# Phase 07 Plan 02: Service Worker Offline Layer Summary

**Hand-written root-scoped `sw.js` (awba-cache-v1, 46-entry generated precache) with cache-first assets / network-first HTML navigations / activate-time purge, registered file://-guarded from learn.html + index.html, gated permanently by an extended pwa-audit.mjs**

## Performance

- **Duration:** ~5 min (3 commits between 20:54:10 and 20:56:35 UTC+1, plus pre/post verification)
- **Started:** 2026-07-14T19:53:00Z (approx, first Read)
- **Completed:** 2026-07-14T19:56:35Z
- **Tasks:** 3/3 completed
- **Files modified:** 4 (1 created: sw.js; 3 modified: learn.html, index.html, scripts/tests/pwa-audit.mjs)

## Accomplishments
- Wrote `sw.js` — the single hand-written, zero-dependency, root-scoped service worker per D-71: versioned `awba-cache-v1` cache, a 46-entry PRECACHE array (20 app pages + engine CSS/JS + 17 self-hosted fonts + grain.png + 4 icon PNGs + manifest.webmanifest + index.html), all relative paths, generated from the real on-disk file list so it can't drift
- `install` precaches via `caches.open().addAll()` + `skipWaiting()`; `activate` purges every cache key ≠ current version + calls `clients.claim()`; `fetch` passes non-GET/cross-origin straight through, goes network-first for HTML navigations (fetch → cache the response → on failure serve the cached request, then a cached `learn.html` fallback), and cache-first for everything else (cache hit → else fetch + cache-fill)
- Added the file://-guarded registration (`'serviceWorker' in navigator && location.protocol !== 'file:'`) as a tiny classic inline `<script>` to both `learn.html` and `index.html`, touching no storage
- Extended `pwa-audit.mjs` to permanently gate: sw.js exists + `node --check` parses + declares a versioned cache constant + has an activate-purge (`caches.delete`) + `clients.claim()` + `skipWaiting()` + a navigate/`text/html` branch; re-derives and verifies every PRECACHE entry resolves on disk and is relative; asserts both HTML entry points carry the guarded registration
- Full standing gate re-run stayed green: 154/154 tests pass (fail 0, todo 0), render-smoke 21/21 (20 pages + the vt-nav probe), pwa-audit exits 0 "PWA OK", engine localStorage 13, learn localStorage 0, `@layer` ×1

## Task Commits

Each task was committed atomically:

1. **Task 1: sw.js — precache + cache-first assets / network-first HTML + activate purge** - `de9a743` (feat)
2. **Task 2: file://-guarded registration on learn.html + index.html** - `981734b` (feat)
3. **Task 3: extend pwa-audit.mjs to gate the SW + precache integrity; full-gate re-run** - `fb17d95` (feat)

**Plan metadata:** (this commit, following SUMMARY.md creation)

## Files Created/Modified
- `sw.js` - Root-scoped SW: awba-cache-v1, 46-entry PRECACHE, install/activate/fetch handlers (cache-first assets, network-first HTML, activate purge, same-origin GET only)
- `learn.html` - Added file://-guarded `serviceWorker.register('sw.js')` inline script in `<head>`, right after the manifest/apple-touch-icon links
- `index.html` - Same guarded registration script, placed before the existing `location.replace('learn.html')` redirect script
- `scripts/tests/pwa-audit.mjs` - Extended with SW shape checks (parses, versioned cache, activate purge, clients.claim, skipWaiting, navigate/text-html branch), re-derived precache-path existence/relativity checks, and guarded-registration checks on both HTML entry points

## Decisions Made
- Generated the 46-entry PRECACHE list from a one-off `node -e` glob of the real lessons/reviews/fonts/icons directories rather than hand-typing paths, per the plan's explicit instruction to avoid drift/typo risk — verified 0 missing entries before embedding
- Excluded `icons/*.svg` (source SVGs) and `shared/fonts/src/*.ttf` (font source files) from the precache — only the shipped production PNG/woff2 assets are cached, matching D-71's file list
- Kept the registration script as a separate small `<script>` block (not folded into learn.html's existing large inline IIFE) for auditability — `pwa-audit.mjs`'s regex checks match this shape directly

## Deviations from Plan

None - plan executed exactly as written. All three tasks' verbatim `<verify><automated>` blocks passed on first run with no fix cycles needed.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. Note: per D-71/CLAUDE.md, the service worker itself only activates over `http://localhost` or HTTPS, never `file://` — this is browser platform behavior, not a setup step. Testing the offline behavior locally requires a static server (`npx serve` / `python3 -m http.server`), covered by 07-01's README (D-73).

## Next Phase Readiness
- The offline half of ROADMAP Phase-7 SC1 is now proven by the permanent gate (pwa-audit.mjs + render-smoke + full suite).
- Ship-gate doubt to flag for the owner walk (not a build blocker): the SW's cache-first strategy means once a page/asset is cached, a redeploy needs a manual `CACHE` version bump (`awba-cache-v1` → `v2`) in `sw.js` to bust it — this is the documented, intentional D-71 manual-cache-busting model (no auto-versioning), but it's worth a one-line mention in whatever deploy runbook D-73's README ends up carrying so a future content update doesn't appear "stuck" for returning offline-first users until the version constant is bumped.
- No stubs introduced; no new hex/token/gated-literal surface; no new network endpoints beyond the SW's own same-origin fetch interception (which is the entire purpose of this plan and stays same-origin GET-only by design, cross-origin/opaque requests pass straight through untouched).

---
*Phase: 07-pwa-shell-offline-delivery*
*Completed: 2026-07-14*

## Self-Check: PASSED

All created/modified files found on disk (sw.js, learn.html, index.html, scripts/tests/pwa-audit.mjs, this SUMMARY.md). All 3 task commit hashes (de9a743, 981734b, fb17d95) verified present in `git log --all`.
