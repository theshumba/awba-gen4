# Phase 2: State Layer & Engine-Contract Freeze - Research

**Researched:** 2026-07-12
**Domain:** Zero-build vanilla-JS persistence layer (versioned localStorage wrapper + lossless Gen-3 migration) and a zero-npm-dependency Node content validator that freezes the `AwbaLesson`/`AwbaReview` config contract as executable checks.
**Confidence:** HIGH — every key mechanism below (vm ingestion of real data files, headless migration against the real Gen-3 engine, the local-date conversion, the beat/field inventory) was verified by executing it against Josh's actual `_MVP-BUILD/` source this session, not inferred from training data.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**State schema & migration (FND-05)**
- **D-13:** Single blob `localStorage['awba_state']`, shape per ARCHITECTURE.md: `{schemaVersion: 1, noor, returns, lastDay, days[], stars{}, chests{}}`. Legacy `awba_chest_<id>` boolean keys consolidate into the `chests{}` map. `stars` stays best-of, never downgrades, shared namespace lessons+reviews.
- **D-14:** Migration is hidden entirely inside `AW.S` (the only code allowed to touch `localStorage`): (1) `awba_state` at current version → use; (2) older version → sequential migration chain `migrations[n]`; (3) absent but legacy Gen-3 discrete keys (`awba_noor`, `awba_returns`, `awba_lastDay`, `awba_days`, `awba_stars`, `awba_chest_*`) present → construct v1 from them, write once; (4) nothing → default v1.
- **D-15:** Migration is **non-destructive**: legacy `awba_*` keys are read but never deleted (once `awba_state` exists it wins on later loads). Cheap rollback insurance; reviewer can verify losslessness by diffing legacy keys against the new blob.
- **D-16:** `lastDay`/`days[]` move to stable `"YYYY-MM-DD"` **local-date** strings internally; the migration converts legacy `toDateString()` values. Day boundaries stay local-timezone exactly like Gen-3 (`touchDay` semantics unchanged, days capped at last 90) — no timezone robustness engineering in v1.

**AW.S surface & state API (FND-05)**
- **D-17:** External call shape frozen: `AW.S.get(key, default)` / `AW.S.set(key, value)` — generic key/value against the in-memory parsed blob, whole blob persisted on every `set`. Callers never learn about `awba_state` or versions. (Future backend seam — do NOT build any adapter now.)
- **D-18:** State-layer helpers land now as pure, DOM-free functions: `AW.state()`, `AW.touchDay()`, `AW.greetMode()`, `AW.weekCal()`, `AW.deriveNodeState(nodesFlat, progress)`. `deriveNodeState` ships as a pure function with fixture tests; its unlock-order behavior against the real course map is *verified* in Phase 5 (CNT-03), not here.
- **D-19:** Gen-3 semantics preserved exactly: `touchDay()` dedups by day and appends to `days` (fires on lesson/review begin, never on page load); `greetMode()` returns first/streak/returning by day-diff; single `AW.state()` read per render pass is the documented consumption pattern (never re-read in loops).

**Preferences store (FND-06)**
- **D-20:** Separate blob `localStorage['awba_prefs']` — never mixed into progress state. Shape: `{schemaVersion: 1, soundMuted: false, motion: 'system' | 'reduce'}` behind `AW.prefs.get/set` (same wrapper pattern as AW.S, own key).
- **D-21:** Prefs apply at boot by stamping attributes on `<html>`: `data-motion="reduce"` (only when user override active) and `data-sound="muted"`. Phase 3 binds motion to `prefers-reduced-motion` OR `[data-motion="reduce"]`; Phase 4 reads `data-sound`/prefs for cues. Phase 2 only ships the store + boot stamping.

**Classic scripts & namespace (FND-07)**
- **D-22:** One engine file `shared/awba-engine.js` begins now with banner-commented sections (STATE first; KIT/COMPONENTS/RUNNERS are labelled placeholders for Phases 3–4). NOT split into multiple JS files. Only net-new `awba-learn.js` (Phase 5) ever splits out.
- **D-23:** `window.AW` is defined **synchronously at parse time** — no `defer`/`async`, no DOMContentLoaded wrapping for namespace definition — because Josh's lesson files call `AW.cite(...)` inside cfg string concatenation the moment their inline script runs. Everything works double-clicked from `file://`; zero ES modules; font/CSS URLs stay page-relative (never leading slash).
- **D-24:** Strict boundary from day one: `AW.S`/`AW.prefs` are the ONLY localStorage readers/writers in the codebase — enforced by a grep gate in plans (`localStorage` appears only inside the state section of awba-engine.js).

**Content validator — the executable contract freeze (ENG-07)**
- **D-25:** `scripts/validate-content.js` — plain Node, zero npm dependencies, classic single file, exit 0/1 with a human-readable per-file error report. Dev tooling may use Node freely (like the existing python glyph gate); the *site* stays zero-build.
- **D-26:** Data files are HTML pages with inline `AwbaLesson({...})`/`AwbaReview({...})` calls → the validator executes each file's inline script in a `node:vm` sandbox with stubbed globals (`AwbaLesson`/`AwbaReview` capture cfg; `AW.cite(id,label)` returns the real `<span class="cite" data-ref="…">` markup so embedded citation IDs are extractable and cfg strings stay intact). No regex-parsing of the object literal — evaluate, then validate the captured cfg.
- **D-27:** Checks (the frozen contract, from ENGINE-CONTRACT.md §1): known beat types only (read/frame/verse/panel/depth/reflect/mc/tf/tile); required per-type fields present with correct types; every `data-ref`/`AW.cite` ID resolves in `cfg.refs` and every `data-term` in `cfg.terms` (flag unused dictionary entries as warnings); `mc.c` in range of `o[]`; `tile.solution ⊆ bank` and exact-length; panel `variant` ∈ {pull,tell,guard,check}; depth lenses = exactly {reality,revelation,ruling}; marker types ∈ {fact,remember,fard,angle}; review items MC/TF shapes with explanation `t`; `next.href`/`label` present where required; top-level required fields (`id`, `unitColor`, `opener`, `beats`, `refs`, `terms`, `recap` for lessons; `id`, `title`, `sub`, `mastery`, `items` for reviews).
- **D-28:** Fixtures in `scripts/fixtures/`: one **valid** lesson + one valid review using neutral placeholder copy (obviously non-scripture filler — we NEVER author religious content, even in fixtures), and one **deliberately broken** lesson violating multiple rules. Validator self-test: broken fixture MUST fail with specific errors, valid fixtures MUST pass. In Phase 4 the same validator runs against all 19 real ported files as the port gate.
- **D-29:** Contract documentation stays in ENGINE-CONTRACT.md; the validator is the *executable* freeze. No duplicate contract doc in the repo root — Josh-facing README is Phase 7 scope (PLT-04).

**Verification vehicle**
- **D-30:** Phase-2 proof is script-first, not visual: (a) validator self-test; (b) a migration test that seeds legacy Gen-3 `awba_*` keys and asserts every value lands losslessly in `awba_state` — runnable headlessly (node vm with a localStorage stub) AND reproducible by a reviewer in a real browser via a short seeded-console recipe recorded in the SUMMARY. If a small dev harness page helps the human gate, keep it inside `preview.html`-style dev surface or `scripts/` — never shipped navigation.

### Claude's Discretion
- Internal file organization of the state section, exact error-message wording in the validator, warning-vs-error classification for non-contract lint findings, fixture copy (neutral placeholder text), and whether the migration test harness is a node script or an HTML dev page — planner/executor judgment within the decisions above.

### Deferred Ideas (OUT OF SCOPE)
- Timezone-robust day boundaries (UTC or tz-aware streaks) — deliberately NOT v1 (D-16).
- Backend/Supabase storage adapter behind `AW.S` — out of scope; the seam exists, nothing more.
- Per-citation verified/pending state (vs the global "pending review" string) — belongs with the scholar-gate workflow.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **FND-05** | All progress state in one versioned localStorage blob with a migration chain that imports Gen-3 `awba_*` keys losslessly, behind `AW.S.get/set`. | Runtime State Inventory (exact legacy key formats) + verified headless-migration POC + local-date conversion (with the toISOString off-by-one proven). Gen-3 `AW.S`/`state`/`touchDay`/`greetMode`/`weekCal` semantics extracted verbatim below. |
| **FND-06** | A user-preferences store (sound mute, reduced motion override) separate from progress state. | Same versioned-wrapper pattern as `AW.S`, own key `awba_prefs`; boot-stamp `<html>` attributes. Design in Architecture Patterns §Prefs. |
| **FND-07** | Classic scripts + one `AW` global namespace (NO ES modules) so every page works from `file://`. | Boilerplate confirmed identical across all 19 files (`<script src="../shared/awba-engine.js"></script>`); grep-gate acceptance criteria in §FND-07 Enforcement; `const AW` parse-time visibility mechanism explained. |
| **ENG-07** | A standalone Node validator checking beat types, resolvable citation/term IDs, required fields, in-range answer indices — a self-testing executable contract freeze. | Full contract-check table (grounded in a survey of all 19 real files), verified `node:vm` ingestion POC, and the two extraction gotchas (quote-escaping, sandbox surface = only `AW.cite`). |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Zero build step / zero framework / no bundler** — Josh reviews by opening files. Dev tooling (Node validator, Python glyph gate) is allowed but must not become a *site* dependency.
- **Classic scripts only, no CDN** — engine and data files load via classic `<script src>`; no ES modules, no `type="module"`, no `defer`/`async` on the engine tag.
- **Font/CSS URLs never leading-slash** — page-relative (`../shared/...`) so `file://` works. (Phase 2 touches no CSS, but any dev-harness `<head>` must obey this.)
- **Content integrity** — scripture verbatim only; NO generated religious content, even in validator fixtures (use neutral placeholder filler).
- **Mercy laws bind dev tooling too** — validator output is calm and specific (file → what's wrong → how to fix); no alarm-red ANSI walls; amber never red.

## Summary

This phase is unusually low-risk to research and high-risk to *guess*: everything hinges on reproducing Gen-3's exact runtime semantics, and those semantics are only knowable by reading (and running) Josh's actual `_MVP-BUILD/` code. I did both. The state layer is a ~120-line versioned localStorage wrapper plus a one-step migration function; the validator is a ~200-line Node script whose only non-trivial move is executing each data file's inline script in a `node:vm` sandbox. Both were proven end-to-end this session against the real files. There are **zero external packages** — Node core (`node:vm`, `node:test`, `node:assert`, `node:fs`) covers everything, satisfying the zero-npm-deps constraint outright.

The single most important deliverable of this research is the **exact Gen-3 contract extract** (below): key names, JSON shapes, the `touchDay` day-dedup + `returns++`-on-new-day logic, `greetMode`'s `diff<=1 → streak else returning` threshold, the `days.slice(-90)` cap, `stars` best-of semantics, and the `awba_chest_<id>` boolean key format. The migration's whole job is to fold those six discrete legacy keys into one v1 blob **losslessly**, and the one non-obvious hazard — converting legacy `toDateString()` values to `YYYY-MM-DD` — carries a verified off-by-one trap: `Date.prototype.toISOString().slice(0,10)` returns the **wrong local date** in any negative-or-positive UTC offset (I measured `2026-07-11` local → `2026-07-10` via toISOString in BST). The migration MUST format from local `getFullYear()/getMonth()/getDate()`.

Two `node:vm` patterns anchor the phase, and they run in **opposite directions**: the *validator* provides `AwbaLesson`/`AwbaReview`/`AW.cite` as sandbox globals and runs only the data file's inline script (reads resolve to sandbox props — works cleanly); the *migration test* runs the whole engine plus a probe **concatenated into one script**, because `const AW = {}` at engine top-level is a lexical binding that is NOT exposed as a context property (verified: `ctx.AW` is `undefined` after a separate run, while `ctx.AwbaLesson` — a function declaration — is a function). Get this wrong and the migration test throws `AW is not defined`.

**Primary recommendation:** Build the STATE section of `shared/awba-engine.js` first (DOM-free, `AW.S`/`AW.prefs`/`AW.state`/`AW.touchDay`/`AW.greetMode`/`AW.weekCal`/`AW.deriveNodeState` + the v1 migration), then `scripts/validate-content.js` with `node:vm` ingestion, then `scripts/fixtures/` (valid lesson + valid review + one deliberately-broken lesson), then a `node:test` harness covering migration losslessness and validator self-test. Use only Node core modules. Format all legacy dates from local components, never `toISOString`.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Progress persistence (`awba_state`) | Browser / Client (localStorage) | — | Device-local single-user by design (PROJECT.md); no backend in v1. |
| Preferences persistence (`awba_prefs`) | Browser / Client (localStorage) | — | Separate blob so clearing/migrating one can't corrupt the other (D-20). |
| Legacy→v1 migration | State layer (`AW.S` internals) | — | Only `AW.S` touches localStorage (D-24); migration is invisible to callers (D-14). |
| Boot-time `<html>` attribute stamping | Client (inline, parse-time) | CSS (Phase 3 consumes attrs) | Prefs must be applied before first paint to avoid a motion/sound flash (D-21). |
| Content contract validation | Dev tooling (Node CLI) | — | Runs at author-time, never shipped (D-25); Node core only, zero site impact. |
| Node-state derivation (`deriveNodeState`) | State layer (pure fn) | Learn page (Phase 5 consumer) | Pure/DOM-free so it is unit-testable now; wired to the real map in Phase 5. |

**Sanity note for the planner:** every capability in this phase is either *client storage* or *dev tooling*. Nothing here belongs to a server, API, or CDN tier — there are none. Any task that reaches for a network fetch, a DOM component, an icon, or an engine runner is out of Phase-2 scope (those are Phases 3–5).

## Standard Stack

### Core
| "Library" | Version | Purpose | Why Standard |
|-----------|---------|---------|--------------|
| `node:vm` (Node core) | Node 24.13.0 (present) | Execute each data file's inline `Awba*(cfg)` call in an isolated context with stubbed globals; capture cfg without a DOM parser. | The canonical zero-dep way to evaluate untrusted-ish JS with controlled globals. `vm.createContext(sandbox)` + `vm.runInContext(code, sandbox)`. [VERIFIED: ran against `_MVP-BUILD/lessons/u1-m1.html` this session] |
| `node:test` (Node core) | Node 24.13.0 | Built-in test runner (`node --test`) for the migration-losslessness and validator-self-test suites. | Stable core module since Node 20; no npm install, satisfies zero-deps. [VERIFIED: `require('node:test')` OK on this machine] |
| `node:assert` (Node core) | Node 24.13.0 | Assertions inside the test suites. | Core; pairs with `node:test`. [VERIFIED: `require('node:assert')` OK] |
| `node:fs` (Node core) | Node 24.13.0 | Read data files / engine source in validator + tests. | Core. |
| Hand-written localStorage stub | in-repo (~10 lines) | Back the headless migration test with a `Map`-based `getItem/setItem/removeItem/key/length`. | Avoids `jsdom`/`mock-localStorage` npm deps; localStorage's surface is trivially small. [VERIFIED: stub drove the real Gen-3 `AW.S`/`touchDay`/`state` correctly this session] |

### Supporting
| Component | Purpose | When to Use |
|-----------|---------|-------------|
| `scripts/check-glyph-coverage.py` (existing) | Precedent for a `scripts/`-dir dev gate that exits non-zero. | Reference only — `validate-content.js` joins it in the same directory with the same "gate exits 1 on failure" convention. Do not modify it. |
| `preview.html` (Phase 1) | Proven classic-inline-JS-over-`file://` pattern + canonical `<head>` boilerplate. | Template if the migration harness is built as an HTML dev page (Claude's discretion, D-30). Not shipped navigation. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `node:vm` sandbox ingestion | Regex-extract the object literal and `JSON.parse` | REJECTED by D-26 and by reality: cfg strings contain `AW.cite(...)` **calls** and JS (not JSON) syntax (trailing commas, single quotes, `+` concatenation, `<em>` HTML). Only evaluation, not parsing, yields the real cfg. |
| Hand-written localStorage stub | `jsdom`, `mock-localStorage`, `global-jsdom` npm packages | REJECTED: adds npm dependencies to a zero-deps project for a 10-line stub; jsdom is ~40MB of transitive deps for a Map. |
| `node:test` | `vitest`/`jest`/`tape` | REJECTED: all are npm deps; `node --test` is core and sufficient. |
| localStorage versioned blob | IndexedDB / `localForage` / `Dexie` | REJECTED (STACK.md): state is tiny JSON; IndexedDB wrappers are unneeded abstraction. |

**Installation:** None. This phase installs zero packages. All tooling uses Node core modules already present (Node v24.13.0 verified on this machine). No `package.json` is required or created.

**Version verification:** `node --version` → `v24.13.0` [VERIFIED this session]. `node -e "require('node:test');require('node:vm');require('node:assert')"` → all load [VERIFIED]. `python3 --version` → `3.9.6` [VERIFIED] (present for the existing glyph gate; not needed by Phase 2).

## Package Legitimacy Audit

**No external packages are installed in this phase.** By constraint D-25, the validator and tests are zero-npm-dependency and use only Node core modules (`node:vm`, `node:test`, `node:assert`, `node:fs`). There is no `package.json`, no `npm install`, and no registry surface to audit. slopcheck / registry verification is **not applicable** — there is nothing to slopcheck.

| Package | Registry | Disposition |
|---------|----------|-------------|
| (none) | — | Zero external dependencies by design. |

If a future task proposes adding any npm package to satisfy this phase, that is a scope violation of D-25 and should be rejected at plan-check.

## Architecture Patterns

### System Architecture Diagram

```
                        ┌─────────────────────────────────────────────┐
   double-click a       │  BROWSER (file:// or https)                 │
   lesson/review  ─────▶│  <script src="../shared/awba-engine.js">    │
   HTML page            │     parse-time: `const AW = {}` defined,     │
                        │     AW.cite/AW.S/AW.prefs/... all synchronous│
                        │  <script> AwbaLesson({...AW.cite(...)...}) </script>
                        └───────────────┬─────────────────────────────┘
                                        │ reads/writes progress
                                        ▼
                        ┌─────────────────────────────────────────────┐
   any caller  ────────▶│  AW.S.get(k,d) / AW.S.set(k,v)   (FND-05)   │
   (runner, learn,      │  AW.prefs.get(k,d)/ set(k,v)     (FND-06)   │
   HUD)                 │  ── the ONLY localStorage touchers (D-24) ──│
                        │                                             │
                        │  on first read, AW.S resolves state:        │
                        │   1. awba_state@vCURRENT  → use             │
                        │   2. awba_state@older     → migrations[n..] │
                        │   3. legacy awba_* keys   → build v1, write │
                        │   4. nothing              → default v1       │
                        └───────────────┬─────────────────────────────┘
                                        ▼
                        ┌─────────────────────────────────────────────┐
                        │  localStorage                               │
                        │   ['awba_state'] = {schemaVersion:1, noor,   │
                        │        returns, lastDay, days[], stars{},    │
                        │        chests{}}                             │
                        │   ['awba_prefs'] = {schemaVersion:1,         │
                        │        soundMuted, motion}                   │
                        │   (legacy awba_noor / _returns / _lastDay /  │
                        │    _days / _stars / _chest_<id>  ← READ once │
                        │    on migration, NEVER deleted — D-15)       │
                        └─────────────────────────────────────────────┘

   DEV-TIME (never shipped, never a site dep):
                        ┌─────────────────────────────────────────────┐
   node scripts/  ─────▶│  validate-content.js                        │
   validate-content.js  │   for each lessons/*.html, reviews/*.html:  │
                        │    1. extract inline (non-src) <script>      │
                        │    2. node:vm run in sandbox {AwbaLesson,    │
                        │       AwbaReview, AW.cite} → capture cfg     │
                        │    3. run contract checks (D-27)             │
                        │   exit 0 (all pass) | 1 (any error)          │
                        └─────────────────────────────────────────────┘
   node --test scripts/*.test.js  → migration losslessness + validator self-test
```

### Recommended Project Structure (Phase-2 additions only)
```
awba-gen4/
├── shared/
│   └── awba-engine.js          # NEW — STATE section built now; KIT/COMPONENTS/RUNNERS
│                               #   are banner-commented placeholders (D-22)
├── scripts/
│   ├── check-glyph-coverage.py # existing (Phase 1) — untouched precedent
│   ├── validate-content.js     # NEW — the executable contract freeze (ENG-07)
│   ├── fixtures/               # NEW
│   │   ├── valid-lesson.html   # neutral placeholder copy, passes all checks
│   │   ├── valid-review.html   # neutral placeholder copy, passes
│   │   └── broken-lesson.html  # violates ≥3 rules (unknown beat, dangling ref, OOR index)
│   └── (migration + self-test)  # e.g. state.test.js / validate.test.js  (node --test)
```
*Exact internal file organization of the state section and whether the migration harness is a `.test.js` or an HTML dev page are Claude's discretion (D-30, CONTEXT.md).*

### Pattern 1: Versioned localStorage wrapper with lazy migration (FND-05, D-13/D-14/D-17)

**What:** `AW.S` owns a single in-memory parsed blob. First access resolves it via the 4-step chain; every `set` re-persists the whole blob. Callers only see generic `get(key, default)` / `set(key, value)`.

**When to use:** All progress reads/writes. This is the frozen external surface — Phase 4/5 runners depend on `AW.S.get('noor', 0)`, `AW.S.set('stars', {...})`, etc. exactly as Gen-3 exposed them.

**Skeleton (illustrative — not verbatim Gen-3, which had no versioning):**
```js
// Source: pattern derived from ARCHITECTURE.md "Persistent State Layer" + verified against Gen-3 AW.S behavior
AW.S = (function () {
  var KEY = 'awba_state', CURRENT = 1, mem = null;
  var LEGACY_KEYS = ['noor','returns','lastDay','days','stars']; // + awba_chest_*
  function defaultState() { return { schemaVersion: CURRENT, noor: 0, returns: 0, lastDay: null, days: [], stars: {}, chests: {} }; }
  function migrateFromLegacy() {
    var s = defaultState(), found = false;
    // read each discrete legacy key with the SAME try/catch tolerance Gen-3 had
    var noor = readLegacy('awba_noor');    if (noor    !== undefined) { s.noor    = noor;    found = true; }
    var ret  = readLegacy('awba_returns'); if (ret     !== undefined) { s.returns = ret;     found = true; }
    var last = readLegacy('awba_lastDay'); if (last    != null)       { s.lastDay = toLocalYMD(new Date(last)); found = true; }
    var days = readLegacy('awba_days');    if (Array.isArray(days))   { s.days    = days.map(function(d){return toLocalYMD(new Date(d));}).filter(valid).slice(-90); found = true; }
    var st   = readLegacy('awba_stars');   if (st && typeof st==='object') { s.stars = st; found = true; }
    // enumerate awba_chest_<id> via Object.keys(localStorage) → chests{}
    try { Object.keys(localStorage).forEach(function (k) {
      if (k.indexOf('awba_chest_') === 0 && readLegacy(k) === true) { s.chests[k.slice('awba_chest_'.length)] = true; found = true; }
    }); } catch (e) {}
    return found ? s : null;
  }
  function load() {
    var raw = safeGetRaw(KEY);
    if (raw) { try { var s = JSON.parse(raw);
      if (s && s.schemaVersion === CURRENT) return s;
      if (s && s.schemaVersion  <  CURRENT) return runMigrations(s); // migrations[s.schemaVersion..CURRENT-1]
    } catch (e) {/* corrupted → fall through */} }
    var fromLegacy = migrateFromLegacy();
    if (fromLegacy) { persist(fromLegacy); return fromLegacy; } // write ONCE (D-14 step 3); legacy keys NOT deleted (D-15)
    var def = defaultState(); persist(def); return def;
  }
  function persist(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {/* quota/private-mode: session still works */} }
  return {
    get: function (k, d) { if (!mem) mem = load(); return (k in mem && mem[k] !== undefined) ? mem[k] : d; },
    set: function (k, v) { if (!mem) mem = load(); mem[k] = v; persist(mem); }
  };
})();
```
Notes: `readLegacy` / `safeGetRaw` wrap `localStorage.getItem` + `JSON.parse` in try/catch and return `undefined`/`null` on any failure — matching Gen-3's silent-tolerant `AW.S.get`. Keep the migration idempotent: after the one-time write, step 1 (`awba_state@CURRENT`) wins forever, so re-running is a no-op.

### Pattern 2: `node:vm` cfg ingestion for the validator (ENG-07, D-26) — VERIFIED

**What:** Extract the inline (non-`src`) `<script>` from a data file, run it in a `vm` context whose globals are exactly `{ AwbaLesson, AwbaReview, AW: { cite } }`, and capture the cfg the file passes.

**Verified surface:** A grep across all 19 files shows the **only** `AW.*` symbol any inline script touches is `AW.cite` (52 calls total; nothing else). So the sandbox needs three stubs and nothing more. `AW.cite` must return the real `<span class="cite" data-ref="ID">…</span>` markup so citation IDs survive into the captured strings.

```js
// Source: VERIFIED this session against _MVP-BUILD/lessons/u1-m1.html (id=u1m1, beats=7 captured)
const fs = require('node:fs'), vm = require('node:vm');
function ingest(file) {
  const src = fs.readFileSync(file, 'utf8');
  // extract inline script only (skip <script src=...>). Each file has exactly ONE such block (verified across all 19).
  const m = src.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/i);
  if (!m) throw new Error('no inline <script> in ' + file);
  let cfg = null, kind = null;
  const sandbox = {
    AW: { cite: (id, label) => '<span class="cite" data-ref="' + id + '">' + (label || '') + '</span>' },
    AwbaLesson: (c) => { cfg = c; kind = 'lesson'; },
    AwbaReview: (c) => { cfg = c; kind = 'review'; },
    // (console optional; no data file references it)
  };
  vm.createContext(sandbox);
  vm.runInContext(m[1], sandbox, { filename: file });
  return { cfg, kind };
}
```

### Pattern 3: Extract embedded IDs from captured cfg — the quote-escaping gotcha (VERIFIED)

**What:** After capture, collect every `data-ref="…"` and `data-term="…"` ID and check them against `cfg.refs` / `cfg.terms`.

**Gotcha (measured this session):** `JSON.stringify(cfg)` **escapes the double quotes** (`data-ref=\"id\"`), so a regex `/data-ref="([^"]+)"/` finds **nothing**. Walk the object collecting **raw** string values instead, then regex over those.

```js
// Source: VERIFIED — first attempt via JSON.stringify returned [] (empty); raw-walk returned the correct IDs.
function collectStrings(o, acc) {
  if (typeof o === 'string') acc.push(o);
  else if (Array.isArray(o)) o.forEach(x => collectStrings(x, acc));
  else if (o && typeof o === 'object') Object.values(o).forEach(x => collectStrings(x, acc));
  return acc;
}
const blob = collectStrings(cfg, []).join('\n');       // RAW strings, NOT JSON.stringify
const refIds  = [...new Set([...blob.matchAll(/data-ref="([^"]+)"/g)].map(x => x[1]))];
const termIds = [...new Set([...blob.matchAll(/data-term="([^"]+)"/g)].map(x => x[1]))];
const danglingRefs  = refIds.filter(id => !cfg.refs  || !cfg.refs[id]);   // ERROR
const danglingTerms = termIds.filter(id => !cfg.terms || !cfg.terms[id]); // ERROR
const unusedRefs  = Object.keys(cfg.refs  || {}).filter(id => !refIds.includes(id));   // WARN
const unusedTerms = Object.keys(cfg.terms || {}).filter(id => !termIds.includes(id));  // WARN
```
On `u1-m1.html` this yields refs `[hujurat-49-15, muslim-8, anam-6-149]`, terms `[aqeedah, tawhid, iman]`, zero dangling, zero unused — [VERIFIED].

### Pattern 4: Headless migration test via engine+probe concatenation (D-30) — VERIFIED, with the `const AW` gotcha

**What:** Prove migration losslessness under Node by seeding a localStorage stub with legacy keys, loading the engine, and asserting the resolved values.

**Gotcha (measured this session):** `const AW = {}` at engine top-level is a **lexical binding**, not a context property. After `vm.runInContext(engineSrc, ctx)`, `ctx.AW` is `undefined` (but `ctx.AwbaLesson`, a *function declaration*, IS a function). To read `AW.S` from the test, run **engine + probe as one concatenated script** so the probe shares the engine's lexical scope:

```js
// Source: VERIFIED against the real _MVP-BUILD/shared/awba-engine.js this session.
// touchDay correctly bumped returns 3→4 and appended today; greetMode returned 'streak'; chest read true.
const fs = require('node:fs'), vm = require('node:vm');
function makeLS(seed) { const m = new Map(Object.entries(seed || {}));
  return { getItem: k => m.has(k) ? m.get(k) : null, setItem: (k, v) => m.set(k, String(v)),
    removeItem: k => m.delete(k), key: i => [...m.keys()][i], get length() { return m.size; },
    _dump: () => Object.fromEntries(m) }; }
const ls = makeLS({ 'awba_noor':'120', 'awba_returns':'3',
  'awba_lastDay': JSON.stringify(new Date(Date.now()-864e5).toDateString()),
  'awba_days':    JSON.stringify([new Date(Date.now()-864e5).toDateString()]),
  'awba_stars':   JSON.stringify({ u1m1: 3, u1m2: 2 }),
  'awba_chest_u1c':'true' });
const sandbox = { localStorage: ls, Date, Math, JSON, console };
vm.createContext(sandbox);
const engine = fs.readFileSync('shared/awba-engine.js', 'utf8');
const probe  = `;globalThis.__out = { blob: AW.S.get('noor',0), state: AW.state() };`;
vm.runInContext(engine + '\n' + probe, sandbox);  // ONE script → probe sees lexical `AW`
```
For the Gen-4 engine the probe should assert the **`awba_state` blob** itself (read `ls._dump()['awba_state']`) equals the seeded legacy values, field-by-field, and that legacy keys are still present (D-15 non-destructive check).

**Alternative the planner may choose:** have the Gen-4 STATE section end with `globalThis.AW = AW;` (or author `window.AW`) so headless tests can use a *separate* context and read `ctx.AW` directly. Either works in-browser (data files reference `AW` as a free identifier, which resolves against the shared script-scope lexical env regardless of whether it is also a `window` property). Concatenation is the safe default that needs no engine change.

### Pattern 5: Preferences store (FND-06, D-20/D-21)

**What:** `AW.prefs` = the same versioned-wrapper shape as `AW.S`, own key `awba_prefs`, default `{schemaVersion:1, soundMuted:false, motion:'system'}`. At boot (parse-time, synchronous), stamp `<html>`:
```js
// only stamp data-motion when the user has actively overridden to 'reduce' (D-21):
if (AW.prefs.get('motion','system') === 'reduce') document.documentElement.setAttribute('data-motion','reduce');
if (AW.prefs.get('soundMuted', false))            document.documentElement.setAttribute('data-sound','muted');
```
This is the ONE place in the STATE section that touches the DOM (`document.documentElement`) — keep it guarded so the migration test (which has no `document`) doesn't execute it, e.g. `if (typeof document !== 'undefined') { …stamp… }`. Phase 3 binds motion to `prefers-reduced-motion` OR `[data-motion="reduce"]`; Phase 4 reads `data-sound`.

### Anti-Patterns to Avoid
- **ES modules / `defer` / `async` on the engine tag** — breaks `AW.cite` parse-time availability and `file://` review (ARCHITECTURE.md anti-pattern 1; PITFALLS #2). Data files call `AW.cite` *inside the cfg literal* the instant their inline script runs.
- **Splitting the engine into multiple JS files** — would force a new `<script src>` into all 19 of Josh's files (anti-pattern 2, D-22). One file, banner sections.
- **Regex-parsing the cfg object literal** — cfg is JS with `AW.cite()` calls, single quotes, trailing commas, embedded HTML; only `vm` evaluation is correct (D-26).
- **`toISOString().slice(0,10)` for local dates** — verified off-by-one (see Pitfall 1). Format from local components.
- **Re-reading `AW.state()` inside render loops** — anti-pattern 3; the documented pattern is one read per render pass (D-19).
- **Deleting legacy keys during migration** — violates D-15 (non-destructive rollback insurance).
- **Any localStorage access outside `AW.S`/`AW.prefs`** — violates D-24; enforced by grep gate.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Evaluate a data file's cfg with controlled globals | A custom JS tokenizer / object-literal parser | `node:vm` sandbox (Pattern 2) | cfg is executable JS (calls, concatenation, HTML) — a parser would need to re-implement JS. |
| Back the migration test with a browser-like storage | `jsdom` / `mock-localStorage` npm packages | 10-line `Map`-backed stub (Pattern 4) | localStorage's real surface is 5 methods; a dep is pure overhead in a zero-deps project. |
| Run the test suites | `vitest` / `jest` | `node --test` + `node:assert` (core) | Core modules satisfy zero-npm-deps; no config, no install. |
| Convert a `Date` to a local `YYYY-MM-DD` | `moment` / `date-fns` / `toISOString()` | `y + '-' + pad(m+1) + '-' + pad(d)` from local getters | Verified correctness (Pitfall 1); libraries are unnecessary and `toISOString` is wrong. |
| Extract the inline script from HTML | An HTML/DOM parser (`cheerio`, `jsdom`) | `/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/i` | Each file has exactly one inline non-src script (verified across all 19); a single regex suffices and keeps zero deps. |

**Key insight:** the entire phase is buildable with Node core + one Map stub + one regex. Every temptation to reach for a package (jsdom, a test framework, a date lib) is both unnecessary and a direct violation of D-25's zero-npm-deps rule.

## Runtime State Inventory

> This phase migrates Gen-3 runtime state, so this section is load-bearing. "Nothing found" is stated explicitly where true.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| **Stored data** | Gen-3 browsers hold six discrete `awba_*` localStorage keys (see exact formats below). These are the migration *source*. In Josh's own review browser these may already have real progress. | Migration (D-14 step 3): construct v1 `awba_state` from them, write once, do NOT delete (D-15). This is the core of FND-05. |
| **Live service config** | None — device-local static app, no backend, no external service, no n8n/Datadog/Cloudflare. Verified: no network calls in the state layer (ARCHITECTURE.md: "content is data, not a live fetch"). | None. |
| **OS-registered state** | None — no Task Scheduler / launchd / systemd / pm2. It's a static web app. | None. |
| **Secrets / env vars** | None — no API keys, no SOPS, no `.env`. localStorage is unauthenticated device-local. | None. |
| **Build artifacts / installed packages** | None to migrate — no `package.json`, no compiled output, no egg-info. The new `validate-content.js` and fixtures are net-new dev tooling, not migrated artifacts. | None (net-new files only). |

### Exact Gen-3 legacy key formats (the migration SOURCE — read verbatim from `_MVP-BUILD/shared/awba-engine.js` this session)

`AW.S` prefixes every key with `awba_` and JSON-stringifies values. Discrete keys:

| Legacy key | Type / format | Example | v1 destination | Conversion |
|------------|---------------|---------|----------------|------------|
| `awba_noor` | number (JSON) | `120` | `state.noor` | copy as-is |
| `awba_returns` | number (JSON) | `3` | `state.returns` | copy as-is |
| `awba_lastDay` | `Date.toDateString()` string, or `null` | `"Sat Jul 11 2026"` | `state.lastDay` | `toLocalYMD(new Date(v))` → `"2026-07-11"` |
| `awba_days` | array of `toDateString()` strings, capped `slice(-90)` | `["Fri Jul 10 2026","Sat Jul 11 2026"]` | `state.days` | map each via `toLocalYMD`, drop unparseable, `slice(-90)` |
| `awba_stars` | object `{ [id]: 1\|2\|3 }`, best-of | `{u1m1:3, u1m2:2}` | `state.stars` | copy as-is (already best-of; never downgrade) |
| `awba_chest_<id>` | boolean, one key per chest; ids `u1c,u2c,u3c,u4c` | `awba_chest_u1c = true` | `state.chests` | enumerate via `Object.keys(localStorage)` filtering `awba_chest_` prefix → `{u1c:true, ...}` |

Chest ids are exactly `u1c`, `u2c`, `u3c`, `u4c` (from `learn.html` UNITS, verified). `AW.S.get('chest_'+nd.id, false)` in Gen-3 means the on-disk key is `awba_chest_u1c` etc.

## Ground-Truth Gen-3 Contract Extract (behavior the state layer MUST preserve — D-19)

Read verbatim from `_MVP-BUILD/shared/awba-engine.js` lines 39–68 and exercised against a localStorage stub this session.

- **`AW.todayStr()`** → `new Date().toDateString()` (local timezone). *(Gen-4 stores `YYYY-MM-DD` internally; the local-day boundary is identical, only the string format changes — D-16.)*
- **`AW.state()`** returns `{ noor, returns, stars, days, lastDay }` — a snapshot read (Gen-3 read 5 discrete keys; Gen-4 reads the one blob). Gen-4 should also expose `chests` here for the Learn page (D-13).
- **`AW.touchDay()`** — the mercy-streak engine, semantics to preserve **exactly**:
  - `t = todayStr()`. If `lastDay !== t`: `returns = returns + 1`; write `returns`; write `lastDay = t`; if `days` doesn't already contain `t`, push it and write `days.slice(-90)`.
  - Fires on lesson "Begin, gently" and review "Begin the review" — **never on page load** (callers wire this in Phase 4/5).
  - Seeds `returns` at 1 on first-ever visit (because `lastDay` starts null → `!==t` → increments from 0).
  - Verified: with `returns:3, lastDay:yesterday`, first `touchDay()` today → `returns:4`, `days` appended today.
- **`AW.greetMode()`** — `if (!lastDay) return 'first'`; else `diff = Math.round((today - new Date(lastDay)) / 86400000)`; `return diff <= 1 ? 'streak' : 'returning'`. Verified: yesterday → `'streak'`. **Note the Gen-4 subtlety:** `lastDay` will be `YYYY-MM-DD`; `new Date("2026-07-11")` parses as **UTC midnight**, whereas `new Date("Sat Jul 11 2026")` parses as **local midnight**. To keep `greetMode`'s day-diff identical to Gen-3, construct the comparison date from local parts (`new Date(y, m-1, d)`) rather than `new Date(ymdString)`. Flag this in the plan — it's a silent behavior-shift trap.
- **`AW.weekCal()`** — builds Mon–Su calendar from `days`; `dow = (getDay()+6)%7` (Mon=0); a day is "on" if `days.indexOf(d.toDateString()) >= 0`. Gen-4 must compare using whatever format `days` holds internally (`YYYY-MM-DD`) — keep the membership test and the internal format consistent.
- **`stars` best-of** (from `done()`/`result()`): `if (now > prev) stars[id] = now` — never downgrades; shared namespace across lessons and reviews.
- **Chest side-effect** (from `learn.html`): first tap on an available chest sets `awba_chest_<id>=true` and adds `+25` noor, idempotent (Gen-3 v1.1 fix). Gen-4 stores this in `chests{}`; the +25 side-effect is Phase-5 Learn-page wiring, but the **storage shape** (`chests[id]=true`) is frozen here.
- **`deriveNodeState(flat, progress)`** (promote `learn.html`'s `nodeState` into the pure state layer, D-18): for a **chest** node → `available` if the immediately-preceding node has `stars` AND `chests[id]` is falsy, `done` if opened, else `locked`; for a **lesson/review** node → `done` if `stars[id]`, else `active` if every prior non-chest node has stars, else `locked` (strictly linear across all 4 units). Ships with fixture tests now; real-map unlock order verified Phase 5 (CNT-03).

## Common Pitfalls

### Pitfall 1: `toISOString()` produces the wrong local date (off-by-one) — VERIFIED
**What goes wrong:** Converting a legacy `toDateString()` value to `YYYY-MM-DD` via `new Date(v).toISOString().slice(0,10)` shifts the date by a day in any nonzero UTC offset.
**Measured this session (BST, UTC+1):** `new Date("Sat Jul 11 2026")` → local `2026-07-11`, but `toISOString().slice(0,10)` → `2026-07-10`. A late-night local time can shift the *other* way.
**Why it happens:** `toISOString()` serializes in UTC; local midnight is a different calendar day in UTC.
**How to avoid:** `const pad = n => String(n).padStart(2,'0'); const toLocalYMD = d => d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());`
**Warning signs:** Migration test passes at UTC but a reviewer in a different timezone sees `days`/`lastDay` off by one, silently changing the mercy-streak — exactly the behavior D-16 forbids changing.

### Pitfall 2: `JSON.stringify(cfg)` hides embedded `data-ref`/`data-term` IDs — VERIFIED
**What goes wrong:** The validator's ID-resolution check finds zero IDs and passes everything (false negative).
**Why it happens:** `JSON.stringify` escapes the quotes → `data-ref=\"id\"`; a `/data-ref="([^"]+)"/` regex never matches.
**How to avoid:** Walk the cfg object collecting **raw** string values, regex over those (Pattern 3). Confirmed: raw-walk found `[hujurat-49-15, muslim-8, anam-6-149]`; stringify-walk found `[]`.
**Warning signs:** Validator reports "0 citations checked" on files you know contain citations.

### Pitfall 3: `const AW` is not a vm context property — VERIFIED
**What goes wrong:** Migration test throws `AW is not defined` (or reads `undefined`) when it runs the engine in one `vm` call and tries `ctx.AW.S` in another.
**Why it happens:** Top-level `const`/`let`/`class` create lexical bindings that are NOT properties of the context object; only `var` and function declarations attach. Verified: after `runInContext(engine, ctx)`, `ctx.AW === undefined` but `ctx.AwbaLesson` is a function.
**How to avoid:** Run engine + probe as one concatenated script (Pattern 4), OR have the Gen-4 STATE section explicitly `globalThis.AW = AW` for test ergonomics.
**Warning signs:** `TypeError: Cannot read properties of undefined (reading 'S')` in the migration harness.

### Pitfall 4: `grep -c` exits 1 on zero matches — breaks "must be absent" gates
**What goes wrong:** A verify step like `grep -c 'type="module"' …` returns `0` but exit code `1`, failing the whole verification even though absence is the *desired* result.
**Why it happens:** `grep` exits non-zero when it finds nothing; `-c` still prints `0`. (Confirmed this session; also noted in CONTEXT.md code_context.)
**How to avoid:** Use `! grep -q PATTERN FILE` for "must NOT contain" assertions (exits 0 when absent). Reserve `grep -c` for "count and inspect", not pass/fail.
**Warning signs:** A grep gate fails with no diff and the printed count is `0`.

### Pitfall 5: Private-mode / quota localStorage throws
**What goes wrong:** Safari private mode historically throws on `setItem`; a full quota throws `QuotaExceededError`. Unguarded, this blanks the page.
**Why it happens:** localStorage is not guaranteed writable.
**How to avoid:** Wrap every `getItem`/`setItem`/`JSON.parse` in try/catch returning the default (Gen-3 already does this in `AW.S`). The in-memory blob keeps the session working even if persistence fails.
**Warning signs:** Console `QuotaExceededError` / `SecurityError`; state resets each navigation.

### Pitfall 6: Corrupted legacy value poisons the migration
**What goes wrong:** A malformed `awba_days` entry or a non-JSON `awba_stars` yields `Invalid Date`/`NaN` written into the v1 blob.
**Why it happens:** `new Date("garbage")` → `isNaN(getTime())` true (verified); `JSON.parse` on corrupt data throws.
**How to avoid:** In `migrateFromLegacy`, guard each field independently (try/catch per read), `.filter()` out unparseable dates (`d => !isNaN(d.getTime())`), and fall back to the default for that field only — a partial legacy set must still migrate what's valid.
**Warning signs:** `"NaN-NaN-NaN"` or `"Invalid Date"` strings in `awba_state.days`.

## Code Examples

### Contract-check table the validator implements (D-27), grounded in a survey of all 19 real files

Beat-type inventory across the 15 lessons (verified counts): `read` (17), `mc` (16), `depth` (14), `tf` (12), `panel` (12), `verse` (11), `reflect` (10), `tile` (4), `frame` (2). Panel variants used: `check`(7), `guard`(3), `pull`(1), `tell`(1) — all four in the contract. Marker types used: `remember`(13), `angle`(8), `fact`(4); `fard` is **contract-valid but unused** in shipped content — the validator MUST still allow it.

| Beat `t` | Required fields | Optional fields | Extra checks |
|----------|-----------------|-----------------|--------------|
| `read` | `html` | `kicker`, `title`, `ill`, `marker` | `marker.type ∈ {fact,remember,fard,angle}` |
| `frame` | `lead` | `kicker` | — |
| `verse` | `label`, `ar`, `tr` | `kicker`, `after` | — |
| `panel` | `title`, `items[]` (each: `name`, `body`) | `intro`, `ill`, `marker`, `variant`, item `n`/`tag`/`tell` | `variant ∈ {pull,tell,guard,check}` |
| `depth` | `point`, `lenses` | — | `lenses` keys **exactly** `{reality,revelation,ruling}` |
| `reflect` | `prompt`, `model` | — | — |
| `mc` | `q`, `o[]` (array), `c` (int), `good`, `gentle` | `quote` | `0 ≤ c < o.length` |
| `tf` | `q`, `c` (boolean), `good`, `gentle` | — | `typeof c === 'boolean'` |
| `tile` | `prompt`, `bank[]`, `solution[]` | — | every `solution` word ∈ `bank`; `solution` non-empty |

Top-level **lesson** required: `id`, `unitColor`, `journey`, `opener{h2}`, `terms{}`, `refs{}`, `beats[]`, `recap[]`. Optional (engine-guarded, but present in all 15 real files): `grew`, `doneTitle`, `doneLine`, `next{href,label}`, `icon` (icon **never used** in any file → always defaults by unit prefix). `opener` optional: `p`, `thought`, `thoughtLabel`.
`refs[id]` required: `ref`, `ar`, `mean`, `src`. Optional: `kind`, `grade` (both present on the 5 hadith refs). `terms[id]` required: `ar`, `tl`, `word`, `def`, `ctx` (all five).
Top-level **review** required: `id`, `title`, `sub`, `mastery`, `items[]`, `next{href,label}`. Each item: MC `{q, o[], c(int in range), t}` or TF `{tf:true, q, c(bool), t}` — `t` is the **explanation** (naming collision with lesson beat `t`; a review item has no beat `t`). Optional item field: `quote`. Reviews never call `AW.cite` (verified 0 occurrences) — but the sandbox still stubs it harmlessly.

**Discrepancy check (D-29 / specifics):** none found. The contract in ENGINE-CONTRACT.md §1 matches what Josh's files actually do. The only clarifications worth recording: `icon` and verse `after` are contract-optional and **never exercised** by real content; panel item `n` is optional and never used (engine falls back to `i+1`); `fard` marker is valid-but-unused. The validator should permit all of these (they are in the frozen contract) while treating the required set above as hard errors.

### End-to-end validator flow (verified components)
```
node scripts/validate-content.js [file...]      # default: lessons/*.html reviews/*.html
  for each file:
    { cfg, kind } = ingest(file)                 # Pattern 2  (vm sandbox)
    errors  = checkTopLevel(cfg, kind) + checkBeats(cfg) + checkIdResolution(cfg)  # Pattern 3 + table
    warnings = unusedRefs + unusedTerms
    print calm per-file report (file → issue → fix), amber tone, never red
  exit(errors.length ? 1 : 0)
```
Self-test (D-28): `node scripts/validate-content.js scripts/fixtures/valid-lesson.html scripts/fixtures/valid-review.html` exits 0; `node scripts/validate-content.js scripts/fixtures/broken-lesson.html` exits 1 and names the unknown beat type, the dangling ref ID, and the out-of-range `mc.c`.

### FND-07 enforcement — grep-able acceptance criteria (D-24)
```bash
# No ES modules / defer / async anywhere in shipped HTML+JS (must be ABSENT → use ! grep -q):
! grep -rqE 'type="module"' index.html learn.html lessons reviews shared/*.js 2>/dev/null
! grep -rqE '<script[^>]*src=[^>]*awba-engine\.js[^>]*(defer|async)' lessons reviews *.html
# localStorage touched ONLY by the engine (data/shell files must be clean):
! grep -rql localStorage lessons reviews index.html learn.html
# and within shared/, only awba-engine.js may contain it:
test "$(grep -rl localStorage shared/ | grep -v awba-engine.js | wc -l)" -eq 0
# AW namespace present and parse-time (engine defines AW before any Awba* call):
grep -q 'AW' shared/awba-engine.js
```
Reviewer smoke check (SC3, D-30): double-click a fixture/dev page from Finder (`file://`) — it must run with no console error, proving classic-script + parse-time `AW`.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Test framework via npm (jest/mocha) | `node --test` + `node:test` (core) | Stable since Node 20 (2023) | Zero-dep test suites; verified present on Node 24.13.0 here. |
| jsdom to fake `localStorage` in Node | Tiny Map-backed stub | n/a (always viable) | Removes ~40MB of deps for a 5-method surface. |
| `moment`/`date-fns` for date formatting | Local `getFullYear/getMonth/getDate` | n/a | No dep; and it's the *correct* way to avoid the `toISOString` off-by-one. |

**Deprecated/outdated:** nothing new to flag — the constraints (classic scripts, `file://` review, zero build) are stable platform facts (ES modules still fail over `file://` in Chrome/Firefox per CVE-2019-11730 mitigation; confirmed in STACK.md/ARCHITECTURE.md).

## Validation Architecture

> nyquist_validation is enabled (`.planning/config.json workflow.nyquist_validation: true`).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | `node:test` (Node core, v24.13.0) + `node:assert` — zero npm deps |
| Config file | none (no config needed for `node --test`) |
| Quick run command | `node scripts/validate-content.js scripts/fixtures/*.html` (validator self-test, sub-second) |
| Full suite command | `node --test scripts/` (migration losslessness + validator self-test) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ENG-07 | Broken fixture flagged with specific errors; valid fixtures pass | self-test (exit code) | `node scripts/validate-content.js scripts/fixtures/broken-lesson.html; test $? -eq 1` and `… valid-lesson.html valid-review.html; test $? -eq 0` | ❌ Wave 0 |
| ENG-07 | Unknown beat / dangling ref / OOR index each detected | unit | `node --test scripts/validate.test.js` (asserts error messages) | ❌ Wave 0 |
| FND-05 | Legacy `awba_*` keys migrate losslessly into `awba_state` (every value preserved) | unit (headless vm + LS stub) | `node --test scripts/state.test.js` | ❌ Wave 0 |
| FND-05 | Migration is idempotent + non-destructive (legacy keys still present; re-run no-op) | unit | `node --test scripts/state.test.js` | ❌ Wave 0 |
| FND-05 | `touchDay`/`greetMode`/`weekCal`/`deriveNodeState` match Gen-3 semantics on fixtures | unit | `node --test scripts/state.test.js` | ❌ Wave 0 |
| FND-06 | `awba_prefs` persists independently of `awba_state` (mutating one doesn't touch the other) | unit | `node --test scripts/state.test.js` | ❌ Wave 0 |
| FND-07 | No ES modules/defer/async; localStorage only in engine | grep gate | see §FND-07 Enforcement (`! grep -q …`) | ❌ Wave 0 (gate lives in plan verify) |
| FND-07 | A page runs double-clicked over `file://` (parse-time `AW`) | manual smoke | Reviewer opens a fixture/dev page from Finder; console clean | manual (recorded in SUMMARY per D-30) |

### Sampling Rate
- **Per task commit:** `node scripts/validate-content.js scripts/fixtures/*.html` (self-test) + the relevant `node --test` file.
- **Per wave merge:** `node --test scripts/` (full suite) + the FND-07 grep gates.
- **Phase gate:** full suite green + validator self-test green + the seeded-browser migration recipe reproduced by a human (D-30).

### Wave 0 Gaps
- [ ] `scripts/validate-content.js` — the validator itself (covers ENG-07)
- [ ] `scripts/fixtures/valid-lesson.html`, `valid-review.html`, `broken-lesson.html` — neutral placeholder copy (D-28)
- [ ] `scripts/state.test.js` — migration losslessness/idempotency, prefs independence, helper semantics (FND-05/06)
- [ ] `scripts/validate.test.js` — validator self-test asserting specific error messages (ENG-07)
- [ ] Shared LS-stub helper (Map-backed) for the tests
- Framework install: **none** — `node --test` is core (verified). No `package.json` needed.

## Security Domain

> `security_enforcement` is absent from config (treated as enabled). Scoped honestly for a device-local, no-backend, no-auth, no-network static app.

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No accounts/auth in v1 (out of scope, PROJECT.md). |
| V3 Session Management | no | No sessions; single-user device-local. |
| V4 Access Control | no | No server, no multi-user boundary. |
| V5 Input Validation | partial | The **content validator IS the input-validation control** for author-supplied cfg data (ENG-07). No end-user-supplied data is persisted (reflect textarea is never stored — ARCHITECTURE.md). |
| V6 Cryptography | no | Nothing secret stored; localStorage is plaintext device-local by design. |

### Known Threat Patterns for {zero-build vanilla JS + node:vm dev tooling}
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| `node:vm` is **not a security sandbox** — a malicious data file could reach out of the context | Elevation | Acceptable here: the validator only ever runs **Josh's own** repo files at author-time, never third-party or user-uploaded input. Do not market the vm as a security boundary. If that assumption ever changes, move to a separate process / `vm` is insufficient. |
| Unescaped string-concat `innerHTML` (XSS) in the engine runners | Tampering | Real, but a **Phase 4 runner** concern, not Phase 2 (STATE section builds no DOM except the guarded `<html>` attribute stamp, whose values are booleans/enums from prefs — not user text). Flag forward; do not solve here. |
| Corrupted/hostile localStorage blob crashing the app | Denial of Service (self-inflicted) | try/catch around every parse/read (Pitfall 5/6); malformed blob falls back to default v1, never throws. |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | validator + `node --test` suites | ✓ | v24.13.0 | — |
| `node:vm` | validator cfg ingestion, migration test | ✓ | core | — |
| `node:test` | test suites | ✓ | core | (could fall back to a hand-rolled `node:assert` runner if ever on Node <18, but N/A here) |
| `node:assert` | assertions | ✓ | core | — |
| Python 3 | existing glyph gate (not this phase) | ✓ | 3.9.6 | — |
| Browser over `file://` | SC3 reviewer smoke check | ✓ (any modern browser) | — | — |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none — everything required is present.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The Gen-4 `awba_state` v1 shape and the migration mapping are exactly per D-13/ARCHITECTURE.md; no additional legacy keys exist beyond the six documented. | Runtime State Inventory | If Josh's live browser has an undocumented `awba_*` key, it would be dropped. Mitigation: migration can also copy any unrecognized `awba_*` scalar into a `state._legacy` bag, or the reviewer diffs all `awba_*` keys (D-15 makes this possible). Low risk — grep of Gen-3 code shows only these six. |
| A2 | `tile.solution` "exact-length" in D-27 means "every solution word exists in bank; solution is the exact winning sequence" (bank contains extra distractors). Verified real tiles have `solution.length < bank.length`. | Contract-check table | If D-27 intended `solution.length === bank.length`, the check would wrongly fail every real tile. The evidence (3 real tiles, all with distractors) says subset-not-equal is correct. Planner should confirm the intended reading. |
| A3 | The reviewer's browser-side migration recipe (D-30) will be authored in the SUMMARY as a seeded-console snippet; exact wording is Claude's discretion. | Validation Architecture | Low — mechanics proven headlessly; the browser recipe is a transcription of the same seed. |

**If empty:** not empty — three low-risk assumptions above, none blocking.

## Open Questions (RESOLVED — all three settled during planning, 2026-07-12)

1. **`deriveNodeState` fixture scope for Phase 2.** — RESOLVED: 02-01 Task 1 follows the recommendation exactly (3–4 hand-built flat-array fixtures in state-helpers.test.js; real map deferred to Phase 5).
   - What we know: D-18 ships it as a pure function with fixture tests now; real-map unlock order is verified Phase 5 (CNT-03).
   - What's unclear: how many synthetic fixtures to include now (e.g., all-locked, mid-progress, chest-available, all-done).
   - Recommendation: 3–4 hand-built flat-array fixtures covering locked/active/done + chest-available-vs-locked; do NOT import the real 24-node map (that's Phase 5). Enough to prove the branching logic.

2. **Migration test harness form: `.test.js` vs HTML dev page.** — RESOLVED: 02-01 uses headless node:test as primary proof + seeded-console recipe in the SUMMARY (per recommendation; no dev page shipped).
   - What we know: D-30 leaves this to Claude's discretion; both are proven viable.
   - What's unclear: whether the human gate benefits from a visual dev page.
   - Recommendation: primary proof = `scripts/state.test.js` (headless, CI-style, fast); ALSO record a copy-paste seeded-console recipe in the SUMMARY so a reviewer can reproduce losslessness in their own browser (satisfies the "reproducible by a reviewer" half of D-30 without shipping navigation). An HTML dev page is optional polish, not required.

3. **Should the Gen-4 STATE section expose `AW` on `globalThis`/`window` for test ergonomics?** — RESOLVED: 02-01 Task 2 appends `globalThis.AW = AW` at the end of the STATE section (cited "per RESEARCH Open Question 3") while tests still use the concatenated-run pattern.
   - What we know: `const AW` works in-browser (shared script lexical scope) but is not a vm context property (Pitfall 3).
   - What's unclear: pure taste — concat-probe testing works without any engine change.
   - Recommendation: keep `const AW`/`window.AW` per existing Gen-3 style; use concatenation in tests. If the executor finds concat awkward, appending `globalThis.AW = AW;` at the end of the STATE section is a harmless one-liner that simplifies tests — either is fine.

## Sources

### Primary (HIGH confidence — read AND executed this session)
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/shared/awba-engine.js` (465 lines) — exact `AW.S`, `state`, `touchDay`, `greetMode`, `weekCal`, `cite`, runner semantics. Ran the real file headlessly against a localStorage stub to verify `touchDay`/`greetMode`/`state`.
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/lessons/u1-m1.html` — ingested via `node:vm` this session (captured id/beats/refs/terms; verified ID resolution).
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/reviews/u1-review.html` — review cfg shape (id/title/sub/mastery/items/next; item `t`=explanation).
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/learn.html` — `awba_chest_<id>` key usage, chest ids (u1c–u4c), `nodeState` derivation, UNITS flat order.
- Grep survey of all 15 lessons + 4 reviews — beat-type inventory, panel variants, marker types, optional-field frequencies, `AW.*` usage (only `AW.cite`), identical `<script src>` boilerplate, exactly-one-inline-script-per-file.
- Executed POCs (scratchpad, this session): vm validator ingestion + raw-string ID extraction; headless migration against the real engine (const-AW gotcha confirmed); `toLocalYMD` vs `toISOString` off-by-one measurement; corrupted-date `isNaN` guard; `grep -c` exit-code behavior.
- `.planning/research/ENGINE-CONTRACT.md`, `ARCHITECTURE.md`, `STACK.md`, `PITFALLS.md` — cross-referenced; no contract discrepancies found.
- `.planning/phases/02-.../02-CONTEXT.md` — locked decisions D-13..D-30.
- Environment: `node v24.13.0` with `node:vm`/`node:test`/`node:assert`; `python3 3.9.6` — verified via direct invocation.

### Secondary (MEDIUM confidence)
- ARCHITECTURE.md build-order + anti-patterns; STACK.md "What NOT to Use" (localStorage-vs-IndexedDB, no ES modules over `file://`) — corroborated by MDN/whatwg citations already vetted in those docs.

### Tertiary (LOW confidence)
- None material to this phase. All load-bearing claims were verified by execution.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — zero external deps; every core module verified present and exercised.
- Architecture (state layer + migration + prefs): HIGH — migration pattern run against the real Gen-3 engine; local-date and const-AW hazards measured, not assumed.
- Validator (vm ingestion + contract checks): HIGH — full pipeline run against a real lesson; contract table grounded in a survey of all 19 files.
- Pitfalls: HIGH — all six either measured this session or drawn from primary-source code.

**Research date:** 2026-07-12
**Valid until:** ~2026-08-11 (stable — vanilla platform facts, no fast-moving deps; the only churn risk is Josh editing his data files, which would only add cases the validator already covers by type).
