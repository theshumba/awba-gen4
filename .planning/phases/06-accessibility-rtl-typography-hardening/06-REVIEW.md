# 06-REVIEW — Phase 6 Code Review (Accessibility, RTL & Typography Hardening)

**Reviewer:** orchestrator inline (the dispatched gsd-code-reviewer stalled twice on the stream watchdog after completing its analysis; its surfaced lead — the AW.sheet trap re-entrancy — is confirmed below and the review was finished inline over the full diff).
**Scope:** `git diff 827abb2 HEAD` source files only (10 files, +2747/-90) — shared/awba-engine.js (+202), learn.html (+155), shared/awba-engine.css (+28), the three new audit scripts (contrast-audit.mjs/rtl-audit.mjs/check-glyph-coverage.py), the three a11y probe suites, and the typo-stress fixture.
**Date:** 2026-07-14

## Summary

| Severity | Count |
|---|---|
| Critical | 0 |
| Warning | 1 |
| Suggestion | 2 |

The Phase 6 a11y work is well-built: `AW.announce` is `textContent`-only (no injection sink), `AW._trapFocus` wraps correctly (incl. the single-focusable and container-focused cases), the register `:focus-visible` grammar and the one `[tabindex="-1"]` ring suppression are correctly scoped (no operable control silenced), the reward/review focus-to-heading split is clean (focus for swaps, announce for in-place — no double-speak on the six lesson reward screens), the non-colour selection cue (`aria-pressed` + 2→3px + held press) + real `disabled` attributes are correct, and the learn.html popup + Festival focus-return + trap disposal are correct. The three new audit scripts are empirically validated by their finding-history (contrast-audit exited 1 on the real `.ls-back` finding at 30 FAIL and 0 after the token fix; the glyph gate caught the stale Ḥ/Ḏ/Courier-ā gaps; rtl-audit caught the fixture bidi issues), which is strong anti-false-pass evidence.

---

## Warning

### W1 — `AW.sheet.open()` leaks the focus-trap listener and corrupts `invoker` on a re-open (no dispose-before-recreate)
**File:** `shared/awba-engine.js` (`AW.sheet` closure, `open: function (html, label)` — ~line 135)

`open()` unconditionally runs `invoker = document.activeElement` and `trap = AW._trapFocus(sheet)` every call, but the singleton "opening REPLACES content" path never disposes a prior `trap` or preserves the original `invoker`. If `AW.sheet(...)` is called while a sheet is already open (a content-replace, not a close→open):
- the previous `AW._trapFocus(sheet)` keydown listener is never removed → **two (or more) `keydown` handlers stack on `sheet`**, each firing `preventDefault` + `focus()` on Tab (listener leak + double focus handling); and
- `invoker` is overwritten with an element *inside* the now-open sheet (e.g. `.sheet-x`), so when the sheet finally closes, `close()` restores focus to a detached/replaced node → **focus silently drops to `<body>`** (broken focus-restore, a WCAG 2.4.3 regression).

**Failure scenario:** any sheet whose content contains a control that opens another sheet (very plausible as content grows — e.g. a citation sheet that links to a term gloss) triggers both defects on the second open. *Not currently reachable through the shipped UI* (the scrim intercepts background taps and no shipped sheet content re-opens a sheet), so this is latent — but it is a real defect and an asymmetry with the sibling overlay: `learn.html`'s `openPopFor` correctly calls `closePop()` first (disposing `popUntrap`) before opening. `AW.sheet` should be symmetric.

**Fix (trivial, safe, token-free):** at the top of `open()`, dispose any existing trap before replacing content, and capture `invoker` only when opening from a closed state so a content-replace keeps the original restore target:
```js
open: function (html, label) {
  ensure();
  if (trap) { trap(); trap = null; }                        // dispose a prior trap before replacing content (re-entrant singleton)
  if (!scrim.classList.contains('open')) invoker = document.activeElement;  // capture invoker only when opening from closed
  sheet.setAttribute('aria-label', label || 'Details');
  ...
  trap = AW._trapFocus(sheet);
}
```
**Disposition:** FIX this cycle.

---

## Suggestions (documented, not fixed — carried to the owner gate / backlog)

### S1 — `AwbaReview.result()` double-speaks the verdict word
**File:** `shared/awba-engine.js` (`result()` — ~lines 463–464)

`result()` both moves focus to `.rv-title` (SR reads the verdict heading) **and** calls `AW.announce(verdict + '. ' + correct + ' of ' + CH.length + ' named. +' + noorEarned + ' noor gathered.')`, whose leading word is the same `verdict`. A screen-reader therefore reads the verdict twice (once as the focused heading, once as the head of the live announce). This is *mild* and **spec-directed** — plan 06-05 truth #3 explicitly asked result() to "focus the result heading + announce the result stat once," and 06-05-SUMMARY already logged it as a known doubt for the human gate. It is the ONLY double-speak in the app (the six lesson reward screens are focus-only). The clean fix would be to drop the leading verdict from the announce (keep "N of M named. +X noor gathered.") since focus already reads it — but that both contradicts the explicit plan directive and would require editing the pinned a11y-announce assertion. **Disposition:** DOCUMENT — resolve at the 06-07 VoiceOver walk (item 5) where the owner hears it and decides; do not churn a pinned test for a mild, spec-directed nicety.

### S2 — `nodeHtml()` composes the node `aria-label` from unescaped `nd.label`
**File:** `learn.html` (`nodeHtml()` — ~line 253, `aria-label="' + ariaLabel + '"`)

`ariaLabel = nd.label + ', ' + statePhrase` is interpolated into a double-quoted attribute without escaping. All 23 shipped node labels are controlled content and contain no `"` (render-smoke passes; the sibling `.onode-label` innerHTML render already relies on the same safety), so there is no live bug. But a future label containing a straight double-quote would break the attribute. **Disposition:** DOCUMENT — the engine already exposes `AW.escapeAttr`; a defensive pass could route node labels through it if labels ever become less controlled. No action this cycle (controlled content, zero user input).

---

## Reviewed and confirmed sound (no finding)
- `AW.announce` / `.aw-sr`: `textContent`-only (no XSS sink), correct visually-hidden clip (not `display:none`), lazy + DCL region-ensure that survives the runners' init body-wipe and all subsequent child re-renders (06-04 test pins node identity + `isConnected`), synchronous last-write-wins is the intentional 06-05 deviation and is correct.
- `AW._trapFocus`: correct first↔last wrap incl. single-focusable (first===last) and container-focused (shift+Tab "not in list" → last) cases; keydown-on-overlay; `untrap()` disposer; `getClientRects()` visibility filter robust for the fixed-position sheet.
- Selection cue + real `disabled`: `aria-pressed` set/cleared correctly, 2→3px is a border-box width (no reflow, zero new hex), resolved + timeout-parked options + the class-only Check all get real `disabled` (leave the tab order) with the shipped guards kept as defence-in-depth.
- Reward focus-to-heading: every reward screen heading gets `tabindex="-1"` + `.focus()` after its `innerHTML` swap; the du'a close correctly targets `.close[tabindex="-1"]` (never the Arabic scripture `.close`); the returns screen focuses the static count, never the animating `#lsnoornum` countUp.
- learn.html popup: `openPopFor` is re-entry-safe (`closePop()` first disposes `popUntrap`); `aria-modal` + `aria-labelledby`→`.np-label#npLabel` + `tabindex=-1` + focus-move + trap + focus-return-if-connected all correct; the singleton fixed id is unique by construction.
- learn.html Festival: `__festUntrap` stored + disposed on both close paths (Escape + click), `nodeId` threaded through for the focus-return-after-`render()` re-query; the +25 claim-before-open ordering untouched.
- CSS: `.aw-sr` (no colour), the `[tabindex="-1"]:focus-visible` suppression (no operable control silenced), and the `.reg-sky-night/.nightfall .ls-back → --paper-62` contrast fix are all correct and token-only.
- Audit scripts: empirically validated by finding-history (see Summary); no false-pass evidence.
