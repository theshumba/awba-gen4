---
phase: 05-learn-page-cross-page-view-transitions
plan: 04
subsystem: ui
tags: [learn-page, node-popup, body-mount, placePop-anchoring, singleton, view-transitions, cross-document-morph, circuit-term, reduced-motion, progressive-enhancement, LRN-03, MOT-02, D-58, D-61]

# Dependency graph
requires:
  - phase: 05-03
    provides: "the winding node path — real <button class='onode'> stations carrying data-id/data-kind/data-nstate, the inner .onode-mark thermal square, the continue card + .cc-term, the daily-ayah .ayah/.oayah, the Ibrahim epigraph"
  - phase: 05-01
    provides: "AW.atomsDone (probed for the per-node seed-row count without exposing NODE_ATOMS), the mute exports"
  - phase: 04/03
    provides: "the shipped .btn (default Page-crimson) + .reg-orbit .btn override (the Pitfall-3 hazard the body-mount avoids), AW.sheet body-append/outside-tap/Esc precedent, the .journey lesson-opener Farag square, AW.icon('star'), @layer motion reduced-motion guards + order line, the boot-stamp typeof-document idiom"
provides:
  - "the node popup — a singleton cream slip mounted on document.body (never inside .reg-orbit so its CTA resolves to the visible Page-crimson .btn), anchored via getBoundingClientRect with edge-clamping + arrow offset (--ax) + above/below flip, outside-tap + Esc close, aria-expanded on the trigger"
  - "popup contents per §S4 copy table: label + binary-done seed-row (R-2) + star row (done) + the verbatim per-state CTA (START·earn noor / REVIEW·improve your stars / START / LEGENDARY AGAIN); locked = gentle 'Not yet — finish what comes before.' microcopy, NO CTA (D-54); chest = the gift copy (available/already-opened), claim hook window.__awbaClaimChest stubbed for 05-05"
  - "click-time shared-element morph source: CTA/continue-card sets window.__awbaMorphEl to the tapped .onode-mark / .cc-term square before navigating"
  - "cross-document View Transitions inherited by ALL 20 pages: @view-transition{navigation:auto} top-level high in awba-engine.css (Pitfall 1), the reduced-motion VT kill block in @layer motion (both triggers), and the guarded pageswap/pagereveal handlers stamping/clearing ONE circuit-term pair (node square ↔ .journey), file:// = clean no-op"
  - "render-smoke.mjs file:// learn→u1-m1 navigation check (proves the e.viewTransition guard never throws over an opaque origin)"
affects: [05-05, 05-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "the node popup is a Page object mounted on document.body (the AW.sheet exemption), NEVER inside .reg-orbit — so its .btn CTA gets the default Page-crimson fill (rgb(163,44,33)) not the invisible .reg-orbit cream-on-cream (Pitfall 3, proved in a headless probe: ctaBg=rgb(163,44,33))"
    - "placePop anchors by the LEFT edge (clamped-centre − half) so the settle animation keeps its transform; the arrow (::after) tracks the station via --ax = nodeCentre − clampedCentre even when the slip is clamped; above/below flip by available viewport space"
    - "singleton via a single openPop/popNode pair (opening one removes any other + resets its trigger aria-expanded); a re-tap on the same station toggles closed; render() calls closePop() first because app.innerHTML detaches the old stations"
    - "the per-node seed-row count is read WITHOUT exposing the engine-private NODE_ATOMS map — a single-star probe through the pure AW.atomsDone({stars:{[id]:1}}) returns NODE_ATOMS[id]||0 (reviews/chests → 0 → no seed-row)"
    - "@view-transition{navigation:auto} is a TOP-LEVEL document descriptor placed high in awba-engine.css immediately after the immutable @layer order line (Pitfall 1) — NOT inside a cascade layer; the order line stays declared exactly once"
    - "the reduced-motion VT kill block (::view-transition-group/old/new(*){animation:none!important}) lives in @layer motion beside the shipped guards, both triggers (prefers-reduced-motion AND [data-motion=reduce]); author !important beats the UA cross-fade"
    - "the one shared-element morph is stamped at CLICK TIME in the SHARED engine's guarded pageswap/pagereveal handlers (mirroring the boot-stamp typeof-document guard): pageswap stamps window.__awbaMorphEl, pagereveal stamps document.querySelector('.journey'), BOTH clear after e.viewTransition.finished (uniqueness — exactly one circuit-term box per page at snapshot); if(!e.viewTransition)return makes file:// / unsupported a clean plain-nav no-op"
    - "scripture is NEVER a morph source — no .ayah/.scard/epigraph element is ever handed into __awbaMorphEl or stamped (D-58); proved in a headless synthetic-event probe (scriptureNamedSwap/Reveal=none)"

key-files:
  created:
    - ".planning/phases/05-learn-page-cross-page-view-transitions/05-04-SUMMARY.md"
  modified:
    - "learn.html — the node popup module (placePop anchoring, singleton open/close, outside-tap+Esc), state-derived popContent (seed-row/star row/per-state CTA/locked microcopy/chest copy), wireCta (nav morph source + chest claim stub), the continue-card morph source"
    - "shared/awba-engine.css — .npop + arrow + seed/star/CTA classes in @layer screens; @view-transition{navigation:auto} top-level high; the reduced-motion VT kill block in @layer motion; reworded a pre-existing daily-ayah comment off the literal morph property name"
    - "shared/awba-engine.js — the guarded pageswap/pagereveal shared-element name-stamp handlers (covers all 20 pages, zero per-page edits)"
    - "scripts/tests/render-smoke.mjs — a file:// learn→lessons/u1-m1.html navigation check (throwaway repo-root probe, cleaned up in finally)"

key-decisions:
  - "The popup mounts on document.body (R-4 / Pitfall 3) so its CTA resolves to the visible Page-crimson .btn — confirmed in a headless click probe (onBody=yes, ctaBg=rgb(163,44,33)); an in-.reg-orbit mount would have rendered cream-on-cream invisible CTAs"
  - "The seed-row per-node count is obtained via AW.atomsDone({stars:{[id]:1}}) (a single-star probe) rather than exposing NODE_ATOMS — keeps the engine map private and needs no engine export (Task 2 is learn.html-only); reviews/chests resolve to 0 dots"
  - "R-2 binary-done seed-row: all dots inked (full --madder) together iff the station is done, faint --madder at rest — never a live 3/5 partial (per-atom progress is not persisted, Pitfall 5)"
  - "The chest 'available' CTA (label 'Open the gift') calls window.__awbaClaimChest(id) if defined — a no-op stub until 05-05 lands the Festival claim; never randomized; the 'done' chest shows 'Already opened. The light stayed with you.' with no CTA"
  - "@view-transition is a top-level document descriptor placed immediately after the @layer order line (Pitfall 1: buried-in-a-layer or too-late risks being ignored); the order line count stays 1 — the positional verify (@view-transition line 23 < first @layer screens line 930) passes"
  - "The morph is stamped in the SHARED engine (one block covers all 20 pages, no per-page edits), guarded like the boot-stamp (typeof document) so the headless ls-stub vm (no window/document) never runs it and localStorage stays exactly 13; the handlers touch no storage"
  - "The continue-card morph source is .cc-term (a short single-line span → a single box in practice); it degrades to a plain cross-fade if it ever wraps — the robust primary morph is the node .onode-mark (a real 44px box). Flagged for the 05-06 gate"
  - "Reworded a pre-existing wave-2/3 daily-ayah CSS comment that still carried the literal morph property name (HARD RULE 6) to 'never a shared-element morph source (D-58)' — a file I was already editing; de-risks the 05-06 static-VT grep (Rule 1)"

metrics:
  tasks_completed: 3
  duration: "~1 session"
  completed: 2026-07-14
  suite: "107/107 (unchanged — the VT handlers are typeof-document-guarded, skipped headless; render-smoke.mjs is a tool, not a *.test.js)"
  render_smoke: "20/20 SMOKE OK + 1 vt-nav check (file:// learn→u1-m1 clean)"
  layer_order_line_count: 1
  view_transition_position: "line 23 (< first @layer screens at line 930) — Pitfall-1 positional check PASS"
  localStorage_in_learn_html: 0
  engine_localStorage_count: 13 (unchanged)
  glyph_count: 13 (unchanged)
  static_view_transition_name_in_learn_or_css: 0
---

# Phase 5 Plan 04: Node Popup + Navigation Wiring + Cross-Document View Transitions Summary

Tapping a station now opens its slip of paper and START/REVIEW/LEGENDARY carries the learner to the lesson with a calm native page morph — the dead links come alive. The popup is a singleton cream Page object mounted on `document.body` (so its CTAs are the visible Page-crimson `.btn`, never the invisible cream-on-cream override), anchored to its station with edge-clamping + an arrow offset, closing on outside-tap and Esc. Its contents derive live from state: a binary-done seed-row, a star row for done stations, the verbatim per-state CTA, and the gentle "not yet" microcopy for locked stations — never a buzzer or a red. Cross-document View Transitions are opted in for all 20 pages from the one engine stylesheet, and a single guarded `circuit-term` morph tweens the tapped node's square into the lesson opener's `.journey` square, degrading to a clean plain navigation over `file://` / unsupported browsers with no fallback code.

## What shipped (per task)

- **Task 1 — the node popup: body-mounted singleton + placePop anchoring (`bbb0fca`):** a new `.npop` class in `@layer screens` (cream ground, `--r-3`, `--sh-2` warm-ink lift, `--sp-3` inner, an arrow `::after` offset by `--ax` with an above/below flip). In learn.html a singleton popup mounts on `document.body` (R-4 / Pitfall 3 — never inside `.reg-orbit`), anchored via `getBoundingClientRect`: node centre `nx`, popup centre clamped into `[half+6, innerWidth−half−6]`, positioned by its left edge (leaving the settle animation's transform free), `--ax = nx − cx` so the arrow tracks the station even when clamped. Singleton (opening one removes any other + resets its trigger's `aria-expanded`); outside-tap (a document listener ignoring `.npop`/`.onode`) + Esc close; `aria-expanded` on the trigger; `render()` drops any open slip since `app.innerHTML` detaches stations.
- **Task 2 — popup contents + CTAs + locked microcopy + morph source (`6348291`):** `popContent(node)` builds from the live-derived state — the label (`--fs-h2`), the R-2 **binary-done seed-row** (`NODE_ATOMS[id]` dots via an `AW.atomsDone` single-star probe, faint `--madder` at rest, all inked together iff done), the **star row** for done lesson/review nodes (1–3 gold `AW.icon('star')` + hollowed unearned), and the **CTA per the copy table**: lesson not-begun `START · earn noor` / lesson done `REVIEW · improve your stars` / review not-begun `START` (subtitle "A gold, timed mastery run. Nothing can be lost.") / review done `LEGENDARY AGAIN`. Locked stations show `Not yet — finish what comes before.` with **NO CTA** (D-54 — never a buzzer/shake/red). Chest stations show `A gift of light` + `+25 noor, for finishing the unit. It is yours to keep.` (available, CTA calls the stubbed `window.__awbaClaimChest`) or `Already opened. The light stayed with you.` (done). `wireCta` sets `window.__awbaMorphEl` to the tapped `.onode-mark` at click time before the `<a href>` navigates; the continue-card CTA sets `.cc-term`. No celebration primitive in any lesson/locked popup.
- **Task 3 — cross-document View Transitions (`51a4c0e`):** `@view-transition { navigation: auto; }` added as a **top-level** at-rule high in `awba-engine.css` immediately after the immutable `@layer` order line (Pitfall 1, NOT inside a layer); the order line stays declared once. The **reduced-motion VT kill block** (`::view-transition-group/old/new(*){animation:none!important}`) added inside `@layer motion` beside the shipped guards under **both** triggers. In `shared/awba-engine.js`, a **guarded** (`typeof document`) block adds `pageswap` (stamps `window.__awbaMorphEl` with `circuit-term`) and `pagereveal` (stamps `document.querySelector('.journey')` with the same name) handlers, each `if(!e.viewTransition)return` and each **clearing the mark after `finished`** (uniqueness — exactly one `circuit-term` box per page at snapshot); scripture is never a source. Because the engine loads on all 20 pages, this one block covers every page with **zero per-page edits**. `render-smoke.mjs` gained a `file://` `learn→lessons/u1-m1.html` navigation check (a throwaway repo-root probe, cleaned up in `finally`) proving the guard never throws.

## Verification evidence

- Every per-task `<verify>` passed verbatim (`TASK1/2/3 VERIFY: PASS`), including the **MOT-02 positional check**: `@view-transition` at **line 23** < first `@layer screens` at **line 930**, and the order-line count held at **1**.
- **Popup behaviour (headless-Chrome click probe, throwaway `learn.html` copy):** `open=yes`, `onBody=yes` (mounted on document.body), `cta=START · earn noor` (correct verbatim CTA for the fresh-install active u1m1), `aria=true` (aria-expanded set), `inViewport=yes` (edge-clamped), `side=below`, `ctaBg=rgb(163,44,33)` (**Page-crimson — Pitfall 3 defeated, CTA visible not cream-on-cream**), `singletonCount=1` (opening the locked station closed the active one), `lockMicro=Not yet — finish what comes before.`, `lockCta=none` (locked has no CTA), `activeAriaAfterSwap=false` (previous trigger reset), `afterOutsideCount=0` (outside-tap closes).
- **Morph stamping (headless-Chrome synthetic-event probe):** `swapStamped=circuit-term`, `countAtSnapshot=1` (**exactly one element carries the name at snapshot — uniqueness**), `scriptureNamedSwap=none` + `scriptureNamedReveal=none` (**scripture never stamped**, D-58), `revealStamped=circuit-term` (the `.journey` opener gets the same name), `guardNoStamp=yes` (a null `viewTransition` — file:// / unsupported — stamps nothing), `swapClearedAfterFinished=yes` + `revealClearedAfterFinished=yes` (**both marks cleared after `finished`**).
- **render-smoke:** 20/20 `SMOKE OK` (the 20 pages hold) **plus** `SMOKE OK vt-nav learn→lessons/u1-m1.html (file:// morph no-ops cleanly)` — the file:// navigation produces zero `SEVERE`/`Uncaught`, proving the `e.viewTransition` guard never throws.
- Suite **107/107** (the VT handlers are `typeof document`-guarded so the ls-stub vm — no window/document — never runs them; render-smoke.mjs is a tool, not a `*.test.js`). `localStorage` grep-count in the engine **13** (the handlers touch no storage). `localStorage` in learn.html **0**. `@layer` order line count **1**. Static `view-transition-name` in learn.html + CSS **0** (dynamic stamping only). `validate-content.js --self-test` exit 0; `port-audit` exit 0 (`DAILY BYTES OK`, holds intact). Gated-literal sweep of all four modified files **clean**.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — grep-gate hygiene] The VT-handler comment word "localStorage" bumped the engine grep-count to 14**
- **Found during:** Task 3 verify (`test "$(grep -c 'localStorage' shared/awba-engine.js)" -eq 13` failed at 14).
- **Issue:** My new handler comment ended "Touches no localStorage." — the grep counts every line containing the literal string, comments included, so the reassuring comment tripped the D-24 storage-surface gate.
- **Fix:** Reworded to "Reads/writes no storage." No behaviour change; the handlers genuinely touch no storage. Count back to 13.
- **Files:** shared/awba-engine.js. **Commit:** folded into `51a4c0e`.

**2. [Rule 1 — grep-gate hygiene] Reworded a pre-existing daily-ayah comment off the literal morph property name**
- **Found during:** the pre-commit 05-06-gate self-check (`grep -c view-transition-name learn.html shared/awba-engine.css`).
- **Issue:** a wave-2/3 daily-ayah comment (line ~1828) still read "it never carries a view-transition-name." — HARD RULE 6 forbids the literal morph property name even in comments, and the future 05-06 gate greps learn.html/CSS for a static VT name. My own new comments already avoid the literal (they say "shared-element morph" / "two same-named boxes"). Since I was already editing this file, I reworded the stray comment to "it is never a shared-element morph source (D-58)." to close the latent gate-tripper.
- **Files:** shared/awba-engine.css. **Commit:** folded into `51a4c0e`. No behaviour change (comment only).

### Interpretation notes (not deviations — prescribed discretion)

- **VERBATIM-CONTENT vs GREP GATE (HARD RULE 5):** none of this plan's verifies grep negatively for "thread", so the byte-verbatim U3-m3 label **"One religion, one thread"** was untouched and needed no scoped proof this wave.
- **Continue-card morph source (Claude's discretion / graceful-degradation):** the continue card sets `window.__awbaMorphEl` to `.cc-term` (a short single-line span → a single box in practice). If it ever wrapped across lines the browser would skip that element and fall back to a plain cross-fade (no error). The robust primary morph remains the node `.onode-mark` (a real 44px box). Flagged for the 05-06 gate.
- **Chest CTA label:** the copy table fixes the chest title/body but no CTA label; I used the calm authorial "Open the gift" (UI copy, not scripture) on the available chest, wired to the stubbed 05-05 claim hook.

## Known Stubs / Owner-Ledger Items

| Item | File / line | Reason | Resolves in |
|------|-------------|--------|-------------|
| Chest claim behaviour | learn.html `wireCta` (`window.__awbaClaimChest(id)` if defined — a no-op until then) | RWD-04/D-56/S5: this plan renders the chest popup copy + wires the claim hook; the +25-noor write-once claim and the Festival circuit-plate interstitial land in 05-05 | 05-05 |
| Arabic unit chapter-terms | continue-card `.cc-term` (English titles) — inherited from 05-02/05-03 | R-6: the 15 verified Aref-Ruqaa Arabic terms are owner/scholar-sourced; the mechanism is shipped, the English title is the fallback | owner ledger |

## Doubts for the 05-06 human gate

- **Popup anchoring on a real 320px device:** the slip width is `min(16rem, 100vw−--sp-8)` and clamps its centre into the viewport with a 6px margin + the above/below flip. Confirm on a real narrow device it never clips off-screen at the first/last serpentine stations and the arrow still points sensibly at the station.
- **Popup CTA-crimson on cream over the dark world:** the CTA is the default Page-crimson `.btn` (6.13:1 on cream). Confirm it reads as the clear primary action and the cream slip lifts convincingly off the Kiswah ground (`--sh-2`).
- **Locked "not yet" tone:** confirm the gentle microcopy (no CTA, quiet `--ink-62`, no shake/red) reads as an invitation to keep walking, not a wall (D-54).
- **The native page morph on real Safari 18.2+/Chrome ≥126 over http(s):** file:// double-clicks (the review workflow) navigate plainly with no morph by design (opaque origin) — the `circuit-term` node→`.journey` tween can only be judged on a served origin. Confirm on a deploy/preview that the square-to-chapter-term morph reads calm (≤300ms) and that scripture never moves.
- **Continue-card morph source robustness:** `.cc-term` is an inline span; if a future longer chapter-term wraps, the morph silently falls back to a cross-fade. Confirm the current terms don't wrap, or promote `.cc-term` to an inline-block Farag square in a later polish.
- **Seed-row read in the popup:** the binary-done seed-row (faint madder → inked madder) sits above/below the star row for done nodes; confirm the two rows read as distinct signals (atoms inked vs stars earned) and aren't confused at small size.
- Requirement rows LRN-03 / MOT-02 substance now renders live; left `[ ]` Pending in REQUIREMENTS.md for the 05-06 gate to mark (the requirement text demands the live rendered/served experience the gate walks).

## Self-Check: PASSED
- learn.html + shared/awba-engine.css + shared/awba-engine.js + scripts/tests/render-smoke.mjs modified and committed (`bbb0fca`, `6348291`, `51a4c0e`) — verified present in `git log`.
- 05-04-SUMMARY.md created at `.planning/phases/05-learn-page-cross-page-view-transitions/`.
