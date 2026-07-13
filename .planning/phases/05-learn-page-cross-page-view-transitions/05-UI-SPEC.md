---
phase: 5
slug: learn-page-cross-page-view-transitions
status: approved
reviewed_at: 2026-07-13 (gsd-ui-checker — APPROVED, 4 non-blocking FLAGs recorded in checker return)
shadcn_initialized: false
preset: none
created: 2026-07-13
authority: .planning/phases/03-components-icon-kit-motion-language/03-UI-SPEC-ATHAR.md  (the SYSTEM contract — this doc APPLIES it per-screen, never re-derives or contradicts it)
canon: .planning/ATHAR-SYSTEM.md  (the Gate-2 lock; "a day in Awba" moment 1 IS this page)
binding_translation: 05-CONTEXT.md D-53..D-61 (Gen-3 → Athar; the binding reading of REQUIREMENTS' retired vocabulary)
precedent: .planning/phases/04-lesson-review-engine-port-detail-layer/04-UI-SPEC.md  (the screen-level rigor + S-numbering format this doc mirrors)
---

# Phase 5 — UI Design Contract · Learn Page & Cross-Page View Transitions

> **Scope of THIS document.** The Athar design **system** is fully locked (Gate 2, §9 human gate
> APPROVED 2026-07-13; extended screen-by-screen through Phase 4, checker-passed 6/6). This doc does
> not re-open tokens, faces, registers, Ring, or Sky — it is the **screen-level application** for the
> one net-new surface `learn.html` (the Orbit home) + the cross-document View-Transitions opt-in that
> all 20 pages inherit. For every Phase-5 surface (page shell + HUD, Ring hero, continue card,
> streak/constellation, daily ayah, unit headers, the winding path + node grammar, the node popup,
> the shared sheet family, the tab bar, the chest→circuit-plate claim moment, the VT morph) it fixes
> layout, register, primitive usage, states, copy, and motion using **only** shipped tokens/
> primitives. **Zero new tokens, zero new faces, zero new hex, zero new `@layer` order.** Every colour
> pairing is cited to `03-UI-SPEC-ATHAR §2.1` (AA at real rendered sizes) — none is invented here.
>
> **Binding law stack (precedence order):** `ATHAR-SYSTEM.md` (canon) → `03-UI-SPEC-ATHAR.md` (system
> contract) → `05-CONTEXT.md` D-53..D-61 (this phase's locked decisions). On any conflict the higher
> wins; flag, never silently diverge.
>
> **Retired elements — NEVER reintroduce (Gate-2 lock; RESEARCH anti-patterns):** confetti · PERFECT
> overlay · combo chip (floating pill) · companion/lantern **mascot** on `active` nodes · amber mercy ·
> unit accent colours (`u.color` blue/purple/teal/gold / `data-unit` colour theming) · gummy 5px
> indigo press · treasure-box `IC_CHEST` art · `.gold-bg` · Google Fonts CDN · Poppins · `AW.confetti` ·
> the Gen-3 `IC_STAR/IC_TROPHY/IC_LOCK/IC_CHEST` / `AW.LANTERN/STARG/STARE/FLAME/SPARK` names
> (superseded by `AW.GLYPHS`/`AW.icon`). **Crimson is BANNED on the Orbit ground** (2.65:1 — §2.1);
> gold/ember/cream/navy/powder only. A second macro map is forbidden — the Ring is THE map; the path
> is the navigable index (never a competing progress bar or second ring).
>
> **Immutable Athar laws bound to every surface below (the 10-law constitution):** 1 one register per
> screen · 2 aniconism absolute · 3 scripture law (Amiri only, strongest ink, the only glow, never on
> texture, nothing celebratory adjacent) · 4 one workhorse (Readex Pro) · 5 display faces rationed ·
> 6 one grain · 7 accent ≤10% / ≤6 colour tokens per screen · 8 wrongness is a strike not a colour ·
> 9 the centre never animates (one verb per register, one easing, UI ≤300ms) · 10 artefacts private
> by default (date + seed maker's mark).

---

## 0 · Design System

| Property | Value |
|---|---|
| Tool | **none** — vanilla HTML/CSS/JS, zero build, `file://`-openable (CLAUDE.md hard constraint). shadcn gate **N/A** (not a React/Next/Vite stack; no `components.json`/`tailwind.config.*` present — confirmed this session). |
| Preset | not applicable |
| Component library | **none as a package** — the in-repo `AW.*` primitive library (`shared/awba-engine.js`) is consumed as-is. Phase 5 authors the net-new `learn.html` at repo root, appends **new content only** to the existing `@layer screens` block (`shared/awba-engine.css:923`, the `@layer tokens, base, components, screens, motion;` order line at :16 is **immutable**), and adds four small engine seams (see § Engine Seams). |
| Icon library | `AW.KIT` (20 scenes) + `AW.GLYPHS` (13 glyphs), one-colour `currentColor` + `var(--icon-accent)` model — no runtime recolour. Learn-page glyphs used: `star`, `trophy`, `lock`, `spark`, `flame`, `check`, `chest` (+ `AW.UNIT_ICON` scenes `compass`/`lanterns`/`kaaba`/`mosque`). The Gen-3 `IC_*`/`AW.LANTERN`/`AW.STARG` names are superseded — never reintroduce them (§ State of the Art). |
| Font | **Readex Pro** (sole workhorse, both scripts) · **Amiri Quran** (the daily ayah) · **Marcellus** (Orbit display + stat numerals ≥28px) · **Aref Ruqaa** (unit chapter-terms ≥40px, Farag squares — see § Ruling R-6 on sourcing) · **Courier Prime** (marginalia: streak line, continue-card kicker, dates, the Ibrahim line). Rakkas is exercised only inside the Festival chest interstitial (S5). Inter is the silent `˹ ˺` glyph-fallback only. All self-hosted, zero CDN. |
| Registry safety | **not applicable** — no external component registry (see § Registry Safety). |

**What is empty and awaits this phase:** `learn.html` (does **not** exist — Phase 5 creates it at repo
root beside `lessons/` and `reviews/`); new content inside `@layer screens` for `.path`/`.node`/
`.npop`/the unit-header card/the plate node/the constellation/the daily-ayah card (none of these
classes exist yet — verified); the top-level `@view-transition` opt-in high in `awba-engine.css`; the
reduced-motion VT kill block inside `@layer motion`.

### Engine Seams (added this phase — "one constant, one place"; DOM-free, unit-testable)

| Seam | Purpose | Note |
|---|---|---|
| `AW.muteBtnHtml` / `AW.bindMuteBtn` (exports) | expose the shipped module-private 44px mute toggle so `learn.html`'s inline script can call it (Pitfall 6). | two one-line exports; they already close over `SPEAKER_ON/OFF` + `AW.prefs`. Do **not** add a speaker glyph to `AW.GLYPHS` (`components.test.js` freezes `glyphCount===13`). |
| `NODE_ATOMS` map + `AW.atomsDone(progress)` | per-node taught-atom counts (Ruling R-1); `atomsDone` = Σ `NODE_ATOMS[id]` over starred nodes. Feeds every `AW.ringSVG` caller + `AW.skyDawn` + each node's seed-row dot count. | replaces the Phase-4 `ATOMS_PER_NODE = 3` proxy (js:1687–1688 lesson runner + js:2084 reward). |
| `AW.dailyIndex(date, poolLen)` | pure day-of-**year** index (LRN-05 fix); local date parts only (D-16 — never `toISOString`). | fixes Gen-3's `getDate() % 7` monthly-repeat bug. |
| `render-smoke.mjs` `findPages()` extend | include root `learn.html` (register-root regex already matches `reg-orbit`; only the file list changes). | Pitfall 7. |

---

## Spacing Scale

**Locked system scale (D-A1 — retain the Phase-1 4px scale verbatim; NOT re-derived here).** The
checker's "multiples of 4 only" heuristic yields to the Gate-2-locked scale, which carries documented
sub-4/off-8 manuscript-rhythm exceptions. Cite, do not compress.

| Token | Value | Usage in Phase 5 |
|---|---|---|
| `--sp-2` | **2px** | hairline exception — card keyline (`--keyline`), plate/Farag-square frame rule, node ring border |
| `--sp-1` | 4px | seed-row dot gaps, inline chip padding, constellation dot gaps |
| `--sp-2s` | 8px | node label gap, HUD stat inner |
| `--sp-3` | 12px | popup inner padding, continue-card inner, sheet-row inner |
| `--sp-4` | 16px | page gutters, card padding, `.btn` padding, node-to-node minimum |
| `--sp-5` | 20px | daily-ayah card inner rhythm, unit-header inner |
| `--sp-6` | 24px | section padding, Ring hero framing, unit-section separation |
| `--sp-8` | 32px | Ring hero top/bottom breathing, path-section top gutter |
| `--sp-12` | 48px | major composition breaks (Ring → continue → ayah → path) |
| `--sp-16` | 64px | Festival interstitial framing (S5) |

**Exceptions (locked, do not "correct"):** `--sp-2` (2px hairline) · `--sp-3` (12px) and `--sp-5`
(20px) manuscript steps · **44px** minimum touch target — every node, tab, HUD stat, mute toggle,
sheet-row, popup CTA, `.sheet-x` — sits outside the scale · `env(safe-area-inset-*)` at the shell
layer (top HUD + bottom tab bar must clear the notch/home-indicator).

---

## Typography

**Phase-5-relevant roles from the locked `03-UI-SPEC-ATHAR §2.2` table (not re-derived).** Readex Pro
is the ONE workhorse; weights used: **400 (body) + 600 (emphasis)**, 500 for card headings, 300 only
≥18px soft intros. Display numerals are Marcellus; the daily ayah is Amiri Quran; every marginalia
voice (streak line, continue kicker, dates, counters, the Ibrahim line) is Courier. This exceeds the
checker's "3-4 sizes / 2 weights" greenfield heuristic because the manuscript type system is locked at
Gate 2.

| Role | Token | Face / weight | Size | LH | Where in Phase 5 |
|---|---|---|---|---|---|
| Body | `--fs-body` | Readex Pro 400 | 16px | 1.6 | node labels, unit desc, popup subtitle, sheet notes, coming-soon lines, the daily-ayah **translation** (carries `˹ ˺`) |
| UI / meta | `--fs-ui` | Readex Pro 400/500 | 14px | 1.45 | continue-card next-node label, sheet-row labels, tab labels |
| Card heading | `--fs-h2` | Readex Pro 500/600 | 18→20px (clamp) | 1.3 | unit-header English title, popup lesson title, sheet hero label |
| Screen title | `--fs-h1` | Readex Pro 600 | 22→26px (clamp) | 1.18 | (used sparingly — the Ring + ayah carry the hero weight, not a text headline) |
| Display / stat numerals | `--fs-display` | **Marcellus 400** | 28→46px (clamp) | 1.08 | streak-sheet returns count, noor-sheet count (≥28px floor, law 5) |
| Chapter term (Ar) | `--fs-term` | **Aref Ruqaa 400/700** | 40→48px | 1.0 | unit-header + continue-card chapter-term in a Farag square (`--r-square`, `--crimson` ink on cream) — **only when a verified Arabic term is supplied; see Ruling R-6** |
| Marginalia | `--fs-marg` | **Courier Prime 400** | 11–12px | 1.4 | streak strip ("N returns · your streak never breaks"), continue-card kicker ("Continue"), the daily-ayah source/ref line, node star-count, the Ibrahim 14:24 line, the plate maker's-mark (date + seed) |
| **Ayah (verbatim)** | `--fs-ayah` | **Amiri Quran 400** | 24→27px (clamp) | **1.9** | the daily ayah (S2) + its cite sheet — ≥1.5× the 16px translation beneath; ﴾…﴿; full tashkeel; strongest ink; the only glow (dark ground → permitted) |
| Festival signage | `--fs-festival` | **Rakkas 400** | 28→34px (clamp) | 1.2 | the circuit-plate label inside the S5 interstitial ONLY; never on the learn screen; never scripture |

**Scripture law (law 3 — binding on the daily ayah + its cite sheet):** Amiri Quran only, never
Readex/never a display face; `lang="ar" dir="rtl"`, `unicode-bidi:isolate`, `letter-spacing:0`;
strongest ink (`--cream`/`--moonmilk` on the Orbit dark ground, full opacity, no ramp); the ONLY
permitted glow (`text-shadow:0 0 24px rgba(244,240,247,.30)`, dark grounds only); never on grain
(`--go:0` on the ayah wrapper); transliteration/translation beneath; **nothing celebratory in the same
panel** (grep-gated). Rationing (law 5): Aref Ruqaa ≥40px and Rakkas ≥28px **never share a screen** —
the learn screen uses Aref Ruqaa (unit terms), so Rakkas appears only inside the S5 interstitial (a
separate Festival threshold, not the learn screen).

---

## Color

**60 / 30 / 10 split, Orbit-register-scoped. The learn page is ONE `.reg-orbit` screen (law 1). Every
pairing cited to `03-UI-SPEC-ATHAR §2.1` (AA at real rendered sizes). No pairing invented here.** A
working screen sees ≤6 colour tokens (law 7); expressive accent ≤10% (law 7). **Crimson is BANNED on
the Orbit ground** (2.65:1) — its only valid appearance is inside a **cream Page object** laid over the
world (the node popup, the sheets, the cream Farag square), where crimson rubrication is a Page ink.

### Orbit register — the learn ground (Kiswah Black `#131013`)

| Role | Token | Value | Usage (cited ratio on `#131013`) |
|---|---|---|---|
| Dominant (60%) | `--kiswah` | `#131013` | the whole page ground, `--go:.07` grain, `data-sky` tint, `--dawn` horizon warmth |
| Secondary (30%) | `--cream` / `--paper-85/.62/.45` / `--navy` | `#F3EDE2` / `#1B2436` | body + labels (cream 16.22:1), HUD/streak marginalia (`--paper-62`), un-inked path/Ring rows (`--navy`-ish faint); the **continue card is a `--navy` panel** (cream text on navy reads ≥13:1) |
| Accent (10%) | `--gold` | `#D9A441` | 8.40:1 — the earned path re-ink, review rosette seals, done-node fill, mastered thermal, `--icon-accent`, active `.tab` cue, `:focus-visible` ring (D-A10), the streak-constellation lit dots |
| Thermal in-progress | `--ember` | `#E8502A` | 5.05:1 — `available`/`active` node half-dab + its quiet breathe, Ring frontier dabs (never red, never alarm) |
| Thermal not-yet | `--powder` | `#A9BFEE` | 10.24:1 — `locked` node hollow-ring border (powder is home on dark), un-lit constellation dots |

**Reserved-for list — accent (`--gold`) on Orbit is used for, and ONLY for:** the earned path thread +
the done-node fill/check + review-node rosette seals + the active `.tab` cue + the `--icon-accent`
detail in HUD/unit-header scene icons + the `:focus-visible` ring + the streak-constellation lit dots.
Never: body text, node labels, decorative fills, or a second progress bar. **Ember** is reserved for
the single thermal "in progress / available" node treatment (+ the Ring frontier the generator draws).
The daily ayah takes the **reverence budget** — Moonmilk/cream strongest ink + the one permitted glow;
nothing else on the screen glows or competes with it.

### Page objects over the world (cream `#F3EDE2`) — popup, sheets, cream Farag square

The node popup and every bottom sheet are **Page cream objects** (register-as-component exemption,
mounted on `document.body`, **not** inside `.reg-orbit` — Ruling R-4). On their cream ground the Page
palette applies, cited to §2.1 on `#F3EDE2`:

| Role | Token | Value | Usage (cited ratio on `#F3EDE2`) |
|---|---|---|---|
| Body ink | `--kiswah` + ramps | `#131013` / `--ink-85/.62/.40` / `--rule` | popup/sheet body (16.22:1), captions (`--ink-62`), keylines (`--rule`) |
| Accent (10%) | `--crimson` | `#A32C21` | 6.13:1 — popup **START/REVIEW/LEGENDARY** `.btn` fill (`color:var(--cream)`), the cream Farag-square chapter-term ink, `:focus-visible` ring on cream (D-A10) |
| Secondary ink | `--madder` | `#8F4B58` | 5.44:1 — seed-row dots at rest, the daily-ayah source line in the cite sheet, popup marginalia |
| Verified pill | `--olive` | `#6B682A` | 4.95:1 — (if a grade pill is shown in the daily-ayah cite sheet; the daily verses are Qur'an → **no grade pill**, only the pending pill) |

### Sky tint + `--dawn` (ambient tokens on the Orbit ground — never a second ground, law 1)

`data-sky` (prayer-clock tint, §3.2/§7) and `--dawn` (course-progress horizon apricot, §7.3) are the
shipped ambient overlays. Both are **tokens on the Orbit ground**, static (a tint is information, not
motion — survives reduced motion). `--dawn` is driven by `AW.skyDawn(atomsDone)` (Ruling R-1 re-wires
its denominator to 61); it is **ambient, never the metric** — the Ring is the metric. Apricot
(`--apricot #F0A583`, 9.37:1) is decorative horizon warmth only, **never text**.

**Destructive semantic colour: NONE.** The learn page has zero destructive actions (the un-loseable
promise; the chest claim only ever *adds* +25 noor, idempotently). `--rose` is not used on this screen
(no wrong-answer surface here). Locked-node feedback is gentle microcopy, never a red/alarm/shake
(law 8 spirit; D-54).

---

## Copywriting Contract

Tone: **warm, quiet, never gamified-loud.** Praise is rationed; scripture copy is verbatim and
untouched (spliced, never retyped — content integrity). Gen-3 node labels + sheet copy + CTA labels
port **verbatim** (locked strings below). The loud Gen-3 "NEVER BREAKS" all-caps band is re-voiced to a
quiet Courier line.

| Element | Copy |
|---|---|
| HUD (marginalia) | course chip (mini Farag square, tap → course switcher) · **returns** count (flame glyph, tap → streak sheet) · **noor** count (spark glyph, tap → noor sheet) · the 44px mute toggle. No labels beyond the numerals — marginalia, not chrome. |
| Streak strip (re-voiced, under the Ring) | Courier: **"{N} returns · your streak never breaks"** (grammar: "returns" always plural in the strip; the sheet uses day/days). The all-caps "NEVER BREAKS" band is **retired**. |
| Continue card | Courier kicker **"Continue"** · **"Circuit {n} · {chapter-term}"** (chapter-term = the verified Aref-Ruqaa Arabic term when supplied, else the English unit title — Ruling R-6) · the next available node's label (`--fs-ui`) · a **"Continue the path"** `.btn` (gold-ghost on dark) that navigates to the next available node (checker Dimension-1 recommendation adopted: the button carries a noun, the kicker stays "Continue"). |
| Daily-ayah kicker | **"A little light for today · {ref}"** (Courier + spark glyph — verbatim Gen-3). |
| Daily-ayah source line | **"The Clear Quran · Dr. Mustafa Khattab · pending review"** (Courier `--paper-62` — verbatim Gen-3). |
| Daily-ayah pending pill | lowercase **"unverified · pending review"** (calm neutral — `--paper-62` + `--edge` hairline; never rose/alarm). |
| Node labels (VERBATIM, Gen-3 :120-150) | U1: "What sound belief is" · "Why belief matters" · "Where belief comes from" · "How we keep it sound" · "Legendary review" · **"A gift"**. U2: "The causes within you" · "The pulls from outside" · "Protecting yourself I" · "Protecting yourself II" · "Legendary review" · **"A gift"**. U3: "What Tawhid is" · "Worth more than everything" · "One religion, one thread" · "Legendary review" · **"A gift"**. U4: "The two pillars" · "The Lord of everything" · "The deniers' twist" · "How we know He is there" · "The final review" · **"The course gift"**. |
| Unit-header titles + descs (VERBATIM) | U1 "The Foundation" / "What belief is, and how to hold it" · U2 "The Drift" / "How belief slips, and how to guard it" · U3 "The Heart of It: Tawhid" / "The one word everything else serves" · U4 "The Pillars" / "Standing it up, and knowing it is true". The Gen-3 **"SECTION 1 · UNIT n"** eyebrow is retired (no unit colour-coding / no SaaS section chrome). |
| Node popup — lesson (not begun) | title = node label; subtitle **"5–8 minutes · not yet begun"**; CTA **"START · earn noor"** (crimson `.btn`). |
| Node popup — lesson (done) | subtitle = the star row (seed-row + stars); CTA **"REVIEW · improve your stars"**. |
| Node popup — review (not begun) | subtitle **"A gold, timed mastery run. Nothing can be lost."**; CTA **"START"** (crimson `.btn`; the node's gold rosette frame carries the "legendary" signal). |
| Node popup — review (done) | subtitle = the star row; CTA **"LEGENDARY AGAIN"**. |
| Node popup — locked (gentle "not yet") | subtitle **"Not yet — finish what comes before."** microcopy; **no CTA**; never a buzzer/shake/red (D-54). |
| Chest popup — the gift, at rest (available) | title **"A gift of light"**; body **"+25 noor, for finishing the unit. It is yours to keep."** (contents implied before tap — a sure gift, no gambling). |
| Chest popup — already claimed (done) | title **"A gift of light"**; body **"Already opened. The light stayed with you."** |
| Streak sheet | hero = returns count (Marcellus) + **"day you came back"** (N=1) / **"days you came back"** (N≠1); `AW.weekCal()` week row; note **"This number can never break and never reset. Every return adds to it, however long the gap. That is the point of this place."** (verbatim Gen-3). |
| Noor sheet | hero = noor count (Marcellus, gold-filled numeral) + **"noor gathered"**; note **"Light you collect as you learn. It is never spent against you, never dangled, and it never runs out."** (verbatim Gen-3). |
| Course switcher (LRN-06) | **"Aqeedah · Level 1"** — **ACTIVE**; **"Fiqh · Level 1"** — COMING SOON; **"Seerah"** — COMING SOON; **"Qur'an"** — COMING SOON (verbatim Gen-3; coming-soon rows are quiet, not disabled-dead). |
| Tab bar (LRN-07) | **Learn** (active) · **Practice** · **Returns** · **Profile** · **More**. Every inactive tab opens a designed coming-soon sheet — never a dead tap. **Returns → the streak sheet** (one implementation). |
| Coming-soon sheet body (Practice/Profile/More) | a scene icon + one calm line, e.g. **"Practice is on its way. For now, keep walking the path."** — warm, never "locked"/"upgrade"/"unavailable". |
| Ibrahim 14:24 line (bottom epigraph) | a Courier English translation-of-meaning fragment — the "good word / good tree" line (Ibrahim 14:24) — the orchard's reason for existing, beneath the path, above the tab bar. **Text spliced verbatim from a verified source (Clear Quran Ibrahim 14:24), never generated** (Ruling R-7). The Gen-3 "۞ The foundation, complete. Fiqh comes next. ۞" finish line is **retired** (the "Fiqh next" idea now lives in the course-switcher coming-soon row). |
| First-run / empty state | fresh install (no stars, no returns): the HUD shows 0 noor / 0 returns; the continue card points at `u1m1` ("Circuit 1 · The Foundation" → "What sound belief is"); the Ring is all-faint (atomsDone 0); the streak strip reads **"0 returns · your streak never breaks"**; the constellation is all un-lit powder dots. **No dead/blank state — the path is always fully present, the first node always available.** |
| Error / degraded state | **Silent sound** (missing `shared/sfx/*` = clean no-op, zero console error — D-52). **Reduced motion** = everything stills (a calm mode, not an error). **View-Transitions unsupported / `file://`** = pages navigate normally (progressive enhancement, no fallback code, no error — Pitfall 2). No network/data-load error surface (device-local, content embedded at authoring time). |
| Destructive confirmation | **none** — no destructive actions exist on this screen. The chest claim is write-once additive; there is nothing to confirm and nothing to lose. |

---

## Screen-Level Surface Contracts

> Load-bearing per-surface contracts for planner/executor/auditor. Every one uses **only** shipped
> primitives + new `@layer screens` classes; ONE register per screen (law 1 — the whole learn page is
> `.reg-orbit`; cream popups/sheets are Page objects mounted on `body`, the S5 Festival interstitial is
> a separate threshold overlay); motion on the one `--ease` family, gated by both reduced-motion
> triggers (`AW.reducedMotion()` = OS `prefers-reduced-motion` OR `data-motion="reduce"`).

### S1 · Page shell + HUD marginalia + Ring hero + continue card + streak/constellation strip — **Orbit register** (`.reg-orbit`, `#131013`, `--go:.07`)

**Composition (top→bottom, per ATHAR "day in Awba" moment 1):** HUD marginalia → **Ring hero** → streak
strip + constellation → **continue card** → daily ayah (S2) → the winding path, 4 unit sections (S3) →
Ibrahim 14:24 line (S3) → tab bar (S4). Max-width matches the shell column; `--sp-4` gutters; safe-area
insets top (HUD) and bottom (tab bar). The `data-sky` attribute is stamped on the `.reg-orbit` shell at
boot (shipped §3.2 painter) + `--dawn` on `<html>` from `AW.skyDawn(AW.atomsDone(state))`.

- **HUD (marginalia, not game chrome):** a transparent row (`.ls-hud` pattern — reuse, do not
  re-author). Left: the **course chip** — a mini cream Farag square (`--r-square`, `--sp-2` `--rule`
  frame) holding the active-course scene icon; 44px tap → course switcher (S4). Right cluster: **returns**
  `.hstat` (`AW.icon('flame')` in `--icon-accent` gold + count in Courier, `--paper-62`; tap → streak
  sheet), **noor** `.hstat` (`AW.icon('spark')` + count; tap → noor sheet), the **44px mute toggle**
  (`AW.muteBtnHtml()` + `AW.bindMuteBtn`; `aria-pressed` + swapped `aria-label`). No pill fills — the
  shipped `.reg-orbit .hstat { color: var(--paper-62) }` override (css:767) already handles the dark
  ground. **Pitfall 4 corollary:** the HUD is fine on Orbit because `.hstat` is transparent-marginalia,
  not the crimson `.tab.active`.
- **Ring hero (THE macro map — STATIC on load, law 9):** `AW.ringSVG({ atomsDone: AW.atomsDone(state),
  size: 300 })` — **omit `animateFrom`** so the established ring renders fully static (no replay; the
  draw belongs to lesson-complete only, on the reward page, never here). Centred, `--sp-8` breathing
  above/below. The Ring is the only element at this size; the path below never competes (no second ring,
  no big progress bar). Reduced motion: already static (no change).
- **Streak strip + constellation (re-voiced from the Gen-3 band):** a quiet strip directly under the
  Ring. Courier line **"{returns} returns · your streak never breaks"** (`--paper-62`, `--fs-marg`) +
  a **small constellation** of return-day dots — `AW.weekCal()` mapped to a row of small circular dots
  (`--r-round`): `on` days = lit `--gold` (8.40:1); off days = un-lit `--powder`/`--paper-45` (never a
  gap, never red, never a "miss" — RWD-02 mercy). This is Sky's streak-as-constellation rendered as
  **tokens on the Orbit ground** (law 1 — no second ground). The whole strip taps → streak sheet.
- **Continue card (one navy panel, pointing at the next available node):** a `--navy #1B2436` panel
  (cream text, ≥13:1; `--r-3`, `--edge-top` light-edge depth — never a drop shadow on dark). Courier
  kicker "Continue"; **"Circuit {n} · {chapter-term}"** where `{n}` = the unit number of the next
  available node and `{chapter-term}` sits in its own **cream Farag square** (Ruling R-6); the next
  node's label in `--fs-ui`; a gold-ghost `.btn` ("Continue the path" — `background:transparent; color:var(--gold);
  box-shadow:var(--edge-line)`, css:678) that navigates to the next available node's href. When the
  course is complete (no available lesson), the card points at the final review or reads a quiet
  "You've walked the whole path" (Courier) — no celebratory primitive here (celebration is Festival's,
  S5).
- **Motion:** the Ring is static (law 9). The HUD/streak/continue card mount with a quiet **settle**
  fade (`--dur-settle` 260ms) — one pass on load, no loop. Press = the one paper-press
  (`translateY(1px)` + ink-deepen, `--dur-press` 140ms) on every tappable. **No celebration primitive
  anywhere in S1** (grep-gated: no `dab`/`thread`/`plate`/`rosette` in the HUD/Ring-hero/continue
  region).

### S2 · Daily ayah card — scripture law on the dark ground (LRN-05 / D-59)

The **only scripture on this screen** — it takes the reverence budget; everything else stays
marginalia-quiet. The 7-verse `DAILY` pool is **spliced byte-verbatim** from Gen-3 learn.html:153-160
(the ˹ ˺ brackets intact; splice, never retype). Rotation fixed via `AW.dailyIndex(new Date(),
DAILY.length)` (day-of-year, local — no monthly-repeat bug).

- **Layout:** a clean card on the Orbit ground with **`--go:0` (no grain over scripture)** and no
  `.grain` pseudo-element. Kicker (Courier + spark glyph): **"A little light for today · {ref}"**. The
  ayah in **`.ayah` Amiri Quran** ≥24px, lh 1.9, `lang="ar" dir="rtl"`, `unicode-bidi:isolate` —
  **strongest ink** = `--cream`/`--moonmilk` (16.22:1 / 16.79:1 on Kiswah), full opacity. The **one
  permitted glow** applies (dark ground): `text-shadow: 0 0 24px rgba(244,240,247,.30)`. Translation
  beneath in `--fs-body --paper-85` (carries `˹ ˺` via the Inter fallback). Source line
  ("The Clear Quran · Dr. Mustafa Khattab · pending review") + the "unverified · pending review" pill
  in Courier `--paper-62`.
- **Reveal:** a quiet **fade-in** (opacity, ≤300ms, one pass) — reverent, not celebratory. **Nothing
  celebratory adjacent** — no dab/thread/stamp/rosette anywhere in or beside this card (grep-gated).
  **Never** carries a `view-transition-name` (D-58 — scripture never morphs).
- **Tap → full cite sheet:** opens `AW.sheet` rendering the citation face-split (the shipped `.r-src`
  kicker / `.r-ar.ayah` Amiri Quran strongest ink on clean cream / `.r-mean` translation / `.r-ref`
  provenance / `.r-pill` pending) for the day's verse — a **Page cream object** over the world, so
  scripture there renders under Page rubrication. **No grade pill** (the DAILY pool is Qur'an, not
  hadith — only the pending pill).

### S3 · Unit headers + the winding path + node grammar + the Ibrahim line (LRN-01/02/04, CNT-03)

**Unit headers (identity via chapter-term + icon — NO unit colour-coding, D-53):** one header per unit,
a **cream Farag-square-fronted card** (`--r-square` on the term square; the card itself `--r-3`,
`--edge-top`). Contents: the unit **scene icon** via `AW.UNIT_ICON` (`u1 compass` / `u2 lanterns` /
`u3 kaaba` / `u4 mosque`, `--icon-accent` gold on dark); the **chapter-term** in the cream Farag square
(Aref Ruqaa ≥40px, `--crimson` ink — Ruling R-6); the English title (`--fs-h2`) + desc (`--fs-body
--paper-62`). The Gen-3 `u.color` gradient background + "SECTION 1 · UNIT n" eyebrow are **retired**.

**The winding path (LRN-04 — a hand-inked journey, not Duolingo circles; Claude's discretion on exact
geometry, MEDIUM confidence):**

- A relative-positioned `.path` container per unit section. **Node buttons** are real DOM `<button>`s
  laid out with alternating horizontal offsets that read as a **continuous winding journey** on the
  black ground — NOT alternating identical circles re-skinned. Real buttons = keyboard-focusable
  (Phase-6-ready) and `getBoundingClientRect`-anchorable for popups.
- An absolutely-positioned, `pointer-events:none` inline `<svg>` overlay draws **one continuous thread
  `<path>`** connecting node centres (a single ink thread walking the layout). The **earned portion
  re-inks gold** via the shipped `.thread` class (`stroke:var(--gold)` + `ink-draw` keyframe over
  `stroke-dashoffset`) — the earned fraction = `earnedLen/totalLen`. **The earned
  gold thread is ALWAYS STATIC wherever it is visible** (law 9 — established ink never re-draws; the
  celebratory draw moment is the RING on the reward page, a separate element — no surface ever replays
  the path thread). The ROADMAP's "path animates as units complete" criterion is satisfied by the node
  entrance stagger + thermal `data-state` flips (settle verb) reflecting newly-earned states on the next
  visit, not by a thread re-draw. (Corrected per plan-checker W8 — the prior "fires on the reward page"
  claim had no realizing task anywhere.) Recompute the thread `d` from node centres **after layout** (on `load` + a `resize`/
  `ResizeObserver` handler) so the line follows the nodes at any width, 320→desktop.

**Node grammar (thermal, shape-first, ink-drawn — D-54; consume the shipped `data-state` shapes, css:857-875):**

| State (`AW.deriveNodeState`) | `data-state` | Node treatment | Copy/detail |
|---|---|---|---|
| **locked** (lesson/review) | `not-yet` | hollow ring, border `--powder` (powder is home on dark, 10.24:1) + `AW.icon('lock')` @ `--paper-45`. **No breathe.** | tap → gentle "not yet" popup (S4), never a buzzer/shake/red (D-54). |
| **active** (the next unlockable, "next") | `progress` | ember **half-dab** (`--ember` 5.05:1) + a **quiet breathe** — the **ONLY ambient on the path** (`--dur-amb`, reduced-motion stills it). The continue card (S1) points here. **No mascot** (aniconism — the Gen-3 `.mascot` lantern is retired). | tap → START popup. |
| **available** (chest only) | `progress` | the **plate-framed gift node** (see below). | tap → claim → S5 interstitial. |
| **done** (lesson) | `mastered` | **filled `--gold` dab + `--rule`-equivalent keyline + `check` glyph** + the star count in Courier beneath (`AW.state().stars[id]` 1–3) + the **plant stamp** (Ruling R-3). | tap → REVIEW popup. |
| **done** (review) | `mastered` | a **gold `.rosette` seal** (filled circle + inked rim + `check`) — reviews are rarer/elevated. | tap → LEGENDARY AGAIN popup. |
| **review node (any state)** | — | **gold rosette-framed** (`.rosette` frame; `trophy` glyph when not-yet). | the "legendary" identity is the rosette, never crimson (banned on Orbit). |
| **chest node (rest)** | — | **plate-framed gift node** — a folk keyline frame (Festival plate token, at rest on the Orbit ground) + `AW.icon('chest')` (re-inked: `currentColor` + latch `--gold`, per §5) + label "A gift"/"The course gift". Gen-3's white/amber `IC_CHEST` treasure-box art is **retired**. | tap when `available` → S5 claim; when `done` → "already opened" popup; when `locked` → not-yet popup. |

**Node-state derivation (CNT-03 — extend, don't fork):** call the shipped `AW.deriveNodeState(flat,
AW.state())` over the UNITS flat map ported verbatim from Gen-3 (order:
`u1m1→u1m2→u1m3→u1m4→u1r→u1c → u2m1→u2m2→u2m3→u2m3b→u2r→u2c → u3m1→u3m2→u3m3→u3r→u3c →
u4m1→u4m2→u4m2b→u4m3→u4r→u4c`). It already encodes the exact Gen-3 unlock + chest rules (chest
`available` iff the immediately-preceding review has stars AND unopened; lesson/review `done` iff
starred, else `active` iff every prior non-chest node has stars, else `locked`). Map state→`data-state`:
`done`→`mastered`, `active`/`available`→`progress`, `locked`→`not-yet`. The `u.color` field is
**dropped on port** (no unit colour-coding).

**Node entrance motion:** nodes mount with a staggered **settle**/**drift** (`--dur-drift` 300ms max,
`animation-delay` stagger ≤300ms total per section) — a one-pass entrance on load, then still. The only
persistent ambient is the single `active`-node breathe. Reduced motion → nodes appear in place, no
breathe.

**Ibrahim 14:24 line (bottom epigraph):** beneath the path, above the tab bar — the Courier
translation-of-meaning fragment (the "good word / good tree" line, Ibrahim 14:24) in `--fs-marg`
`--paper-62`, centred, quiet. It is **NOT** a display-Arabic scripture panel (the daily ayah is the
only Amiri scripture on the screen); it is a marginalia epigraph, so it uses Courier, never Amiri, and
carries a small ref. **Text spliced verbatim from a verified source, never generated** (Ruling R-7).
Nothing celebratory adjacent; never a `view-transition-name`.

### S4 · Node popup + the shared sheet family + the tab bar (LRN-03/06/07, RWD-04)

**Node popup — the singleton cream "slip of paper" (LRN-03; Ruling R-4 — a Page object on `body`):**

- **Mount:** appended to `document.body` (like `AW.sheet`), **never inside `.reg-orbit`** — so its
  buttons resolve to the default **Page-crimson `.btn`** (`background:var(--crimson); color:var(--cream)`),
  NOT the `.reg-orbit .btn` cream-on-cream override that would render them invisible (Pitfall 3). Cream
  ground (`--r-3`, `--sh-2` warm-ink shadow — it is a lifted paper object over the world), `--sp-3`
  inner.
- **Anchoring (Gen-3 `placePop` algorithm, ported; Claude's discretion on exact impl):** measure the
  node via `getBoundingClientRect`; compute node centre `nx`; clamp the popup centre `cx` into
  `[half+6, viewportWidth-half-6]`; `position:fixed; left:cx`; set the arrow offset `--ax = nx-cx` so
  the arrow points at the node even when the body is clamped. **Singleton** (opening one closes any
  other); **outside-tap closes** (a document click listener that ignores `.npop`/`.node`); Esc closes.
- **Contents:** the node **label** (`--fs-h2`); the **seed-row** — `NODE_ATOMS[id]` dots (Ruling R-1 for
  the count, Ruling R-2 for the honest binary-done state): faint `--madder` dots at rest, all **inked/
  sprouted** iff the node is `done`; the **star row** (done nodes, 1–3 `--gold` filled dabs + hollow for
  unearned); the **CTA** per the copy table (START/REVIEW/LEGENDARY/none). A gentle-"not yet" popup for
  locked nodes (microcopy, no CTA). Optional same-document `startViewTransition` may wrap popup open/
  close where free (never required — D-58).
- **The tapped node's chapter/Farag square carries the shared-element `view-transition-name` at click
  time** (S6 morph) — stamped on the source square, cleared after `finished`.

**The shared sheet family — ONE `AW.sheet` singleton (LRN-06; append-to-body, outside-tap+Esc close,
scroll-lock — all shipped):** every sheet is a Page cream object.

- **Streak sheet:** grip · Marcellus returns count + "day(s) you came back" · `AW.weekCal()` week row ·
  the never-breaks note (verbatim). Opened from: the HUD returns stat, the streak strip, **and** the
  Returns tab (one implementation).
- **Noor sheet:** grip · Marcellus noor count (gold-filled numeral) + "noor gathered" · the noor note
  (verbatim).
- **Course switcher:** grip · `.sheet-row` "Aqeedah · Level 1" with an **ACTIVE** pill (`--olive` ink,
  the "sound/verified" signal) · three `.sheet-row.off` coming-soon rows (Fiqh/Seerah/Qur'an) each with
  a scene icon + a quiet **COMING SOON** pill (calm neutral `--ink-62` + `--rule` hairline — never a
  disabled-dead grey). Opened from the HUD course chip.
- **Coming-soon sheet (Practice/Profile/More tabs):** grip · a scene icon + one calm line (copy table).
  Never a dead tap (LRN-07).

**Tab bar (LRN-07; Pitfall 4 RESOLVED):** a bottom `.tab` row (Learn active), 44px min per tab, safe-area
inset bottom. **The crimson `.tab.active` cue fails on the Orbit ground (2.65:1 — banned), so on
`.reg-orbit` the active cue is GOLD:**

```css
/* @layer screens — mirrors the shipped .rv-shell gold-override precedent; gold 8.40:1 on Kiswah */
.reg-orbit .tab.active        { color: var(--gold); }
.reg-orbit .tab.active::before,            /* the 2px top-rule that the shipped .tab.active draws crimson */
.reg-orbit .tab.active .toprule { background: var(--gold); }
```

Inactive tabs: `--paper-62`; icon via `--icon-accent` (gold on Orbit). This keeps the full
marginalia-on-dark read (the alternative — a cream footer strip — is not taken). Learn is the only
`active` tab; every other tab opens its designed coming-soon sheet (Returns → streak sheet). The
`.reg-orbit .tab.active { color: crimson }` shipped rule is **overridden, never edited** (the
components-layer rule survives for cream-ground pages; this `@layer screens` override outranks it on
Orbit).

### S5 · The chest → circuit-plate claim moment (RWD-04, D-56)

**Mechanic (byte-preserved from Gen-3, idempotent):** the chest is `available` when the unit's review
has stars; claiming grants **+25 noor exactly once** via the `chests` slot in `AW.S` (write-once guard;
Gen-3 `awba_chest_*` keys already migrate). Contents implied before tap (a sure gift, no gambling —
the popup says "+25 noor"). **NEVER randomized.**

```js
var chests = AW.state().chests;                 // defensive copy
if (!chests[nodeId]) {                           // write-once
  chests[nodeId] = true; AW.S.set('chests', chests);
  AW.S.set('noor', AW.S.get('noor', 0) + 25);    // deterministic, exactly once
  // → open the Festival interstitial
} // else: the "already opened — the light stayed with you" popup
```

**Expression — the CIRCUIT THRESHOLD (the sanctioned Festival moment):** claiming opens a **Festival
interstitial overlay** — a separate threshold ground, NOT the learn screen (which stays Orbit; law 1).
Inside the overlay:

- the dated folk **circuit plate** stamps in (`.plate`, the **stamp** verb, `--dur-stamp` 150ms — the
  wax-seal press; the plate label may use Rakkas ≥28px, valid here because it is a Festival threshold,
  not the Aref-Ruqaa learn screen);
- a **CIRCLE crowd-arrival** — ink `.dab`s **drift**-settle around the Ring (`--dur-amb-drift`,
  staggered `animation-delay`; the ummah as ambience, never a leaderboard);
- **that circuit's gold thread arc closes** on the Ring (the Orbit `draw` verb, `.thread`).
- The plate is **private by default** (law 10), maker's-marked with **date + ring seed** in Courier.

Festival tokens only (Haram Cream + folk trim — `--harissa`/`--olive`/`--mustard`/`--pink`, the shipped
`.reg-festival` ground + checker trim). **Crimson-free is not required here** (Festival is a cream
Page-family ground, not Orbit) — but nothing celebratory touches scripture (there is no scripture in
the interstitial). Dismiss returns to the learn screen (now showing the chest node `done`). Reduced
motion: the plate appears stamped-static, crowd dabs rest settled-in-place, the thread arc shows closed
static — **the +25 noor is granted regardless** (the mechanic never depends on motion).

### S6 · Cross-document View-Transitions motion contract (MOT-02 / D-58)

**Opt-in (inherited by all 20 pages, zero per-page CSS):** a **top-level `@view-transition { navigation:
auto; }`** placed **high in `awba-engine.css`** (immediately after the `@layer` order line at :16 — a
document descriptor, NOT inside a cascade layer; buried-in-a-layer risks being ignored — Pitfall 1). The
`@layer` order line at :16 is **never re-declared**.

**Reduced-motion kill block (inside `@layer motion`, beside the shipped reduced-motion guards — both
triggers; `!important` beats the UA cross-fade regardless of layer):**

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; }
}
[data-motion="reduce"] ::view-transition-group(*),
[data-motion="reduce"] ::view-transition-old(*),
[data-motion="reduce"] ::view-transition-new(*) { animation: none !important; }
```

**The ONE shared-element morph (node square → lesson opener square):** stamp a single
`view-transition-name` (`circuit-term`) at click time on the tapped node's chapter/Farag square
(`pageswap`), give the lesson opener's `.journey` square the SAME name (`pagereveal`), and **clear it
after `finished`** so successive navigations never collide (two elements sharing a name aborts the
transition — uniqueness rule). Guard every handler `if (!e.viewTransition) return;` so nothing throws
over `file://` (opaque origin → clean no-op, plain nav — Pitfall 2).

- **Everything else** = the default UA subtle **cross-fade**, ≤300ms on the one `--ease` family.
- **Scripture NEVER carries a `view-transition-name`** — not the daily ayah, not the cite sheet ayah,
  not the Ibrahim line (D-58). No morphing ayat, ever.
- **Firefox / unsupported / `file://`** = normal navigation, no fallback code (progressive enhancement).

**Reduced-motion inventory — every new ambient this phase introduces, and its reduced-motion state:**

| New ambient / motion (Phase 5) | Normal | Reduced motion (`AW.reducedMotion()` = OS or `data-motion="reduce"`) |
|---|---|---|
| Ring hero on load | static (law 9 — no `animateFrom`) | unchanged (already static) |
| Earned path gold thread on load | static (drawn to earned extent, no replay) | unchanged (static) |
| Path earned-thread | always static everywhere (law 9; W8 correction — no draw surface exists) | already static |
| `active`-node breathe (the ONLY path ambient) | slow ember opacity pulse `--dur-amb` | **stilled** — static ember half-dab |
| Node-entrance settle/drift stagger | one-pass staggered mount ≤300ms | nodes appear in place, no stagger |
| Daily-ayah quiet fade-in | opacity, ≤300ms, one pass | appears static |
| HUD/streak/continue-card settle | one-pass fade on load | appears static |
| Streak constellation | static dots (a tint/state, not motion) | unchanged |
| `data-sky` tint + `--dawn` warmth | static overlay (information, not motion) | unchanged (the time-of-day still shows) |
| View-Transitions cross-fade + `circuit-term` morph | ≤300ms native morph/fade | **killed** by the reduced-motion VT block (`animation:none`) → instant nav |
| S5 plate stamp / crowd drift / thread-arc close | stamp 150ms + drift + draw | plate/dabs/arc render final-static; +25 noor still granted |

---

## Motion & Reduced-Motion (binding, all surfaces)

- **One easing family:** `--ease: cubic-bezier(0.23,1,0.32,1)`. No other curve exists.
- **One verb per register:** Orbit = **draw** (the Ring + the earned path `ink-draw`, `--dur-draw`
  240ms) · Circle = **drift** (node entrance + the S5 crowd, `--dur-drift` 300ms / `--dur-amb-drift`
  ambient) · Page = **settle** (HUD/card mounts + sheets, `--dur-settle`/`--dur-sheet`) · Sky =
  **breathe** (the single `active`-node ambient, `--dur-amb`) · Festival = **stamp** (the S5 plate +
  rosette seal, `--dur-stamp` 150ms). **Press = the one paper-press everywhere** (`translateY(1px)` +
  ink-deepen, `--dur-press` 140ms). **The centre (Ring) never animates on load** (law 9).
- **Both reduced-motion triggers** collapse every JS animation to 1ms via `AW.animate`; ambients stop
  (never collapse — loops are stilled); the Ring + earned path render static; the constellation + sky
  tint are static regardless. See the S6 inventory.
- **44px** minimum on every tappable (node, tab, HUD stat, mute, sheet-row, popup CTA, `.sheet-x`,
  course chip); **AA at real rendered sizes** per the cited §2.1 tables.

---

## Decision Log (this phase's screen-level rulings — extends the D-A / D-45 series)

| # | Ruling | Rationale |
|---|---|---|
| **R-1** | **Ring/seed-row atom denominator = 61** (the taught total). One `NODE_ATOMS` map + `AW.atomsDone(progress)` in the engine; feeds every `AW.ringSVG` caller + `AW.skyDawn` + each seed-row's dot count. | The per-lesson map is verifiable (RESEARCH §Atom Map): 61 atoms taught across 15 lessons; the 4-atom gap to the 65 corpus is fully explained by documented holds (U3-13, U3-16, U4-03, U4-09 — taught in no lesson). 61 = corpus-minus-holds so a completed course **fully inks** the Ring (the honest "your learning has traced the whole course" reading). **Touch-points:** `AW.ringSVG` `DEF_STRUCT.atoms` 65→61, `skyDawn` `SKY_ATOMS` 65→61, any `ring.test.js` "of 65" assertion, `preview.html`'s hard-coded `atomsDone`. NEVER invent per-lesson atom counts. |
| **R-2** | **The seed-row is BINARY-done grammar** — `NODE_ATOMS[id]` dots, all inked/sprouted iff the node is `done` (has stars), faint `--madder` at rest; not a live "3/5" partial. | Across sessions the only persisted per-lesson fact is `stars[id]` — per-beat/per-atom progress is **never stored** (`AW.state()` has no beat index; the "3/5 sprouting" of ATHAR moment 2 is a lesson-**page** live element off `pos`/`stepIndex`, not a learn-page fact). Binary-done is the only truthful state; proxying sprout-count off beats would be wrong across sessions. |
| **R-3** | **Plant stamp: MVP (required) = seed-rows + a single sprout glyph on done nodes; full ~20-doodle pool = stretch/fast-follow (planner wave-split).** | D-55 explicitly permits the fallback; ship the honest seed-row + one sprout in v1, log the bounded ~20-doodle pool (ATHAR asset kit) as the fast-follow so the phase doesn't balloon on asset authoring. **NEVER a 65-plant map** (the Ring is THE map). |
| **R-4** | **The node popup mounts on `document.body`** (position:fixed, arrow via `--ax`), **never inside `.reg-orbit`.** | The cream slip is a Page object (register-as-component exemption, same as `AW.sheet`). Appending inside `.reg-orbit` would inherit `.reg-orbit .btn` (cream-on-cream = invisible CTAs) + `.reg-orbit .hstat` overrides (Pitfall 3). On `body` its `.btn` gets the correct Page-crimson fill. |
| **R-5** | **Active `.tab` cue on Orbit = GOLD, not crimson** — `.reg-orbit .tab.active { color: var(--gold) }` + a 2px gold top-rule. | Crimson is 2.65:1 on Kiswah (banned — §2.1); gold is 8.40:1. Mirrors the shipped `.rv-shell` gold-override precedent; keeps the full marginalia-on-dark read (the cream-footer alternative is not taken). Overrides, never edits, the shipped crimson `.tab.active` (which survives for cream pages). |
| **R-6** | **The unit-header + continue-card chapter-term uses the verified Aref-Ruqaa Arabic term when one is supplied; MVP fallback = the cream Farag square with the unit scene icon + the English title (Readex).** The 15 verified Arabic chapter-terms are an **owner/scholar-sourced input** — **never invented** here. | Josh's Gen-3 UNITS carry English titles only, no Arabic chapter-terms (confirmed; the Phase-4 opener already deferred the Aref-Ruqaa Farag square for the same reason — 04-03 summary). Content integrity forbids fabricating Arabic terms. The mechanism (Farag square, Aref Ruqaa ≥40px, crimson-on-cream) is fully specified; the string is sourced. **Owner-ledger item.** |
| **R-7** | **The Ibrahim 14:24 line is a Courier English translation-of-meaning epigraph (marginalia), NOT a display-Arabic scripture panel; its text is spliced verbatim from a verified source (Clear Quran Ibrahim 14:24), never generated.** | The daily ayah is the only Amiri scripture on the screen (it holds the reverence budget). ATHAR canon places "the Ibrahim line" in the Courier marginalia role (the orchard's reason for existing). Rendering it as a second Amiri panel would dilute the daily ayah's singularity and risk generating scripture; a sourced English epigraph honours both scripture law and content integrity. Retires the Gen-3 "Fiqh comes next" finish line (folded into the course-switcher coming-soon row). |

**Owner-ledger items (not build-blocking, unchanged from CONTEXT):** the 15 verified Arabic chapter-terms
(R-6) · the verbatim Ibrahim 14:24 English text source (R-7) · sound-cue assets (D-52) · scholar gate ·
Clear Quran licensing · the deferred Phase-4 visual walk · `A2` (U4-09 is an assumed 4th hold). One
deploy-surface note for Phase 7 (out of scope here): repo root has no `index.html` — PLT-04 decides
whether it redirects to `learn.html`.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|---|---|---|
| none (vanilla, zero-build, zero-dependency) | none | **not applicable** — no shadcn, no npm, no external component registry (CLAUDE.md hard constraint; RESEARCH.md "Package Legitimacy Audit: N/A — zero external packages"). All code is in-repo `AW.*` primitives + native browser APIs + Node-core dev tooling. |

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
