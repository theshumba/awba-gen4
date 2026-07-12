# Phase 3: Components, Icon Kit & Motion Language - Pattern Map

**Mapped:** 2026-07-12
**Files analyzed:** 6 (2 modified engine files across 3 sections each, 1 modified preview, 1 new test file, plus the 4-token tokens-layer addition)
**Analogs found:** 6 / 6 (all in-repo; every file also has a Gen-3 EXTERNAL behavior-ground-truth analog)

This is a "fill the placeholder" phase, not a "create from a sibling feature" phase — Phase 1/2
already established the ONE-file banner discipline this phase's new code must extend. So every
in-repo analog below is either **an earlier section of the same two engine files** (structural
pattern) or **preview.html's own established section idiom** (markup pattern). Behavior ground
truth (what the icon kit / sheet / confetti / cite actually do) comes from the Gen-3 EXTERNAL
file, cited separately and clearly marked.

---

## File Classification

| New/Modified File | Role | Data Flow | Closest In-Repo Analog | Match Quality |
|--------------------|------|-----------|-------------------------|---------------|
| `shared/awba-engine.js` — **KIT** section (`AW.KIT`, `AW.GLYPHS`, `AW.UNIT_ICON`) | data/config module (icon registry) | static author-time data, zero I/O | `shared/awba-engine.js` — **STATE** section, `AW.S` IIFE (lines 54-252) | role-match (banner-section discipline, not data shape) |
| `shared/awba-engine.js` — **COMPONENTS** section (`AW.icon`, `escapeHtml`, `AW.cite`, `AW.wire`, `AW.sheet`+`sheetRef`+`sheetTerm`, `AW.confetti`, `AW.reducedMotion`, `AW.animate`) | component/utility module (string builders + DOM binders) | mixed: pure string transforms (`AW.icon`,`AW.cite`) + DOM event wiring (`AW.wire`,`AW.sheet`) + event-driven (confetti/WAAPI) | `shared/awba-engine.js` — **STATE** section, `AW.prefs` IIFE (lines 257-303) for the accessor-object idiom; Gen-3 EXTERNAL `_MVP-BUILD/shared/awba-engine.js` for exact behavior shapes | exact (structure) / EXTERNAL exact (behavior) |
| `shared/awba-engine.css` — **@layer tokens** (4 additions: `--press-rest`,`--press-active`,`--scrim`,`--overlay-hero`) | config (design tokens) | static | `shared/awba-engine.css` — `:root` block, motion tokens (lines 136-150) | exact |
| `shared/awba-engine.css` — **@layer components** (`.cite`,`.term`,`.sheet`,`.scrim`,`.btn`,`.opt`,`.tf`,`.tile`,`.tab`,`.hstat` chrome + gummy press) | component styling | CSS rule authoring | `shared/awba-engine.css` — **@layer base** (lines 191-303), same file's own rule-authoring conventions (custom-property-only values, no hex/px literals) | role-match (adjacent layer, same file, same author) |
| `shared/awba-engine.css` — **@layer motion** (`@keyframes` + transitions + dual-trigger reduced-motion) | component styling (motion/animation) | CSS rule authoring | Gen-3 EXTERNAL `_MVP-BUILD/shared/awba-engine.css` `@keyframes bob/glow/fall` (lines 193-202, 265-266) — behavior ground truth; no in-repo motion analog exists yet (this IS the first) | EXTERNAL exact (behavior) / no in-repo analog (expected — Phase 3 is first to fill this layer) |
| `preview.html` — new **§9 Icon registry grid** | verification-vehicle markup (showcase section) | render-only, static demo | `preview.html` **§7 Glyph test** grid (lines 669-778, `.pv-glyph`/`.pv-gcell`) | exact (grid-of-labelled-cells idiom already proven) |
| `preview.html` — new **§10 Sheet demos** | verification-vehicle markup + live JS wiring | event-driven (click → sheet open) | `preview.html` **§2 Live per-unit recolor** (lines 443-476, `.pv-focal`/`.pv-switchbar`, focal-point live-demo idiom) + **§5 Sheet-in mock** (lines 604-618, `.pv-sheetstage`/`.pv-scrim`/`.pv-sheet`) for the interactive-demo-stage shape | exact (interaction shape) — content now real `AW.sheet`, not mock |
| `preview.html` — new **§11 Press-physics inventory** | verification-vehicle markup | render-only, static demo | `preview.html` **§4 Radii & elevation tiles** (lines 547-579, `.pv-tiles`/`.pv-tile`) | exact (labelled-tile-row idiom) |
| `preview.html` — new **§12 Motion vocabulary + reduced-motion** | verification-vehicle markup + live JS wiring | event-driven (toggle button + `matchMedia`) | `preview.html` **§5 Motion demos** (lines 581-620, `.pv-motion`/`.pv-mcell`, replay-button idiom lines 598-603/831-840) | exact |
| `preview.html` — `<script>` tag addition (load real engine) + new inline script block | integration wiring | parse-time script load + event-driven | `preview.html` `<head>` stylesheet link (line 15) for the load-order convention; `preview.html` closing `<script>` IIFE (lines 800-852) for the classic-script wiring idiom | exact |
| `scripts/tests/components.test.js` (new) | test | unit (pure-function assertions against a headless engine load) | `scripts/tests/state-helpers.test.js` (full file, 162 lines) + `scripts/tests/ls-stub.js` (`loadEngine`, lines 45-52) | exact |

---

## Pattern Assignments

### `shared/awba-engine.js` — KIT section

**Insertion point (exact, already in file):**
```javascript
/* ============================================================
   KIT  ·  Phase 3/4 placeholder — icon kit, companion art, glyphs (D-22)
   ============================================================ */
```
`shared/awba-engine.js:446-448` — write the KIT content directly after this banner comment, before the COMPONENTS banner at line 450.

**In-repo structural analog — `AW.S` IIFE, `shared/awba-engine.js:54-62`:**
```javascript
AW.S = (function () {
  var KEY = 'awba_state';
  var CURRENT = 1;
  var mem = null;

  function defaultState() {
    return { schemaVersion: CURRENT, noor: 0, returns: 0, lastDay: null, days: [], stars: {}, chests: {} };
  }
```
Copy the **module-scoped-object-literal-as-registry** discipline (top-level `AW.KIT = { ... }`, `AW.GLYPHS = { ... }`, `AW.UNIT_ICON = { ... }` — no IIFE needed here since KIT is pure static data, unlike `AW.S`/`AW.prefs` which need closures for `mem`/`persist`). The comment-banner-then-flush-left-declaration style at the top of every AW.* section (see `AW.todayStr` at line 324, `AW.state` at line 333) is what KIT's per-icon one-line naming comments should mirror.

**EXTERNAL Gen-3 ground truth — `_MVP-BUILD/shared/awba-engine.js:9`** (superseded shape — DO NOT copy the escaping style, only the icon inventory as raw material):
```javascript
AW.KIT={"mosque": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 300\" fill=\"none\"><path d=\"M119 20 C174 12 212 58 205 120...
```
This is Gen-3's 12-icon embedded KIT — one minified line, double-quoted JSON-shaped object with `\"`-escaped SVG strings (because it used `"..."` JS string literals, not backticks). D-31 explicitly supersedes this shape: Gen-4 authors **backtick template literals** (no escaping needed) as **multi-line, one-icon-per-entry** with a naming comment, sourced from the canonical 20-file folder, not this embedded 12.

**EXTERNAL Gen-3 glyph submap — `_MVP-BUILD/shared/awba-engine.js:22-27`:**
```javascript
AW.GLY={
 fact:'<svg viewBox="0 0 24 24"><path d="M12 3 C13 8 16 11 21 12 C16 13 13 16 12 21 C11 16 8 13 3 12 C8 11 11 8 12 3Z" fill="#2E6BF5"/></svg>',
 remember:'<svg viewBox="0 0 24 24"><path d="M7 3h10a1 1 0 0 1 1 1v17l-6-4-6 4V4a1 1 0 0 1 1-1Z" fill="#2E6BF5"/></svg>',
 fard:'<svg viewBox="0 0 24 24"><path d="M17 4 A9 9 0 1 0 17 20 A7 7 0 1 1 17 4Z" fill="#2E6BF5"/></svg>',
 angle:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#2E6BF5" stroke-width="2"/><path d="M12 7 L14.5 12 L12 17 L9.5 12Z" fill="#2E6BF5"/></svg>'};
```
This IS the shape to elevate into `AW.GLYPHS` (already using backtick-friendly single-quoted strings, already a sub-map object) — the marker glyphs (`fact`/`remember`/`fard`/`angle`) here plus the standalone constants at `_MVP-BUILD/shared/awba-engine.js:11-21` (`AW.FLAME`,`AW.SPARK`,`AW.CHECK`,`AW.CITE`,`AW.LP` i.e. lamp/lock-adjacent, `AW.STARG`/`AW.STARE` → `star`) are the D-33 "small standalone glyphs Gen-3 used" that join `GLYPHS` as one sub-map, not per-page constants.

**EXTERNAL Gen-3 anti-pattern to explicitly NOT port — `_MVP-BUILD/shared/awba-engine.js:29,34`:**
```javascript
AW.LANTERNG='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240">...';   // line 29, hand-authored (later overwritten)
AW.LANTERNG=AW.KIT.lantern.replace(/#2E6BF5/g,'#E8A400').replace(/#2536CE/g,'#B47F00').replace(/#C9D7F5/g,'#4a3a10').replace(/#EAF0FE/g,'#FFF3CC');  // line 34, runtime regex recolor
```
Line 34 is the exact `AW.recolor`-style runtime regex recolor D-33 forbids. Gen-4's `lantern-gold` must be an **authored, committed entry in `AW.KIT`**, never a `.replace(/#.../g, ...)` call anywhere in the file (the grep gate `! grep -q '\.replace(/#' shared/awba-engine.js` exists precisely to catch a regression back to this line-34 pattern).

---

### `shared/awba-engine.js` — COMPONENTS section

**Insertion point (exact, already in file):**
```javascript
/* ============================================================
   COMPONENTS  ·  Phase 3/4 placeholder — shared UI builders (D-22)
   ============================================================ */
```
`shared/awba-engine.js:450-452` — write directly after this banner, before the RUNNERS banner at line 454.

**In-repo structural analog — `AW.prefs` IIFE, `shared/awba-engine.js:257-303`** (the accessor-object-with-get/set idiom to mirror for `AW.sheet`'s singleton closure):
```javascript
AW.prefs = (function () {
  var KEY = 'awba_prefs';
  var CURRENT = 1;
  var mem = null;

  function defaultPrefs() {
    return { schemaVersion: CURRENT, soundMuted: false, motion: 'system' };
  }

  function persist(p) {
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch (e) {}
  }
  ...
  return {
    get: function (k, d) { ... },
    set: function (k, v) { ... },
  };
})();
```
`AW.sheet`'s singleton (per 03-RESEARCH.md Pattern 4) should follow this exact shape: an IIFE with private `var`s (`scrim, sheet, invoker` instead of `mem`), private helper functions (`ensure()` instead of `load()`/`persist()`), and a returned public object (`api` with `open`/`close`) — same closure-over-module-state idiom already proven twice in this file (`AW.S`, `AW.prefs`).

**In-repo boot-stamp / guard pattern — `shared/awba-engine.js:429-438`** (the `typeof document !== 'undefined'` guard to mirror in `AW.reducedMotion`):
```javascript
if (typeof document !== 'undefined') {
  if (AW.prefs.get('motion', 'system') === 'reduce') {
    document.documentElement.setAttribute('data-motion', 'reduce');
  }
  if (AW.prefs.get('soundMuted', false)) {
    document.documentElement.setAttribute('data-sound', 'muted');
  }
}
```
This is the exact precedent for reading `document.documentElement.getAttribute('data-motion')` safely — `AW.reducedMotion()` reads the same attribute this boot-stamp writes (Pitfall 2 in 03-RESEARCH.md: this stamp fires ONLY on user override, never the OS setting, so `AW.reducedMotion()` must ALSO check `matchMedia` directly, not rely on this attribute alone).

**In-repo test-ergonomics export — `shared/awba-engine.js:440-444`:**
```javascript
if (typeof globalThis !== 'undefined') globalThis.AW = AW;
```
Already covers every new `AW.*` added in KIT/COMPONENTS automatically (no change needed here) — confirms `scripts/tests/components.test.js` can read `AW.icon`, `AW.cite`, `AW.reducedMotion` off `sandbox.AW` or `sandbox.__out` the same way `state-helpers.test.js` already does.

**Contract-compatibility analog — `scripts/validate-content.js:47-53`** (the `AW.cite` shape the real implementation MUST preserve exactly):
```javascript
const sandbox = {
  AW: {
    // Mirrors the real AW.cite() markup shape exactly, so data-ref ids embedded in cfg
    // strings survive ingestion identically to how the real engine would render them.
    cite: function (id, label) {
      return '<span class="cite" data-ref="' + id + '">' + (label || '') + '</span>';
    },
  },
```
And the extractor regex at `scripts/validate-content.js:301`:
```javascript
Array.from(blob.matchAll(/data-ref=["']([^"']+)["']/g)).map(function (m) {
```
**Load-bearing:** the real `AW.cite` may add the cite glyph before the label (per D-37 / 03-RESEARCH.md Pattern 5), but the outer `<span class="cite" data-ref="ID">...</span>` shape must byte-match this stub's structure or the Phase-2 validator gate breaks (Pitfall 4).

**EXTERNAL Gen-3 ground truth — behavior to elevate, `_MVP-BUILD/shared/awba-engine.js`:**

`AW.cite` (line 71):
```javascript
AW.cite=function(id,label){return '<span class="cite" data-ref="'+id+'">'+AW.CITE+label+'</span>';};
```

`AW.wire` (lines 103-106):
```javascript
AW.wire=function(root,cfg){
 root.querySelectorAll('.cite[data-ref]').forEach(function(el){el.addEventListener('click',function(){AW.sheetRef(cfg.refs||{},el.dataset.ref);});});
 root.querySelectorAll('.term[data-term]').forEach(function(el){el.addEventListener('click',function(){AW.sheetTerm(cfg.terms||{},el.dataset.term);});});
};
```

`AW.sheetRef` (lines 88-96) — the pending-pill + grade-pill shape (`unverified · pending review` is ALWAYS appended, D-36):
```javascript
AW.sheetRef=function(refs,id){const r=refs[id];if(!r)return;
 const grade=r.grade?'<span class="r-pill grade">'+r.grade+'</span>':'';
 document.getElementById('sheet').innerHTML='<div class="grip"></div>'
  +'<div class="r-src">'+(r.kind||'The verse')+' · '+r.ref+grade+'</div>'
  +'<div class="r-ar">'+r.ar+'</div><div class="r-mean">'+r.mean+'</div>'
  +'<div class="r-ref">'+r.src+'</div>'
  +'<div style="margin-top:13px"><span class="r-pill">unverified · pending review</span></div>';
 document.getElementById('scrim').classList.add('open'); };
```
Gen-4 rebuilds this on top of `AW.sheet(html)` (not the bare `getElementById('sheet')` Gen-3 depended on `AW.skeleton()` to have injected) and adds the `.ayah`-vs-general-Amiri face split on the `.r-ar` div per D-36.

`AW.sheetTerm` (lines 97-102):
```javascript
AW.sheetTerm=function(terms,id){const t=terms[id];if(!t)return;
 document.getElementById('sheet').innerHTML='<div class="grip"></div>'
  +'<div class="g-ar">'+t.ar+'</div><div class="g-tl">'+t.tl+'</div>'
  +'<div class="g-wd">'+t.word+'</div><div class="g-df">'+t.def+'</div><div class="g-cx">'+t.ctx+'</div>';
 document.getElementById('scrim').classList.add('open'); };
```

`AW.confetti` (lines 82-87) — DOM-div spawn, self-removing, transform-only animation, the shape D-41 says to keep:
```javascript
AW.confetti=function(n){const el=document.getElementById('confetti');const cols=['#FFD34D','#2E6BF5','#1F9D6B','#F0730B','#8FB4FF','#E8A400'];
 for(let i=0;i<n;i++){const d=document.createElement('div');d.className='cf';
  d.style.left=(Math.random()*100)+'%';d.style.background=cols[i%cols.length];
  const dur=1.6+(i%7)*0.18;d.style.animationDuration=dur+'s';d.style.animationDelay=((i%5)*0.05)+'s';
  d.style.width=(7+(i%4)*2)+'px';el.appendChild(d);setTimeout(function(){d.remove();},(dur+0.4)*1000);}
};
```
Gen-4 must: (1) decouple from `#confetti` existing via `AW.skeleton()` — lazily create/find its own overlay like `AW.sheet` does; (2) prepend a `if (AW.reducedMotion()) return;` guard as the first line (Gen-3 has none — this is the day-one elevation); (3) swap the 6-hex palette for the brand tokens (`--gold2/--flame2/--accent-bright/--green`) per the UI-SPEC color contract, read via `getComputedStyle`.

`firePerfect` (lines 137-138) — the WAAPI exemplar's real-world trigger context (informs where `AW.animate` gets called from in Phase 4, not code to port verbatim since choreography is Phase 4 scope):
```javascript
function firePerfect(){perfectEl.innerHTML='<div class="companion sm">'+AW.LANTERN+'</div><h1>PERFECT</h1><p>Three in a row. Keep walking.</p>';
 perfectEl.classList.add('show');AW.confetti(30);setTimeout(function(){perfectEl.classList.remove('show');},1400);}
```
Note the `setTimeout` orchestration Gen-3 used here — 03-RESEARCH.md Don't-Hand-Roll table explicitly replaces this class of `setTimeout` sequencing with `AW.animate(...).finished` promises for the Phase-3 WAAPI exemplar (PERFECT overlay scale-pop), so this is what NOT to copy mechanically, only to understand as the trigger site.

---

### `shared/awba-engine.css` — @layer tokens (4 additions)

**Insertion point:** inside the existing `:root { ... }` block, `shared/awba-engine.css:42-163` — add the 4 new custom properties near the existing motion tokens (lines 136-150) since they're consumed by the same `@layer motion`/`@layer components` code this phase writes.

**In-repo analog — motion token block, `shared/awba-engine.css:136-150`:**
```css
/* -- Motion — durations + easings declared now; the motion LAYER lands Phase 3 (D-08).
   The two spring curves are copied verbatim from UI-SPEC — never hand-edit these datasets. */
--dur-1:   80ms;    /* instant feedback */
--dur-2:   120ms;   /* press / tap collapse */
--dur-3:   200ms;   /* hover, small state change */
--dur-4:   280ms;   /* sheet / scrim in-out */
--dur-5:   350ms;   /* accordion, node pop-in */
--dur-6:   600ms;   /* reward reveal step */
--dur-amb: 4800ms;  /* ambient companion bob / glow loop */
--ease-standard: cubic-bezier(.2,.8,.2,1);
--ease-out:      cubic-bezier(.16,1,.3,1);
--ease-in:       cubic-bezier(.5,0,.75,0);
--ease-press:    cubic-bezier(.2,1.4,.5,1);
--ease-spring:   linear(0, 0.006, 0.025 2.8%, ... 1);
--ease-gentle:   linear(0, 0.19 12%, ... 1);
```
Copy the **comment-above-group, one-token-per-line, trailing-purpose-comment** formatting exactly for the 4 new tokens (`--press-rest: 5px; /* gummy hard-shadow rest offset */` etc., per UI-SPEC's Phase-3 Token Additions table).

---

### `shared/awba-engine.css` — @layer components

**Insertion point (exact, already in file):**
```css
@layer components { /* reserved — Phase 3: .btn / .opt / .tf / .tile chrome + gummy physics (MOT-03) */ }
```
`shared/awba-engine.css:305` — replace this single-line stub with the full multi-line block. Rule-authoring conventions to copy from the **same file's own `@layer base`** (lines 191-303): every color/spacing/radius/shadow value is `var(--token)`, never a literal; section comments (`/* -- Focus-visible (ACC-01 foundation) ---... */`) precede each logical group; `[data-register="night"]` attribute-selector overrides follow the base rule immediately (see lines 265-278) — the same pattern applies for any night-register press/chrome variant this phase needs.

**EXTERNAL Gen-3 ground truth — gummy press (behavior to elevate, tokenize), `_MVP-BUILD/shared/awba-engine.css:182-191`:**
```css
.btn{width:100%;border:none;border-radius:16px;padding:15px;font-family:var(--disp);font-weight:700;
  font-size:16px;cursor:pointer;background:var(--blue);color:#fff;transition:.12s;box-shadow:0 5px 0 #1E51D6;
  letter-spacing:.02em;text-decoration:none;display:block;text-align:center}
.btn:active{transform:translateY(3px);box-shadow:0 2px 0 #1E51D6}
.btn.green{background:var(--green);box-shadow:0 5px 0 #16794F}
.btn.gold{background:linear-gradient(160deg,var(--gold2),var(--gold));color:#3a2b00;box-shadow:0 5px 0 var(--goldDeep)}
.btn.disabled{background:#D7E0F3;color:#9DAAC6;box-shadow:0 5px 0 #C4D0EA;cursor:default}
```
This IS the `0 5px 0 → 0 2px 0 + translateY(3px)` gummy signature the UI-SPEC "Press Physics" section formalizes as `--press-rest`/`--press-active`. Gen-4 tokenizes the hard-shadow color to `var(--accent-deep)` (replacing the literal `#1E51D6`) and the offsets to `var(--press-rest)`/`var(--press-active)`, and applies the rule to the **full inventory** (`.btn, .opt, .tf, .tile, .tab, .hstat`) as ONE shared selector group per D-40, not per-class duplication like Gen-3's `.btn:active` / `.tile:active` (line 160) being separately declared.

**EXTERNAL Gen-3 — inline chip press + citation chip, `_MVP-BUILD/shared/awba-engine.css:65-70,158-161`:**
```css
.cite{display:inline-flex;align-items:center;gap:4px;color:var(--blue2);font-weight:600;
  font-size:.84em;cursor:pointer;background:var(--tint);border:1px solid var(--blue3);
  border-radius:8px;padding:1px 8px 1px 6px;line-height:1.65;white-space:nowrap;vertical-align:baseline}
.cite:hover{background:var(--blue);border-color:var(--blue);color:#fff}
...
.tile{border:2px solid var(--line2);background:var(--paper);border-radius:12px;padding:10px 15px;font-family:var(--sans);
.tile:active{transform:translateY(1px)}
```
`.tile:active{transform:translateY(1px)}` (no hard-shadow collapse) is the exact Gen-3 precedent for the "inline chips can't carry a 5px offset" reconciliation the UI-SPEC documents for `.cite`/`.term` — copy this **lighter press treatment**, re-tokenized to `var(--dur-2) var(--ease-press)`, rather than inventing a new inline-press mechanism.

**EXTERNAL Gen-3 — option/true-false state styling, `_MVP-BUILD/shared/awba-engine.css:142-152`** (informs `.opt`/`.tf` rest/correct/miss states even though quiz logic itself is Phase 4):
```css
.opt{width:100%;text-align:left;border:2px solid var(--line2);background:var(--paper);border-radius:14px;
.opt:hover{border-color:var(--blue3)}
.opt.sel{border-color:var(--blue);box-shadow:0 2px 0 var(--blue3)}
.tf{flex:1;text-align:center;font-weight:600;border:2px solid var(--line2);background:var(--paper);
.tf.sel{border-color:var(--blue);box-shadow:0 2px 0 var(--blue3)}
.opt.correct,.tf.correct{border-color:var(--green);background:var(--green-bg);color:var(--green-ink);font-weight:600;box-shadow:0 2px 0 var(--green-line)}
.opt.miss,.tf.miss{border-color:var(--amber);background:var(--amber-bg);color:var(--amber-ink);box-shadow:0 2px 0 var(--amber-line)}
```
Phase 3 only needs the **rest + press** treatment for `.opt`/`.tf` (per press-physics inventory, D-40); the `.correct`/`.miss` state colors are already governed by the inherited mercy semantic tokens (`--green-*`/`--amber-*`) and can be seeded here or left for Phase 4 — but the amber-never-red law is already visible in this Gen-3 excerpt (no red anywhere).

**EXTERNAL Gen-3 — bottom sheet chrome, `_MVP-BUILD/shared/awba-engine.css:268-287`:**
```css
.scrim{position:absolute;inset:0;background:rgba(30,40,80,.42);opacity:0;pointer-events:none;transition:.25s;z-index:24}
.scrim.open{opacity:1;pointer-events:auto}
.sheet{position:absolute;left:0;right:0;bottom:0;background:var(--paper);border-radius:24px 24px 0 0;
  padding:22px 22px 26px;transform:translateY(100%);transition:transform .3s ease;z-index:25;max-height:82%;overflow-y:auto}
.scrim.open .sheet{transform:translateY(0)}
.sheet .grip{width:40px;height:4px;border-radius:9px;background:var(--line2);margin:0 auto 16px}
.sheet .r-src{...color:var(--blue2)...}
.sheet .r-ar{font-family:var(--naskh);font-size:21px;line-height:2;text-align:right;direction:rtl;color:var(--blue2);margin-bottom:14px}
.sheet .r-mean{font-size:15.5px;line-height:1.6;color:var(--ink);margin-bottom:12px}
.sheet .r-ref{font-size:12.5px;color:var(--ink3);font-style:italic}
.sheet .r-pill{...border:1px solid var(--blue3);color:var(--blue);border-radius:99px;padding:2px 8px;text-transform:uppercase}
.sheet .r-pill.grade{border-color:var(--green-line);color:var(--green-ink)}
.sheet .g-ar{font-family:var(--naskh);font-size:32px;color:var(--blue);text-align:center;margin-bottom:4px}
.sheet .g-tl{text-align:center;color:var(--ink3);font-size:14px;margin-bottom:14px}
.sheet .g-wd{font-family:var(--disp);font-weight:600;font-size:19px;margin-bottom:8px}
.sheet .g-df{font-size:15px;line-height:1.55;margin-bottom:10px}
.sheet .g-cx{font-size:14px;line-height:1.55;color:var(--ink2)}
```
This is the exact structural + field-name shape (`.r-src/.r-ar/.r-mean/.r-ref/.r-pill` and `.g-ar/.g-tl/.g-wd/.g-df/.g-cx`) to re-token per the Gen-3→Gen-4 translation table in 03-RESEARCH.md Pattern 6 (`--blue2→--accent-deep`, `--naskh→--font-ar` or `.ayah`→`--font-quran`, literal px→`--fs-*` tokens, position/transition values→`var(--dur-4) var(--ease-gentle)`/`var(--ease-in)` per direction). `position:absolute` becomes `position:fixed` since Gen-4's `AW.sheet` is decoupled from a `.phone` positioning context (03-RESEARCH.md Pattern 4).

**EXTERNAL Gen-3 — combo chip + PERFECT overlay, `_MVP-BUILD/shared/awba-engine.css:41-46,257-263`:**
```css
@keyframes bump{0%,100%{transform:scale(1)}40%{transform:scale(1.35)}}
.combo{position:absolute;top:60px;right:14px;background:#FFF3DE;border:1.5px solid #F2C879;color:#B4720C;
  border-radius:99px;padding:5px 12px;font-family:var(--disp);font-weight:700;font-size:12.5px;z-index:7;
  display:flex;align-items:center;gap:5px;transform:scale(0);transform-origin:right center;transition:transform .22s cubic-bezier(.2,1.4,.5,1)}
.combo.show{transform:scale(1)}
...
.perfect{position:absolute;inset:0;background:rgba(37,54,206,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;
  color:#fff;z-index:20;opacity:0;pointer-events:none;transition:.28s}
.perfect.show{opacity:1;pointer-events:auto}
.perfect h1{font-family:var(--disp);font-weight:800;font-size:44px;letter-spacing:.04em;margin:14px 0 6px;
  background:linear-gradient(90deg,#FFD34D,#FF9E3D);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
```
Per the UI-SPEC's mercy-coherence decision, `.combo` moves from Gen-3's amber-adjacent hex (`#FFF3DE`/`#F2C879`/`#B4720C`) to `color-mix(in srgb, var(--gold2) 22%, var(--paper))`/`var(--gold)`/`var(--gold-deep)` (gold register, never amber). `.perfect`'s `rgba(37,54,206,.94)` field IS `--overlay-hero` verbatim (already measured and locked as the new token's value) — the `h1` gradient text-clip technique (`background-clip:text` + `-webkit-text-fill-color:transparent`) is the exact mechanism to reuse for the PERFECT heading gold gradient, just re-tokenized (`--gold2`→`--flame2`) and dropped to Poppins 700 (UI-SPEC 800-quarantine).

---

### `shared/awba-engine.css` — @layer motion

**Insertion point (exact, already in file):**
```css
@layer motion    { /* reserved — Phase 3: motion + prefers-reduced-motion guards (MOT-01 / MOT-04) */ }
```
`shared/awba-engine.css:307` — replace this stub. **No in-repo analog exists** — this is genuinely the first content this layer receives; the pattern comes entirely from the Gen-3 EXTERNAL keyframes plus 03-RESEARCH.md Pattern 7's verified dual-trigger technique (already fully specified in RESEARCH — reproduced here for convenience):

**EXTERNAL Gen-3 keyframes to elevate, `_MVP-BUILD/shared/awba-engine.css:193-202,265-266`:**
```css
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
@keyframes glow{0%,100%{filter:drop-shadow(0 3px 8px rgba(46,107,245,.35))}50%{filter:drop-shadow(0 0 24px rgba(245,190,60,.75))}}
.companion{display:inline-block;animation:bob 3s ease-in-out infinite}
.companion svg{animation:glow 2.8s ease-in-out infinite;width:132px}
...
@keyframes fall{to{transform:translateY(840px) rotate(720deg);opacity:.3}}
```
Re-token `3s`/`2.8s` → `var(--dur-amb)` (4800ms), `ease-in-out` → `var(--ease-gentle)`; `@keyframes fall` ports almost verbatim (already transform-only/compositor-friendly) into the confetti `.cf` rule this phase authors alongside it.

**Dual-trigger reduced-motion block (from 03-RESEARCH.md Pattern 7, verified technique — not from any single file, this is the phase's own synthesis; write it exactly once, both triggers sharing bodies):**
```css
@media (prefers-reduced-motion: reduce) {
  :root { --dur-1:1ms; --dur-2:1ms; --dur-3:1ms; --dur-4:1ms; --dur-5:1ms; --dur-6:1ms; }
  .companion, .breathing-ring, [data-ambient] { animation: none !important; }
}
[data-motion="reduce"] { --dur-1:1ms; --dur-2:1ms; --dur-3:1ms; --dur-4:1ms; --dur-5:1ms; --dur-6:1ms; }
[data-motion="reduce"] .companion,
[data-motion="reduce"] .breathing-ring,
[data-motion="reduce"] [data-ambient] { animation: none !important; }
```
This must live in `@layer motion` (last-declared = highest priority per the file's own header comment at `shared/awba-engine.css:8-14`) so it always wins over any `@layer components`/`@layer screens` animation that forgets its own guard.

---

### `preview.html` — §9 Icon registry grid

**Insertion point:** immediately after §8 closes (`preview.html:796`, `</section>`) and before `</main>` (line 798).

**In-repo analog — §7 Glyph test grid, `preview.html:669-778`:**
```html
<section class="pv-section" id="s7">
  <div class="pv-wrap">
    <div class="pv-head">
      <h2><span class="pv-num">7</span>Glyph test</h2>
      <p>Every at-risk codepoint from Josh's real content, rendered in its correct self-hosted face and labelled. ...</p>
    </div>
    <div class="pv-glyph">
      <div class="pv-gcell">
        <div class="face">Corner brackets · U+02F9 / U+02FA</div>
        <div class="cp">Poppins subset lacks these — --font-disp falls through to Inter, cleanly.</div>
        <div class="pv-gpair">
          <span class="tag">Poppins string (fallback in action)</span>
          <span class="render pv-poppins">Say, ˹O Prophet,˺ "He is Allah—One."</span>
        </div>
      </div>
      ...
      <div class="pv-gcell wide"> ... </div>
    </div>
  </div>
</section>
```
And the matching CSS, `preview.html:251-264` (unlayered `<style>` block):
```css
.pv-glyph{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:var(--sp-4); }
.pv-gcell{
  background:var(--paper); border:1px solid var(--line); border-radius:var(--r-md);
  box-shadow:var(--sh-1); padding:var(--sp-4); display:grid; gap:var(--sp-2s); align-content:start;
}
.pv-gcell.wide{ grid-column:1 / -1; }
```
§9 copies this exact **`<section id="sN">` → `.pv-wrap` → `.pv-head` (`<h2><span class="pv-num">N</span>Title</h2><p>...</p>`) → grid-of-cells** skeleton, with `id="s9"`, `<span class="pv-num">9</span>`, a new `.pv-icongrid`/`.pv-icell` chrome pair (or reuse `.pv-glyph`/`.pv-gcell` naming if the checker prefers consistency) sized for `scene-tile` (56px) icons + name label (`--fs-kicker`), and ONE `.pv-gcell.wide`-style dark-swatch cell for `lantern-gold` on a night-register background (mirrors the `pv-gcell.wide` "face split" cell at lines 754-766 which already demonstrates the "one wide cell proving a special case inside an otherwise uniform grid" idiom).

**Content wiring — real `AW.icon()` calls, not mocked SVGs:**
```html
<div class="pv-icell"><div class="art"></div><div class="name">mosque</div></div>
```
with inline script (see §12 pattern below for the wiring idiom) doing `document.querySelector('#s9 .art').innerHTML = AW.icon('mosque')` per cell, OR server-side-equivalent inline `<script>document.write(...)</script>`-free approach: build the grid via a small JS loop over `Object.keys(AW.KIT)` appending markup — this is new code with no direct existing analog, but should follow the classic-IIFE-in-closing-`<script>`-block convention shown below.

---

### `preview.html` — §10 Sheet demos

**Insertion point:** after the new §9 section.

**In-repo analog (interaction shape) — §5 Sheet-in mock, `preview.html:604-618` + wiring at `preview.html:842-850`:**
```html
<div class="pv-sheetstage">
  <div class="pv-scrim" id="pv-scrim">
    <div class="pv-sheet">
      <div class="pv-grip"></div>
      <p ...>A calm bottom sheet.</p>
      <button class="pv-tinybtn" id="pv-sheet-close" type="button">Close</button>
    </div>
  </div>
</div>
<button class="pv-tinybtn" id="pv-sheet-open" type="button">Open sheet</button>
```
```javascript
/* Sheet demo. */
var scrim = document.getElementById('pv-scrim');
var openBtn = document.getElementById('pv-sheet-open');
var closeBtn = document.getElementById('pv-sheet-close');
if (scrim && openBtn) {
  openBtn.addEventListener('click', function () { scrim.classList.add('open'); });
  scrim.addEventListener('click', function (e) { if (e.target === scrim) scrim.classList.remove('open'); });
  if (closeBtn) closeBtn.addEventListener('click', function () { scrim.classList.remove('open'); });
}
```
§10 supersedes this exact `getElementById` + `addEventListener` idiom but calls the **real** `AW.sheet`/`AW.cite`/`AW.wire`/`AW.sheetRef`/`AW.sheetTerm` instead of toggling a `.open` class on a preview-only mock — e.g.:
```javascript
var demoCfg = { refs: { 'hujurat-49-15': {...}, 'muslim-8': {...} }, terms: { aqeedah: {...} } };
document.getElementById('s10').innerHTML =
  '<p>' + AW.cite('hujurat-49-15', 'al-Ḥujurāt 49:15') + ' ' + AW.cite('muslim-8', 'Ṣaḥīḥ Muslim 8') +
  ' <span class="term" data-term="aqeedah">aqeedah</span></p>';
AW.wire(document.getElementById('s10'), demoCfg);
```
matching the `pv-head`/`pv-num` section skeleton from §9 above. **Mercy binding:** this section's markup must have zero `.combo`/`.perfect`/confetti-triggering elements anywhere in the same `.pv-wrap` (D-38 law) — keep §10 visually and structurally isolated from §12's confetti/PERFECT demo.

---

### `preview.html` — §11 Press-physics inventory

**In-repo analog — §4 Radii & elevation tiles, `preview.html:547-579`:**
```html
<section class="pv-section" id="s4">
  <div class="pv-wrap">
    <div class="pv-head">
      <h2><span class="pv-num">4</span>Radii &amp; elevation</h2>
      <p>Soft, warm corners and indigo-tinted shadows — never grey or black. One tile per token.</p>
    </div>
    <div class="pv-card">
      <p class="pv-subhead">Radii · --r-*</p>
      <div class="pv-tiles">
        <div class="pv-tile"><div class="demo" style="border-radius:var(--r-xs)"></div><div class="tlab">--r-xs</div><div class="tval">8px</div></div>
        ...
      </div>
    </div>
  </div>
</section>
```
with CSS at `preview.html:192-198`:
```css
.pv-tiles{ display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:var(--sp-4); }
.pv-tile{ display:flex; flex-direction:column; gap:var(--sp-3); }
```
§11 copies this **one-tile-per-token, labelled** idiom but each tile holds a REAL `.btn`/`.opt`/`.tf`/`.tile`/`.cite`/`.tab` instance (not a color swatch), demonstrating the shared gummy `:active` — e.g. one `pv-card` containing a `.pv-tiles`-style row where each cell is `<button class="btn">Begin, gently</button>`, `<button class="opt">Option</button>`, `<span class="cite">al-Ḥujurāt 49:15</span>`, etc. — real engine classes, no `pv-gummy` mock (per D-43/Pitfall 6).

---

### `preview.html` — §12 Motion vocabulary + reduced-motion

**In-repo analog — §5 Motion demos + replay wiring, `preview.html:592-618` (markup) + `831-840` (replay script):**
```html
<div class="pv-mcell">
  <span class="mtitle">Node pop-in</span>
  <div class="pv-popdot go" id="pv-pop"></div>
  <button class="pv-tinybtn" id="pv-pop-replay" type="button">Replay pop</button>
  <span class="easing">--dur-5 (350ms) · --ease-spring (gummy overshoot)</span>
</div>
```
```javascript
/* Node pop-in replay. */
var pop = document.getElementById('pv-pop');
var popReplay = document.getElementById('pv-pop-replay');
if (pop && popReplay) {
  popReplay.addEventListener('click', function () {
    pop.classList.remove('go');
    void pop.offsetWidth; /* force reflow so the animation restarts */
    pop.classList.add('go');
  });
}
```
§12 copies this **cell-with-replay-button-and-labelled-easing** idiom for each of the 5 vocabulary signatures, and additionally needs a `data-motion="reduce"` toggle button (new — no in-repo precedent, but follows the same classic-`addEventListener` idiom):
```javascript
var motionToggle = document.getElementById('pv-motion-toggle');
if (motionToggle) {
  motionToggle.addEventListener('click', function () {
    var reduced = document.documentElement.getAttribute('data-motion') === 'reduce';
    document.documentElement.setAttribute('data-motion', reduced ? 'system' : 'reduce');
    motionToggle.setAttribute('aria-pressed', String(!reduced));
  });
}
```
mirroring the `aria-pressed` toggle-button convention already used by the unit-switch segmented control (`preview.html:458-461,816-828`). This section also hosts the confetti + PERFECT/WAAPI exemplar, spatially separated from §10 per D-38/Mercy binding.

---

### `preview.html` — `<script src="shared/awba-engine.js">` addition

**Insertion point:** in `<head>`, immediately after the existing stylesheet link, following the load-order comment convention already established:
```html
<!-- One stylesheet, one link, every page (D-04). No Google-Fonts CDN link; no apple-mobile-web-app-capable. -->
<link rel="stylesheet" href="shared/awba-engine.css">
```
`preview.html:14-15`. Add `<script src="shared/awba-engine.js"></script>` right after this (page-relative, no leading slash, no `defer`/`async`/`type="module"` — matches the CLAUDE.md classic-script law and the existing font-preload `crossorigin` discipline at lines 10-13). This must load BEFORE the closing inline `<script>` block (`preview.html:800-852`) that will now also call `AW.icon`/`AW.cite`/`AW.sheet`.

---

### `scripts/tests/components.test.js` (new)

**In-repo analog — full test file, `scripts/tests/state-helpers.test.js:1-54`:**
```javascript
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { makeLS, loadEngine } = require('./ls-stub');
const { ymd } = require('./date-helpers');

function seedState(overrides) { ... }

test('touchDay: bumps returns and appends today when lastDay is yesterday', () => {
  const ls = makeLS({ awba_state: JSON.stringify(seedState({ returns: 3, lastDay: ymd(-1), days: [ymd(-1)] })) });
  const sandbox = loadEngine(
    ls,
    `const ret = AW.touchDay(); globalThis.__out = { ret, after: AW.state() };`
  );
  const out = sandbox.__out;
  assert.equal(out.ret, 4);
  ...
});
```

**Loader utility to reuse verbatim — `scripts/tests/ls-stub.js:45-52`:**
```javascript
function loadEngine(ls, probeSrc) {
  const enginePath = path.join(__dirname, '..', '..', 'shared', 'awba-engine.js');
  const engineSrc = fs.readFileSync(enginePath, 'utf8');
  const sandbox = { localStorage: ls, Date, Math, JSON, console };
  vm.createContext(sandbox);
  vm.runInContext(engineSrc + '\n' + (probeSrc || ''), sandbox, { filename: enginePath });
  return sandbox;
}
```
`components.test.js` uses this exact `loadEngine(ls, probeSrc)` + `globalThis.__out = {...}` concatenation trick (no separate `vm.runInContext` calls — `const AW = {}` is a lexical binding, not a context property, per the loader's own comment at `ls-stub.js:40-43`) to unit-test the pure string helpers:
```javascript
test('AW.icon: default injects aria-hidden + focusable=false', () => {
  const ls = makeLS({});
  const sandbox = loadEngine(ls, `globalThis.__out = AW.icon('mosque');`);
  assert.match(sandbox.__out, /aria-hidden="true"/);
  assert.match(sandbox.__out, /focusable="false"/);
});
test('AW.icon: label injects role=img + escaped aria-label', () => {
  const ls = makeLS({});
  const sandbox = loadEngine(ls, `globalThis.__out = AW.icon('mosque', { label: 'Unit 1' });`);
  assert.match(sandbox.__out, /role="img"/);
  assert.match(sandbox.__out, /aria-label="Unit 1"/);
});
test('AW.cite: preserves the validator-compatible <span class="cite" data-ref="…"> shape', () => {
  const ls = makeLS({});
  const sandbox = loadEngine(ls, `globalThis.__out = AW.cite('hujurat-49-15', 'al-Ḥujurāt 49:15');`);
  assert.match(sandbox.__out, /<span class="cite" data-ref="hujurat-49-15">/);
});
```
Since `AW.icon`/`AW.cite`/`escapeHtml` are pure string functions (no `document` touch), they can go straight on `globalThis.__out` without the `readOut()` JSON round-trip `ls-stub.js:62-64` documents as necessary only for object/array results across the vm realm boundary — a plain string return needs no round-trip.

---

## Shared Patterns

### Banner-section discipline (both engine files)
**Source:** `shared/awba-engine.js:1-25` (file-level header) + `shared/awba-engine.css:1-16` (file-level header)
**Apply to:** every insertion this phase makes — KIT/COMPONENTS in the .js file land exactly at their pre-declared placeholder comment blocks (lines 446-456); `@layer components`/`@layer motion` in the .css file replace their pre-declared single-line stubs (lines 305, 307) with multi-line content. Never add a new top-level section, never reorder STATE/KIT/COMPONENTS/RUNNERS, never touch the `@layer tokens, base, components, screens, motion;` name-list statement itself (only add content INSIDE `@layer components { }` / `@layer motion { }`).

### Token-only literals in component/motion rules
**Source:** `shared/awba-engine.css:191-303` (`@layer base`, the only prior example of rule-writing in this file) — every value is `var(--...)`, zero raw hex/px except where UI-SPEC explicitly calls out an "authored art literal" exception (gold-lantern SVG internals, per D-33/Pattern 3).
**Apply to:** all new `@layer components` and `@layer motion` rules. Grep gate: `! grep -qE 'cubic-bezier|linear\(' ` outside the tokens layer (no new easing literals — 03-RESEARCH.md Test Map, MOT-01/03 row).

### Classic-script, parse-time `AW`, zero build
**Source:** `shared/awba-engine.js:1-10` (file header) + `preview.html:800-852` (closing script IIFE)
**Apply to:** every new function in KIT/COMPONENTS (`const AW = {}` already exists at line 32 — new code is `AW.icon = function(...){...}`, never `export`/`import`); every new preview.html wiring script stays inside the existing closing `<script>` IIFE (or a clearly-scoped sibling IIFE), classic non-module, `getElementById`/`addEventListener`/`querySelector` only — matches the existing unit-switch (`preview.html:805-829`) and sheet-demo (`preview.html:842-850`) wiring exactly.

### `escapeAttr`/`escapeHtml` before any dynamic string reaches `innerHTML`
**Source:** 03-RESEARCH.md Pattern 2 (verified pattern, not yet in-repo) + `scripts/validate-content.js` header comment (lines 4-14) documenting the ENGINE-CONTRACT §6 "zero escaping" gap this phase must start closing for the parameters it controls (`AW.icon`'s `label`, `AW.cite`'s `label`).
**Apply to:** `AW.icon(name, {label})` and `AW.cite(id, label)` — both must escape the `label`/`id` value before concatenation, per the Security Domain section of 03-RESEARCH.md (V5 Input Validation / Output Encoding — the one applicable ASVS category this phase touches).

### `AW.reducedMotion()` — the single self-guard every JS-driven motion primitive calls
**Source:** synthesized from `shared/awba-engine.js:429-438` (existing `document.documentElement.getAttribute` read pattern) + `matchMedia` (native, no in-repo precedent yet)
**Apply to:** `AW.confetti` (first line, hard return) and `AW.animate` (sets `dur = 1` before calling `el.animate`) — both are JS motion and therefore snapshot at call time, never covered by the CSS `@layer motion` token-collapse (03-RESEARCH.md Pitfall/Critical-coupling note).

### Grep-gate convention (`! grep -q`, never `grep -c`)
**Source:** `scripts/check-glyph-coverage.py` (exit-code convention: `sys.exit(1 if failed else 0)`) and CLAUDE.md/CONTEXT.md's explicit Pitfall 7 callout.
**Apply to:** every verification step this phase's plans wire (icon count = 21, no per-page constants, no runtime `.replace(/#`, both reduced-motion triggers present, `animation: none` present, zero-CDN in preview) — always `! grep -q PATTERN file` (exits 0 when the anti-pattern is ABSENT), never `grep -c` (which exits 1 on zero matches and would spuriously fail a "must NOT contain" check).

---

## No Analog Found

| File/Section | Role | Data Flow | Reason |
|---------------|------|-----------|--------|
| `shared/awba-engine.css` `@layer motion` dual-trigger reduced-motion block | component styling (a11y) | CSS rule authoring | Genuinely new: no in-repo motion layer content exists yet, and Gen-3 has ZERO `prefers-reduced-motion` handling anywhere (03-RESEARCH.md State of the Art: "the single biggest a11y gap"). The verified technique in 03-RESEARCH.md Pattern 7 is the only source — treat it as spec, not analog. |
| `preview.html` §12 `data-motion="reduce"` toggle button | verification-vehicle markup + JS | event-driven | No prior preview.html section exposes a `data-motion`/`data-sound` toggle (Phase 2 only reads prefs at boot, never offers an in-page override UI). Build from the `aria-pressed` toggle-button convention (§2 unit-switch) as the nearest structural cousin, not a direct analog. |
| `AW.animate` WAAPI exemplar | component/utility (JS-orchestrated animation) | event-driven | First WAAPI usage anywhere in the Gen-4 codebase; Gen-3 used `setTimeout` chains instead (see `firePerfect`, EXTERNAL lines 137-138), which is the anti-pattern being replaced, not a pattern to copy. 03-RESEARCH.md Pattern 10 is the authoritative source. |

---

## Metadata

**Analog search scope:** `shared/` (both engine files, full read), `preview.html` (full read, 855 lines), `scripts/` + `scripts/tests/` (all test/tooling files), plus the EXTERNAL Gen-3 ground-truth pair `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/shared/awba-engine.{js,css}` (measured this session, cited with line numbers throughout).
**Files scanned:** 9 in-repo (2 engine files, preview.html, 5 scripts/test files, 1 python glyph checker) + 2 EXTERNAL Gen-3 files.
**Pattern extraction date:** 2026-07-12

