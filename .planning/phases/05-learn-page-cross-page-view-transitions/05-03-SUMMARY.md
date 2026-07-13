---
phase: 05-learn-page-cross-page-view-transitions
plan: 03
subsystem: ui
tags: [learn-page, orbit-register, unit-headers, winding-path, node-grammar, thermal-states, svg-thread, ink-draw-static, ibrahim-epigraph, hash-autoscroll, resize-observer, LRN-02, LRN-04, CNT-03]

# Dependency graph
requires:
  - phase: 05-02
    provides: "learn.html Orbit shell (root-relative head, HUD, static Ring hero, streak/constellation, navy continue card, daily ayah), the UNITS port + flat CNT-03 unlock sequence + per-node unit meta, the @layer screens Orbit block"
  - phase: 05-01
    provides: "AW.atomsDone/NODE_ATOMS (Σ=61), the shipped AW.deriveNodeState seam (extended, never forked)"
  - phase: 04/03
    provides: "the shipped thermal [data-state] shapes, .thread + ink-draw keyframe, .rosette/.plate celebration primitives, breathe keyframe + [data-ambient]/sky-breathe reduced-motion stops, AW.icon/UNIT_ICON/GLYPHS, AW.reducedMotion"
provides:
  - "the four unit-header cards (cream-Farag-square-fronted: gold AW.UNIT_ICON scene + English chapter-term + desc; NO colour-coding, NO SECTION eyebrow)"
  - "the winding node path — real <button> stations on a serpentine (--lane), live data-state from AW.deriveNodeState mapped to the shipped thermal/rosette/plate grammar"
  - "one continuous SVG ink thread per section through node-mark centres (Catmull-Rom smooth), faint navy base + earned gold sub-path via the shipped .thread, STATIC on load (law 9 — no ink-draw replay)"
  - "the Ibrahim 14:24 Courier epigraph (R-7 owner-ledger fallback — no scripture generated)"
  - "D-61 auto-scroll (next available node, or a #<node-id> validated against the UNITS id set) + a ResizeObserver/load/resize thread recompute (320→desktop)"
affects: [05-04, 05-05, 05-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "node data-state is on the inner .onode-mark (drives the shipped [data-state] shapes); the button carries data-nstate (private, raw locked/available/active/done) for earned-thread logic + 05-04 popup wiring — so the shipped [data-state] rules never paint the whole button"
    - "the earned gold thread re-inks via the SHIPPED .thread class but is made STATIC by a @layer screens .op-thread{animation:none} override (screens > components for normal declarations) — the earned road never replays (law 9 / W8 correction)"
    - "gold earned extent = stroke-dasharray to arcLenAtPoint(lastDoneNode) on the same d as the navy base (getPointAtLength sampling → smoothing-agnostic, exact at node centres)"
    - "the single active-node breathe is the ONLY path ambient — a data-ambient element the shipped @layer motion [data-ambient]{animation:none!important} stills under both reduced-motion triggers"
    - "the winding thread d is recomputed from .onode-mark getBoundingClientRect centres AFTER layout on load + resize + ResizeObserver (attached once; #app persists across re-renders)"
    - "a #<node-id> hash is validated against the known UNITS id set BEFORE use (V5 / T-05-03a) — the raw hash only reaches querySelector as a proven-known id, never a markup sink"

key-files:
  created:
    - ".planning/phases/05-learn-page-cross-page-view-transitions/05-03-SUMMARY.md"
  modified:
    - "learn.html — unit headers + winding node path + node grammar + SVG thread (earned gold static) + Ibrahim epigraph + hash auto-scroll + the SPROUT R-3 doodle"
    - "shared/awba-engine.css — new @layer screens content only (order line untouched, count stays 1): .ojourney/.ounit*/.opath, .onode*/.op-rosette/.op-plate, .op-thread*, .oibrahim/.oib-*"

key-decisions:
  - "Unit-header Farag square carries the English unit title ONCE (kiswah-on-cream 16.22:1, R-6 fallback — Arabic terms are owner-sourced, never invented); the gold AW.UNIT_ICON scene sits on the dark card (8.40:1). No duplicate standalone h2 (avoids redundant title) — satisfies acceptance ('English-title chapter-term in a cream Farag square') without visual repetition"
  - "Node visuals map from AW.deriveNodeState (consumed, never forked): lesson locked=hollow powder ring+lock (no breathe), active=ember half-dab + the ONLY path breathe, done=filled gold+check+Courier star count+one sprout; review=gold rosette (filled .rosette seal when done, gold rosette FRAME+trophy when not-yet); chest=plate-framed gift node (folk keyline + chest glyph + label). Crimson never touches the Orbit ground"
  - "The earned gold thread is STATIC on load — .op-thread overrides the shipped .thread ink-draw to animation:none (law 9; the W8 correction — the draw verb belongs to lesson-complete on the reward page, no surface replays the path thread). 'Path animates' = node-entrance settle stagger + thermal state flips only"
  - "The winding layout is a serpentine via a per-node --lane (0.5 + 0.34·sin(flatIdx·1.15)); the SVG thread (Catmull-Rom through node-mark centres) is the hero read, stations are beads — deliberately NOT alternating Duolingo circles"
  - "R-7 (Ibrahim 14:24): the verbatim Clear-Quran 'good word / good tree' line is NOT in Josh's corpus (only 14:22/14:27/14:35 exist), so NO scripture is generated — the epigraph renders an authorial framing line ('A place to learn the one word, and let it settle in.') + the reference + 'translation pending review'; the verified 14:24 splice is an owner-ledger item that replaces the framing line later"
  - "The R-3 MVP plant stamp is ONE small inline decorative sprout doodle (an ATHAR-asset-kit mark, token-only var(--gold), NOT an AW.icon glyph — glyphCount stays frozen at 13); the full ~20-doodle pool is the D-55 fast-follow"

metrics:
  tasks_completed: 3
  duration: "~1 session"
  completed: 2026-07-14
  suite: "107/107 (unchanged — no JS/test files touched; learn.html + CSS only)"
  render_smoke: "20/20 SMOKE OK (learn.html + 19 lessons/reviews)"
  layer_order_line_count: 1
  localStorage_in_learn_html: 0
  engine_localStorage_count: 13 (unchanged)
  glyph_count: 13 (unchanged)
---

# Phase 5 Plan 03: Unit Headers + Winding Path + Node Grammar + Gold Thread + Ibrahim Line Summary

The navigable index below the Ring now renders in full: four calm cream-Farag-square unit headers (chapter-term + gold scene icon, no colour-coding), a hand-inked winding path of real `<button>` stations on a serpentine threaded by one continuous SVG ink line whose earned portion re-inks gold and stays STATIC on load, the thermal/rosette/plate node grammar mapped live from the shipped `AW.deriveNodeState`, the Ibrahim 14:24 Courier epigraph (R-7 owner-ledger fallback — no scripture generated), and the D-61 auto-scroll (next node, or a hash validated against the UNITS id set) kept accurate 320→desktop via a ResizeObserver.

## What shipped (per task)

- **Task 1 — unit headers (`4baa97d`):** one cream-Farag-square-fronted card per unit — the gold `AW.UNIT_ICON` scene (compass/lanterns/kaaba/mosque, `--icon-accent` gold on the dark card) + the English chapter-term in a cream Farag square (`--r-square`, kiswah-on-cream, R-6 fallback) + the desc (`--paper-62`). No `u.color` gradient, no "SECTION n" eyebrow (both retired). Each header precedes its unit's `.opath`. New `@layer screens`: `.ojourney/.ounit/.ounit-head/.ounit-ic/.ounit-term/.ounit-desc/.opath`.
- **Task 2 — winding nodes + thermal grammar (`476963c`):** each node a real `<button class="onode">` on a serpentine `--lane`; the inner `.onode-mark` carries the derived `data-state` (lessons) so the shipped `[data-state]` shapes paint it; the button carries a private `data-nstate` (raw state) for earned/popup logic. Locked=hollow powder+lock (no breathe); active=ember half-dab + the ONLY path breathe (a `data-ambient` the shipped reduced-motion block stills); done lesson=filled gold+check+Courier star count+one R-3 sprout; review=gold rosette (filled shipped `.rosette` seal when done — resized + made static; gold rosette FRAME+trophy when not-yet); chest=plate-framed gift node (folk keyline + `AW.icon('chest')` + label). One-pass staggered settle entrance (≤270ms/section), skipped under reduced motion.
- **Task 3 — SVG thread + earned gold + Ibrahim + auto-scroll (`6209f35`):** one `<svg>` per section drawing a faint navy base `<path>` through node-mark centres (Catmull-Rom smooth) + an earned gold sub-path via the shipped `.thread`, drawn to `stroke-dasharray = arcLenAtPoint(lastDoneNode)` and STATIC (`.op-thread{animation:none}` overrides the ink-draw; `stroke-dashoffset:0`, no replay). Recomputed after layout on load + resize + ResizeObserver. The Ibrahim 14:24 Courier epigraph (R-7 fallback). D-61 auto-scroll to the next available node or a validated `#<node-id>`.

## Verification evidence

- Every per-task `<verify>` passed verbatim (`TASK1/2/3 VERIFY: PASS`).
- **Node-state walk (CNT-03, headless via the shipped `AW.deriveNodeState`):** fresh → `u1m1 active`, all 22 others `locked`; `{u1m1}` → `u1m1 done, u1m2 active`; all u1 lessons → `u1r active`; `+u1r` → `u1r done, u1c AVAILABLE (chest after its review has stars), u2m1 active`; `+u1c claimed` → `u1c done`. Strictly sequential incl. m2/m3b/m2b splits, review-after-lessons, chest-after-review. Matches Gen-3 exactly.
- **Seeded live browser render (headless Chrome DOM dump, throwaway copy):** states walk correctly (u1m1–3 `done`, u1m4 `active`, rest `locked`); done mark = `data-state="mastered"` + check + stars + sprout; the u1 gold thread shows with `--len:297.43`, `stroke-dasharray: 297.432, 744.579; stroke-dashoffset: 0` (drawn to the last done node, STATIC). Fresh render: gold thread `display:none` (nothing earned), navy base drawn through centres.
- Suite **107/107** (no JS/test files touched); render-smoke **20/20 SMOKE OK**; `@layer` order line count **1**; `localStorage` in learn.html **0**; engine `localStorage` count **13** (unchanged); glyph count **13** (unchanged); no `view-transition-name` declaration anywhere (05-04 owns VT); gated-literal sweep of learn.html and my CSS additions CLEAN.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Gated literal in comments] Reworded two comments to drop gated substrings**
- **Found during:** Task 2 verify (`! grep -qiE 'IC_CHEST|...|amber|mascot'`) failed.
- **Issue:** My own descriptive comments (in learn.html and awba-engine.css) contained "white/amber" and "IC_CHEST" while describing the *retired* Gen-3 treasure-box art — gated literals are forbidden even in comments (HARD RULE 6 / PATTERNS "never in shared/ comments").
- **Fix:** Reworded to "the Gen-3 treasure-box art stays retired" (no gated substring). No behaviour change.
- **Files:** learn.html, shared/awba-engine.css. **Commits:** folded into `476963c`.

**2. [Rule 1 — grep-gate hygiene] Reworded a `view-transition-name` mention in my new CSS comment**
- **Found during:** post-Task-3 sweep — `grep -c view-transition-name shared/awba-engine.css` = 2.
- **Issue:** Both were in *comments* documenting the D-58 prohibition (line 1821 is the pre-existing shipped 05-02 comment — out of scope; line 2000 was mine). No actual `view-transition-name` property is declared. To honour HARD RULE 5 ("no view-transition-name anywhere yet") as tightly as possible and avoid any grep-gate confusion at the 05-06 gate, I reworded my comment to "never a shared-element morph (D-58)". The shipped 05-02 comment was left untouched (SCOPE BOUNDARY).
- **Files:** shared/awba-engine.css. **Commit:** folded into `6209f35`.

### Interpretation notes (not deviations — prescribed fallbacks / discretion)

- **VERBATIM-CONTENT vs GREP GATE (HARD RULE 1):** the byte-verbatim U3-m3 node label **"One religion, one thread"** contains the substring "thread". Task 3's positive `grep -qE 'thread'` is a *true* positive (the `.op-thread`/`.thread` classes are present by design), and no negative grep matches the label — so the label was left untouched (content law). No edit needed this wave.
- **R-7 Ibrahim 14:24 (owner-ledger, prescribed fallback):** the verbatim Clear-Quran "good word / good tree" line is **not** in Josh's corpus (searched: only Ibrāhīm 14:22/14:27/14:35 exist). Per R-7 / HARD RULE 4 the verse was **not generated**; the epigraph renders an authorial framing line + reference + "translation pending review". See Known Stubs.

## Known Stubs / Owner-Ledger Items

| Item | File / line | Reason | Resolves in |
|------|-------------|--------|-------------|
| Ibrahim 14:24 verse text | learn.html `.oibrahim` (`A place to learn the one word, and let it settle in.` + `Ibrāhīm 14:24 · translation pending review`) | R-7: verbatim Clear-Quran 14:24 is absent from Josh's corpus; content integrity forbids generating it. The authorial framing line + pending marker is the sanctioned fallback until the owner supplies the verified splice. | owner ledger (drop-in splice; no code change beyond the line) |
| Arabic unit chapter-terms | learn.html `.ounit-term` (English titles) | R-6: the 15 verified Aref-Ruqaa Arabic terms are owner/scholar-sourced; the mechanism (cream Farag square) is shipped, the English title is the fallback. | owner ledger |
| Full plant-doodle pool | learn.html `SPROUT` (one sprout) | R-3/D-55 MVP: one sprout stamp on done lessons; the bounded ~20-doodle pool is the fast-follow. | D-55 fast-follow |

## Doubts for the 05-06 human gate

- **Serpentine geometry / thread read on 320px:** the `--lane` amplitude (0.34) + 6.5rem node width keep stations in-bounds and the Catmull-Rom thread flowing; confirm on a real 320px device it reads as a hand-inked journey (not cramped) and the gold earned road is legible against the faint navy base on the Kiswah ground.
- **Navy base thread contrast:** `--navy` on Kiswah is deliberately faint (the "un-inked road", mirroring the shipped `.rv-arc` precedent). Confirm the un-earned path is visible-but-quiet on-device and not lost.
- **Unit-header title-once decision:** the English title lives only in the cream Farag square (no duplicate h2). Confirm the owner reads this as the intended "chapter-term emblem" and not a missing running title.
- **Ibrahim epigraph fallback voice:** confirm the authorial framing line + "translation pending review" is acceptable until the verified 14:24 splice arrives (no scripture was generated).
- **Sprout stamp scale/read:** the single gold sprout beneath a done lesson — confirm it reads as "growth" at ~14px and doesn't compete with the star count.
- **Done-node star count as gold star glyphs:** rendered as 1–3 gold `AW.icon('star')` beneath the node (the "star count"); confirm this is the intended read vs a Courier numeral.
- Requirement rows LRN-02 / LRN-04 / CNT-03 substance now renders live; left `[ ]` Pending for the 05-06 gate to mark (LRN-02's locked-node "gentle not-yet on tap" popup is 05-04's surface).

## Self-Check: PASSED
- learn.html + shared/awba-engine.css modified and committed (`4baa97d`, `476963c`, `6209f35`) — verified present in `git log`.
- 05-03-SUMMARY.md created at `.planning/phases/05-learn-page-cross-page-view-transitions/`.
