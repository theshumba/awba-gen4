# Phase 5: Learn Page & Cross-Page View Transitions — Research

**Researched:** 2026-07-13
**Domain:** Zero-build vanilla static learn-path page (SVG/CSS/classic-JS) + native cross-document View Transitions, over the shipped Athar engine
**Confidence:** HIGH (behaviour port, engine seams, atom map, View-Transition same-origin gate all verified against source) — with ONE flagged decision (61-vs-65 Ring denominator) and MEDIUM confidence on the winding-path rendering approach (design-engineering judgment)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions (D-53..D-61 — the BINDING Gen-3→Athar translation)

- **D-53 — Learn page IS the Orbit home (law 1: one register per screen).** `learn.html` renders ONE `.reg-orbit` screen: Kiswah Black + grain + `data-sky` prayer-clock tint + `--dawn` horizon warmth (all shipped Phase 3). Composition top→bottom per ATHAR "day in Awba" moment 1: HUD marginalia → the Ring hero (real `AW.ringSVG`, **static on load — law 9, no replay**) → one navy continue card ("Circuit N · \<chapter-term\>" pointing at next available node) → daily ayah → winding path (4 unit sections) → Ibrahim 14:24 line in Courier → tab bar. The Ring is THE macro map; the path is the navigable index, never a second competing map. Unit headers = Farag squares (Aref Ruqaa chapter-term ≥40px, `--crimson`-on-cream squares as authored token cards on the dark ground) + unit scene icon via `AW.UNIT_ICON`. **NO unit colour-coding anywhere.**
- **D-54 — Node grammar: thermal, shape-first, ink-drawn.** Shipped thermal `data-state`: locked = hollow Powder-Veil ring (+ gentle "not yet" microcopy popup on tap — never buzzer/shake), available = ember half-dab with a quiet breathe (the ONLY ambient on the path; reduced-motion stills it), active/next = same ember + continue card points here, done = filled gold + keyline + check + star count in Courier. Review nodes = gold rosette-framed. Chest nodes per D-56. Connecting path = a single ink thread walking the winding layout; the EARNED portion re-inks gold (`ink-draw` keyframe reuse). Unlock order ported EXACTLY from Gen-3 learn.html (strictly sequential incl. m2/m3b/m2b splits; chest opens when the unit's review has stars). `AW.deriveNodeState` (Phase 2) is the deriving seam — **extend, don't fork.**
- **D-55 — Node popups carry the seed-row; done nodes carry the plant stamp.** Popup = singleton cream "slip of paper" over the dark ground (register-as-component exemption, same as `AW.sheet`; anchored with edge clamping + arrow offset, singleton, outside-tap closes). Contents: lesson label + **seed-row** (its atoms as faint dots → inked sprouts per completion — Madder at rest) + stars-if-done + CTA (START / REVIEW / LEGENDARY with noor hints per Gen-3 copy). A DONE node also carries its small **plant stamp** (bounded doodle pool). **MVP fallback:** if the doodle pool is too heavy for this phase, seed-rows ship + a single sprout glyph stamps done nodes; full pool = fast-follow (planner decides wave split). NEVER a 65-plant map.
- **D-56 — Chest IS the Festival circuit-plate threshold.** Mechanic exactly as Gen-3: chest unlocks when unit review has stars; claim grants **+25 noor exactly once** (idempotent via the `chests` slot in `AW.S`; Gen-3 `chest_*` keys already migrate); contents implied before tap (a sure gift, no gambling). Expression: claiming = the CIRCUIT THRESHOLD (Festival moment) — dated folk **circuit plate** stamps in (`stamp` verb, 150ms), CIRCLE crowd-arrival dabs drift-settle around the Ring, that circuit's gold thread arc closes. **Festival ground appears ONLY inside the claim moment (interstitial/overlay); the learn screen stays Orbit.** Node at rest = plate-framed gift node (folk keyline + "A gift"/"The course gift"). Gen-3's white/amber `IC_CHEST` treasure-box art is retired. Plates private by default, maker's-marked (date + ring seed).
- **D-57 — Ring atomsDone wiring.** Locate authoritative per-lesson atom counts in Josh's corpus. If verifiable: wire exact `atomsDone` (sum of completed lessons' atoms) into every Ring caller + `AW.skyDawn`, replacing the `ATOMS_PER_NODE = 3` proxy (one constant, one place). If NOT: keep the proxy, centralized/documented. **NEVER invent per-lesson atom counts** (content integrity). Either way Ring geometry stays seed-stable; progress only re-inks. → **RESOLVED below: the map IS verifiable. See "Atom Map (D-57 resolved)".**
- **D-58 — View Transitions (MOT-02): quiet, progressive, never over scripture.** `@view-transition { navigation: auto; }` + reduced-motion kill block added to the ONE engine stylesheet (**the `@layer` order line at :16 is immutable**); all 20 pages inherit it, zero per-page CSS. One shared-element morph: tapped node's Farag square → lesson opener square (`view-transition-name` stamped at click time on source, matching name on opener; unique names, one pair per navigation). Everything else = default subtle cross-fade, ≤300ms, one easing family. **Scripture elements NEVER carry a `view-transition-name`.** Firefox/unsupported = normal navigation, no fallback code. Same-document `startViewTransition` may wrap popup open/close where free; never required.
- **D-59 — Daily ayah: verbatim pool, day-of-year fix, reverent reveal.** The 7-verse `DAILY` pool spliced BYTE-VERBATIM from Gen-3 learn.html:153-160 (splice never retype; ˹ ˺ brackets intact). Rotation bug fixed: Gen-3's `getDate() % 7` (day-of-MONTH) → **day-of-YEAR % 7 computed from LOCAL date parts** (D-16: never `toISOString`). Sanctioned mechanic fix, not a content edit. Render on the dark ground under scripture law: Amiri, strongest ink (Moonmilk-white on Kiswah), the permitted glow, translation + ref line + `pending review` pill, quiet settle reveal, NOTHING celebratory adjacent, tap opens the full cite sheet.
- **D-60 — HUD, sheets, tabs: marginalia + ONE sheet implementation.** HUD = transparent marginalia (`.ls-hud` pattern): course chip (mini Farag square → course switcher), returns count, noor count (→ their sheets), the 44px mute toggle (shared `muteBtnHtml`). Streak band re-voiced: quiet strip under the Ring — Courier "N returns · your streak never breaks" + a small constellation of return-day dots (Sky's streak-as-constellation as TOKENS on the Orbit ground, no second ground). ALL bottom sheets ride the ONE `AW.sheet` singleton: streak sheet, noor sheet, course switcher (Fiqh/Seerah/Qur'an as polished coming-soon rows), tab coming-soons. Tab bar: Learn active; Practice/Returns/Profile/More each open a designed coming-soon sheet — never a dead tap. Returns tab = the streak sheet (one implementation).
- **D-61 — Navigation wiring: dead links come alive.** Lessons/reviews' "Back to the path" + done-handoff `next` hrefs (`../learn.html`) now work: learn.html auto-scrolls to the next available node on load (hash `#<node-id>` honoured when present). The lesson runner's handoff needs NO cfg change (hrefs already in Josh's cfg verbatim). Continue card, node CTAs, tab bar = the only other nav surfaces.

### Claude's Discretion
Winding path geometry/layout algorithm (must read as a journey, not alternating circles — LRN-04); popup clamp/arrow implementation; constellation styling; plate compositions (within Festival tokens + the bounded asset kit); stagger/entrance timings within ≤300ms/token law; continue-card copy shape.

### Deferred Ideas (OUT OF SCOPE)
Eid checker-trim dressing (date-gated) · course-completion poster (Warsha frame, share/export) · full ~20-doodle plant pool IF planner splits it (D-55 fallback → fast-follow) · Nightfall auto-triggering (D-48) · Practice hub / Profile / quests as real surfaces (V2-07 — coming-soon only) · Returns-as-heatmap (V2-03).
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **LRN-01** | Learn page renders HUD (course chip, returns, noor — all tappable), streak band, daily ayah card, 4 unit header cards, winding node path, tab bar | Shipped `.ls-hud`/`.hstat`/`.tab`/`.sheet`/`AW.weekCal`/`AW.UNIT_ICON`; Gen-3 layout inventory (learn.html) is the behaviour source. HUD `.reg-orbit .hstat` override already ships. |
| **LRN-02** | Node states derive live from storage (locked+gentle feedback / available / active / done+stars; review=gold, chest=gift) | `AW.deriveNodeState(nodesFlat, progress)` (engine :439) already implements the exact Gen-3 unlock rules incl. the chest rule. Extend for state→thermal `data-state` mapping only. |
| **LRN-03** | Node popups anchor to node with edge clamping + arrow offset, singleton, outside-tap closes; START/REVIEW/LEGENDARY CTAs + noor hints | Gen-3 `placePop()`/`--ax` arrow pattern (learn.html :243-252) is the ported algorithm; extend `AW.sheet` singleton discipline. See **Pitfall 3** (button scoping bleed). |
| **LRN-04** | Path drawn as a real visual journey (connected/flowing) + animates (node entrance, path fills as units complete) | SVG thread overlay + HTML-positioned nodes; earned portion re-inks gold via shipped `.thread` + `ink-draw` keyframe (`stroke-dashoffset`). See **Architecture Pattern 1**. |
| **LRN-05** | Daily ayah rotates by day-of-year (no monthly-repeat bug), reverent (quiet reveal, no celebration on scripture) | Splice the 7-verse pool byte-verbatim; add a pure `AW.dailyIndex(date, poolLen)` helper (day-of-year, local parts) — unit-testable. See **Pattern 2**. |
| **LRN-06** | Streak/noor/course-switcher sheets (ONE shared impl); switcher shows coming-soon rows | `AW.sheet` singleton (engine :998) + `.sheet-row` shipped press. Gen-3 sheet copy is the content source. |
| **LRN-07** | Tab bar: Learn active; other tabs give designed coming-soon feedback (never dead tap) | Shipped `.tab`/`.tab.active`; each inactive tab opens an `AW.sheet` coming-soon. See **Pitfall 4** (crimson-on-Orbit active cue). |
| **CNT-03** | Learn path unlock order matches Gen-3 (sequential incl. m3/m3b, m2/m2b; chest after review), verified by walking storage-driven states | `AW.deriveNodeState` is already the promoted Gen-3 `nodeState()`; a fixture-walk test over the real UNITS map proves CNT-03. See **Validation Architecture**. |
| **RWD-04** | Chest = deterministic +25 noor, contents implied, idempotent claim, never randomized | Idempotent via `chests` slot; Gen-3 `chest_<id>` migrates. Claim = write-once guard. See **Pattern 3**. |
| **MOT-02** | Cross-document View Transitions on every page; graceful no-op on Firefox | `@view-transition{navigation:auto}` (top-level, early in engine CSS) + `pageswap`/`pagereveal` name stamping; same-origin gate = auto file:// no-op. See **Architecture Pattern 4** + **View Transitions** section. |
</phase_requirements>

---

## Summary

Phase 5 is a **composition-and-wiring** phase, not a new-primitives phase. Every capability it needs is already shipped: the Ring generator, the thermal `data-state` grammar, the `.dab`/`.thread`/`.plate`/`.rosette` celebration primitives + the `ink-draw`/`stamp`/`drift` keyframes, the `AW.sheet` singleton, `AW.deriveNodeState` (built DOM-free in Phase 2 *for exactly this page*, and it already encodes the Gen-3 unlock + chest rules verbatim), the prayer-clock Sky tint, `--dawn`, `AW.weekCal`, `AW.UNIT_ICON`, the icon/glyph registries, and the shared mute toggle. The new surface is **`learn.html` at repo root** (it does not exist yet) plus a thin `@layer screens` block for the path/popup/plate, a handful of small engine seam edits (expose the mute helpers; add the day-of-year + atom-map seams), and the cross-document View-Transitions opt-in in the one engine stylesheet.

Two findings change the plan materially. **(1) The per-lesson atom map IS verifiable** — the Gen-3 `00_MVP-PLAN.md §4` and `00_BUILD-RECORD.md §4` tables agree and were cross-checked against the source atom files. The taught/earnable atoms sum to **61**, not 65; the "65" is the full verified corpus, and **4 atoms (U3-13, U3-16, U4-03, U4-09) are held/absent and taught in no lesson**. This resolves D-57 (wire the real map) *and* D-55 (the same map sizes each seed-row), but forces one decision: the Ring's atom denominator (61 taught vs 65 corpus). **(2) Cross-document View Transitions require same-origin (protocol+host+port); `file://` pages carry opaque origins, so the morph auto-no-ops over `file://` and pages navigate normally** — which is exactly the graceful degradation this repo's `file://`-double-click law needs. Empirically confirmed in headless Chrome 150 that `@view-transition` parses correctly *inside* `@layer motion`, but the authoritative placement advice is "occurs early in the CSS file," so the safe placement is a **top-level at-rule high in the engine stylesheet, not buried in a layer block**.

**Primary recommendation:** Build `learn.html` as a `.reg-orbit` page that consumes shipped primitives; add exactly four small engine seams (`AW.muteBtnHtml`/`AW.bindMuteBtn` exports, a `NODE_ATOMS` map + `AW.atomsDone(progress)`, `AW.dailyIndex(date, n)`, and extend `render-smoke.mjs` to scan root `learn.html`); place the View-Transitions opt-in as a top-level at-rule near the top of `awba-engine.css`; and put the popup/thread/plate in `@layer screens`. Resolve the 61-vs-65 Ring denominator as a locked decision before wiring (recommend **61 = taught, so a completed course fully inks**).

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Node-state derivation (locked/available/active/done, chest rule) | Engine (pure `AW.deriveNodeState`) | learn.html (state→`data-state` mapping) | Already built DOM-free in Phase 2 for this page; keep the truth in the engine, the rendering on the page. |
| Ring `atomsDone` / seed-row dot counts | Engine (`NODE_ATOMS` map + `AW.atomsDone`) | learn.html + lesson runner (callers) | "One constant, one place" (D-57). Both the Ring and the seed-row read the same map. |
| Daily-ayah rotation index | Engine (pure `AW.dailyIndex`) | learn.html (pool + render) | Day-of-year math must be unit-testable (LRN-05 "no monthly repeat") — mirrors `AW.skyDawn`/`deriveNodeState` pure-helper precedent. |
| Popup / sheet / coming-soon surfaces | learn.html (composition) | Engine (`AW.sheet` singleton) | The sheet is shipped; the anchored popup is a new small component that borrows the singleton discipline. |
| Cross-document page morphs | Engine CSS (`@view-transition`) + tiny page JS (`pageswap`/`pagereveal`) | Browser (native VT) | Two lines of CSS inherited by all 20 pages; JS only stamps the one shared-element name pair. |
| Chest claim (+25 once) | Engine state (`AW.S` `chests` slot) | learn.html (claim UI + Festival interstitial) | Idempotency belongs in the write-once guard against storage; the plate/interstitial is presentation. |
| Winding path geometry | learn.html (SVG thread + positioned nodes) | Engine CSS (`.thread`/`ink-draw` primitives) | Layout is page-specific (Claude's discretion); the ink primitives are shared. |

---

## Standard Stack

**Zero external packages. Everything is vendored/native.** No `npm install`, no bundler, no CDN (hard project law — see CLAUDE.md). The "stack" is the shipped engine + native browser APIs.

### Core (native browser APIs used this phase)
| API | Support (target: iOS Safari 18.2+ / Chrome 126+) | Purpose | Provenance |
|-----|--------------------------------------------------|---------|-----------|
| Cross-document View Transitions (`@view-transition { navigation: auto }`) | Safari 18.2 (Dec '24), Chrome 126 | Native page-to-page morph across all 20 pages | [CITED: developer.chrome.com/docs/web-platform/view-transitions/cross-document] |
| `PageSwapEvent` / `PageRevealEvent` (`pageswap`/`pagereveal`, `e.viewTransition`) | Chrome 124+, Safari 18.2+ | Stamp the one shared-element `view-transition-name` at navigation time | [CITED: developer.chrome.com/docs/web-platform/view-transitions/cross-document] |
| Inline SVG `<path>` + `stroke-dasharray`/`stroke-dashoffset` | Universal | The winding thread + its gold re-ink (reuses shipped `ink-draw`) | [VERIFIED: shipped `.thread`/`.ring` in awba-engine.css] |
| `Element.getBoundingClientRect()` | Universal | Popup anchoring + computing the thread path from node centres | [ASSUMED] (universal DOM API) |
| `localStorage` via `AW.S`/`AW.prefs` ONLY (D-24) | Universal | All progress reads/writes | [VERIFIED: awba-engine.js :57-343] |

### Supporting (shipped engine seams this phase consumes)
| Seam | Location | Purpose |
|------|----------|---------|
| `AW.deriveNodeState(nodesFlat, progress)` | js :439 | Per-node `{locked\|available\|active\|done}` — the promoted Gen-3 `nodeState()`, chest rule included |
| `AW.state()` | js :373 | One-read snapshot: `{noor, returns, stars, days, lastDay, chests}` (defensive-copied) |
| `AW.S.get/set` | js :261 | The ONLY localStorage surface; `chests` slot idempotency |
| `AW.ringSVG(cfg)` | js :1147 | Deterministic Ring; **omit `animateFrom` ⇒ static** (law 9). Pass `atomsDone` + `circuitsDone` |
| `AW.ringSeed()` | js :1116 | Stable maker's mark (seed persisted once) |
| `AW.skyDawn(atomsDone)` | js :1350 | `--dawn` degree (cap 0.6, denom 65) — re-wire to real `atomsDone` |
| `AW.weekCal()` | js :417 | DOM-free `[{label,on}]` week membership → the streak constellation + streak sheet |
| `AW.sheet(html)` / `AW.sheetClose()` | js :998 | Singleton bottom sheet (append-to-`body`, outside-tap+Esc close, scroll-lock) |
| `AW.UNIT_ICON` `{u1:'compass',u2:'lanterns',u3:'kaaba',u4:'mosque'}` | js :859 | Unit-header scene icons |
| `AW.icon(name,{size,label})` / `AW.KIT` / `AW.GLYPHS` | js :927 / :538 / :865 | A11y icon accessor + 20 scenes + 13 glyphs (incl. `star`,`trophy`,`lock`,`spark`,`flame`,`check`) |
| `AW.reducedMotion()` | js :979 | The one motion self-guard (OS + in-app override) |
| `muteBtnHtml()` / `bindMuteBtn(refresh)` | js :1642 | The shared 44px mute toggle — **currently module-private; must be exposed on `AW` (see Pitfall 6)** |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| SVG thread + HTML nodes | Pure-CSS zigzag (borders/pseudo-elements) | CSS zigzag can't render a continuous "hand-inked journey" line or cleanly re-ink the earned portion gold; nodes still need real DOM for `getBoundingClientRect` popup anchoring + keyboard focus. Rejected. |
| Click-time `view-transition-name` via `pageswap` | Static `view-transition-name` in CSS on every node | The node→opener morph is *dynamic* (which node was tapped is unknown at author time), so a single click-stamped name pair is correct; a static per-node name would need 19 unique names + a matching opener name, and risks uniqueness violations. |
| Native VT progressive enhancement | Hand-rolled CSS/sessionStorage crossfade fallback | Not worth it — unsupported browsers "just navigate," which is fine (STACK.md verdict, D-58). |

**Installation:** none. **Version verification:** N/A (no packages). Headless Chrome present at `/Applications/Google Chrome.app/...` reports **150.0.7871.114** [VERIFIED: `--version` this session].

## Package Legitimacy Audit

**Not applicable — this phase installs zero external packages** (hard zero-dependency project law). No npm/PyPI/crates registry surface exists. slopcheck not run (nothing to check). All "dependencies" are (a) native browser APIs and (b) in-repo shipped engine functions, both verified by reading source this session.

---

## Atom Map (D-57 resolved) — the single most consequential finding

**The per-lesson atom map IS verifiable.** Two Gen-3 planning docs carry byte-agreeing tables, cross-checked against the source atom files:

- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/00_MVP-PLAN.md` §4 (lines 35-63) — "The course map"
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/00_BUILD-RECORD.md` §4 (lines 39-60) — "Content map (verified atoms → lessons)"
- Source atom files confirm the corpus totals: `aqeedah-unit{1..4}-atoms-v2.md` in `_ORGANIZED/05_Build-Handoffs/` — U1 IDs U1-00..17, U3 IDs U3-01..16, U4 IDs U4-01..17 [VERIFIED: grep this session].

**VERBATIM per-node taught-atom map** (the atom IDs each node teaches, from BUILD-RECORD §4):

| Node id | Lesson | Atom IDs taught | Count |
|---------|--------|-----------------|-------|
| `u1m1` | What sound belief is | U1-01,02,07 | **3** |
| `u1m2` | Why belief matters | U1-03–06 | **4** |
| `u1m3` | Where belief comes from | U1-08–12 | **5** |
| `u1m4` | How we keep it sound | U1-13–17 | **5** |
| `u2m1` | The causes within you | U2-01,03,05,07,08 | **5** |
| `u2m2` | The pulls from outside | U2-02,04,06,09 | **4** |
| `u2m3` | Protecting yourself I | U2-10–12 | **3** |
| `u2m3b` | Protecting yourself II | U2-13–15 | **3** |
| `u3m1` | What Tawhid is | U3-01,02,03,07 | **4** |
| `u3m2` | Worth more than everything | U3-04,05,06,09,10 | **5** |
| `u3m3` | One religion, one thread | U3-08,11,12,14,15 | **5** |
| `u4m1` | The two pillars | U4-01,02,04 | **3** |
| `u4m2` | The Lord of everything | U4-05–08 | **4** |
| `u4m2b` | The deniers' twist | U4-10–13 | **4** |
| `u4m3` | How we know He is there | U4-14–17 | **4** |
| — | **TAUGHT TOTAL** | | **61** |

**The 61-vs-65 reconciliation (a DECISION for the planner/owner, not a free choice):**
- **65** = the full verified atom corpus (U1=17, U2=15, U3=16, U4=17). [VERIFIED: source atom files.]
- **61** = the sum of atoms actually taught/earnable across the 15 lessons.
- The **4-atom gap** is fully explained by documented holds — taught in **no** lesson:
  - **U3-13** (cow-veneration anecdote — NOT surfaced), **U3-16** (naming-frame held for scholar), **U4-03** (freedom-of-belief critique — DRAFT-HOLD, absent entirely). [VERIFIED: BUILD-RECORD :60, MVP-PLAN :55/:63.]
  - **U4-09** appears in no lesson row (either a 4th silent hold or a numbering gap) — **[ASSUMED]** it is intentionally not taught; **flag for owner** (does not block: it's simply not in the earnable set).

**Recommendation (tag as a locked decision before wiring):**
- Define a single `NODE_ATOMS` map in the engine = the count column above (one place, D-57).
- Add a pure `AW.atomsDone(progress)` = sum of `NODE_ATOMS[id]` over nodes with a star in `progress.stars`. Feed its result to every `AW.ringSVG` caller (learn hero + lesson runner) and to `AW.skyDawn`.
- **Set the Ring/skyDawn atom denominator to 61** (the taught total) so a completed course **fully inks** the Ring — the honest "your learning has traced the whole course" reading. Document that 61 = the 65-atom corpus minus the 4 held atoms (which are genuinely un-earnable). This changes three touch-points: `AW.ringSVG` `DEF_STRUCT.atoms` (65→61), `skyDawn` `SKY_ATOMS` (65→61), and any `ring.test.js` "of 65" assertion + `preview.html`'s hard-coded `atomsDone`.
- **Alternative (if owner prefers):** keep denominator 65 (Ring inks to 61/65 at completion — an honest "4 held for scholar" state, no engine-constant change). Simpler, but the Ring never visually closes, which reads oddly against "course complete." **Recommend 61.**

This map ALSO resolves **D-55**: each node's seed-row has `NODE_ATOMS[id]` dots (e.g. `u1m3` = 5 dots). See Pitfall 5 for the honest inked/faint state.

---

## Gen-3 Behaviour Inventory (the port target — visual grammar superseded, BEHAVIOUR preserved)

Source: `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/learn.html` (315 lines, read in full this session). Line refs are approximate (locate by content — plan refs go stale).

- **`UNITS` data (:119-151):** 4 units, each `{n, color, title, desc, nodes[]}`. Nodes: `{id, href, label}` for lessons; `{id, href, label, review:true}` for reviews; `{id, chest:true, label}` for chests. **The `color` field is retired** (no unit colour-coding — D-53). Node IDs/hrefs/labels port verbatim. The full flat order is the CNT-03 unlock sequence: `u1m1→u1m2→u1m3→u1m4→u1r→u1c → u2m1→u2m2→u2m3→u2m3b→u2r→u2c → u3m1→u3m2→u3m3→u3r→u3c → u4m1→u4m2→u4m2b→u4m3→u4r→u4c`.
- **State derivation (`nodeState`, :179-187):** already promoted to `AW.deriveNodeState`. Rules: chest = `available` if the immediately-preceding node (the review) has stars AND chest unopened; `done` if opened; else `locked`. Lesson/review = `done` if it has stars; else `active` if EVERY prior non-chest node has stars (strictly linear across all units); else `locked`. **Gen-3 has no separate "available" vs "active" for lessons** — the first not-done unlockable node is `active`. Athar's D-54 "available vs active/next" distinction is a *rendering* nuance (the continue card points at the active node); `AW.deriveNodeState` returns `active` for it — the page maps `active`→ember + "continue card points here."
- **Chest claim (:231-238):** `chest_<id>` fresh-check → set flag + `+25 noor` once → re-render → anchor popup. Gen-4 equivalent: `AW.S.get('chests',{})[id]` (the `chests` slot), write-once. Gen-3 `awba_chest_*` keys **already migrate** into `chests` [VERIFIED: js :177-189].
- **Daily rotation (:192):** `DAILY[(new Date().getDate()) % DAILY.length]` — **the bug** (day-of-month → monthly repeat). Fix = day-of-year (D-59).
- **DAILY pool (:153-160):** 7 verses, verbatim Clear Quran, ˹ ˺ brackets intact — **splice these bytes** (ar-Rūm 30:30, al-Ḥijr 15:9, al-Anʿām 6:82, al-Baqarah 2:163, an-Naḥl 16:97, an-Naml 27:62, aḏ-Ḏāriyāt 51:56).
- **Popup anchoring (`placePop`, :243-252):** appends popup to the node's row, measures `pop.offsetWidth`, computes node centre `nx = el.offsetLeft + el.offsetWidth/2`, clamps `cx` into `[half+6, rowWidth-half-6]`, sets `left:cx`, sets arrow offset `--ax = nx-cx`. Outside-tap close via a document click listener that ignores `.npop`/`.node`. **This algorithm ports directly** (Claude's discretion on exact impl). **But see Pitfall 3** — on the Athar `.reg-orbit` page, appending inside the register root bleeds dark-ground button/text overrides into the cream popup.
- **Sheets (:272-303):** streak sheet (returns hero + `weekCal` + never-breaks note), noor sheet (gold hero + note), course switcher (Aqeedah ACTIVE + Fiqh/Seerah/Qur'an COMING SOON rows) — all reuse one `scrim`/`sheet`. Gen-4: all ride `AW.sheet`. Copy ports verbatim.
- **Tabs (:305-310):** Learn active; Practice/Returns/Profile/More were **decorative dead taps in Gen-3** — Phase 5 makes each open an `AW.sheet` coming-soon (LRN-07); Returns → the streak sheet.
- **Storage keys the learn page reads:** `stars` (per-node star count 1-3), `chests` (per-chest claimed flag), `noor`, `returns`, `days`/`lastDay` (via `AW.weekCal`), `ringSeed`. **All exposed through `AW.state()`/`AW.S`** — no direct `awba_*` key reads (D-24). Gen-3 legacy `awba_stars`/`awba_chest_*`/`awba_noor`/`awba_returns`/`awba_days`/`awba_lastDay` all migrate losslessly [VERIFIED: `migrateFromLegacy` js :119-192].

---

## Architecture Patterns

### System Architecture Diagram

```
   double-click (file://)  OR  https deploy
              │
              ▼
      ┌──────────────────┐   <script src="shared/awba-engine.js">  (classic, parse-time AW)
      │   learn.html      │──── consumes ────────────────────────────────┐
      │  <main.reg-orbit> │                                              │
      └──────────────────┘                                              ▼
              │ render()                                        ┌─────────────────┐
              ▼                                                 │  awba-engine.js  │
   ┌───────────────────────────────┐                           │  (the one AW)    │
   │ HUD marginalia (.ls-hud)      │◄─ AW.state(): noor,returns │  AW.state / AW.S  │
   │ Ring hero (STATIC, law 9)     │◄─ AW.ringSVG({atomsDone,   │  AW.ringSVG/Seed  │
   │ streak strip + constellation  │      circuitsDone})  ──────│  AW.deriveNodeState│
   │ continue card → next active   │◄─ AW.deriveNodeState(flat, │  NODE_ATOMS (new) │
   │ daily ayah (scripture law)    │      progress)             │  AW.atomsDone(new)│
   │ winding path: 4 unit sections │      │                     │  AW.dailyIndex(new)│
   │   SVG thread ── + nodes[data- │◄─────┘  state→data-state   │  AW.weekCal/skyDawn│
   │   state] ── popup (singleton) │                            │  AW.sheet (append  │
   │ Ibrahim 14:24 (Courier)       │                            │    to <body>)      │
   │ tab bar (.tab)                │─ tap ─► AW.sheet(coming-soon)└─────────────────┘
   └───────────────────────────────┘                                    │
              │ tap node → popup START/REVIEW/LEGENDARY                  │
              ▼                                                          ▼
   click stamps view-transition-name ──► navigate ──► lessons/*.html (reg-page)
      (pageswap: source square)              │  same-origin http(s): MORPH plays
                                             │  file:// : opaque origin → NO-OP, plain nav
      lesson done() / "Back to the path" ────┘  hrefs already emit ../learn.html (D-61)
              │ chest claim (+25 once, chests slot)
              ▼
   Festival interstitial overlay (circuit plate stamp + crowd dabs + thread arc closes)
      — a THRESHOLD MOMENT only; learn screen stays Orbit
```

### Recommended additions (files touched)
```
awba-gen4/
├── learn.html                 # NEW — the front door (.reg-orbit), page-inline script
├── shared/
│   ├── awba-engine.js         # + AW.muteBtnHtml/AW.bindMuteBtn exports
│   │                          # + NODE_ATOMS map, AW.atomsDone(progress)
│   │                          # + AW.dailyIndex(date, poolLen) (day-of-year, local)
│   │                          # ~ skyDawn/ringSVG atom denominator (61 vs 65 decision)
│   └── awba-engine.css        # + @view-transition (TOP-LEVEL, high in file)
│                              # + reduced-motion VT kill block (in @layer motion)
│                              # + @layer screens: .path/.node-thermal/.npop/.plate node
└── scripts/tests/
    ├── render-smoke.mjs        # ~ findPages() also scans root learn.html
    └── learn.test.js           # NEW — CNT-03 unlock walk, atom-map sum, dailyIndex
```

### Pattern 1: Winding path — SVG thread overlay + HTML-positioned nodes (LRN-04)
**What:** A relative-positioned `.path` container per unit section. Node **buttons** are laid out with alternating horizontal offsets (the "winding" read — Claude's discretion on the exact algorithm; must NOT read as Duolingo alternating circles). An absolutely-positioned, `pointer-events:none` inline `<svg>` overlay draws a single continuous thread `<path>` connecting node centres.
**When to use:** the whole path region.
**Why this shape:**
- Nodes are real DOM buttons → keyboard-focusable (Phase 6-ready) and `getBoundingClientRect`-anchorable for popups.
- The thread is one SVG `<path>`; the **earned portion re-inks gold** by drawing a second path (or the same path clipped) with the shipped `.thread` class (`stroke:var(--gold)` + `animation:ink-draw`), its `stroke-dasharray`/`stroke-dashoffset` set to the earned fraction. This is the exact primitive the Ring already uses (`ink-draw` keyframe animates `stroke-dashoffset`) [VERIFIED: css :890-896, :1781-1785].
- Responsive 320→desktop: compute the thread `d` from node centres **after layout** (on `load` + a `resize`/`ResizeObserver` handler), so the winding line always follows the nodes regardless of width.
```
// on load + resize: measure node centres relative to .path, build the thread d=…,
// set the gold "earned" sub-path dashoffset to (1 - earnedLen/totalLen)*totalLen.
// Node entrance = the shipped `settle`/`drift` verb via animation-delay stagger (≤300ms).
```
**Confidence:** MEDIUM (design-engineering judgment; the ink primitives make it concrete, but the exact geometry is discretionary and unverified against a single source).

### Pattern 2: Daily ayah — pure day-of-year index (LRN-05)
```javascript
// Source: engine seam (new), mirrors AW.skyDawn/deriveNodeState pure-helper precedent.
// Day-of-YEAR from LOCAL parts (D-16: never toISOString / never new Date(ymdString)).
AW.dailyIndex = function (date, poolLen) {
  var d = date || new Date();
  var start = new Date(d.getFullYear(), 0, 0);          // local Dec-31-prev-year midnight
  var cur   = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  var doy   = Math.round((cur - start) / 86400000);     // 1..366, local
  return ((doy % poolLen) + poolLen) % poolLen;         // safe modulo
};
// learn.html: const ayah = DAILY[AW.dailyIndex(new Date(), DAILY.length)];
```
Render under scripture law: `.ayah` (Amiri Quran) on clean ground, strongest ink, the permitted glow (dark ground), translation + `.r-ref` + `unverified · pending review` pill, quiet `settle`, tap opens `AW.sheetRef`-style full cite. **Nothing celebratory adjacent.** [VERIFIED: `.ayah`/`.scard`/scripture-law css :386-406, :1109-1144.]

### Pattern 3: Chest claim — idempotent +25 (RWD-04)
```javascript
// contents implied BEFORE tap (popup says "a sure gift, +25 noor"); no gambling.
var chests = AW.state().chests;                // defensive copy
if (!chests[nodeId]) {                          // write-once guard
  chests[nodeId] = true;
  AW.S.set('chests', chests);
  AW.S.set('noor', AW.S.get('noor', 0) + 25);   // deterministic, exactly once
  // → Festival interstitial: circuit plate `stamp`, crowd `dab` drift, thread arc closes
} // else: "already opened — the light stayed with you"
```
Gen-3 `awba_chest_<id>` migrates into `chests` automatically. **The Festival ground lives ONLY inside this interstitial overlay; the learn screen stays Orbit (D-56).**

### Pattern 4: Cross-document shared-element morph (MOT-02)
```javascript
// On the LEARN page — stamp the tapped node's Farag square at click time, file://-safe.
window.addEventListener('pageswap', function (e) {
  if (!e.viewTransition) return;                 // null over file:// / unsupported → plain nav
  if (window.__awbaMorphEl) window.__awbaMorphEl.style.viewTransitionName = 'circuit-term';
});
window.addEventListener('pagereveal', function (e) {
  if (!e.viewTransition) return;
  // LESSON page: give the opener's Farag square the SAME name
  var opener = document.querySelector('.journey');   // the shipped opener square
  if (opener) opener.style.viewTransitionName = 'circuit-term';
});
// After the transition, clear the name so successive navigations never collide (uniqueness rule).
```
- **Uniqueness:** exactly ONE element per page may carry `circuit-term` at snapshot time — two elements with the same `view-transition-name` **skip/abort the transition**. Clear it after `finished`.
- **Scripture:** NEVER stamp a name on `.ayah`/`.scripture` (D-58).
- **Everything else** = the default UA cross-fade (free), ≤300ms.

### Anti-Patterns to Avoid
- **A second macro map.** The path is the navigable index; the Ring is THE map (D-53). Don't let the path compete (no big progress bars, no second Ring).
- **Unit colour-coding.** The Gen-3 `u.color` field is retired — do NOT reintroduce it on headers, nodes, or threads (D-53). Identity = chapter-term + `AW.UNIT_ICON` only.
- **Retired menagerie.** No lantern/companion mascot on `active` nodes (Gen-3 `.mascot`), no confetti, no amber, no PERFECT, no gummy press, no treasure-box chest art (D-53/D-56). Gated literals (`poppins`, `confetti`, `amber`, `lantern-gold`, `PERFECT`, `class="combo"`, `fonts.googleapis`, `rgba(37,54,`, `--accent`) must never appear.
- **Ring replay on load.** Always call `AW.ringSVG` WITHOUT `animateFrom` on learn load → fully static (law 9). The draw belongs to lesson-complete only.
- **Re-declaring the `@layer` order line (:16).** Only add *content* to `@layer screens`/`@layer motion`; never a second name-list statement (D-04, project law).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Node state (locked/available/active/done + chest) | A new `nodeState()` on the page | `AW.deriveNodeState(flat, progress)` | Already the promoted, tested Gen-3 rule; forking risks CNT-03 drift. |
| Page-to-page transitions | A `sessionStorage`-flag CSS crossfade | `@view-transition{navigation:auto}` | Native, 2 lines, inherited by all 20 pages, auto-degrades. |
| The earned-path gold re-ink | A bespoke fill animation | Shipped `.thread` + `ink-draw` (`stroke-dashoffset`) | The exact primitive the Ring uses; token-pure, reduced-motion-safe. |
| Bottom sheets (streak/noor/switcher/coming-soon) | Per-sheet HTML + scrim | `AW.sheet(html)` singleton | One element, outside-tap+Esc close, scroll-lock, focus-restore hook already shipped. |
| The mute toggle | A new speaker button | `AW.muteBtnHtml()`/`AW.bindMuteBtn()` (once exposed) | The identical 44px control both runners use — one pattern (D-60). |
| Day-of-year math | Inline `getDate()`-style code on the page | A pure `AW.dailyIndex` seam | Testable (LRN-05 "no monthly repeat"), D-16-safe, one place. |
| Ring geometry / seed | Any positional math | `AW.ringSVG` + `AW.ringSeed` | Deterministic, seed-stable; only `atomsDone`/`circuitsDone` change. |
| Week calendar | Date-loop on the page | `AW.weekCal()` | DOM-free `[{label,on}]`; feed both the constellation and the streak sheet. |

**Key insight:** almost nothing here is new logic. The temptation is to re-solve node-state, sheets, and transitions on the page; every one of those already exists as a shipped seam, and re-solving them is exactly how CNT-03 / RWD-04 / MOT-02 regressions get introduced.

---

## Runtime State Inventory

Phase 5 is **greenfield UI over existing storage** (no rename/refactor), but it *reads and writes* live storage state, so the storage surface is inventoried for correctness:

| Category | Items | Action Required |
|----------|-------|------------------|
| Stored data (localStorage via `AW.S`) | `stars{}` (per-node), `chests{}` (per-chest claimed), `noor`, `returns`, `days[]`/`lastDay`, `ringSeed` | Read via `AW.state()`; write ONLY `chests`+`noor` (chest claim) and `ringSeed` (lazy mint). No new keys, no schema bump. |
| Legacy Gen-3 keys | `awba_stars`, `awba_chest_*`, `awba_noor`, `awba_returns`, `awba_days`, `awba_lastDay` | **None — already migrated losslessly** by `migrateFromLegacy` (js :119-192). Verified this session. |
| Live service config | — | **None — device-local, no accounts/backend/API** (Out of Scope in REQUIREMENTS.md). |
| OS-registered state | — | **None — static web page.** |
| Secrets/env vars | — | **None.** |
| Build artifacts | — | **None — zero build step.** `learn.html` is authored static. |

**One deploy-surface flag (out of scope, note for Phase 7):** repo root has NO `index.html` (verified: root holds only `preview.html`, `docs/`, `lessons/`, `reviews/`, `scripts/`, `shared/`). `learn.html` is the "front door," but a bare GitHub Pages/Vercel domain serves `index.html` by default. Phase 7 (PLT-04 deploy/README) should decide whether `index.html` redirects to `learn.html`. **Not a Phase 5 concern** (scope excludes deploy), but recorded so it isn't lost.

---

## Common Pitfalls

### Pitfall 1: `@view-transition` ignored if it isn't early in the CSS file
**What goes wrong:** The opt-in silently no-ops even on supported browsers.
**Why:** Authoritative guidance (vtbag.dev) — *"make sure the `@view-transition` at-rule occurs in the first few bytes of the CSS file, otherwise the browser might ignore it."* [CITED: vtbag.dev/tips/css]. The engine stylesheet is 1822 lines; `@layer motion` is at ~:1729 (near the end).
**How to avoid:** Place `@view-transition { navigation: auto; }` as a **top-level at-rule high in `awba-engine.css`** (immediately after the `@layer` statement at :16), NOT buried in `@layer motion`. It is a *document descriptor*, not a cascaded property — cascade layers give it nothing. (Empirically it *parses* inside a layer in Chrome 150 — `CSSViewTransitionRule` was found — but "parses" ≠ "honored for navigation"; top-level-early removes the doubt.) The reduced-motion **kill block** (below) is a normal pseudo-rule and *can* live in `@layer motion` beside the existing reduced-motion guards.
**Warning signs:** navigations hard-cut on a page you *know* supports VT (Chrome ≥126) served over http(s).
**Confidence:** MEDIUM-HIGH (the caveat is cited; the empirical parse is verified; the "honored inside a deep layer" edge is the residual unknown → the recommendation sidesteps it).

The reduced-motion kill block (both triggers, matching the shipped dual-trigger pattern):
```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; }
}
[data-motion="reduce"] ::view-transition-group(*),
[data-motion="reduce"] ::view-transition-old(*),
[data-motion="reduce"] ::view-transition-new(*) { animation: none !important; }
```
(Author `!important` always beats the UA-origin default cross-fade regardless of layer, so placement doesn't threaten the quieting.)

### Pitfall 2: `file://` — cross-document VT does NOT fire (this is correct, not a bug)
**What goes wrong:** You expect the morph to play when double-clicking `learn.html` and it doesn't.
**Why:** Cross-document VT requires **same-origin** (same protocol + host + port). `file://` URLs carry **opaque origins**, so no `file://→file://` navigation qualifies. [CITED: developer.chrome.com/docs/web-platform/view-transitions/cross-document; WICG cross-doc explainer.]
**How to avoid:** Treat it as designed progressive enhancement — over `file://` pages navigate normally (the repo's double-click law is preserved); over same-origin http(s) the morph plays. The `pageswap`/`pagereveal` handlers MUST guard `if (!e.viewTransition) return;` so nothing throws over `file://`.
**Warning signs:** an unhandled error in the console over `file://` = a missing `e.viewTransition` guard.
**Confidence:** HIGH for the same-origin requirement + graceful nav; MEDIUM that `file://` yields a *clean* no-op with zero console noise (spec doesn't name `file://` explicitly — recommend a one-line empirical headless-Chrome check that `learn.html→lessons/u1-m1.html` navigation over `file://` produces no `SEVERE`/`Uncaught`).

### Pitfall 3: The cream popup inherits dark-ground button/text overrides (register scoping bleed)
**What goes wrong:** START/REVIEW buttons inside the cream popup render as a cream key on cream (invisible), because `.reg-orbit .btn { background: var(--cream); color: var(--kiswah); }` (css :672) applies to any `.btn` descendant of the `.reg-orbit` root — and Gen-3's `placePop` appends the popup *inside* the node's row (inside `.reg-orbit`).
**Why:** The learn root is `<main class="reg-orbit">`; the shipped `.reg-orbit .btn` / `.reg-orbit .hstat` overrides recolour everything beneath it for the dark ground.
**How to avoid:** Follow the **`AW.sheet` precedent** — the sheet works because it appends `scrim` to `document.body` (OUTSIDE `.reg-orbit`), so its buttons get the default Page-crimson `.btn`. Append the node popup to `document.body` too and position it via `getBoundingClientRect` + `position:fixed` (scroll-aware), OR wrap the popup with an explicit Page context. This is the "register-as-component exemption" (D-55) done correctly — the cream slip is a Page object, not an Orbit descendant.
**Warning signs:** invisible/low-contrast CTAs in the popup; HUD text vanishing if the popup borrows `.hstat`.
**Confidence:** HIGH (derived directly from the shipped CSS scoping rules + the sheet's body-append pattern).

### Pitfall 4: The active tab's crimson cue fails contrast on the Orbit ground
**What goes wrong:** `.tab.active` uses `color:var(--crimson)` + a crimson top-rule (css :749), but **crimson on Kiswah Black is 2.65:1** — banned on Orbit (the CSS says so repeatedly; the whole review register re-inks to gold for exactly this reason, css :1686-1688).
**Why:** the learn page is `.reg-orbit`; the shipped `.tab.active` was authored for Page (cream).
**How to avoid:** either (a) put the tab bar on a cream footer strip (a Page-object footer, like the sheet is), so crimson works, or (b) add a `.reg-orbit .tab.active` gold override (mirror the shipped `.rv-shell .opt:active{border-color:var(--gold)}` precedent). Claude's discretion which; (b) keeps the marginalia-on-dark read.
**Confidence:** HIGH (contrast values + the existing gold-override precedent are in the CSS comments).

### Pitfall 5: The seed-row can only be BINARY across sessions (beat progress isn't persisted)
**What goes wrong:** You try to show "3/5 sprouted" on a *partially-done* lesson's node on the learn page, but that state doesn't survive — only `stars[nodeId]` (a 1-3 star count set at lesson `done()`) is persisted; per-atom/per-beat progress is NOT stored (`AW.state()` has no beat index).
**Why:** The ATHAR "day in Awba" moment 2 shows "seed-row sprouting 3/5" — but that is a **lesson-page live element** (the shipped `.ls-prog` per-beat dab row, which reads the in-memory `pos`/`stepIndex`), NOT a learn-page element. On the learn page, a node is either done (has stars) or not.
**How to avoid — the honest source (recommend, and flag D-55 for this framing):** the learn-page seed-row = `NODE_ATOMS[id]` dots; **inked/sprouted iff the node is `done` (has stars), faint Madder dots otherwise**. This is truthful with storage and needs no new persistence. Do NOT proxy sprout-count off beats (wrong across sessions). If the owner wants live partial sprouting on the learn page, that requires persisting per-lesson atom completion, which **does not exist** — out of scope; don't invent it (content/state integrity).
**Confidence:** HIGH (verified: `AW.state()` shape + the runner's non-persisted `pos`/`stepIndex`).

### Pitfall 6: `muteBtnHtml`/`bindMuteBtn` are module-private — the page can't call them
**What goes wrong:** D-60 says "the 44px mute toggle (shared `muteBtnHtml`)," but `function muteBtnHtml()` / `function bindMuteBtn()` are file-scope declarations, **not on `AW`** (verified: no `AW.muteBtnHtml` exists). A page-inline script cannot reach them.
**How to avoid:** add two one-line exports in the engine (`AW.muteBtnHtml = muteBtnHtml; AW.bindMuteBtn = bindMuteBtn;`) — they already close over `SPEAKER_ON`/`SPEAKER_OFF` and `AW.prefs`, so exposing the functions is sufficient. This keeps "one mute pattern" (D-60) instead of the page re-authoring a toggle (which would also risk the gated-glyph freeze — `components.test.js` asserts `glyphCount===13`, so do NOT add a speaker glyph to `AW.GLYPHS`).
**Confidence:** HIGH.

### Pitfall 7: `render-smoke.mjs` doesn't scan the repo root — learn.html is untested by default
**What goes wrong:** `findPages()` only walks `lessons/` and `reviews/` (verified: :36-45); root `learn.html` never gets a headless smoke run.
**How to avoid:** extend `findPages()` to also include root `learn.html` (and any future root page). The register-root regex `class="[^"]*\breg-(page|orbit)\b[^"]*"` **already passes** for learn.html (it is `reg-orbit`) — no regex change needed, only the file-discovery list.
**Confidence:** HIGH (read the harness source).

### Pitfall 8: iOS Safari cross-doc VT quirks + scroll restoration
**What goes wrong:** On iOS Safari 18.x, cross-doc transitions can interact awkwardly with scroll-position restoration (the old snapshot captures the scrolled path; the new page starts at top), and back-navigation morphs may flash.
**How to avoid:** keep the morph to the single shared-element square + default cross-fade (D-58 already constrains this); honour `#<node-id>` scroll-to on load (D-61) so returning to the path lands at the right node deterministically rather than relying on browser scroll restoration; test the back-nav path on a real iOS 18.2+ device in Phase 6 hardening.
**Confidence:** MEDIUM (general VT-on-iOS reports; not reproduced this session — flag for device QA, not a build blocker).

---

## Code Examples

### Ring hero — STATIC on load (law 9, no replay)
```javascript
// Source: AW.ringSVG signature verified in awba-engine.js :1147-1291.
// OMIT animateFrom ⇒ animateFrom defaults to atomsDone ⇒ empty draw span ⇒ fully static.
var st = AW.state();
var atomsDone = AW.atomsDone(st);                 // new seam (sum of NODE_ATOMS over starred nodes)
document.getElementById('ringHost').innerHTML = AW.ringSVG({
  atomsDone: atomsDone,                            // circuitsDone derives internally
  size: 300
  // NO animateFrom — the draw belongs to lesson-complete only (WR-01 default-static behaviour)
});
document.documentElement.style.setProperty('--dawn', String(AW.skyDawn(atomsDone)));
```

### Node → thermal `data-state` (consume the shipped shape grammar)
```javascript
// Source: AW.deriveNodeState :439; thermal shapes css :858-875.
// state → data-state: done→'mastered' (filled gold+check), active/available→'progress'
// (ember half-dab), locked→'not-yet' (hollow powder ring). Review nodes add .rosette; chest
// nodes render the plate-framed gift node (no IC_CHEST art).
var states = AW.deriveNodeState(flat, AW.state()); // [{id,state}]
// map each to <button class="node" data-state="…"> + star count in Courier for done nodes.
```

### Course switcher / coming-soon tab (one `AW.sheet`)
```javascript
// Source: AW.sheet :998 — singleton, append-to-body, outside-tap+Esc close, scroll-lock.
AW.sheet(
  '<div class="grip"></div>' +
  '<div class="sheet-row cs-row">…Aqeedah · Level 1 … ACTIVE</div>' +
  '<div class="sheet-row cs-row off">…Fiqh · Level 1 … COMING SOON</div>' + …
);
```

---

## State of the Art

| Old (Gen-3) approach | Current (Athar / gen-4) approach | Why it changed |
|----------------------|----------------------------------|----------------|
| Per-page 12-icon `KIT` + standalone `IC_*` constants | One `AW.KIT`(20)/`AW.GLYPHS`(13) registry | FND-04 single source; the Gen-3 `IC_STAR/IC_CHEST/IC_LOCK/IC_TROPHY` in learn.html are superseded by `AW.GLYPHS.star/chest/lock/trophy`. |
| Unit colour-coded headers/nodes (`u.color` blue/purple/teal/gold) | Chapter-term + `AW.UNIT_ICON`, NO unit colour | Athar law 7 (≤6 tokens/screen) + the pivot; colour-coding retired. |
| Manual page navigation (hard cut) | `@view-transition{navigation:auto}` MPA morph | Native cross-doc VT shipped Safari 18.2 / Chrome 126 (Dec '24) — MPA no longer feels like a step down from an SPA. |
| `getDate() % 7` daily rotation | day-of-year `% 7` via pure `AW.dailyIndex` | Fixes the documented monthly-repeat bug (D-59), testable. |
| `ATOMS_PER_NODE = 3` proxy (Phase 4) | Verified `NODE_ATOMS` map (61 taught) | The authoritative Gen-3 §4 content map exists (D-57 resolved). |

**Deprecated/outdated:**
- The Gen-3 lantern **mascot** on active nodes, the amber streak-band gradient, treasure-box `IC_CHEST` art, `SECTION 1 · UNIT n` unit-card styling — all retired by the Athar pivot; port the *behaviour*, not these visuals.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The Ring atom denominator should be **61** (taught) so a completed course fully inks | Atom Map (D-57) | If owner wants 65 (corpus), the Ring inks to 61/65 at completion — a visual "never closes" that reads oddly. **Decision required before wiring.** |
| A2 | **U4-09** is intentionally not taught (a silent 4th hold or numbering gap), not a missing lesson | Atom Map (D-57) | If U4-09 *should* be taught somewhere, the atom map / a lesson is incomplete — but that's a content matter (owner/scholar), not a Phase-5 build matter; the earnable set is still exactly what the §4 map lists. |
| A3 | `file://` cross-doc navigation yields a **clean** no-op (no console error) with the `e.viewTransition` guard | View Transitions | Low — the guard prevents throws; worst case is a benign log. Mitigated by the recommended empirical headless check. |
| A4 | `@view-transition` inside `@layer motion` is *honored* (not just parsed) — sidestepped by top-level placement | Pitfall 1 | Low — the recommendation places it top-level-early, which is the safe path regardless. |
| A5 | The winding-path SVG-thread-over-HTML-nodes approach reads as a "hand-inked journey" | Pattern 1 | Design risk only — the UI-safety gate + `preview.html` reference catch a wrong read before ship. |
| A6 | `getBoundingClientRect`/`ResizeObserver` are safe universal APIs on target browsers | Pattern 1 | Negligible (baseline everywhere in the iOS 18.2 / Chrome 126 target). |

**If a claim above is load-bearing for a decision, discuss-phase/owner should confirm A1 (and note A2) before the Ring-wiring wave.**

---

## Open Questions

1. **Ring atom denominator: 61 or 65? (RESOLVED — 61, per UI-SPEC Ruling R-1; adopted at orchestration 2026-07-13)**
   - What we know: taught=61, corpus=65, gap=4 documented holds. `AW.ringSVG`/`skyDawn`/`ring.test.js`/`preview.html` all currently assume 65.
   - What's unclear: owner preference for "fully inks at completion" (61) vs "honest 61/65 with 4 held" (65).
   - Recommendation: **61**, documented as corpus-minus-holds; make it the one `NODE_ATOMS`-derived constant. Flag as a locked decision in the plan.

2. **Tab bar ground: cream strip vs gold-on-Orbit override? (RESOLVED — gold `.tab.active` override on Orbit, per UI-SPEC Ruling R-5)**
   - What we know: `.tab.active` crimson fails on Kiswah (Pitfall 4); both fixes are one-liners.
   - Recommendation: Claude's discretion (D-60) — a cream footer strip is the simplest and keeps the shipped crimson cue; a gold override keeps a fully marginalia-on-dark read. Either is fine; pick one in planning.

3. **Plant-stamp scope: full ~20-doodle pool vs single-sprout MVP (D-55 fallback)? (RESOLVED — single-sprout MVP now, doodle pool logged as the D-55 fast-follow, per UI-SPEC Ruling R-3)**
   - What we know: the bounded asset kit sanctions ~20 sprout/plant SVGs; D-55 explicitly permits shipping seed-rows + one sprout glyph and deferring the pool as a fast-follow.
   - Recommendation: **planner decides the wave split** — ship seed-rows + a single sprout stamp in v1 of this phase; log the full doodle pool as the D-55 fast-follow. Keeps the phase from ballooning on asset authoring.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | `node --test` suite, `render-smoke.mjs`, validator | ✓ | v24.13.0 | — |
| System Chrome (headless) | `render-smoke.mjs` (real-DOM smoke incl. VT-parse + file:// no-op check) | ✓ | 150.0.7871.114 | — |
| ugrep | gated-literal grep gates (paren-wrap `--leading`) | ✓ (present) | — | plain `grep` for reads |
| npm packages | — | N/A | — | zero-dep project (none ever) |

**No missing dependencies.** No external services, no network at runtime (verbatim scripture embedded at authoring time; no live API). Service-worker/PWA testing is Phase 7 (SW never registers over `file://` regardless).

---

## Validation Architecture

Nyquist validation is **enabled** (`workflow.nyquist_validation: true`). The learn page has a large storage-derived logic surface that MUST be automatable, and a large visual surface that is human-only.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Node built-in `node:test` (`node --test`), zero-dep |
| Config file | none — glob invocation only |
| Quick run command | `node --test scripts/tests/learn.test.js` |
| Full suite command | `node --test scripts/tests/*.test.js` (glob form ONLY — machine note) |
| Real-DOM smoke | `node scripts/tests/render-smoke.mjs` (extend to root `learn.html`) |
| Content self-test | `node scripts/validate-content.js` (must stay OK) |

### Phase Requirements → Test Map
| Req | Behavior | Test Type | Automated command / seam | File Exists? |
|-----|----------|-----------|--------------------------|-------------|
| CNT-03 | Unlock order matches Gen-3 exactly (sequential incl. m2/m3b/m2b; chest after review) | unit | `node --test scripts/tests/learn.test.js` — walk `AW.deriveNodeState` over the real UNITS flat map with staged `stars`/`chests` fixtures; assert the exact locked→active→done transitions incl. chest-after-review | ❌ Wave 0 (`learn.test.js`) |
| D-57 | `NODE_ATOMS` sums to the taught total; `AW.atomsDone` sums only starred nodes | unit | assert `Σ NODE_ATOMS === 61` (or the locked denominator); `AW.atomsDone({stars:{u1m1:3}}) === 3` | ❌ Wave 0 |
| LRN-05 | Daily rotation is day-of-YEAR (no monthly repeat) | unit | `AW.dailyIndex(new Date(y,0,8),7) !== AW.dailyIndex(new Date(y,1,8),7)` (Jan-8 vs Feb-8 differ — the exact Gen-3 bug); modulo stability across a year | ❌ Wave 0 |
| RWD-04 | Chest claim = +25 once, idempotent | unit | drive `AW.S` stub: claim once → noor+25 + `chests[id]`; claim again → no change | ❌ Wave 0 (extend `state-storage.test.js` pattern) |
| D-59 | DAILY pool byte-verbatim vs Gen-3 :153-160 | fidelity | `port-audit.mjs`-style SHA/byte compare of the spliced pool region against the Gen-3 source | ❌ Wave 0 (reuse port-audit pattern) |
| LRN-01/02/03/04/06/07, MOT-02 | Page renders with no console error; register root present; VT rule parses; file:// navigates clean | smoke | `render-smoke.mjs` on root `learn.html` (no `Uncaught`/`SEVERE`; `reg-orbit` matched) + a `file://` `learn→u1-m1` navigation producing no error | ❌ Wave 0 (extend `findPages()`) |
| MOT-02 morph | Shared-element name stamped/cleared; scripture never named | smoke/manual | headless assert `.journey` receives/clears `viewTransitionName`; **visual morph = manual** (VT playback not observable in `--dump-dom`) | partial |
| LRN-04 visual, D-53 composition, plate/interstitial, reverent ayah | The path reads as a journey; Athar registers correct; Festival threshold only | **human-only** | UI-safety gate + `preview.html` cross-reference (owner/opus visual review) | manual |

### Sampling Rate
- **Per task commit:** `node --test scripts/tests/learn.test.js` (+ the touched engine test, e.g. `ring.test.js` if the denominator changed).
- **Per wave merge:** `node --test scripts/tests/*.test.js` + `node scripts/tests/render-smoke.mjs` + `node scripts/validate-content.js`.
- **Phase gate:** full suite green + render-smoke OK on all 20 pages **and** root `learn.html`, before `/gsd:verify-work`; then the human UI-safety/visual gate.

### Wave 0 Gaps
- [ ] `scripts/tests/learn.test.js` — CNT-03 unlock walk, `NODE_ATOMS` sum, `AW.atomsDone`, `AW.dailyIndex`, chest idempotency (covers CNT-03/D-57/LRN-05/RWD-04).
- [ ] Extend `scripts/tests/render-smoke.mjs` `findPages()` to include root `learn.html` (+ a `file://` navigation no-error check for MOT-02).
- [ ] DAILY-pool byte-fidelity check (reuse the `port-audit.mjs` splice-vs-source SHA pattern).
- [ ] Engine seams the tests need must land first (or same wave): `AW.atomsDone`, `AW.dailyIndex`, `AW.muteBtnHtml`/`AW.bindMuteBtn`, `NODE_ATOMS`.
- Framework install: **none** (node built-in).

---

## Security Domain

`security_enforcement` is not disabled in config, so it is treated as enabled — but this phase is **device-local, no accounts, no backend, no network at runtime, no user-generated content** (REQUIREMENTS "Out of Scope"). The applicable surface is narrow.

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No accounts/auth in v1. |
| V3 Session Management | no | No sessions. |
| V4 Access Control | no | No server, no protected resources. |
| V5 Input Validation / Output Encoding | **partial** | The popup/sheet/ayah render **author-controlled** strings via `innerHTML`. The engine already ships `escapeHtml`/`escapeAttr` (js :903) for the two dynamic params it controls (`AW.icon` label, `AW.cite` label); scripture/course data injects verbatim by design (author content, T-03-03 accept). **No user input reaches any sink** (device-local, no fields except the never-persisted reflect textarea, which is not on this page). |
| V6 Cryptography | no | `AW.ringSeed` uses `Math.random` for a non-security cosmetic seed only (documented) — never hand-roll crypto here. |

### Known Threat Patterns for this stack
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| DOM XSS via `innerHTML` | Tampering | All injected strings are author-controlled (node labels, spliced verbatim scripture); no user/URL-derived data is interpolated. The `#<node-id>` hash (D-61) MUST be used only to *match* a known node id / scroll target, never interpolated into HTML — validate against the known UNITS ids before use. |
| localStorage tampering | Tampering/Repudiation | Accepted by design (device-local, un-loseable-by-mercy premise); `AW.S` already tolerates corrupt/foreign blobs non-destructively (the memFallback path). No integrity guarantee needed for cosmetic progress. |
| Supply chain | Tampering | N/A — zero external packages, everything self-hosted (project law). |

**One concrete control for Phase 5:** when honouring the URL hash `#<node-id>` (D-61), match it against the known node-id set from `UNITS` and use it only as a `scrollIntoView` target — do not interpolate the raw hash into any markup.

---

## Sources

### Primary (HIGH confidence)
- `shared/awba-engine.js` (read: state/migration :57-343, `AW.deriveNodeState` :439, `AW.state`/`weekCal` :373-429, icon/sheet/sheetRef :927-1084, `AW.ringSVG`/`ringSeed` :1116-1291, sky/`skyDawn` :1313-1357, runner math + `ATOMS_PER_NODE` proxy :1369-1688, `muteBtnHtml`/`bindMuteBtn` :1642) — the shipped seams.
- `shared/awba-engine.css` (read: `@layer` order :16, tokens/registers/thermal :18-347, sheet/press/celebration primitives :430-921, `@layer screens` :923-1727, `@layer motion` keyframes + reduced-motion + `ink-draw` :1729-1821).
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/learn.html` (read in full) — behaviour port target.
- `_MVP-BUILD/00_MVP-PLAN.md §4` + `_MVP-BUILD/00_BUILD-RECORD.md §4` + source atom files (`aqeedah-unit{1..4}-atoms-v2.md`) — the D-57 atom map, cross-verified.
- `.planning/ATHAR-SYSTEM.md` ("A day in Awba" moment 1 :65, seed-row/plant grammar :21, bounded asset kit :79), `.planning/STATE.md` (Phase 3/4 seams), `05-CONTEXT.md`, `REQUIREMENTS.md`, `CLAUDE.md`.
- Headless Chrome 150 empirical: `@view-transition` inside `@layer motion` → `CSSViewTransitionRule` present (`data-vt-rule-parsed=true`); `startViewTransition` present.
- [CITED] developer.chrome.com/docs/web-platform/view-transitions/cross-document — same-origin gate, `pageswap`/`pagereveal` name stamping, uniqueness cleanup.

### Secondary (MEDIUM confidence)
- [CITED] vtbag.dev/tips/css — "`@view-transition` must occur in the first few bytes of the CSS file, otherwise the browser might ignore it."
- [CITED] MDN `@view-transition` at-rule; WICG cross-doc explainer — same-origin/navigation-type constraints.
- CLAUDE.md STACK section — View Transitions cross-doc support numbers (Safari 18.2 / Chrome 126), classic-script/`file://` module law.

### Tertiary (LOW confidence — flagged for validation)
- iOS Safari 18.x cross-doc VT + scroll-restoration quirks (Pitfall 8) — general reports, not reproduced this session; device QA in Phase 6.
- Clean `file://` no-op with zero console noise (A3) — spec doesn't name `file://`; recommend the empirical headless check.

## Metadata

**Confidence breakdown:**
- Behaviour port (Gen-3 inventory, unlock rules, chest, popup, sheets, tabs): **HIGH** — read the actual source; the deriving seam already exists.
- Engine seams (Ring, sheet, sky, icons, mute, state): **HIGH** — read the actual code.
- Atom map (D-57): **HIGH** for the map; the 61-vs-65 denominator is a flagged **DECISION**, and U4-09 is an **[ASSUMED]** hold.
- View Transitions (same-origin/file:// gate, name stamping, reduced-motion): **HIGH** on the same-origin requirement + graceful nav; **MEDIUM-HIGH** on the "early-in-file" placement; **MEDIUM** on clean-file://-no-op.
- Winding-path rendering approach: **MEDIUM** — design-engineering judgment grounded in shipped primitives, discretionary geometry.
- Validation architecture: **HIGH** — the logic surface is genuinely automatable; the visual surface is honestly human-only.

**Research date:** 2026-07-13
**Valid until:** ~2026-08-13 for the engine/behaviour findings (stable, in-repo); ~2026-07-27 for the View-Transitions browser-support/placement details (fast-moving platform area — re-verify Safari/Chrome behaviour if the phase slips).
