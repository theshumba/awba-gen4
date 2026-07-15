# R5 — THE ATHAR SYSTEM: design authority intel for v2 surfaces
(onboarding, Practice page, Profile page, More/settings page)

Sources read in full: `.planning/ATHAR-SYSTEM.md` (81 lines, the LOCKED contract, Gate 2 2026-07-12),
`.planning/phases/03-components-icon-kit-motion-language/03-UI-SPEC-ATHAR.md` (978 lines, the
executable design contract, supersedes `03-UI-SPEC.md` + the D-44 checklist), `preview.html` (662
lines, the living reference, rebuilt per UI-SPEC §8 — real `AW.*` output, zero CDN).

**Authority order:** `ATHAR-SYSTEM.md` is canon. `03-UI-SPEC-ATHAR.md` executes it — on conflict
the UI-SPEC wins but must flag divergence, never silently diverge. `preview.html` is the rendered
proof, not an independent source. Nothing below overrides these three; this doc only indexes them
for four NEW surfaces none of the source docs designed for by name.

---

## 0 · The one-paragraph architecture (verbatim thesis)

"**Nobody blends. Everybody owns a context.** Athar stays the identity spine (the brand, the black
world, the Ring). The other four directions become **registers** — each owns specific surfaces and
moments, and never trespasses. One constitution underneath (same grain, same scripture laws, same
workhorse font, same easing family) makes five worlds read as one app. Daily surfaces are quiet; the
loud registers open only at thresholds."

**No surface may invent a sixth register or a second ground on one screen (law 1).** Onboarding,
Practice, Profile, and More/Settings must each be assigned to ONE of the five existing registers (or
a token-layer visitor into one), never a new mood.

---

## 1 · The ten Constitution laws (verbatim/tight paraphrase — binding on every surface, old or new)

1. **One register per screen.** Exactly one ground per screen. Other registers may appear only as
   tokens (a thermal chip, a time tint) — never a second ground.
2. **Aniconism, absolute.** No faces, no mascots, no limbs. Ever.
3. **Scripture law.** Ayat/du'as in **Amiri Quran (ayah) / Amiri (hadith,du'a) only**, ≥1.35–1.5×
   adjacent Latin size (floor **24px** against 16px body), lh 1.9 (ayah)/1.85 (hadith), `﴾…﴿`
   brackets, full tashkeel, `letter-spacing:0`, `unicode-bidi:isolate`, `dir="rtl"`. Scripture is the
   strongest ink on any page (full-opacity `--kiswah` on cream / `--cream` on dark, no ramp), never
   sits on texture/pattern/photo/grain (`.grain` pseudo-element must be `--go:0` or absent on that
   wrapper), and carries **the only glow any element is permitted** —
   `text-shadow: 0 0 24px rgba(244,240,247,.30)` — ONLY on scripture, ONLY on dark grounds. Nothing
   celebratory (dab/thread/stamp/rosette) may sit adjacent. Transliteration + translation under every
   display-Arabic moment, no exceptions.
4. **One workhorse.** Readex Pro carries ALL UI text in both scripts, in every register — the thread
   stitching five worlds into one app.
5. **Display faces are rationed.** Marcellus (Orbit/Sky display + stat numerals, ≥28px) · Aref Ruqaa
   (the 15 chapter terms only, ≥40px, clipped in Farag squares — hard `--r-square:0` corners) · Rakkas
   (Festival signage only, ≥28px, **never scripture**) · Courier Prime (marginalia voice only: dates,
   counters "18/65", footnotes, the Ibrahim 14:24 line — never body text). **Rakkas and Aref Ruqaa
   never share a screen.**
6. **One grain.** A single tiled noise PNG (`shared/img/grain.png`, 128×128 tileable PNG-8) over every
   ground: `.028` cream (Page/Festival) · `.07` Kiswah (Orbit) · `.06`–`.09` Last Third night (Sky) ·
   `.05` Nightfall. No smooth gradient without grain; no runtime SVG turbulence, ever.
7. **Accent budget.** ≤10% expressive colour on any working screen; a daily screen sees **≤6 colour
   tokens** total (out of the 17-token palette). Full expressive register only at thresholds
   (Festival's law, applied to everyone).
8. **Wrongness is a strike, never a colour.** Wrong answers: grey ink blot (`--ink-40`→transparent)
   that fades + one-line explanation in `--ink-85`; **Rose Ember tints the retry frame only** (2px
   border) — the WCAG-load-bearing signal is the ink-blot + explanation text + shape change, because
   rose is only 1.73:1 on cream (decorative, never the sole signal). Never red, nothing flashes,
   nothing shakes.
9. **The centre never animates.** One motion verb per register (draw/settle/breathe/drift/stamp), all
   on **one easing family** `cubic-bezier(0.23, 1, 0.32, 1)` — no other curve exists anywhere in the
   system. UI ≤300ms, ambient 4–6s, ALL gated by `prefers-reduced-motion` / `data-motion="reduce"`.
   The established Ring **never re-draws** — only newly-inked frontier dabs draw (`animateFrom`), and
   only on an explicit trigger (e.g. returning from a lesson), never on every page load.
10. **Artefacts are private by default.** The Ring poster, the plates, the completed sky — yours
    first; sharing is a deliberate act (ikhlas protected). Completion artefacts carry **date + seed**
    as a maker's mark (D-16 local-date helpers, never UTC serialization).

---

## 2 · The five registers — name / ground / ink / mood / when / shipped examples

| # | Register | From | Ground (CSS class) | Ink/text | Mood | Motion verb | Owns (shipped) |
|---|---|---|---|---|---|---|---|
| 1 | **ORBIT** | Athar | `.reg-orbit` — Kiswah Black `#131013` | `--cream` | the sacred centre | **draw** (ink strokes draw themselves) | brand/app icon, home, the Ring (macro progress), lesson-complete celebrations |
| 2 | **PAGE** | Pomegranate Ink | `.reg-page` — Haram Cream `#F3EDE2` | `--ink` (kiswah) | manuscript-quiet, ~90% of minutes | **settle** (paper laid on cloth, ink soaks in) | lessons, quizzes, reading, Nightfall ayah interstitial, journal/reflections |
| 3 | **SKY** | Fajr Grain | `.reg-sky-night` — Last Third gradient (night) / a **tint layer** via `[data-sky]` over Orbit (day) | `--moonmilk` | the app knows what time it is in your deen | **breathe** (4–6s ambient loops) | night sessions, du'a screens, streak constellation, `--dawn` horizon warmth on home |
| 4 | **CIRCLE** | Ember Orbit | **no ground of its own** — token layer only, hosted inside whatever register (usually Orbit/Sky) | thermal ramp colours | you are never circling alone | **drift** (dabs drift in and settle into orbit) | all progress-state colour (thermal ramp), review sessions ("circle gathers"), crowd-arrival moments, future cohorts/study circles |
| 5 | **FESTIVAL** | Warsha | `.reg-festival` — Haram Cream + folk checker trim | `--ink` (kiswah) | joy rationed to where joy belongs | **stamp** (instant fill, 1.03→1.0 settle, 150ms) | thresholds ONLY: 4 circuit plates, course-completion poster, Eid/Ramadan dressing, share/export cards, marketing site |

**Register-per-use-case, plain language (verbatim from ATHAR-SYSTEM.md):**
- ORBIT — "where you see what your learning has traced." Sacred centre; all macro progress lives
  here and only here.
- PAGE — "where you actually learn." Rubricated ayat with crimson jadwal margin, ink-bordered quiz
  cards, Nightfall (weightiest ayah dims room). Micro-progress = per-lesson **seed-row** (atoms as
  faint dots inking to sprouts), finished lesson = one small plant doodle stamp in the index (15
  total, ~20 variants — never a 65-plant map; the Ring is THE map). Review milestones seal with a
  gold rosette. The Ibrahim 14:24 line sits in Courier mono beneath the lesson index.
- SKY — "the app knows what time it is in your deen." NOT a gimmick dark mode — tracks the *real*
  prayer clock. Course progress adds one degree of `--dawn` horizon warmth — ambient, never the
  metric (kills the "synthetic dawn" critique).
- CIRCLE — "you are never circling alone." Thermal ramp: **Powder Veil (not yet) → Farag Ember (in
  progress) → Hajar Gold (mastered)**, always shape-cued for colour-blind users. Reviews open with
  the circle gathering; circuit completions bring crowd-arrival (hundreds of dabs settling around
  the Ring). Ummah as ambience, not leaderboard.
- FESTIVAL — "joy is rationed to where joy belongs." Bazaar opens ~9 times total in the whole
  journey. Never in daily UI chrome.

### 2.1 · Register assignment guidance for the four NEW v2 surfaces (inferred from the spec's own logic — not stated verbatim, apply the same reasoning the spec uses elsewhere)

- **Onboarding welcome** — the app's first sacred-centre moment, before any Ring exists yet. By the
  spec's own logic ("You open the app into the black world and your Ring... ORBIT and only here"),
  onboarding's welcome/opening screens plausibly belong to **ORBIT** (Kiswah ground, `--gold` accent,
  Marcellus display ≥28px for the headline, `draw` verb for a first-ink reveal) — it is the doorway
  into the sacred centre, not a reading surface and not a threshold-celebration. Any onboarding step
  that collects/confirms information (name, goals, schedule — reading/writing, not celebrating) leans
  **PAGE** instead (cream, Readex Pro, settle verb) since forms are closer to "actually learning/doing"
  than to the black world's stillness. Do **not** invent a new "onboarding register" or a bespoke
  gradient — pick one of the two per-screen and justify it the same way the spec justifies Home
  (Orbit) vs Lesson (Page).
- **Practice session** — this is functionally a quiz/review surface. The spec explicitly places
  "quizzes" under **PAGE** (ground) with **CIRCLE** supplying the thermal/progress-state tokens inside
  it (correct = gold dot draws; wrong = grey ink-blot fade, law 8), and separately says "review
  sessions" open with "the circle gathers" (drift). A **Practice** page that runs spaced-repetition/
  review drills should almost certainly be **PAGE-ground with CIRCLE-drift review-opening treatment**
  — matching the shipped "quiz" and "review milestone" precedents exactly, not a new mood.
- **Profile page** — this is a macro-progress / identity surface (streaks, noor, the Ring, completion
  artefacts). The spec's own home-screen precedent ("home... your Ring half-inked... macro progress
  lives here and only here" = ORBIT) argues Profile should be **ORBIT-ground** if it foregrounds the
  Ring/macro stats, OR it could host **SKY**'s "streak constellation" (an explicit SKY-owned moment)
  if the profile leans into the streak-as-constellation treatment. Either way: Profile is NOT Page and
  NOT Festival (it is not a reading surface, and Festival is threshold-only — a profile view on every
  visit is daily chrome, which Festival's law 5 explicitly forbids: "never in daily UI chrome").
- **More/Settings page** — utility, low-emotion, read-plus-toggle. Nothing in the spec assigns
  settings a register by name, but by elimination and by the "Athar re-frame" instinct already applied
  to `.hstat` ("the HUD reads as marginalia, not game chrome" — transparent, no pill fill, Courier/
  Marcellus numerals) — Settings should default to **PAGE** ground (cream, Readex Pro workhorse, plain
  `.tf`/`.tile`/`.btn` components, Courier marginalia for metadata like app version/build date), the
  quietest, least-registered surface in the system. It is the one screen where "quiet" should be taken
  most literally — no Ring, no Sky tint, no thermal dabs, unless a specific settings row genuinely
  needs one (e.g., a prayer-times editor row could show the sky-temperature preview as a token, not a
  ground).
- **Whichever registers are chosen, they must be confirmed at the design-review gate (§9 below) before
  build** — this is inference from the spec's stated reasoning, not a stated rule; flag divergence per
  the authority header if the design reviewer picks differently.

---

## 3 · Type system — six faces, four rationed, roles + forbidden zones

| Face | Role | Weight(s) | Size floor | Where PERMITTED | Where FORBIDDEN |
|---|---|---|---|---|---|
| **Readex Pro** | ALL UI text/body, Latin + Arabic UI strings — the sole workhorse | 300–700 | 14px (UI) / 16px (body) / 17.6px lh1.8 (Arabic UI) | everywhere | never for scripture (lacks rare Quranic tashkeel marks `U+0657–065F`) |
| **Amiri / Amiri Quran** | scripture (`.ayah` = Amiri Quran, verbatim ayah ONLY) / du'a+hadith (general Amiri, `.scripture`) | 400/700 | `--fs-ayah` clamp(24px,22.4px+0.4vw,27px) lh1.9 / `--fs-scrip` 23px lh1.85 | wherever scripture appears, any register | never as a UI/body/display face; `.ayah` reserved strictly for verbatim ayat |
| **Marcellus** | English display + stat numerals | 400 | ≥28px (law 5 floor) | Orbit, Sky only (home/Sky headlines, stat numerals) | UI body text, Page screen titles (Page titles use Readex 600 `--fs-h1`, NOT Marcellus) |
| **Aref Ruqaa** | the 15 chapter key-terms ONLY | 400/700 | ≥40px (law 5 floor), clipped in Farag squares (`--r-square:0`) | Page (chapter heads), Orbit (celebrations) | never body text; never shares a screen with Rakkas; never a rare-tashkeel form (common-tashkeel/plain only — Aref Ruqaa lacks `U+0659`,`U+065B–065F`) |
| **Rakkas** | Festival signage ONLY | 400 | ≥28px (law 5 floor) | Festival register ONLY (plates/posters) | **never scripture** (Rakkas lacks Quranic marks too); never shares a screen with Aref Ruqaa; never daily UI |
| **Courier Prime** | marginalia voice ONLY: dates, counters ("18/65"), footnotes, the Ibrahim 14:24 line, artefact maker's-marks | 400 | 11–12px (`--fs-marg` 0.6875–0.75rem) | Page margins, artefact maker's-marks, HUD stats (`.hstat` reframed as marginalia) | **never body text anywhere** |

**Silent fallback (not a design voice):** Inter 400 is retained ONLY as the glyph-fallback for `˹ ˺`
(`U+02F9`/`U+02FA`, Clear-Quran translation corner-brackets) inside `--font-work`. It appears nowhere
else — grep gate expects exactly 2 occurrences of `'Inter'` in the CSS (one `@font-face`, one stack
ref). **Poppins is fully retired**, zero references permitted anywhere.

**Font stack tokens (exact CSS custom property names to reuse verbatim):**
```
--font-work:     'Readex Pro','Inter',system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;
--font-quran:    'Amiri Quran','Amiri','Noto Naskh Arabic','Geeza Pro',serif;   /* .ayah only */
--font-scrip:    'Amiri','Noto Naskh Arabic','Geeza Pro',serif;                 /* hadith + du'a */
--font-display:  'Marcellus',Georgia,'Times New Roman',serif;
--font-term:     'Aref Ruqaa','Amiri',serif;
--font-festival: 'Rakkas','Marcellus',serif;
--font-marg:     'Courier Prime',ui-monospace,'SFMono-Regular',Menlo,monospace;
```

Font files are self-hosted `.woff2`, `src` paths are CSS-relative (`'fonts/…'`), never a leading
slash — required for `file://` double-click review.

---

## 4 · Motion doctrine

- **One easing family for everything:** `--ease: cubic-bezier(0.23,1,0.32,1)` — no other curve exists.
- **UI durations, all ≤300ms:** `--dur-press:140ms` (any register, press feedback) ·
  `--dur-fade:180ms` · `--dur-stamp:150ms` (Festival) · `--dur-draw:240ms` (Orbit UI-scale) ·
  `--dur-settle:260ms` (Page) · `--dur-sheet:280ms` (bottom sheet in/out) · `--dur-drift:300ms`
  (Circle single-dab).
- **Ambient durations, 4–6s, NEVER collapsed under reduced motion (loops stopped instead):**
  `--dur-amb:5200ms` (Sky breathe/halo/gold-thread) · `--dur-amb-drift:6000ms` (Circle crowd-drift).
- **One verb per register**, recipes:
  - **draw** (Orbit): SVG `stroke-dasharray`/`stroke-dashoffset` reveal, or UI-scale
    `opacity 0→1 + translateY(4px→0)` over `--dur-draw`.
  - **settle** (Page): `opacity:0→1, translateY(8px→0)` over `--dur-settle` — opacity ease only, no
    blur filter (perf).
  - **breathe** (Sky): `opacity .72↔1` `var(--dur-amb) infinite alternate`; halo variant adds
    `scale(.97→1)`.
  - **drift** (Circle): dabs translate+rotate+fade in, settle to `opacity:.85`; crowd = staggered
    `animation-delay` at `--dur-amb-drift`; single UI dab = translate+fade over `--dur-drift`.
  - **stamp** (Festival): `scale(1.03→1)` + opacity 0→1, 60% opacity checkpoint, over `--dur-stamp`
    (150ms) — the wax-seal press.
- **Press feedback is ONE recipe everywhere, regardless of register:** `translateY(1px)` + a one-step
  ink-deepen of border/fill (`color-mix(in srgb, <fill> 90%, black 10%)`), `--dur-press`, **no drop
  shadow, no bounce** ("gummy press" is explicitly retired, D-A4). Each register's hover/reveal may
  carry its verb, but press never varies.
- **The centre never animates** — the established Ring never re-draws on reload; only the newly
  inked frontier dabs draw, on an explicit trigger (`animateFrom` param), never automatically.
- **Reduced motion:** `prefers-reduced-motion` AND an in-app `data-motion="reduce"` override (two
  independent trigger paths). Under either: Sky breathe stops (the static tint itself does NOT
  disappear — the *tint is information*, not motion, and stays visible), dabs render already-settled
  in place (no drift animation), the Ring generator omits `stroke-dash` entirely and renders the final
  inked state statically (zero animation nodes), all UI transitions collapse to instant/near-instant.
- **Celebration ("joy") gating — never over scripture, never in daily chrome:** Celebration classes are
  `.dab` (drift), `.thread` (Orbit gold-thread draw), `.plate` (Festival stamp), `.rosette` (gold
  review seal, filled circle + inked rim + check, stamped) — these appear ONLY at genuine thresholds
  (atom/lesson complete → one brushstroke draws on the Ring + a du'a close; circuit complete →
  Festival plate stamp + crowd-arrival drift; course complete → Festival poster). **Retired entirely,
  do not resurrect for any new surface:** `.combo` (streak-count pop chip), `.perfect` (full-stage
  overlay), `.confetti`/`.cf` (falling burst, `AW.confetti` deleted from the JS engine), `.companion`
  (ambient mascot bob/glow — aniconism), `.breathing-ring` (pulsing halo — replaced by a static
  ink-drawn ring outline + single gold head-dot, no pulse).

---

## 5 · Copy voice — the mercy language

- **Wrongness is a strike, never a colour/shame word** (law 8). Never "buzzer," never red, never
  shake/flash language in UI copy either. Shipped wrong-answer copy pattern (verbatim from
  `preview.html`'s component-inventory demo): a grey ink-blot mark + **one line of gentle explanation**
  ("Gently — the angels never disobey; they do only as they are commanded. Look again."), then a
  `Try again` retry CTA framed in rose. Any new surface (Practice) reusing wrong-answer copy must keep
  this "gentle one-liner + retry" shape, not a scored/graded tone.
- **"Nothing lost", "Not yet — finish what comes before."** — quoted directly in the task brief as
  house mercy-language phrasing (these exact phrases were NOT found verbatim inside the three read
  source docs — they read as CLAUDE.md-level product voice/PROJECT.md phrasing the design docs assume
  as background; treat them as the confirmed house tone for gating/locking copy on new surfaces:
  never "locked because you failed," always framed as sequence/patience, never loss).
- **Noor / returns vocabulary:** "noor" is the point currency shown in the HUD (`.hstat`: "128 noor");
  "returns" is referenced in CLAUDE.md as an existing reward-choreography term (verdict → noor claim →
  returns → done) — no new terms should be invented for Practice/Profile point displays; reuse noor.
  CLAUDE.md states reward stance is "points-forward as Josh shipped it (noor per correct answer
  everywhere)" — the overjustification question is explicitly an owner decision, not a build decision.
- **Capitalization / CTA conventions:** primary CTAs are short, declarative, sentence case in the
  shipped demo ("Begin the lesson", "Continue", "Not now", "Try again") — NOT all-caps gamified
  button text. The task brief's own example "START · earn noor" (middot-separated CTA + reward
  clause) was not found verbatim in the three source docs either — if a new surface wants a
  compound CTA like this, match the shipped tone (calm, declarative) rather than shouty caps; verify
  the exact convention with the design reviewer before assuming a middot-separator pattern is
  canonical.
- **The honesty pill — exact copy, exact class, exact rule:** `<span class="r-pill">unverified ·
  pending review</span>` — **lowercase**, calm neutral styling: `color:var(--ink-62); border:1px
  solid var(--rule); border-radius:var(--r-pill); background:transparent`. **Never rose, never any
  warm alarm colour.** This pill is **always-on** for every scripture citation, everywhere in the app
  — any new surface that surfaces a citation (Practice review of a scripture-backed question, Profile
  showing a favourited ayah, etc.) must carry this exact pill unchanged.
- **Grade pill** (hadith authenticity signal): `<span class="r-pill grade">Sahih</span>` styled in
  `--olive` ink + `--olive` hairline — Za'atar Olive is the system's "sound/verified" ink (there is no
  separate green token; olive absorbs that role, D-A9).
- **No "free"-language rule:** not stated in these three docs (that rule is documented separately in
  the user's own memory as a FrameCoach content rule, not an Awba/Athar rule) — no evidence found in
  ATHAR-SYSTEM.md or the UI-SPEC of an Awba-specific "never say free" law; do not assume it applies
  here without separate confirmation.

---

## 6 · Icon doctrine

- **`AW.KIT`** = 20 scenes (post-lantern-gold-removal count). **`AW.GLYPHS`** = 13 glyphs. Both are
  re-inked (an authored, committed SVG pass — NOT a runtime `.replace()` recolour; grep gate:
  `! grep -q "\.replace(/#" shared/awba-engine.js`).
- **The currentColor + `--icon-accent` model (D-A5):**
  - Structural ink (old blue bodies/linework) → `fill="currentColor"`/`stroke="currentColor"` — the
    icon inherits the register's text ink automatically (`--cream` on Orbit, `--ink` on Page,
    `--moonmilk` on Sky). **One asset, every ground** — never author a second recoloured variant.
  - Halos/light panels → `currentColor` at low authored opacity (`.12` halo, `.06` panel) — an ink
    wash, never a coloured glow. Negative-space panels use `fill="none"`.
  - Accent detail (sparkles/flame/key marks) → `fill="var(--icon-accent)"`, register-scoped: Page =
    crimson, Orbit/Sky = gold, Festival = harissa. This is the single spot of expressive colour per
    icon, inside the ≤10% accent budget.
  - `--icon-accent` is set per register scope (§3.1 of the UI-SPEC) — never hardcode crimson/gold in
    an icon's own markup.
- **Aniconism constraints apply to icons too:** no faces, no mascots, no limbs, ever (law 2) — icon
  authors for any new surface (a Practice-session icon, a Settings-row icon) must stay within scene/
  glyph iconography, never a character.
- **`lantern-gold` is retired (D-A6)** — the single `lantern` icon renders gold automatically via
  currentColor on dark/celebration grounds; do not resurrect a bespoke recoloured variant for any new
  surface.
- **The D-16/D-A5 "no bespoke per-screen art" discipline extends to new surfaces:** the asset kit is
  explicitly bounded ("Asset kit is bounded: 1 noise tile · ~20 sprout/plant doodle SVGs · 4 plate
  compositions · 1 checker trim set · ring generator. No per-screen bespoke art.") — Onboarding/
  Practice/Profile/Settings should draw from the existing `AW.KIT`/`AW.GLYPHS` set and existing
  doodle/plate assets rather than commissioning new decorative art. If a genuinely new decorative
  element is unavoidable (e.g. an onboarding illustration), the closest committed precedent for
  "decorative art outside the glyph registry" is the **inline-doodle** pattern used for the per-lesson
  seed-row sprouts (~20 sprout/plant SVG variants, described in ATHAR-SYSTEM.md §2 "PAGE" as
  botanical seed-rows/stamps) — small, ink-line, aniconic, currentColor-based, never a second asset
  variant per ground. (Note: the task brief's "D-16 inline-doodle" label was not found verbatim
  attached to this precedent in either source doc — D-16 in the UI-SPEC text actually refers to the
  **local-date helper decision** used for the Ring's maker's-mark date and prayer-clock local-time
  math, §7.2/§6.2; the seed-row/doodle precedent itself is real and described, just not under a "D-16"
  label in these two docs — flag this to the design reviewer rather than citing "D-16" as the doodle
  decision's name.)

---

## 7 · The Ring — tawaf fingerprint

- **Meaning:** macro progress as a seeded, deterministic hand-inked tawaf fingerprint — concentric
  jittered "pilgrim rows" (rows = the 15 lessons, banded into 4 circuits) made of short dab-strokes,
  variable stroke-width (1.8–4.1px) and opacity (0.45–0.95) from a seeded PRNG (mulberry32-class, ~6
  lines inline), round linecaps, **no blur filter** ("ink-bleed" = variance + caps only, never
  `<filter>`). One near-full-circle gold outer thread drawn as 4 arcs, one per completed circuit;
  closes fully at `circuitsDone===4`. One static gold head-dot at the current inking frontier.
- **`ringSVG(cfg)` signature:** `{ seed, atomsDone, circuitsDone, structure={circuits:4,lessons:15,
  atoms:65}, size=300, inked, animateFrom }` — viewBox `0 0 size size`.
- **⚠️ Denominator discrepancy to flag, not silently resolve:** ATHAR-SYSTEM.md and the UI-SPEC's
  `structure` default both cite the course as **65 atoms** total, but `preview.html`'s live demo (the
  rendered reference) uses **61** as the "complete" denominator throughout (`atomsDone:61,
  circuitsDone:4` captioned "Complete — 61 / 61", masthead reads "44 of 61 inked"). Builders for any
  new surface that displays "X / N atoms" (Profile, Practice progress) must confirm with the design/
  content owner whether the true denominator is 65 or 61 before shipping a number — do not assume
  either figure without checking current `awba_state`/content-file counts.
- **Same seed + same progress ⇒ byte-identical SVG** (determinism test); **different seeds ⇒
  visibly different fingerprints** — no two learners share a ring. Seed is created ONCE, stored in
  `awba_state.ringSeed`, persisted (migration: absent → crypto/Math.random int, then never
  regenerated) — this IS the maker's mark (law 10), printed with the date on completion artefacts.
- **When it may draw (law 9):** ONLY the newly-inked frontier dab(s) draw (`ink-draw` on
  `stroke-dashoffset`) when returning from a lesson/atom completion — via the explicit `animateFrom`
  parameter. **The existing/established Ring NEVER re-draws on reload or on every view** — every other
  mount on a page omits `animateFrom` and renders static. Any new surface (Profile showing the Ring)
  must mount it WITHOUT `animateFrom` unless it is genuinely the just-completed moment.
  `animateFrom` semantics: pass the prior `atomsDone` value; only the delta range's dabs get the draw
  keyframe, the rest render already-inked with no animation.
  Reduced motion: `AW.reducedMotion()` gate at generation time — the generator itself omits animation
  nodes entirely (not a CSS override on top), so the returned SVG has zero `stroke-dash` regardless of
  later toggles; a page must re-call `ringSVG` (not just re-style) to reflect a changed motion
  preference.
  Perf budget: ≤~600 path nodes total (15 rows×~22 dabs + thread + head ≈ 340, comfortably under); one
  inline SVG; regenerate only on progress change, never per-frame.

---

## 8 · The prayer-clock sky

- **Five temperatures**, keyed to the real prayer clock (manual-set v1 floor, no geolocation, no
  network):

  | Temperature | Window | `data-sky` value |
  |---|---|---|
  | Post-Fajr brightness | Fajr → sunrise/Duha | `dawn` |
  | Neutral day | Duha → Maghrib | `day` (no tint — unwarmed black world) |
  | Dusk | Maghrib → Isha | `dusk` |
  | Night | Isha → local midnight | `night` |
  | Last-Third violet | midnight → Fajr | `lastthird` |

- **What stamps `data-sky`:** on boot, compute current temperature from `now` vs
  `awba_prefs.prayerTimes = {fajr,dhuhr,asr,maghrib,isha}` (local time only, D-16 local-date helpers,
  never UTC). Default schedule if absent (fajr 05:00, dhuhr 13:00, asr 16:30, maghrib 19:30, isha
  21:00). `awba_prefs.skyMode = "manual"|"off"` — `"off"` forces `data-sky="day"` always. Set
  `document.documentElement.dataset.sky` (or the home shell's), re-evaluate on visibility-change/next
  open — **no running timers needed for v1.**
- **`--dawn`:** a SEPARATE, independent apricot-warmth degree layered under the Ring on home, scaled
  by `atomsDone/65` (or 61 — see §7 discrepancy), capped so it never competes with the real sky tint
  or scripture/Ring. **Ambient only, never the metric** — a Profile/Settings surface must never treat
  `--dawn` as a progress display; the Ring is the metric, always.
- **Nightfall is never auto-triggered by the sky clock** — Nightfall (§3.4 of the UI-SPEC) is a
  distinct **Page moment** (the weightiest ayah dimming the room to `#201418`), triggered by lesson/
  content logic, not by time-of-day. Do not confuse the two "night" concepts: Sky's `lastthird`
  temperature is ambient time-of-day; Nightfall is a specific in-lesson interstitial event.
- **Reduced motion:** the tint itself is information/ambience and stays visible under reduced motion
  (a static tint is not "motion"); only the *breathe* pulse on the tint/halo stops.

---

## 9 · Component quality-bar details new surfaces must match

- **Paper-press:** the ONE press recipe (§4 above) — `translateY(1px)` + ink-deepen, no shadow drop,
  no bounce, on every tappable in every register, no exceptions for new components.
- **Folk keylines / Farag squares:** Aref Ruqaa chapter terms are clipped in hard-cornered squares
  (`--r-square:0`); Festival plate frames are likewise hard-cornered folk frames — never round these
  for a new surface's "badge" styling.
- **Plate framing:** Festival plates/posters are hand-composed folk compositions, dated + seeded
  (maker's mark), **private by default**; a new surface must never auto-generate a plate-style visual
  for a non-threshold moment (that would violate "joy rationed to where joy belongs").
- **Thermal grammar (shape-first, colour-second, D-A8):** not-yet = hollow ring (2px border,
  `--ink-40` on cream / `--powder` on dark); progress = half-inked dab (`linear-gradient(90deg,
  var(--st) 50%, transparent 50%)`, ring border `--st`); mastered = filled dab + check glyph (`--gold`
  fill + `--rule` keyline on cream, no keyline needed on dark). Any new surface showing progress state
  (Practice review status, Profile per-topic mastery) MUST reuse this exact three-shape vocabulary —
  never a plain colour dot with no shape distinction.
- **Sheet anatomy:** `.scrim` (warm-ink dim `rgba(19,16,19,.52)`, fades `--dur-sheet`) → `.sheet`
  (cream ground even when opened from a dark register — "paper laid over the world"; `--r-4` top
  corners; `box-shadow:var(--sh-3)`; **settle** motion, `translateY(100%)→0` over `--dur-sheet`) →
  `.grip` (40×4 `--r-pill` `--rule`-coloured) → `.sheet-x` close (44×44 hit area). Any new surface
  reusing the bottom-sheet primitive (`AW.sheet`) inherits this anatomy unchanged — it is
  skin-agnostic JS, re-skinned via CSS only, and must not be re-implemented per surface.
- **Focus rings (AA-checked, ground-scoped, D-A10):** Crimson ring on cream grounds (Page/Festival,
  6.13:1); Gold ring on dark grounds (Orbit/Sky-night/Nightfall, 6.95–8.40:1). New components must
  pick the ring colour from their host register, never hardcode one.
- **Touch targets:** 44px minimum everywhere (tabs, sheet-close, etc.) — outside the 4px spacing
  scale, a hard floor.
- **AA contrast rulings that bind new UI (do not deviate):** Ember is a dark-grounds TEXT colour only
  (3.21:1 on cream = shape/border/large-display only, never small body text on cream). Gold never
  texts or lone-indicates on cream (1.93:1) — filled shape + `--rule` keyline only. Powder never
  lone-indicates on cream (1.58:1; the not-yet cue on cream is an ink-outlined hollow ring, not a
  powder-coloured one). Crimson is **banned on Orbit** (2.65:1 — Page-only ink).

---

## 10 · Spec text mentioning FUTURE surfaces

Neither source doc names "onboarding," "practice," "profile," or "settings"/"more" as designed
surfaces anywhere — this v2 slate is genuinely new ground relative to both documents. The closest
forward-looking hooks found, quoted:

- **A future settings screen for prayer times** (§7.2 of the UI-SPEC, verbatim): *"If `prayerTimes`
  is absent, use a sensible default schedule... so the sky always has a temperature; **a settings
  screen (later phase) lets the learner set real times.** Manual is the floor; location-aware is a
  future enhancement that writes the same `prayerTimes` blob."* — this is the ONE explicit textual
  anchor for a future Settings/More surface: it must host a prayer-times editor writing into
  `awba_prefs.prayerTimes`, plus presumably the `skyMode` manual/off toggle.
- **"Future cohorts/study circles"** under CIRCLE's ownership list (ATHAR-SYSTEM.md §"The Five
  Registers" table, Circle row: *"review sessions... crowd-arrival moments · **future cohorts/study
  circles**"*) — if Profile or a social feature ever surfaces cohort/circle membership, it is
  CIRCLE's token layer to own, not a new register.
- **"Location-aware [prayer times] is a future enhancement"** (§7.2) — geolocation-based prayer times
  is explicitly deferred past v1; do not build it into a v2 Settings page without a separate decision,
  the manual floor is what's specified.
- **Gate 2 / Phase 3 roadmap note** (ATHAR-SYSTEM.md, closing section): *"What this means for gen-4
  Phase 3 (after lock)"* lists only the Ring generator and prayer-clock sky as spikes, plus the
  bounded asset kit — no onboarding/practice/profile/settings phase is scoped in either document.
  These four v2 surfaces are net-new scope requiring their own register assignment and component
  choices reasoned from first principles (§2.1 above), not transplanted from an existing spec passage.

---

## 11 · Misc binding facts for builders (non-visual but load-bearing context from the docs)

- Zero-build, zero-CDN, classic `<script>` tags, `file://` double-click must work — font/grain URLs
  are CSS-relative, never a leading slash.
- `@layer tokens, base, components, screens, motion;` is declared exactly ONCE — new surfaces write
  content blocks into existing layers, never re-declare the layer-order line.
- `AW.icon / AW.cite / AW.wire / AW.sheet / AW.sheetRef / AW.sheetTerm / AW.reducedMotion / AW.animate
  / AW.ringSVG` are the skin-agnostic JS API surface new surfaces should call into — `AW.confetti` is
  deleted, do not reference it.
- The `<span class="cite" data-ref="…">` byte-shape is validator-locked — any new citation-consuming
  surface must produce this exact shape via `AW.cite(ref, label)`, never hand-roll the markup.
- 17-token colour palette total (§2.1 of UI-SPEC) — a daily screen sees ≤6 of them; new surfaces
  should NOT introduce new hex values, only combine existing tokens per their assigned register.
