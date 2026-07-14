# 07-REVIEW — Phase 7 Code Review (PWA Shell, Offline & Delivery)

**Reviewer:** orchestrator inline (the review/verify subagents stalled on the stream watchdog earlier this session; Phase 7's diff is small and self-contained, reviewed inline over the full `git diff 80bfa26 HEAD`).
**Scope:** manifest.webmanifest, index.html, icons/ (4 PNG + 2 SVG), learn.html (install head trio + SW registration + the add-to-home nudge), sw.js, scripts/tests/pwa-audit.mjs, README.md, and the 07-03 regression test pins (a11y-dialogs.test.js, runner-interaction.test.js).
**Date:** 2026-07-14

## Summary

| Severity | Count |
|---|---|
| Critical | 0 |
| Warning | 0 |
| Suggestion | 1 (trivial, not fixed) |

A clean phase. The offline layer and the install nudge are correct and idiomatic.

## Reviewed and confirmed sound
- **sw.js** — `'use strict'`, versioned `awba-cache-v1`, a 46-entry relative precache (20 pages + engine CSS/JS + 17 fonts + grain + 4 icons + manifest + index; preview.html correctly excluded), `install`+`skipWaiting`, `activate` purge of stale keys + `clients.claim`, and a `fetch` handler that is **same-origin GET only** (cross-origin/non-GET pass straight through), **network-first for navigations** (cache-put a clone → cached-page then `learn.html` shell fallback on failure), **cache-first for assets** with fill-through. Standard, robust, no bug.
- **Install nudge (learn.html)** — mounted on `document.body` (survives `#app` re-renders); suppressed when standalone (`display-mode: standalone` / `navigator.standalone`) or previously dismissed; `beforeinstallprompt` captured (preventDefault + stash), fired on the Add button with correct `userChoice` handling (steps aside either way); `appinstalled` retires + remembers it; the iOS branch is **feature-detected** (`'standalone' in navigator`, no UA sniffing) and waits 1200ms so a Chromium prompt wins first. `build()` writes only hardcoded strings + `AW.icon('lamp')` into innerHTML — **no user/external input reaches the sink** (no XSS). `AW.icon('lamp')` resolves (a valid `AW.GLYPHS` mark, already used at engine:2446 — glyphCount stays 13). Dismissal persists through `AW.prefs.set('installNudgeDismissed', true)` — **no new `localStorage` literal** (learn.html grep 0, engine grep 13, no schema bump). CSS is a `@layer screens` block of shipped Athar tokens only (no new hex), register-correct on Orbit, reduced-motion handled, 44px targets, the gold `:focus-visible` ring inherited.
- **manifest.webmanifest** — valid JSON, relative `start_url`/`scope` (installs at any GitHub Pages base), the lantern icon family with a `maskable` purpose, every icon src on disk.
- **index.html** — meta-refresh + `location.replace` + a plain `<a>` fallback (works JS-off), carries the manifest + apple-touch + dark theme-color, guarded SW registration.
- **pwa-audit.mjs** — a real exit-code gate (parses the manifest, checks required keys + relative paths + maskable + icons-on-disk, the index redirect, the learn/index head links, the SW shape + precache integrity); empirically validated (it is what proved the shell).
- **Regression pins (07-03)** — `a11y-dialogs` (popup `placePop` viewport edge-clamp + arrow offset) and `runner-interaction` (lesson bounded back hidden at the opener; review no-back-ever, non-vacuous) close two real Gen-3-fix coverage gaps; suite 154→157.
- **Comment rewordings** — three learn.html comments that carried the retired words "unlock"/"upgrade" (about the CNT-03 sequence + a coming-soon guard) were reworded to neutral synonyms so the whole-file `free|upgrade|unlock` copy-gate passes. Comment-only, behaviour-neutral; the `AW.deriveNodeState` logic + function names are untouched (suite green).

## Suggestion (trivial, not fixed)
### SG-01 — the nudge's `window.addEventListener('resize', lift)` is never removed
**File:** learn.html (nudge `reveal()`). A single page-scoped resize listener is added and not removed on dismiss. Impact is negligible (one listener, page lifetime, `lift()` is cheap and guards on `!banner`). Documented, not fixed — removing it on dismiss would be tidy but is not worth a churn cycle.

## Verdict
0 Critical / 0 Warning. Phase 7 is correct. No fix cycle needed.
