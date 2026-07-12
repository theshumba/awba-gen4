# Phase 2: State Layer & Engine-Contract Freeze - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-12
**Phase:** 2-state-layer-engine-contract-freeze
**Areas discussed:** State schema & migration, AW.S surface & state API, Preferences store, Classic-script namespace, Content validator (ENG-07), Verification vehicle
**Mode:** `--auto` — recommended option selected for every question, no interactive prompts. Selections logged below for audit.

---

## State schema & migration mechanics

| Option | Description | Selected |
|--------|-------------|----------|
| Single versioned `awba_state` blob (ARCHITECTURE.md v1 shape) + sequential migration chain | One JSON object, `schemaVersion`, chest keys consolidated into `chests{}` | ✓ |
| Keep Josh's discrete `awba_*` keys + add a version key | Less migration work but repeats Gen-3's no-atomic-state gap | |

[auto] Q: "Delete legacy keys after migration?" → Selected: "No — non-destructive, legacy keys retained as rollback insurance" (recommended default)
[auto] Q: "Date format for lastDay/days?" → Selected: "Migrate to stable YYYY-MM-DD local-date strings; keep local-timezone day boundaries exactly like Gen-3" (recommended; TZ engineering deferred — would change shipped streak behavior)

## AW.S surface & state API

| Option | Description | Selected |
|--------|-------------|----------|
| Freeze `AW.S.get/set` shape; add pure helpers (`state`, `touchDay`, `greetMode`, `weekCal`, `deriveNodeState`) now | ARCHITECTURE.md build-order step 2 — DOM-free, testable in isolation | ✓ |
| Minimal: only `AW.S.get/set`, helpers later with their consumers | Smaller phase but re-opens the state layer twice | |

[auto] Note: `deriveNodeState` ships as pure function + fixture tests now; CNT-03 unlock-order verification stays in Phase 5.

## Preferences store shape

| Option | Description | Selected |
|--------|-------------|----------|
| Separate `awba_prefs` blob, `AW.prefs.get/set`, boot-stamped `data-motion`/`data-sound` on `<html>` | Progress and prefs can't corrupt each other; CSS/motion binds to attributes in Phase 3 | ✓ |
| Fold prefs into `awba_state` | One blob, but couples prefs lifecycle to progress migrations | |

## Classic-script namespace discipline

| Option | Description | Selected |
|--------|-------------|----------|
| One `shared/awba-engine.js`, banner-commented sections, `window.AW` defined synchronously at parse time | Anti-pattern 2 avoided; `AW.cite` exists before Josh's inline cfg scripts run | ✓ |
| Separate `shared/awba-state.js` now, merge later | Every extra script tag = structural edit to Josh's 19 files | |

[auto] Grep gate adopted: `localStorage` may appear only inside the state section (D-24).

## Content validator design (ENG-07)

| Option | Description | Selected |
|--------|-------------|----------|
| `node:vm` sandbox executes each HTML file's inline script with stubbed `AwbaLesson`/`AwbaReview`/`AW.cite` capturing cfg; validate the captured object | Robust to formatting; no fragile regex-parsing of object literals | ✓ |
| Regex/AST-extract the cfg literal from HTML | Breaks on string concatenation with `AW.cite(...)` — Josh's files do exactly that | |

[auto] Q: "Fixture content?" → Selected: "Neutral placeholder copy, never scripture (no generated religious content, even in fixtures); one valid lesson + one valid review + one deliberately-broken lesson" (recommended)
[auto] Q: "Contract doc location?" → Selected: "Keep `.planning/research/ENGINE-CONTRACT.md` as the doc; the validator is the executable freeze; README lands Phase 7" (recommended)

## Verification vehicle

| Option | Description | Selected |
|--------|-------------|----------|
| Script-first proof: validator self-test + headless migration test (localStorage stub) + reviewer console recipe | Phase is DOM-independent; no visual gate needed | ✓ |
| Build a dedicated state-inspector page | Heavier than the phase warrants; discretionary if it helps the human gate | |

## Claude's Discretion

- State-section internal organization; validator error-message wording; warning-vs-error lint classification; fixture placeholder copy; node-script vs HTML-dev-page for the migration harness.

## Deferred Ideas

- Timezone-robust day boundaries (owner sign-off required — changes shipped streak behavior)
- Backend adapter behind `AW.S` (out of scope, seam only)
- Per-citation verified/pending state (belongs with scholar-gate workflow)
