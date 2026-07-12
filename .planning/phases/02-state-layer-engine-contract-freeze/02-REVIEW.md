---
phase: 02-state-layer-engine-contract-freeze
reviewed: 2026-07-12T11:50:37Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - shared/awba-engine.js
  - scripts/validate-content.js
  - scripts/tests/ls-stub.js
  - scripts/tests/state-storage.test.js
  - scripts/tests/state-helpers.test.js
  - scripts/tests/validate.test.js
  - scripts/fixtures/valid-lesson.html
  - scripts/fixtures/valid-review.html
  - scripts/fixtures/broken-lesson.html
findings:
  critical: 1
  warning: 5
  info: 3
  total: 9
status: issues_found
---

# Phase 2: Code Review Report

**Reviewed:** 2026-07-12T11:50:37Z
**Depth:** standard
**Files Reviewed:** 9
**Status:** issues_found

## Summary

Reviewed the Phase 2 state layer (`shared/awba-engine.js` STATE section), the content validator
(`scripts/validate-content.js`), its supporting test harness (`scripts/tests/`), and its three
fixtures. All 17 `node:test` tests pass and `node scripts/validate-content.js --self-test`
passes; the happy paths pinned by the test suite are genuinely correct.

The adversarial pass found one real silent-data-loss path in `AW.S`'s migration/load logic that
sits outside every test's seeded scenarios (schema-version mismatch handling), plus several
warning-grade robustness and contract-fidelity gaps in the validator and a couple of test-suite
quality issues. Nothing here contradicts the intentionally-preserved Gen-3 semantics (local-day
boundaries, best-of stars, etc.) — all findings are new-code defects in the Gen-4 state layer and
validator themselves.

## Critical Issues

### CR-01: `AW.S.load()` silently discards `awba_state` on any schemaVersion it doesn't recognize as exactly `CURRENT` or strictly less — irrecoverable data loss

**File:** `shared/awba-engine.js:172-200`
**Issue:**
`load()` only has two success branches for an existing, successfully-`JSON.parse`d `awba_state` blob:
```js
if (s && s.schemaVersion === CURRENT) return s;
if (s && typeof s.schemaVersion === 'number' && s.schemaVersion < CURRENT) {
  var migrated = runMigrations(s);
  persist(migrated);
  return migrated;
}
```
Any other case for a syntactically-valid, successfully-parsed `s` — `schemaVersion` missing,
non-numeric, or *greater than* `CURRENT` — falls through **silently** (no error, no branch taken)
straight into `migrateFromLegacy()` and then `defaultState()`. Both of those paths call
`persist(...)`, which unconditionally `localStorage.setItem(KEY, ...)`s over the *existing*
`awba_state` value. The result: a blob that has real `noor`/`returns`/`stars`/`days`/`chests`
data, but whose `schemaVersion` is anything other than `< CURRENT` or `=== CURRENT`, gets
overwritten with legacy-derived or brand-new default state — the actual field values already in
`awba_state` are never inspected, never salvaged, and are gone forever.

This is exactly the class of bug this phase (FND-05, "lossless migration") exists to close off,
and it isn't hypothetical: it's the very next event this file's own migration seam
(`var migrations = [];` at line 65, sized for future schema bumps) will trigger the moment
`CURRENT` is bumped to 2 and any tab still running the *old* engine build (schemaVersion 1 code,
cached via service worker / browser cache after a deploy) encounters a blob a newer tab already
wrote as schemaVersion 2 — `2 === 1` is false, `2 < 1` is false, so the old tab wipes the newer
blob back down to legacy/default. It's also reachable today from any external mutation of
`awba_state` that doesn't preserve `schemaVersion` exactly (a stray DevTools edit, a future bug
elsewhere that writes a partial blob) — none of the four `state-storage.test.js` migration tests
seed this scenario, so it's untested.

**Fix:**
```js
if (s && s.schemaVersion === CURRENT) return s;
if (s && typeof s.schemaVersion === 'number' && s.schemaVersion < CURRENT) {
  var migrated = runMigrations(s);
  persist(migrated);
  return migrated;
}
if (s && typeof s.schemaVersion === 'number' && s.schemaVersion > CURRENT) {
  // Newer-than-this-build blob (e.g. stale cached engine after a rollback/deploy race) —
  // never downgrade-and-wipe; use it as-is rather than silently discarding real progress.
  return s;
}
```
Add a regression test seeding `awba_state` with `schemaVersion: 2` (or `schemaVersion: 'x'`)
alongside real `noor`/`stars` values and asserting those values survive `load()`.

## Warnings

### WR-01: `AW.S.get()` / `AW.state()` return live references into `mem`, not defensive copies — bypasses the `get`/`set`-only write contract

**File:** `shared/awba-engine.js:202-212, 291-300`
**Issue:** This file's own header comment states `AW.S`/`AW.prefs` are "the ONLY code in this
codebase allowed to touch `localStorage`... every other page/section reads and writes progress
exclusively through `AW.S.get(key, default)` / `AW.S.set(key, value)`." But for object/array-valued
keys (`stars`, `days`, `chests`), `AW.S.get('stars', {})` returns `mem.stars` itself, not a copy —
and `AW.state()` builds its "one-read snapshot" out of the same live references:
```js
AW.state = function () {
  return { ..., stars: AW.S.get('stars', {}), days: AW.S.get('days', []), chests: AW.S.get('chests', {}), ... };
};
```
Any future caller (Phase 3/4 RUNNERS, which this file's own header says will be built directly on
this API) that does something as innocuous as `AW.state().stars[id] = 3` mutates `mem.stars`
in place *without ever calling `AW.S.set()`*. That mutation won't be `persist()`ed immediately —
but it silently corrupts the in-memory snapshot, and will get written to `localStorage` as a
side-effect the next time *anything else* calls `AW.S.set()` for an unrelated key (since `set()`
re-serializes the whole `mem` object). This defeats the single-write-path guarantee the file
documents as load-bearing.
**Fix:** Return deep copies for object/array-valued keys in `get()`, or at minimum in `AW.state()`:
```js
AW.state = function () {
  return {
    noor: AW.S.get('noor', 0),
    returns: AW.S.get('returns', 0),
    stars: Object.assign({}, AW.S.get('stars', {})),
    days: AW.S.get('days', []).slice(),
    lastDay: AW.S.get('lastDay', null),
    chests: Object.assign({}, AW.S.get('chests', {})),
  };
};
```

### WR-02: `runMigrations()` has no guard against a step that fails to bump `schemaVersion` — future infinite loop

**File:** `shared/awba-engine.js:67-76`
**Issue:**
```js
function runMigrations(state) {
  var s = state;
  while (s.schemaVersion < CURRENT) {
    var step = migrations[s.schemaVersion];
    if (typeof step !== 'function') break;
    s = step(s);
  }
  ...
}
```
Not reachable today (`migrations` is `[]`), but the moment a Phase-3+ migration function is added
and returns an object without incrementing `schemaVersion` (an easy one-line mistake), this loop
spins forever on the calling tab — a full hang, not a crash, since it's synchronous main-thread JS.
**Fix:** Add a hard iteration cap or assert forward progress:
```js
var guard = 0;
while (s.schemaVersion < CURRENT) {
  if (++guard > 50) break; // safety valve — never trust a migration step blindly
  var step = migrations[s.schemaVersion];
  if (typeof step !== 'function') break;
  var next = step(s);
  if (!next || next.schemaVersion <= s.schemaVersion) break; // no forward progress — stop
  s = next;
}
```

### WR-03: `validate-content.js` doesn't enforce `tile.good`/`tile.gentle` or `read` marker `.body` — narrower than the frozen contract it claims to be the executable version of

**File:** `scripts/validate-content.js:163-172` (marker), `scripts/validate-content.js:232-247` (tile)
**Issue:** The file's header states: "Source of truth for every rule below:
`.planning/research/ENGINE-CONTRACT.md` §1 (D-29) — this file IS the executable version of that
document." But `ENGINE-CONTRACT.md` §1 lists `tile`'s fields as `prompt, bank[], solution[], good,
gentle` and describes markers as `marker:{type: fact|remember|fard|angle, body}` — both `good`/
`gentle` (tile) and `body` (marker) are part of the documented shape. The implemented checks for
`tile` (lines 232-247) never reference `beat.good`/`beat.gentle`, and the `read`-beat marker check
(lines 163-172) only validates `marker.type`, never `marker.body`. This exactly matches the
narrower table in `02-RESEARCH.md` (lines 448/456), so it's plausibly a deliberate scoping
decision made during research rather than a code bug — but as written, it means a `tile` beat
missing `good`/`gentle`, or a marker missing `body`, **validates with zero errors**. `scripts/fixtures/valid-lesson.html`'s own `tile` beat (line 33-34) has no `good`/`gentle` and still
passes the self-test with 0 errors, confirming this in practice.
**Fix:** Either (a) reconcile `ENGINE-CONTRACT.md` §1 to explicitly say `tile`/marker `body` are
optional (matching the real-file survey and the code), or (b) if the omission was accidental,
add the missing checks:
```js
case 'tile':
  ...
  if (beat.good === undefined) errors.push(label + ' (tile): missing required field "good"');
  if (beat.gentle === undefined) errors.push(label + ' (tile): missing required field "gentle"');
  break;
```
```js
if (beat.marker !== undefined) {
  if (!isPlainObject(beat.marker) || MARKER_TYPES.indexOf(beat.marker.type) === -1) { ... }
  else if (beat.marker.body === undefined) errors.push(label + ' (read): missing required field "marker.body"');
}
```

### WR-04: `data-ref`/`data-term` ID-resolution regexes only match double-quoted attributes — single-quoted hand-authored markup silently escapes the dangling-citation check

**File:** `scripts/validate-content.js:279-306`
**Issue:**
```js
const refIds = uniq(Array.from(blob.matchAll(/data-ref="([^"]+)"/g)).map(...));
const termIds = uniq(Array.from(blob.matchAll(/data-term="([^"]+)"/g)).map(...));
```
`AW.cite()`'s sandbox stub always emits double-quoted `data-ref="..."`, so citation chips are
safe. But `.term[data-term]` spans (per `ENGINE-CONTRACT.md` §1: "`html` ... may contain
`.term[data-term]` spans") are hand-authored directly in lesson HTML strings, not generated by a
helper function — `scripts/fixtures/valid-lesson.html:17` demonstrates this with
`data-term="sampleterm"`. If a lesson author (or an editor's auto-format) writes
`data-term='sampleterm'` with single quotes instead, this regex silently fails to extract it: the
term is never flagged as a dangling reference (false pass on a genuinely broken citation) **and**
the correctly-defined `terms["sampleterm"]` entry gets incorrectly flagged as an "unused term"
warning even though it's actually referenced.
**Fix:** Match both quote styles:
```js
/data-(ref|term)=["']([^"']+)["']/g
```

### WR-05: Documented test-runner invocation (`node --test scripts/tests/`) fails with `MODULE_NOT_FOUND` on the pinned Node version, even though every test passes

**File:** `scripts/tests/state-storage.test.js:1` (representative — applies to the whole `scripts/tests/` directory and its documented invocation)
**Issue:** `.planning/phases/02-state-layer-engine-contract-freeze/02-VALIDATION.md` specifies
the "Quick run command" as `node --test scripts/tests/` and the "Full suite command" as
`node --test scripts/tests/ && node scripts/validate-content.js --self-test`, explicitly
"verified on Node v24.13.0". Reproduced in this environment on Node v24.13.0: both
`node --test scripts/tests` and `node --test scripts/tests/` throw
`Error: Cannot find module '.../scripts/tests'` (`MODULE_NOT_FOUND`) and exit 1 — Node treats the
explicit directory argument as a literal module path to `require()` rather than expanding it,
rather than the implicit-discovery directory recursion the doc's phrasing implies. All 17 tests
pass cleanly only when invoked with an explicit glob: `node --test scripts/tests/*.test.js`. Any
CI job or developer that copy-pastes the documented command as-is gets a false "tests failed"
signal even though every test is green.
**Fix:** Update the documented command to `node --test scripts/tests/*.test.js` (verified working
in this environment), or pin/verify the exact Node version and flags under which the directory
form is confirmed to work before relying on it in an automated gate.

## Info

### IN-01: `pad`/`ymd` date helper duplicated between `state-storage.test.js` and `state-helpers.test.js`; the export inviting reuse is itself unsafe

**File:** `scripts/tests/state-storage.test.js:18-25, 161-162`, `scripts/tests/state-helpers.test.js:16-23`
**Issue:** Both files define byte-identical `pad(n)`/`ymd(offsetDays)` helpers.
`state-storage.test.js` even does `module.exports = { ymd };` with a comment saying it's
"exported only so state-helpers.test.js can reuse the exact same local-date helper if desired" —
but `state-helpers.test.js` never imports it, and re-declares its own copy instead. Worse: because
`state-storage.test.js` has top-level `test(...)` calls that run at `require()` time,
`require('./state-storage.test.js')` from another test file would re-execute/re-register its
entire suite as a side effect of pulling in the helper — the invitation in the comment is a latent
footgun, not just unused.
**Fix:** Extract `pad`/`ymd` into a small non-test helper module (e.g. `scripts/tests/date-helpers.js`)
and have both test files `require` it; drop the `module.exports` from `state-storage.test.js`.

### IN-02: `ingest()` only extracts the first inline `<script>` block in a data file

**File:** `scripts/validate-content.js:38-67`
**Issue:** `src.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/i)` uses `.match()`
without the `g` flag, so only the first matching inline (non-`src`) `<script>` block is captured.
The comment documents this as a deliberate assumption ("each data file has exactly one such
block"), true of the 19 real files surveyed and all 3 fixtures — but there's no defensive check
or explicit diagnostic if a future data file adds a second inline `<script>` (e.g. analytics,
a feature flag) before the `AwbaLesson`/`AwbaReview` call; the validator would silently ingest the
wrong block and report the less-informative generic "unrecognized cfg kind" error rather than
naming the real cause.
**Fix:** Low priority given the current 1:1:1 file shape, but consider matching all inline
`<script>` blocks and looking for the one that assigns `cfg`, or erroring explicitly when more
than one non-`src` `<script>` block is found.

### IN-03: Required string fields (`id`, `unitColor`, `journey`, etc.) are only checked for `!== undefined`, not for being non-empty

**File:** `scripts/validate-content.js:99-101, 118-120`
**Issue:** `checkTopLevelLesson`/`checkTopLevelReview` treat any non-`undefined` value as valid,
including `''`. Since `id` is documented (`ENGINE-CONTRACT.md` §1) as the stars/progress key
(`awba_stars[id]`, `awba_chest_<id>`), a lesson or review authored with `id:''` would pass
validation cleanly yet silently collide with any other file that also ends up with an empty id in
the shared `stars{}`/`chests{}` keyspace, corrupting progress tracking across files.
**Fix:**
```js
['id', 'unitColor', 'journey'].forEach(function (f) {
  if (cfg[f] === undefined) errors.push('missing required top-level field: "' + f + '"');
  else if (typeof cfg[f] === 'string' && cfg[f].trim() === '') errors.push('required field "' + f + '" must not be empty');
});
```

---

_Reviewed: 2026-07-12T11:50:37Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
