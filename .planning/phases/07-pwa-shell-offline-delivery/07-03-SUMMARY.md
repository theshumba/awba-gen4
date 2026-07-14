---
phase: 07-pwa-shell-offline-delivery
plan: 03
subsystem: pwa-delivery
tags: [pwa, install-nudge, readme, regression-gate, a11y, athar]
requires: ["07-01", "07-02"]
provides:
  - "the mercy-toned dismissible add-to-home nudge on learn.html (beforeinstallprompt + iOS hint, dismissal via AW.prefs)"
  - "a repo-root README.md (structure / file:// review / validator / PWA-local-test / GitHub Pages deploy)"
  - "07-REGRESSION.md — the PLT-05 Gen-3 v1.1–v1.5 ship-checklist mapped to live coverage"
  - "two new regression pins (placePop edge-clamp; the lesson/review back-button rules)"
affects: [learn.html, README.md, scripts/tests/a11y-dialogs.test.js, scripts/tests/runner-interaction.test.js]
tech-stack:
  added: []
  patterns:
    - "install-nudge as a JS-mounted, register-classed (reg-orbit) floating card on document.body — survives render() rebuilds of #app"
    - "dismissal persisted via a NEW AW.prefs key (installNudgeDismissed) on the engine's existing storage call — no new localStorage literal, no schema bump"
    - "source-invariant regression pins (regex against shipped source) for behaviours only reachable through a full DOM"
key-files:
  created:
    - README.md
    - .planning/phases/07-pwa-shell-offline-delivery/07-REGRESSION.md
  modified:
    - learn.html
    - scripts/tests/a11y-dialogs.test.js
    - scripts/tests/runner-interaction.test.js
decisions:
  - "D-72 nudge reads as a sibling of the Continue card (Layl-Navy panel, cream/paper-62/gold-ghost) — proven-safe contrast pairings, zero new hex"
  - "AW.prefs already exposed generic get/set — no engine edit needed; engine localStorage stayed 13"
  - "iOS detected by feature (navigator.standalone presence), not UA string parsing"
  - "reworded 3 retired-Gen-3-vocabulary comments (unlock/upgrade) so the owner-rule file-wide grep passes — behaviour-neutral"
metrics:
  tasks: 3
  commits: 3
  files_created: 2
  files_modified: 3
  tests_before: 154
  tests_after: 157
  completed: 2026-07-14
---

# Phase 7 Plan 3: PWA Delivery Finishing Layer Summary

The un-loseable promise gets a gentle keeper and a clean bill of health: a mercy-toned, dismissible
add-to-home nudge on `learn.html` (Chromium `beforeinstallprompt` + an iOS Share hint, remembered
through the engine so it never nags), a repo-root README that lets anyone open/review/validate/ship
Awba, and the PLT-05 Gen-3 regression ship-checklist proving no old owner fix regressed.

## What shipped

**Task 1 — the add-to-home nudge (`feat(07-03)` · `b6a3eac`).** A JS-built `@layer screens` banner
mounted on `document.body` with the `reg-orbit` class so the shipped Orbit register grammar rides in
(the gold `:focus-visible` ring, `--icon-accent` gold, the paper-press). It reads as a sibling of the
Continue card — a Layl-Navy panel, cream ink, a gold-ghost "Add to home" button, a quiet native
"Not now" dismiss (44px, register ring). Chromium: capture `beforeinstallprompt` (preventDefault +
stash), reveal, fire the stashed prompt on accept. iOS/iPadOS Safari (feature-detected via
`navigator.standalone`, no UA sniffing): a Share → Add to Home Screen hint variant. Suppressed when
already installed (`display-mode: standalone` / `navigator.standalone`) or when the dismissed flag is
set. Entrance is a translateY(12px)+opacity settle on the one `--ease` family (`--dur-sheet` in,
`--dur-fade` out — asymmetric), fade-only under reduced motion. It clears the fixed tab bar by
measuring the bar's height at reveal (no magic number), and announces politely via `AW.announce`.

**Task 2 — README.md (`docs(07-03)` · `80ba9c8`).** Repo-root README: what Awba Gen-4 is; the
structure (index redirect → learn front door; per-page `AwbaLesson`/`AwbaReview` data files; the one
engine CSS + JS; `shared/` fonts/img/sfx; icons; manifest + `sw.js`; `preview.html` dev-only); how
content is reviewed by opening any `.html` over `file://`; the validator + every standing gate
command; local PWA testing (`npx serve` / `python3 -m http.server`; the SW never registers over
`file://`); and GitHub Pages deploy (push, static, zero build, relative paths).

**Task 3 — 07-REGRESSION.md (`docs(07-03)` · `264af32`).** Each Gen-3 v1.1–v1.5 owner fix mapped to
its live coverage, each confirmed by running its check. Five items were already covered and confirmed
by running the referenced tests/audits; two had real gaps and were closed with minimal
source-invariant pins (never a re-implementation):

| Gen-3 fix | Coverage | Status |
|---|---|---|
| Popup anchoring | a11y-dialogs dialog contract + **new** placePop edge-clamp pin | PASS (+pin) |
| Footer / hero spacing | render-smoke (renders clean); pixel rhythm → human walk | PASS |
| Review timer teeth | runner-review AW.QTIME (14s) + reviewStars cap; contrast-audit `.rv-timer.low` | PASS |
| Accordion lenses | runner-interaction WR-03 lens-open handler | PASS |
| Chest idempotency | learn-dom-flows +25-once / Festival-dismiss | PASS |
| TF selection cue | a11y-keyboard ACC-01 aria-pressed + contrast-audit `.tf` sweep | PASS |
| Back-button rules | **new** runner-interaction pins (lesson bounded step-back; review no-back, Gen-3 348) | PASS (+pin) |

## Deviations from Plan

### Auto-fixed / adjusted

**1. [Rule 3 — Blocking issue] Reworded 3 pre-existing Gen-3-vocabulary comments in learn.html.**
- **Found during:** Task 1 (running the T1 `<verify>` block verbatim).
- **Issue:** the verify greps the WHOLE file with `! grep -qiE '\bfree\b|upgrade|unlock'`, but the
  pre-existing learn.html already carried the retired-Gen-3 words "unlock" ("unlock sequence",
  "unlock rules") and "upgrade" (a coming-soon guard comment) — so the gate could not pass on any
  learn.html edit, mine or not.
- **Fix:** reworded those three code comments to neutral synonyms ("reveal sequence" / "reveal rules";
  "a cold 'unavailable' wall"). Behaviour-neutral (comments only), and consistent with Athar's mandate
  to re-voice retired Gen-3 vocabulary. My own new comments were written free of the banned words.
- **Files:** learn.html · **Commit:** b6a3eac

**2. [Info] AW.prefs needed no engine edit.** The plan allowed a minimal engine change if AW.prefs
lacked a generic get/set. It already exposes `get(k, d)` / `set(k, v)`, so the nudge added only a NEW
key (`installNudgeDismissed`) through the existing storage call — `shared/awba-engine.js` was not
touched and its localStorage grep stayed 13.

**3. [Info] Stale plan line/coverage refs — located by content.** The plan mapped accordion lenses to
"components tests" (actual coverage: runner-interaction WR-03) and back-button rules to
"runner-interaction" as if already covered (it only pinned WR-02/WR-03). Both were resolved by content
lookup; back-button was the real gap and got the new pins.

## Ship-gate doubts / carry-forwards

- **Footer/hero pixel spacing (D-74):** render-smoke proves the structure renders without error, but
  the *exact* footer/hero spacing is a visual judgement — carried to the human ship walk, not gated.
- **The nudge's live install flow is verified structurally, not on-device.** render-smoke + a
  computed-style DOM probe confirmed the banner mounts on the Orbit ground with the right register
  colours (navy card, cream/paper-62/gold ink), z-index 60 above the tab bar, 44px dismiss, and the
  gold focus ring; the actual Chromium install prompt / iOS Share sheet is an owner device-walk item.
- **The lantern app-icon visual treatment (D-69)** and **custom-domain DNS (D-75)** remain the
  standing owner-gated walk items from 07-01/CONTEXT — unaffected here.

## Invariants held

learn.html localStorage `0` · engine localStorage `13` · `@layer` order line `1` · learn `@layer
screens` block `1` · `glyphCount` `13` (no new glyph) · no new hex (nudge reuses shipped tokens
only) · no free/upgrade/unlock copy · no celebration primitive on the banner · no gated literal in
learn.html/README.md/07-REGRESSION.md. Full suite `157/157` (was 154, +3 pins), `fail 0` / `todo 0`;
render-smoke, pwa-audit, port-audit, contrast-audit, rtl-audit, glyph gate, validate-content all
exit `0`. No build step. Tree clean.

## Self-Check: PASSED

- `README.md` — FOUND
- `.planning/phases/07-pwa-shell-offline-delivery/07-REGRESSION.md` — FOUND
- learn.html nudge (`beforeinstallprompt` + `AW.prefs`) — FOUND
- commit `b6a3eac` (T1) — FOUND
- commit `80ba9c8` (T2) — FOUND
- commit `264af32` (T3) — FOUND
