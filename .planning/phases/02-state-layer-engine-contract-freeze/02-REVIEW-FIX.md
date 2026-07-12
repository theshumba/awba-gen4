---
phase: 02-state-layer-engine-contract-freeze
fixed_at: 2026-07-12T12:03:27Z
review_path: .planning/phases/02-state-layer-engine-contract-freeze/02-REVIEW.md
iteration: 1
findings_in_scope: 9
fixed: 8
skipped: 1
status: partial
---

# Phase 2: Code Review Fix Report

**Fixed at:** 2026-07-12T12:03:27Z
**Source review:** .planning/phases/02-state-layer-engine-contract-freeze/02-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 9 (1 Critical, 5 Warning, 3 Info — Info in scope per instruction to apply only if trivial/zero-risk, otherwise document)
- Fixed: 8 (1 Critical, 5 Warning, 2 Info)
- Skipped: 1 (1 Info — IN-02, not trivial/zero-risk)

All Critical + Warning findings are fixed. `status: partial` reflects the one deliberately
skipped Info finding; re-run `node --test scripts/tests/*.test.js` and
`node scripts/validate-content.js --self-test` to confirm green (both pass: 26/26 tests, 3/3
fixtures correct).

## Fixed Issues

### CR-01: `AW.S.load()` silently discards `awba_state` on any schemaVersion it doesn't recognize

**Files modified:** `shared/awba-engine.js`, `scripts/tests/state-storage.test.js`
**Commit:** `b3f0f6f`
**Applied fix:** `load()` now handles all three schemaVersion cases explicitly: `=== CURRENT`
uses the blob, `< CURRENT` runs migrations, and anything else (missing, non-numeric, or
`> CURRENT`) is treated as unrecognized — works from an in-memory copy for the session and
never `persist()`s over the untouched on-disk blob. Adapted slightly stricter than the REVIEW.md
illustrative snippet: even the `> CURRENT` case is now non-destructive-only (in-memory copy)
rather than trusted and returned as-is, per the task's explicit non-destructive guidance. Added 3
regression tests covering `schemaVersion` missing, `schemaVersion: 2` (future), and
`schemaVersion: 'x'` (non-numeric) — each asserts real field values survive in-session AND the
on-disk blob stays byte-identical.

### WR-01: `AW.S.get()` / `AW.state()` returned live references into `mem`

**Files modified:** `shared/awba-engine.js`, `scripts/tests/state-storage.test.js`
**Commit:** `d054e57`
**Applied fix:** `AW.S.get()` now returns a defensive copy (`structuredClone`, falling back to a
JSON round-trip) for any object/array-valued key. `AW.state()` inherits the fix transitively
since every field it returns is built from `AW.S.get()` — no separate per-field
`Object.assign`/`.slice()` needed. get/set call shape unchanged (D-17). Added a regression test
asserting mutation of both an `AW.S.get()` result and an `AW.state()` snapshot never alters `mem`
or the persisted blob.

### WR-02: `runMigrations()` had no guard against a step that fails to bump `schemaVersion`

**Files modified:** `shared/awba-engine.js`, `scripts/tests/state-storage.test.js`
**Commit:** `b2f648e`
**Applied fix:** Added both a 50-iteration hard cap and a forward-progress check; both now
`throw` (rather than silently `break`, which would have masked the bug by force-setting
`schemaVersion` to `CURRENT` after the loop). The throw is caught by `load()`'s existing
try/catch and falls back to legacy/default resolution instead of hanging. Since `migrations` is
empty at v1 (unreachable through the public surface today), the regression test loads a patched
copy of the real engine source (`CURRENT` bumped, a broken stub migration injected) and asserts
`load()` still returns promptly.

### WR-03: Validator didn't enforce `tile.good`/`tile.gentle` or `read` marker `.body`

**Files modified:** `scripts/validate-content.js`, `scripts/fixtures/valid-lesson.html`, `scripts/tests/validate.test.js`
**Commit:** `d46c2fd`
**Applied fix:** Went with option (b) from REVIEW.md — added the missing checks matching
`ENGINE-CONTRACT.md` §1's documented shape. Updated `valid-lesson.html`'s `tile` beat with
neutral placeholder `good`/`gentle` copy (its `read`-beat marker already had `body`, so no
fixture change needed there). Self-test still passes with 0 errors on both valid fixtures; broken
fixture still fails with its 3 named violations. Added 2 unit tests directly against
`validateCfg`.

### WR-04: `data-ref`/`data-term` regexes only matched double-quoted attributes

**Files modified:** `scripts/validate-content.js`, `scripts/tests/validate.test.js`
**Commit:** `e3002db`
**Applied fix:** Widened both `refIds`/`termIds` regex patterns to `["']([^"']+)["']`, keeping
the existing two-regex structure (lower risk than restructuring into the suggested single
combined-alternation regex with different capture-group indexing). Added a regression test with
single-quoted attributes asserting zero errors and no false "unused term"/"unused ref" warnings.

### WR-05: Documented test-runner invocation failed with `MODULE_NOT_FOUND`

**Files modified:** `.planning/phases/02-state-layer-engine-contract-freeze/02-VALIDATION.md`
**Commit:** `8d5e69f`
**Applied fix:** Updated the "Quick run command" and "Full suite command" rows to
`node --test scripts/tests/*.test.js`, verified working on Node v24.13.0 in this environment
(directory form confirmed to still fail with exit 1, exactly as the finding describes). Scope
note: per the explicit "both occurrences" instruction, only these two rows were touched; a few
other references to the directory form remain in the Sampling Rate prose and the Per-Task
Verification Map table further down the same file as historical planning records, outside this
finding's scope.

### IN-01: `pad`/`ymd` date helper duplicated with an unsafe `module.exports`

**Files modified:** `scripts/tests/date-helpers.js` (new), `scripts/tests/state-storage.test.js`, `scripts/tests/state-helpers.test.js`
**Commit:** `484acbf`
**Applied fix:** Extracted `pad`/`ymd` into a new non-test helper module (no `test(...)` calls,
so `require`-ing it has zero side effects); both suites now `require` it; dropped the unsafe
`module.exports = { ymd }` from `state-storage.test.js`. Applied as suggested — trivial,
zero-risk, mechanical refactor with no behavior change.

### IN-03: Required string fields only checked for `!== undefined`, not non-empty

**Files modified:** `scripts/validate-content.js`, `scripts/tests/validate.test.js`
**Commit:** `062f8c3`
**Applied fix:** Applied the suggested pattern to `checkTopLevelLesson`'s `id`/`unitColor`/
`journey` loop AND `checkTopLevelReview`'s `id`/`title`/`sub`/`mastery` loop (the finding's File:
line cited both locations; the review-side `id` carries the same progress-key collision risk).
Trivial, zero-risk — mechanical addition of an `else if` branch, no existing fixture uses empty
strings. Added a regression test covering empty `id` on both a lesson and a review cfg.

## Skipped Issues

### IN-02: `ingest()` only extracts the first inline `<script>` block

**File:** `scripts/validate-content.js:38-67`
**Reason:** Not trivial/zero-risk. The finding itself labels this "low priority" and its own Fix
section offers a "consider" rather than a concrete patch — both options (match-all-blocks
restructure, or a new explicit multi-block error path) change `ingest()`'s core parsing behavior
rather than being a narrow mechanical change. No data file today triggers this path (true of all
19 real files + all 3 fixtures per the finding's own text). Documented in `02-REVIEW.md` as a
deliberate skip for a future contributor to pick up if a data file ever adds a second inline
`<script>` block.
**Original issue:** `ingest()`'s `src.match(...)` (no `g` flag) only captures the first matching
inline (non-`src`) `<script>` block per file; a future data file with two such blocks would
silently ingest the wrong one and report a less-informative generic error.

---

## Final Verification

```
$ node --test scripts/tests/*.test.js
ℹ tests 26
ℹ pass 26
ℹ fail 0

$ node scripts/validate-content.js --self-test
SELF-TEST OK: scripts/fixtures/valid-lesson.html (0 errors)
SELF-TEST OK: scripts/fixtures/valid-review.html (0 errors)
SELF-TEST OK: scripts/fixtures/broken-lesson.html (3 errors named)
```

Both commands exit 0. All 1 Critical + 5 Warning findings resolved; 8 of 9 total findings fixed.

---

_Fixed: 2026-07-12T12:03:27Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
