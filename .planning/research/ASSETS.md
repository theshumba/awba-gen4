# Assets & Reference Inventory (session exploration, 2026-07-11)

> Produced by a Sonnet exploration agent sweeping Josh's folder + the v3 design track before roadmapping.
> **ORCHESTRATOR CANON NOTE — read this first:** Two design generations conflict. The v3 "blue system" docs (03-DESIGN-SYSTEM.md, 02-BRAND-VOICE) ban confetti, combo pills, stars, timers. Josh's **Gen-3 MVP is NEWER (2026-07-10, 5 owner review rounds) and is the design authority for Gen-4**: confetti/combo/PERFECT/stars/noor/returns/timed legendary reviews are IN, mercy-framed. What still binds from v3/brand-voice: no red for learner error (amber only), no confetti/juice OVER scripture screens, no guilt copy, machinery invisible (no pedagogy jargon in UI), Arabic typography laws (dir=rtl lang=ar, Amiri ≥1.4× Latin, .ayah reserved for Qur'an), verbatim-scripture policy (compartments-v4 2026-07-10 verbatim rule SUPERSEDES the older paraphrase rule), pending-review pills, sensitive-atom holds. Where Gen-3 MVP behavior and older docs disagree, **Gen-3 MVP wins**.

---

## (a) Asset Inventory

**Branding — `/Users/theshumba/Downloads/AWBA APP/_ORGANIZED/03_Branding/`**
- `Illustration Kit.pdf` — PDF v1.4, 1 page
- `Sukun-Brand-Kit-v1_2-Internal.pdf` — PDF v1.7 (restricted permissions)
- `icon files/` — **20 SVGs** (canonical set, viewBox 240×300 portrait, inline-safe, shared blob-background + brand-blue palette + sparkle motif):
  01-mosque · 02-prayer-carpet · 03-lantern · 04-lanterns · 05-crescent-star · 06-woman-hijab · 07-man · 08-family · 09-prostration · 10-standing-prayer · 11-quran-stand · 12-prayer-beads · 13-kaaba · 14-hands-dua · 15-iftar-dates · 16-qibla-compass · 17-water-ewer · 18-ramadan-night · 19-star-pattern · 20-ramadan-calendar
  (Build record said "12 icons" — stale; the folder and v3 spec §7.1 both agree on 20.)

**Gen-2 Lab — `/Users/theshumba/Downloads/AWBA APP/_BUILDS/_GEN2-LAB/`**
- `awba-GEN2-V1-gamified-u2m2.html` (604 lines, maximalist gamified) · `awba-GEN2-V3-legendary-unit2.html` (246 lines, timed mastery) · V2 chat experiment · research brief + audit docs

**Build handoffs** — `build-v3-melusi_LATEST/` (compartments-v4, Pedagogy Master, unit 2–4 atoms, master handoff v2) · `build-v2-transfer/` (unit 1 atoms, Jibreel teardown, lesson prototypes)

**v3 design track (relocated)** — `~/Desktop/Projects/Awba/awba-lovable/` (10 numbered docs + AWBA-ALL-IN-ONE.md + 87-screen fused gallery + source/)

**Atom files (65 atoms total, schema v2):**
- `build-v2-transfer/aqeedah-unit1-atoms-v2.md` (17 atoms)
- `build-v3-melusi_LATEST/aqeedah-unit2-atoms-v2.md` (15) · `aqeedah-unit3-atoms-v2.md` (16) · `aqeedah-unit4-atoms-v2.md` (17)

## (b) Gen-2 visual/motion patterns (lineage for the Gen-4 motion language)

**V1 (maximalist gamified) — patterns Gen-3 kept and Gen-4 must elevate:**
- Reward choreography as a full pipeline: verdict (stars + stat tiles) → noor-reward screen → streak-hero screen (full-bleed orange gradient, giant numeral, week calendar) → share card (dropped in Gen-3) → done. Five chained reward beats.
- Combo pill ("3 in a row") scale-pop at 2+ correct; full-screen PERFECT overlay (indigo scrim, gradient gold text, confetti) at combo 3.
- Confetti: pure CSS keyframe + DOM divs (`spawnConfetti(n)`, randomized left, 6-colour palette, translateY+rotate720+fade). No canvas/library. 30/16 pieces by mistake count at verdict, 20 at done.
- Companion lantern: animated SVG, `bob` 3s float + `glow` 2.8s drop-shadow pulse, persistent across hero/verdict/noor/streak/done.
- HUD: segmented per-step progress bar + streak flame + noor counter with `bump` scale on increment.
- Personalised openers: 3 state branches (streak / returning / first).
- Tile-builder word bank: tap-to-place/tap-to-remove into dashed drop zone.
- Citation bottom sheet: scrim + sheet, Arabic + meaning + source + pending-review pill.

**V3 (legendary review) — patterns for the gold surfaces:**
- Lamp-path progress: row of lamp glyphs lighting up (opacity + gold drop-shadow) per correct answer.
- Timer: slim gradient bar draining over 14s, colour shifts gold→flame under 28%, never fails ("no rush — nothing is lost"). Gen-3 v1.3 later gave it teeth: timeout → auto-skip → untimed no-noor circle-back at the end.
- Swift bonus (+noor within time) via small "swift" chip.
- Gold/night visual mode: dark gradient bg for legendary intro/result — a separate "mastery register."
- "Quote the pull" MC variant: first-person temptation quote as stem, learner names the pull.

## (c) Compartments-v4 taxonomy (Josh's canonical component system)

Ten compartments: P Pedagogy (canonical: AWBA_Research_and_Pedagogy_Master.md) · K Component Kit (merged into P §7) · A Assembly & Flow (P §8–11) · S Content Schema & Atoms (65 done, Fiqh parked) · V Sourcing & Verification (policy set) · W Writing & Register (to build) · C Companion/Conversation ("the UVP", prototyped, parked) · D Design System · N App Shell · G Generation Pipeline (outlined).

Governing sequence: S → W → K → A → D → C → N, governed by P + V.

Non-negotiables (every compartment): invent nothing · faithful to source, flagged for scholar · mercy/return thesis · scripture verbatim from official translations (Clear Quran/Khattab, Sunnah.com) — **2026-07-10 policy: verbatim display, supersedes the old paraphrase rule** · scholar gate before anything teaches · content-vs-delivery split.

Component ledger: Built = bismillah, read/prose, story, term gloss, verse (+tafsir slot), hadith (+sharḥ slot), explain slot, 3-Lens depth, context markers, reflect write-in, MC+reveal, TF+reveal, recap, completion. To-build = frame-setter, comparison, **objection→refutation (the doubt engine — high priority, post-v1)**, word-tiles/fill-blank, ordering, spot-the-mistake, specific-wrong-answer feedback module, rating, match.

Molecules: Bracket · Frame→Body · Concede→Restrict · Principle→Contrast · Point→Depth · Reveal→Payoff · Steelman→Nuance · Refute-Unit · Test-Unit.

**Sensitive-atom watchlist:** U1-15, U1-16, U2-02, U2-05, U3-13, U3-16, **U4-03 = HOLD (absent entirely)**.

## (d) v3 token set (REFERENCE ONLY — see canon note) + brand voice laws that still bind

v3 :root tokens for reference: cream #EEF2FB · card #F6F9FF · blue #2E6BF5 / blue-deep #2536CE / blue-tint #E7EEFF / blue-line #CBD9F7 · amber #C68A2E / tint #FBEFD6 / text #7A5111 · gold-tint #FDF6EC / line #F0DCC0 / text #B06A1C · green-tint #EAF7F0 / line #C4E7D5 / text #1F7A54 · purple-tint #F3EEFB / line #DFD3F2 / text #6A46B0 · unverified teal #1E7FB8 / tint #E4F3FB / line #8FCDE8 · warn (reserved) #8A2E28 / #FBEDEC / #EFC9C6 · ink #232A3D / #59607A / #98A0B8 · lines #DEE5F3 / #C9D3EA · indigo-tinted shadows only (0 12px 40px rgba(37,54,206,.12) etc.) · motion durations 80/120/200/280/350/600/4800ms.
v3 fonts were Fraunces/Inter/Amiri/KFGQPC-Uthmanic; **Gen-3 MVP uses Poppins/Inter/Amiri — Gen-4 follows Gen-3** (Poppins display, Inter body, Amiri Arabic; consider KFGQPC Uthmanic for .ayah if it elevates Qur'an rendering without policy issues).

**Brand-voice laws that still bind Gen-4** (don't conflict with Gen-3):
- Keystone: "generate pedagogy, never substance" — librarian, not mufti.
- Two-tier trust: verified vs pending (teal pill "unverified · pending review", swap-in-place later).
- No red for learner error ever; red reserved for safety callouts.
- Never gamify worship (prayer logging etc.); gamifying learning progress is fine — this is the line Gen-3 walks.
- Machinery invisible: no "lens 2 of 3", "streak" as guilt, no pedagogy jargon in UI copy.
- Banned copy: "you missed/failed", PBUH/SWT acronyms (write in full or glyph ﷺ), emoji near devotional content, jokes about the deen.
- Arabic typography: dir="rtl" lang="ar" always; .ayah class Qur'an-only; Amiri ≥1.4× Latin body; never letter-spaced/fake-bold; ﷺ follows the Prophet's name.
- Voice: Sage-as-Caregiver; devotional surfaces = zero sharpness.

## (e) Pedagogy constraints checklist (UI-binding)

- Sub-5-minute lessons (Gen-3 says 5–8 min — Gen-3 wins); one idea per screen.
- Depth ALWAYS opt-in (3-Lens accordion, term glosses, citations) — never blocks Continue.
- Scholar-gated: UI must render everything in pending-review state by default.
- 3-Lens order fixed: Reality → Revelation → Ruling.
- Objection never renders without its Refutation on the same screen; Frame-Setter precedes objections.
- Teach before quiz; model/summary before first quiz; write-ins always resolved with model content; in doubt topics, reflection only after resolution.
- Answer-reveal explanation is content-invariant (same regardless of which wrong option picked).
- Cadence: breather every 2–3 dense screens; quizzes as Quiz→Reveal pairs.
- MANDATORY components: narrative/story, concept reveal, depth deep-dive, model/summary, quiz+reveal, completion. USUALLY: reward, intro, think+write-in, rating. CONDITIONAL: frame-setter, comparison, objection+refutation, authority, enrichment, feedback, warning callout.
- No learning-styles personalization (myth); avoid reread/highlight-only interactions (weak evidence).
- Visuals must carry meaning (dual-coding), never pure decoration.

## (f) Atom schema (v2)

```
id · concept_cluster · point · lens.reality · lens.revelation · lens.ruling (+"Rules out:")
· refs · source (book p.X) · point_strength · framing_flag · stance_flag
· misconception · prerequisites · related
· think_seed · writein_seed (optional) · quiz_seed(s) · review_status
```
Content/delivery split: point/revelation/ruling/misconception/source = from the book (never invented). reality lens/think_seed/writein_seed/quiz_seed/3-Lens framing = ours. All 65 atoms `draft — scholar sign-off pending` → **UI default state is pending-review everywhere.**

## Cross-doc conflict flagged for Josh (owner-level)
`02-BRAND-VOICE` §5 says "paraphrase, never reproduce"; `awba-build-compartments-v4` (dated later, 2026-07-10) explicitly reverses this to verbatim-official-translation display. Compartments-v4 wins (and Gen-3 MVP implements it), but the brand-voice doc should be updated. Also: Clear Quran licensing for commercial launch remains an owner item.
