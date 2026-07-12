# AWBA — THE ATHAR SYSTEM · Five Registers, One App
_Date: 2026-07-12 · Response to Gate 2 direction: "incorporate all of them — each with its own use case, without it feeling too much."_

## The architecture in one paragraph
**Nobody blends. Everybody owns a context.** Athar stays the identity spine (the brand, the black world, the Ring). The other four directions become **registers** — each owns specific surfaces and moments, and never trespasses. One constitution underneath (same grain, same scripture laws, same workhorse font, same easing family) makes five worlds read as one app. Daily surfaces are quiet; the loud registers open only at thresholds. That is how you love all five without wearing all five at once.

---

## The Five Registers

| Register | From | Owns (surfaces & moments) | Ground | Motion verb |
|---|---|---|---|---|
| **1. ORBIT** | Athar | Brand/app icon · home · the Athar Ring (macro progress) · lesson-complete celebrations | Kiswah Black | **draw** (ink strokes draw themselves) |
| **2. PAGE** | Pomegranate Ink | Lessons · quizzes · reading surfaces · Nightfall ayah interstitial · journal/reflections | Haram Cream | **settle** (paper laid on cloth, ink soaks in) |
| **3. SKY** | Fajr Grain | Time itself: canvas temperature follows the **real prayer clock** · night sessions · du'a screens · streak constellation · `--dawn` horizon warmth | Last Third (night) / tint layer (day) | **breathe** (4–6s ambient loops) |
| **4. CIRCLE** | Ember Orbit | All progress-state colour (thermal ramp) · review sessions ("the circle gathers") · crowd-arrival moments · future cohorts/study circles | token layer — no ground of its own | **drift** (dabs drift in and settle into orbit) |
| **5. FESTIVAL** | Warsha | Thresholds ONLY: 4 circuit plates · course-completion poster · Eid & Ramadan dressing · share/export cards · marketing site | Haram Cream + folk colour | **stamp** (instant fill, 1.03→1.0 settle, 150ms) |

### Each register's use case, stated plainly
1. **ORBIT — where you see what your learning has traced.** The sacred centre. You open the app into the black world and your Ring. All macro progress lives here and only here.
2. **PAGE — where you actually learn, ~90% of your minutes.** Manuscript-quiet cream paper: rubricated ayat with crimson jadwal margin rules, ink-bordered quiz cards, the weightiest verse dimming the room (Nightfall: one ayah, "sit with this"). Micro-progress is botanical: each lesson shows a **seed-row** — its atoms as faint dots that ink into small sprouts as you complete them; a finished lesson stamps one small plant doodle in the index (15 total, ~20 variants, never a 65-plant competing map — the Ring is THE map). Review milestones seal with a gold rosette. The Ibrahim 14:24 line ("a good word is like a good tree…") sits in mono beneath the lesson index — the orchard's reason for existing.
3. **SKY — the app knows what time it is in your deen.** Not a gimmick dark mode: the ambient canvas follows the real prayer clock — post-Fajr brightness, neutral day, dusk after Maghrib, **Last-Third violet** in the night's last hours (when this app will genuinely be opened). Du'a moments and the streak-as-constellation belong to Sky. Course progress adds one degree of horizon warmth on home (`--dawn`) — ambient, never the metric (the Ring is the metric). This kills the "synthetic dawn" critique: the sky tracks *real* time; it doesn't dispense fake Fajr as a reward.
4. **CIRCLE — you are never circling alone.** The thermal ramp is the app-wide state language: **Powder Veil (not yet) → Farag Ember (in progress) → Hajar Gold (mastered)**, always shape-cued for colour-blind users. Reviews open with the circle gathering — ink dabs drifting in around your ring — and circuit completions bring the crowd-arrival moment: hundreds of dabs settling into orbit around what you've traced. The ummah as ambience, not leaderboard.
5. **FESTIVAL — joy is rationed to where joy belongs.** The bazaar opens ~9 times in the whole journey: 4 circuit plates (hand-composed folk plates, **dated, private by default** — craft objects, not badges), the course-completion poster (your seeded Ring printed in a Warsha folk frame), Eid al-Fitr & Eid al-Adha dressing (checker trims for the day only), and any share/export card you *choose* to make. Plus the public marketing site, where Warsha can sing full-throated. Never in daily UI chrome.

---

## The Constitution (laws shared by all registers — what stops "too much")
1. **One register per screen.** A screen has exactly one ground/register. Other registers may appear only as tokens (a thermal state chip, a time tint) — never a second ground.
2. **Aniconism, absolute.** No faces, no mascots, no limbs. Ever.
3. **Scripture law.** Ayat/du'as in **Amiri only**, ≥1.35–1.5× adjacent Latin size, lh 1.9, ﴾…﴿ brackets, full tashkeel. Scripture is the strongest ink on any page (rubrication), never sits on texture/pattern/photo, and carries the only glow any element is permitted. Transliteration + translation under every display-Arabic moment, no exceptions.
4. **One workhorse.** Readex Pro carries ALL UI text in both scripts, in every register — the thread that stitches five worlds into one app.
5. **Display faces are rationed.** Marcellus (Orbit + Sky display, ≥28px) · Aref Ruqaa (the 15 chapter terms only, ≥40px, clipped in Farag squares) · Rakkas (Festival signage only, ≥28px, never scripture) · Courier Prime (marginalia voice only: dates, counters "18/65", footnotes, the Ibrahim line — never body text). Rakkas and Aref Ruqaa never share a screen.
6. **One grain.** A single tiled noise PNG over every ground (~2% on cream, ~5–9% on dark). No smooth gradient without grain; no runtime SVG turbulence.
7. **Accent budget.** ≤10% expressive colour on any working screen. Full expressive register only at thresholds (Festival's law, applied to everyone).
8. **Wrongness is a strike, never a colour.** Wrong answers: grey ink blot that fades + one-line explanation; Rose Ember tint only frames the retry, nothing flashes red, nothing shakes.
9. **The centre never animates.** One motion verb per register (draw/settle/breathe/drift/stamp), all on one easing family — `cubic-bezier(0.23, 1, 0.32, 1)`, UI ≤300ms, ambient 4–6s, all gated by `prefers-reduced-motion`.
10. **Artefacts are private by default.** The Ring poster, the plates, the completed sky — yours first; sharing is a deliberate act (ikhlas protected). Completion artefacts carry date + seed as a maker's mark.

---

## Unified tokens

### Type (6 faces, 4 rationed)
| Face | Role | Where |
|---|---|---|
| Readex Pro 300–700 | ALL UI/body, Latin + Arabic UI strings | everywhere |
| Amiri 400/700 | scripture & du'a only | everywhere scripture appears |
| Marcellus 400 | English display + stat numerals ≥28px | Orbit, Sky |
| Aref Ruqaa 400/700 | 15 chapter key-terms ≥40px in squares | Page (chapter heads), Orbit (celebrations) |
| Courier Prime 400 | marginalia: dates, counters, footnotes | Page margins, artefact maker's marks |
| Rakkas 400 | festival signage ≥28px | Festival only |

### Colour (17 tokens, register-scoped — a daily screen sees ≤6)
**Core (Orbit + shared):** Kiswah Black `#131013` · Haram Cream `#F3EDE2` · Mihrab Crimson `#A32C21` (≤10% budget) · Farag Ember `#E8502A` (dark grounds only) · Hajar Gold `#D9A441` (earned thread + rosette seals — absorbs Ink's Gilding) · Layl Navy `#1B2436`
**Page:** Madder Wash `#8F4B58` (secondary ink: metadata, doodles at rest) · Nightfall `#201418` (interstitial ground only — a moment, not a dark mode)
**Sky:** Last Third `#251D46` (night canvas) · Moonmilk `#F4F0F7` (night text) · Horizon Apricot `#F0A583` (dawn warmth) · Powder Veil `#A9BFEE` (cool end of thermal ramp = "not yet") · Rose Ember `#E7A5B4` (gentle retry frame)
**Festival:** Harissa Tomato `#C13A20` · Za'atar Olive `#6B682A` · Mustard `#E3A63A` · Souk Pink `#EFB5AC` (mustard/pink never carry text)

**Cut in the merge** (so it never feels like too much): Young Serif, Alegreya, Alegreya Sans, IBM Plex Sans Arabic, Hanken Grotesk, Bricolage Grotesque; Samarkand Paper & Samovar Cream (one cream wins: Haram), Pomegranate Ink `#6B1F2F` (Kiswah is the ink; Madder Wash keeps the pomegranate warmth), Fajr's Nur Gold (Hajar Gold wins), Ember's spiral map (the Ring is the only macro map), the 65-plant Bustān (demoted to per-lesson seed-rows + 15 stamps), Fajr's dawn-as-reward (Sky tracks real time instead).

---

## A day in Awba (the journey the demo page shows)
1. **Maghrib, home** — ORBIT under SKY's dusk tint: the black world warmed at the horizon, your Ring half-inked, one navy continue card. *"Circuit 3 · Al-Asmā' wa-l-Ṣifāt."*
2. **The lesson** — PAGE: cream paper settles over the world (ring ghosted 4% behind), rubricated ayah with crimson jadwal, seed-row sprouting 3/5, mono marginalia.
3. **The quiz** — PAGE ground, CIRCLE states: correct = a gold dot draws itself; wrong = grey ink blot fades, rose frames the retry.
4. **Nightfall** — the weightiest ayah dims the room to `#201418`. One verse. *"Sit with this."* Tap to return.
5. **Atom complete** — ORBIT: one brushstroke draws itself onto the Ring; SKY closes it with a du'a in Amiri and a single *"Alhamdulillah — continue."*
6. **Circuit complete** — FESTIVAL stamps the dated plate; CIRCLE brings the crowd-arrival around your ring; the gold thread closes the circuit.
7. **Eid morning** — home wears the checker trim for one day. Then the bazaar closes, and the orbit is quiet again.

---

## What this means for gen-4 Phase 3 (after lock)
- Token sheet above → `awba-engine.css` custom properties (registers as scoped classes: `.reg-orbit`, `.reg-page`, `.reg-sky-night`, `.reg-festival`; thermal states as `data-state` attrs).
- First spike remains the **Ring generator** (seeded jitter, variable stroke, ink-bleed) — the single point of failure.
- Second spike: the **prayer-clock sky** (5 canvas temperatures keyed to real prayer times — location-aware or manually set).
- Asset kit is bounded: 1 noise tile · ~20 sprout/plant doodle SVGs · 4 plate compositions · 1 checker trim set · ring generator. No per-screen bespoke art.

**Gate 2 (revised): lock this unified architecture.** The demo page (`Awba-Unified-System.html`) shows the seven moments above rendered for real.
