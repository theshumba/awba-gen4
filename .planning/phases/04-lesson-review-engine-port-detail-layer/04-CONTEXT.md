# Phase 4: Lesson & Review Engine Port + Detail Layer - Context

**Gathered:** 2026-07-13 (auto mode — owner directive: proceed autonomously; recommended options selected, logged in 04-DISCUSSION-LOG.md)
**Status:** Ready for planning

<domain>
## Phase Boundary

Port Josh's Gen-3 lesson + review engines so all 19 data files (15 lessons, 4 reviews) render end-to-end VERBATIM through `AwbaLesson(cfg)` / `AwbaReview(cfg)` — every beat type, refs/terms sheets, quiz + review mechanics with numbers preserved exactly — plus the reward choreography and detail polish, all expressed in **the Athar System** (the locked Gate-2 design authority). NO Learn page (Phase 5), NO PWA (Phase 7), NO new content of any kind.

**CRITICAL FRAME:** ROADMAP Phase-4 success criteria were re-voiced to Athar at the 2026-07-12 pivot (mechanics identical, expression translated). REQUIREMENTS.md lines ENG-03/ENG-05/RWD-01/RWD-02/RWD-03 still carry Gen-3 visual vocabulary ("combo chip, PERFECT, confetti, amber, orange hero, companion presence") — the translation table in D-45 below is the BINDING reading, approved via the Gate-2 lock + the §9 gate pass. Never re-introduce a retired element (confetti, PERFECT overlay, companion mascot, amber mercy, unit accent colours, gummy press).

</domain>

<decisions>
## Implementation Decisions

### D-45 — The binding Gen-3 → Athar translation table (mechanics identical, expression re-voiced)
| Gen-3 term (in REQUIREMENTS) | Preserved mechanic | Athar expression (locked) |
|---|---|---|
| combo chip at 2+ | 2+ streak accrual, same thresholds | accruing gold-dot chip (`.dab` gold at small scale), pops via `stamp`/`settle`, never mid-scripture |
| PERFECT at 3-streak / flawless | same trigger + noor numbers | quiet gold-thread flourish + praise copy on the quiz META surface (Page register); no full-screen overlay, no indigo |
| confetti | celebration at lesson/review completion | `.dab` drift (Circle register `drift` verb) + Ring frontier draw; Festival `stamp` reserved for circuit thresholds |
| amber-never-red misses | wrongness is never red, never punitive | Athar law 8: grey ink-blot fade + one-line explanation; Rose Ember frames ONLY the retry; amber is retired |
| orange returns hero | returns screen prominence + week calendar never-miss grammar | warm hero via Sky's `--apricot` horizon warmth on cream (returns = constancy/time = Sky's domain); calendar days at lighter ink presence, never gaps/red |
| companion presence (lantern bob/glow) | a felt closing presence per session | RETIRED as mascot (aniconism). Presence = the Ring drawing your new frontier (`animateFrom` = pre-lesson count) + the Sky du'a close: one du'a in Amiri + "Alhamdulillah — continue." Lantern appears only as inert scene icon where content references it |
| gold legendary theme | review = elevated, rarer register | reviews open in Orbit-dark with Hajar Gold accents: "the circle gathers" (dab-drift in), gold thread progress instead of lamp-path; gold rosette seal on mastery |
| stars 3/2/1 | identical star math, never 0 | shape-first gold dabs/rosettes (hollow/half/filled grammar consistent with data-state) |
| 3-Lens amber/blue/green | fixed order, opt-in accordion, never blocks Continue | Reality → Madder Wash · Revelation → Mihrab Crimson · Ruling → Za'atar Olive; each lens shape+label cued (never colour-only); scripture inside Revelation follows scripture law |

### Engine port (ENG-01..04)
- **D-46:** `AwbaLesson`/`AwbaReview` accept Josh's cfg shape byte-unchanged — `scripts/validate-content.js` is the port gate (run against all 19 real files; exit 0 required). Beat renderers live in the engine's RUNNERS banner section, consuming ONLY the shipped Phase-3 primitives (`AW.icon/cite/wire/sheet/sheetRef/sheetTerm/animate/ringSVG/ringSeed`, paper-press classes, thermal `data-state`, registers). No new CSS tokens; no layer-order changes; content blocks only.
- **D-47:** Lessons render in the **Page register** (`.reg-page` cream): verse beats = scripture law (`.ayah`, rubricated, strongest ink, `--go:0` no grain behind scripture, nothing celebratory adjacent); quiz beats = ink-bordered cards with the paper-press; per-beat progress dots = thermal `data-state` shapes. Reviews render Orbit-dark + gold per D-45. All quiz/review NUMBERS (+12/+15, 14s, +15/+5 swift, 2★ timeout cap, no back button) byte-preserved from Gen-3 behaviour.
- **D-48:** Nightfall interstitial is NOT auto-triggered in Phase 4 — no heuristic may pick "the weightiest ayah" (that's a content/scholar judgement). The component ships (Phase 3 built it); wiring waits for explicit data support or owner direction. Logged as deferred.

### Content port (CNT-01/02/04)
- **D-49:** All 19 files copied byte-verbatim from `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/` (lessons/ + reviews/), then validated (`validate-content.js`) + diffed against source (scripture byte-identity check recorded in the SUMMARY). Sensitive holds verified by explicit grep/diff pass: U4-03 absent, U3-13 not surfaced, U3-16 principle-only, group-namings held. NEVER regenerate, never "fix" content — Josh's omissions ARE the holds.
- **D-50:** Arabic laws at render time: every Arabic span `lang="ar" dir="rtl"`; ayah → Amiri Quran face; hadith/du'a → general Amiri; ﷺ + honorifics + ˹ ˺ brackets intact (˹ ˺ falls through Readex Pro to the silent Inter fallback — already proven in preview).

### Reward choreography (RWD-01..03)
- **D-51:** Post-lesson sequence keeps Josh's four moments — verdict → noor claim → returns → done — as WAAPI-chained choreography (`AW.animate` pattern from Phase 3): staggered star/stat reveals (settle), noor count-up in Marcellus display numerals, returns hero per D-45, done = recap + next handoff. The sequence ends with the **Ring moment**: `AW.ringSVG({animateFrom: preLessonAtoms})` draws exactly the newly-earned frontier (WR-01 API), then the du'a close. Celebration NEVER on/adjacent to a scripture beat (grep-gated like preview §5).
- **D-52:** Sound (MOT-05): build the full plumbing now — `AW.sound(cue)` with slots correct/incorrect/complete/streak, a visible mute toggle wired to the existing `awba_prefs.soundMuted` boot-stamp, cue files loaded from `shared/sfx/` page-relative — but ship v1 with SILENT placeholders (missing file = clean no-op, zero console errors). Actual cue assets are an OWNER decision (calm, dignified, own identity — sound EFFECTS not music, per standing owner preference); sourcing is flagged on the owner ledger, not build-blocking. When assets land, they drop into `shared/sfx/` with zero code change.

### Claude's Discretion
Beat renderer markup structure, WAAPI stagger timings within the ≤300ms/token law, praise-copy pool wording (non-scripture), exact returns-hero composition within D-45's Sky-warmth ruling, review intro/result composition within the Circle/gold ruling — all within the locked registers and the 03-UI-SPEC-ATHAR component directives.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design authority (the Gate-2 lock — binds every visual choice)
- `.planning/ATHAR-SYSTEM.md` — the locked five-register contract (registers, constitution, tokens, "a day in Awba" journey the choreography must honour)
- `.planning/phases/03-components-icon-kit-motion-language/03-UI-SPEC-ATHAR.md` — §2 tokens, §3 registers, §4 per-component states (paper-press, law-8 wrong-answer, sheet face-split), §6 Ring API (incl. `animateFrom` no-replay), §7 sky, §11 decisions D-A1..A14
- `docs/superpowers/specs/2026-07-12-athar-adoption-design.md` — what survives / what died at the pivot (retired-element list)
- `.planning/phases/03-components-icon-kit-motion-language/03-REVIEW-ATHAR.md` — FIXES section: `animateFrom` semantics (WR-01), structure validation (WR-03), `AW.S.isFallback()` (WR-09)

### Content + contract (the machine — binds every content choice)
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/` — Josh's Gen-3: `lessons/` (15) + `reviews/` (4) = THE verbatim content source; `shared/awba-engine.js` = mechanics ground truth (noor math, timers, star math, praise pools, beat behaviours)
- `.planning/research/ENGINE-CONTRACT.md` — frozen cfg schema (§1 beats/refs/terms field shapes, §2 review items)
- `scripts/validate-content.js` — the executable port gate (`node scripts/validate-content.js` over lessons/ + reviews/; `--self-test` must stay OK)
- `AWBA_Research_and_Pedagogy_Master.md` (in `/Users/theshumba/Downloads/muslim app/` docs set) — mercy framing, no casino juice over scripture, depth opt-in

### In-repo state
- `shared/awba-engine.js` — STATE/KIT/COMPONENTS/RING/SKY live; RUNNERS banner awaits this phase; `globalThis.AW` exported for tests
- `shared/awba-engine.css` — all five layers Athar-final; Phase 4 writes ONLY `@layer screens` content blocks (never re-declare the order line at :16)
- `preview.html` — the approved living reference (§9 gate PASSED 2026-07-13); lesson/review surfaces must read as the same product
- `scripts/tests/*.test.js` — 64/64 green baseline (glob form only on this Node)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Full Phase-3 primitive inventory: `AW.icon` (20+13 registry), `AW.cite`/`AW.wire` (validator byte-compatible), `AW.sheet`/`sheetRef`/`sheetTerm` (face-split + pills), `AW.animate` (WAAPI exemplar), `AW.ringSVG`/`ringSeed` (deterministic, `animateFrom`), `AW.skyTemp`/`applySky`/`skyDawn`, paper-press classes (`.btn/.opt/.tf/.tile/.tab/.hstat/.cite/.term`), `.dab/.thread/.plate/.rosette`, thermal `data-state`, `.nightfall`, both reduced-motion triggers.
- `AW.S`/`AW.prefs` versioned state (noor/returns/stars/days/chests slots already in the blob) + `isFallback()`.

### Established Patterns
- Sequential executors on main tree; atomic conventional commits; `node --test scripts/tests/*.test.js`; `! grep -q` absence gates with paren-wrapped `--`-leading patterns (ugrep); gated literals never in comments/strings in shared/; plan line numbers go stale — locate by content; classic scripts/file://; page-relative URLs.
- Verbatim-content law: splice, never retype (preview demoCfg precedent: SHA-verified byte-identity).

### Integration Points
- Lesson/review pages: classic `<script src="shared/awba-engine.js">` then the data file calling `AwbaLesson(cfg)`/`AwbaReview(cfg)` — load order matters, zero content edits.
- Phase 5 consumes: deriveNodeState (already in STATE), the reward-done handoff (`next` field), Ring on home.
- Phase 6 hardens: aria-live verdicts, focus management in the choreography; Phase 7 precaches `shared/sfx/` if assets landed.

</code_context>

<specifics>
## Specific Ideas

- The bar: a lesson should feel like reading a warm manuscript page that quietly celebrates you at the *end* — never a game show. Ember is working-warmth, not alarm (owner approved at the gate; watch it at lesson scale).
- The Ring moment at lesson-complete is the emotional payoff of the whole pivot — it must use `animateFrom` correctly (only the new frontier draws) and never replay.
- Owner ledger (not build-blocking): sound-cue asset sourcing (D-52); Clear Quran licensing; scholar gate on atoms.

</specifics>

<deferred>
## Deferred Ideas

- Nightfall auto-triggering on "the weightiest ayah" (D-48) — needs content/scholar judgement or explicit data markers; component ships unused in lessons for now.
- Seed-rows + 15 plant stamps (Ink micro-progress) — lesson-index surface = Phase 5 (Learn page).
- Festival circuit plates + crowd-arrival moment — circuit-completion threshold = Phase 5 wiring (register + primitives ready).
- Gold-thread seeded jitter (owner taste follow-up from 03-07) — revisit only if Melusi asks.
- Per-citation verified state — scholar-gate workflow.

</deferred>

---

*Phase: 4-lesson-review-engine-port-detail-layer*
*Context gathered: 2026-07-13*
