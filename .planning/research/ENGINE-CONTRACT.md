# Gen-3 Engine Contract & Quality-Gap Map (session exploration, 2026-07-11)

> Produced by a Sonnet exploration agent reading Josh's `_MVP-BUILD/` in full (engine JS/CSS, learn.html, sample lessons/reviews, cross-checked against all 15 lessons + 4 reviews via grep — the beat-type vocabulary below is exhaustive).
> **PURPOSE:** (1) the exact config contract Gen-4's engine must honor so Josh's 15 lesson + 4 review data files port verbatim; (2) the specific quality gaps Gen-4 exists to fix.

---

## 1. ENGINE API (the compatibility contract)

Two globals, called from inline `<script>` per page. Gen-3 injects a full-body skeleton; Gen-4 may restructure internals freely but MUST accept these cfg shapes unchanged.

### AwbaLesson(cfg)
Top-level: `id` (stars key) · `unitColor` (hex → theme) · `journey` (eyebrow) · `opener {h2, p, thought?, thoughtLabel?}` · `icon?` (AW.KIT name; default by unit prefix u1→compass u2→lanterns u3→kaaba u4→mosque) · `beats[]` · `refs {id → {ref, ar, mean, src, kind?, grade?}}` · `terms {id → {ar, tl, word, def, ctx}}` · `recap[]` · `grew?` · `doneTitle?` · `doneLine?` · `next {href, label}?`

Beat types (`t`):
| t | fields | behavior |
|---|---|---|
| read | kicker?, title?, html, ill?, marker? | free HTML block (may contain `.term[data-term]` spans + `AW.cite(id,label)` chips) |
| frame | kicker?, lead | tinted left-border blockquote |
| verse | kicker?, label, ar, tr, after? | scripture card, RTL Amiri Arabic, fixed Clear Quran + pending-review footer |
| panel | title, intro?, ill?, marker?, variant?, items[{n?, name, tag?, tell?, body}] | card stack; variants: pull (blue, default) / tell (amber giveaway box) / guard (green) / check (numbered) |
| depth | point, lenses{reality, revelation, ruling} | 3-Lens accordion, fixed order+colors: In real life (amber) / In revelation (blue) / What it means for you (green); independently expandable |
| reflect | prompt, model | private textarea (never persisted), first CTA tap reveals model +15 noor, second advances |
| mc | q, quote?, o[], c(index), good, gentle | multiple choice; Check → green .correct / amber .miss |
| tf | q, c(bool), good, gentle | true/false pills |
| tile | prompt, bank[], solution[], good, gentle | word-bank builder; exact-order match |

Markers: `marker:{type: fact|remember|fard|angle, body}` (labels: Worth knowing / Worth remembering / The first duty / Another angle). Shipped lessons use fact/remember/angle.

Quiz resolution: correct → correct++, combo++, noor += 12, combo chip at ≥2, PERFECT overlay + confetti at exactly combo===3 (once per streak). Miss → mistakes++, combo=0, amber footer with `gentle` copy; success footer rotates 4 praise titles, shows `good`. Stars: 0 mistakes=3★, 1=2★, ≥2=1★ (never 0).

Flow: opener (3 greet modes via AW.greetMode(): first / streak ("N returns" chip) / returning ("welcome back", copy override)) → beats (back button decrements pos; progress bar keyed to separate stepIndex so back never un-fills) → verdict (stars + 3 stat tiles + confetti) → noor claim (persists noor here) → returns hero (orange, week calendar) → done (recap, persists best-of stars). Constants: PER=12, REFLECT=15.

### AwbaReview(cfg)
`id` · `title` · `sub` · `mastery` · `items[]` (MC: {q, quote?, o[], c, t} where **t = explanation text**, naming collision with lesson beat `t`; TF: {tf:true, q, c, t}) · `next {href, label}`

Behavior: lamp-row progress (lit by count correct, NOT per-question) · 14s timer/question (decisecond bar, "low" color <28%) · PER=15 + SWIFT=5 if in-time (main phase only) · timeout → question queued to `skipped`, auto-advance 1.5s, no penalty · after main queue: circle-back offer (untimed, no noor) or straight to result · stars: 3★ = all correct AND allInTime; 2★ = all correct not all in time; else 1★ (any single timeout permanently kills allInTime) · intro+result use .gold-bg night gradient + gold lantern (LANTERNG) · no back button · AW.touchDay() on "Begin the review".

### Shared systems
- `AW.cite(id,label)` → citation chip → bottom sheet (ref pill + grade pill?, RTL Arabic, meaning, source, "unverified · pending review" pill).
- Term gloss: `.term[data-term]` → sheet (Arabic large, transliteration, gloss word, def, context).
- `AW.confetti(n)` — DOM divs, CSS keyframe fall; 30/16 at verdict by mistakes, 20 at done.
- `AW.skeleton()` — HUD (close, back, segments/lamps, streak stat, noor stat), stage, combo chip, PERFECT overlay, confetti layer, scrim+sheet.

## 2. STORAGE SCHEMA (Gen-4 must honor or migrate)
All JSON via `AW.S` with `awba_` prefix; NO versioning exists.
- `awba_noor` number (cumulative; written at noor-claim / review result)
- `awba_returns` number (day count; via AW.touchDay())
- `awba_lastDay` toDateString() | null (dedup + greetMode: first/streak/returning by day-diff)
- `awba_days` string[] toDateString(), capped slice(-90) → week calendars
- `awba_stars` {id → 1|2|3} best-of, never downgrades; shared namespace lessons+reviews
- `awba_chest_<nodeId>` boolean (+25 noor side-effect on first tap, before popup renders)

Learn-path derivation: nodes flattened across all 4 units; chest = available when preceding review has stars; regular node active only when EVERY prior non-chest node in the whole course has stars (strictly linear, no per-unit independence). touchDay() fires on lesson "Begin, gently" / review "Begin" — not on page load. Local-timezone toDateString() boundaries (no TZ robustness).

## 3. LEARN PAGE ANATOMY
Layers: .lhud (56px top: course chip → switcher sheet; streak stat; noor stat) · .lbody scrollable · .tabs (66px: Learn active; Practice/Returns/Profile/More decorative, NO tap feedback) · scrim/sheet.
- Streak band: orange gradient pill, big returns number, "NEVER BREAKS" badge (sheet HTML duplicated verbatim in two handlers).
- Daily ayah: DAILY[date.getDate() % 7] from a hardcoded 7-verse pool (repeats monthly; static, no interaction).
- Unit cards: gradient of unit hex → hex+CC, eyebrow hardcoded "SECTION 1 · UNIT N", circular icon badge.
- Path: `.noderow` flexbox alignment pattern ['c','l','c','r',...] — NO connecting line/curve drawn; zigzag implied by positions only.
- Node states: locked grey + lock icon; active = 5px blue outline ring + mascot lantern absolutely positioned left (-58px); done = stars row. Review nodes always gold gradient.
- Popups: appended into the noderow, clamped to phone width, --ax arrow offset keeps pointer on node; singleton; outside-click closes. Chest popup = 2.4s auto-dismiss toast; reward fires on click before render (no preview/confirm).

## 4. DESIGN TOKENS (Gen-3 actual)
- bg #EEF2FB · card #F6F9FF · paper #FFF · tint #E7EEFF · blob #C9D7F5
- blue #2E6BF5 (theming target) · blue2 #2536CE (fixed!) · blue3 #4E82F7 (fixed!)
- ink #232A3D / #59607A / #98A0B8 · lines #DEE5F3 / #C9D3EA
- green #1F9D6B (+bg/ink/line) · amber #C68A2E (+bg/ink/line)
- flame #F0730B/#FFB03A · gold #E8A400/#FFD34D/#B47F00 · night #241A05/#3A2A08
- Units: u1 #2E6BF5 · u2 #7C5CE0 · u3 #0FA3A3 · u4 #E8A400 (CSS vars DEAD — learn.html hardcodes same hexes in JS; two sources of truth)
- Fonts: Poppins (display) / Inter (body) / Amiri (Arabic) via Google Fonts CDN, no font-display control, no self-hosting
- Buttons: "gummy" faux-3D (box-shadow 0 5px 0 darker → 0 2px 0 + translateY(3px) :active) across .btn/.opt/.tf/.tile
- Theming: ONLY --blue is overridden per unit (inline on <html>) → blue2/blue3 secondary elements stay indigo on purple/teal units = visibly half-themed pages (BUG-class gap)
- Gold legendary: .gold-bg hardcoded second visual system (dark gradient, gold buttons, regex-recolored gold lantern)

## 5. ICON KIT (as embedded)
- AW.KIT: 12 inline-SVG scenes (240×300: mosque, lantern, lanterns, crescent, prostration, quran, beads, kaaba, dua, compass, night, starpat). NOTE: the branding folder has the CANONICAL 20-SVG set (see ASSETS.md) — Gen-4 should build one icon registry from the 20-file source.
- AW.LANTERNG: fragile regex hex-substitution gold recolor — replace with proper asset or currentColor theming.
- Standalone glyphs: FLAME, SPARK, CHECK, HEART, BOLT, TARGET, CLOCK, STARG/STARE, CITE, LP (lamp) + marker glyphs GLY{fact,remember,fard,angle}.
- learn.html duplicates: UIC unit-icon map, IC_STAR/TROPHY/CHEST/LOCK, tab icons — resolve into one registry.
- Zero accessibility semantics on any icon.

## 6. QUALITY GAPS GEN-4 MUST FIX (verbatim from the audit, prioritized)

**Architecture:** hard full-page navigations (white flash + font reflow every "Next") — needs transition choreography/prefetch/shared-shell feel · string-concat innerHTML with zero escaping · duplicated sources of truth (unit colors ×2, unit-icon map ×2, streak-sheet HTML ×2) · NO localStorage versioning/migration · silent error swallowing · O(n²) state re-parsing in node loop · reflect textarea fully inert ("stays private" but captures nothing).

**Motion:** only bob+glow exist, identical on every emotional beat · DOM-div confetti (janks if scaled) · PERFECT fires only at exactly 3-combo, no escalation at 4/5/6 · no page-transition choreography · **no prefers-reduced-motion handling anywhere**.

**Accessibility:** 2 aria-labels in the entire codebase · no aria-live for correct/incorrect/noor/combo · icon-only controls unnamed · placeholder-only textarea · no :focus-visible styles (tap-highlight suppressed = keyboard users stranded) · amber contrast untested vs WCAG AA · no lang="ar" on Arabic spans (screen-reader pronunciation).

**Responsive:** fixed 380×788 phone-card centered in page — not a real mobile-first app; no full-bleed mobile mode, no tablet/desktop layout, all fixed px type (no clamp/rem).

**Hardcoded:** daily ayah = getDate()%7 (repeats monthly) · "SECTION 1" placeholder eyebrow · dead tab bar with zero tap feedback · global "pending review" string (no per-citation verified state) · gold lantern regex recolor.

**Design debt (logic):** "swift" bonus = merely in-time (13.9s still "swift") · review lamps = count-correct dressed as per-question status · unlock strictly linear across all units (no revisit flexibility for practice) · no per-question review/coaching toward 3★.

**Gen-3 v1.1–v1.5 review fixes that must NOT regress:** branded icons wired · 3-Lens = individually-expanding accordion · chest re-render+anchor fix · back button in lessons (hidden in reviews/rewards) · streak band on Learn · reward screens reserve 128px above footer (no overlap) · compact popup stars · timer teeth (auto-skip → untimed no-noor circle-back, timeout caps 2★) · popup anchored to node with clamping + arrow offset · TF gold selection visible in reviews · dense-lesson split architecture (m3/m3b, m2/m2b naming).
