# Feature Research

**Domain:** Duolingo-style gamified micro-learning PWA, mercy-framed Islamic content
**Researched:** 2026-07-11
**Confidence:** MEDIUM-HIGH (Duolingo mechanics well-documented across official blog + design breakdowns; faith-app specifics MEDIUM — marketing pages + reviews, not internal data; code-level calibration HIGH — read directly from Josh's shipped engine)

## Scope note — this file is the DETAIL layer, not the feature list

Per `.planning/PROJECT.md`, the **macro feature set is already decided and shipped** in Josh's Gen-3 MVP (`_MVP-BUILD/`): Learn page with HUD, daily ayah, 4 colour-coded units, zigzag node path, node popups, lesson engine (`AwbaLesson`) with 10 beat types, reward choreography (verdict → noor claim → returns → done), legendary review engine (`AwbaReview`), streak/noor bottom sheets, course switcher, tab bar. **Do not re-decide these.** I read Josh's actual `awba-engine.css` (326 lines) and `awba-engine.js` (464 lines) directly to see what's *already built* at the micro-interaction level versus what's genuinely missing — this file catalogues that gap and cross-references it against Duolingo's actual detail layer and 5 faith apps (Hallow, YouVersion, Tarteel, Jibreel, Quranly).

**What Josh's engine already has (confirmed by reading the code, not to be re-recommended as new):**
- Combo pill scale-in (`cubic-bezier(.2,1.4,.5,1)`), noor "bump" scale-pulse on counter change
- Confetti (colour-set particle fall, `PERFECT` overlay at 3-streak), never over scripture screens
- Companion/lantern mascot idle animation (`bob` 3s translateY loop + `glow` 2.8s drop-shadow pulse) — but **static**, no reaction states
- 3D "gumdrop" button press physics (bottom-shadow disappears, `translateY(3px)` on `:active`) on nodes and CTA buttons
- Node states: locked (grey, no shadow) / active (static ring outline, no pulse) / done (stars)
- Bottom sheet slide-up (`translateY(100%)` → `0`, `.3s ease`) for streak/noor/legendary offer screens
- Legendary timer bar (linear width transition) + lamp-path progress (opacity transition per lamp)
- Varied praise copy pool (build record confirms "varied praise" exists, pool size not verified)
- 3-Lens accordion (`max-height` transition, one-at-a-time expand)

**What's genuinely absent (verified by `grep` across both files) — this is where the detail-layer work is:**
- Zero sound design (no `<audio>`, no Web Audio API calls anywhere)
- Zero haptic/vibration calls
- No node *entrance* animation (nodes don't bounce/pop in when the path renders or unlocks)
- No pulsing/breathing ring on the active node (Duolingo's is animated; Josh's is a static outline)
- No page-to-page transition — every navigation is a full document load (multi-page site, plain `<a href>`), so today it's a hard cut/flash between learn.html ↔ lesson ↔ review
- No chest *opening sequence* — the "gift chest" node is claimed instantly on tap, no anticipation beat
- No character reaction states (correct/wrong/celebrate) — only the idle bob
- No numeric count-up on noor/XP-equivalent, only a scale-bump on the container
- Streak/returns calendar exists (weekly, per build record) but its *visual grammar* (pip states, color logic) isn't yet specified for the mercy-framing (must never look like a "gap" or "miss")

---

## Feature Landscape

### Table Stakes (Detail-Layer — Required or the Shipped Shell Feels Cheap)

These aren't new macro-features — they're the finishing work Duolingo-class apps do that Josh's MVP hasn't reached yet. Missing these is the difference between "a Duolingo clone shell" and "feels world-class."

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Node entrance/unlock animation** — nodes pop/bounce in (scale 0→1.05→1, ~300-400ms, overshoot easing) when a path renders or a lesson completes and unlocks the next node | Duolingo's path visibly "grows"; a path that just appears fully-formed reads as static/cheap. 60fps.design catalogues this as core to the path feel. | LOW | Pure CSS `@keyframes` + a `.enter` class toggled on render; Josh's engine already uses the exact overshoot easing (`cubic-bezier(.2,1.4,.5,1)`) for the combo pill — reuse it for consistency |
| **Pulsing/breathing ring on the active node** | Signals "you are here" continuously, not just on tap. Static outline (current state) is easy to miss scanning a long path. | LOW | `@keyframes` on `outline` opacity/scale, 2s ease-in-out infinite loop — same pattern already used for the companion `glow` animation, just applied to `.node.active .ncirc` |
| **Correct/wrong sound cues** | Duolingo's correct-answer sound (two ascending sixteenth notes, F#→A#) is one of its most recognized brand assets; silence on every tap makes checking an answer feel inert. Confirmed via SoundCy/Los Doggies audio breakdowns. | MEDIUM | Needs: 3-4 short audio files (correct/incorrect/lesson-complete/streak-touch), a mute toggle (respect `prefers-reduced-motion`-adjacent user control), and Web Audio/`<audio>` wiring in the engine. Tone must be reharmonized for this product — see Anti-Features for why a literal Duolingo-brightness "ding" is wrong here |
| **Button/tap press physics everywhere** (already partly done) | Consistency — Josh's engine has this on the primary CTA and nodes; extend to every tappable surface (chips, sheet buttons, tile builder, MC options) so the whole app has one tactile language | LOW | Already-proven CSS pattern (`box-shadow` bottom-border collapse on `:active`) — just needs full inventory + application, not new invention |
| **Screen/page transition on navigation** (fixes the current hard-cut) | Every lesson→lesson and path→lesson jump is currently a flash-cut full page load. Duolingo's node-tap → lesson-open is a continuous zoom/morph, not a cut. This is the single biggest "feels cheap" gap in the current build. | MEDIUM | **Verified fix that fits the zero-build constraint:** the CSS Cross-Document View Transitions API (`@view-transition { navigation: auto }` in each page's CSS) gives native cross-fade/morph transitions between same-origin static HTML pages with **one CSS rule, no JS router, no SPA rewrite.** Shipped in Chrome 126+ and Safari 18.2+; Firefox lacks it but degrades gracefully to today's instant cut (no error, no regression) — a true progressive enhancement for a vanilla multi-page site. Named transition regions (`view-transition-name`) on the tapped node and the lesson header would let the node visually "become" the lesson card. |
| **Reward-screen stagger reveal** — verdict stat cards, star fill, don't all appear at once | Duolingo's lesson-complete choreography reveals stars/stats sequentially (each with its own beat) rather than as a static block; sequential reveal reads as "counting up your win," a static block reads as a stat dump | LOW-MEDIUM | Stagger via `animation-delay` on existing DOM order; stars can "pop in" one at a time with the sound cue on each |
| **Noor/counter count-up animation** | A number that jumps from 0→39 instantly feels like a UI bug; counting up (even fast, ~500ms) is what makes an earned number feel earned | LOW | Small JS tween (`requestAnimationFrame` easing a number from old→new value) — no library needed |
| **Chest opening sequence** (anticipation → reveal) | Currently instant-claim on tap; Duolingo (and every gacha-adjacent reward system) gets mileage from a beat of anticipation before the reward shows, even a small one | LOW-MEDIUM | Two-step tap: tap chest → lid/shake animation (400-600ms) → reward reveal with count-up + sound. Reward should stay **deterministic** (not randomized odds — see anti-features) |
| **Locked-node feedback on tap** (currently silent no-op or default cursor) | Tapping a locked node should give a small "not yet" cue (gentle shake or tooltip), not nothing — silence reads as broken | LOW | CSS shake keyframe + microcopy ("Finish the lesson before this one") — must stay gentle, not a buzzer/error tone |
| **Character reaction states** (companion reacts, doesn't just idle) | A mascot/companion that never visibly responds to what you did (right, wrong, finished) is decoration, not a companion — this is Awba's own stated pitch ("a companion, not a cop") | MEDIUM | 2-3 additional SVG/lottie-lite states (content/settled on correct, unbothered-calm on incorrect — never sad/disappointed, see anti-features) swapped via class toggle; reuse the existing bob/glow idle as the base state |

### Differentiators (What Makes This World-Class *and* Distinctly Awba, Not a Duolingo Reskin)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Un-loseable returns tally rendered as a heatmap of presence, not a calendar with gaps** — every day is some shade of "you were here" intensity, missed days are simply lighter, never red/crossed/broken | Quranly's habit heatmap and GitHub-style contribution grids prove the pattern works for motivation without shame; Awba's mercy thesis demands the *visual grammar* itself never imply loss — a calendar with visible blank/grey "miss" cells still reads as a scoreboard of failure even if the streak "can't break" | MEDIUM | Extends the existing weekly-calendar returns sheet into a longer view; pure visual/data-mapping work, no new mechanic |
| **Tap-to-hear recitation on the daily ayah card** (Tarteel-style) | Tarteel's core UVP is voice-first Quran interaction; a text-only daily ayah is a missed differentiator against Hallow/YouVersion's audio-forward daily content. Even a simple pre-recorded reciter clip per verse elevates the "variable reward of self" opener the Gen-2 brief calls for | MEDIUM | Needs licensed/attributed recitation audio per verse in the 7-verse rotation (small, bounded asset need — not a full Quran audio pipeline) |
| **Cross-document View Transitions used for node→lesson "becomes"** (not just a fade) | This is the single move that would make the path feel like Duolingo's continuous, spatial world rather than a stack of HTML pages — and it's achievable at zero extra build complexity given the vanilla/static constraint | MEDIUM | Builds on the table-stakes transition fix above; the differentiator is using **named/shared elements** (node icon morphs into the lesson header icon) instead of a generic cross-fade |
| **Sound identity that is calm/dignified, not arcade-bright** — a distinct, reharmonized cue set (softer intervals, warmer timbre) rather than literal Duolingo brightness, with celebration peaks reserved for meta-progress screens, never the ayah reveal itself | Every faith app reviewed (Hallow especially) is explicitly quiet/dignified by design; Duolingo's actual "dong-ding" is a recognizable *language-learning-app* sound, reusing it verbatim would read as derivative and tonally wrong next to scripture | LOW-MEDIUM | This is a content/asset decision more than an engineering one — commission or source 3-4 short audio cues in-house rather than stock "success chime" packs |
| **Chest = noor drop, framed as a gift, not a loot mechanic** — deterministic contents, always visible before opening (no randomized-odds suspense), consistent with the "un-loseable, never dangled" reward stance already locked | Distinct from Duolingo's actual chest system (random XP boost/gem odds, "chance the chest will upgrade" — genuinely gacha-adjacent) while keeping the anticipation *beat* that makes chests satisfying | LOW | Mostly a constraint on the opening-sequence animation above: show what's inside via the node icon/label before tap, the animation is theatre for a known reward, not a gamble reveal |
| **Legendary review "lamp path" as a literal illumination metaphor** (already conceptually locked) extended with a warm shimmer/gold-dust completion moment distinct from the blue/unit-color confetti used elsewhere | Gives the legendary reviews (the highest-stakes, most polished moment in the course) their own visual signature so mastery *feels* different from a normal lesson finish, reinforcing the gold theme already in the design system | LOW | Pure CSS particle/gradient work reusing the existing confetti engine with a gold-only palette + slower, heavier fall |

### Anti-Features (Duolingo/Faith-App Patterns to Deliberately NOT Build)

| Feature | Why Requested/Tempting | Why Problematic | Alternative |
|---------|------------------------|------------------|-------------|
| **Escalating urgency animation on the streak icon as the day passes** (Duolingo's flame animates faster / mascot's "face presses closer to screen, bigger eyes" toward midnight) | It's Duolingo's most-cited retention lever; feels like "just more polish" | This is loss-aversion anxiety engineering, exactly what the returns tally was redesigned to invert. Un-loseable + visually anxious is a contradiction that will read as bad faith to users within days | Returns icon stays visually calm and constant regardless of time of day; if a "come back" nudge exists at all, it's a single gentle notification, never an escalating on-screen countdown |
| **Streak freeze economy** (purchasable/earnable freezes, freeze inventory, "protected day" snowflake markers) | Feels like an obvious mercy feature ("we forgive missed days too!") and Duolingo's own system is built entirely around it | Already explicitly ruled out in PROJECT.md ("Streak freeze mechanics — unnecessary; returns cannot break"). Building any freeze UI reintroduces the concept of a *breakable* thing that occasionally needs protecting — undermines the entire "un-loseable" premise by implying loss is the default state | Nothing to protect — the returns tally simply doesn't have a break state to begin with; no freeze inventory, no snowflake iconography |
| **Randomized-odds chest/reward** (Duolingo's actual chest system: "4 chances to have a chance the chest will upgrade") | Variable-ratio reward schedules are the most "sticky" reinforcement pattern in gaming psychology, and chests already exist in Josh's shell | This is the literal mechanism of slot-machine "casino juice" the Gen-2 research brief calls out by name to avoid over sacred-adjacent content. Randomized odds on a reward tied to completing scripture-based learning is the clearest possible overjustification/manipulation risk | Deterministic rewards (fixed noor amount, always the same, shown before opening) — the *ceremony* of opening can still feel good without the *uncertainty* |
| **Sad/disappointed mascot states, guilt-framed push notifications** ("Duo is sad you left," passive-aggressive character voice, "last chance! streak ends in 10 minutes") | Proven Duolingo retention tactic, well-documented, easy to copy | Directly contradicts "a companion, not a cop" and the mercy-framing thesis; guilt-shaming after a missed day is precisely the dark pattern the Gen-2 brief flags to avoid | Companion has a calm/settled idle state and (at most) a warm "welcome back" state — no sad, no disappointed, no urgency-voiced copy |
| **Leaderboards / leagues / friend streaks** | YouVersion's "Plans with Friends," Duolingo's leagues, and Tarteel's group leaderboard all show social/competitive layers drive engagement | Already explicitly out of scope in PROJECT.md for this milestone; competitive ranking around scripture-adjacent learning also risks reintroducing exactly the extrinsic/status-seeking dynamic the mercy-framing is designed against | Tab bar shows these as polished "coming soon" states only, per current scope — do not build the mechanic itself this milestone |
| **Confetti/celebration effects layered directly over scripture/ayah text** | Tempting to make the daily ayah moment feel as "rewarding" as a correct-answer moment | Locked anti-pattern from the Gen-2 brief: "no jackpots or confetti layered over Qur'anic verses." Reverence and dopamine-spike juice are different registers and mixing them cheapens the verse | Gentle, quiet reveal animation (fade/slide) for scripture; save confetti/sound peaks for meta-progress screens (verdict, streak, chest, legendary mastery) |
| **Relying on the Vibration API as a primary feedback channel** | "Haptic-feel button physics" in the brief could be read as literally wanting device vibration on every tap | The Vibration API has zero support on iOS Safari (confirmed via MDN/PWA capability docs) — any interaction that *depends* on a vibration pulse for its feedback will simply not work for a large share of the target audience (iPhone PWA users). "Haptic-feel" should be achieved visually (the press-physics table-stakes item above), with real vibration as an invisible, optional bonus only | CSS-driven tactile feedback (shadow-collapse, scale, timing) as the actual mechanism; `navigator.vibrate()` as a silently-failing progressive enhancement on Android only, never the sole cue |
| **Points/noor visibly attached to every single scripture-recall answer** (current state, flagged not overridden) | It's what's shipped and the owner has stated a preference to keep points-forward | The Gen-2 research brief's overjustification concern stands: tangible rewards tied directly to correct recall of sacred content risk re-attributing sincere intention (ikhlas) to reward-chasing. This is logged as an **owner decision already made**, not something for this research to re-litigate — but any *new* detail-layer work (sound, count-up, confetti) should make sure the biggest sensory payoff lands on meta-progress moments (verdict screen, streak, chest, legendary result), not on the instant of getting a scripture question right, to keep the emphasis on "you now hold this understanding" over "you scored" | No build action required this milestone; flagged again here because it directly constrains where sound/celebration should peak (see differentiator above) |

## Feature Dependencies

```
Sound design system (audio assets + mute toggle + Web Audio wiring)
    └──requires──> Global engine settings/preferences pattern (new: a toggle needs somewhere to live and persist in localStorage alongside noor/returns/stars)

Cross-Document View Transitions (node→lesson page transition)
    └──requires──> Named view-transition regions on both the path page and every lesson/review page
                       └──requires──> Consistent DOM structure for the "hero" element (node icon / lesson header icon) across all 20 pages so the morph has something to match

Chest opening sequence (anticipation animation)
    └──requires──> Node entrance/unlock animation patterns (reuses the same overshoot-easing keyframe vocabulary)

Character reaction states (correct/wrong/celebrate)
    └──requires──> Existing companion idle animation (bob/glow) as the base state to branch from

Returns-tally-as-heatmap (differentiator)
    └──requires──> Existing `awba_days` storage array (already present — this is a rendering change, not a new data model)

Tap-to-hear daily ayah recitation
    └──enhances──> Daily ayah card (existing feature) — does not block it; ships independently

Deterministic chest rewards ──conflicts──> Randomized-odds chest (anti-feature)
Un-loseable returns visual grammar ──conflicts──> Streak freeze UI / escalating urgency animation (anti-features)
Reharmonized calm sound cues ──conflicts──> Literal Duolingo-brightness "dong-ding" reuse
```

### Dependency Notes

- **Sound design requires a settings/preferences pattern:** Josh's engine currently has no concept of a persisted user preference (only progress state: noor/returns/stars/days/chests). A mute toggle is the first "preference," not "progress" — worth deciding the storage key shape (e.g. `awba_prefs`) once, before sound assets are wired, so it isn't bolted on awkwardly later.
- **View Transitions requires consistent DOM naming across all 20 pages:** this is the main reason it's MEDIUM not LOW complexity — it's a one-line CSS win *per page*, but only pays off if the "hero" element (the thing that visually morphs) is named the same way on the path, in every lesson file, and in every review file. Worth standardizing as part of any shared-template pass across the 15 lesson files.
- **Chest opening reuses node-entrance easing:** no new animation vocabulary needed — both are "something appears with a satisfying overshoot," so building node-entrance first and reusing its keyframe for the chest reveal keeps the motion language of the whole app consistent (a stated goal: "springy micro-interactions... with real feel").
- **Character reactions branch off idle, don't replace it:** the existing `bob`/`glow` loop is the resting state; reaction states are short (1-2s) animations that play once and return to idle, not new always-on loops — keeps the addition cheap.
- **Conflicts are all mercy-framing guardrails:** every "conflicts" edge above exists because a differentiator/table-stakes item and an anti-feature compete for the same UI surface (the chest, the streak icon, the sound palette). These aren't technical conflicts — they're a reminder that the *tempting, well-documented Duolingo default* is the thing to actively avoid at each of those touchpoints.

## MVP Definition

*(Scoped to the detail layer only — the macro feature set for this milestone is fixed by PROJECT.md, not re-scoped here.)*

### Launch With (v1 — this milestone)

- [ ] Node entrance/unlock animation — cheapest, highest-visibility "feels alive" fix
- [ ] Pulsing active-node ring — same reasoning, near-zero cost
- [ ] Full-coverage button/tap press physics (extend the existing pattern everywhere, don't invent new)
- [ ] Correct/wrong/lesson-complete sound cues + mute toggle — the single biggest sensory gap versus Duolingo, and directly named in the research brief
- [ ] Reward-screen stagger reveal (stars, stat cards) + noor count-up — makes the already-built verdict→claim→returns→done sequence read as choreography instead of a stack of static screens
- [ ] Locked-node gentle-shake feedback — small, prevents "is this broken?" moments
- [ ] Cross-Document View Transitions on all 20 pages (progressive enhancement, Chrome/Safari get it, Firefox degrades to current behavior) — single biggest structural "feels cheap" fix, low engineering risk because it's additive CSS

### Add After Validation (v1.x)

- [ ] Chest opening anticipation sequence — nice but the chest already "works" (instant claim), this is polish not a gap
- [ ] Character reaction states beyond idle — meaningful but needs new art/animation assets, higher cost than the above
- [ ] Returns-tally-as-heatmap — only matters once there's enough `awba_days` history for a learner to see a pattern; low value on day one
- [ ] Named/shared-element morph transitions (node icon → lesson header icon), upgrading the plain cross-fade above to a true "becomes" transition

### Future Consideration (v2+)

- [ ] Tap-to-hear daily ayah recitation — needs licensed/attributed audio assets, a real content pipeline decision, not a v1 engineering task
- [ ] Legendary-specific gold shimmer completion moment — the legendary reviews already have a working result screen; this is pure delight-layer polish, defer until the core detail layer above is validated with the owner

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Node entrance/unlock animation | HIGH | LOW | P1 |
| Pulsing active-node ring | MEDIUM | LOW | P1 |
| Correct/wrong/complete sound cues + mute toggle | HIGH | MEDIUM | P1 |
| Full-coverage tap press physics | MEDIUM | LOW | P1 |
| Reward-screen stagger + noor count-up | HIGH | LOW-MEDIUM | P1 |
| Locked-node feedback | LOW-MEDIUM | LOW | P1 |
| Cross-Document View Transitions | HIGH | MEDIUM | P1 |
| Chest opening sequence | MEDIUM | LOW-MEDIUM | P2 |
| Character reaction states | HIGH | MEDIUM | P2 |
| Returns-as-heatmap | MEDIUM | MEDIUM | P2 |
| Named/shared-element morph transitions | MEDIUM | MEDIUM | P2 |
| Tap-to-hear ayah recitation | MEDIUM | MEDIUM (content-gated) | P3 |
| Legendary gold shimmer completion | LOW-MEDIUM | LOW | P3 |

**Priority key:**
- P1: Must have for this milestone's "world-class detail layer" bar
- P2: Should have, add once P1 is validated by the owner
- P3: Nice to have, defer to a later milestone (often content/asset-gated, not engineering-gated)

## Competitor Feature Analysis

| Feature | Duolingo | Faith Apps (Hallow/YouVersion/Tarteel/Jibreel/Quranly) | Our Approach |
|---------|----------|----------------------------------------------------------|--------------|
| Streak/return mechanic | Breakable, loss-averse, freeze economy, escalating urgency, sad-mascot notifications | Mostly breakable too (Hallow/YouVersion streaks reset on miss), though Hallow/Glorify offer forgiving/backfill variants per the Gen-2 brief | Un-loseable returns tally, calm iconography always, no freeze UI needed because nothing breaks |
| Reward currency | XP + gems, spendable in a shop, tied to a streak-freeze economy | Mostly badges/milestones (YouVersion), habit streaks (Quranly) — none run a spendable-currency shop | Noor — un-loseable, informational-first, no shop, no spend mechanic (already locked) |
| Sound design | Extensive, deliberate, bright/major-chord, core brand asset | Largely absent or minimal (Hallow leans visual-calm, no evidence of a distinct sound identity) — a gap we can differentiate into | Own calm/dignified cue set, present (unlike faith apps) but reharmonized (unlike Duolingo) |
| Chest/reward reveal | Randomized odds, gacha-adjacent, tiered "society" status system | Not present in any of the 5 apps reviewed | Deterministic reveal, ceremony without gambling |
| Social/competitive layer | Leagues, leaderboards, friend streaks | YouVersion "Plans with Friends," Tarteel group leaderboard | Explicitly out of scope this milestone (coming-soon tab states only) |
| Voice/audio-first interaction | None (text/audio exercises, not a recitation companion) | Tarteel's core UVP (voice recognition recitation) | Lightweight version — tap-to-hear on the daily ayah — deferred to v2+, full recitation-coach is out of scope |
| Progress visualization detail | Path with animated nodes, XP bars, league tables, crown levels | Simple streak counters/calendars (YouVersion), habit heatmap (Quranly) | Winding path (existing) + returns-as-heatmap (differentiator, v1.x) |
| Screen/page transitions | Native app, continuous animated transitions by default | Native apps, same | Static multi-page HTML site — solved via Cross-Document View Transitions API, a genuinely modern (2024-2026) capability that makes this achievable without abandoning the zero-build constraint |

## Sources

**Duolingo — official/primary:**
- [You're on fire! Or, how we brought the streak milestone to life — Duolingo Blog](https://blog.duolingo.com/streak-milestone-design-animation/) — HIGH confidence, official design-team account of phoenix milestone animation, iteration process
- [Building character — Duolingo Blog](https://blog.duolingo.com/building-character/) and character/Rive animation coverage — MEDIUM-HIGH
- [Duolingo Streaks: How the Mechanic Drives 2x Daily Retention — deconstructoroffun.com](https://duolingo.deconstructoroffun.com/mechanics/streaks) — MEDIUM, detailed game-design breakdown (streak screen anatomy, freeze mechanics, visual escalation, widget behavior)
- [Duolingo: Gamification as Design Language — Blake Crosley](https://blakecrosley.com/guides/design/duolingo) — MEDIUM, specific animation timings (button press, wrong-answer slide, progress bar easing)
- [Duolingo iOS App UI/UX animation catalogue — 60fps.design](https://60fps.design/apps/duolingo) — MEDIUM, exhaustive named-interaction catalogue (chest unlock, league reveals, mascot states)
- [Duolingo Chests — duoplanet.com](https://duoplanet.com/duolingo-chests/) and [Chest — Duolingo Wiki/Fandom](https://duolingo.fandom.com/wiki/Chest) — MEDIUM, confirms randomized-odds chest mechanic
- [Duolingo's Unique Audio — SoundCy](https://soundcy.com/article/what-does-duolingo-sound-like) and [The Sound of Success — Los Doggies](https://www.losdoggies.com/archives/8816) — MEDIUM, specific musical-interval detail on the correct-answer sound
- [Duolingo UX Design Breakdown — 925studios](https://www.925studios.co/blog/duolingo-design-breakdown) — LOW-MEDIUM, general pattern summary

**Faith apps:**
- [Hallow features](https://hallow.com/features/), [Streaks & Prayer Activity FAQ — Hallow Help Center](https://help.hallow.com/en/articles/5761398-streaks-prayer-activity-faq) — MEDIUM, official
- [YouVersion Bible App](https://www.youversion.com/bible-app), [Streaks announcement](https://s3.amazonaws.com/web-assets.youversion.com/html-email/2017-08-streaks/2017-08-streaks-en.html) — MEDIUM, official
- [Quranly — habit-building Qur'an app](https://www.quranly.app/) — MEDIUM, official marketing + feature pages
- [Tarteel: AI Quran Memorization](https://tarteel.ai/) and App Store listings — MEDIUM, official + reviews
- [Jibreel: The Duolingo for Islamic Knowledge](https://www.jibreel.app/) — MEDIUM, official; directly self-describes as a Duolingo-format Islamic app (fiqh/aqeedah/seerah), confirms streaks + spaced repetition, no evidence of a distinct sound/animation identity to steal from

**Technical/architecture-relevant:**
- [View Transition API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) — HIGH confidence, authoritative
- [Cross-Document View Transitions Are Finally Cross-Browser — Trade Assistance](https://trade-assistance.com/blog/cross-document-view-transitions-mpa-2026/) and [CSS-Tricks: Cross-Document View Transitions gotchas](https://css-tricks.com/cross-document-view-transitions-part-1/) — MEDIUM-HIGH, confirms Chrome 126+/Safari 18.2+ support, Firefox gap, 4s timeout gotcha, and that it requires zero JS/router for MPAs — directly validated against Josh's actual zero-build multi-page architecture
- [Vibration API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API) and [PWA Capabilities: Vibration API](https://progressier.com/pwa-capabilities/vibration-api) — HIGH confidence, confirms no iOS Safari support (critical constraint for "haptic-feel" requirement)

**Local (read directly, not web-sourced):**
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/shared/awba-engine.css` (326 lines, read + grepped directly)
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/shared/awba-engine.js` (464 lines, read + grepped directly)
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/00_BUILD-RECORD.md`, `00_MVP-PLAN.md`
- `/Users/theshumba/Downloads/AWBA APP/_BUILDS/_GEN2-LAB/00_GEN2-RESEARCH-BRIEF.md`

---
*Feature research for: Duolingo-style Islamic micro-learning PWA — detail/micro-interaction layer*
*Researched: 2026-07-11*
