# Phase 3: Components, Icon Kit & Motion Language — Research

**Researched:** 2026-07-12
**Domain:** Vanilla inline-SVG icon registry · bottom-sheet component system · CSS `linear()` motion vocabulary + gummy press physics · dual-trigger reduced-motion. Zero-build, zero-CDN, classic-script `window.AW`.
**Confidence:** HIGH (this phase is grounded almost entirely in in-repo measurement + Gen-3 source, not external/training claims)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
**Icon registry (FND-04)**
- **D-31:** `AW.KIT` lives in the engine file's KIT banner section (D-22 single-file rule): one readable multi-line template literal per icon, each preceded by a one-line comment naming the icon — built from the canonical 20-SVG folder (`~/Downloads/AWBA APP/_ORGANIZED/03_Branding/icon files/`, 240×300 viewBox, blob-bg + brand-blue + sparkle motif), each svgo-optimized once via `npx svgo` (one-off CLI pass, output committed — never a build step). Gen-3's embedded 12-icon KIT and learn.html's duplicate UIC/IC_* constants are superseded — this registry is the ONLY icon source going forward.
- **D-32:** Public accessor `AW.icon(name, {size?, label?})` returns the inline SVG string with `aria-hidden="true" focusable="false"` injected by default; passing `label` instead emits `role="img"` + `aria-label` (forward-compat for ACC-02). Raw `AW.KIT.name` access stays available for legacy-shaped runner code, but every NEW call site uses `AW.icon()`.
- **D-33:** Gold lantern = **authored variant** committed as its own optimized SVG entry (`lantern-gold`), hand-recolored from 03-lantern.svg to the gold scale (`--gold`/`--gold2` values, night-register-safe) — NOT a runtime regex recolor. `AW.recolor()` is NOT ported. Small standalone glyphs Gen-3 used (flame, spark, check, star, cite, lamp, lock, chest, trophy + marker glyphs fact/remember/fard/angle) join the registry as a `GLYPHS` sub-map — single source, no per-page constants.
- **D-34:** Icons ship at author-time inside the engine JS (zero runtime fetch — offline/PWA-safe, classic-script-safe). No external sprite file.

**Sheet system (ENG-06)**
- **D-35:** ONE bottom-sheet primitive (`AW.sheet(contentHtml)` + scrim) in the COMPONENTS section — singleton (opening a sheet closes any open one), outside-tap/scrim-tap closes, close affordance in-sheet, slide-in via the motion vocabulary, `role="dialog"` + `aria-modal` basics now (full focus-trap/a11y hardening is Phase 6). Streak/noor/course-switcher sheets (Phase 5, LRN-06) MUST reuse this same primitive.
- **D-36:** Citation sheet built on D-35: ref pill + optional grade pill (hadith `kind`/`grade`), Arabic block ALWAYS `lang="ar" dir="rtl"` in the correct face (`.ayah`→Amiri Quran for Quran refs; general Amiri for hadith), verbatim translation, source line, and the `unverified · pending review` pill on EVERY citation (global pending state). Term gloss sheet: Arabic large, transliteration, gloss word, definition, context — field-for-field per ENGINE-CONTRACT §1.
- **D-37:** `AW.cite(id,label)` (already stubbed in the validator) ships for real in COMPONENTS: synchronous at parse time (D-23), returns `<span class="cite" data-ref="…">` markup identical to Gen-3. `AW.wire(root, cfg)` resolves `.cite[data-ref]`→cfg.refs and `.term[data-term]`→cfg.terms exactly as Gen-3.
- **D-38:** Demo content for sheets in preview.html = ONE citation + ONE term ported VERBATIM from Josh's `_MVP-BUILD/lessons/u1-m1.html` refs/terms dicts. Nothing celebratory renders over or around the scripture demo block.

**Motion vocabulary & press physics (MOT-01, MOT-03)**
- **D-39:** The `@layer motion` + `@layer components` layers of `shared/awba-engine.css` are filled now, consuming ONLY Phase-1 motion tokens (D-08 durations + `linear()` springs — no new easing literals outside the tokens layer). One vocabulary: press, pop-in (overshoot), sheet-in, fade/slide micro-transitions, breathing/bob ambient loops — each demo'd and labelled in preview.html.
- **D-40:** Gummy press physics (shadow-collapse + translateY on `:active`) applied via ONE shared class/mixin pattern to the FULL tappable inventory: `.btn`, `.opt`, `.tf`, `.tile`, citation chips, sheet rows, tabs, HUD stat chips, node circles (Phase 5 consumes). Token-defined depths (no literal px in component rules where a token exists).
- **D-41:** JS-orchestrated sequences (Phase 4 reward choreography) will use WAAPI `element.animate()` with the same token easing strings — Phase 3 establishes the pattern with one proven example (PERFECT overlay pop or combo chip entrance) so Phase 4 copies, not invents. Confetti = hand-rolled primitive (`AW.confetti(n)`, DOM-div based like Gen-3, ~Gen-3 counts) living in COMPONENTS with its reduced-motion guard built in from day one.

**Reduced motion (MOT-04)**
- **D-42:** One global quieting mechanism, defined once in the motion layer: `@media (prefers-reduced-motion: reduce)` AND `[data-motion="reduce"]` (the Phase-2 `awba_prefs` boot-stamp) share the same rule bodies — durations collapse to ~1ms, ambient loops (bob/glow/breathing) stop, confetti becomes a no-op (`AW.confetti` checks `matchMedia` OR the html attribute at call time), PERFECT overlay reduces to a simple fade. State-communicating transitions (press feedback, sheet appearing) shorten rather than vanish. preview.html demonstrates both trigger paths.

**Verification vehicle & gate**
- **D-43:** preview.html is EXTENDED (new sections: icon registry grid with all 20 + gold lantern + glyphs; sheet demos with live open/close; press-physics inventory row; motion vocabulary demos with reduced-motion toggle note). Showcase chrome stays in the unlayered preview `<style>` block; all real component CSS goes in the engine layers.
- **D-44:** Phase gate = human visual verify (like Phase 1's D-12). Automated prechecks first (icon count in KIT = 20 + variants, zero CDN, grep gates, tests still green). The `frontend-design` skill loads during execution of any visual plan; executor_hint `opus-visual` for the flagship visual work.

### Claude's Discretion
Exact svgo settings, KIT string formatting, sheet markup structure, demo copy (non-scripture), how the press-physics inventory is presented in preview.html, WAAPI example choice — within the locked decisions and Gen-3 warmth (cream, rounded, soft, gummy — elevated).

### Deferred Ideas (OUT OF SCOPE)
- Companion reaction states (V2-02) and legendary gold-dust shimmer (V2-06) — v2.
- Per-citation verified/pending state — stays with the scholar-gate workflow (global `unverified · pending review` string only for v1).
- Named shared-element morphs (V2-04) — v1 ships cross-fade only (Phase 5).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **FND-04** | One icon registry from the 20 canonical branded SVGs (inline, aria-hidden, single source, no per-page constants); gold lantern a properly authored variant, not a regex recolor | Icon Registry pattern + **id-collision audit (zero risk — see below)** + `AW.icon` safe-injection pattern + gold-lantern hex→token mapping table |
| **ENG-06** | Citation chips open a bottom sheet (Arabic RTL, verbatim translation, source line, grade pill for hadith, `unverified · pending review` pill); term glosses open their sheet | Sheet primitive pattern + `AW.cite`/`AW.wire` port (exact Gen-3 shapes measured) + Quran-vs-hadith face-split rule + verbatim demo refs/terms recorded byte-for-byte |
| **MOT-01** | One motion vocabulary (token durations + `linear()` springs) across nodes, buttons, sheets, quiz feedback, reward beats | Motion vocabulary pattern; exact Phase-1 token names/values listed; CSS-transition vs WAAPI split |
| **MOT-03** | Tap press physics (gummy shadow-collapse) on every tappable surface | Gummy-press shared pattern + full tappable inventory + depth-token open question |
| **MOT-04** | `prefers-reduced-motion` respected globally + user override in preferences | Dual-trigger reduced-motion architecture (token-collapse + `animation:none` for loops) — **verified caveat: collapsing duration does NOT stop infinite loops** |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

Actionable directives that bind every plan in this phase (treat with locked-decision authority):

- **Classic scripts only, zero CDN, zero npm deps at runtime.** `svgo` is a dev-only one-off pass; its output is committed static text. Nothing fetched at runtime.
- **Page-relative URLs** (never a leading `/`) — file:// double-click review is mandatory.
- **Amber never red** for learner states; **`--danger` reserved for safety callouts only.**
- **Nothing celebratory over scripture** — confetti/PERFECT/combo must never fire over the ayah/citation demo block (RWD-03 law; binds the preview demo layout too).
- **Scripture only ported verbatim** — the demo ref/term come from Josh's file byte-identical; never authored or regenerated.
- **Poppins stacks list Inter before system** (already in `--font-disp`; the sheet's Latin translation carries `˹ ˺` brackets that fall through Poppins→Inter).
- **Node test gotcha:** `node --test scripts/tests/*.test.js` (glob form only — directory form throws MODULE_NOT_FOUND on Node v24.13.0).
- **`localStorage` only inside the STATE section** of awba-engine.js (D-24 grep gate) — new COMPONENTS code reads prefs via `AW.prefs`, never `localStorage`.
- **GSD workflow enforcement:** file edits go through a GSD command; `! grep -q` in verify chains (`grep -c` exits 1 on zero).

## Summary

Phase 3 builds the shared visual/interaction layer three later phases consume, entirely from platform primitives already validated in Phase 1's token layer and Gen-3's shipped behavior. There is **no external stack to choose** — the "libraries" are native inline SVG, CSS `@layer` + custom properties + `linear()` easing, and WAAPI. Every technical question in this phase resolves against files already in the repo or in Josh's `_MVP-BUILD/`, so confidence is uniformly HIGH.

The single most important finding overturns the phase's headline risk. **The id-collision audit came back completely clean:** all 20 canonical SVGs are flat path/shape drawings — **zero `id` attributes, zero `url(#…)` references, zero `<defs>/<style>/<linearGradient>/<clipPath>/<mask>/<filter>`, identical `viewBox="0 0 240 300"`, no XML declaration/DOCTYPE**. The classic "duplicate ids collide when N SVGs are inlined on one page" bug **cannot occur here**, so `svgo`'s `prefixIds` and `cleanupIds` are unnecessary and `svgo` itself is *optional* (a byte-trim nicety, not a correctness requirement — the icons can be hand-authored into the KIT by stripping `xmlns`/`width`/`height` and collapsing whitespace). This de-risks FND-04 substantially and removes the only reason the plan would need `npx`.

Gen-3 is the behavior ground truth for `AW.cite`/`AW.wire`/sheet/confetti and its exact markup shapes were measured and are reproduced below. Gen-4's job is to **elevate**, not redesign: port the shapes, re-point them at Gen-4 semantic tokens, split the sheet's Arabic face by Quran-vs-hadith (D-36), add the reduced-motion guards Gen-3 entirely lacked, and inject icon a11y semantics Gen-3 entirely lacked.

**Primary recommendation:** Author the KIT + `GLYPHS` from the 20 flat SVGs (strip `xmlns`/`width`/`height`, keep `viewBox`; `svgo` optional). Build `AW.icon` as a first-`<svg>`-insertion string helper with an escaped `label` path. Port Gen-3's sheet/cite/wire/confetti verbatim in shape, re-tokenized, adding: Quran/hadith face-split, a singleton lazy-created scrim, a call-time reduced-motion guard on confetti+WAAPI, and a **dual-trigger reduced-motion block that collapses `--dur-*` tokens once AND sets `animation:none` on the enumerated ambient loops** (duration-collapse alone does not stop an infinite loop — verified).

## Architectural Responsibility Map

Single-tier static client app (no server, no API, no DB — device-local by design). "Tiers" here are the engine's banner sections + CSS layers that own each capability.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Icon art + gold lantern variant + glyphs | `KIT` section (awba-engine.js) | `@layer components` (sizing box CSS) | D-31/D-34: author-time inline strings; CSS only sets the display box |
| `AW.icon()` accessor (a11y injection) | `COMPONENTS` section | — | Pure string transform over KIT; DOM-free, parse-time-safe |
| `AW.cite()` chip markup | `COMPONENTS` section | — | D-37: synchronous string return, called at parse time inside cfg concatenation |
| `AW.wire()` event binding | `COMPONENTS` section | — | Runs after render on a DOM root; the only cite/term code that touches the DOM |
| Sheet primitive + citation/term sheets | `COMPONENTS` section | `@layer components` (chrome) + `@layer motion` (slide-in) | D-35/D-36 |
| Confetti primitive | `COMPONENTS` section | `@layer motion` (`@keyframes fall`) | D-41: JS spawns divs; CSS animates; JS holds the reduced-motion guard |
| Press physics + component chrome | `@layer components` | tokens (depths/shadows) | D-40: CSS-only `:active` |
| Motion vocabulary (transitions, entrances, loops) | `@layer motion` | tokens (durations/easings) | D-39 |
| Reduced-motion quieting | `@layer motion` | `AW.prefs` boot-stamp (Phase 2, already live) | D-42: CSS handles CSS motion; JS motion self-guards |
| WAAPI orchestration exemplar | `COMPONENTS` section (one helper) | tokens (via getComputedStyle) | D-41: pattern only, Phase 4 copies |

## Standard Stack

**There are no packages to install for the running site.** Everything is native platform + committed static text.

### Core (native platform — already verified available in Phase 1 / STACK.md)
| Capability | Mechanism | Purpose | Why Standard |
|------------|-----------|---------|--------------|
| Inline SVG | HTML-embedded `<svg>` strings in JS | Icon registry, no fetch | Offline/PWA-safe, classic-script-safe (D-34) `[VERIFIED: measured — 20 files are flat, inline-ready]` |
| CSS `@layer` + custom properties | already declared `@layer tokens,base,components,screens,motion` | Component chrome + motion, correct cascade priority | Motion layer last = reduced-motion guard wins (in-file header) `[VERIFIED: shared/awba-engine.css:16]` |
| CSS `linear()` easing | `--ease-spring`, `--ease-gentle` tokens (already in file) | Spring/overshoot without a JS physics lib | Safari 17.2+/Chrome 113+ Baseline `[CITED: STACK.md version table — verified vs caniuse/MDN]` |
| CSS transitions | `transition: … var(--dur-x) var(--ease-x)` | Press, hover, state changes | Compositor-friendly, token-driven `[CITED: STACK.md]` |
| WAAPI `element.animate()` + `.finished` | reads easing string via `getComputedStyle` | JS-orchestrated sequences (Phase 4 pattern) | Universal in target browsers; Promise sequencing `[CITED: STACK.md]` |
| DOM-div confetti | hand-rolled, `@keyframes fall` (translate+rotate) | PERFECT burst | Narrow need, no lib; Gen-3 shape proven `[VERIFIED: Gen-3 engine.js:82-87]` |

### Supporting (dev-only, one-off — NOT a runtime dependency)
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| `svgo` | latest (`npx svgo`) | Trim SVG whitespace/precision, strip `xmlns`/dimensions | **Optional.** The id-collision reason for needing it does not exist here. Use only if the byte-trim is wanted; otherwise hand-author. `[VERIFIED: npm registry — github.com/svg/svgo, but see Package Legitimacy Audit]` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-rolled DOM-div confetti | `canvas-confetti` vendored | STACK.md: only if richer effects wanted; D-41 locks hand-rolled |
| Native `linear()` + WAAPI | GSAP / Motion One / anime.js | STACK.md "What NOT to Use": 20-70KB for capabilities not needed; forbidden by CLAUDE.md zero-dep |
| `svgo` one-off | hand-author (strip 3 attrs, keep `viewBox`) | Given the clean SVGs, hand-authoring avoids `npx` entirely and is fully reviewable — **recommended if avoiding any package fetch** |
| Runtime regex recolor (Gen-3 `LANTERNG`) | — | D-33 forbids; authored `lantern-gold` variant instead |

**Installation:** none for the site. If `svgo` used: `npx svgo` (one-off, offline-verifiable) — but see the audit below before running.

**Version verification:** No runtime packages to verify. `node` (v24.13.0) confirmed present via existing test suite. `svgo` NOT currently on PATH (`command -v svgo` → not found).

## Package Legitimacy Audit

Only one external package is even touchable this phase, and only as optional dev tooling that produces committed static text (no manifest entry, no runtime import, not shipped).

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `svgo` | npm | ~8 yrs, ubiquitous | tens of M/wk | github.com/svg/svgo | not run (unavailable) | **Optional — planner may drop entirely** |

**Packages removed due to slopcheck [SLOP] verdict:** none.
**Packages flagged as suspicious [SUS]:** none.

`svgo` is a real, long-established, high-trust tool, but per CLAUDE.md ("Do NOT use `npx --yes` to auto-download") and the clean-SVG finding, tag it **[ASSUMED]** and recommend the planner **either** (a) hand-author the KIT (no package at all — preferred, given zero collision risk), **or** (b) gate `npx svgo` behind a `checkpoint:human-verify` task. Do not wire `svgo` into any build step (D-31).

## Architecture Patterns

### System Architecture Diagram

```
                          shared/awba-engine.js  (ONE classic script, parse-time window.AW)
                          ┌──────────────────────────────────────────────────────────┐
  author-time SVG text ──►│ KIT: AW.KIT{20 scenes} · AW.KIT['lantern-gold'] ·         │
  (20 flat files + gold)  │      GLYPHS{flame,spark,check,star,cite,lamp,lock,chest,   │
                          │             trophy, fact,remember,fard,angle}             │
                          │                          │                                 │
                          │         AW.icon(name,{size,label}) ── injects a11y ──►      │──► inline <svg> string
                          │                          │                                 │       (aria-hidden OR role=img)
                          │ COMPONENTS:              ▼                                  │
   cfg.refs / cfg.terms ─►│  AW.cite(id,label) ─► '<span class="cite" data-ref=id>'    │──► parse-time string (D-23)
   (Josh data files)      │                                                            │
        rendered DOM ────►│  AW.wire(root,cfg) ─► binds .cite→sheetRef .term→sheetTerm │
                          │                          │                                 │
                          │  AW.sheet(html) ─── singleton scrim+sheet (lazy, on body) ─┼──► role=dialog, slide-in
                          │     ├─ sheetRef(r)  Quran→.ayah / hadith→Amiri + grade pill │      (motion vocabulary)
                          │     └─ sheetTerm(t) Arabic·tl·word·def·ctx                  │
                          │                          │                                 │
                          │  AW.confetti(n) ── call-time reduced-motion guard ─────────┼──► DOM divs, @keyframes fall
                          │  AW.animate(...) WAAPI exemplar, easing via getComputedStyle│
                          └──────────────────────────────────────────────────────────┘
                                                     │ consumes tokens
                          shared/awba-engine.css     ▼
                          @layer components  ── .btn/.opt/.tf/.tile/.cite/.sheet chrome + GUMMY PRESS (:active)
                          @layer motion      ── @keyframes {fall,bob,breathe,popIn,sheetIn} + transitions
                                                REDUCED MOTION (two triggers, shared body):
                                                  @media (prefers-reduced-motion:reduce)  ─┐ collapse --dur-* to 1ms
                                                  [data-motion="reduce"] (Phase-2 stamp) ──┘ + animation:none on loops
```

**Data-flow trace (citation, the ENG-06 primary case):** Josh's data file calls `AW.cite('muslim-8','Ṣaḥīḥ Muslim 8')` *inside* a cfg string at parse time → returns `<span class="cite" data-ref="muslim-8">{cite glyph}Ṣaḥīḥ Muslim 8</span>` → runner injects cfg HTML into the stage → `AW.wire(root,cfg)` attaches a click handler → tap calls `AW.sheetRef(cfg.refs,'muslim-8')` → because `grade` is present, renders the hadith face (general Amiri, grade pill "Sahih") + the always-on `unverified · pending review` pill → `AW.sheet` opens the singleton scrim with the motion-vocabulary slide-in.

### Engine-file growth estimate (D-31 asks)
Gen-3 was **464 lines total** (its 12-icon KIT was one minified line). Gen-4 current `awba-engine.js` = **457 lines (STATE only)**. Adding:
- **KIT** — 20 scenes as *readable multi-line* template literals (~9 shapes/icon avg) + `lantern-gold` (~14 lines) + ~14 GLYPHS (~1 line each) ≈ **~280–340 lines**.
- **COMPONENTS** — `AW.icon` (~25) + `escapeHtml` (~5) + `AW.cite` (~4) + `AW.wire` (~8) + `AW.sheet` singleton (~45) + `sheetRef` (~30) + `sheetTerm` (~20) + `AW.confetti` (~28) + WAAPI `AW.animate` exemplar (~18) ≈ **~180–230 lines**.
- **Net:** `awba-engine.js` ≈ **~950–1,050 lines**; raw optimized SVG payload ≈ **~20–24KB** (20 files sum to **28,896 bytes** on disk incl. indentation/`xmlns`; stripping those + `svgo` trims ~25–35%). One file, never split (D-22). Fully acceptable.

### Pattern 1: Icon registry from flat SVGs
**What:** `AW.KIT` maps a short name → an inline `<svg>` string. Source files are already inline-ready.
**Authoring transform (per file, deterministic):**
1. Strip the root `xmlns="http://www.w3.org/2000/svg"` (not needed for SVG-in-HTML), `width="240"`, `height="300"` — **keep `viewBox="0 0 240 300"`** so CSS controls size without distorting the 240:300 (0.8) portrait aspect. (Gen-3's KIT strings already have no width/height — confirmed.)
2. Collapse leading whitespace; store as a backtick template literal (D-31) — backticks avoid the `\"` escaping Gen-3 needed.
3. Name it (e.g. `01-mosque.svg` → `mosque`, `16-qibla-compass.svg` → `compass`). Preserve Gen-3's `AW.UNIT_ICON` mapping semantics (u1→compass, u2→lanterns, u3→kaaba, u4→mosque) so runner defaults still resolve.
**Why svgo is optional here:** the audit (below) found no ids/defs/gradients — nothing that requires namespacing.
**Example (measured source, ready to author):**
```
// 05-crescent-star — crescent + star, blob bg
crescent: `<svg viewBox="0 0 240 300" fill="none"><path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="#C9D7F5"></path>…</svg>`,
```

### Pattern 2: `AW.icon(name,{size,label})` — safe a11y injection into an SVG string
**What:** insert attributes immediately after the first `<svg`. All KIT strings start with `<svg` → single, predictable insertion point.
```js
function escapeAttr(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
AW.icon = function(name, opts){
  opts = opts || {};
  var raw = (AW.KIT && AW.KIT[name]) || (AW.GLYPHS && AW.GLYPHS[name]) || '';
  if (raw.indexOf('<svg') !== 0) return '';                     // missing/malformed → empty, never throw
  var a = opts.label
    ? 'role="img" aria-label="' + escapeAttr(opts.label) + '"'  // ACC-02 forward-compat path
    : 'aria-hidden="true" focusable="false"';                   // default: decorative
  if (opts.size) a += ' style="width:' + escapeAttr(opts.size) + ';height:auto"'; // viewBox keeps aspect
  return raw.replace('<svg', '<svg ' + a);                      // String.replace(str,…) = first match only
};
```
**Edge cases handled:** (1) `String.prototype.replace` with a *string* first arg replaces only the first occurrence — no risk of hitting a nested `<svg>`; (2) missing icon returns `''` not `undefined`; (3) `label` is escaped (closes the ENGINE-CONTRACT §6 innerHTML no-escaping gap for this param); (4) 240×300 scenes: apply `width` + `height:auto` (viewBox preserves aspect) rather than forcing a square — square GLYPHS (24×24) accept a square size. **Discretion (D-32):** whether `size` sets attrs vs inline style vs a wrapper `.kit-ill` box is designer's call; the safe-injection core is the load-bearing part.

### Pattern 3: Gold lantern authored variant (D-33)
**Source:** `03-lantern.svg` (= Gen-3 `AW.KIT.lantern`). Measured hexes and their roles:

| Source hex | Count | Role in lantern | → Gen-4 gold token | Value |
|------------|-------|-----------------|--------------------|-------|
| `#2536CE` | 7 | hoop, hanger line, top cap, inner flame, base knob, 2 sparkles | `--gold-deep` | `#B47F00` |
| `#2E6BF5` | 3 | cap plate, body, base foot | `--gold` | `#E8A400` |
| `#EAF0FE` | 1 | inner light panel (behind glass) | warm light (authored literal) | `#FFF3CC` |
| `#C9D7F5` | 1 | blob background halo | warm gold halo (authored literal) | see night note |

**Two firm token mappings** (load-bearing): `#2E6BF5→--gold #E8A400`, `#2536CE→--gold-deep #B47F00`. The inner-light panel and blob are **authored-illustration literals** — permitted because they are art-asset internals, not `@layer components` rules (the "no literal hex in components" law binds CSS component rules, not SVG art strings). Gen-3's proven recolor targets (`#EAF0FE→#FFF3CC`, blob→a dark warm) are a good starting point.

**Night-register contrast (why D-33 says "night-register-safe"):** `lantern-gold` renders primarily on the `.gold-bg` night gradient (legendary intro/result — Gen-3 uses `LANTERNG` exactly there). Against `#241A05→#3A2A08`, `--gold-deep #B47F00` structural lines risk being too dark. Mirror the Phase-1 decision (focus ring switches to `--gold2` under `[data-register="night"]`): author the brightest structural highlights with `--gold2 #FFD34D` so the lantern holds contrast on the dark field, using `--gold`/`--gold-deep` only for interior depth. Author it *against the dark register* (its real home). Exact tuning = designer's eye (D-33/D-41 discretion) — but the *primary display context is the night gradient*, and that must be stated to whoever authors it.

### Pattern 4: Sheet primitive (D-35) — singleton, lazy, decoupled from the lesson skeleton
Gen-3's scrim/sheet only exists because `AW.skeleton()` injects `<div class="scrim" id="scrim"><div class="sheet" id="sheet">`. Phase 3's primitive must stand alone (preview.html and the Phase-5 learn page have no lesson skeleton).
```js
AW.sheet = (function(){
  var scrim, sheet, invoker;
  function ensure(){
    if (scrim) return;
    scrim = document.createElement('div'); scrim.className = 'scrim';
    sheet = document.createElement('div'); sheet.className = 'sheet';
    sheet.setAttribute('role','dialog'); sheet.setAttribute('aria-modal','true');
    scrim.appendChild(sheet); document.body.appendChild(scrim);
    scrim.addEventListener('click', function(e){ if(e.target===scrim) api.close(); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') api.close(); });
  }
  var api = {
    open: function(html){
      ensure();
      invoker = document.activeElement;            // Phase-6 hook: restore focus on close
      sheet.innerHTML = '<button class="sheet-x" aria-label="Close">×</button>' + html; // in-sheet close affordance (D-35)
      sheet.querySelector('.sheet-x').addEventListener('click', api.close);
      scrim.classList.add('open');                 // singleton: one element ⇒ opening replaces any open content
      document.documentElement.classList.add('sheet-lock'); // scroll-lock (see pitfall)
    },
    close: function(){
      if (!scrim) return;
      scrim.classList.remove('open');
      document.documentElement.classList.remove('sheet-lock');
      if (invoker && invoker.focus) invoker.focus(); // Phase-6-ready focus restore
    }
  };
  return function(html){ api.open(html); return api; }; // AW.sheet(html); AW.sheet.close via returned api or a exposed AW.sheetClose
})();
```
**Singleton** is automatic: one scrim element, `open` replaces content. **What to leave for Phase 6 without over-building now:** `role=dialog`/`aria-modal` present; `invoker` captured for focus restore; `close()` idempotent; Escape wired. **Do NOT build** the focus-trap, `inert`/`aria-hidden` on background, or full iOS position-fixed lock — D-35 defers those. Leave the structure (scrim wraps sheet) so a trap can wrap `sheet` later.
**Scroll-lock over file://:** `.sheet-lock{overflow:hidden}` on `<html>` behaves identically on file:// and http — no special handling. `.app-stage` already sets `overscroll-behavior:contain` (Phase 1), which mitigates iOS rubber-band bleed. Full iOS touch-scroll lock (position:fixed body + scroll restore) is Phase-6 hardening, not now.

### Pattern 5: `AW.cite` / `AW.wire` port (D-37) — exact shapes measured
Gen-3 (behavior ground truth):
```js
AW.cite=function(id,label){return '<span class="cite" data-ref="'+id+'">'+AW.CITE+label+'</span>';};
AW.wire=function(root,cfg){
 root.querySelectorAll('.cite[data-ref]').forEach(function(el){el.addEventListener('click',function(){AW.sheetRef(cfg.refs||{},el.dataset.ref);});});
 root.querySelectorAll('.term[data-term]').forEach(function(el){el.addEventListener('click',function(){AW.sheetTerm(cfg.terms||{},el.dataset.term);});});
};
```
**Gen-4 must keep the `<span class="cite" data-ref="ID">…label…</span>` shape** because (a) it's called at parse time inside cfg concatenation (u1-m1.html lines 27, 43 do `+AW.cite('hujurat-49-15','al-Ḥujurāt 49:15')+`) so it must be defined synchronously, DOM-free, string-only; and (b) the **Phase-2 validator stub is `'<span class="cite" data-ref="'+id+'">'+(label||'')+'</span>'`** and extracts ids via `/data-ref=["']([^"']+)["']/g` — the real `AW.cite` may add the cite glyph before the label but MUST preserve that span shape or the validator (and Phase-4 port gate) breaks. Recommended Gen-4:
```js
AW.cite = function(id,label){ return '<span class="cite" data-ref="'+id+'">'+AW.icon('cite')+escapeHtml(label==null?'':label)+'</span>'; };
```

### Pattern 6: Citation-sheet face split (D-36) — the one real elevation over Gen-3
Gen-3 rendered ALL citation Arabic in general Amiri (`--naskh`, 21px). Gen-4 must split by ref shape:
- **Quran ref** (`grade` absent, `kind` absent/"The verse") → Arabic block gets `class="ayah"` → `--font-quran` (Amiri Quran) + `--fs-ayah`. No grade pill.
- **Hadith ref** (`grade` present, `kind:"The hadith"`) → Arabic block `lang="ar" dir="rtl"` general → `--font-ar` (Amiri) + `--fs-ar-body`. Render the grade pill.
- **Both:** `dir="rtl" lang="ar"`; source line; **`unverified · pending review` pill ALWAYS** (global pending state — per-citation verified state deferred).

Gen-3 → Gen-4 token translation for porting the sheet CSS (Gen-3 names are dead in Gen-4):

| Gen-3 | Gen-4 | Note |
|-------|-------|------|
| `--blue2` (r-src, r-ar color) | `--accent-deep` | |
| `--blue` (g-ar color) | `--accent` | |
| `--blue3` (r-pill border) | `--accent-line` | |
| `--naskh` | `--font-ar` **or** `.ayah`→`--font-quran` | face-split per D-36 |
| `--disp` | `--font-disp` | |
| literal `21px`/`32px`/`15.5px`… | `--fs-ar-body` / `--fs-ar-display` / `--fs-ayah` / `--fs-body` / `--fs-ui` / `--fs-kicker` | tokens, no literals |
| `--paper`,`--line2`,`--ink*`,`--green-line`,`--green-ink` | same (all exist in Gen-4) | |

Term-gloss sheet fields (unchanged from Gen-3, tokenized): `g-ar` (Arabic large → `--font-ar`/`--fs-ar-display`) · `g-tl` (transliteration) · `g-wd` (gloss word → `--font-disp`) · `g-df` (definition) · `g-cx` (context).

### Pattern 7: Motion vocabulary + the dual-trigger reduced-motion block (D-39/D-42)
**Exact Phase-1 motion tokens available to consume (measured, `shared/awba-engine.css:138-150`):**
```
--dur-1: 80ms   (instant feedback)      --dur-4: 280ms (sheet/scrim in-out)
--dur-2: 120ms  (press/tap collapse)    --dur-5: 350ms (accordion, node pop-in)
--dur-3: 200ms  (hover/small state)     --dur-6: 600ms (reward reveal step)
--dur-amb: 4800ms (ambient bob/glow loop)
--ease-standard: cubic-bezier(.2,.8,.2,1)     --ease-out: cubic-bezier(.16,1,.3,1)
--ease-in: cubic-bezier(.5,0,.75,0)           --ease-press: cubic-bezier(.2,1.4,.5,1)
--ease-spring: linear(0, 0.006, 0.025 2.8%, … 1)   (overshoot spring — verbatim, never hand-edit)
--ease-gentle: linear(0, 0.19 12%, … 1)            (soft settle)
```
One vocabulary maps signature → tokens: **press** (`--dur-2`/`--ease-press`), **pop-in overshoot** (`--dur-5`/`--ease-spring`), **sheet-in** (`--dur-4`/`--ease-gentle`), **fade/slide micro** (`--dur-3`/`--ease-standard`), **ambient bob/glow/breathe** (`--dur-amb`/`--ease-gentle`, `infinite`).

**Reduced-motion — the verified technique and its limit:**
```css
@layer motion {
  /* … keyframes + transitions that reference var(--dur-*) … */

  /* ONE quieting, TWO triggers, shared bodies. */
  @media (prefers-reduced-motion: reduce) {
    :root { --dur-1:1ms; --dur-2:1ms; --dur-3:1ms; --dur-4:1ms; --dur-5:1ms; --dur-6:1ms; }
    .companion, .breathing-ring, [data-ambient] { animation: none !important; }
  }
  [data-motion="reduce"] { --dur-1:1ms; --dur-2:1ms; --dur-3:1ms; --dur-4:1ms; --dur-5:1ms; --dur-6:1ms; }
  [data-motion="reduce"] .companion,
  [data-motion="reduce"] .breathing-ring,
  [data-motion="reduce"] [data-ambient] { animation: none !important; }
}
```
**Why this is DRY and correct:** collapsing the `--dur-*` tokens instantly quiets **every** CSS `transition` and **every finite entrance `@keyframes`** whose `animation-duration`/`transition-duration` references a token — each component rule is written **once** and inherits the collapse. Because `@layer motion` is the **last-declared, highest-priority layer**, these custom-property overrides beat the `@layer tokens` defaults (the file header calls this out as an intentional a11y-safety property of the layer order). State-communicating motion (press, sheet-in) thus *shortens*, not vanishes (D-42).

**Where token-collapse does NOT work (verified):** setting an **infinite** loop's `animation-duration` to ~1ms does **not** stop it — it spins the loop at ~1ms period (visually worse/flicker). Infinitely looping motion is exactly the vestibular-trigger case, so it must be **`animation: none`**, not collapsed. Hence the enumerated ambient list gets `animation:none !important` under **both** triggers. `--dur-amb` is intentionally *not* collapsed (pointless — the loop is stopped outright). `[CITED: MDN prefers-reduced-motion / css-tricks — confirmed via search]`

**Critical coupling for JS motion:** the CSS token-collapse only governs CSS motion. **WAAPI and confetti snapshot values at call time via `getComputedStyle`/`matchMedia` and will NOT see the collapse** — so they carry their **own** runtime reduced-motion guard (D-42 already mandates this for confetti; the WAAPI exemplar must model it too).

### Pattern 8: Gummy press physics (D-40)
Gen-3 (measured, `awba-engine.css` buttons): rest `box-shadow: 0 5px 0 {darker}`; `:active { box-shadow: 0 2px 0 {darker}; transform: translateY(3px); }`. Gen-4 applies ONE shared rule to the full tappable inventory: `.btn, .opt, .tf, .tile, .cite, .sheet-row, .tab, .hstat, .node` (Phase 5 consumes `.node`). Use `--accent-deep` for the hard-shadow color and `transition: transform var(--dur-2) var(--ease-press), box-shadow var(--dur-2) var(--ease-press)`.
**Depth tokens — see Open Question 1:** the rest `5px` / active `2px` (=`--sp-2`) / translate `3px` are not all tokenized. Recommend adding `--press-rest`/`--press-active` depth tokens (or a `--gummy` pair) rather than literal px, to honor D-40's "no literal px where a token exists."

### Pattern 9: Confetti (D-41) — hand-rolled with a day-one guard
Gen-3 shape (measured): appends `n` `.cf` divs to a `#confetti` layer, random `left`, color from a 6-hex palette, `animationDuration` 1.6–2.7s, self-removes after. `@keyframes fall { to { transform: translateY(840px) rotate(720deg); opacity:.3 } }` (transform-only ⇒ compositor-friendly). Gen-4:
- **Decouple the layer:** don't depend on `skeleton()`'s `#confetti`; lazily create/find one fixed overlay on `body` (like `AW.sheet`) so it works standalone.
- **Call-time guard (mandatory):** `if (AW.reducedMotion()) return;` where `AW.reducedMotion()` = `matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.getAttribute('data-motion')==='reduce'`.
- **Performance bound:** cap `n` (~Gen-3's 16–30), transform-only animation, remove nodes on end. Never fire over scripture (caller responsibility per RWD-03; the demo must not place confetti near the ayah block).

### Pattern 10: WAAPI exemplar (D-41) — the one proven example Phase 4 copies
```js
AW.reducedMotion = function(){
  return (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)
      || document.documentElement.getAttribute('data-motion') === 'reduce';
};
AW.animate = function(el, keyframes, durToken, easeToken){
  var cs = getComputedStyle(document.documentElement);
  var dur  = parseFloat(cs.getPropertyValue(durToken)) || 300;   // "600ms" → 600 (ms number)
  var ease = cs.getPropertyValue(easeToken).trim() || 'ease';    // linear(...) string is a valid WAAPI easing
  if (AW.reducedMotion()) dur = 1;                               // JS must self-guard (snapshots, won't see CSS collapse)
  return el.animate(keyframes, { duration: dur, easing: ease, fill: 'both' }); // .finished is awaitable
};
// e.g. combo-chip entrance: AW.animate(chip,[{transform:'scale(.8)',opacity:0},{transform:'scale(1)',opacity:1}],'--dur-5','--ease-spring')
```
**Caveats:** tokens are in **ms** (`parseFloat("600ms")→600`, correct); a seconds token would misread — our tokens are ms throughout. `linear(...)` strings pass straight through as the WAAPI `easing` value (same grammar as CSS). `[CITED: STACK.md — WAAPI + linear() is the locked orchestration pattern]`

### Recommended engine-file section layout (unchanged banners, D-22)
```
awba-engine.js
├── STATE       (live — untouched this phase)
├── KIT         ← AW.KIT{20 scenes + 'lantern-gold'} · AW.GLYPHS{…} · AW.UNIT_ICON
└── COMPONENTS  ← escapeHtml · AW.icon · AW.cite · AW.wire · AW.sheet(+sheetRef,sheetTerm) · AW.confetti · AW.reducedMotion · AW.animate
   RUNNERS      (placeholder — Phase 4)
```
```
awba-engine.css
├── @layer components  ← .btn/.opt/.tf/.tile/.cite/.sheet/.scrim/.marker chrome + GUMMY PRESS
└── @layer motion      ← @keyframes {fall,bob,breathe,popIn,sheetIn} + transitions + DUAL-TRIGGER reduced-motion block
```

### preview.html extension (D-43)
**Structural finding:** preview.html has 8 sections (1 Color … 8 Zero-CDN); its motion Section 5 currently uses **preview-only mock** classes (`pv-gummy`, `pv-popdot`, `pv-scrim/pv-sheet`) defined in the unlayered `<style>` block, and the page **does NOT load `shared/awba-engine.js`** (only the CSS + a small inline preview script). To demo **real** components (live `AW.sheet`, `AW.cite`/`AW.wire`, `AW.confetti`, `AW.icon`), Phase 3 **must add `<script src="shared/awba-engine.js"></script>`** to preview.html. New sections (9+) should render REAL engine output (D-43: "all real component CSS goes in the engine layers"), reserving `pv-` chrome only for layout scaffolding:
- **§9 Icon registry grid** — all 20 via `AW.icon(name)` + `lantern-gold` + the GLYPHS row (brand moment, not an asset dump — D-43/specifics).
- **§10 Sheet demos** — a real citation chip (`AW.cite`+`AW.wire`) opening the citation sheet, and a term chip opening the gloss sheet, using the **verbatim demo content below**. Nothing celebratory near this block (D-38 law).
- **§11 Press-physics inventory** — a row of `.btn/.opt/.tf/.tile/.cite/.tab` all sharing the gummy `:active`.
- **§12 Motion vocabulary** — each signature labelled with its token; a note/toggle showing both reduced-motion triggers (OS setting AND `data-motion="reduce"` on `<html>`).
Section 5's mocks may be retrofitted to real classes or left as-is and superseded by §11–12 — planner's call (Open Question 3).

### Anti-Patterns to Avoid
- **Re-mocking components in preview `<style>`** instead of demoing the real engine output — defeats D-43's "living reference of the real thing."
- **Collapsing `--dur-amb` to stop the companion bob** — does not stop an infinite loop; use `animation:none`.
- **Relying on the CSS token-collapse to quiet confetti/WAAPI** — JS snapshots values; it must self-guard.
- **Regex-recoloring the gold lantern at runtime** (Gen-3 `LANTERNG`) — D-33 forbids; author the variant.
- **Rendering all citation Arabic in one face** — Quran must use `.ayah`/Amiri Quran (D-36 / ASSETS.md Arabic law: `.ayah` is Qur'an-only).
- **`svgo` with `prefixIds` "to be safe"** — no ids exist; it only adds noise.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Spring/overshoot easing | A JS spring physics loop | `--ease-spring` / `--ease-gentle` `linear()` tokens (already in file) | Baked at design time; zero runtime cost (STACK.md) |
| Sequenced reward animation | `setTimeout` chains | WAAPI `element.animate()` + `await .finished` (Pattern 10) | Compositor-run, cancellable, no timing guesswork |
| Icon a11y name plumbing | Per-call ad-hoc aria attrs | `AW.icon(name,{label})` single accessor (D-32) | One code path; `aria-hidden` default, `role=img` opt-in |
| SVG id de-duplication | A prefixing scheme | **Nothing — audit found zero ids** | The bug doesn't exist in this set |
| Multiple sheet implementations | Per-feature scrim/sheet markup (Gen-3 duplicated the streak sheet twice) | ONE `AW.sheet` singleton (D-35) reused by Phase 5 | Kills the ENGINE-CONTRACT §6 "streak-sheet HTML ×2" debt structurally |
| Reduced-motion per-rule overrides | An `animation:none` on every animated rule | Token-collapse once + `animation:none` on the *enumerated loops* only | DRY; one place governs all transitions/entrances |

**Key insight:** In this phase, "don't hand-roll" mostly means *don't re-solve problems Phase 1's token layer and Gen-3's shipped shapes already solved* — the value is disciplined reuse + the two genuine elevations (icon a11y, dual-trigger reduced-motion) that Gen-3 lacked entirely.

## Common Pitfalls

### Pitfall 1: Assuming the icon set needs id-namespacing
**What goes wrong:** planning an `svgo prefixIds` pass / worrying about `url(#gradient)` collisions across 20 inlined SVGs.
**Why it happens:** it's the classic multi-inline-SVG bug — but it's asset-specific.
**How to avoid:** the audit is done — **0 ids, 0 `url(#…)`, 0 defs/gradients across all 20.** Treat `svgo` as an optional byte-trim only.
**Warning signs:** any plan task mentioning `prefixIds`, `cleanupIds`, or "namespace the gradient ids" — delete it.

### Pitfall 2: `data-motion="reduce"` only fires for the *user override*, not the OS setting
**What goes wrong:** binding reduced-motion to only `[data-motion="reduce"]` misses users who set OS reduce-motion but never toggled the in-app pref.
**Why:** Phase-2 boot code stamps `data-motion="reduce"` **only when `AW.prefs.motion==='reduce'`** (confirmed, `awba-engine.js:432`) — it does NOT stamp it for the OS setting.
**How to avoid:** the CSS block must carry **both** `@media (prefers-reduced-motion: reduce)` **and** `[data-motion="reduce"]`; JS guards must check **both** `matchMedia(...)` **and** the attribute (D-42, Pattern 7/10).

### Pitfall 3: Collapsing duration to stop the companion loop
**What goes wrong:** `--dur-amb:1ms` makes the bob loop cycle every 1ms — a seizure risk, the opposite of the goal.
**How to avoid:** `animation:none` on the enumerated ambient loops. (Verified — see Pattern 7.)

### Pitfall 4: Breaking the parse-time `AW.cite` contract
**What goes wrong:** making `AW.cite` async, DOM-touching, or changing the `<span class="cite" data-ref=…>` shape → Josh's data files (which call it inside cfg string concatenation) throw, and the Phase-2 validator's `data-ref` regex stops matching.
**How to avoid:** `AW.cite` stays synchronous, string-only, DOM-free, defined in COMPONENTS at parse time; preserve the span shape exactly (Pattern 5).

### Pitfall 5: Citation Arabic in the wrong face
**What goes wrong:** rendering a Qur'an ayah in general Amiri (or a hadith in the `.ayah` Quran face) violates the Arabic typography law (`.ayah` is Qur'an-only, ASSETS.md).
**How to avoid:** face-split by ref shape — `grade`/`kind:"The hadith"` → general Amiri; else `.ayah` (Pattern 6). Both always `dir="rtl" lang="ar"`.

### Pitfall 6: Preview re-mocks instead of loading the engine
**What goes wrong:** demoing fake sheet/press classes in the preview `<style>` means the gate verifies mocks, not the shipped components.
**How to avoid:** add `<script src="shared/awba-engine.js">` to preview.html and demo real `AW.*` output in the new sections (D-43).

### Pitfall 7: `grep -c` in verify chains
**What goes wrong:** `grep -c` exits 1 on zero matches, failing a plan step spuriously.
**How to avoid:** use `! grep -q` (established Phase-1/2 convention, CLAUDE.md).

## Code Examples

### Demo content to port VERBATIM (D-38) — record these byte-for-byte in the plan
Source: `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/lessons/u1-m1.html`. Copy exactly (do NOT retype Arabic — copy the source bytes).

**THE Quran citation demo** (`hujurat-49-15` — no grade → `.ayah`/Amiri Quran face; its `mean` exercises the `˹ ˺` brackets through Poppins→Inter):
```
'hujurat-49-15':{ ref:'al-Ḥujurāt 49:15',
  ar:'إِنَّمَا ٱلْمُؤْمِنُونَ ٱلَّذِينَ ءَامَنُوا۟ بِٱللَّهِ وَرَسُولِهِۦ ثُمَّ لَمْ يَرْتَابُوا۟ وَجَـٰهَدُوا۟ بِأَمْوَٰلِهِمْ وَأَنفُسِهِمْ فِى سَبِيلِ ٱللَّهِ ۚ أُو۟لَـٰٓئِكَ هُمُ ٱلصَّـٰدِقُونَ',
  mean:'The ˹true˺ believers are only those who believe in Allah and His Messenger—never doubting—and strive with their wealth and their lives in the cause of Allah. They are the ones true in faith.',
  src:'The Clear Quran · Dr. Mustafa Khattab · pending review' }
```
**Recommended second citation demo** (`muslim-8`) to prove the **grade-pill + general-Amiri hadith face** path (D-36 explicitly needs the grade pill demoed):
```
'muslim-8':{ kind:'The hadith', ref:'Ṣaḥīḥ Muslim 8', grade:'Sahih',
  ar:'قَالَ فَأَخْبِرْنِي عَنِ الْإِيمَانِ ‏.‏ قَالَ أَنْ تُؤْمِنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الْآخِرِ وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ',
  mean:'He said: Inform me about faith. He (the Messenger of Allah) replied: That you believe in Allah, His angels, His Books, His Messengers, and the Last Day, and that you believe in the Divine Decree, its good and its evil.',
  src:'Hadith of Jibril, Ṣaḥīḥ Muslim 8 · via Sunnah.com · pending review' }
```
**THE term demo** (`aqeedah`):
```
aqeedah:{ ar:'عَقِيدَة', tl:'ʿaqīdah', word:'creed, or settled belief',
  def:'The firm, certain beliefs a person’s heart is bound to.',
  ctx:'From a root meaning to tie or bind firmly. Not a loose opinion, but a conviction fastened in place, like a knot you trust to hold.' }
```
(Two more terms available if wanted: `tawhid`, `iman` — same shape, in the source file.)

### Gen-3 sheet builders (behavior ground truth to elevate + tokenize)
```js
AW.sheetRef=function(refs,id){const r=refs[id];if(!r)return;
 const grade=r.grade?'<span class="r-pill grade">'+r.grade+'</span>':'';
 document.getElementById('sheet').innerHTML='<div class="grip"></div>'
  +'<div class="r-src">'+(r.kind||'The verse')+' · '+r.ref+grade+'</div>'
  +'<div class="r-ar">'+r.ar+'</div><div class="r-mean">'+r.mean+'</div>'
  +'<div class="r-ref">'+r.src+'</div>'
  +'<div style="margin-top:13px"><span class="r-pill">unverified · pending review</span></div>';
 document.getElementById('scrim').classList.add('open'); };
AW.sheetTerm=function(terms,id){const t=terms[id];if(!t)return;
 document.getElementById('sheet').innerHTML='<div class="grip"></div>'
  +'<div class="g-ar">'+t.ar+'</div><div class="g-tl">'+t.tl+'</div>'
  +'<div class="g-wd">'+t.word+'</div><div class="g-df">'+t.def+'</div><div class="g-cx">'+t.ctx+'</div>';
 document.getElementById('scrim').classList.add('open'); };
```
Gen-4 rebuilds these **on top of `AW.sheet(html)`** (not a bare `#sheet`), adds the Quran/hadith face-split (the `r-ar` block becomes `.ayah` for Quran, general Amiri for hadith), and tokenizes the CSS (translation table in Pattern 6).

## State of the Art

| Old (Gen-3) | Current (Gen-4 Phase 3) | Why it changed |
|-------------|-------------------------|----------------|
| 12-icon embedded KIT (one minified line) | 20-icon registry from canonical source + authored `lantern-gold` + `GLYPHS` map | FND-04 single-source; learn.html duplicate constants die |
| `AW.LANTERNG` runtime regex recolor | Authored `lantern-gold` SVG entry | D-33; runtime recolor is fragile |
| Zero icon a11y | `AW.icon` injects `aria-hidden`/`role=img` | ENGINE-CONTRACT §6 gap; ACC-02 forward-compat |
| All citation Arabic in one Amiri face | Quran→Amiri Quran (`.ayah`), hadith→Amiri + grade pill | ASSETS.md Arabic law + D-36 |
| Streak-sheet HTML duplicated ×2 | ONE `AW.sheet` singleton reused | ENGINE-CONTRACT §6 debt |
| **No `prefers-reduced-motion` anywhere** | Dual-trigger quieting (token-collapse + loop-stop) | MOT-04; the single biggest a11y gap |
| Only bob+glow, identical on every beat | One labelled vocabulary (press/pop/sheet/fade/ambient) | MOT-01 |
| Google-Fonts CDN `<link>` in data files | self-hosted (Phase 1) — preview must stay CDN-free | zero-CDN law |

**Deprecated/outdated (do not carry forward):** `AW.recolor`/`LANTERNG` regex; Gen-3 token names (`--blue2`, `--naskh`, `--disp`); per-page icon constants (`UIC`, `IC_STAR/TROPHY/CHEST/LOCK`).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Gold-lantern inner-light (`#EAF0FE`→`#FFF3CC`) and blob-halo hexes are authored-illustration literals, not tokens; only `#2E6BF5→--gold`, `#2536CE→--gold-deep` are firm token mappings | Pattern 3 | Low — designer tunes the variant at author time (D-33 discretion); the two firm mappings are load-bearing |
| A2 | Second demo citation (`muslim-8`, hadith w/ grade) should join the Quran demo so the grade-pill path renders | §10 / demo content | Low — D-36 needs the grade pill demoed; if only one is wanted, use the Quran ref for the ayah face and note the pill path separately |
| A3 | Adding a `<script src="shared/awba-engine.js">` to preview.html is in-scope for D-43 (needed to demo real components) | preview extension | Low — without it the new sections can't show real `AW.*`; alternative is re-mocking (anti-pattern) |
| A4 | Press-depth values (`5px`/`3px`) warrant new depth tokens in the tokens layer vs. a literal-px exception | Pattern 8 / OQ1 | Medium — touches Phase-1 tokens layer; see Open Question 1 for the decision the planner/owner must make |
| A5 | `svgo` may be skipped entirely (hand-author) given the clean SVGs | Standard Stack / Audit | Low — strictly safer (no `npx`); only cost is a few KB not trimmed |
| A6 | KIT icons authored WITHOUT `width`/`height` attrs (keep `viewBox`) so CSS sizes them | Pattern 1/2 | Low — matches Gen-3 KIT shape exactly; forcing square size on 240×300 scenes would distort |

## Open Questions (RESOLVED — all three settled by 03-UI-SPEC.md "Recorded Decisions", 2026-07-12)

1. **RESOLVED (UI-SPEC Recorded Decision #1 → plan 03-01 Task 1 adds `--press-rest`/`--press-active` to the tokens layer).** **Press-depth tokenization (D-40 "no literal px where a token exists").** The gummy depths are rest `5px` / active `2px` (=`--sp-2`) / translate `3px`; only `2px` is a token today.
   - Known: D-39 forbids new *easing* literals outside tokens; D-40 wants token-defined *depths*; Phase-1 D-04 says Phase-1 wrote the tokens layer.
   - Unclear: may Phase 3 add two depth tokens (`--press-rest`,`--press-active`) to the tokens layer, or should it accept literal `5px`/`3px` in the one press rule?
   - Recommendation: **add the two depth tokens** to the tokens layer (a token, not an easing literal — consistent with D-05/D-40); flag in the plan's must_haves so plan-check notices the tokens-layer touch. Cheap, keeps the "no literal px" law clean.

2. **RESOLVED (UI-SPEC Recorded Decision #2 + D-31 amendment → hand-author, svgo skipped; plan 03-02).** **`svgo` vs hand-author.** Recommendation: **hand-author** (strip `xmlns`/`width`/`height`, keep `viewBox`) — no `npx`, fully reviewable, and the audit removed the only correctness reason for `svgo`. If the planner prefers `svgo`, gate it behind `checkpoint:human-verify` (never `npx --yes`).

3. **RESOLVED (UI-SPEC Recorded Decision #3 → §5 left intact as token reference; plan 03-04 adds §9–12).** **Preview Section 5 retrofit vs supersede.** Should §5's preview-only motion mocks be replaced with real engine classes, or left and superseded by new §11–12? Recommendation: leave §5 as the token-value reference it was in Phase 1; add §9–12 demoing real components — but the planner may retrofit §5 for coherence (discretion).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Running the test suite (`node --test`) | ✓ | v24.13.0 | — |
| `node --test` glob form | Phase gate (tests stay green) | ✓ | (glob only — dir form throws) | explicit file paths |
| `svgo` | Optional icon byte-trim | ✗ (not on PATH) | — | **hand-author the KIT** (recommended) or gated `npx svgo` |
| Browser (Safari/Chrome, file://) | D-44 human visual gate | ✓ (owner's machine) | modern | — |
| Google Fonts CDN | — | N/A (forbidden) | — | self-hosted subsets (Phase 1, live) |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** `svgo` — hand-authoring fully substitutes and is the recommended path (no network, no `npx`).

## Validation Architecture

`workflow.nyquist_validation: true` → this section applies. Each success criterion maps to an automated check where possible; the irreducibly visual ones go to the D-44 human gate.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Node built-in `node:test` + `node:assert` (zero deps) |
| Config file | none — glob invocation |
| Quick run command | `node --test scripts/tests/state-helpers.test.js` (fast subset) |
| Full suite command | `node --test scripts/tests/*.test.js` (**glob form only** — Node v24.13.0 gotcha) |
| Current baseline | 3 test files, **26 tests green** (must stay green — D-44 precheck) |

**Note:** the engine's KIT/COMPONENTS are DOM/string builders; `node:test` can unit-test the **pure string** helpers (`AW.icon` injection, `AW.cite` shape, `escapeHtml`, `AW.reducedMotion` logic with a stubbed `document`) by loading the engine in a `vm`/globalThis (the engine already does `globalThis.AW = AW` for headless tests, and guards the boot-stamp on `typeof document`). Sheet open/close, motion, and confetti are **DOM-and-visual** → grep gates + human gate, not unit tests.

### Phase Requirements → Test/Check Map
| Req | Behavior | Type | Automated command / gate | Exists? |
|-----|----------|------|--------------------------|---------|
| FND-04 | KIT has exactly 20 scenes + `lantern-gold` | grep/count | `grep -oE '^\s*[a-z0-9-]+:\s*\`<svg' shared/awba-engine.js \| wc -l` == 21 (or a keyed count assertion) | ❌ Wave 0 |
| FND-04 | No per-page icon constants survive | grep | `! grep -rqE 'UIC|IC_STAR|IC_CHEST|LANTERNG' shared/ ` | ❌ Wave 0 |
| FND-04 | Every icon carries a11y via accessor; default `aria-hidden` | unit | `node --test` on `AW.icon('mosque')` contains `aria-hidden="true" focusable="false"`; `AW.icon('mosque',{label:'x'})` contains `role="img" aria-label="x"` | ❌ Wave 0 |
| FND-04 | No runtime regex recolor | grep | `! grep -q '\.replace(/#' shared/awba-engine.js` | ❌ Wave 0 |
| ENG-06 | `AW.cite` shape unchanged (validator-compatible) | unit | assert `AW.cite('x','y')` === `'<span class="cite" data-ref="x">…y…</span>'` shape; **existing validator + 26 tests still green** | partial (validator green) / ❌ new unit |
| ENG-06 | Pending pill on every citation; grade pill only w/ grade | unit/grep | assert `sheetRef` output contains `unverified · pending review`; grade pill present iff `r.grade` | ❌ Wave 0 |
| ENG-06 | Quran→`.ayah`, hadith→general Amiri | unit | assert Quran ref renders `class="ayah"`; hadith ref does not | ❌ Wave 0 |
| MOT-01/03 | One vocabulary; gummy press on full inventory; only token easings | grep | `! grep -qE 'cubic-bezier|linear\(' ` **outside** the tokens layer (no new easing literals, D-39); press rule lists `.btn,.opt,.tf,.tile,.cite,…` | ❌ Wave 0 |
| MOT-04 | Both triggers present; loops use `animation:none` | grep | `grep -q 'prefers-reduced-motion: reduce'` AND `grep -q '\[data-motion="reduce"\]'` AND `grep -q 'animation: *none'` in the motion layer | ❌ Wave 0 |
| MOT-04 | Confetti/WAAPI self-guard at call time | grep/unit | `grep -q 'matchMedia' shared/awba-engine.js` inside confetti + animate; `AW.reducedMotion()` unit test with stubbed attr/matchMedia | ❌ Wave 0 |
| D-43/D-44 | Zero CDN in preview | grep | `! grep -qE 'https?://(fonts\.googleapis\|cdn)' preview.html` | ✓ pattern exists (Phase-1 §8) |

### Sampling Rate
- **Per task commit:** `node --test scripts/tests/state-helpers.test.js` + the relevant grep gate(s) for the task.
- **Per wave merge:** full suite `node --test scripts/tests/*.test.js` + all Phase-3 grep gates.
- **Phase gate (D-44):** full suite green + icon-count/CDN/grep prechecks green → THEN human visual walk (see below).

### Wave 0 Gaps
- [ ] `scripts/tests/components.test.js` (new) — unit-tests for `AW.icon` (aria-hidden default + label path + missing→''), `AW.cite` shape, `escapeHtml`, `AW.reducedMotion` (stub `document`/`matchMedia`). Load engine via `vm`/`globalThis.AW` like the existing state tests.
- [ ] Phase-3 grep-gate list wired into the plan's verify chains (`! grep -q` form) — icon count, no-recolor, no-easing-literal-outside-tokens, both reduced-motion triggers, `animation:none`, no-per-page-constants, preview zero-CDN.
- [ ] No framework install needed (`node:test` present; 26 tests green).

### Human-visual (D-44) — the irreducibly non-automatable gate
Icons render crisply at UI sizes; the 20-grid reads as a brand moment; `lantern-gold` reads intentional and holds on the night register; sheets feel premium (slide, radius, spacing); press physics gummy-not-mushy across the inventory; reduced-motion (both OS setting AND the in-app `data-motion` toggle) visibly collapses everything and stops the companion loop; nothing celebratory renders over the scripture demo block.

## Security Domain

`security_enforcement` key absent → treated as enabled. This is a **single-tier, device-local static client** — no auth, no session, no server access-control, no network I/O, no secrets, no crypto. Most ASVS categories are N/A by architecture.

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | no accounts (v1 device-local, PROJECT.md) |
| V3 Session Management | no | no sessions |
| V4 Access Control | no | no server/authz |
| V5 Input Validation / Output Encoding | **yes (narrow)** | escape dynamic string params before `innerHTML` — `AW.icon` `label`→`aria-label` (escaped in Pattern 2); `escapeHtml` on `AW.cite` label |
| V6 Cryptography | no | none used |

### Known Threat Patterns for this stack
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| DOM-based XSS via `innerHTML` string-concat (ENGINE-CONTRACT §6 documents Gen-3's "zero escaping" gap) | Tampering | Content is **author-controlled** (Josh's verbatim files), not user input, so runtime XSS surface is minimal; still, **escape the few dynamic params** (`label`/`aria-label`), and the reflect textarea is never persisted/re-rendered (Phase 2). Full systematic escaping of runner HTML is Phase-4/6 scope, not Phase 3. |
| Supply-chain (dev tooling) | Tampering | `svgo` optional/gated or skipped; no runtime deps; nothing fetched at runtime (D-34, CLAUDE.md zero-CDN) |
| Icon a11y as info-integrity | (Info) | `AW.icon` gives decorative icons `aria-hidden` and meaningful ones `role=img`+name — prevents screen-reader noise/misinformation (ACC-02 seam) |

No security control blocks this phase; the only live directive is **escape dynamic string params** (already in the `AW.icon`/`AW.cite` patterns above).

## Sources

### Primary (HIGH confidence — measured this session)
- `/Users/theshumba/Downloads/AWBA APP/_ORGANIZED/03_Branding/icon files/*.svg` — 20 files; **id/url/defs/gradient/viewBox audit run** (all clean, identical `viewBox`, no `xmlns`-critical inlining issues); palette hex frequency; `03-lantern.svg` full contents + hex→role mapping.
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/shared/awba-engine.js` (464 lines) — exact `AW.KIT`, `AW.cite`, `AW.wire`, `AW.sheetRef/sheetTerm`, `AW.confetti`, `AW.skeleton`, `AW.LANTERNG` regex, `GLY`/glyph definitions.
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/shared/awba-engine.css` — sheet/scrim/cite/confetti/`@keyframes fall`/bob/glow CSS shapes (to elevate + tokenize).
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/lessons/u1-m1.html` — verbatim demo refs (`hujurat-49-15`, `muslim-8`, `anam-6-149`) + terms (`aqeedah`, `tawhid`, `iman`).
- `shared/awba-engine.css` (in-repo) — the exact live motion tokens `--dur-1..6/--dur-amb`, `--ease-*` (incl. verbatim `linear()` springs), shadow tokens, `@layer` order, `[data-register="night"]` hook.
- `shared/awba-engine.js` (in-repo) — STATE section (457 lines), `data-motion` boot-stamp at line 432 (stamps only on user override), `globalThis.AW` test hook.
- `scripts/validate-content.js` — the `AW.cite` stub `'<span class="cite" data-ref="'+id+'">'+(label||'')+'</span>'` + `/data-ref=["']([^"']+)["']/g` extractor (the shape Gen-4 `AW.cite` must preserve).
- `preview.html` (855 lines) — 8-section structure, unlayered `pv-` chrome, Section 5 motion mocks, **no engine-JS include**.
- `.planning/config.json` — `nyquist_validation:true`, brave/exa/firecrawl all false.
- CONTEXT.md (D-31..D-44), REQUIREMENTS.md (FND-04/ENG-06/MOT-01/03/04), ASSETS.md (Arabic laws, 20-icon canon), ENGINE-CONTRACT.md §1/§5/§6, STACK.md (`linear()`/WAAPI/confetti/svgo verdicts), Phase-1 (D-04..D-12) + Phase-2 (D-13..D-30) contexts.

### Secondary (MEDIUM-HIGH — verified web)
- MDN / CSS-Tricks — `prefers-reduced-motion`: **`animation: none` required for infinite loops** (duration-collapse does not stop them). Confirmed via search 2026-07-12: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion and https://css-tricks.com/almanac/rules/m/media/prefers-reduced-motion/
- STACK.md (Phase-0 research, HIGH internally) — `linear()` Safari 17.2+/Chrome 113+ Baseline (verified vs caniuse/MDN), WAAPI `.finished` universal, hand-rolled confetti recommendation, `svgo` one-off verdict.

### Tertiary (LOW — flagged)
- Gold-lantern non-structural hex choices (inner light, blob halo) — authored-illustration literals, designer discretion at author time (A1).

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — native platform only; no packages; all mechanisms verified in-file or in STACK.md.
- Icon registry / id-audit: **HIGH** — audit executed across all 20 files (empirical, not assumed).
- Sheet/cite/wire/confetti shapes: **HIGH** — measured verbatim from Gen-3 source + validator stub.
- Motion + reduced-motion: **HIGH** — tokens measured in-file; infinite-loop caveat web-verified.
- Gold-lantern exact non-structural hexes: **MEDIUM** — firm token mappings HIGH, art literals are discretion.
- Press-depth tokenization: **MEDIUM** — genuine spec ambiguity surfaced as Open Question 1.

**Research date:** 2026-07-12
**Valid until:** ~2026-08-12 (stable — vanilla platform + in-repo ground truth; only `linear()`/WAAPI browser-support facts could drift, and they're already Baseline)
