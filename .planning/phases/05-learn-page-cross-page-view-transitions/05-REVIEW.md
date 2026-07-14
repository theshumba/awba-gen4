---
phase: 5
slug: learn-page-cross-page-view-transitions
doc: REVIEW
reviewed: 2026-07-14T01:09:14Z
depth: deep
scope: "Phase 5 commits e59131c..27d8852 (plus the 05-01 seam commit e59131c itself): learn.html (NEW, repo root), the 05-01 shared/awba-engine.js seams (NODE_ATOMS Σ=61, AW.atomsDone, AW.dailyIndex, AW.muteBtnHtml/bindMuteBtn exports, the 65→61 re-wire of ringSVG/skyDawn/reward/boot) + the 05-04 View-Transition pageswap/pagereveal handlers, shared/awba-engine.css (@view-transition opt-in + reduced-motion kill block + all new @layer screens learn surfaces), scripts/tests/learn-state.test.js (NEW), the render-smoke.mjs root-discovery + vt-nav extension, the port-audit.mjs DAILY gate"
files_reviewed:
  - learn.html
  - shared/awba-engine.js
  - shared/awba-engine.css
  - scripts/tests/learn-state.test.js
  - scripts/tests/render-smoke.mjs
  - scripts/port-audit.mjs
findings:
  critical: 0
  warning: 4
  suggestion: 1
  total: 5
status: issues_found
---

# Phase 5 — Code Review Report

**Reviewed:** 2026-07-14
**Depth:** deep (cross-file, plus live reproduction in headless Chrome — real DOM, real `window.__awbaClaimChest` invocation against the actual shipped `learn.html`, not a mock — for the Critical-candidate finding below; direct WCAG relative-luminance computation for the two contrast findings)
**Files reviewed:** `learn.html` (the whole inline script — UNITS data, `smoothPath`/`drawThreads`/`arcLenAtPoint`, the node popup lifecycle, the shared-sheet openers, the chest-claim/Festival interstitial, `render()`), the 05-01 engine seams and 05-04 View-Transition handlers in `shared/awba-engine.js`, the `@view-transition` opt-in + every new `@layer screens` block in `shared/awba-engine.css`, `scripts/tests/learn-state.test.js`, and the `render-smoke.mjs`/`port-audit.mjs` extensions.
**Status:** issues found — 0 Critical, 4 Warning, 1 Suggestion

## Summary

Verified first, before reviewing: `node --test scripts/tests/*.test.js` → **107/107 green**. `node scripts/tests/render-smoke.mjs` → **20/20 SMOKE OK** including the new `vt-nav` file:// check. `node scripts/port-audit.mjs` → `DAILY BYTES OK`, all 19 `BYTES OK`, `HOLD OK`. All three gates match the 05-06-SUMMARY claims exactly — the suite is genuinely green, not just claimed green.

The engine seams are clean: `AW.dailyIndex` is correctly DST-safe and leap-safe (local-date-part arithmetic with `Math.round`, verified by hand-computation against a UK BST transition and by the shipped Dec-31 leap/non-leap test fixtures); `AW.atomsDone`/`NODE_ATOMS` sum to exactly 61 with zero stray `65`-derived math left anywhere in the diff; the `@view-transition` opt-in is correctly placed top-level, ahead of `@layer screens`, exactly once; reduced-motion coverage is genuinely complete for every new animation this phase introduced (constellation dots ride the `settle`-collapse, the active-node breathe is caught by the shipped `[data-ambient]` kill rule, the Festival plate/dabs/arc all ride shipped, already-guarded verbs). Crimson never leaks onto the Orbit ground (every crimson use this phase is scoped to a cream island or a body-mounted cream popup/sheet), and the tab-bar active cue correctly re-inks gold on Orbit rather than repeating the Phase-4 WR-01 crimson-leak pattern. The known-node-id hash validation (`idSet`) correctly gates the only external input this page accepts (`location.hash`) before it ever reaches a DOM query, and no dynamic/user-controllable string reaches `innerHTML` anywhere on this page — the DAILY pool and all node labels are static, author-controlled constants.

The real defects found here are narrower but genuine. The standout: this review empirically reproduced an **uncaught crash in the chest-claim mechanic** — not through code inspection alone, but by seeding a corrupted `chests: null` state blob and driving the actual shipped `window.__awbaClaimChest` in headless Chrome, exactly the way the review brief asked ("corrupted/absent stars blob"). That the interactive chest/popup/Festival code has **zero automated coverage of its real implementation** (only a hand-reimplemented stand-in is pinned) is very likely why this shipped undetected — the same class of gap Phase 4's review flagged as WR-05. Two CSS contrast regressions round out the Warnings, one of which is a verbatim repeat of a pairing this same file already documents as fixed elsewhere (`--ink-40` on cream, 2.56:1, below the 3:1 non-text WCAG floor).

## Critical Issues

None found. The one defect with real mechanic impact (chest-claim crash under a corrupted blob) requires an externally-tampered `awba_state` value, not something reachable through any normal UI path this review could find or drive — that bounded reachability is why it's classified Warning, not Critical, consistent with the Phase-4 review's precedent for narrow-window defects.

## Warnings

### WR-01: `window.__awbaClaimChest` throws an uncaught `TypeError` and permanently blocks that chest's claim if `AW.S`'s `chests` value is ever corrupted to `null` — live-reproduced against the real shipped code

**File:** `learn.html:509-522` (the whole function), specifically `learn.html:513-514`

**Issue:** `var chests = st.chests; if (chests[nodeId]) return;` reads `AW.state().chests` and immediately indexes into it with no defensive fallback. `AW.S.get(k, d)` (Phase 2, `shared/awba-engine.js:262-265`) only returns the default `{}` when the key is *absent or `undefined`* — `k in mem && mem[k] !== undefined ? defensiveCopy(mem[k]) : d`. A `chests` value explicitly stored as `null` (e.g. a hand-edited/corrupted `awba_state` blob, or any future migration bug that writes `null` instead of `{}`) passes that check (`null !== undefined`) and is returned as-is, so `chests[nodeId]` throws. Contrast this with the very next function up in the same file, `popContent()` (`learn.html:278`), which reads the identical shape defensively: `(stCur && stCur.stars && stCur.stars[id]) || 0` — the guard pattern already exists in this file, just not applied here.

**Reproduced live** (headless Chrome, the real `learn.html`, unmodified engine — only a pre-seeded `localStorage` blob with `chests: null` and unit-1 complete so `u1c` is genuinely `available`):
```
window.__awbaClaimChest('u1c') → THREW: TypeError: Cannot read properties of null (reading 'u1c')
```
Because the throw happens before `openFestival()` and before the caller's own `closePop()` runs (`learn.html:322-327`: `window.__awbaClaimChest(cid); closePop();` — the second statement never executes), the popup is left open with a dead CTA and the +25 noor is never granted. The chest stays permanently unclaimable until the corrupted blob is manually repaired — nothing in the schema-migration chain (`shared/awba-engine.js` STATE section, unmodified this phase) currently protects against a `null` value for an existing recognized key.

**Fix:** Guard the read the same way `popContent()` already does:
```js
var st = AW.state();
var chests = st.chests || {};                        // defensive copy — never index a null/undefined blob
if (chests[nodeId]) return;
```

---

### WR-02: `.np-star` (the node-popup star row) reuses the `--ink-40`/cream pairing this same file already documents as failing WCAG 1.4.11 and fixed twice elsewhere

**File:** `shared/awba-engine.css:2078`

**Issue:** `.np-star { display: inline-flex; color: var(--ink-40); }` — computed (WCAG relative-luminance, `rgba(19,16,19,.40)` over `--cream` `#F3EDE2`): **2.56:1**. This is the *exact* pairing Phase 4's WR-04 already identified and fixed twice in this file — `shared/awba-engine.css:866` and `:1465` both carry inline comments spelling out why: *"this border IS the shape-first 'not-yet' signal, so it needs WCAG 1.4.11's 3:1 non-text contrast. `--ink-62` = 5.02:1 on cream (clears it); `--ink-40` was 2.56:1 and failed."* `.np-star` is the shape-first "unearned star" state marker inside the node popup's star row (`learn.html:279`, `<span class="np-star...">`) — a UI component whose state must be distinguishable per 1.4.11 — yet the Phase-5 addition at line 2078 reintroduces the exact failing token in a fresh, unrelated location.

**Fix:** Repoint to `--ink-62` (5.02:1), matching the established fix:
```css
.np-star  { display: inline-flex; color: var(--ink-62); }
```

---

### WR-03: The locked node label and the Ibrahim epigraph reference line use `--paper-45` for real body text on Kiswah — 4.05:1, below WCAG 1.4.3's 4.5:1 normal-text floor

**File:** `shared/awba-engine.css:1949` (`.onode[data-nstate="locked"] .onode-label`), `shared/awba-engine.css:2020-2025` (`.oib-ref`)

**Issue:** `--paper-45: rgba(243,237,226,.45)` blended over `--kiswah` `#131013` computes to **4.05:1** (WCAG relative-luminance formula, verified by direct calculation). Both usages carry genuine reading text, not decoration: `.onode-label` on a locked path node is the lesson's actual title text (e.g. "Why belief matters") at `--fs-ui` (14px Readex, well under the 18.66px/24px-bold "large text" threshold that would drop the requirement to 3:1); `.oib-ref` is the Ibrahim-epigraph reference line ("Ibrāhīm 14:24 · translation pending review") at `--fs-marg` (12px Courier). Both fall under WCAG 1.4.3 AA's 4.5:1 floor for normal-size text and both fail it by roughly the same margin (≈0.45). `--paper-45` itself is an existing Phase-3 token; these two *text* usages are new in this phase (05-03) — the token was previously only used for non-text/decorative roles elsewhere in the file.

**Fix:** Bump both to `--paper-62` (6.69:1, already used as the established "quiet body text on Kiswah" tier elsewhere in this file, e.g. `.cc-kick`, `.oa-kick`, `.oib-line`):
```css
.onode[data-nstate="locked"] .onode-label { color: var(--paper-62); }
.oib-ref { color: var(--paper-62); }
```
(`.oib-line` directly above `.oib-ref` already uses `--paper-62` at line ~2015 — this makes the two epigraph lines consistent with each other too, rather than the reference line being *less* visible than the line above it.)

---

### WR-04: The learn-page interactive DOM flows (popup lifecycle, chest claim, Festival overlay, VT stamping) have zero automated coverage of the real implementation — the exact gap that let WR-01 through

**File:** `scripts/tests/learn-state.test.js:180-210` (the "chest claim" test — the only test that even gestures at this surface)

**Issue:** The one test that exercises chest-claim idempotency does not call `window.__awbaClaimChest` — it defines and calls a **hand-reimplemented stand-in function** inline in the test file (`learn-state.test.js:185-194`) that mirrors the *happy-path* shape of the real function but omits its `st.chests` read entirely (the reimplementation does `var chests = AW.state().chests;` with no guard either, but never exercises a corrupted-blob input, so it wouldn't have caught WR-01 even by coincidence). Nothing in the automated suite drives the real `openPopFor`/`wireCta`/`window.__awbaClaimChest`/`openFestival` code paths in `learn.html` with an actual DOM and an actual click. `render-smoke.mjs`'s new `vt-nav` check only proves a plain navigation doesn't console-error — it never clicks a node, opens a popup, or claims a chest. This is the identical class of gap Phase 4's review flagged as WR-05 (`04-REVIEW.md`: *"the interactive DOM flows of both runners have zero automated coverage"*), reproduced again here one phase later, and this review's own live headless-Chrome reproduction of WR-01 above is direct proof the gap has real consequences, not just theoretical ones.

**Fix:** Not asking for jsdom (D-25 stands, per the Phase-4 precedent's own resolution) — but either (a) extend `render-smoke.mjs`'s `vt-nav` probe (or add a sibling probe) to seed a completed-unit state, click through a real chest popup and claim CTA on the actual `learn.html`, and assert the resulting `noor`/`chests` state via a dumped `document.title` or similar signal (mirroring this review's own reproduction harness), or (b) replace the hand-reimplemented `claim()` function in `learn-state.test.js:185-194` with a real invocation of `window.__awbaClaimChest` via a small DOM/window stub that at minimum proves the guard clauses (including a `chests: null` fixture) behave as claimed rather than pinning a parallel implementation that can silently drift from — or fail to catch bugs in — the real one.

## Suggestions

### SG-01: The Festival overlay and the node popup extend the already-deferred no-focus-trap pattern, and do so slightly inconsistently with each other

**File:** `learn.html:479-502` (`openFestival` — `role="dialog" aria-modal="true"`, no focus trap), `learn.html:233-246` (`openPopFor` — `role="dialog"`, no `aria-modal`, no focus moved into the popup on open)

This is not a new regression — `AW.sheet` (Phase 3) already documents the identical limitation as an explicit, on-record deferral: *"DEFERRED to Phase 6 (deliberately NOT built here): focus-trap, inert/aria-hidden on the background..."* (`shared/awba-engine.js:1039-1047`). `openFestival` inherits that same gap (a keyboard user can `Shift+Tab` out of the full-screen `aria-modal="true"` overlay into visually-hidden background controls), and `openPopFor` goes slightly further by omitting `aria-modal` altogether and never moving focus into the popup on open (versus the Festival overlay, which does call `.focus()` on its close button). Neither actively traps or otherwise breaks keyboard use beyond what's already accepted for `AW.sheet`, so per this phase's a11y scoping this is deferred to Phase 6 rather than raised as a Warning — flagging here so Phase 6's focus-trap work (already scheduled per `05-CONTEXT.md`'s Integration Points: *"Phase 6 hardens focus/aria on the popup + sheets"*) picks up the Festival overlay too, since it's a newer, easy-to-miss third surface using the same pattern.

## FIXES (applied 2026-07-14)

**All 4 Warnings fixed.** Suite 107/107 → **113/113 green** (+6 regression tests; no existing test changed). Full gate battery re-verified after all fixes: `node --test scripts/tests/*.test.js` → 113 pass / 0 fail; `node scripts/validate-content.js` → exit 0 (exactly the 3 accepted notes: u3-m1 unused ref, u3-m3 unused ref, u4-m2 unused term); `node scripts/port-audit.mjs` → exit 0 (**DAILY BYTES OK**, BYTES OK ×20, HOLD OK — U4-03 absent, 3 NOTE ACCEPTED); `node scripts/tests/render-smoke.mjs` → exit 0, 21 SMOKE OK (every page + the `vt-nav` check). Athar invariants held: token-only CSS, zero new hex, the `@layer tokens, base, components, screens, motion;` order line still appears exactly once, `learn.html` `localStorage` grep count still **0** and the engine `localStorage` count still **13** (`shared/awba-engine.js` unedited — WR-01 fixed at the narrowest correct seam in `learn.html`, since `AW.deriveNodeState` already guards its own `chests` read), no cfg/DAILY body touched, and every mechanics number (+25 once, 61-atom denominator, unlock order) untouched. Each fix committed atomically. Suggestion: **0 applied, 1 documented** (SG-01 focus-trap is Phase-6-scoped, documented-not-applied per the Phase-3/4 precedent).

| Finding | Fix applied | Commit |
|---|---|---|
| **WR-01** | Hardened the `chests` read in `window.__awbaClaimChest` (`learn.html`): `var chests = st.chests;` now falls through `if (!chests || typeof chests !== 'object') chests = {};` before `chests[nodeId]` is ever indexed. A `chests` value corrupted to `null` (or any non-object) — which `AW.S.get` returns as-is because `null !== undefined` — no longer throws the live-reproduced uncaught `TypeError`; the claim proceeds, grants +25, and the `AW.S.set('chests', chests)` write repairs the blob. The +25-once idempotent semantics stay **byte-identical for healthy state** (a real object is truthy and passes through unchanged). Fixed at the narrowest correct seam — `AW.deriveNodeState` (line 441) already guards `(progress && progress.chests) || {}`, so no engine edit was needed. | `ccc0dc3` |
| **WR-02** | Repointed `.np-star` (the node-popup unearned-star marker, `shared/awba-engine.css`) from `--ink-40` (**2.56:1** on cream, failed WCAG 1.4.11) to **`--ink-62`** (**5.02:1**) — the identical precedent this file already documents at `:866`/`:1465`. The shape-first "not-yet" star now clears the 3:1 non-text floor while `.np-star.is-earned` gold still reads warmer/earned, so the visual hierarchy (unearned quieter than earned) is preserved. Token-only; zero new hex. | `6e7e36a` |
| **WR-03** | Bumped the two new-this-phase **text** usages of `--paper-45` on Kiswah (**4.05:1**, below WCAG 1.4.3's 4.5:1 normal-text floor) to **`--paper-62`** (**6.69:1**): the locked path-node label (`.onode[data-nstate="locked"] .onode-label`, 14px Readex — the lesson's real title) and the Ibrahim-epigraph reference line (`.oib-ref`, 12px Courier). `--paper-62` is the established "quiet body text on Kiswah" tier already used by `.oib-line` directly above. Locked labels stay visibly quieter than the `--paper-85` available/done labels, so the locked/quiet hierarchy holds while both clear the floor. Token-only; zero new hex. | `a68356c` |
| **WR-04** | Added `scripts/tests/learn-dom-flows.test.js` (**+6 tests, 107→113**) driving the **REAL** shipped `learn.html` inline script in system Chrome headless — the `render-smoke.mjs` harness pattern (`--dump-dom`, throwaway probe at repo root removed in `finally`, zero npm packages, no jsdom per D-25). A driver injected before `</body>` seeds an in-memory state through the real `AW.S` and exercises the real `window.__awbaClaimChest`/`openFestival`/`closeFestival`: (1) a claim grants exactly +25 once and a second claim is a no-op; (2) the Festival overlay mounts on `document.body` as an `aria-modal` `role="dialog"` and dismisses cleanly (no open overlay lingers); (3) **WR-01**: a corrupted `chests: null` blob now claims cleanly instead of throwing (+25, chest marked). **Proven non-vacuous**: the same run against a guard-**reverted** copy of `learn.html` reintroduces the uncaught `TypeError` (`/null/i`) and blocks the claim (delta 0) — so pin (3) genuinely fails if the WR-01 fix is ever reverted. | `ee4139a` |

### Suggestions — documented, not applied (Phase-3/4 precedent)

- **SG-01** (the Festival overlay + node popup extend the already-deferred no-focus-trap pattern, slightly inconsistently) — the review itself classifies this as **not a new regression**: `AW.sheet` (Phase 3) already documents the identical focus-trap/`inert` limitation as an explicit on-record deferral to Phase 6, and `05-CONTEXT.md`'s Integration Points already schedule *"Phase 6 hardens focus/aria on the popup + sheets"*. Applying a focus trap here would be **Phase-6 a11y work** beyond this finding's scope. **Not applied** (documented for Phase 6 to pick up the Festival overlay as the newer third surface).

_Fixed: 2026-07-14 · Fixer: Claude (gsd-code-fixer) · Iteration 1_

---

_Reviewed: 2026-07-14T01:09:14Z_
_Reviewer: Claude (adversarial code review)_
_Depth: deep — cross-file, with live reproduction in headless Chrome (real DOM, real `window.__awbaClaimChest` invocation against the unmodified shipped `learn.html`, no mocks) for WR-01, direct WCAG relative-luminance computation for WR-02/WR-03, and full-suite empirical re-verification (`node --test`, `render-smoke.mjs`, `port-audit.mjs`) before any finding was written_
