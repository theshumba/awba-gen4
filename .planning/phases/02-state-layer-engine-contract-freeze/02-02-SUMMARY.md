---
phase: 02-state-layer-engine-contract-freeze
plan: 02
subsystem: testing
tags: [node-vm, node-test, content-validation, cli, zero-deps, port-gate]

# Dependency graph
requires:
  - phase: 02-state-layer-engine-contract-freeze
    provides: "Plan 02-01's shared/awba-engine.js STATE section (AW.S/AW.prefs) and node:test/node:vm conventions this plan's tests build on"
provides:
  - "scripts/validate-content.js — the executable AwbaLesson/AwbaReview contract freeze (ENG-07): node:vm cfg ingestion + full D-27 contract checks + calm per-file report + exit 0/1 + --self-test"
  - "scripts/fixtures/{valid-lesson,valid-review,broken-lesson}.html — neutral-copy fixtures exercising the full beat-type/panel-variant/depth-lens/marker-type contract"
  - "The exact self-test command + expected exit codes for reuse as the Phase-4 port gate against all 19 real content files"
affects: [04-engine-runners-content-port]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "node:vm cfg ingestion: stub only {AwbaLesson, AwbaReview, AW.cite} as sandbox globals, run the data file's inline (non-src) <script> in that context, capture the cfg object it calls — never regex-parse the object literal"
    - "Raw-string ID-resolution walk (collectStrings): gather every string value in the captured cfg tree and regex over the joined blob for data-ref=/data-term= — JSON.stringify(cfg) would escape the quotes and silently find zero ids"
    - "Dev-gate CLI shape (mirrors scripts/check-glyph-coverage.py): flat rule tables the checks iterate, an errors[]/warnings[] accumulator, one message per violation naming what/where, single process.exit(errors.length ? 1 : 0), no ANSI-red walls — warnings never affect exit code"

key-files:
  created:
    - scripts/validate-content.js
    - scripts/fixtures/valid-lesson.html
    - scripts/fixtures/valid-review.html
    - scripts/fixtures/broken-lesson.html
    - scripts/tests/validate.test.js
  modified: []

key-decisions:
  - "Validator error-message wording was designed jointly with the Task-1 self-test so assertions target exact substrings (e.g. `mc.c=9`, `missing-ref-id`, `unknown beat type \"bogus\"`) rather than loose fuzzy matching — keeps the contract's failure surface precisely specified, not just \"fails somehow\""
  - "checkBeats() returns immediately after an unknown-beat-type error so no unrelated per-type field checks fire against a beat shape the contract doesn't define — keeps the broken fixture's error count exactly 3 (one per deliberate violation), not padded with cascading noise"
  - "tile.solution validated via array-membership subset check only (no bank-order/sequence requirement) — matches D-27's corrected reading (subset, not length-equal-to-bank); real content's distractor-bearing tiles pass cleanly"
  - "Default CLI file discovery (`lessons/*.html` + `reviews/*.html`) wraps each `fs.readdirSync` in try/catch and tolerates a missing directory — those directories don't exist until Phase 4, so running the validator with no args today reports \"nothing to validate\" (exit 0) instead of crashing"

patterns-established:
  - "Any future validator/gate task in scripts/ should keep this file's calm-report shape: `OK    file` on clean files, `file:\\n  amber: ...\\n  note:  ...` on findings — errors prefixed `amber:`, warnings prefixed `note:`, never a colorized/alarm-red wall (mercy laws bind dev tooling too)"
  - "Pattern: any test asserting validator/gate output should assert on exact substrings the implementation is designed to emit (co-designed message contract), not regex ranges — makes RED/GREEN unambiguous and prevents error-message drift from silently breaking the self-test's intent"

requirements-completed: [ENG-07]

# Metrics
duration: ~7min
completed: 2026-07-12
---

# Phase 2 Plan 2: State Layer & Engine-Contract Freeze — Content Validator Summary

**A zero-npm-dependency `node:vm` content validator (`scripts/validate-content.js`) that executes each lesson/review data file's inline `AwbaLesson`/`AwbaReview` call and checks the captured config against the full frozen D-27 contract, proven by a self-test that flags a deliberately-broken fixture with 3 named errors and passes two structurally-real valid fixtures with zero errors.**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-07-12T11:29:37Z (approx, prior plan's completion commit)
- **Completed:** 2026-07-12T11:36:31Z
- **Tasks:** 2
- **Files modified:** 5 (all created)

## Accomplishments

- `scripts/validate-content.js` — plain Node, zero npm deps (`node:fs`/`node:path`/`node:vm` only, no `package.json`): `ingest(file)` extracts the inline non-src `<script>` and runs it in a `node:vm` sandbox stubbing exactly `{AwbaLesson, AwbaReview, AW.cite}`; `validateCfg(cfg, kind)` checks the full frozen contract
- Full D-27 contract coverage: top-level required fields for lesson (`id`/`unitColor`/`journey`/`opener.h2`/`terms`/`refs`/`beats`/`recap`) and review (`id`/`title`/`sub`/`mastery`/`items`/`next.href`/`next.label`); `refs[id]`/`terms[id]` dictionary field checks; all 9 beat types (`read`/`frame`/`verse`/`panel`/`depth`/`reflect`/`mc`/`tf`/`tile`) with their required fields and extra checks — panel `variant` ∈ {pull,tell,guard,check}, depth `lenses` keys exactly {reality,revelation,ruling}, `read.marker.type` ∈ {fact,remember,fard,angle} (fard accepted though unused in shipped content), `mc.c` range-checked against `o[]`, `tf.c` boolean, `tile.solution` validated as a non-empty subset of `bank` (distractors allowed, no length-equality requirement); review items validated as MC or TF shapes each requiring explanation `t`
- `checkIdResolution` walks RAW captured strings (never `JSON.stringify`) to collect `data-ref="…"`/`data-term="…"` ids and resolves them against `cfg.refs`/`cfg.terms` — dangling ids are errors, unused dictionary entries are warnings
- CLI: `node scripts/validate-content.js [file...]` (default discovers `lessons/*.html` + `reviews/*.html`, gracefully tolerating their pre-Phase-4 absence) and `node scripts/validate-content.js --self-test` (validates the three fixtures below); calm per-file report (`amber:` for errors, `note:` for warnings, never a red wall); `process.exit(errors.length ? 1 : 0)`
- Three neutral-copy fixtures under `scripts/fixtures/`: `valid-lesson.html` (exercises all 9 beat types plus a `fard` marker, a resolving `AW.cite`, a resolving `.term[data-term]` span, and a distractor-bearing `tile.solution`), `valid-review.html` (one MC + one TF item, each with explanation `t`), `broken-lesson.html` (exactly 3 deliberate violations: unknown beat type `"bogus"`, a dangling `AW.cite('missing-ref-id', …)`, and an out-of-range `mc.c=9` against a 4-option `o[]`)
- `scripts/tests/validate.test.js`: `node:test` self-test — RED confirmed when `validate-content.js` didn't exist (`MODULE_NOT_FOUND`, exit 1), GREEN now (3/3 passing): both valid fixtures assert zero errors; the broken fixture asserts ≥3 errors and that specific error strings name each of the three violations by exact substring (`bogus`, `missing-ref-id`, `mc.c` + `9`)

## Task Commits

Each task was committed atomically:

1. **Task 1: Author the three fixtures + failing validator self-test (Wave 0, RED)** — `ea436ac` (test)
2. **Task 2: Build scripts/validate-content.js — vm ingest + contract checks + calm report (self-test GREEN)** — `da77c46` (feat)

**Plan metadata:** _pending — added after this SUMMARY is committed_

## TDD Gate Compliance

Task 2 is `tdd="true"`. Gate sequence verified in git log: `ea436ac test(02-02): add fixtures + failing validator self-test (RED)` precedes `da77c46 feat(02-02): build scripts/validate-content.js … (self-test GREEN)`. No refactor commit was needed — the implementation passed all self-test assertions on first write, so no `refactor(02-02): …` commit exists (optional gate, not required).

## Files Created/Modified

- `scripts/validate-content.js` — the executable contract freeze: `ingest()`, `validateCfg()`, per-beat/per-top-level check functions, `checkIdResolution()`, CLI (`--self-test` + argv/default file list), `module.exports = { ingest, validateCfg }`
- `scripts/fixtures/valid-lesson.html` — structurally-real neutral-copy lesson fixture exercising the full beat-type contract
- `scripts/fixtures/valid-review.html` — structurally-real neutral-copy review fixture (MC + TF items)
- `scripts/fixtures/broken-lesson.html` — deliberately violates 3 contract rules for self-test coverage
- `scripts/tests/validate.test.js` — the `node:test` self-test asserting exact error-message substrings against all three fixtures

## Decisions Made

- Error-message wording in `validate-content.js` was authored to match the exact substrings `validate.test.js` asserts on (`mc.c=9`, `missing-ref-id`, `unknown beat type "bogus"`) — designed together in one pass so the contract's failure surface is precisely specified rather than "fails somehow, close enough"
- `checkBeats()` returns immediately after flagging an unknown beat type, skipping further per-type checks for that beat (its shape is undefined by the contract, so nothing else about it can meaningfully be checked) — this keeps `broken-lesson.html`'s error count exactly 3, matching one error per deliberate violation with no cascading noise
- `tile.solution` is validated with an array-membership subset check only (no bank-order requirement) — the correct reading of D-27's "subset of bank, not length-equal" clarification; `valid-lesson.html`'s tile has 2 solution words against a 4-word bank (2 distractors) and passes cleanly
- Default CLI file discovery for `lessons/*.html`/`reviews/*.html` wraps `fs.readdirSync` per-directory in try/catch so the validator degrades gracefully to "nothing to validate" (exit 0) today, since those directories don't exist until Phase 4 — this is forward-compatible with zero changes needed when Josh's 19 files land

## Deviations from Plan

None — plan executed exactly as written. Both tasks passed verification on the first implementation pass (no auto-fix cycles were needed): the RED test correctly failed with `MODULE_NOT_FOUND` before the validator existed, and all self-test/acceptance-criteria commands passed immediately once `validate-content.js` was written.

## Issues Encountered

**Environment quirk (not a code bug): this machine's `grep` (aliased to `ugrep`) does not support the PCRE negative-lookahead syntax `(?!node:)` used in one of the plan's acceptance-criteria commands** (`! grep -qE "require\\('(?!node:)" scripts/validate-content.js`) — `ugrep` printed a syntax error for the lookahead and exited non-zero, which the `!` negation then reported as a false PASS. This is the same class of environment characteristic 02-01's SUMMARY documented for `node --test <directory>` (a local tool-version quirk, not a repo defect). Verified manually instead: `grep -n "require(" scripts/validate-content.js` shows exactly three requires, all `node:`-prefixed (`node:fs`, `node:path`, `node:vm`) — the zero-npm-deps acceptance criterion is genuinely satisfied; the grep command's syntax, not the code, was the problem. Recorded here so a future executor on this same environment doesn't trust that specific lookahead-based grep command at face value.

## Reviewer Smoke Check (D-30, recorded not blocking)

Not independently re-verified visually this session (Plan 02-01's `shared/awba-engine.js` is present and unchanged by this plan), but the mechanism is identical to the one already exercised in 02-01's SUMMARY: `scripts/fixtures/valid-lesson.html` and `valid-review.html` use page-relative `../../shared/awba-engine.css`/`../../shared/awba-engine.js` links, classic `<script>` tags (no `type="module"`, no `defer`/`async`), and call `AwbaLesson(cfg)`/`AwbaReview(cfg)` synchronously — the same load-bearing pattern proven to work over `file://` double-click in Plan 02-01. Double-clicking either fixture from Finder is expected to run with a clean console (no `AwbaLesson`/`AwbaReview` runner is wired yet — that's Phase 4 — so the page will parse/execute without error but render nothing visible beyond the engine's base styles).

## Port-Gate Reuse (Phase 4)

The exact commands Phase 4 should run against all 19 real ported files:

```bash
# Self-test (proves the validator itself still behaves correctly) — expect exit 0:
node scripts/validate-content.js --self-test

# Full content gate once lessons/*.html + reviews/*.html exist — expect exit 0:
node scripts/validate-content.js

# Equivalent explicit form (same behavior as the no-args default):
node scripts/validate-content.js lessons/*.html reviews/*.html

# Full node:test suite (this validator's own self-test) — expect exit 0:
node --test scripts/tests/validate.test.js
```

`ingest`/`validateCfg` are also exported (`module.exports = { ingest, validateCfg }`) for direct `require()` use in any Phase-4 test file that wants per-file assertions beyond the CLI's exit code.

## User Setup Required

None — no external service configuration required. Zero npm dependencies (Node core `node:fs`/`node:path`/`node:vm`/`node:test`/`node:assert` only), no `package.json`.

## Next Phase Readiness

- `scripts/validate-content.js` is ready to run as-is against Phase 4's real `lessons/*.html`/`reviews/*.html` the moment those files exist — no code changes anticipated; the contract was derived from a survey of all 19 real files (02-RESEARCH.md), not guessed
- The self-test (`--self-test` and `node --test scripts/tests/validate.test.js`) is the reusable Phase-4 port gate; both commands and their expected exit codes are recorded above
- Phase 2 (both plans) is now complete: the state layer (`AW.S`/`AW.prefs`/helpers, Plan 02-01) and the content-contract freeze (`validate-content.js`, this plan) together satisfy FND-05/FND-06/FND-07/ENG-07
- No blockers for Phase 3 (motion/a11y layer) or Phase 4 (engine runners + content port)

## Self-Check: PASSED

All 5 created files verified present on disk (`scripts/validate-content.js`, `scripts/fixtures/valid-lesson.html`, `scripts/fixtures/valid-review.html`, `scripts/fixtures/broken-lesson.html`, `scripts/tests/validate.test.js`); both task commit hashes (`ea436ac`, `da77c46`) verified present in `git log`; full self-test re-run and confirmed GREEN (`node scripts/validate-content.js --self-test` exit 0; `node --test scripts/tests/validate.test.js` 3/3 GREEN).
