# Phase 5: Learn Page & Cross-Page View Transitions - Context

**Gathered:** 2026-07-13 (auto mode — owner directive: "finish executing everything until the entire app is finished"; recommended options auto-selected, logged in 05-DISCUSSION-LOG.md)
**Status:** Ready for planning

<domain>
## Phase Boundary

Build `learn.html` — the front door: the full-course winding node path with live storage-derived states, anchored node popups, the daily ayah, the chest/gift mechanic, HUD + bottom sheets + tab bar — and wire cross-document View Transitions across all 20 pages so path↔lesson↔review navigation morphs instead of hard-cutting. NO new content (the DAILY pool + node labels are ported verbatim from Gen-3 learn.html), NO PWA/service worker (Phase 7), NO a11y deep-hardening beyond what ships naturally (Phase 6 hardens).

**CRITICAL FRAME (same as Phase 4):** REQUIREMENTS rows LRN-01..07/RWD-04 carry Gen-3 vocabulary ("returns flame", "lantern mascot", "colour-coded unit sections", "gift-framed chest"). The ROADMAP Phase-5 success criteria were already re-voiced to Athar at the pivot (identity via chapter-term + icon, no unit colour-coding, no mascot). The D-53..D-61 table below is the BINDING reading. Never re-introduce a retired element (companion/mascot, unit accent colours, confetti, amber, PERFECT, gummy press, treasure-chest art).

</domain>

<decisions>
## Implementation Decisions

### D-53 — The Learn page IS the Orbit home (law 1: one register per screen)
`learn.html` renders ONE screen on the ORBIT register: Kiswah Black ground + grain + `data-sky` prayer-clock tint + the `--dawn` horizon warmth (all shipped in Phase 3). Composition top→bottom per the ATHAR "day in Awba" moment 1: HUD marginalia → the Ring hero ("what your learning has traced", real `AW.ringSVG`, static on load — law 9, no replay) → one navy continue card ("Circuit N · <chapter-term>" pointing at the next available node) → the daily ayah → the winding path (4 unit sections) → the Ibrahim 14:24 line in Courier → tab bar. The Ring is THE macro map; the path below is the navigable index, never a second competing map. Unit headers = Farag squares (Aref Ruqaa chapter-term ≥40px, `--crimson`-on-cream squares sit as authored token cards on the dark ground) + unit scene icon via `AW.UNIT_ICON`. NO unit colour-coding anywhere.

### D-54 — Node grammar: thermal, shape-first, ink-drawn (LRN-02/04)
Nodes on the black ground use the shipped thermal `data-state` grammar: locked = hollow Powder-Veil ring (+ gentle microcopy popup on tap — "not yet", never a buzzer/shake), available = ember half-dab with a quiet breathe (the ONLY ambient on the path; reduced-motion stills it), active/next = same ember treatment + the continue card points here, done = filled gold + keyline + check + star count in Courier. Review nodes = gold rosette-framed (rarer, elevated); chest nodes per D-56. The connecting path is a single ink thread that walks the winding layout; the EARNED portion re-inks gold (drawn via the Orbit `draw` verb as units complete, `ink-draw` keyframe reuse). Unlock order is ported EXACTLY from Gen-3 learn.html:120-150 (strictly sequential incl. m2/m3b/m2b splits; chest opens when the unit's review has stars; `AW.deriveNodeState` from Phase 2 is the deriving seam — extend, don't fork).

### D-55 — Node popups carry the seed-row; done nodes carry the plant stamp (Phase-4 deferred item lands here)
The node popup is the singleton cream "slip of paper" over the dark ground (register-as-component, same law-1 exemption as `AW.sheet` — reuse/extend the sheet pattern; anchored with edge clamping + arrow offset, singleton, outside-tap closes). Popup contents: lesson label + the lesson's **seed-row** (its atoms as faint dots → inked sprouts per completion — micro-progress, Madder at rest) + stars-if-done + CTA (START / REVIEW / LEGENDARY with noor hints per Gen-3 copy). A DONE lesson's node also carries its small **plant stamp** (one of the ~15/20 bounded doodle pool, ATHAR asset kit). MVP fallback if the doodle pool proves too heavy for this phase: seed-rows ship + a single sprout glyph stamps done nodes, full doodle pool logged as a fast-follow — planner decides the wave split. NEVER a 65-plant map.

### D-56 — The chest IS the Festival circuit-plate threshold (RWD-04 mechanic byte-preserved, expression re-voiced)
Mechanic exactly as Gen-3 learn.html:181-182: chest unlocks when the unit review has stars; claim grants **+25 noor exactly once** (idempotent via the `chests` slot in `AW.S` — Gen-3 `chest_*` keys already migrate); contents implied before tap (the popup says what it is — a sure gift, no gambling). Expression: claiming it is the CIRCUIT THRESHOLD — the sanctioned Festival moment: the dated folk **circuit plate** stamps in (`stamp` verb, 150ms), CIRCLE crowd-arrival dabs drift-settle around the Ring, and that circuit's gold thread arc closes. Festival ground appears ONLY inside the claim moment (an interstitial/overlay — a threshold, Festival's law); the learn screen stays Orbit. The node at rest is a plate-framed gift node (folk keyline frame + label "A gift"/"The course gift") — Gen-3's white/amber IC_CHEST treasure-box art is retired. Plates are private by default, maker's-marked (date + ring seed).

### D-57 — Ring atomsDone wiring (the Phase-4 proxy resolves here)
The researcher must locate the authoritative per-lesson atom counts in Josh's corpus (`_MVP-BUILD/00_MVP-PLAN.md` / the atom master docs — 65 atoms over 15 lessons). If a verifiable map exists: wire exact `atomsDone` (sum of completed lessons' atoms) into every Ring caller + `AW.skyDawn`, replacing the documented `ATOMS_PER_NODE = 3` proxy (one constant, one place). If NOT verifiable: keep the proxy, centralized and documented — NEVER invent per-lesson atom counts (content integrity). Either way Ring geometry stays seed-stable; progress only re-inks.

### D-58 — View Transitions (MOT-02): quiet, progressive, never over scripture
`@view-transition { navigation: auto; }` + the reduced-motion kill block (`::view-transition-group/old/new(*) { animation: none }`) added to the ONE engine stylesheet (inside the existing layer structure — the order line is immutable); all 20 pages get it by inheritance, zero per-page CSS. One shared-element morph: the tapped node's chapter/Farag square → the lesson opener square (`view-transition-name` stamped at click time on the source, matching name on the opener; unique names, one pair per navigation). Everything else = the default subtle cross-fade, ≤300ms on the one easing family. Scripture elements NEVER carry a `view-transition-name` (no morphing ayat). Firefox/unsupported = normal navigation, no fallback code (progressive enhancement — the researched pattern). Same-document `startViewTransition` may wrap popup open/close where it's free; never required.

### D-59 — Daily ayah (LRN-05): verbatim pool, day-of-year fix, reverent reveal
The 7-verse `DAILY` pool is spliced BYTE-VERBATIM from Gen-3 learn.html:153-160 (scripture law: splice, never retype; the ˹ ˺ brackets intact). The rotation bug is fixed as the requirement mandates: Gen-3's `getDate() % 7` (day-of-MONTH — repeats monthly) becomes day-of-YEAR % 7 computed from LOCAL date parts (D-16 discipline: never toISOString). This is a sanctioned mechanic fix, not a content edit. Render on the dark ground under scripture law: Amiri, strongest ink (Moonmilk-white on Kiswah), the permitted glow, translation + ref line + `pending review` pill, quiet settle reveal, NOTHING celebratory adjacent, tap opens the full cite sheet.

### D-60 — HUD, sheets, tabs (LRN-01/06/07): marginalia + ONE sheet implementation
HUD = transparent marginalia (the lesson `.ls-hud` pattern): course chip (mini Farag square, tappable → course switcher), returns count, noor count (both tappable → their sheets), the 44px mute toggle (shared `muteBtnHtml`). Streak band re-voiced: a quiet strip under the Ring — Courier "N returns · your streak never breaks" + a small constellation of return-day dots (Sky's streak-as-constellation as TOKENS on the Orbit ground, no second ground). ALL bottom sheets ride the ONE `AW.sheet` singleton: streak sheet, noor sheet, course switcher (Fiqh/Seerah/Qur'an as polished coming-soon rows), and the tab coming-soons. Tab bar: Learn active; Practice/Returns/Profile/More each open a designed coming-soon sheet (scene icon + one calm line) — never a dead tap. Returns tab = the streak sheet (one implementation).

### D-61 — Navigation wiring: the dead links come alive
Lessons/reviews' "Back to the path" + done-handoff `next` hrefs (`../learn.html`) now work: learn.html auto-scrolls to the next available node on load (hash `#<node-id>` honoured when present). The lesson runner's existing handoff needs NO cfg change (hrefs are already in Josh's cfg verbatim). The continue card, node CTAs, and tab bar are the only other nav surfaces.

### Claude's Discretion
Winding path geometry/layout algorithm (must read as a journey, not alternating circles — LRN-04), popup clamp/arrow implementation, constellation styling, plate compositions (within Festival tokens + the bounded asset kit), stagger/entrance timings within ≤300ms/token law, continue-card copy shape.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design authority (binds every visual choice)
- `.planning/ATHAR-SYSTEM.md` — the five registers, constitution, "a day in Awba" (moment 1 IS this page), the bounded asset kit (~20 sprout/plant doodles sanctioned)
- `.planning/phases/03-components-icon-kit-motion-language/03-UI-SPEC-ATHAR.md` — §2 tokens, §3 registers, §6 Ring API (animateFrom/no-replay), §7 sky, D-A1..A14
- `docs/superpowers/specs/2026-07-12-athar-adoption-design.md` — retired-element list
- `preview.html` — the approved living reference; the learn page must read as the same product

### Behaviour analog (mechanics ground truth)
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/learn.html` — UNITS node order (:120-150), state derivation incl. chest rule (:175-190), DAILY pool (:153-160, splice verbatim), popup/sheet behaviours; the visual grammar is superseded by Athar, the BEHAVIOUR is the port target
- `.planning/phases/04-lesson-review-engine-port-detail-layer/04-CONTEXT.md` — the D-45 translation-table precedent this phase's D-53..D-61 extends
- `.planning/phases/04-lesson-review-engine-port-detail-layer/04-REVIEW.md` — FIXES + the 3 Suggestions (SG-02 dead `data-sound`, SG-03 unreachable `.lens[open]` — don't repeat those patterns)

### In-repo seams to consume
- `shared/awba-engine.js` — `AW.deriveNodeState` (Phase 2, built FOR this page), `AW.S`/`AW.state` (chests slot live), `AW.ringSVG/ringSeed`, `AW.skyTemp/applySky/skyDawn`, `AW.sheet/sheetRef/sheetTerm`, `AW.icon/UNIT_ICON/GLYPHS`, `AW.weekCal`, `AW.animate`, `muteBtnHtml/bindMuteBtn`, `AW.sound`
- `shared/awba-engine.css` — registers, thermal `data-state`, `.dab/.thread/.plate/.rosette`, `ink-draw`, `@layer screens` (Phase 4 lesson/review/reward surfaces); Phase 5 writes ONLY new `@layer screens` content (the order line at :16 is immutable)
- `scripts/tests/*.test.js` (98/98 baseline) + `scripts/tests/render-smoke.mjs` (extend to learn.html) + `node scripts/validate-content.js` (self-test must stay OK)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `AW.deriveNodeState(nodesFlat, progress)` — Phase 2 shipped it DOM-free for exactly this page; the chest rule (review-stars gate + claimed flag) ports into/alongside it.
- The full Phase 3/4 component inventory (sheet singleton, thermal states, celebration primitives, Ring, Sky, paper-press) — the learn page should need almost NO new primitives, only `@layer screens` composition + the popup + plate/stamp assets.
- `render-smoke.mjs` + suite harness patterns (ls-stub `loadEngine`) for the new `learn` tests; `port-audit.mjs` pattern for the DAILY-pool byte-fidelity check.

### Established Patterns
- Sequential executors on main tree; TDD on runner logic; atomic conventional commits; `node --test scripts/tests/*.test.js` (glob only); exit-code-first validator runs; ugrep paren-wrapping; gated literals never in comments (poppins, confetti, amber, rgba(37,54,, --accent, lantern-gold, PERFECT, class="combo", gold-bg, fonts.googleapis); plan line refs go stale — locate by content; page-relative URLs, never leading slash; splice-never-retype with SHA evidence; hand-edit STATE.md (gsd-sdk state handlers mis-parse it).
- Register-as-component exemption precedent: `AW.sheet` (cream) over any ground — the node popup follows it.

### Integration Points
- Lesson `done()`/du'a-terminal handoff + "Back to the path" already emit `../learn.html` hrefs from Josh's cfg — learn.html must exist at repo root next to `lessons/` and `reviews/`.
- `AW.ringSVG({animateFrom})` on home: ALWAYS static-final on learn load (law 9) — the draw moment belongs to lesson-complete only.
- Phase 6 hardens focus/aria on the popup + sheets; Phase 7 precaches the new assets.

</code_context>

<specifics>
## Specific Ideas

- Moment 1 of "a day in Awba" is the acceptance picture: "Maghrib, home — the black world warmed at the horizon, your Ring half-inked, one navy continue card."
- The path must read as a hand-inked journey on black — a winding thread with thermal dabs — not Duolingo's alternating circles re-skinned (LRN-04's "real visual journey" under Athar).
- The daily ayah is the only scripture on this screen — it gets the reverence budget; everything else stays marginalia-quiet.
- Owner ledger (not build-blocking): sound-cue assets (D-52), scholar gate, Clear Quran licensing, default du'a (cfg.dua), the deferred Phase-4 visual walk — all unchanged.

</specifics>

<deferred>
## Deferred Ideas

- Eid al-Fitr / Eid al-Adha checker-trim dressing (Festival, date-gated) — v2/owner call.
- Course-completion poster (seeded Ring in a Warsha folk frame, share/export) — v2; the u4c "course gift" plate is this phase's ceiling.
- Full ~20-doodle plant pool IF the planner splits it out of v1 (D-55 fallback) — fast-follow.
- Nightfall auto-triggering — stays D-48 (owner/scholar data needed).
- Practice hub / Profile / quests as real surfaces — V2-07 (coming-soon sheets only).
- Returns-as-heatmap presence view — V2-03.
</deferred>

---

*Phase: 5-learn-page-cross-page-view-transitions*
*Context gathered: 2026-07-13*
