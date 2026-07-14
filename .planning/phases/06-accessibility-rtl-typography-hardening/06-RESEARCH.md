# Phase 6: Accessibility, RTL & Typography Hardening - Research

**Researched:** 2026-07-14
**Domain:** WCAG 2.2 AA hardening of a zero-dep vanilla JS/CSS multi-page app (keyboard, SR announcements, contrast audit, RTL/typography stress) — no new features, no new surfaces
**Confidence:** HIGH (nearly every claim verified by direct source read, grep, live suite run, or an empirical headless-Chrome probe executed this session)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**D-62 — Keyboard operability (ACC-01): native semantics first, one focus grammar**
Every interactive element must be reachable and operable by keyboard alone: learn nodes (already `<button>`s — verify), popup CTAs, sheet rows/close, tabs, HUD stats, mute toggles, quiz options/tf/tiles, the 3-lens accordion headers, reflect textarea, retry/continue buttons, Festival dismiss. Rules: native elements only (`button`/`a` — no div-with-handler retrofits; where one exists, convert), NO positive tabindex, DOM order = tab order (the path's serpentine tab order follows the journey sequence). One `:focus-visible` grammar app-wide, register-aware: gold ring on dark grounds (Orbit/Sky), crimson-on-cream for Page objects (both already precedented — Phase 1 laid the [data-register] hook, Phase 5 shipped gold focus on Orbit; unify + audit for the suppressed tap-highlight compensation). Escape closes any open sheet/popup/Festival overlay.

**D-63 — Modal focus management (the SG-01 carry-forward lands here)**
The three body-mounted overlay families (AW.sheet singleton, .npop node popup, .reg-festival interstitial) get: focus moved to the surface on open (the close button or the surface heading), a contained tab cycle while open (loop within the overlay — a small shared helper in the engine, one implementation for all three), focus RETURNED to the triggering element on close, aria-modal="true" + role="dialog" + an accessible name (the Festival overlay already ships role="dialog" aria-modal — extend the pattern). Outside-tap close behaviour unchanged.

**D-64 — Announcements (ACC-02): one polite live region, calm voice**
One visually-hidden `role="status"` (polite) live region per page, engine-provided (`AW.announce(text)` helper). Announced: quiz verdicts ("Correct — that's it." / the gentle line on a miss), noor claims ("+12 noor — total N"), combo milestones (2+ accrual, 3-streak — the same praise copy), lesson/review screen transitions (the new screen's heading), review timeout ("Time — it will wait at the end"), chest claim ("+25 noor — a sure gift"), star results. NEVER announced: the 100ms timer tick (a single soft "10 seconds" warning at 10s remaining is the only mid-question time announcement), ambient motion, sky changes. Icon-only controls get aria-labels: the mute toggle already has one; add the path nodes per the Phase-5 checker todo — `aria-label="{node label}, {locked|available|done|review|gift}"` — plus HUD stats ("N noor — tap for details"), sheet close, popup close. The reflect textarea gets a real `<label>` (visually the existing prompt).

**D-65 — Contrast + non-colour signals (ACC-03): audit against the shipped reality**
Sweep every text/UI pairing in the app against §2.1 (WCAG AA: 4.5:1 text, 3:1 UI shapes) — the phases already fixed the known offenders (WR-04/05 Phase 3, WR-02/03/04 Phase 4, WR-02/03 Phase 5); this pass PROVES the full surface with a scripted audit (computed styles from rendered pages, not just token pairs on paper) and fixes stragglers token-only. Non-colour signals: correct = the gold dot draw + check shapes (shipped), wrong = grey ink-blot + the why-line (shipped), thermal states = shape-first hollow/half/filled (shipped, D-A8) — verify each carries its shape cue everywhere it appears and fill any colour-only gap found (e.g. the review timer .low state gains a text cue via the 10s announcement + the numeric time already visible; the earned vs un-earned thread differs by continuity+weight, not just hue — verify).

**D-66 — Typography/RTL stress test (FND-03 + CNT-04 at full-app scale)**
A committed, executable stress artifact: extend the existing glyph/render harness with (a) a fixture page (scripts/fixtures/typo-stress.html — neutral copy, NEVER scripture per the Phase-2 fixture law) exercising every rationed face with the full diacritic set (ʿ ʾ ā ī ū ḥ ṣ ṭ ẓ ḍ ġ), Khattab ˹ ˺ brackets, ﷺ, and mixed Arabic/Latin lines; (b) automated checks: every Arabic-bearing element in the REAL app carries lang="ar" dir="rtl" (grep/DOM-walk over rendered pages) and Arabic containers use unicode-bidi:isolate (computed-style check); (c) a headless render at 320px + desktop proving no tofu (the Phase-1 glyph-gate method: glyph coverage verified in the subset .woff2 files). Real scripture is verified in situ on the rendered lesson pages (byte-identity already SHA-gated — this phase checks RENDERING).

**D-67 — Scope discipline for a cross-cutting pass**
Fixes land at the narrowest correct seam: engine-level for shared behaviour (focus helper, announce helper, focus-visible tokens), page-level only where a page authored its own markup (learn.html inline script). No mechanics changes, no copy rewrites beyond aria/label text, no schema/prefs bumps, localStorage count stays 13, @layer order line stays 1, zero new hex (token-only fixes; if a pairing genuinely cannot pass with existing tokens, STOP and log for the owner — do not invent colours). Suite baseline 114 never shrinks; every behaviour fix gets a regression pin (the Phase-4/5 lesson: real-DOM coverage, not stand-ins).

**D-68 — Verification shape**
The phase gate mirrors 04-07/05-06: automated prechecks (suite + the new a11y/typo audits + all standing gates) then the blocking human checkpoint (resolved per the standing directive, walk carried forward). The scripted contrast audit and the keyboard-walk probe (headless Chrome driving Tab/Enter/Escape through a lesson, a review, and the learn page) become PERMANENT suite members, not one-off checks.

### Claude's Discretion
Focus-ring exact offsets/widths per register (within tokens), the tab-cycle helper implementation, live-region debouncing, the stress-fixture layout, announcement copy micro-wording (within the calm-voice law and existing praise pools), audit-script implementation details.

### Deferred Ideas (OUT OF SCOPE)
- Full screen-reader scripting beyond aria-live basics (VoiceOver rotor optimization, custom announcements per SR quirk) — v2.
- Arrow-key spatial navigation on the path (nodes remain sequential-tab) — v2 polish.
- High-contrast/forced-colors mode support — v2.
- Owner ledger unchanged (sound cues, du'a, licensing, scholar gate, Arabic chapter-terms, Ibrahim splice, doodle pool, visual walks).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ACC-01 | Full keyboard operability with visible `:focus-visible` styles on every interactive element (tap-highlight suppression compensated) | §Inventory (every element + its current keyboard state, with line refs), §Focus Containment, §Keyboard-Walk Probe (empirically-verified automation limits), Pitfalls 4/5/6 |
| ACC-02 | Quiz verdicts, noor changes, combo, and screen changes announced via aria-live/role=status; icon-only controls carry accessible names; reflect textarea properly labelled | §aria-live Architecture (insertion points per runner, debouncing, one-region pattern), §Inventory (names already shipped vs missing — note the reflect `<label>` is ALREADY shipped, verify only) |
| ACC-03 | Colour contrast of state colours verified against WCAG AA (per the D-65 binding translation: grey-ink/ember/gold/olive/powder, amber retired); correct/incorrect states carry a non-colour signal | §Contrast Audit (computed-style method, rgba compositing, the state-forcing table), §2.1 table = ground truth, §Non-Colour Signals findings (incl. the D-65 numeric-time discrepancy) |
| FND-03/CNT-04 (SC4 full-scale stress) | Diacritics/˹ ˺/ﷺ render tofu-free in the rationed faces; every Arabic span carries lang/dir; ayah in Quran face | §RTL/Bidi Verification (emitter census, isolate census, the broken Phase-1 glyph gate + rewrite spec, honest tofu-detection limits) |
</phase_requirements>

## Summary

This phase hardens a complete, shipped surface: `learn.html` (816 lines, inline IIFE) + `AwbaLesson`/`AwbaReview` in `shared/awba-engine.js` (2465 lines) + `shared/awba-engine.css` (2325 lines), across 20 pages (learn + 15 lessons + 4 reviews). The good news from the inventory: the foundations are unusually strong — every quiz/nav control is already a native `<button>`/`<a>`, register-aware `:focus-visible` rules shipped in Phase 1 (css:361-376), the mute toggle has aria-pressed + label swap, accordion and popup triggers carry aria-expanded, the Festival overlay ships role=dialog + aria-modal + aria-label + Escape + focus-on-open, `AW.sheet` already captures the invoker and restores focus on close ("Phase-6-ready" per its own comment, js:1044-1081), and the reflect textarea ALREADY has a real `<label for="lsrt">` (js:1604) — D-64's label item is a verify, not a build. What's genuinely missing: no live region exists anywhere (grep: 0 hits for aria-live/role=status/sr-only), no tab containment on any overlay, two div-with-handler surfaces on learn.html (streak strip, ayah card) have `role="button" tabindex="0"` but NO keydown handler (Enter/Space are dead), node buttons lack state-in-name, the popup dialog lacks aria-modal/name/focus-move, "disabled" buttons are class-only (focusable, silently inert), and quiz selection state is colour-only (inline borderColor swap, no aria-pressed).

Two load-bearing discoveries change the plan's shape. First: **the Phase-1 glyph gate is broken today** — `scripts/check-glyph-coverage.py` still references the deleted `poppins-600.woff2` and exits 1 on a crash (verified by running it); it must be rewritten for the Athar 14-face roster, and its REQUIRED codepoint lists are stale against the real app strings (e.g. the DAILY refs use Ḥ U+1E24, Ḏ U+1E0E — uppercase forms no list covers; the Courier Ibrahim line needs ā in Courier Prime). Second: **empirical headless-Chrome probes run this session** pin the keyboard-walk automation boundary precisely: synthetic `KeyboardEvent('Tab')` does NOT move focus (isTrusted=false, no default action) and synthetic Enter does NOT click a button — but `el.focus()` works, `el.matches(':focus-visible')` returns true after programmatic focus in headless Chrome (assertable!), document/element keydown LISTENERS do fire on synthetic events (so a hand-rolled focus-trap's wrap logic and all Escape handlers ARE testable synthetically), and `--virtual-time-budget` fast-forwards the review's 14s timer to a real timeout state headlessly.

**Primary recommendation:** build three engine-level primitives (`AW.announce`, a shared ~25-line focus-containment helper applied to all three overlay families, an `.aw-sr` visually-hidden utility in `@layer base`), fix page/runner gaps at their narrowest seams per the inventory below, and ship three permanent audit artifacts: a keyboard/dialog-contract probe (extends the learn-dom-flows driver pattern, *.test.js), a computed-style contrast sweep + RTL/bidi DOM-walk (render-smoke-style .mjs gate), and the rewritten glyph gate + typo-stress fixture.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| AW.announce + live region | Engine JS (boot-stamp block) | — | D-64: engine-provided, one per page; CONTEXT names the boot-stamp block as home |
| Focus-containment helper | Engine JS (near AW.sheet) | learn.html (applies it to .npop/.ofest) | D-63: "a small shared helper in the engine, one implementation for all three" |
| `.aw-sr` visually-hidden CSS + focus-ring unification | Engine CSS `@layer base` (additive) | — | Architecture primitive; order line untouched (D-67) |
| Node aria-labels, streak-strip/ayah-card conversion, popup dialog contract, Festival focus-return | learn.html inline script | — | Page-authored markup → page-level fix (D-67) |
| Runner announce insertion + focus-to-heading + real disabled states + selection aria | Engine JS (AwbaLesson/AwbaReview) | — | Runner-authored markup |
| Contrast + RTL audits, keyboard probe, typo-stress fixture, glyph-gate rewrite | scripts/ + scripts/tests/ + scripts/fixtures/ | — | Permanent gates (D-68); fixtures stay in scripts/fixtures/ (out of any future PWA precache) |

## Standard Stack

No new libraries, no new packages, no npm installs — the zero-dependency law stands (CLAUDE.md; all tooling verified present this session):

| Tool | Version (verified) | Purpose |
|------|--------------------|---------|
| node | v24.13.0 | `node --test scripts/tests/*.test.js` (glob ONLY — directory form throws MODULE_NOT_FOUND on this build) [VERIFIED: ran suite, 114/114 pass] |
| System Chrome headless | `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` | `--headless --dump-dom --virtual-time-budget` driver harness (render-smoke/learn-dom-flows precedent) [VERIFIED: exists + probes ran] |
| python3 + fontTools | 3.9.6 / 4.60.2 | cmap inspection of subset .woff2 (the Phase-1 glyph-gate method) [VERIFIED: import succeeded] |

### Don't Hand-Roll — with one sanctioned exception

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| WCAG contrast math | A new luminance formula per script | ONE shared function (WCAG 2.x relative-luminance + ratio) in the audit .mjs | One implementation, one place to review the formula |
| Glyph existence proof | Rendering-level tofu detection (canvas measureText heuristics, document.fonts.check) | fontTools cmap inspection of the committed subset files | `document.fonts.check()` returns true vacuously when NO listed face covers a codepoint — false-pass risk; canvas fallback heuristics are unreliable because browsers system-fallback in canvas too. Cmap is authoritative for a closed, self-hosted face set [ASSUMED: check() vacuous-true semantics — from training; the recommendation (cmap as the gate) is robust regardless] |
| Focus trap | A full inert/aria-hidden background manager | The minimal keydown Tab-cycle helper (D-63 explicitly scopes it) | aria-modal="true" already instructs SR to ignore background; inert is v2 territory (deferred list) |
| Dialog focus restore | New bookkeeping for AW.sheet | The SHIPPED invoker capture (js:1071/1081) | Already built and commented "Phase-6-ready" |

**Package Legitimacy Audit:** No external packages are installed by this phase (zero-dep law). Not applicable — nothing to audit.

## THE INVENTORY — every interactive element, current keyboard/aria state

All line refs verified by direct read this session. Legend: ✓ = shipped correct · ✗ = gap this phase fixes · ◐ = partial.

### learn.html (Orbit front door)

| Element | Where | Native? | Current a11y state | Gaps |
|---|---|---|---|---|
| `.onode` path stations ×21 | learn.html:664-670 | ✓ `<button type="button">` | `aria-expanded="false"` toggled by popup (243, 212); acc name = `.onode-label` text content | ✗ No state in name — the STATE.md Pending Todo: `aria-label="{label}, {locked/available/done/review/gift}"` (state already on `data-nstate`, kind on `data-kind` — compose in `nodeHtml()`) |
| Course chip `#courseChip` | :546 | ✓ button | `aria-label="Switch course"` ✓ | — |
| HUD `#hudReturns` / `#hudNoor` | :550-551 | ✓ buttons | Dynamic aria-labels ("N returns — open your streak") ✓ | — |
| Mute toggle | engine js:1711-1712 via `AW.muteBtnHtml()` | ✓ button, 44px | `aria-pressed` + label swap ("Mute sounds"/"Unmute sounds") ✓ | — |
| Streak strip `#streakStrip` | :571 | ✗ **DIV** `role="button" tabindex="0"` | aria-label ✓; click handler only (:751) | ✗ **Enter/Space dead** — no keydown. D-62: convert to a real `<button>` (block-level button styling, keep classes) |
| Daily ayah `#ayahHost` | :607 | ✗ **SECTION** `tabindex="0" role="button"` | aria-label ✓; click handler only (:790) | ✗ Same Enter/Space gap — convert per D-62 (note: converting a `<section>` of rich content to `<button>` flattens its inner semantics for SR; acceptable — content is short; alternative is a keydown handler, but D-62 says convert) |
| Continue card `.cc-go` | :590 | ✓ `<a class="btn">` | href nav ✓ | — |
| Tab bar ×5 | :722-734 | ✓ buttons in `<nav aria-label="Sections">` | `aria-current="page"` on active ✓; text labels ✓; icons decorative (AW.icon default `aria-hidden` js:984) ✓ | — |
| Node popup `.npop` | :237-246 | container div (fine for dialog) | `role="dialog"` ✓ (:239); Escape ✓ (:349-351); outside-tap ✓ (:344-347); singleton ✓; trigger aria-expanded ✓ | ✗ NO `aria-modal`, NO accessible name (use `aria-labelledby` → `.np-label`, give it an id), NO focus move on open, NO containment, NO focus return in `closePop()` (:210-213 — popNode persists; focus it if still connected) |
| Popup CTAs `.np-cta` | :293/299/302/306/309 | ✓ `<button>`/`<a class="btn">` | — | — (locked popup has NO CTA by design D-54 — focus the popup itself) |
| Festival overlay `.ofest.reg-festival` | :483-502 | container div | `role="dialog"` + `aria-modal="true"` + `aria-label="A gift of light"` ✓ (:487-489); Escape ✓ (:493-494, listener removed on close :468); backdrop-tap ✓ (:495-497); **focus moved to `.ofest-close` on open ✓** (:500-501) | ✗ NO containment; ✗ NO focus return — and the trigger (popup CTA) is DESTROYED before open + `closeFestival()` re-renders the whole path (:471), so return-focus must re-query the chest node by `data-id` AFTER `render()` |
| Festival close `.ofest-close` | :463 | ✓ button "Keep the light" | text name ✓ | — |
| Decorative | SPROUT :85, thread SVGs :689, seeds :272, ringdabs, rv-arcs | — | `aria-hidden="true" focusable="false"` ✓ throughout | ◐ learn's own weekcal dots (:370, :569) and `.onode-stars` lack aria-hidden (empty spans — harmless but stamp them for cleanliness) |

### AwbaLesson runner (engine js:1739-2195) — 15 lesson pages

| Element | Where | State | Gaps |
|---|---|---|---|
| Continue/Check/retry `.btn` | :1800 | ✓ native buttons | ✗ "disabled" Check is **class-only** (:1894 `btn('Check','disabled','check')`) — focusable, Enter silently no-ops (guarded by `chosen===null` :1913). Add real `disabled` attr (toggle with the existing classList calls :1909/1932) or `aria-disabled` |
| Back `.ls-back` | :1801 | ✓ button, `hidden` attr on opener ✓ | — |
| Quiz `.opt`/`.tf`/`.tile` | :1615-1644 | ✓ native buttons | ✗ Selection cue is colour-only inline `borderColor='var(--crimson)'` (:1907) — add `aria-pressed` (and a shape cue is discretion; the persistent border IS a shape change, but SR needs the aria state). ◐ After resolve, options get `pointerEvents='none'` (:1916) — **pointer-events does NOT block keyboard**; the `answered` guard (:1905) makes Enter a safe no-op, but the dead buttons stay in tab order → set `disabled` on resolve |
| 3-lens accordion `.lh` | :1586, toggled :1862 | ✓ native buttons + `aria-expanded` ✓ | — (verify only) |
| Reflect textarea | :1604-1605 | ✓ **`<label for="lsrt">` ALREADY SHIPPED** | D-64's "gets a real label" = verify, not build. ◐ The Continue button self-mutates ("Show a reflection"→"Continue" :1871-1882) — announce the reveal |
| Progress dabs `.ls-dab` | :1794-1796 | spans + visible `.ls-count` "N / M" text ✓ | ◐ dabs not aria-hidden (empty spans; stamp them) |
| Reward screens (verdict/noor/returns/done/ring/dua) | :2046-2192 | headings present (`.rw-word` h1, `.pintro` h2) ✓; ring SVG has `role="img" aria-label` ✓ (:1340) | ✗ Every screen swap is `root.innerHTML=` → **focus evaporates to `<body>`**; ✗ nothing announced. See §aria-live |
| Mute in HUD | :1784 | ✓ shared pattern | — |

### AwbaReview runner (engine js:2222-2465) — 4 review pages

| Element | Where | State | Gaps |
|---|---|---|---|
| Intro Begin/`Maybe later` | :2353 | ✓ button + `<a class="btn ghost">` | — |
| `.opt`/`.tf` + Check | :2371-2380, bind :2389 | ✓ native; gold selection border (:2397) colour-only | ✗ same aria-pressed + disabled-on-resolve gaps as lesson (guards at :2395/2403 make it functionally safe) |
| Timer `.rv-timer` + `.low` | :2284-2292 | Bar width % only; `.low` = ember deepen; `tnote` empty until timeout | ✗ **No numeric time is visible anywhere** — D-65's parenthetical "the numeric time already visible" is WRONG against source (rv-timerwrap :2240-2243 renders bar + empty tnote only). The 10s announcement becomes the sole text cue; flag to planner: either accept announcement-only or add a quiet visible cue (visible change — weigh against "no visual redesign") |
| timeUp | :2296-2306 | mercy copy renders in foot ✓; options pointerEvents-disabled (guarded) | ✗ announce the timeout line; ✗ the **1500ms auto-skip** (:2305) then swaps content under the user — announce the next question's arrival (see Pitfall 3) |
| Circle-back offer / result | :2319-2334, :2433-2462 | native buttons ✓; headings ✓ | ✗ focus-to-heading + announce on these screen swaps |
| No back button | :2234 | ✓ enforced | — |

### AW.sheet family (engine js:1049-1135) — all pages

| Aspect | State | Gaps |
|---|---|---|
| role=dialog + aria-modal | ✓ (:1057-1058) | ✗ no accessible NAME — extend `AW.sheet(html[, label])` backwards-compatibly (default e.g. "Details"); sheetRef can pass `r.ref`, sheetTerm `t.word` |
| Close button | ✓ `.sheet-x` `aria-label="Close"` (:1072) | — |
| Escape | ✓ (:1064-1066) | ◐ the document-level listener is registered once and NEVER removed — fires `api.close()` (idempotent, safe) on every Escape forever; fine, but see Pitfall 6 on Escape stacking |
| Focus restore on close | ✓ **invoker captured at open (:1071), `.focus()` on close (:1081)** — already shipped | — |
| Focus INTO sheet on open | ✗ | Focus `.sheet-x` (D-63 names the close button) |
| Containment | ✗ (comment :1046-1048 explicitly defers to Phase 6) | The shared helper |
| Sheet rows | `.sheet-row.osw-row` in the switcher are **divs with no handlers** (learn.html:398-402) — display-only coming-soon rows, intentionally non-interactive | Verify only: they must NOT get tabindex (they look pressable but do nothing — acceptable per LRN-06 design; do not convert) |

## Focus Containment — the shared helper (D-63)

**One implementation in the engine** (near AW.sheet), applied to all three families:

```js
// AW._trapFocus(overlayEl) → returns an untrap() disposer.
// Focusable = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
// filtered by visibility (offsetParent !== null || el === document.activeElement — the fixed-position
// sheet has offsetParent null quirks; use getClientRects().length > 0 instead, which is robust).
// keydown listener ON THE OVERLAY (not document): if e.key !== 'Tab' return;
// recompute the list live each keypress (popup content is static but sheet content varies);
// if shift+Tab on first (or focus outside list) → preventDefault, focus last; if Tab on last → preventDefault, focus first.
```

Key implementation facts (verified against source):
- **AW.sheet**: attach the trap to `sheet` (not `scrim`) on open, dispose on close. The scrim wraps the sheet (js:1059) — clicks on the scrim close (outside-tap unchanged, D-63). Focus `.sheet-x` on open. Invoker restore already shipped.
- **.npop**: attach on `openPopFor` after `document.body.appendChild` (:241); dispose in `closePop`. Focus target: the popup element itself (`tabindex="-1"` + `aria-labelledby` → the `.np-label` id) — the locked popup has NO CTA (D-54), so the dialog itself must be focusable. Focus return: `closePop()` focuses `popNode` if `popNode.isConnected` (render() calls closePop after innerHTML rebuild — the old node is detached then; skip focus in that path, render's own flow re-lands focus via auto-scroll semantics).
- **.ofest Festival**: attach in `openFestival`; the only focusable is `.ofest-close` — the cycle is a self-loop (Tab keeps you on Keep-the-light; correct behaviour). Focus return on close: `closeFestival` calls `render()` FIRST (:471) which rebuilds the path — re-query `app.querySelector('.onode[data-id="' + nodeId + '"]')` after render and focus it (thread `nodeId` into closeFestival — it's in scope at openFestival).
- **Escape semantics today (verified)**: sheet ✓ always-on document listener (js:1064); popup ✓ document listener guarded by `openPop` (learn:349-351); Festival ✓ scoped listener added on open, removed on close (learn:493-494, 468). All three exist — the phase VERIFIES + pins them, builds none.
- **Escape never skips the +25**: verified — the claim (`AW.S.set('chests')` + `AW.S.set('noor', +25)`) completes at learn:519-521 BEFORE `openFestival(nodeId)` runs at :522. Escape-close is pure UI dismissal. Pin this ordering in the probe.

## aria-live Architecture (D-64)

**Nothing exists today** — grep across engine JS/CSS + learn.html: 0 hits for `aria-live|role="status"|sr-only|visually-hidden|announce` [VERIFIED: grep this session]. Build from scratch:

**The region.** One `<div class="aw-sr" role="status">` (role=status = implicit `aria-live="polite" aria-atomic="true"`; also set `aria-live="polite"` explicitly — belt-and-braces for older VoiceOver) appended to `document.body` as a DIRECT child — **never inside `#app`/`#root`/`<main>`** (Pitfall 1). `.aw-sr` visually-hidden utility in `@layer base` (position:absolute; width/height:1px; clip-path:inset(50%); overflow:hidden; white-space:nowrap — zero new hex, no colour at all).

**Creation timing (load-bearing, traced against real page lifecycles):**
- Lessons/reviews: engine loads in `<head>` → `document.body` is null at parse time → runner inline scripts then run and **wipe `document.body.innerHTML`** (js:1763, 2237) — anything appended before that dies.
- learn.html: the IIFE rebuilds `#app.innerHTML` (learn:736), body-level children survive.
- **Correct pattern:** `AW.announce(text)` lazily ensures the region (create-if-absent, append to body) at call time — every announce necessarily happens after the runner's body wipe. PLUS an ensure on `DOMContentLoaded` in the boot-stamp block (the existing `readyState === 'loading'` pattern at js:534-536 is the precedent), because a region must exist in the DOM BEFORE its first update or VoiceOver can miss the first message [ASSUMED: the missed-first-announcement behaviour is training knowledge; the mitigation (pre-create at DCL) is cheap and standard].
- The boot-stamp block (js:495-537) is the CONTEXT-designated home for both `AW.announce` and the ensure.

**Insertion points (exact seams):**

| Event | Seam | Composed message (calm voice, discretion on wording) |
|---|---|---|
| Quiz verdict + noor + combo | `resolve()` js:1963 — ONE composed announce per resolve, never three | ok: `"{praise} +12 noor" + (comboShow ? " — N in a row" : "")`; miss: `"Nothing lost. " + it.gentle` |
| 3-streak flourish | same resolve branch (js:1983) | fold into the composed line ("Three in a row — beautifully done") |
| Reflect reveal | the reflect click handler js:1874-1883 | "+15 noor — a reflection" |
| Lesson screen changes | `verdict()/rewardNoor()/rewardReturns()/done()/ringMoment()/duaClose()` — announce the heading AND/OR focus it | see the focus-to-heading pattern below |
| Review answer | `bind()` check handler js:2402-2427 | composed verdict + swift noor line |
| Review timeout | `timeUp()` js:2296 | "Time — this one will wait at the end" (the shipped copy) |
| 10s warning | the tick js:2287-2291 — fire ONCE at `tleft === 100` (deciseconds; monotonic, so single-fire is free) | "10 seconds" |
| Review result | `result()` js:2433 | verdict word + stars + noor |
| Chest claim | `__awbaClaimChest` learn:521 (after the noor set) | "+25 noor — a sure gift" |
| Sheet open | optional — focus-into-sheet already makes SR read the sheet | skip announcing (focus does the work) |

**Double-announce avoidance (the verdict word is also rendered visually):** the visible verdict content carries NO live attribute and focus does NOT move to it in the quiz flow (focus stays on Check/moves to Continue) — so the region announcement is the ONLY speech path; no doubling. For the reward SCREEN transitions, prefer **focus-to-heading over announce**: give each screen's `h1/.rw-word` `tabindex="-1"` and `.focus()` it after render — this simultaneously fixes the focus-evaporation on `innerHTML` swap (Pitfall 2) AND makes the SR read the heading naturally. Do NOT also announce the same heading (that's the double). Rule: **focus() for screen changes, announce() for in-place events.** (D-64 lists "screen transitions announced" — focus-landing IS the announcement mechanism; log this reading in the plan.)

**Debouncing (discretion):** compose-at-source (above) handles the known 2s bursts (combo→verdict→noor are one resolve call — one message). As a backstop, `AW.announce` keeps a last-write-wins 150ms trailing coalescer: a second call within the window replaces the pending text. Repeat-message reliability: clear `textContent` then set in a rAF (a region set to the identical string twice may not re-announce) [ASSUMED: standard live-region practice, not re-verified this session].

**countUp danger:** `countUp` ticks `textContent` per frame (js:2036-2041) — the noor numeral must NEVER sit inside the live region (it doesn't; keep it that way). Announce the final "+N noor" once from `rewardNoor()`.

## Contrast Audit — computed styles from rendered pages (D-65)

**Method (render-smoke/learn-dom-flows hybrid — throwaway page copy + injected driver, `--dump-dom` carries a JSON results block out):**

1. **Walk**: driver iterates `document.body` text nodes (TreeWalker, skip empty/whitespace, skip `.aw-sr`/aria-hidden). For each: `getComputedStyle(el)` → `color`, `fontSize`, `fontWeight` (large-text = ≥24px, or ≥18.66px bold → 3:1 threshold; else 4.5:1).
2. **Effective background through layers**: walk ancestors from the element up; alpha-composite each non-transparent `backgroundColor` (srgb "over" operator) onto the accumulator until an opaque colour is reached; if `<html>` is reached with alpha remaining, composite onto the page's register ground (read the register class → its token). This resolves rgba inks (`--paper-62` etc.) and rgba panel fills over the grounds correctly.
3. **The grain overlay**: `.grain` is a tiled PNG pseudo-element at ~2-9% opacity — a background-image, invisible to computed backgroundColor. **Accepted approximation: ignore it.** §2.1's ratios were computed against flat grounds; a ≤9% grain shifts luminance by well under one contrast step. Document this in the audit header (honest scope).
4. **Ratio**: WCAG relative luminance (sRGB linearization) + `(L1+0.05)/(L2+0.05)` [CITED: WCAG 2.x definition — formula is stable; encode once, one shared function].
5. **Non-text 3:1 (1.4.11)**: sweep a targeted list of UI boundaries (`.opt`/`.tf`/`.tile` borders, focus-ring token pairs, thermal `[data-state]` shapes, `.np-seed`, timer bar) — computed `borderColor`/`outlineColor` vs the same effective-background resolution.
6. **Report**: `CONTRAST OK/FAIL <page> <selector> <fg> on <bg> = N.NN:1 (needs X)`; exit non-zero on FAIL. Token-only fixes; a genuinely unfixable pairing → STOP + owner log (D-67).

**States that only exist under interaction — the forcing table (all methods verified feasible against source):**

| State | How to force headlessly |
|---|---|
| Node locked/active | Fresh storage — default render (u1m1 active, rest locked) |
| Node done + stars + gold thread + review rosette + chest available | Inject a seed `<script>` INTO the throwaway copy BEFORE the learn IIFE (`AW.S.set('stars', {...})` — engine is loaded in `<head>`, so AW exists; the IIFE then renders seeded). NOTE: the existing learn-dom-flows driver seeds AFTER load then relies on internal re-renders; pre-IIFE injection is cleaner for pure state forcing |
| Chest done / Festival surface | seed + `window.__awbaClaimChest('u1c')` (the proven driver pattern) |
| Popup variants (available/done/locked/chest/review) | `.onode.click()` per node via the driver (proven in 05-04's probe) |
| Lesson wrong answer (`.opt.wrong` + `.opt-why` + retry) | drive the real runner: click a wrong `.opt`, click `#check` — `.click()` is sufficient (verified: synthetic Enter doesn't click, `.click()` does) |
| Correct state / combo META / flourish | click correct options ×3 |
| Reward screens (verdict/noor/returns/done/ring/dua) | drive a full short lesson; `scripts/fixtures/valid-lesson.html` exists (validator fixture) — use it if it renders, else the shortest real lesson |
| Review `.low` timer | `--virtual-time-budget` fast-forwards the 100ms `setInterval` — the bar reaches `.low` and then timeout NATURALLY within the budget [VERIFIED: budget-driven timer fast-forward is how the existing harnesses already settle pages; the 14s timer fits a 20000 budget]. Fallback: `tbar.classList.add('low')` directly |
| Timeout mercy copy / circle-back | virtual-time expiry (above) |
| Pending pill, disabled Check, tab active | static — present at first render |

**Ground truth**: §2.1 of 03-UI-SPEC-ATHAR (read this session) — key pre-verified numbers the audit should reproduce: gold on Kiswah 8.40:1 ✓, ember on Kiswah 5.05:1 ✓, crimson on Kiswah 2.65:1 BANNED, ember on cream 3.21:1 (large/shape only), gold on cream 1.93:1 (never text), powder on cream 1.58:1 (never lone), rose on cream 1.73:1 (decorative only). The audit's job is to prove NO shipped text node lands in the banned cells.

**Non-colour signals (D-65 verify list, findings):** correct = gold dot + check shapes ✓ shipped; wrong = grey ink-blot + `.opt-why` text ✓ shipped; thermal hollow/half/filled ✓ shipped; 3-lens = left-rule STYLE (solid/double/dashed) + glyph + label ✓ shipped (STATE.md 04-02). Genuine colour-only gaps found: **quiz selection cue** (inline borderColor only — both runners), and **the review `.low` state** (colour deepen + bar width; NO numeric time exists — see the D-65 discrepancy flagged in the inventory). Earned vs un-earned thread: differs by continuity + the base being a separate faint path (learn:163-171 — gold overlays the navy base with its own dasharray) — weight+continuity cue present ✓, verify in the walk.

## RTL/Bidi Verification (D-66)

**Emitter census [VERIFIED: grep + read]:** exactly 5 Arabic-emitting paths, ALL already carry `lang="ar" dir="rtl"`:
1. `AW.sheetRef` `.r-ar` — js:1111
2. `AW.sheetTerm` `.g-ar` — js:1129
3. `verseHtml` `.ayah` — js:1549
4. `duaClose` `.scripture` — js:2181 (cfg-gated; no lesson cfg currently carries a du'a — owner ledger)
5. learn.html daily ayah `.ayah` — learn:609

**unicode-bidi census [VERIFIED: read css:378-414]:** `[lang="ar"]:not(.ayah):not(.scripture)` → isolate; `.ayah` → rtl+isolate; `.scripture` → rtl+isolate; `[dir="rtl"]` → isolate. All present. `letter-spacing: 0` enforced on all Arabic containers ✓.

**Automated assertions (the .mjs audit):**
- DOM-walk every rendered page: any element whose direct text matches `/[\\u0600-\\u06FF\\u0750-\\u077F\\uFB50-\\uFDFF\\uFE70-\\uFEFF]/` must have `closest('[lang="ar"]')`; its container's computed `direction === 'rtl'` (for .ayah/.scripture) and `unicodeBidi === 'isolate'`; ayah containers must compute `font-family` starting with Amiri Quran.
- Mixed Arabic/Latin line probe: the fixture renders a line with Arabic + Latin + digits; assert computed direction/isolate. **Visual-order verification (glyphs not scrambling) is honestly NOT fully automatable** from computed styles — an optional probe can compare `Range.getClientRects()` x-ordering of the Arabic run vs the Latin run (the Arabic run's rect should sit right of a following Latin run inside an RTL-isolated span), but treat it as best-effort; the authoritative check is computed isolate + the human gate walk. State this limit in the audit output.
- 320px + desktop renders: `--window-size=320,800` and default; assert `document.documentElement.scrollWidth <= window.innerWidth` (no horizontal overflow) on every page.

**The Phase-1 glyph-gate method — FOUND, and it is BROKEN [VERIFIED: ran it]:** `scripts/check-glyph-coverage.py` (fontTools cmap inspection of subset .woff2, exact-codepoint REQUIRED lists) — but it still references `shared/fonts/poppins-600.woff2`, deleted in 03-11, and **crashes with exit 1 today**. It also predates the Athar roster (no readex/marcellus/aref-ruqaa/rakkas/courier entries). The rewrite (small, same method):
- Cover the 14 CSS-declared faces (verified roster: readex-pro-{300..700}, amiri-{400,700}, amiri-quran-400, marcellus-400, aref-ruqaa-{400,700}, rakkas-400, courier-prime-400, inter-400-as-˹˺-fallback).
- **Derive REQUIRED codepoints from the REAL app strings, not a hand list** — harvest all non-ASCII codepoints from learn.html + lessons/ + reviews/ + engine emitter strings, bucket by rendering role. Concrete stale-list proof found this session: the DAILY refs contain **Ḥ U+1E24 and Ḏ U+1E0E (uppercase)** which NO current REQUIRED list covers, and the Courier Ibrahim line ("Ibrāhīm") needs **ā U+0101 in courier-prime-400** — untested today.
- Encode the documented stack-fallback law (§2.2, settled): Readex legitimately LACKS ˹U+02F9/˺U+02FA (Inter catches them — so a workhorse-role codepoint passes if readex ∪ inter covers it); Aref Ruqaa/Rakkas legitimately lack rare Quranic marks U+0657-065F (never required of them — heavy tashkeel is Amiri-only by law 3). The D-66 diacritic set for the fixture: ʿU+02BF ʾU+02BE āU+0101 īU+012B ūU+016B ḥU+1E25 ṣU+1E63 ṭU+1E6D ẓU+1E93 ḍU+1E0D ġU+0121 + uppercase forms actually used (U+1E24, U+1E0E) + ˹˺ + ﷺU+FDFA + ﴾U+FD3E ﴿U+FD3F.
- **Tofu at the rendering level — honest limit:** `--dump-dom` cannot see glyphs; canvas/document.fonts heuristics false-pass (see Don't Hand-Roll). The architecture that is actually sound: (a) cmap gate proves the subset files carry every harvested codepoint for their role-stack; (b) the computed font-family assertion proves the right face is ASKED for; (c) system-fallback (if a face were somehow missing) renders a real glyph, not tofu, on macOS/iOS for this codepoint set — so (a)+(b) closes the tofu risk for the closed self-hosted stack; (d) the human gate walks the fixture visually at 320px+desktop. Do not promise automated pixel-level tofu detection.

**Fixture law:** `scripts/fixtures/typo-stress.html` — NEUTRAL copy only, never scripture (Phase-2 fixture law; the Arabic sample strings must be non-scriptural — e.g. the basmala is scripture-adjacent, avoid; use common-tashkeel dictionary words + the alphabet). Location keeps it out of any Phase-7 precache list.

## Keyboard-Walk Probe — empirically-verified automation boundary (D-68)

Probes run this session in system headless Chrome (the real harness environment) [VERIFIED: probe JSON `{"activeAfterFocus":"a","fvMatchesProgrammatic":true,"synthTrusted":false,"activeAfterSyntheticTab":"a","clickFiredFromSyntheticEnter":false,"clickFiredFromDotClick":true}`]:

| Capability | Works headlessly? | Consequence for the probe |
|---|---|---|
| `el.focus()` + `document.activeElement` | ✓ | Drive focus programmatically |
| `el.matches(':focus-visible')` after programmatic focus | ✓ **true** (no prior pointer input in headless → UA heuristic grants focus-visible) | **The focus-ring rule's APPLICATION is assertable**: focus each interactive element, assert `matches(':focus-visible')` && computed `outlineStyle !== 'none'` && `outlineColor` equals the register's token (gold on Orbit, crimson on cream) |
| Synthetic `KeyboardEvent('keydown', {key:'Tab'})` moves focus | ✗ (isTrusted=false — no default action) | Real Tab traversal is NOT drivable. Substitute: compute the page's focusable list in DOM order and assert (a) every inventoried interactive element is IN it, (b) zero positive tabindex anywhere (DOM scan + static grep), (c) DOM order equals the journey sequence for `.onode`s |
| Synthetic Tab dispatched at a focus-trap's own keydown listener | ✓ listeners DO fire on untrusted events | **The containment helper IS testable**: focus the overlay's last focusable, dispatch synthetic Tab, assert preventDefault wrapped `activeElement` to the first (and shift+Tab reverse) |
| Synthetic Enter activates a `<button>` | ✗ | Native-activation is a platform guarantee — the probe asserts the ELEMENT IS native (`tagName` button/a) per D-62, and drives flows via `.click()` (the proven harness verb). For the two converted surfaces (streak strip, ayah card), nativeness itself is the assertion |
| Synthetic Escape at document | ✓ listeners fire | Escape-closes-overlay is directly testable for all three families; also pin claim-before-open ordering (noor delta +25 survives an immediate Escape) |
| `--virtual-time-budget` | ✓ fast-forwards timers | Drive the review to a real timeout (the 14s timer + the 1500ms auto-skip) and assert the mercy copy + announce text landed in the region |

**The three walks (D-68):** (a) learn → node popup (open/name/focus/contained/Escape/focus-return) → CTA nav intent; (b) full lesson u1-m1 or the fixture through resolve→verdict→…→du'a, asserting focus-to-heading per screen + composed announcements in the region (read `#region.textContent` at checkpoints — the region's content is inspectable even though speech isn't); (c) a review including a virtual-time timeout + circle-back. **Honest manual remainder:** the visible focus-ring's *visual* quality (offset/width/legibility on the grain), real Tab-order feel, and actual SR speech — human-gate items (the D-68 walk), listed as such in the gate checklist, not silently dropped.

## Common Pitfalls

### Pitfall 1: Live region dies inside swapped containers
**What:** Both runners wipe `document.body.innerHTML` at init (js:1763, 2237); learn.html rebuilds `#app.innerHTML` every render (learn:736); reward screens rebuild `#root.innerHTML` per moment. A region inside any of these silently stops announcing (SRs track the live region NODE).
**Avoid:** body-direct child + lazy-ensure inside `AW.announce` + DCL ensure (runs after runner wipes). The probe asserts the region survives a full lesson walk (same node identity, `isConnected`).

### Pitfall 2: Focus evaporates on every screen swap
`root.innerHTML=` leaves `document.activeElement === body` — keyboard users restart from the page top; SR reads nothing. Fix: `tabindex="-1"` + `.focus()` on each new screen's heading (verdict/noor/returns/done/ring/dua, review intro/question/result). Suppress the ring on non-interactive headings if desired (`[tabindex="-1"]:focus-visible { outline: none }` is defensible — it's not an operable control; discretion). Note `setGround()` swaps the register class (js:2009) — the focus-ring COLOUR scope follows automatically since the rules key off `.reg-*` ancestors (css:366-376) ✓ no work needed.

### Pitfall 3: The review's 1500ms auto-skip moves content under an SR user
Mechanics are byte-preserved (ENG-04 — the 1500ms CANNOT change). Mitigate in the announcement layer only: `timeUp()` announces the mercy line immediately; `renderQ()` announces the new question context ("Circling back — question N of M") so the swap is narrated. Never pause/extend the timer.

### Pitfall 4: `pointer-events:none` and `.disabled` classes don't block keyboards
Resolved options (js:1916, 2300, 2405) and the disabled Check (class-only) stay in the tab order and take Enter. The `answered`/`chosen===null` guards make this functionally safe TODAY (verified) — but it's a keyboard-UX failure (dead stops, silent no-ops). Fix with real `disabled` attributes at resolve/timeUp; keep the guards (defence-in-depth). Regression risk: the containment helper's focusable selector already excludes `button:not([disabled])` — consistent.

### Pitfall 5: Escape stacking across the three document-level listeners
Sheet's Escape listener is permanent (js:1064); popup's is permanent-guarded (learn:349); Festival's is scoped. One Escape press with a popup open also calls `AW.sheet.close()` (idempotent no-op if closed — harmless, verified by code shape). Keep it simple: verify no throw + correct top-most close in the probe; don't build a z-stack manager (only one overlay family is realistically open at a time — the popup's outside-tap closer fires on HUD/sheet-opening taps, learn:344-347).

### Pitfall 6: Festival focus-return target is destroyed
The trigger CTA lives in the popup (removed at claim, learn:326) and `closeFestival` re-renders the entire path BEFORE the overlay fades (learn:471). Focus return must re-query the chest node by `data-id` post-render. If it lands wrong, the user is dumped at body → the probe pins `document.activeElement` after Festival close.

### Pitfall 7: The audit scripts themselves trip the standing gates
- Gated literals NEVER in comments — including the VT property name, "amber", "confetti", "PERFECT", ".combo", "poppins" (port-audit greps lessons/reviews; other sweeps are file-wide) and the word "localStorage" in engine JS (the D-24 grep-count is pinned at exactly 13 — `AW.announce` must not mention it even in a comment).
- The U3-m3 label "One religion, one thread" false-positives naive `thread` greps (STATE.md 05-02 lesson) — scope any new grep to class/attribute context: `class="[^"]*\bthread\b` style patterns.
- ugrep needs paren-wrapping for leading-dash patterns; port-audit's `grepFindsMatch` sidesteps this — reuse its shape.
- New CSS goes in existing `@layer` blocks additively; the order line count stays exactly 1; zero new hex (`.aw-sr` needs no colour; focus tweaks are token-only).
- learn.html localStorage count stays 0; prefs/schema untouched (no CURRENT bump — the 03-10 precedent).

### Pitfall 8: aria-modal + the un-inerted background
`aria-modal="true"` tells SRs to ignore the background — but the outside DOM stays keyboard-reachable without containment; that's exactly what the trap closes. Do NOT also apply `inert` (deferred/v2; iOS Safari support nuances) — the trap + aria-modal is the D-63 scope.

### Pitfall 9: Announcing praise twice through composed + visible flows
The praise word renders visibly in the foot (js:1977) — never wire aria-live onto `#lsfoot` or any visible container; announcements go ONLY through the one region, composed once per resolve. The probe asserts region text is set exactly once per answer (snapshot before/after).

## Code Examples

Verified in-repo patterns to copy (not invent):
- **Driver harness**: `scripts/tests/learn-dom-flows.test.js` — throwaway copy + injected `<script>` before `</body>`, JSON results block, real+reverted non-vacuous pairs, `{ skip }` when Chrome absent, cached single Chrome run per file. This is the template for the keyboard probe.
- **Page sweeper**: `scripts/tests/render-smoke.mjs` — findPages() over learn+lessons+reviews, per-page Chrome invocation, `OK/FAIL` lines, exit-code-first. Template for contrast + RTL sweeps.
- **Focus restore**: `AW.sheet` js:1071/1081 — the invoker pattern to replicate in popup/Festival.
- **Once-per-event announce**: the `tleft === 100` single-fire pattern mirrors the existing monotonic-counter idioms (combo at js:1983).
- **DCL-safe boot work**: js:534-536 (`readyState === 'loading'` guard) for the region ensure.

## State of the Art

| Old approach (in-repo today) | Current approach (this phase) | Impact |
|---|---|---|
| No live region; visual-only verdicts | One body-level role=status + AW.announce, compose-at-source | ACC-02 |
| Overlays: Escape + (sheet-only) focus restore | + focus-into, tab containment, names, focus-return ×3 families | D-63/SG-01 |
| Class-only disabled; pointer-events gating | Real `disabled` attributes; guards retained | ACC-01 |
| Contrast proven on paper (§2.1 token pairs) | Scripted computed-style proof on rendered pages incl. forced states | ACC-03 |
| Glyph gate: broken (Poppins crash, exit 1) | Rewritten for the 14-face Athar roster, codepoints harvested from real strings | FND-03 |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|
| A1 | VoiceOver can miss announcements into a just-inserted region; clear-then-set-in-rAF re-announces repeats | aria-live | Low — mitigations are cheap and harmless if unneeded; real-device SR check is a human-gate item anyway |
| A2 | `document.fonts.check()` returns true vacuously when no listed face covers a codepoint (why it's rejected as a tofu gate) | RTL/Glyph | None — the chosen method (cmap) is authoritative regardless |
| A3 | macOS/iOS system fonts cover the diacritic set as last-resort fallback (tofu risk closed by cmap+family assertions) | RTL/Glyph | Low — the human fixture walk at the gate catches any residue |
| A4 | Real-browser `:focus-visible` heuristics may differ from headless (e.g. programmatic focus after a pointer tap may NOT match) | Keyboard probe | Probe asserts rule existence + headless application; visual ring on-device stays a human-gate item (already planned as such) |

## Open Questions

> All three were RESOLVED during Phase-6 planning — see the (RESOLVED — R-8/R-9/R-10) markers below.

1. **The D-65 "numeric time already visible" premise is false against source** (review timer renders a bar + empty tnote only, js:2240-2243). Options: accept the 10s announcement as the sole text cue (zero visual change — safest under "no visual redesign"), or add a quiet Courier seconds readout (visual change, owner-walk item). Recommendation: announcement-only; log the discrepancy in the plan for the gate walk. **(RESOLVED — R-8: announcement-only adopted; a visible Courier seconds readout remains a deferred owner-ledger choice, surfaced at the 06-07 gate walk.)**
2. **Ayah card conversion** (`<section role=button>` → `<button>`): flattens inner semantics (the Arabic span inside a button is still read, but as one blob). Alternative honouring D-62's spirit: keep the section, move the interactive affordance to an explicit inner "Read the citation" button. Recommendation: planner picks at plan time; either satisfies ACC-01. **(RESOLVED — R-9: keep the `<section>`, add a native inner "Read the citation" button — 06-06 T1; the sacred `.ayah` keeps its isolated scripture reading, law 3.)**
3. **Sheet accessible names**: extend `AW.sheet(html, label)` (backwards-compatible second arg) vs a generic fixed label. Recommendation: extend — sheetRef/sheetTerm/learn callers pass natural labels; default "Details". **(RESOLVED — R-10: extend `AW.sheet(html, label)`, backwards-compatible, default "Details" — 06-04 T2; sheetRef/sheetTerm/learn callers pass natural labels.)**

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| node | suite + audits | ✓ | v24.13.0 | — |
| System Chrome (exact harness path) | all headless probes | ✓ | at `/Applications/Google Chrome.app/...` | probes carry the existing `{ skip }` guard |
| python3 + fontTools | glyph gate | ✓ | 3.9.6 / 4.60.2 | — |
| Suite baseline | D-67 floor | ✓ | **114/114 green, run this session** | — |
| render-smoke | standing gate | ✓ | 21 checks (20 pages + vt-nav) | — |

Missing dependencies: none.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | node:test (Node v24.13.0 built-in) + system-Chrome driver harnesses; zero npm deps |
| Config file | none (convention: `scripts/tests/*.test.js` + standalone `.mjs` gates) |
| Quick run command | `node --test scripts/tests/*.test.js` (glob ONLY — never the directory form) |
| Full suite command | `node --test scripts/tests/*.test.js && node scripts/tests/render-smoke.mjs && node scripts/port-audit.mjs && node scripts/validate-content.js` + the new a11y/typo gates |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ACC-01 | Every interactive element native, in the focusable set, no positive tabindex, DOM order = journey order | real-DOM probe | `node --test scripts/tests/a11y-keyboard.test.js` (via glob) | ❌ Wave 0 |
| ACC-01 | :focus-visible rule applies with the correct register token on every element | real-DOM probe (`matches(':focus-visible')` + computed outline — empirically proven drivable) | same file | ❌ Wave 0 |
| ACC-01 | Visible ring quality on device / real Tab feel | **human-only** (synthetic Tab cannot traverse; headless heuristics ≠ device) | gate-walk checklist item | — |
| D-63 | Overlay contract ×3: focus-in, contained wrap (synthetic-Tab-at-trap proven testable), Escape, focus-return, names, aria-modal | real-DOM probe | `node --test scripts/tests/a11y-dialogs.test.js` | ❌ Wave 0 |
| D-63 | Escape-after-claim keeps the +25 (claim-before-open ordering) | real-DOM probe (extends the proven __awbaClaimChest driver) | same file | ❌ Wave 0 (learn-dom-flows.test.js is the template, stays untouched) |
| ACC-02 | Region exists body-level, survives full lesson/review walks; composed announcements land (region.textContent snapshots at each checkpoint); single-set per resolve; 10s single-fire; timeout narration | real-DOM probe | `node --test scripts/tests/a11y-announce.test.js` (uses `--virtual-time-budget` for the timeout path) | ❌ Wave 0 |
| ACC-02 | Actual SR speech quality/voice | **human-only** (no speech output headlessly) | gate-walk item | — |
| ACC-03 | Every text pairing ≥4.5:1 (or 3:1 large), UI shapes ≥3:1, across all 20 pages + the forced-state table | headless sweep | `node scripts/tests/contrast-audit.mjs` (exit-code gate, joins render-smoke in the precheck chain) | ❌ Wave 0 |
| ACC-03 | Non-colour signals present everywhere their state appears | probe assertions (shape classes/attrs present per state) + human confirmation of legibility | contrast-audit.mjs + gate walk | ❌ Wave 0 |
| FND-03 | Subset faces carry every harvested codepoint per role-stack | fontTools gate | `python3 scripts/check-glyph-coverage.py` (REWRITE — currently crashes exit 1) | ◐ exists, broken — Wave 0 rewrite |
| FND-03/CNT-04 | Fixture renders 320px+desktop, no overflow; every Arabic element lang/dir/isolate/correct-face; scripture face on rendered lesson pages | headless sweep | `node scripts/tests/rtl-audit.mjs` + `scripts/fixtures/typo-stress.html` | ❌ Wave 0 |
| CNT-04 | Mixed-line visual order + tofu-free rendering on device | **human-only remainder** (documented limits) | gate-walk item | — |
| D-67 | Suite ≥114, localStorage 13/0, @layer line ×1, glyphCount 13, zero new hex, gated-literal sweep | existing standing gates | already automated | ✅ |

### Sampling Rate
- **Per task commit:** `node --test scripts/tests/*.test.js` (the new probes join the glob; Chrome-driven files cache one run per file — the pattern keeps the suite fast)
- **Per wave merge:** full suite + render-smoke + port-audit + the new .mjs audits
- **Phase gate:** everything above green (suite ≥114 + new pins), then the BLOCKING human walk (D-68): keyboard walk of the three flows on a real browser, VoiceOver spot-pass, fixture visual check at 320px/desktop, focus-ring legibility on the grain

### Wave 0 Gaps
- [ ] `scripts/tests/a11y-keyboard.test.js` — ACC-01 probe (RED first: asserts state-in-name on nodes, native streak strip — both fail today)
- [ ] `scripts/tests/a11y-dialogs.test.js` — D-63 contract ×3 (RED: containment absent today)
- [ ] `scripts/tests/a11y-announce.test.js` — ACC-02 (RED: no region exists)
- [ ] `scripts/tests/contrast-audit.mjs` — ACC-03 sweep + state forcing
- [ ] `scripts/tests/rtl-audit.mjs` + `scripts/fixtures/typo-stress.html` — D-66
- [ ] `scripts/check-glyph-coverage.py` rewrite — currently BROKEN (exit 1, Poppins crash); fix is prerequisite to any FND-03 claim

## Sources

### Primary (HIGH confidence — direct read/run this session)
- `shared/awba-engine.js` (2465 lines: sheet 1049-1093, boot-stamp 495-537, beat builders 1501-1660, AwbaLesson 1739-2195, AwbaReview 2222-2465, mute 1704-1735)
- `shared/awba-engine.css` (focus-visible 356-376, Arabic/RTL 378-414)
- `learn.html` (816 lines: popup 202-354, sheets 356-421, Festival 423-523, render/HUD/tabs 525-812)
- `scripts/tests/learn-dom-flows.test.js`, `scripts/tests/render-smoke.mjs`, `scripts/check-glyph-coverage.py` (run — exit 1 confirmed)
- `.planning/phases/03-.../03-UI-SPEC-ATHAR.md` §2.1 (the contrast ground truth), §2.2 (type roles + settled glyph-coverage law)
- `.planning/STATE.md` (full build history, Pending Todo, standing gates), `.planning/REQUIREMENTS.md`, `06-CONTEXT.md`
- Suite run: **114/114 pass**; empirical headless-Chrome probe (focus/focus-visible/synthetic-event semantics) — JSON results quoted in §Keyboard-Walk Probe
- Environment probes: node v24.13.0, Chrome path, python3/fontTools 4.60.2, font roster on disk

### Secondary (MEDIUM)
- WCAG 2.2 SC set (1.4.3, 1.4.11, 2.1.1, 2.4.7, 4.1.3) — named by CONTEXT/REQUIREMENTS as the standard; luminance formula encoded from the stable WCAG definition [CITED: w3.org/TR/WCAG22 — not re-fetched this session]

### Tertiary (LOW — flagged in Assumptions Log)
- VoiceOver first-announcement timing, `document.fonts.check()` vacuous-true, real-device focus-visible heuristics — A1/A2/A4 above

## Metadata

**Confidence breakdown:**
- Inventory / current state: HIGH — every row read at source with line refs; suite + scripts actually run
- Focus containment + dialog contracts: HIGH — all three overlays read in full; automation boundary empirically probed
- aria-live architecture: HIGH on placement/seams (traced against real page lifecycles); MEDIUM on SR-quirk mitigations (A1)
- Contrast audit method: HIGH — harness pattern proven in-repo; state-forcing table verified against source mechanics
- RTL/typography: HIGH on census + broken-gate finding (ran it); MEDIUM on tofu-detection limits (honest scope stated)

**Research date:** 2026-07-14
**Valid until:** phase execution (in-repo findings go stale only if the surface changes; no external-ecosystem drift risk — zero dependencies)
