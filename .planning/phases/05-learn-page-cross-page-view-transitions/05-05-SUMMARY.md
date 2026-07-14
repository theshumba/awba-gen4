---
phase: 05-learn-page-cross-page-view-transitions
plan: 05
subsystem: ui
tags: [learn-page, shared-sheet-singleton, streak-sheet, noor-sheet, course-switcher, tab-bar, gold-active-override, R-5, chest-claim, idempotent, festival-interstitial, circuit-plate, reduced-motion, LRN-06, LRN-07, RWD-04, D-56, D-60]

# Dependency graph
requires:
  - phase: 05-04
    provides: "the node popup + wireCta chest hook (window.__awbaClaimChest, stubbed) it now implements; the HUD/streak/continue surfaces to make live"
  - phase: 05-02
    provides: "the HUD marginalia (course chip + returns/noor .hstat + mute), the streak strip + AW.weekCal constellation, the AW.sheetRef ayah cite sheet precedent"
  - phase: 04/03
    provides: "the shipped AW.sheet singleton (body-append, outside-tap+Esc, scroll-lock), .sheet-row/.grip, the .tab/.tab.active crimson rule + the .rv-shell gold-override precedent, the Festival primitives (.reg-festival ground, .plate/stamp, .rosette, the .rv-ringdabs crowd-drift, .dab/drift, .thread/ink-draw), AW.deriveNodeState, AW.S write-once seam, AW.ringSeed, AW.reducedMotion"
provides:
  - "the ONE shared sheet family (LRN-06): three sheet-builder functions each a single AW.sheet(html) call on the shipped singleton (no bespoke sheet DOM) — the streak sheet (Marcellus returns count + day/days + AW.weekCal week row + verbatim never-breaks note) opened from the HUD returns stat AND the streak strip AND the Returns tab (ONE implementation), the noor sheet (gold-filled Marcellus count + verbatim noor note) from the HUD noor stat, the course switcher (Aqeedah ACTIVE olive pill + Fiqh/Seerah/Qur'an as calm COMING SOON rows, never disabled-dead) from the HUD course chip"
  - "the tab bar (LRN-07): Learn active with the R-5 GOLD active cue on Orbit (a .reg-orbit .tab.active override + 2px gold top-rule in @layer screens, mirroring the .rv-shell precedent — crimson is 2.65:1 on Kiswah, banned; the shipped crimson .tab.active rule is OVERRIDDEN, never edited); every inactive tab opens a designed coming-soon AW.sheet (Practice/Profile/More) and Returns → the streak sheet — never a dead tap"
  - "the chest claim (RWD-04): window.__awbaClaimChest grants +25 noor EXACTLY ONCE via a write-once guard on the chests slot in AW.S (deterministic, never randomized, idempotent — a second claim is a no-op); Rule-2-hardened to only claim a real, earned (available), unopened chest"
  - "the Festival circuit-plate interstitial (D-56): a SEPARATE .reg-festival threshold overlay on document.body (the learn screen stays Orbit, law 1) — the dated folk .plate stamps in (Rakkas title valid only in this threshold), a CIRCLE crowd-arrival of ink .dab drift-settle around a small Ring, that circuit's gold thread arc closes; private, maker's-marked with date + ring seed in Courier; reduced motion renders it final-static and the +25 is granted regardless"
affects: [05-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "the shared sheet family rides the ONE shipped AW.sheet singleton — every sheet is a single AW.sheet(html) call, no duplicated sheet DOM (headless probe: 4 AW.sheet call sites = streak/noor/switcher/coming-soon; the streak sheet is opened from 3 surfaces via one openStreakSheet function)"
    - "the R-5 tab-gold-on-Orbit fix is an OVERRIDE not an edit: .reg-orbit .tab.active { color/box-shadow: gold } in @layer screens outranks the shipped .tab.active crimson (@layer components) by layer order — the crimson rule survives untouched for cream pages (verified: shipped rule intact at css:756-758, gold override at css:2158-2159)"
    - "the chest claim is a write-once guard on the AW.S chests slot: var chests=AW.state().chests (a defensive copy — AW.S.get clones object values); if(chests[id])return; chests[id]=true; AW.S.set('chests',chests); AW.S.set('noor',AW.S.get('noor',0)+25) — +25 exactly once, deterministic, no Math.random on the reward path"
    - "the Festival interstitial is a SEPARATE threshold overlay appended to document.body with class 'ofest reg-festival' (never inside #app.reg-orbit) — so the loud Festival register (Rakkas .plate, folk checker trim, crowd .dab) opens ONLY inside the interstitial while the learn screen beneath stays Orbit (law 1); proved in a headless probe (appReg=[reg-orbit grain], festCount=1, festOnBody=true, loudOnLearnScreen=false)"
    - "no new keyframe: the interstitial reuses shipped verbs — .plate/stamp, .rv-ringdabs/.dab/drift (staggered animation-delay), .thread/ink-draw (an arc whose --len/stroke-dasharray = the r=46 circumference so ink-draw sweeps it closed); the shipped @layer motion reduced-motion guards (--dur-stamp/--dur-draw→1ms, .dab{animation:none}) quiet all three to final-static, and the +25 noor is granted in JS before any animation (never depends on motion)"
    - "the HUD returns/noor stats are now 44px <button>s and the streak strip is role=button/tabindex=0 with an aria-label; all sheet openers are the singleton functions, re-wired each render (the HUD is rebuilt)"

key-files:
  created:
    - ".planning/phases/05-learn-page-cross-page-view-transitions/05-05-SUMMARY.md"
  modified:
    - "learn.html — the shared sheet family (openStreakSheet/openNoorSheet/openSwitcher, each one AW.sheet call) + comingSoonSheet; HUD returns/noor as 44px buttons + the streak strip as role=button; the tab bar (Learn active + coming-soon/Returns→streak wiring); window.__awbaClaimChest write-once guard + openFestival/festivalHtml/closeFestival/fmtDate (the interstitial)"
    - "shared/awba-engine.css — @layer screens: the sheet hero (Marcellus numerals) + note + switcher rows, the HUD 44px targets, the tab bar + the R-5 .reg-orbit .tab.active GOLD override + content bottom-offset + coming-soon sheet body, and the S5 Festival interstitial composition (.ofest overlay + ring/arc/glyph + plate/mark/noor); order line untouched, zero new token/face/hex, no engine JS edit"

key-decisions:
  - "Every sheet is ONE AW.sheet(html) call on the shipped singleton — no bespoke sheet DOM (D-60/LRN-06). The streak sheet is a single openStreakSheet function opened from the HUD returns stat, the whole streak strip, AND the Returns tab (one implementation, three surfaces)"
  - "R-5: the active .tab cue on Orbit is GOLD (8.40:1), not crimson (2.65:1, banned) — added as .reg-orbit .tab.active { color: var(--gold) } + inset 0 2px 0 gold top-rule in @layer screens, mirroring the .rv-shell gold-override precedent; the shipped crimson .tab.active is OVERRIDDEN by layer order, never edited (it survives for cream pages)"
  - "Sheet/switcher icons use explicit --madder / --crimson tokens, NOT var(--icon-accent) — the AW.sheet mounts on document.body outside any register scope, where --icon-accent is undefined (it is only set on .reg-* scopes)"
  - "The switcher COMING SOON rows are .sheet-row.off with a calm neutral --ink-62 pill on a --rule hairline; the .off name stays --ink-85 (fully legible) — status lives in the pill, never a disabled-dead grey"
  - "The chest claim grants +25 noor EXACTLY ONCE via the write-once chests guard (deterministic, never randomized); a second call is a no-op (proved: delta=25 on a claim-twice probe). Gen-3 awba_chest_* keys already migrate into the chests slot"
  - "Rule-2 hardening: window.__awbaClaimChest only claims a real (byId[id].chest), earned (AW.deriveNodeState → 'available'), unopened chest — defence-in-depth so a stray call can never credit a locked/non-chest id (the popup already gates the CTA to available chests)"
  - "The Festival interstitial is a separate .reg-festival threshold overlay on document.body — the learn screen stays Orbit (law 1). The loud register (Rakkas .plate, folk checker trim, crowd .dab, the closing gold thread arc) opens ONLY inside the overlay; the plate is private, maker's-marked with a local date (D-16, never toISOString) + AW.ringSeed().toString(36) in Courier"
  - "No new keyframe (HARD RULE 5): the interstitial reuses the shipped stamp/drift/ink-draw verbs; the shipped @layer motion reduced-motion guards render plate/dabs/arc final-static, and the +25 is granted before any animation (never depends on motion)"
  - "closeFestival re-renders the path FIRST (the chest node now reads done) then fades the overlay out over it, so the fresh state is revealed as the threshold closes — the overlay lives on body, so render()'s #app rebuild never removes it mid-flight"

metrics:
  tasks_completed: 3
  duration: "~1 session"
  completed: 2026-07-14
  suite: "107/107 (unchanged — no engine JS/test files touched this plan; learn.html is a page, not a *.test.js, and its sheet/claim logic is exercised via render-smoke + a headless claim probe)"
  render_smoke: "20/20 SMOKE OK + 1 vt-nav check (file:// learn→u1-m1 clean)"
  layer_order_line_count: 1
  localStorage_in_learn_html: 0
  engine_localStorage_count: 13 (unchanged — no engine JS edit)
  glyph_count: 13 (unchanged — no new glyph; the tab/sheet icons reuse AW.KIT/AW.GLYPHS scenes)
  chest_idempotency: "before=100 after1=125 after2=125 delta=25 claimed=true (claim-twice → +25 exactly once)"
  festival_containment: "appReg=[reg-orbit grain] festCount=1 festOnBody=true loudOnLearnScreen=false"
  sheet_singleton: "4 AW.sheet call sites (streak/noor/switcher/coming-soon); streak = one implementation opened from HUD returns + streak strip + Returns tab"
---

# Phase 5 Plan 05: Shared Sheet Family + Tab Bar + Chest Claim + Festival Interstitial Summary

Every tap on the learn front door is now alive. The HUD stats, the streak strip, the course chip and the whole tab bar open their sheets through ONE shared implementation on the shipped `AW.sheet` singleton — no bespoke sheet DOM anywhere. The tab bar carries Learn active with a GOLD cue on the black world (crimson is invisible there, so the shipped crimson `.tab.active` is overridden, never edited), and every other tab is a designed coming-soon rather than a dead tap. And claiming a gift grants **+25 noor exactly once** — a sure, deterministic, idempotent gift — then opens the sanctioned Festival threshold: a separate cream overlay where the dated folk circuit plate stamps in, a circle of ink dabs drift-settle around a small Ring, and that circuit's gold thread arc closes, while the learn screen beneath stays Orbit and the reward never touches scripture.

## What shipped (per task)

- **Task 1 — the ONE shared sheet family + HUD taps (`8367513`):** three sheet-builder functions in learn.html, each a **single `AW.sheet(html)` call** on the shipped singleton (append-to-body, outside-tap + Esc close, scroll-lock — all shipped). (1) `openStreakSheet` — a `.grip`, a Marcellus display returns count + `day you came back` (N=1) / `days you came back` (N≠1), the `AW.weekCal()` week row rendered as `.weekcal` presence dots (lit gold `.here` / un-lit, never a gap/miss), and the verbatim never-breaks note. (2) `openNoorSheet` — a `.grip`, a **gold-filled** Marcellus noor count + `noor gathered`, and the verbatim noor note. (3) `openSwitcher` — a `.grip`, an `Aqeedah · Level 1` row with an **ACTIVE** olive pill, then three `.sheet-row.off` COMING SOON rows (Fiqh/Seerah/Qur'an) each with a scene icon + a calm neutral `--ink-62` pill on a `--rule` hairline (never disabled-dead grey). Openers made live: the HUD returns `.hstat` (now a 44px `<button>`) **and** the whole streak strip (now `role=button`) → the streak sheet; the HUD noor `.hstat` → the noor sheet; the course chip → the switcher. Copy ports **verbatim** from Gen-3. New `@layer screens`: the sheet hero (Marcellus numerals ≥28px), the note, the switcher rows, the 44px HUD targets.
- **Task 2 — the tab bar: Learn active (gold override) + coming-soon sheets, no dead taps (`8a0fbc1`):** a bottom `.tab` nav rendered as a direct child of `#app` (fixed, so no animated/transformed ancestor breaks `position:fixed`; 44px min per tab; safe-area inset; pinned to the 480px shell column on desktop). **R-5:** added `.reg-orbit .tab.active { color: var(--gold); }` + `inset 0 2px 0 var(--gold)` (the 2px gold top-rule) to `@layer screens` — because crimson is 2.65:1 on Kiswah (banned §2.1) and gold is 8.40:1 — mirroring the shipped `.rv-shell` gold-override precedent. The shipped crimson `.tab.active` rule is **OVERRIDDEN by layer order, never edited** (it survives at `css:756-758` for cream pages; the gold override is at `css:2158-2159`). Inactive labels are `--paper-62`, tab icons `--icon-accent` gold on Orbit. Every inactive tab opens a designed coming-soon `AW.sheet` (Practice/Profile/More — a scene icon + one calm verbatim line, warm, never "locked"/"upgrade"); the **Returns tab opens the streak sheet — the SAME `openStreakSheet` implementation from Task 1**. Never a dead tap.
- **Task 3 — chest claim (+25 once, idempotent) + the Festival circuit-plate interstitial (`d1bd0be`):** `window.__awbaClaimChest(nodeId)` (the hook the 05-04 popup calls) is a **write-once guard** on the `chests` slot in `AW.S`: `var chests = AW.state().chests; if (chests[nodeId]) return; chests[nodeId] = true; AW.S.set('chests', chests); AW.S.set('noor', AW.S.get('noor', 0) + 25);` — **+25 exactly once, deterministic, never randomized** (Rule-2-hardened to first verify a real, earned/`available`, unopened chest). It then opens a **separate `.reg-festival` threshold overlay** appended to `document.body` (never inside `#app.reg-orbit` — the learn screen stays Orbit, law 1): the dated folk **`.plate` stamps in** (shipped `stamp` verb; its `.ofest-plate-title` inherits Rakkas `--font-festival`, valid ONLY inside this Festival threshold), a **CIRCLE crowd-arrival** of ink `.dab`s **drift**-settle around a small Ring (the shipped `.rv-ringdabs` positions + `drift`, staggered `animation-delay`), and **that circuit's gold thread arc closes** (the shipped `.thread`/`ink-draw` over an arc whose `--len`/`stroke-dasharray` = the r=46 circumference). The plate is **private, maker's-marked** with a local date (D-16 — never `toISOString`) + `AW.ringSeed().toString(36)` in Courier. Dismiss (button / backdrop / Esc) re-renders the path so the chest reads `done`. All motion is a shipped verb — **no new keyframe** — so the shipped `@layer motion` reduced-motion guards render plate/dabs/arc **final-static**, and the +25 is granted before any animation (never depends on motion).

## Verification evidence

- Every per-task `<verify>` passed **verbatim**: `TASK1 VERIFY PASS`, `TASK2 VERIFY PASS`, `TASK3 VERIFY PASS` (each including render-smoke-clean, the `@layer` order-line-count = 1, and — Task 3 — the engine `localStorage` count = 13; Task 2 — suite `fail 0` and tests ≥ 98).
- **Chest idempotency (headless-Chrome probe driving the REAL `window.__awbaClaimChest` twice against a seeded state — u1 review starred → u1c available):** `before=100 after1=125 after2=125 **delta=25** claimed=true` — the first claim grants exactly +25, the **second claim is a no-op** (never doubles), the chest is marked opened.
- **Festival containment (same probe):** `appReg=[reg-orbit grain]` (the learn screen stays Orbit), `festCount=1` (exactly ONE `.reg-festival` in the whole document = the overlay), `festOnBody=true` (the overlay is a direct child of `document.body`, never inside `#app`), `loudOnLearnScreen=false` (no `.plate`/`.dab`/`.rv-ringdabs`/`.reg-festival` inside `#app`) — the loud register opens ONLY inside the interstitial.
- **Sheet-singleton (grep):** 4 `AW.sheet(` call sites in learn.html (streak/noor/switcher/coming-soon), plus the shipped `AW.sheetRef` for the daily-ayah cite — no bespoke sheet DOM; the streak sheet is ONE `openStreakSheet` function wired from the HUD returns stat, the streak strip, and the Returns tab.
- **R-5 override intact:** the shipped crimson `.tab.active` rule survives untouched at `css:756-758`; the gold override lives later in `@layer screens` at `css:2158-2159` (wins by layer order, not by edit).
- **render-smoke** 20/20 `SMOKE OK` (incl. `SMOKE OK learn.html`) + `SMOKE OK vt-nav learn→lessons/u1-m1.html`. Suite **107/107** (no engine JS/test files touched). `localStorage` in learn.html **0**; engine `localStorage` count **13**; `@layer` order-line count **1**; glyphCount **13**; no `Math.random`/`randomInt` on the reward path (none in learn.html). Gated-literal sweep of every task's additions **clean** (no poppins/confetti/amber/PERFECT/gold-bg/fonts.googleapis/rgba(37,54,/--accent/lantern-gold/class="combo", and no literal VT property name in any comment/string).

## Deviations from Plan

### Auto-fixed / hardening

**1. [Rule 2 — correctness hardening] `window.__awbaClaimChest` validates the chest before crediting noor**
- **Found during:** Task 3 (implementing the claim hook).
- **Issue:** The plan's guard is the write-once `chests` check alone. A stray/out-of-band call with a non-chest or not-yet-earned id could theoretically credit +25 (the popup already gates the CTA to `available` chests, but the hook is a global `window.*`).
- **Fix:** Guard `if (!byId[nodeId] || !byId[nodeId].chest) return;` and, after the write-once check, re-derive via the shipped `AW.deriveNodeState(flat, st)` and `return` unless the chest is `'available'`. Deterministic, still exactly-once, no new storage/token. Grep-gate shapes (`AW.S.set('chests'`, `AW.S.get('noor', 0) + 25`) unchanged — Task 3 verify still passes.
- **Files:** learn.html. **Commit:** folded into `d1bd0be`.

*(No Rule-1 bugs surfaced. No architectural changes. No engine JS edit — `localStorage` count held at 13. Sheet/switcher icons use explicit `--madder`/`--crimson` rather than `var(--icon-accent)` because a body-mounted sheet is outside any `.reg-*` scope where `--icon-accent` is defined — a correctness choice, not a deviation.)*

### Interpretation notes (prescribed discretion)

- **VERBATIM-CONTENT vs GREP GATE (HARD RULE 5):** the byte-verbatim U3-m3 label **"One religion, one thread"** contains "thread"; none of this plan's verifies grep negatively for "thread", so the label was untouched and needed no scoped proof this wave. The word "thread" also appears only inside authored comments/strings describing the shipped gold `.thread` primitive — never as a gated literal.
- **Coming-soon copy (Practice/Profile/More):** the UI-SPEC fixes the Practice line verbatim ("Practice is on its way. For now, keep walking the path."); Profile/More reuse the same warm cadence ("Your corner is on its way…" / "There is more to come…") — warm, never "locked"/"upgrade"/"unavailable".
- **Festival dismiss button:** the copy table fixes no interstitial CTA label; I used the calm authorial "Keep the light" (UI copy, not scripture) on the default Page-crimson `.btn` (S5 explicitly permits crimson inside the cream Festival ground).
- **Interstitial centre glyph + "+25 noor · yours to keep":** Claude's-discretion Festival composition within the bounded primitives — a single gold `spark` (the light gathered) at the ring centre and a quiet Courier confirmation line; no scripture, no Aref Ruqaa (Rakkas is the only display face here, valid in this threshold, law 5).

## Known Stubs / Owner-Ledger Items

| Item | File / line | Reason | Resolves in |
|------|-------------|--------|-------------|
| Arabic unit chapter-terms | continue-card `.cc-term` / unit headers (English titles) — inherited from 05-02/05-03 | R-6: the 15 verified Aref-Ruqaa Arabic terms are owner/scholar-sourced; the mechanism is shipped, the English title is the fallback | owner ledger |
| Ibrahim 14:24 verbatim splice | `.oib-line` (authorial framing line) — inherited from 05-03 | R-7: the verbatim Clear-Quran line is not in Josh's corpus; never generated | owner ledger |
| Full ~20-doodle plant pool | node `SPROUT` (one sprout) — inherited from 05-03 | R-3/D-55: MVP ships one sprout; the bounded doodle pool is a fast-follow | fast-follow |

*(No new stubs introduced this plan — every tap now resolves to a live, wired surface.)*

## Doubts for the 05-06 human gate

- **The Festival threshold on a real device (the flagship moment):** confirm the choreography reads as a calm celebration, not a game burst — the plate stamps (≤150ms), the crowd dabs drift-settle (staggered), the gold thread arc closes, all one-pass; and that it never feels loud on the Orbit screen (the overlay is the only Festival ground). Judge the plate's Rakkas title + the private Courier maker's mark (date + seed) at real size.
- **Reduced-motion Festival:** confirm that with reduced motion the plate/dabs/arc render **final-static** (no stamp scale, no drift) and the "+25 noor" still lands — the mechanic never depends on motion (the +25 is written before any animation).
- **Tab-bar gold on the black world:** confirm the GOLD active Learn cue (label + 2px top-rule) reads clearly against the Kiswah ground and the frosted bar, and that the inactive gold tab icons + paper-62 labels read as calm marginalia (not chrome). Confirm the fixed bar clears the notch/home-indicator and never covers the Ibrahim line.
- **Sheet Marcellus numerals + switcher COMING SOON rows:** confirm the streak/noor hero numerals read as Marcellus display (≥28px) and the coming-soon rows read as *designed, alive, calm* (never disabled-dead) — the olive ACTIVE pill vs the neutral hairline COMING SOON pill.
- **Chest "sure gift" read:** confirm the popup→interstitial flow reads as a certain, once-only +25 (no gambling), and that a re-tapped opened chest shows "Already opened. The light stayed with you." with no claim path (the derived `done` state removes the CTA; the write-once guard is the second line of defence).
- **Requirement rows LRN-06 / LRN-07 / RWD-04:** the substance now renders live; left `[ ]` Pending in REQUIREMENTS.md for the 05-06 gate to mark (consistent with 05-01..05-04 — the requirement text demands the live/served walk the gate performs).

## Self-Check: PASSED
- learn.html + shared/awba-engine.css modified and committed across `8367513`, `8a0fbc1`, `d1bd0be` — verified present in `git log`.
- 05-05-SUMMARY.md created at `.planning/phases/05-learn-page-cross-page-view-transitions/`.
