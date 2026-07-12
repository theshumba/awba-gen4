# Phase 2: State Layer & Engine-Contract Freeze - Pattern Map

**Mapped:** 2026-07-12
**Files analyzed:** 8
**Analogs found:** 5 exact/role-match (in-repo or EXTERNAL) / 8 total — 3 have no analog (net-new test infra), pointed at verified RESEARCH.md POCs instead

**Repo note:** `awba-gen4` is near-greenfield. The only in-repo assets that predate this phase are `preview.html` (Phase 1 dev-harness page), `shared/awba-engine.css` (Phase 1 stylesheet), and `scripts/check-glyph-coverage.py` (Phase 1 dev gate). There is no existing `shared/awba-engine.js`, no `scripts/fixtures/`, and no test infrastructure — this phase creates all of them. Where the repo has nothing to copy from, the analog is the **external Gen-3 reference implementation** at `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/` (clearly marked EXTERNAL below), which CONTEXT.md/RESEARCH.md establish as the behavior ground truth (D-19).

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|--------------------|------|-----------|-----------------|----------------|
| `shared/awba-engine.js` (STATE section only) | store / service | CRUD (`AW.S.get/set`) + batch/transform (migration) | EXTERNAL: `_MVP-BUILD/shared/awba-engine.js` (`AW.S`/`touchDay`/`greetMode`/`weekCal`/`cite`) — semantics source; in-repo `shared/awba-engine.css` — banner-comment/section-discipline source | exact (semantics, EXTERNAL) / role-match (comment style, in-repo) |
| `scripts/validate-content.js` | utility (dev gate, CLI) | batch / transform (ingest → validate → report) | `scripts/check-glyph-coverage.py` (in-repo) | role-match — same directory, same "gate exits non-zero" convention (D-25) |
| `scripts/fixtures/valid-lesson.html` | test fixture / config | file-I/O | EXTERNAL: `_MVP-BUILD/lessons/u1-m1.html` | exact — must reproduce the identical data-file shape |
| `scripts/fixtures/valid-review.html` | test fixture / config | file-I/O | EXTERNAL: `_MVP-BUILD/reviews/u1-review.html` | exact |
| `scripts/fixtures/broken-lesson.html` | test fixture / config | file-I/O | EXTERNAL: `_MVP-BUILD/lessons/u1-m1.html` (deliberately deviated) | role-match |
| `scripts/state.test.js` | test | batch (assertions) / event-driven (headless vm probe) | none in-repo — no analog | no analog (see RESEARCH.md Pattern 4, verified POC) |
| `scripts/validate.test.js` | test | batch (assertions) | none in-repo — no analog | no analog (see RESEARCH.md Patterns 2-3, verified POC) |
| `scripts/test-helpers/ls-stub.js` *(optional, Claude's discretion whether inlined or extracted)* | utility (test helper) | transform | none in-repo — no analog | no analog (see RESEARCH.md Pattern 4 `makeLS`, verified POC) |

## Pattern Assignments

### `shared/awba-engine.js` (STATE section) — store, CRUD + migration

This is a **net-new** file. Two analogs combine: the EXTERNAL Gen-3 engine supplies the exact runtime *semantics* to preserve (D-19); the in-repo `shared/awba-engine.css` supplies the *file-organization convention* (banner comments, section discipline, "nothing invented here" tone) this codebase expects of a single shared engine file.

**Section-banner / file-organization pattern** — analog: `shared/awba-engine.css` (lines 1-16, in-repo):
```css
/* ============================================================================================
   awba-engine.css  ·  Awba Gen-4 — the one engine stylesheet
   --------------------------------------------------------------------------------------------
   The design constitution every page and every later phase consumes. Vanilla, zero-build,
   CDN-free. Authored against 01-UI-SPEC.md (approved) — every value below is sourced there;
   nothing is invented at this layer (FND-01).

   Cascade order is declared ONCE, in full, on the next line and is immutable for the life of
   the project. ...
   ============================================================================================ */
@layer tokens, base, components, screens, motion;

@layer tokens {
  ...
}
```
Apply this same weight of banner comment to `shared/awba-engine.js`: one top banner explaining the file's whole-project role, then per-section banners (`STATE`, then placeholder `KIT`/`COMPONENTS`/`RUNNERS` per D-22) — each explaining *why*, not just *what*, and each citing the requirement ID it satisfies (FND-05/06/07) the way the CSS file cites FND-01.

**`window.AW` synchronous parse-time definition** — analog: EXTERNAL `_MVP-BUILD/shared/awba-engine.js` line 8:
```js
const AW = {};
```
No `defer`/`async`, no DOMContentLoaded wrapper — `AW` must exist the instant the script tag executes because data files reference it inline (D-23). Gen-4's STATE section should open the same way (`const AW = {};` — or `window.AW = window.AW || {}` if guarding against re-declaration matters more than matching Gen-3 verbatim; either satisfies D-23).

**Versioned storage wrapper — `AW.S`** — analog: EXTERNAL `_MVP-BUILD/shared/awba-engine.js` lines 38-42 (the exact shape D-17's `get(key,default)`/`set(key,value)` call contract is frozen from):
```js
/* ---------- storage ---------- */
AW.S={
 get(k,d){try{const v=localStorage.getItem('awba_'+k);return v===null?d:JSON.parse(v);}catch(e){return d;}},
 set(k,v){try{localStorage.setItem('awba_'+k,JSON.stringify(v));}catch(e){}}
};
```
Gen-4 keeps this exact **try/catch-swallow-to-default** tolerance (Pitfall 5) but changes the storage target from six discrete `awba_<key>` entries to one `awba_state` blob with an in-memory cache (`mem`) resolved via the 4-step chain (D-14) — see RESEARCH.md Pattern 1 for the full skeleton (already verified against this exact source this session). The **external call shape stays identical**: `AW.S.get(k,d)` / `AW.S.set(k,v)`.

**`state()` / `touchDay()` / `greetMode()` / `weekCal()` — semantics to preserve exactly (D-19)** — analog: EXTERNAL `_MVP-BUILD/shared/awba-engine.js` lines 43-68:
```js
AW.todayStr=function(){return new Date().toDateString();};
AW.state=function(){
 return { noor:AW.S.get('noor',0), returns:AW.S.get('returns',0),
   stars:AW.S.get('stars',{}), days:AW.S.get('days',[]), lastDay:AW.S.get('lastDay',null) };
};
/* returns++ only on first activity of a new day; seeds at 1 on first ever visit */
AW.touchDay=function(){
 const t=AW.todayStr(); let last=AW.S.get('lastDay',null); let ret=AW.S.get('returns',0);
 if(last!==t){ ret=ret+1; AW.S.set('returns',ret); AW.S.set('lastDay',t);
   const days=AW.S.get('days',[]); if(days.indexOf(t)<0){days.push(t); AW.S.set('days',days.slice(-90));} }
 return ret;
};
AW.greetMode=function(){
 const last=AW.S.get('lastDay',null); if(!last) return 'first';
 const t=new Date(); const l=new Date(last); const diff=Math.round((t-l)/86400000);
 return diff<=1 ? 'streak' : 'returning';
};
AW.weekCal=function(){
 const days=AW.S.get('days',[]); const names=['Mo','Tu','We','Th','Fr','Sa','Su'];
 const now=new Date(); const dow=(now.getDay()+6)%7; // Mon=0
 let html='';
 for(let i=0;i<7;i++){ const d=new Date(now); d.setDate(now.getDate()-dow+i);
   const on=days.indexOf(d.toDateString())>=0;
   html+= ... ; }
 return '<div class="weekcal">'+html+'</div>';
};
```
Gen-4's `AW.state()` adds `chests` to the snapshot (D-13) and drops the HTML-string return from `weekCal()` if Phase 2 keeps it DOM-free — check D-18 ("pure, DOM-free functions"); if `weekCal()` currently emits markup, either keep it string-returning (harmless, no DOM write) or defer the HTML-building half to Phase 3/5 and have Phase 2 return structured day data. `touchDay()`'s day-dedup-then-append-then-cap-90 logic and `greetMode()`'s `diff<=1` threshold must be bit-for-bit preserved — RESEARCH.md's "Ground-Truth Gen-3 Contract Extract" section documents the one required change (comparing `YYYY-MM-DD` via local-parts `new Date(y,m-1,d)`, never `new Date(ymdString)`, to avoid the UTC-midnight parse trap).

**`AW.cite` — id-return contract the validator sandbox also stubs** — analog: EXTERNAL line 71:
```js
AW.cite=function(id,label){return '<span class="cite" data-ref="'+id+'">'+AW.CITE+label+'</span>';};
```
Not owned by Phase 2 (KIT section, Phase 4), but the validator's sandbox stub (below) must return markup shaped identically to this real function so captured cfg strings match what Josh's files actually produce.

**`deriveNodeState` — the pure function to promote from `learn.html` (D-18)** — analog: EXTERNAL `_MVP-BUILD/learn.html` lines 179-187 (chest + linear-unlock logic) and lines 231-238 (chest-tap storage side effect, storage shape only — the `+25` noor grant itself is Phase-5 wiring):
```js
function nodeState(flatIdx,flat,stars){
 const nd=flat[flatIdx];
 if(nd.chest){ // chest opens when the unit's review is done
   const prev=flat[flatIdx-1]; return stars[prev.id]?(AW.S.get('chest_'+nd.id,false)?'done':'available'):'locked'; }
 if(stars[nd.id])return 'done';
 // available if all previous non-chest nodes are done
 for(let i=0;i<flatIdx;i++){ if(flat[i].chest)continue; if(!stars[flat[i].id])return 'locked'; }
 return 'active';
}
```
```js
// chest tap (learn.html lines 231-238) — the STORAGE SHAPE this freezes, not the click handler:
const key='chest_'+nd.id;
const fresh=!AW.S.get(key,false);
if(fresh){AW.S.set(key,true);AW.S.set('noor',AW.S.get('noor',0)+25);}
```
Gen-4's `AW.deriveNodeState(nodesFlat, progress)` is this exact branching logic rewritten as a pure function against `progress.stars`/`progress.chests` (no `AW.S.get` call inside — D-18 says DOM-free/pure, and by extension storage-free; the caller passes `progress` in). Chest ids are exactly `u1c, u2c, u3c, u4c` (RESEARCH.md, verified against `learn.html` UNITS). Ship with 3-4 hand-built flat-array fixtures (locked / active / done / chest-available-vs-locked) per RESEARCH.md Open Question 1 — do NOT import the real 24-node course map (Phase 5, CNT-03).

**Preferences store + boot stamp (D-20/D-21)** — no direct Gen-3 analog exists (prefs are new in Gen-4); use the same `AW.S` wrapper shape with its own key, and RESEARCH.md's Pattern 5 skeleton (verified-consistent with the `AW.S` pattern above, not independently re-derived):
```js
if (AW.prefs.get('motion','system') === 'reduce') document.documentElement.setAttribute('data-motion','reduce');
if (AW.prefs.get('soundMuted', false))            document.documentElement.setAttribute('data-sound','muted');
```
Guard with `if (typeof document !== 'undefined') { … }` so the headless migration test (no `document` global) doesn't execute the stamp (RESEARCH.md Pattern 5 note).

**Grep-gate enforcement this file's shape must satisfy (D-24)** — analog: RESEARCH.md "FND-07 enforcement" acceptance criteria (verified this session), reusable directly as plan verify steps:
```bash
! grep -rqE 'type="module"' index.html learn.html lessons reviews shared/*.js 2>/dev/null
! grep -rql localStorage lessons reviews index.html learn.html
test "$(grep -rl localStorage shared/ | grep -v awba-engine.js | wc -l)" -eq 0
grep -q 'AW' shared/awba-engine.js
```

---

### `scripts/validate-content.js` (utility, batch/transform dev gate)

**Analog:** `scripts/check-glyph-coverage.py` (in-repo, Phase 1 precedent — same directory, same convention; cross-language but the convention being copied is the gate shape, not the syntax)

**Gate structure + exit-code convention** (full file, 39 lines, `scripts/check-glyph-coverage.py`):
```python
# Source: derived from the verified codepoint inventory in
# .planning/phases/01-foundation-design-tokens-responsive-shell-fonts/01-RESEARCH.md
# (Font Subset Pipeline / Code Examples section) — used verbatim per 01-PATTERNS.md,
# with one corrected entry (see note below).
#
# scripts/check-glyph-coverage.py — run after every font-subsetting pass.
from fontTools.ttLib import TTFont
import sys
#
# NOTE (Plan 01-01 Task 2 deviation, Rule 1 - bug fix): ...
REQUIRED = {
    'shared/fonts/inter-400.woff2':        [0x02F9, 0x02FA, ...],
    ...
}

failed = False
for path, codepoints in REQUIRED.items():
    font = TTFont(path)
    cmap = font.getBestCmap()
    for cp in codepoints:
        if cp not in cmap:
            print(f"MISSING U+{cp:04X} in {path}")
            failed = True
sys.exit(1 if failed else 0)
```
The pattern to copy: **top-of-file "Source:"/derivation comment**, a flat data table the checks iterate, a `failed` boolean accumulator, one `print` per violation naming exactly what's wrong and where, and `sys.exit(1 if failed else 0)` at the very end — no partial-credit exit codes, no ANSI red walls (mercy laws, D-30 specifics). `validate-content.js` should open with the same kind of derivation comment citing `.planning/research/ENGINE-CONTRACT.md §1` as its rule source (D-29), iterate a per-file loop, accumulate `errors`/`warnings` arrays, print a calm per-file report, and `process.exit(errors.length ? 1 : 0)`.

**`node:vm` cfg-ingestion pattern (D-26)** — no in-repo analog (net-new Node tooling); this session's verified POC, recorded in RESEARCH.md Pattern 2, IS the reference implementation to copy (already executed against `_MVP-BUILD/lessons/u1-m1.html`, confirmed working):
```js
const fs = require('node:fs'), vm = require('node:vm');
function ingest(file) {
  const src = fs.readFileSync(file, 'utf8');
  const m = src.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/i);
  if (!m) throw new Error('no inline <script> in ' + file);
  let cfg = null, kind = null;
  const sandbox = {
    AW: { cite: (id, label) => '<span class="cite" data-ref="' + id + '">' + (label || '') + '</span>' },
    AwbaLesson: (c) => { cfg = c; kind = 'lesson'; },
    AwbaReview: (c) => { cfg = c; kind = 'review'; },
  };
  vm.createContext(sandbox);
  vm.runInContext(m[1], sandbox, { filename: file });
  return { cfg, kind };
}
```
Note the sandbox's `AW.cite` stub deliberately matches the shape of the real `AW.cite` (see above) so `data-ref="…"` markers survive into captured strings.

**ID-resolution / raw-string-walk gotcha (D-27, Pitfall 2)** — RESEARCH.md Pattern 3 (verified this session — `JSON.stringify` escapes quotes and silently breaks the regex; raw-walk is required):
```js
function collectStrings(o, acc) {
  if (typeof o === 'string') acc.push(o);
  else if (Array.isArray(o)) o.forEach(x => collectStrings(x, acc));
  else if (o && typeof o === 'object') Object.values(o).forEach(x => collectStrings(x, acc));
  return acc;
}
const blob = collectStrings(cfg, []).join('\n');       // RAW strings, NOT JSON.stringify
const refIds  = [...new Set([...blob.matchAll(/data-ref="([^"]+)"/g)].map(x => x[1]))];
const danglingRefs = refIds.filter(id => !cfg.refs || !cfg.refs[id]);   // ERROR
const unusedRefs   = Object.keys(cfg.refs || {}).filter(id => !refIds.includes(id));   // WARN
```

**Self-test invocation** (D-28, RESEARCH.md "End-to-end validator flow"):
```
node scripts/validate-content.js scripts/fixtures/valid-lesson.html scripts/fixtures/valid-review.html   # exit 0
node scripts/validate-content.js scripts/fixtures/broken-lesson.html                                     # exit 1, names each violation
```

---

### `scripts/fixtures/valid-lesson.html`, `valid-review.html`, `broken-lesson.html` (test fixtures, file-I/O)

**Analog:** EXTERNAL `_MVP-BUILD/lessons/u1-m1.html` (lesson shape) and `_MVP-BUILD/reviews/u1-review.html` (review shape) — the validator must ingest fixtures that are structurally identical to real data files, just with neutral placeholder copy (D-28, never scripture even in fixtures).

**Head + two-script-tag boilerplate to reproduce** (EXTERNAL `u1-m1.html` lines 1-6):
```html
<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Awba · U1·M1 · What sound belief is</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../shared/awba-engine.css"></head><body>
<script src="../shared/awba-engine.js"></script>
<script>
AwbaLesson({
 id:'u1m1', unitColor:'#2E6BF5',
 journey:'Unit 1 · Lesson 1 · Where it all begins',
 opener:{h2:'In the name of God', p:'…', thought:'…'},
 terms:{ aqeedah:{ar:'…',tl:'…',word:'…',def:'…',ctx:'…'} },
 refs:{ 'hujurat-49-15':{ref:'…',ar:'…',mean:'…',src:'…'} },
 beats:[
  {t:'read', kicker:'…', title:'…', html:'<p>…'+AW.cite('hujurat-49-15','al-Ḥujurāt 49:15')+'…</p>', marker:{type:'angle', body:'…'}},
  {t:'mc', q:'…', o:['A','B','C','D'], c:3, good:'…', gentle:'…'}
 ],
 recap:['…'],
 next:{href:'../lessons/u1-m2.html', label:'…'}
});
</script></body></html>
```
`fixtures/valid-lesson.html`'s inline script must call `AW.cite(id, label)` at least once (so the ID-resolution check has something real to verify) and cover several beat types (`read`, `mc`, `panel`, `depth`, `tf`, `tile` — enough to exercise the whole D-27 contract table). `fixtures/broken-lesson.html` starts from the same shape and deliberately introduces ≥3 violations per D-28: an unknown beat `t` (e.g. `t:'bogus'`), a `data-ref`/`AW.cite` id with no matching `cfg.refs[id]` entry (dangling ref), and an out-of-range `mc.c` (e.g. `c:9` against a 4-item `o[]`).

**Review shape to reproduce** (EXTERNAL `u1-review.html` lines 1-21, full file):
```html
<!DOCTYPE html><html lang="en"><head>...<link rel="stylesheet" href="../shared/awba-engine.css"></head><body>
<script src="../shared/awba-engine.js"></script>
<script>
AwbaReview({
 id:'u1r', title:'…', sub:'…', mastery:'…',
 items:[
  {q:'…', o:['…','…','…'], c:1, t:'…'},
  {q:'…', tf:true, c:false, t:'…'}
 ],
 next:{href:'../lessons/u2-m1.html', label:'…'}
});
</script></body></html>
```
`t` on a review item is the answer **explanation**, not a beat type — a naming collision with lesson beats' `t` field noted explicitly in RESEARCH.md (D-27); keep this distinction visible in the fixture (both an MC item and a TF item, each with a `t` explanation string).

---

### `scripts/state.test.js`, `scripts/validate.test.js`, (optional) `scripts/test-helpers/ls-stub.js` (test, no analog)

No in-repo test file exists to copy structure from — this is net-new `node:test` infrastructure. RESEARCH.md's Patterns 2-4 are the closest thing to an analog: they are **verified POCs executed this session** against the real `_MVP-BUILD/shared/awba-engine.js`, not hypothetical code, so they carry the same weight as a codebase analog for this phase.

**Headless migration test — engine+probe concatenation gotcha (Pitfall 3, verified)** — RESEARCH.md Pattern 4:
```js
const fs = require('node:fs'), vm = require('node:vm');
function makeLS(seed) { const m = new Map(Object.entries(seed || {}));
  return { getItem: k => m.has(k) ? m.get(k) : null, setItem: (k, v) => m.set(k, String(v)),
    removeItem: k => m.delete(k), key: i => [...m.keys()][i], get length() { return m.size; },
    _dump: () => Object.fromEntries(m) }; }
const ls = makeLS({ 'awba_noor':'120', 'awba_returns':'3', /* ... */ });
const sandbox = { localStorage: ls, Date, Math, JSON, console };
vm.createContext(sandbox);
const engine = fs.readFileSync('shared/awba-engine.js', 'utf8');
const probe  = `;globalThis.__out = { blob: AW.S.get('noor',0), state: AW.state() };`;
vm.runInContext(engine + '\n' + probe, sandbox);  // ONE script → probe sees lexical `AW`
```
Critical gotcha this pattern exists to avoid: `const AW = {}` is a lexical binding, NOT a vm context property — running the engine and the test probe as two separate `vm.runInContext` calls throws `AW is not defined` on the second call. Concatenate into one script (or have the STATE section end with `globalThis.AW = AW;`, per RESEARCH.md Open Question 3 — either is acceptable).

**Test framework:** `node --test` + `node:assert` (Node core, zero deps, per D-25) — `node --test scripts/` runs both suites. No `package.json`, no framework install.

**What each test file must assert** (from RESEARCH.md Validation Architecture, Phase Requirements → Test Map):
- `scripts/state.test.js`: legacy `awba_*` keys migrate losslessly into `awba_state` (every value preserved); migration is idempotent and non-destructive (legacy keys still present after migration, D-15); `touchDay`/`greetMode`/`weekCal`/`deriveNodeState` match Gen-3 semantics on fixtures; `awba_prefs` persists independently of `awba_state`.
- `scripts/validate.test.js`: unknown beat type, dangling ref ID, and out-of-range `mc.c` are each individually detected with specific error messages against `scripts/fixtures/broken-lesson.html`; both valid fixtures pass with zero errors.

## Shared Patterns

### Classic-script / parse-time namespace discipline (D-23, FND-07)
**Source:** EXTERNAL `_MVP-BUILD/shared/awba-engine.js` line 8 (`const AW = {};`, no `defer`/`async`) + in-repo `preview.html` lines 800-802 (classic IIFE pattern)
**Apply to:** `shared/awba-engine.js` itself, and any dev-harness page built as part of this phase (D-30's optional visual harness).
```js
<script>
/* Classic script — no modules, file:// double-click safe. */
(function () {
  var root = document.documentElement;
  ...
})();
</script>
```
No `<script type="module">`, no `defer`, no `async` — ever, on `awba-engine.js`'s own tag or any fixture/harness page's tags.

### Page-relative URLs, never leading-slash (D-23, in-repo established)
**Source:** `preview.html` lines 10-15 and `shared/awba-engine.css` lines 21-24
**Apply to:** every `<link>`/`<script src>` in fixtures and any dev-harness page — `href="../shared/awba-engine.css"` / `src="../shared/awba-engine.js"`, never `/shared/...`.

### Dev-gate "exits non-zero on failure" convention (D-25)
**Source:** `scripts/check-glyph-coverage.py` (full file, in-repo)
**Apply to:** `scripts/validate-content.js` — same directory, same convention: accumulate failures, print what/where, single `exit(1 if failed else 0)` (or `process.exit(...)` in JS) at the very end, no early-exit-on-first-error (report everything findable per file, matching D-25's "human-readable per-file error report").

### `grep -c` vs `! grep -q` for "must be absent" gates (Pitfall 4, D-24)
**Source:** RESEARCH.md Pitfall 4 + "FND-07 enforcement" acceptance criteria (verified this session)
**Apply to:** any plan verify step asserting `localStorage`/`type="module"`/`defer`/`async` do NOT appear outside `shared/awba-engine.js`. Use `! grep -q PATTERN FILE`, never bare `grep -c` for pass/fail (grep exits 1 on zero matches even though absence is the desired outcome).

### Silent-tolerant localStorage access (Pitfall 5, existing Gen-3 style)
**Source:** EXTERNAL `_MVP-BUILD/shared/awba-engine.js` lines 39-42 (`try{...}catch(e){return d;}` / `try{...}catch(e){}`)
**Apply to:** every localStorage read/write inside `AW.S`/`AW.prefs` — wrap in try/catch, fall back to the caller's default, never throw and blank the page (private-mode/quota safety).

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `scripts/state.test.js` | test | batch/event-driven | No test file exists anywhere in the repo yet (Phase 2 is the first to introduce `node --test`). Use RESEARCH.md Pattern 4 (verified POC, executed against the real engine this session) as the reference implementation instead of an in-repo analog. |
| `scripts/validate.test.js` | test | batch | Same — no test infra precedent. Use RESEARCH.md Patterns 2-3 (verified POCs). |
| `scripts/test-helpers/ls-stub.js` (if extracted as its own file rather than inlined per test file) | utility/test-helper | transform | Net-new; no localStorage-stub precedent in-repo. Use RESEARCH.md Pattern 4's `makeLS` function (verified, ~10 lines) verbatim as the starting point. |
| Preferences boot-stamp code (`AW.prefs`, D-20/D-21) inside `shared/awba-engine.js` | store (sub-section) | CRUD | No Gen-3 analog exists — prefs are new in Gen-4 (Gen-3 had no sound-mute/reduced-motion store). Pattern is derived directly from the `AW.S` wrapper shape above plus RESEARCH.md Pattern 5 (an authored skeleton, not an executed POC — lower confidence than the AW.S/touchDay excerpts, but internally consistent with them). |

## Metadata

**Analog search scope:** repo root (`.`, excluding `.git`/`.planning`), specifically `shared/`, `scripts/`, `preview.html`; EXTERNAL reference tree `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/` (`shared/awba-engine.js`, `learn.html`, `lessons/u1-m1.html`, `reviews/u1-review.html`).
**Files scanned:** `preview.html` (855 lines, targeted reads), `shared/awba-engine.css` (307 lines, targeted read), `scripts/check-glyph-coverage.py` (39 lines, full read), EXTERNAL `shared/awba-engine.js` (465 lines, read lines 1-353 covering the full STATE-relevant section), EXTERNAL `learn.html` (targeted reads: `nodeState`, chest-tap handler), EXTERNAL `lessons/u1-m1.html` and `reviews/u1-review.html` (head + shape, targeted reads).
**Pattern extraction date:** 2026-07-12

---

## Addendum (post-planning, 2026-07-12)

**Test-file layout deviation from this document's File Classification table:** the final plans place all tests under `scripts/tests/` (`ls-stub.js`, `state-storage.test.js`, `state-helpers.test.js`, `validate.test.js`) instead of the `scripts/state.test.js` / `scripts/validate.test.js` / `scripts/test-helpers/ls-stub.js` layout proposed above. Rationale: aligns with 02-VALIDATION.md's `node --test scripts/tests/` run-command convention and splits storage vs helper assertions for clearer RED/GREEN feedback. Within CONTEXT.md's granted discretion (internal file organization). Phase 4+ should treat `scripts/tests/` as the canonical test directory.
