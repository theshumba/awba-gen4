# Phase 4: Lesson & Review Engine Port + Detail Layer - Pattern Map

**Mapped:** 2026-07-13
**Files analyzed:** 5 build targets (2 in-place engine/CSS edits · 19 page shells · 3 test files · 1 asset dir)
**Analogs found:** 6 / 7 target classes have a strong in-repo or Gen-3 analog

> **Frame for the planner.** This phase is a **port**, not a greenfield build. Almost every new
> line has a *behaviour* analog (Josh's Gen-3 `awba-engine.js` — the mechanics being preserved
> byte-for-byte) AND an *expression* analog (the shipped in-repo engine/CSS — the Athar primitives
> the port must consume). Each Pattern Assignment below names BOTH: "copy the logic from Gen-3 line X,
> render it through the in-repo primitive at line Y." Never invent a third way.
>
> **Two source trees:**
> - **BEHAVIOUR (what to preserve):** `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/shared/awba-engine.js` (Gen-3, 465 lines) + its 19 data files.
> - **EXPRESSION (what to consume):** `/Users/theshumba/Documents/GitHub/awba-gen4/shared/awba-engine.js` (in-repo, 1359 lines) + `shared/awba-engine.css` (1016 lines) + `preview.html` (the approved reference page).

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `shared/awba-engine.js` → RUNNERS `AwbaLesson(cfg)` | engine/runner | event-driven (beat state-machine → reward choreography) | Gen-3 `AwbaLesson` (behaviour) + in-repo COMPONENTS/RING/SKY (expression) | exact (port) |
| `shared/awba-engine.js` → RUNNERS `AwbaReview(cfg)` | engine/runner | event-driven + 14s timer state-machine | Gen-3 `AwbaReview` (behaviour) + in-repo primitives | exact (port) |
| `shared/awba-engine.js` → `AW.sound(cue)` | utility | file-I/O (audio load, silent no-op) | `AW.prefs` closure + 04-RESEARCH code example | role-match |
| `shared/awba-engine.js` → pure helper exports (`starsFor` etc.) | utility | transform (pure math) | `AW.deriveNodeState` / `skyDawn` pure-helper precedent | role-match |
| `shared/awba-engine.css` → `@layer screens` content | config/style | — | in-repo `@layer components` (`.opt`/`.btn`/`.dab`) + `@layer screens` placeholder (:923) | exact |
| `lessons/u1-m1.html` … `u4-m3.html` (×15) | page shell / view | request-response (page bootstrap) | `preview.html` head/wiring + Gen-3 `lessons/u1-m1.html` cfg | exact (splice) |
| `reviews/u1-review.html` … `u4-review.html` (×4) | page shell / view | request-response | `preview.html` + Gen-3 `reviews/u1-review.html` cfg | exact (splice) |
| `scripts/tests/runner-lesson.test.js` | test (unit) | — | `scripts/tests/components.test.js` + `ls-stub.js` | exact |
| `scripts/tests/runner-review.test.js` | test (unit) | — | `scripts/tests/components.test.js` + `ls-stub.js` | exact |
| `scripts/tests/render-smoke.*` | test (smoke) | — | (no in-repo Chrome harness — see No Analog Found) | no analog |
| `shared/sfx/` | asset dir | — | (none — new empty dir) | no analog |

---

## Pattern Assignments

### `shared/awba-engine.js` → `AwbaLesson(cfg)` (engine/runner, event-driven)

**Behaviour analog:** `_MVP-BUILD/shared/awba-engine.js` lines 115–333 (the whole Gen-3 lesson runner).
**Expression analog:** in-repo `shared/awba-engine.js` COMPONENTS/RING/SKY (`AW.wire/animate/ringSVG` etc.) + `@layer screens` CSS.
**Where it lands:** the RUNNERS banner placeholder at in-repo `shared/awba-engine.js:1357–1359`:
```javascript
/* ============================================================
   RUNNERS  ·  Phase 4 placeholder — AwbaLesson(cfg) / AwbaReview(cfg) (D-22)
   ============================================================ */
```

**Runner setup + state vars — PRESERVE byte-for-byte (Gen-3 115–128):**
```javascript
function AwbaLesson(cfg){
 var steps=cfg.beats.length;
 var pos=-1,stepIndex=0,answered=false,combo=0,comboBest=0,correct=0,mistakes=0,quizN=0,noorEarned=0;
 var PER=12,REFLECT=15;                                   // ← noor numbers frozen (D-47)
 cfg.beats.forEach(function(b){if(['mc','tf','tile'].indexOf(b.t)>=0)quizN++;});
```
> `pos` (back decrements) is SEPARATE from `stepIndex` (progress fill, only increments). Back clamps `stepIndex=max(pos,0)` so a filled progress dab NEVER un-fills (Gen-3 145). Back hidden at opener (`pos<0`).
> **DO NOT port** `AW.skeleton()` (Gen-3 116) or `if(cfg.unitColor)…setProperty('--blue',…)` (Gen-3 123) — retired: build the Athar skeleton in `.reg-page` instead, and `unitColor` stays an inert cfg field (State-of-the-Art table, 04-RESEARCH).

**Quiz resolution — PRESERVE math, RE-VOICE expression (Gen-3 274–287):**
```javascript
 function resolve(ok,it){
  if(ok){correct++;combo++;comboBest=Math.max(comboBest,combo);noorEarned+=PER;bumpNoor();
   if(combo===3)setTimeout(firePerfect,260);showCombo();}          // ← 260ms once-per-streak preserved
  else{mistakes++;combo=0;comboEl.classList.remove('show');}
  var titles=ok?['That’s it.','Beautiful.','Exactly right.','Masha’Allah.']:null;
  var title=ok?titles[correct%titles.length]:'Nothing lost';        // ← praise pool rotate correct%4
  var body=ok?it.good:it.gentle;
  ...
```
- Athar re-voice (D-45 / UI-SPEC §S3): `showCombo` (combo≥2) → accruing `.dab` gold on the META surface, NOT a floating pill. `firePerfect` → quiet `.thread` gold flourish, NO `PERFECT` overlay, NO `AW.confetti`, NO `AW.LANTERN`. Miss → law-8 grey ink-blot (`.opt.wrong`, CSS :807–825) + `it.gentle` one-liner + `.retry`/`--rose` frame. Never red, never `AW.HEART`.

**Star math — PRESERVE exactly (Gen-3 289, never 0):**
```javascript
 function starsFor(){return mistakes===0?3:(mistakes===1?2:1);}
```
Best-of persist at `done()` never downgrades (Gen-3 322–324): `if(now>prev){st[cfg.id]=now;AW.S.set('stars',st);}`.

**Reflect beat — PRESERVE (Gen-3 212–223):** first "Show a reflection" tap → reveal `it.model`, `noorEarned+=REFLECT`, relabel to "Continue"; second tap advances. Textarea NEVER persisted / re-rendered (XSS-inert, Security Domain).

**Opener greet — PRESERVE modes (Gen-3 149–162):** `AW.greetMode()` → first / streak (`ret>1` "N returns" chip) / returning (copy override). `AW.touchDay()` fires on the "Begin, gently" click (Gen-3 161), NOT page load. Use in-repo `AW.greetMode` (:404) + `AW.touchDay` (:385) verbatim — they are the same API.

**Icon re-map (Gen-3 renderers hardcode names that don't exist in gen-4):**
| Gen-3 call | gen-4 call | Note |
|---|---|---|
| `AW.ill('quran','mini')` (verse) | `AW.icon('quran-stand')` | wrap in `.ill` in `@layer screens` if a frame is wanted; `AW.ill` deleted |
| `AW.ill('beads','mini')` (depth) | `AW.icon('beads')` | same name in KIT |
| `AW.ill('dua','mini')` (reflect) | `AW.icon('dua')` | same |
| `AW.ill('starpat','sm')` (rewardNoor) | `AW.icon('pattern')` | renamed |
| `AW.ill('crescent')` (done) | `AW.icon('crescent')` | same |
| `AW.UNIT_ICON[u1..u4]` | `AW.UNIT_ICON` (:857, survives) | `compass/lanterns/kaaba/mosque` |
| `AW.BOLT/TARGET/CLOCK/HEART/STARG/STARE` | **do not exist** | re-choose from GLYPHS (`spark`/`star`/`check`) — see GLYPHS inventory in Shared Patterns |

---

### `shared/awba-engine.js` → `AwbaReview(cfg)` (engine/runner, timer state-machine)

**Behaviour analog:** `_MVP-BUILD/shared/awba-engine.js` lines 339–464 (the whole Gen-3 review runner).
**Expression analog:** in-repo primitives + `.reg-orbit` register + `.thread`/`.rosette` (CSS :890, :910).

**Constants + no-back-button — PRESERVE (Gen-3 348, 352):**
```javascript
 var PER=15,SWIFT=5,QTIME=14;                             // ← +15/+5 swift, 14s frozen (ENG-04)
 var rb=document.getElementById('awback');if(rb)rb.style.display='none';   // no back button, ever
```

**Timer state-machine — PRESERVE exactly (Gen-3 364–387) — the highest-value logic to port:**
```javascript
 function startTimer(){
  tleft=QTIME*10;thisInTime=true;tbar.classList.remove('low');tfill.style.width='100%';
  clearInterval(timer);
  timer=setInterval(function(){tleft--;var pct=Math.max(0,tleft/(QTIME*10))*100;tfill.style.width=pct+'%';
   if(pct<28)tbar.classList.add('low');                                  // ← .low re-voiced = quiet ember, not alarm
   if(tleft<=0){clearInterval(timer);thisInTime=false;allInTime=false;timeUp();}},100);   // 100ms decisecond tick
 }
 function timeUp(){ if(answered)return;answered=true;
  skipped.push(queue[qi]);                                               // park the question for the end
  ... setTimeout(advance,1500); }                                        // auto-skip after 1500ms, no penalty
 function advance(){ qi++;
  if(qi<queue.length){renderQ();return;}
  if(phase==='main'&&skipped.length){circleBackOffer();return;}          // circle-back when skipped remain
  result(); }
```

**Scoring — PRESERVE (Gen-3 438; main phase only earns noor):**
```javascript
 if(ok){correct++;if(phase==='main')noorEarned+=PER+(thisInTime?SWIFT:0);paintLamps();}
```
Circle-back phase (Gen-3 396–397) → `phase='back'`, lamp/thread lights but NO noor.

**Result stars — PRESERVE cap (Gen-3 451–454): any single timeout permanently caps at 2★:**
```javascript
 var stars=correct===CH.length?(allInTime?3:2):1;   // allInTime killed by any timeout at 369
 var verdict=stars===3?'Legendary':(stars===2?'Mastered':'Reviewed');
 AW.S.set('noor',AW.S.get('noor',0)+noorEarned);     // ← persist HERE (Gen-3 450)
```
- Athar re-voice (D-45 / UI-SPEC §S5): whole session in `.reg-orbit` + Hajar Gold (NOT `phone.classList.add('gold-bg')` — `.gold-bg` retired). `paintLamps()` lamp row → gold-`.thread` arcs lit `i<correct`. `AW.LANTERNG` intro art retired → dab-drift + `trophy`/`lamp` glyph. Mastery seal → `.rosette` (CSS :910). `AW.touchDay()` on "Begin the review" (Gen-3 407).

---

### `shared/awba-engine.js` → `AW.sound(cue)` (utility, file-I/O silent no-op)

**Analog:** the `AW.prefs` closure idiom (in-repo `shared/awba-engine.js:284–341`) for reading `soundMuted`; exact body given in 04-RESEARCH "Code Examples":
```javascript
AW.sound = function (cue) {                        // cue ∈ correct|incorrect|complete|streak
  if (AW.prefs.get('soundMuted', false)) return;   // visible mute toggle writes this pref (:335 set)
  try {
    var a = new Audio('shared/sfx/' + cue + '.mp3'); // page-relative (lessons/ → ../shared/sfx/ — see note)
    a.play().catch(function () {});                 // missing asset / autoplay block → silent
  } catch (e) { /* no-op */ }
};
```
> **Path caution:** lesson/review pages live in `lessons/` and `reviews/` (siblings of `shared/`), so the runtime path is `../shared/sfx/{cue}.mp3` from those pages. The RESEARCH snippet shows `shared/sfx/` — resolve the relative depth to match the page location (same relativity as the engine `<script src="../shared/…">` include). Confirm against the actual page shell before shipping (Assumption A5: `.mp3` extension is provisional, owner asset decision).

`soundMuted` already exists in the prefs blob default (`shared/awba-engine.js:297`) — no schema bump. Mute toggle in the HUD flips it via `AW.prefs.set('soundMuted', …)`.

---

### `shared/awba-engine.css` → `@layer screens` content (config/style)

**Analog:** the empty placeholder at `shared/awba-engine.css:923` — write content blocks INSIDE it, never touch the order line at `:16`:
```css
@layer screens   { /* reserved — Phase 2+: per-screen rules */ }
```
```css
@layer tokens, base, components, screens, motion;   /* :16 — NEVER re-declare this line (D-46) */
```

**Register scoping to copy (CSS :267–298):** every screen root gets ONE register class:
```css
  .reg-orbit{  /* Kiswah Black — Ring moment + whole review */  --go:.07; --icon-accent:var(--gold); }
  .reg-page{   /* Haram Cream — lessons/quizzes/reward */       --go:.028; --icon-accent:var(--crimson); }
  .reg-sky-night{ /* Last Third gradient — du'a close only */   --go:.07; --icon-accent:var(--gold); }
```

**Component classes to CONSUME (already shipped in `@layer components`) — do NOT re-author:**
- `.btn` (:655), `.opt` (:691), `.tf` (:707), `.tile` (:721), `.tab` (:733), `.hstat` (:754) — the paper-press inventory.
- The ONE paper-press (:775–786): `translateY(1px)` + one-step ink deepen. Every tappable already gets it.
- `.opt.correct` (:792, gold dot draws) / `.opt.wrong` (:807, grey ink-blot) / `.opt-why` (:818) / `.btn.retry` (:825, `--rose` frame) — law-8 wrong-answer is ALREADY built. The runner just toggles `.correct`/`.wrong`.
- Celebration primitives: `.dab` (:880, Circle drift), `.thread` (:890, Orbit ink-draw), `.rosette` (:910, gold seal stamp). These are the D-45 re-voiced celebration marks.

**What `@layer screens` must ADD (absent today — verified via grep):** the skeleton + per-screen wrappers Gen-3 called `.stage/.hero/.foot/.segbar/.scard/.qquote/.pnl/.lacc/.lamps/.weekcal/.noorbig/.grew/.masterbox/.kicker`. gen-4 has NONE of these. Author them here in `.reg-page`/`.reg-orbit` scope, token-only values (D-46: no new tokens). The scripture card `.scard` sets `--go:0` (clean ground, law 3).

**Motion tokens to reference (CSS :160–168), never raw ms:** `--dur-settle` 260 (Page verb), `--dur-draw` 240 (Orbit), `--dur-drift` 300 (Circle), `--dur-stamp` 150 (Festival seal), `--dur-press` 140. Keyframes already exist: `settle` (:939), `drift` (:957), `stamp` (:965), `ink-draw` (:976). Reduced-motion collapse of all `--dur-*` to 1ms is already wired (:1004–1014) — do not duplicate.

---

### `lessons/u1-m1.html` … `u4-m3.html` (×15) + `reviews/*.html` (×4) — page shells (view, request-response)

**Content analog (SPLICE byte-verbatim):** each Gen-3 data file's inline `AwbaLesson({…})` / `AwbaReview({…})` cfg body. Example `_MVP-BUILD/lessons/u1-m1.html:6–55` (cfg) — copy that object literal UNCHANGED (it calls `AW.cite(...)` at parse time inside the string concat, which the classic-script load order supports).

**Shell analog (the Athar-correct `<head>`):** `preview.html:1–20` — self-hosted font preloads, ONE stylesheet link, classic engine script, zero CDN:
```html
<link rel="preload" as="font" type="font/woff2" href="shared/fonts/readex-pro-400.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="shared/fonts/amiri-quran-400.woff2" crossorigin>
<link rel="stylesheet" href="shared/awba-engine.css">
<script src="shared/awba-engine.js"></script>          <!-- classic, no defer/async/module -->
```
> Page shells are in `lessons/`/`reviews/` (one level deeper than `preview.html`), so their asset paths use `../shared/…` — EXACTLY as Gen-3's `u1-m1.html:3–4` already does (`../shared/awba-engine.css`, `../shared/awba-engine.js`). Those two relative paths are IDENTICAL between Gen-3 and gen-4 — no change on port.

**THE PITFALL — strip on port (Gen-3 `u1-m1.html:2`):**
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:...&family=Amiri:...&display=swap" rel="stylesheet">
```
This CDN link (present in ALL 19 files) violates the zero-CDN law and references retired Poppins. **Splice the cfg only into a fresh shell — never whole-file copy.** Grep-gate the ported pages: `! grep -rq 'fonts.googleapis' lessons/ reviews/`.

**cfg field shapes the renderers consume (from `u1-m1.html`):**
- `depth` lenses (25–28): `lenses:{reality:'…',revelation:'…'+AW.cite(...),ruling:'…'}` — fixed order (D-45 lens re-map).
- `panel` items (38–45): `variant:'check', items:[{name:'…',body:'…'+AW.cite(...)}], marker:{type:'fact',body:'…'}`.
- `refs` (16–20): Qur'an ref (no `grade`) → `.ayah` face; hadith (with `grade`) → general Amiri. `AW.sheetRef` (:1049) already face-splits.

**Review cfg shape (`_MVP-BUILD/reviews/u1-review.html`):** `{id,title,sub,mastery,items:[{q,quote?,o,c,t}|{tf:true,q,c,t}],next:{href,label}}`. Note item `t`=explanation (NOT beat type — naming collision noted, no code conflict).

**Byte-fidelity record (D-49):** record a SHA/byte-diff of each spliced cfg region in the SUMMARY (preview.html demoCfg precedent, `preview.html:506–518`, was SHA-verified). 100 `˹ ˺` corner brackets must survive byte-identical.

---

### `scripts/tests/runner-lesson.test.js` + `runner-review.test.js` (test, unit)

**Analog:** `scripts/tests/components.test.js` (full) + the harness `scripts/tests/ls-stub.js:21–66`.

**Harness pattern to copy verbatim (ls-stub `loadEngine` — engine+probe MUST be ONE `runInContext` because `const AW` is a lexical binding):**
```javascript
const { makeLS, loadEngine } = require('./ls-stub');
test('AW.cite: preserves the validator-compatible shape', () => {
  const sandbox = loadEngine(makeLS({}), `globalThis.__out = AW.cite('hujurat-49-15', 'al-Ḥujurāt 49:15');`);
  assert.match(sandbox.__out, /^<span class="cite" data-ref="hujurat-49-15">/);
});
```
- `makeLS(seed)` = Map-backed localStorage stub; `loadEngine(ls, probeSrc)` returns the sandbox; read `sandbox.__out`. For object/array returns use `readOut(sandbox)` (JSON round-trip — cross-realm prototype fix, ls-stub :62).
- **Testability decision (Open Q1 / A4):** extract `starsFor()`, `resolve()` scoring, and the review timer-scoring (`PER+(thisInTime?SWIFT:0)`, the 2★ cap) as PURE helpers exported on `globalThis.AW` (mirror how `AW.deriveNodeState` at :437 and `skyDawn` at :1348 are exposed) so `node --test` can assert them WITHOUT a DOM. This is the cheapest ENG-03/04 coverage path.
- **Run form (Pitfall 4):** `node --test scripts/tests/*.test.js` — glob only; directory form crashes on Node v24.13.0. 64/64 baseline must stay green.

**The contract the ports satisfy — `scripts/validate-content.js`:** beat/panel/lens/marker enums frozen at `:32–35`:
```javascript
const BEAT_TYPES = ['read','frame','verse','panel','depth','reflect','mc','tf','tile'];
const PANEL_VARIANTS = ['pull','tell','guard','check'];
const DEPTH_LENSES = ['reality','revelation','ruling'];
const MARKER_TYPES = ['fact','remember','fard','angle'];
```
The runner must render every one of these (all 9 beats, all 4 panel variants, all 3 lenses, all marker types exercised across the 19 files). `node scripts/validate-content.js` over `lessons/`+`reviews/` must exit 0 (3 expected `note:` warnings — u3-m1/u3-m3 unused ref, u4-m2 unused term — MUST NOT be "fixed", D-49).

**Fixtures (validator-safe test content, NEVER scripture):** `scripts/fixtures/valid-lesson.html` exercises all 9 beat types with neutral placeholder copy; `valid-review.html` (mc+tf); `broken-lesson.html`. If runner unit tests need render-input fixtures, follow this neutral-placeholder shape — never real scripture in a test fixture.

---

## Shared Patterns

### WAAPI reward choreography (RWD-01 / D-51)
**Source:** `AW.animate` exemplar, in-repo `shared/awba-engine.js:1090–1096`.
**Apply to:** the `AwbaLesson` reward sequence (verdict→noor→returns→done→Ring→du'a).
```javascript
AW.animate = function (el, keyframes, durToken, easeToken) {
  var cs = getComputedStyle(document.documentElement);
  var dur = parseFloat(cs.getPropertyValue(durToken)) || 300;   // reads "260ms" off :root
  var ease = cs.getPropertyValue(easeToken).trim() || 'ease';   // linear(…) passes straight through
  if (AW.reducedMotion()) dur = 1;                              // self-guards — never hand-roll this
  return el.animate(keyframes, { duration: dur, easing: ease, fill: 'both' });  // .finished awaitable
};
```
Chain moments with `await AW.animate(el, kf, '--dur-settle', '--ease').finished;` + a 60ms `setTimeout` stagger between reveals (≤300ms/token). Persist noor at the noor moment (Gen-3 parity): `AW.S.set('noor', AW.S.get('noor',0) + noorEarned)`.

### The Ring moment (RWD-01 / D-51 / WR-01)
**Source:** `AW.ringSVG`, in-repo `shared/awba-engine.js:1145` (animateFrom semantics at :1167–1169).
**Apply to:** lesson-complete terminal moment ONLY.
```javascript
root.querySelector('.ring').innerHTML =
  AW.ringSVG({ atomsDone: preLessonAtoms + earnedAtoms, animateFrom: preLessonAtoms });
```
`animateFrom` MUST be captured BEFORE the lesson's atoms are added (Pitfall 7 — passing 0 or too-small re-draws the established frontier, law 9). Default `animateFrom = atomsDone` ⇒ empty span ⇒ static (safe). Reduced motion → final inked state, static.

### Citation / term sheets (ENG-06 — already shipped, just wire)
**Source:** `AW.wire` (:957) + `AW.sheetRef` (:1049) + `AW.sheetTerm` (:1071).
**Apply to:** every content beat with inline `.cite`/`.term`.
```javascript
AW.wire(root, cfg);   // binds .cite[data-ref]→sheetRef(cfg.refs), .term[data-term]→sheetTerm(cfg.terms)
```
`sheetRef` face-splits automatically (Qur'an → `.ayah`/Amiri Quran; hadith with `grade` → general Amiri + grade pill). Do NOT rebuild sheets — the singleton `AW.sheet` (:996) owns `.scrim`/`.sheet`.

### escapeHtml discipline (Security V5)
**Source:** in-repo `shared/awba-engine.js:901–914` (`escapeHtml`/`escapeAttr`).
**Apply to:** any dynamic string param the runner controls that becomes an attribute/aria-label. Author cfg content (scripture, `it.good`/`it.gentle`) injects verbatim (T-03-03 accept — trusted authored content). The one user-input surface (reflect textarea) is NEVER re-rendered or stored — keep it inert.

### State layer (persistence — the only localStorage seam, D-24)
**Source:** `AW.S`/`AW.prefs`/`AW.touchDay`/`AW.greetMode`/`AW.weekCal`/`AW.state` — in-repo `shared/awba-engine.js:55, 284, 371, 385, 404, 415`.
**Apply to:** all noor/stars/days/returns writes. `AW.touchDay` (:385) increments returns once/day on "begin". `AW.greetMode` (:404) → first/streak/returning. `AW.weekCal` (:415) returns `[{label,on}]` — the runner builds the markup (re-voice orange→apricot, never a "miss" state, RWD-02). Grep-gate: no `localStorage` outside `AW.S`/`AW.prefs`.

### GLYPHS inventory (icon re-map, Pitfall 8)
**Source:** in-repo `AW.GLYPHS` (:863–890) — the 13 available: `flame, spark, check, star, cite, lamp, lock, chest, trophy, fact, remember, fard, angle`. Scene KIT (20) at `AW.KIT` (:536); `AW.UNIT_ICON` (:857). Gen-3's `HEART/BOLT/TARGET/CLOCK/STARG/STARE` and `AW.ill()` are GONE — reward-stat marks re-chosen from `spark`/`star`/`check`; miss uses the law-8 grey blot (no glyph).

### Page-include + wiring pattern (FND-07 / Pitfall 1)
**Source:** `preview.html:20` (classic engine script first) + the closing IIFE guard `preview.html:502–504`:
```javascript
(function () {
  if (!(window.AW && AW.icon)) return;   // guard — AW must already exist (classic load order)
  ...
})();
```
Engine `<script src="../shared/awba-engine.js">` loads FIRST, classic (no defer/async/module); the data file's `AwbaLesson(cfg)` runs after. `AW is not defined` on load = wrong script type/order.

---

## No Analog Found

Files with no close match in the codebase — planner should use RESEARCH.md patterns:

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `scripts/tests/render-smoke.*` | test (smoke) | — | No headless-Chrome harness exists in-repo. Phase 3 used system Chrome (`/Applications/Google Chrome.app/…`) for visual gates via CLI (`--headless --dump-dom` / CDP), not a committed script. Build a new loader asserting 0 console errors across all 19 pages (covers ENG-01/02 render + MOT-05 silent-sfx + Pitfall-1 load order). Use `ls-stub`-style Node-core-only tooling; invoke Chrome via CLI, no puppeteer (zero-dep constraint). |
| `shared/sfx/` | asset dir | — | New empty directory (D-52). No code output — `AW.sound` no-ops cleanly when a cue file is absent. Owner delivers assets later with zero code change. |

---

## Metadata

**Analog search scope:** `shared/awba-engine.js` (in-repo, full structural read: STATE/KIT/COMPONENTS/RING/SKY/RUNNERS-placeholder) · `shared/awba-engine.css` (layer/register/component/keyframe map) · `preview.html` (head + IIFE) · `_MVP-BUILD/shared/awba-engine.js` (Gen-3 runners, full) · `_MVP-BUILD/lessons/u1-m1.html` + `reviews/u1-review.html` (cfg shapes) · `scripts/tests/ls-stub.js` + `components.test.js` · `scripts/validate-content.js` (contract enums + ingest) · `scripts/fixtures/valid-lesson.html` + `valid-review.html`.
**Files scanned:** ~12 (both engine trees, CSS, preview, 2 Gen-3 data files, 3 test files, validator, 2 fixtures)
**Pattern extraction date:** 2026-07-13
