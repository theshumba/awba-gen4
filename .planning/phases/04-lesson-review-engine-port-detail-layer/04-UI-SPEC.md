---
phase: 4
slug: lesson-review-engine-port-detail-layer
status: draft
shadcn_initialized: false
preset: none
created: 2026-07-13
authority: .planning/phases/03-components-icon-kit-motion-language/03-UI-SPEC-ATHAR.md  (the SYSTEM contract — this doc APPLIES it per-screen, never re-derives or contradicts it)
canon: .planning/ATHAR-SYSTEM.md  (the Gate-2 lock)
binding_translation: 04-CONTEXT.md D-45 (Gen-3 → Athar; the binding reading of REQUIREMENTS' retired vocabulary)
---

# Phase 4 — UI Design Contract · Lesson & Review Engine Port + Detail Layer

> **Scope of THIS document.** The Athar design **system** is fully locked (Gate 2, §9 human gate
> APPROVED 2026-07-13). This doc does not re-open tokens, faces, registers, Ring, or Sky — it is the
> **screen-level application**: for every Phase-4 surface (lesson shell, the 9 beats, verse/depth,
> quiz, reward choreography, review, sound UI) it fixes layout, register, primitive usage, states,
> copy tone, and motion using **only** shipped tokens/primitives. **Zero new tokens, zero new faces,
> zero new layer-order.** Every colour pairing is cited to the `03-UI-SPEC-ATHAR §2.1` AA table — none
> is invented here.
>
> **Binding law stack (in precedence order):** `ATHAR-SYSTEM.md` (canon) → `03-UI-SPEC-ATHAR.md`
> (system contract) → `04-CONTEXT.md` D-45..D-52 (this phase's locked decisions). On any conflict, the
> higher wins; flag, never silently diverge.
>
> **Retired elements — NEVER reintroduce (Gate-2 lock):** confetti · PERFECT overlay · combo chip
> (floating pill) · companion/lantern mascot · amber mercy · unit accent colours (`data-unit` colour
> theming) · gummy 5px indigo press · `.gold-bg` · Google Fonts CDN · Poppins · `AW.confetti` ·
> `AW.ill()`/`AW.STARG` Gen-3 names.

---

## 0 · Design System

| Property | Value |
|---|---|
| Tool | **none** — vanilla HTML/CSS/JS, zero build, `file://`-openable (CLAUDE.md hard constraint). shadcn gate **N/A** (not a React/Next/Vite stack). |
| Preset | not applicable |
| Component library | **none as a package** — the in-repo `AW.*` primitive library (`shared/awba-engine.js`) is consumed as-is; Phase 4 fills the empty **RUNNERS** section (`AwbaLesson`/`AwbaReview`/`AW.sound`) and the empty **`@layer screens`** block (`shared/awba-engine.css:923`). Never re-declare `@layer tokens, base, components, screens, motion;` (line 16). |
| Icon library | `AW.KIT` (20 scenes) + `AW.GLYPHS` (13 glyphs), one-colour `currentColor` + `var(--icon-accent)` model — no runtime recolour. Gen-3 icon names are remapped (§ Icon Map below). |
| Font | **Readex Pro** (sole workhorse, both scripts) · **Amiri Quran** (ayah) / **Amiri** (hadith + du'a) · **Marcellus** (Orbit/Sky display + stat numerals ≥28px) · **Aref Ruqaa** (15 chapter terms ≥40px) · **Courier Prime** (marginalia) · Rakkas (Festival — not exercised this phase). Inter is the silent `˹ ˺` glyph-fallback only. All self-hosted, zero CDN. |
| Registry safety | not applicable — no external component registry (see § Registry Safety). |

**What is empty and awaits this phase:** `shared/awba-engine.css:923` (`@layer screens` — reserved),
`shared/awba-engine.js:1358` (RUNNERS placeholder). `lessons/`, `reviews/`, `shared/sfx/` do not yet
exist. `.nightfall` ships (css:413) but is **NOT wired** in Phase 4 (D-48).

---

## Spacing Scale

**Locked system scale (D-A1 — retain Phase-1 4px scale verbatim; NOT re-derived here).** The checker's
"multiples of 4 only" heuristic yields to the Gate-2-locked scale, which carries three documented
sub-4 / off-8 exceptions for manuscript rhythm.

| Token | Value | Usage in Phase 4 |
|---|---|---|
| `--sp-2` | **2px** | hairline exception — jadwal margin-rule width, card keyline (`--keyline`), verse rubrication rule |
| `--sp-1` | 4px | icon gaps, inline chip padding |
| `--sp-2s` | 8px | compact stacking (stat-tile inner, marker rows) |
| `--sp-3` | 12px | option/tile inner padding, HUD stat gaps |
| `--sp-4` | 16px | default beat spacing, `.btn` padding, card padding |
| `--sp-5` | 20px | beat-to-beat vertical rhythm |
| `--sp-6` | 24px | section padding, reward-tile gaps, sheet padding |
| `--sp-8` | 32px | screen gutters, reward moment separation |
| `--sp-12` | 48px | major reward-screen breaks (verdict → noor) |
| `--sp-16` | 64px | terminal moment framing (Ring / du'a close) |

**Exceptions (locked, do not "correct"):** `--sp-2` (2px hairline jadwal rule) · `--sp-3` (12px) and
`--sp-5` (20px) manuscript steps · **44px** minimum touch target (mute toggle, `.sheet-x`, `.tab`,
every tappable) — sits outside the scale · `env(safe-area-inset-*)` at the shell layer.

---

## Typography

**Phase-4-relevant roles from the locked `03-UI-SPEC-ATHAR §2.2` table (not re-derived).** Readex Pro
is the ONE workhorse; weights used this phase: **400 (body) + 600 (emphasis)** with 500 for quiz
questions and 300 permitted only ≥18px soft intros. Display numerals are Marcellus; scripture is
Amiri/Amiri Quran; marginalia is Courier. This exceeds the checker's "3-4 sizes / 2 weights" greenfield
heuristic because the manuscript type system is locked at Gate 2 — cite, do not compress.

| Role | Token | Face / weight | Size | LH | Where in Phase 4 |
|---|---|---|---|---|---|
| Body | `--fs-body` | Readex Pro 400 | 16px | 1.6 | read/frame/panel prose, translation-of-meaning, `it.good`/`it.gentle`, recap |
| UI / meta | `--fs-ui` | Readex Pro 400/500 | 14px | 1.45 | option labels, captions, stat labels, source lines |
| Quiz question / section | `--fs-h2` | Readex Pro 500/600 | 18→20px (clamp) | 1.3 | mc/tf/tile question, panel headings, depth-lens labels |
| Screen title | `--fs-h1` | Readex Pro 600 | 22→26px (clamp) | 1.18 | opener greeting, verdict word, review intro title |
| Display / stat numerals | `--fs-display` | **Marcellus 400** | 28→46px (clamp) | 1.08 | noor count-up, reward stat numerals, big returns count (≥28px floor, law 5) |
| Chapter term (Ar) | `--fs-term` | **Aref Ruqaa 400/700** | 40→48px | 1.0 | opener journey chapter-term in a Farag square (ink `--crimson`) |
| Marginalia | `--fs-marg` | **Courier Prime 400** | 11–12px | 1.4 | per-beat counter (e.g. "3 / 6"), panel item `n:`, source provenance, combo counter, dates |
| **Ayah (verbatim)** | `--fs-ayah` | **Amiri Quran 400** | 24→27px (clamp) | **1.9** | verse beats + Revelation lens + citation sheet — ≥1.5× the 16px translation; ﴾…﴿; full tashkeel; strongest ink; the only glow |
| Hadith / du'a (Ar) | `--fs-scrip` | **Amiri 400/700** | 23px | 1.85 | hadith citation sheet + the du'a close ("Alhamdulillah — continue." context) |

**Scripture law (law 3 — binding on every verse/hadith/du'a surface):** Amiri family only, never
Readex/never a display face; `lang="ar" dir="rtl"`, `unicode-bidi:isolate`, `letter-spacing:0`;
strongest ink (`--kiswah` on cream / `--cream`/`--moonmilk` on dark, full opacity, no ramp); the ONLY
permitted glow (`text-shadow:0 0 24px rgba(244,240,247,.30)`, dark grounds only); never on grain/
texture (`--go:0`); transliteration + translation beneath every display-Arabic moment; **nothing
celebratory in the same panel** (D-51 grep gate).

---

## Color

**60 / 30 / 10 split, register-scoped. Every pairing cited to `03-UI-SPEC-ATHAR §2.1` (AA at real
rendered sizes). No pairing invented here.** A working screen sees ≤6 colour tokens (law 7); expressive
accent ≤10% (law 7).

### Page register — lessons, quizzes, verdict/noor/returns/done (cream ground)

| Role | Token | Value | Usage (cited ratio on `#F3EDE2`) |
|---|---|---|---|
| Dominant (60%) | `--cream` | `#F3EDE2` | Page/reward ground, `--go:.028` grain |
| Secondary (30%) | `--kiswah` + ink ramps | `#131013` / `--ink-85/.62/.40` / `--rule` | body ink (16.22:1), captions (`--ink-62`), keylines/jadwal (`--rule`); `--navy #1B2436` alt strong ink (13.33:1) for panels |
| Accent (10%) | `--crimson` | `#A32C21` | 6.13:1 — see reserved list |
| Secondary ink | `--madder` | `#8F4B58` | 5.44:1 — marginalia tint, source provenance, doodles-at-rest |
| Verified pill | `--olive` | `#6B682A` | 4.95:1 — hadith grade pill only (D-A9; Athar has no affirm-green) |
| Retry frame (semantic, not destructive) | `--rose` | `#E7A5B4` | 1.73:1 on cream — **decorative frame ONLY** (law 8 / D-A12); the load-bearing wrong-answer signal is the grey ink-blot + `--ink-85` one-liner + shape change, never rose alone |

**Crimson `--crimson` is reserved on Page for, and ONLY for:**
1. Primary CTA fill (`.btn` — `background:var(--crimson); color:var(--cream)`) — the ≤10% accent.
2. Rubrication + jadwal margin rules on scripture/reference marks (`.cite` underline, `.r-src` kicker via `--madder`).
3. `.cite` chip ink + `.term` dotted underline.
4. `:focus-visible` ring on cream grounds (D-A10 — 6.13:1).
5. `--icon-accent` on Page (the single accent detail in a scene icon + the 4 marker glyphs fact/remember/fard/angle).
Never: body text emphasis, quiz option fills, progress fills, decorative blocks.

**Thermal state colour (app-wide, shape-first — D-A8):** `--powder #A9BFEE` (not-yet) · `--ember
#E8502A` (progress) · `--gold #D9A441` (mastered). On cream these are **shape/border/fill-with-keyline
only** — ember 3.21:1 (border/large only, never small text), gold 1.93:1 (filled shape + `--rule`
keyline, never lone text), powder 1.58:1 (→ use hollow `--ink-40` ring instead). Shape (hollow /
half-dab / filled+check) is the primary channel on every ground.

### Orbit register — the Ring moment + the whole review session (Kiswah Black ground)

| Role | Token | Value | Usage (cited ratio on `#131013`) |
|---|---|---|---|
| Dominant (60%) | `--kiswah` | `#131013` | Orbit ground, `--go:.07` grain |
| Secondary (30%) | `--cream` / `--paper-85/.62` / `--navy` | `#F3EDE2` / `#1B2436` | body/labels (cream 16.22:1), un-inked Ring rows (`--navy`-ish faint) |
| Accent (10%) | `--gold` | `#D9A441` | 8.40:1 — earned gold thread, rosette seal, review thread progress, thermal "mastered", `--icon-accent`, `:focus-visible` ring (D-A10) |
| Thermal in-progress | `--ember` | `#E8502A` | 5.05:1 — Ring frontier dabs, review timer warmth (never red, never alarm) |

**Crimson is BANNED on Orbit** (2.65:1 — `03-UI-SPEC-ATHAR §2.1`). Reviews and the Ring moment use
**Gold** as their accent; the citation sheet (if opened from a review) is a **Page cream object** laid
over the world, so its crimson rubrication is valid there.

### Sky (night) — the du'a close only (Last Third gradient ground)

| Role | Token | Value | Usage (cited ratio on `#251D46`) |
|---|---|---|---|
| Dominant | `--lastthird` gradient | `#1C1637→#251D46→#2C2150` | du'a-close ground, `--go:.06–.09` |
| Body | `--moonmilk` | `#F4F0F7` | 13.89:1 — "Alhamdulillah — continue." Latin |
| Scripture | `--cream` / Amiri | — | 13.42:1 — the du'a in Amiri (scripture law; permitted glow) |
| Accent | `--apricot` / `--gold` | `#F0A583` / `#D9A441` | 7.76:1 / 6.95:1 — horizon warmth + focus/thread |

### Returns hero — apricot warmth (D-45)
The returns screen stays a **Page cream** ground (reward flow coherence). Sky's `--apricot` appears as
a **horizon warmth glow behind the hero** (the same decorative apricot gradient as the `--dawn` degree /
`.reg-sky-night::before` recipe), **never as text** — apricot is not an AA text colour on cream. The big
returns count is **Marcellus in `--kiswah` ink**; the week calendar (`AW.weekCal`) renders days as
lighter-ink presence dots — **never a gap, never red, never a "miss" state** (RWD-02 / D-45).

**Destructive semantic colour: NONE.** This phase has zero destructive actions (the un-loseable
promise). `--rose` is a *mercy* frame (retry), not a destructive-red; it is never used as a warning.

---

## Copywriting Contract

Tone: **warm manuscript, never game-show.** Praise is quiet and rationed; wrongness is mercy, never
punishment; scripture copy is verbatim and untouched (spliced, never retyped — D-49/D-50).

| Element | Copy |
|---|---|
| Primary CTA — opener | **"Begin, gently"** (fires `AW.touchDay()`; back hidden at opener) |
| Primary CTA — beat progression | **"Continue"** (content beats) · **"Check"** (quiz beats) · **"Show a reflection"** → then **"Continue"** (reflect beat) |
| Primary CTA — review | **"Begin the review"** (fires `AW.touchDay()`; NO back button anywhere in review) |
| Primary CTA — done handoff | **"Next: {cfg.next.label}"** link + **"Back to the path"** |
| Correct verdict (praise pool, rotate by `correct % 4`) | **"That's it." · "Beautiful." · "Exactly right." · "Masha'Allah."** — quiet, one line; body = `it.good` |
| Wrong verdict (law 8, mercy) | Title **"Nothing lost"**; body = `it.gentle` one-liner; grey ink-blot fades over the option; retry framed by 2px `--rose`. **Never** "Wrong"/"Incorrect"/red/shake/flash. |
| Reflect reveal | reveals `it.model` (+15 noor); button relabels to "Continue" |
| Reward verdict word (by stars) | **"Flawless"** (3★) · **"Beautifully done"** (2★) · **"You made it through"** (1★) — never 0★ |
| Reward stat tiles | **"Noor +{n}"** · **"Accuracy {n}%"** · **"Best run {n}×"** (marks re-chosen from shipped GLYPHS — `spark`/`star`, NOT the absent Gen-3 `HEART/TARGET/BOLT`) |
| Source line (under every ayah) | **"Translation of the meaning: The Clear Quran, Dr. Mustafa Khattab · pending review"** (Courier marginalia, `--madder`) |
| Citation pending pill | lowercase **"unverified · pending review"** — calm neutral (`--ink-62` + `--rule` hairline), never rose/alarm |
| Review timeout | **"time — it will wait at the end"** (auto-skip after 1500ms, no penalty); circle-back note: **"no noor this time, but a named answer still lights its thread"** |
| Review mastery word (by stars) | **"Legendary"** (3★, all in time) · **"Mastered"** (2★) · **"Reviewed"** (1★) |
| Du'a close (terminal moment) | the du'a in **Amiri** (verbatim, scripture law) + **"Alhamdulillah — continue."** |
| Empty / first-run state | opener uses `AW.greetMode()` → **first** (fresh greeting) / **streak** ("{N} returns" chip) / **returning** ("welcome back" copy override). No dead/blank state — content is always present. |
| Error / degraded state | **Silent sound** (missing `shared/sfx/*` = clean no-op, zero console error — D-52). **Reduced motion** = everything stills (not an error, a calm mode). There is no network/data-load error surface (device-local, content embedded at authoring time). |
| Destructive confirmation | **none** — no destructive actions exist in lesson/review flows (un-loseable promise; reflect textarea is private and never persisted; review has no back button by design, not as a data-loss guard). |

---

## Screen-Level Surface Contracts

> These are the load-bearing per-surface contracts the planner/executor/auditor consume. Every one
> uses **only** shipped primitives + `@layer screens` classes; register per screen (law 1); motion on
> the one `--ease` family, gated by both reduced-motion triggers (`AW.reducedMotion()` = OS
> `prefers-reduced-motion` OR `data-motion="reduce"`).

### S1 · Lesson page shell — **Page register** (`.reg-page`, `#F3EDE2`, `--go:.028`)

**Layout (top→bottom):** HUD marginalia row · per-beat progress dots · `#root` (current beat) · foot
(Back / Continue|Check). Max-width matches the shell column; 16px (`--sp-4`) gutters; safe-area insets.

- **HUD (marginalia, not game chrome):** `.hstat` noor + returns — `background:transparent; border:none;
  color:var(--ink-62)`, numeral in Courier (`--font-marg`), leading glyph via `AW.icon` at 18px in
  `--icon-accent` (crimson). **Mute toggle** lives here (§S6). No pill fills.
- **Per-beat progress:** a row of thermal `data-state` **dabs**, one per beat. Passed beats =
  `mastered` (filled `--gold` + `--rule` keyline + `check` glyph); current = `progress` (half-dab,
  `--ember` border); upcoming = `not-yet` (hollow ring, `--ink-40` border on cream — D-A8). Gen-3
  `stepIndex` fills left→right and **only ever increments** — Back decrements `pos` but a filled dab
  **never un-fills** (clamp `stepIndex=max(pos,0)`). A Courier counter ("3 / 6") sits beside it.
- **Opener:** `AW.greetMode()` greeting (`--fs-h1`); the journey chapter-term in **Aref Ruqaa** inside
  a Farag square (`--r-square`, `--crimson` ink) with the unit scene icon (`AW.UNIT_ICON[u1..u4]` →
  `compass/lanterns/kaaba/mosque`); optional `thought:`/`tag:` soft intro (Readex 300 ≥18px). CTA
  "Begin, gently" (crimson `.btn`) → `AW.touchDay()`. Back hidden (`pos<0`).
- **Foot:** one `.btn` primary (Continue|Check) + a quiet Back (ink `--ink-62`, hidden at opener). Clear
  button/footer separation preserved (Gen-3 v1.2 fix).
- **Motion:** each beat mounts with **settle** (`@keyframes settle`, `--dur-settle` 260ms). Press =
  the one paper-press (`translateY(1px)` + ink-deepen, `--dur-press` 140ms) on every tappable. No
  celebration primitive anywhere in the beat body (grep-gated, D-51).

### S1-beats · The 9 beat renderers (all Page ground)

| Beat | Layout & primitives | States / notes |
|---|---|---|
| **read** ×17 | Readex 400 body prose in a keyline-less column; inline `.cite`/`.term` → `AW.wire`. Marker chips (`fact`/`remember`/`fard`/`angle`) render the marker glyph in `--icon-accent` + its label (Gen-3 `AW.MLAB`: "Worth knowing"/"Worth remembering"/"The first duty"/"Another angle"). | settle on mount; Continue always enabled. |
| **frame** ×2 | a single framing statement at `--fs-h2`, centered, generous `--sp-6`; optional kicker in Courier. | contemplative; no controls but Continue. |
| **verse** ×11 | **`.scard` scripture card, `--go:0` (no grain).** `.slabel` (Courier kicker) · `.ayah` Amiri Quran ≥24px lh1.9 `lang="ar" dir="rtl"` strongest `--kiswah` ink · `.trans` translation `--fs-body --ink-85` (carries `˹ ˺`) · `.tsrc` source line (Courier `--madder`). | **Scripture law**: nothing celebratory adjacent; no dab/thread/stamp in this panel; only-permitted glow (dark grounds only — verse beats are cream, so no glow). §S2. |
| **panel** ×12 (`check`/`guard`/`pull`/`tell`) | ink-bordered card, `--keyline` separation, `--r-2`; `intro:` lead + numbered items (`n:` in Courier margin). **All 4 variants render distinctly**: `check` = default ruled card; `guard` = a left jadwal-rule emphasis (caution framing, still ink — never red); `pull` = pull-quote (larger `--fs-h2`, hanging rule); `tell` = a reveal/"here's the thing" card (Madder kicker). | paper-press; Continue. |
| **depth** ×14 | **3-Lens accordion** (§S2). `beads` icon. | opt-in, never blocks Continue. |
| **reflect** ×10 | private `<textarea>` (labelled; **never persisted, never re-rendered** — XSS-inert); "Show a reflection" reveals `it.model` (+15 noor), relabels to Continue. `dua` icon. | first tap = reveal + noor; second = advance. |
| **mc** ×16 | `.opt` option cards (§S3). Optional `quote:` "Name it" framing. | correct/wrong per §S3. |
| **tf** ×12 | `.tf` true/false pair (§S3). | selection visibility preserved (Gen-3 v1.5 fix). |
| **tile** ×4 | `.tile` word-bank / tile-builder; tapped tiles assemble the answer; `tile.solution` = subset of bank. | correct/wrong per §S3. |

### S2 · Verse beats under scripture law + the 3-Lens depth accordion

- **Verse (scripture law, binding):** as S1-beats `verse`. Ayah = Amiri Quran, strongest ink, clean
  cream (`--go:0`), translation + source beneath, `lang/dir/bidi-isolate`. **No celebration primitive,
  no grain, no glow (cream), nothing animated on the ayah.** Grep gate: no `(dab|thread|plate|rosette)`
  inside a `.ayah`/`.scripture`/`.scard` panel.
- **3-Lens depth accordion (D-45 / ENG-05):** three individually-expanding lenses, **fixed order**,
  each **shape-cued AND label-cued (never colour-only)**, opt-in, **never blocks Continue**:

  | Lens | Order | Ink token (cited on cream) | Shape/label cue |
  |---|---|---|---|
  | **Reality** | 1 | `--madder #8F4B58` (5.44:1) | a distinct lens glyph + "Reality" label + Madder rule |
  | **Revelation** | 2 | `--crimson #A32C21` (6.13:1) | distinct glyph + "Revelation" label; **scripture inside follows scripture law** (Amiri Quran ayah, `--go:0`, no celebration) |
  | **Ruling** | 3 | `--olive #6B682A` (4.95:1) | distinct glyph + "Ruling" label + Olive rule |

  Each lens header is a 44px-min tappable that expands its own body (settle); collapsing others is
  optional. The Continue control is always present and enabled regardless of accordion state.

### S3 · Quiz beats — option cards, tf, tile-builder, combo, streak

- **`.opt` / `.tf` / `.tile` rest:** `background:var(--cream); color:var(--ink); border:2px solid
  var(--rule)`, `--r-2` (tf/tile) ; Readex 400/500; left-aligned; mount on **settle**. Hover
  `border-color:var(--ink-40)`; press `translateY(1px)` + `border-color:var(--crimson)`.
- **Correct (Circle "draw"):** a **gold dot draws itself** at the option lead (Orbit `draw` micro,
  `--dur-draw` 240ms), `border-color:var(--gold)`, fill `rgba(217,164,65,.10)` wash. Numbers:
  `correct++; combo++; noorEarned += 12`. Praise pool + `it.good`. `AW.sound('correct')`.
- **Wrong (law 8, D-A12):** border stays neutral; a **grey ink-blot** dabs over the option and fades
  (`--ink-40`→transparent); a **one-line explanation** (`it.gentle`) appears beneath in `--ink-85`; the
  **retry** control is framed by a 2px `--rose` border. Title "Nothing lost". `mistakes++; combo=0`.
  **Never red, never shake, never flash, never amber.** `AW.sound('incorrect')`.
- **Combo accrual chip (combo ≥ 2, D-45):** an **accruing gold-dot chip** — `.dab` gold at small
  scale on the quiz **META surface** (the foot/result zone, NOT floating over content, NOT mid-
  scripture); pops via `stamp`/`settle`. If any count is shown it is a **Courier marginalia counter**
  ("3 in a row"), never a floating pill. `AW.sound('streak')` on accrual.
- **3-streak celebration (combo === 3, D-45):** a **quiet gold-thread flourish** (`.thread` Orbit
  `draw`) + praise copy on the Page META surface, fired once per streak (Gen-3 260ms delay). **No
  full-screen overlay, no PERFECT, no indigo.**
- **reflect** (+15) and **stars** math preserved exactly (`starsFor`: 0 mistakes → 3★, 1 → 2★, ≥2 →
  1★ — never 0; persisted best-of, never downgrades).

### S4 · Reward choreography — verdict → noor → returns → done → Ring → du'a

**A screen sequence (each screen one register, law 1; WAAPI-chained via `AW.animate(...).finished`;
stagger ≤300ms/token via 60ms `setTimeout` between reveals; every anim self-guards reduced motion).**

1. **Verdict** — Page cream. `starsFor()` stars rendered **shape-first** (gold **dabs/rosettes**:
   hollow / half / filled grammar, consistent with `data-state`) + the verdict word (`--fs-h1`) + 3
   stat tiles (Noor / Accuracy / Best run) revealed **staggered on settle**. Gen-3's
   `AW.confetti(26/14)` here is **replaced** by dab-drift + the terminal Ring (D-45). Marks from
   shipped GLYPHS (`spark`/`star`), NOT absent Gen-3 glyphs.
2. **Noor claim** — Page cream. Noor headline **counts up in Marcellus display numerals** (≥28px, law
   5). **Persistence point:** `AW.S.set('noor', AW.S.get('noor',0) + noorEarned)` fires HERE (Gen-3
   parity). Optional `cfg.grew` "What changed" box. `AW.sound('complete')`.
3. **Returns** — Page cream with **`--apricot` horizon-warmth glow** behind the hero (decorative, not
   text — cited pairing); big returns count in **Marcellus `--kiswah` ink**; day/days label;
   `AW.weekCal()` days as **lighter-ink presence dots — never a gap/red/miss** (RWD-02).
4. **Done** — Page cream. Best-of star persist (never downgrade); `cfg.recap` list; `cfg.grew`;
   handoff "Next: {label}" + "Back to the path".
5. **The Ring moment** — **Orbit ground** (`.reg-orbit`, black; register transition). 
   `AW.ringSVG({ atomsDone: preLessonAtoms + earnedAtoms, animateFrom: preLessonAtoms })` — **draws
   ONLY the newly-earned frontier** (WR-01), never replays the established ring (law 9). `animateFrom`
   MUST be captured **before** the lesson's atoms are added (Pitfall 7). Reduced motion → final inked
   state, static.
6. **Du'a close** — **Sky ground** (`.reg-sky-night`). One du'a in **Amiri** (scripture law; permitted
   glow on this dark ground) + **"Alhamdulillah — continue."** (Marcellus/Readex on `--moonmilk`).

**Grep-gated:** no celebration primitive (`dab`/`thread`/`plate`/`rosette`) on or adjacent to a
scripture (`verse`) beat; celebration fires only on these meta-progress screens (D-51).

### S5 · Review (legendary) surfaces — **Orbit register** (`.reg-orbit`, black) + Hajar Gold

- **Intro — "the circle gathers":** Orbit-dark ground; ink **dabs drift in** around the ring (Circle
  `drift` verb, `--dur-drift`/ambient `--dur-amb-drift`, staggered `animation-delay`). Title
  `--fs-h1`; `trophy`/`lamp` glyph in `--gold`. CTA "Begin the review" → `AW.touchDay()`. **No back
  button anywhere** (`awback` hidden).
- **14s soft timer (calm, not alarming):** a thin decisecond bar (`tleft = 14*10`, 100ms tick); warmth
  toward `--ember` as it drains — **never red, never a buzzer, no shake**. Gen-3 `.low` (<28%) becomes
  a quiet ember deepen, not an alarm. `--gold` focus ring on this dark ground.
- **Progress = gold thread (not a lamp path):** correct-count lights **gold-thread arcs** (`--gold`,
  `paintLamps()` → thread lit `i < correct`). Shape-first; AA gold 8.40:1 on Kiswah.
- **Timeout / circle-back states:** on `tleft<=0` → "time — it will wait at the end", options disabled,
  clock verdict, auto-skip after 1500ms (no penalty). Queue exhausted with skipped → **circle-back**:
  untimed replay, **no noor**, but a named answer still lights its thread. `phase='back'`.
- **Scoring (byte-preserved):** main-phase correct → `noorEarned += 15 + (thisInTime?5:0)` (swift
  label when in time); circle-back → thread only, no noor. `AW.sound('correct'|'incorrect')`.
- **Mastery result:** verdict word ("Legendary"/"Mastered"/"Reviewed"); stars `correct===all ?
  (allInTime?3:2) : 1` — **any single timeout permanently caps at 2★**. A **gold rosette seal**
  (`.rosette`: filled circle + inked rim + `check`, **stamp** `--dur-stamp` 150ms) seals mastery.
  `AW.S.set('noor', …)` persists here. `AW.sound('complete')`.

### S6 · Sound UI — visible mute toggle + silent-placeholder behaviour (MOT-05 / D-52)

- **`AW.sound(cue)`** (new, ~15 lines): slots `correct` / `incorrect` / `complete` / `streak`. Reads
  `awba_prefs.soundMuted`; loads `shared/sfx/{cue}.mp3` **page-relative**; missing asset / autoplay
  block → **clean no-op, zero console error** (silent v1). Assets are an owner decision (calm,
  dignified sound EFFECTS not music); they drop into `shared/sfx/` later with **zero code change**.
- **Mute toggle placement:** in the lesson **and** review HUD marginalia row, a **44px** icon button
  (a shipped glyph, `--icon-accent`), `aria-pressed`, persists via `awba_prefs.soundMuted` boot-stamp.
  Visible on every lesson/review screen.
- **Cue peaks land on meta-progress screens, NEVER the ayah/scripture moment** (MOT-05). `complete`
  peaks at reward/mastery; `streak` at the 3-streak flourish; nothing plays on a verse beat or the
  du'a (the du'a close is silent-reverent).

---

## Motion & Reduced-Motion (binding, all surfaces)

- **One easing family:** `--ease: cubic-bezier(0.23,1,0.32,1)`. No other curve exists.
- **One verb per register:** Page = **settle** (`--dur-settle` 260ms) · Orbit = **draw** (`--dur-draw`
  240ms) · Circle = **drift** (`--dur-drift` 300ms) · Sky = **breathe** (ambient `--dur-amb`) ·
  Festival = **stamp** (`--dur-stamp` 150ms, used for the rosette seal + combo chip). **Press = the one
  paper-press everywhere** (`translateY(1px)` + ink-deepen, `--dur-press` 140ms).
- **Reward stagger:** WAAPI `.finished` chain; 60ms `setTimeout` between staggered reveals; ≤300ms per
  token (law 9). All via `AW.animate` (auto-collapses to 1ms under reduced motion).
- **Both reduced-motion triggers** (`AW.reducedMotion()` = OS `prefers-reduced-motion` OR
  `data-motion="reduce"`): every JS animation collapses; the Ring renders final-inked static; dabs rest
  settled-in-place; the Sky du'a halo stops breathing; **the centre never animates** regardless (law 9).
- **44px** minimum on every tappable; **AA at real rendered sizes** per the cited `§2.1` tables.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|---|---|---|
| none (vanilla, zero-build, zero-dependency) | none | **not applicable** — no shadcn, no npm, no external component registry (CLAUDE.md hard constraint; RESEARCH.md "Package Legitimacy Audit: N/A"). All code is in-repo `AW.*` primitives + Node core dev tooling. |

No third-party registry is declared; the registry vetting gate does not run.

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
