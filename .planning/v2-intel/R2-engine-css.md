# R2 — shared/awba-engine.css: exhaustive reference (2353 lines)

File: `/Users/theshumba/Documents/GitHub/awba-gen4/shared/awba-engine.css`
This is the ONE engine stylesheet every page `<link>`s. It is the design constitution (Athar system). v2 new surfaces (onboarding, Practice, Profile, More) MUST consume this file's tokens/registers/components only — no new hex, no new easing, no new @layer order line.

---

## 1. @layer architecture

Verbatim order line, **line 16**:
```css
@layer tokens, base, components, screens, motion;
```
- Priority runs left→right by first-occurrence: `tokens < base < components < screens < motion`.
- `motion` is declared LAST = highest cascade priority. This is deliberate (D-04): the reduced-motion collapse living in `@layer motion` always beats a `screens`-layer animation that forgot its own guard.
- **LAW**: this exact line appears **exactly once, repo-wide**, in this file, at line 16. No other file may ever write a bare `@layer <name-list>;` statement again.
- Pages MAY add a `@layer screens { ... }` **content block** (adding rules to the already-declared `screens` layer) — see §7 below (learn.html precedent) — but must NEVER re-declare the order line.
- Top-level, non-layered, sits ABOVE the tokens layer at line 23: `@view-transition { navigation: auto; }` — a document descriptor (not layer content), kept high in the file deliberately (buried/late placement risks the browser ignoring it for navigation). Every page inherits cross-document page-morph via this <link> alone; zero per-page CSS needed.

Layer contents at a glance:
- `tokens` (L25–178): `@font-face` rules + the single `:root { ... }` token block (fonts, spacing, type scale, colour, ink ramps, radii, depth/shadow, grain path, motion durations/easing).
- `base` (L180–456): reset, `.app-shell`/`.app-hud`/`.app-stage`/`.app-foot` responsive shell, `.grain`, the four `.reg-*` register grounds + Sky-as-tint on Orbit, `--dawn` glow, thermal `[data-state]` token mapping + `.ramp-bar`, `.aw-sr`, `:focus-visible` grammar, scripture/Arabic law CSS, `.nightfall` interstitial.
- `components` (L458–950): `.cite`/`.term`, sheet family (`.scrim`/`.sheet`/`.grip`/`.sheet-x`), citation-sheet rows (`.r-src`/`.r-ar`/`.r-mean`/`.r-ref`/`.r-pills`/`.r-pill`), term-gloss sheet (`.g-*`), tappable inventory (`.btn`/`.opt`/`.tf`/`.tile`/`.tab`/`.hstat`), the ONE paper-press, quiz verdicts (`.opt.correct`/`.opt.wrong`/`.opt-why`/`.btn.retry`), `.sheet-row`, hover states, thermal state SHAPES, celebration primitives (`.dab`/`.thread`/`.plate`/`.rosette`).
- `screens` (L951–2247): per-screen composition only — S1 lesson shell, S1-beats (9 beat renderers), S2 depth accordion, S3 quiz layout + streak META, S4 reward screens (verdict/noor/returns/done/Ring/du'a), S5 review (Orbit legendary register), and the full learn.html Orbit front-door composition (`#app.reg-orbit`, `.ob-*`, `.onode*`, `.op-thread*`, `.npop`, `.osh-*`/`.osw-*`, `.otabs`, `.ocs-*`, `.ofest*`).
- `motion` (L2249–2353): keyframes (`settle`/`breathe`/`breathe-halo`/`drift`/`stamp`/`ink-draw`), `.ring`, `.sky-breathe`, reduced-motion quieting (both triggers), view-transition kill block.

**ZERO-NEW-HEX LAW**: every colour/spacing/radius/shadow/type value from `components`/`screens` onward must be `var(--token)` — raw hex/px only where a token genuinely doesn't exist (rare rgba() overlays, art-glow). v2 builders: never write a new hex value; if a needed colour doesn't exist as a token, that's a design-spec gap to flag, not something to invent inline.

---

## 2. Full token inventory (`@layer tokens`, `:root`, L52–177)

### Font role stacks (§2.2)
- `--font-work`: `'Readex Pro', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` — the one workhorse, both scripts. Inter appears ONLY as silent glyph-fallback (U+02F9/U+02FA corner brackets in Clear-Quran translation prose) — never a design voice elsewhere.
- `--font-quran`: `'Amiri Quran', 'Amiri', 'Noto Naskh Arabic', 'Geeza Pro', serif` — `.ayah` ONLY, verbatim ayat.
- `--font-scrip`: `'Amiri', 'Noto Naskh Arabic', 'Geeza Pro', serif` — hadith + du'a, `.scripture`.
- `--font-display`: `'Marcellus', Georgia, 'Times New Roman', serif` — Orbit/Sky English display ≥28px.
- `--font-term`: `'Aref Ruqaa', 'Amiri', serif` — the 15 chapter key-terms ≥40px, in Farag squares.
- `--font-festival`: `'Rakkas', 'Marcellus', serif` — Festival signage ≥28px; NEVER scripture.
- `--font-marg`: `'Courier Prime', ui-monospace, 'SFMono-Regular', Menlo, monospace` — marginalia ONLY (dates, counters, footnotes).

### Spacing scale (4px scale, D-A1)
`--sp-2:2px` (hairline) · `--sp-1:4px` · `--sp-2s:8px` · `--sp-3:12px` · `--sp-4:16px` · `--sp-5:20px` · `--sp-6:24px` · `--sp-8:32px` · `--sp-12:48px` · `--sp-16:64px`. `env(safe-area-inset-*)` and the 44px touch-target minimum sit OUTSIDE this scale (hardcoded 44px in components).

### Type scale
`--fs-body:1rem` (16px, Readex 400, lh 1.6) · `--fs-ar-ui:1.1rem` (17.6px, Readex, lh 1.8) · `--fs-ui:0.875rem` (14px) · `--fs-h2:clamp(1.125rem,1.05rem+0.4vw,1.25rem)` (18→20) · `--fs-h1:clamp(1.375rem,1.25rem+0.6vw,1.625rem)` (22→26) · `--fs-display:clamp(28px,1.6rem+1.6vw,46px)` (Marcellus) · `--fs-term:clamp(40px,2rem+2vw,48px)` (Aref Ruqaa) · `--fs-festival:clamp(28px,2rem+1vw,34px)` (Rakkas) · `--fs-marg:0.75rem` (12px, Courier) · `--fs-ayah:clamp(24px,22.4px+0.4vw,27px)` (Amiri Quran, lh 1.9) · `--fs-scrip:23px` (Amiri, lh 1.85).

### Colour — 17 Athar tokens, register-grouped (§2.1), law 7 = ≤6 tokens/screen
CORE (Orbit + shared):
- `--kiswah: #131013` — Kiswah Black, Orbit ground / ink on cream
- `--cream: #F3EDE2` — Haram Cream, Page/Festival ground / ink on dark
- `--crimson: #A32C21` — Mihrab Crimson, Page rubrication/jadwal rules/accent (≤10%). **BANNED on Orbit (2.65:1 — fails)**
- `--ember: #E8502A` — Farag Ember, thermal in-progress; TEXT only on dark grounds
- `--gold: #D9A441` — Hajar Gold, earned thread/seals/mastered; dark-ground accent + focus ring (8.40:1 on Kiswah, exact value cited repeatedly)
- `--navy: #1B2436` — Layl Navy, deep structural panel; un-inked Ring rows base

PAGE: `--madder: #8F4B58` (Madder Wash, secondary Page ink) · `--nightfall: #201418` (interstitial ground ONLY, a moment not a mode)

SKY: `--lastthird: #251D46` (night canvas ground) · `--moonmilk: #F4F0F7` (night text) · `--apricot: #F0A583` (Horizon Apricot, dawn warmth; NEVER text on cream — not AA) · `--powder: #A9BFEE` (thermal not-yet, cool end) · `--rose: #E7A5B4` (gentle retry FRAME only; never red, never load-bearing text)

FESTIVAL: `--harissa: #C13A20` (Festival primary folk red) · `--olive: #6B682A` (Festival ink/secondary, sound-verified grade ink, D-A9) · `--mustard: #E3A63A` (Festival fill; NEVER text) · `--pink: #EFB5AC` (Souk Pink fill; NEVER text)

### Ink hierarchy — opacity ramps (NOT new colours)
On CREAM: `--ink: var(--kiswah)` · `--ink-85: rgba(19,16,19,.85)` · `--ink-62: rgba(19,16,19,.62)` (5.02:1, clears WCAG 1.4.11) · `--ink-40: rgba(19,16,19,.40)` (2.56:1 — FAILS 1.4.11, do not use for shape-carrying borders) · `--rule: rgba(19,16,19,.12)`.
On DARK: `--paper-85: rgba(243,237,226,.85)` · `--paper-62: rgba(243,237,226,.62)` (6.69:1 on Kiswah) · `--paper-45: rgba(243,237,226,.45)` · `--edge: rgba(243,237,226,.14)`.

### Radii (D-A2)
`--r-square:0` · `--r-1:3px` · `--r-2:6px` · `--r-3:10px` · `--r-4:14px` · `--r-round:50%` · `--r-pill:999px` (RATIONED: thermal chip + marginalia counter capsule only — never a card).

### Depth/shadows (D-A3)
CREAM: `--sh-1: 0 1px 2px rgba(19,16,19,.06)` · `--sh-2: 0 6px 18px rgba(19,16,19,.10)` · `--sh-3: 0 18px 48px rgba(19,16,19,.16)` (sheet) · `--keyline: 0 0 0 1px var(--rule)`.
DARK: `--edge-top: inset 0 1px 0 rgba(243,237,226,.10)` · `--edge-line: 0 0 0 1px var(--edge)`. Dark grounds NEVER get a drop shadow.

### Grain
`--grain: url('img/grain.png')` — CSS-relative, never a leading slash.

### Motion
`--ease: cubic-bezier(0.23,1,0.32,1)` — THE one family, no other curve exists anywhere.
UI durations (all ≤300ms): `--dur-press:140ms` · `--dur-fade:180ms` · `--dur-stamp:150ms` · `--dur-draw:240ms` · `--dur-settle:260ms` · `--dur-sheet:280ms` · `--dur-drift:300ms`.
Ambient durations (4–6s, never collapsed, only stopped): `--dur-amb:5200ms` · `--dur-amb-drift:6000ms`.

---

## 3. Register system (`@layer base`, L270–456)

Four scoped grounds — **law 1: ONE ground per screen**. Each sets ink colour, `--go` grain density, `--icon-accent` (single expressive icon-detail colour).

| class | ground colour | ink | `--go` | `--icon-accent` | notes |
|---|---|---|---|---|---|
| `.reg-orbit` | `--kiswah` | `--cream` | .07 | `--gold` | Orbit — home/Ring/celebrations. Crimson BANNED (2.65:1). |
| `.reg-page` | `--cream` | `--ink` | .028 | `--crimson` | Page — ~90% of minutes (lessons/quizzes/reading/journal). |
| `.reg-sky-night` | linear-gradient `#1C1637→--lastthird 58%→#2C2150` | `--moonmilk` | .07 | `--gold` | Sky (night) — du'a/night/constellation screens. Has `::before` apricot dawn-edge glow at base. |
| `.reg-festival` | `--cream` | `--ink` | .028 | `--harissa` | Festival — thresholds ONLY (plates/poster/Eid/share). Has folk checker-trim `::before` (16px conic-gradient) + `padding-top:44px` to clear it. |

`.nightfall` is a **Page MOMENT, not a register** (§3.4): full-bleed fixed overlay, ground `--nightfall`, text `--moonmilk`, z-index 80. Not one of the four registers a v2 screen picks.

Sky-as-tint over Orbit (§3.2, D-A7 — law 1: home stays Kiswah, Sky is a TINT never a 2nd ground): `.reg-orbit[data-sky]::after` paints `var(--sky-tint)`. Values: `[data-sky="dawn"]`, `="day"` (none — the neutral black world), `="dusk"`, `="night"`, `="lastthird"` — each a linear-gradient at varying opacity/stop keyed to the real prayer clock.

`--dawn` progress warmth: `.reg-orbit::before` bottom-horizon apricot glow, opacity driven by `var(--dawn,0)` (JS sets on `<html>` at boot, capped 0.6). Ambient decoration, not the metric (Ring is the metric). z-index 0, under `.ring` (z-index 1). Static, not motion.

### :focus-visible grammar (ACC-01/D-A10) — shown on `:focus-visible` ONLY, never plain `:focus`
- Default (base): `outline: 3px solid var(--crimson); outline-offset: 2px; box-shadow: 0 0 0 6px color-mix(in srgb, var(--crimson) 22%, transparent);`
- `.reg-page :focus-visible, .reg-festival :focus-visible` → crimson (explicit re-statement, same values) — **crimson on cream grounds**.
- `.reg-orbit :focus-visible, .reg-sky-night :focus-visible, .nightfall :focus-visible` → **gold on dark grounds**: `outline-color: var(--gold); box-shadow: 0 0 0 6px color-mix(in srgb, var(--gold) 28%, transparent);`
- The ONE sanctioned ring suppression (D-62): `[tabindex="-1"]:focus-visible { outline:none; box-shadow:none; }` — ONLY for non-operable focus-landing headings (reward/review headings given `tabindex="-1"` so focus doesn't evaporate on innerHTML swap). NEVER on any button/a/textarea/input.

**Rule for v2 builders**: any new screen on `.reg-orbit`/`.reg-sky-night`/`.nightfall` automatically inherits gold focus rings; cream registers automatically get crimson. Don't hand-author focus styles.

### Thermal state tokens (§3.3, D-A8) — SHAPE is primary channel, colour secondary
`[data-state="not-yet"] { --st: var(--powder); }` · `[data-state="progress"] { --st: var(--ember); }` · `[data-state="mastered"] { --st: var(--gold); }`. `.ramp-bar` is a 6px pill gradient powder→ember→gold. Shapes (border styles, half-dab, filled+check) live in `@layer components` — see §4.

### `.aw-sr` (D-64/ACC-02)
Visually-hidden utility for `AW.announce`'s single body-level `role="status"` region. `position:absolute; width:1px; height:1px; clip-path:inset(50%); overflow:hidden; white-space:nowrap;` — clipped, NOT `display:none`/`visibility:hidden` (those are ignored by screen readers).

---

## 4. Reusable component classes (`@layer components`)

### `.btn` (+variants) — L683–718
Base: `display:block; width:100%; padding:var(--sp-4); border:none; border-radius:var(--r-3); font:600 var(--fs-body) var(--font-work); color:var(--cream); background:var(--crimson); box-shadow:var(--sh-1);` — the ≤10% crimson accent, Page CTA.
- `.reg-orbit .btn, .reg-sky-night .btn` → `background:var(--cream); color:var(--kiswah); box-shadow:var(--edge-top);` (cream key on black world).
- `.reg-orbit .btn.ghost, .reg-sky-night .btn.ghost` → `background:transparent; color:var(--gold); box-shadow:var(--edge-line);` (quieter gold-thread button on dark).
- `.btn:disabled, .btn.disabled` → `opacity:.5; box-shadow:none; transform:none; pointer-events:none;`
- Hover (fine pointer only): `.btn:hover{filter:brightness(1.04)}`; ghost hover on dark → `background: rgba(217,164,65,.12)`.

### `.opt` / `.tf` / `.tile` — L719–760
All share: 2px `var(--rule)` border, `var(--r-2)` radius, `var(--font-work)` `var(--fs-body)`, `var(--cream)` bg, `var(--ink)` text, `box-shadow: var(--sh-1)`, cursor pointer.
- `.opt` additionally: `display:block; width:100%; padding:var(--sp-3) var(--sp-4); text-align:left;` + `animation: settle var(--dur-settle) var(--ease) both;` (mounts with Page reveal).
- `.tf`: `flex:1; padding:var(--sp-3); font-weight:600; text-align:center;` (true/false pair, wrap in `.tfrow`).
- `.tile`: `display:inline-flex; padding:var(--sp-2s) var(--sp-3);` (word-bank tiles, wrap in `.tilebox`/`.bank`).
Quiz verdicts consume `.opt`: `.opt.correct` (gold border + gold-wash bg + `::before` 10px gold dot with settle animation), `.opt.wrong` (rule-colour border + `::after` grey ink-blot at .14 opacity, NEVER red/flash), `.opt-why` (one-line explanation, `--ink-85`), `.btn.retry`/`.retry` (2px `--rose` border FRAME only, D-A12 — rose never load-bearing text).

### `.sheet` family — L500–562
Singleton scrim+sheet (`AW.sheet`), reused by every sheet app-wide.
- `.scrim`: `position:fixed; inset:0; z-index:90; background:rgba(19,16,19,.52); opacity:0→1 on .open;`
- `.sheet`: `position:fixed; bottom:0; margin-inline:auto; max-width:480px; max-height:82%; padding:var(--sp-6) var(--sp-6) max(var(--sp-8), safe-area-bottom); background:var(--cream); color:var(--ink); border-radius: var(--r-4) var(--r-4) 0 0; box-shadow:var(--sh-3); transform:translateY(100%)→0 on `.scrim.open .sheet`; transition on `var(--dur-sheet) var(--ease)`.` ALWAYS a cream Page object even when opened from Orbit/Sky (paper laid over the world) — scripture inside always renders under Page rubrication on clean ground.
- `.grip`: 40×4px pill handle.
- `.sheet-x`: 44×44 close button, `border-radius:var(--r-round)`, transparent bg, `color:var(--ink-40)`.
- `html.sheet-lock { overflow:hidden; }` — scroll lock while a sheet is open.

### `.sheet-row(.off)` — L860–868, L2140–2161
`.sheet-row` (Phase-5 course-switcher pattern): paper-press + faint crimson wash on `:active` (`background: rgba(163,44,33,.06)`). The concrete instance is `.osw-row` (scene icon + name + status pill): `.osw-row.off` keeps full-legibility text (`--ink-85`, never grey-out) — status lives in the pill (`.osw-pill` neutral hairline capsule vs `.osw-pill.on` olive "sound/verified" ink).

### `.tab` bar — L761–798, L2167–2187
Base `.tab`: `min-height:44px; border-radius:var(--r-3); font:var(--fs-marg) var(--font-work); color:var(--ink-62); background:transparent;`
`.tab.active`: `color:var(--crimson); box-shadow: inset 0 2px 0 var(--crimson);` — a ruled top-line, NEVER a filled pill. `.tab.active svg { color: var(--icon-accent); }`
**Precedent to copy for any new dark-ground tab bar**: `.reg-orbit .tab.active { color: var(--gold); box-shadow: inset 0 2px 0 var(--gold); }` (L2186–2187, the `.otabs` learn.html front door) — an explicit register-scoped OVERRIDE (never edit the base crimson rule; crimson is banned on Orbit at 2.65:1). Any v2 tab bar living on a dark register must apply this same override pattern, not invent a new one.
`.otabs` itself (the concrete bottom nav on learn.html): `position:fixed; bottom:0; max-width:480px; margin-inline:auto; background:color-mix(in srgb, var(--kiswah) 90%, transparent); border-top:2px solid var(--navy); backdrop-filter:blur(8px);` — reusable pattern if Practice/Profile/More share this same fixed tab bar (they likely do, per learn.html's `.ocs-body` "coming-soon" sheet references to Practice/Profile/More).

### `.hstat` / `.ls-hud` — L782–797, L976–1020
`.hstat`: transparent/borderless Courier stat, `color:var(--ink-62)` (→ `--paper-62` on dark registers), icon in `--icon-accent`. `.ls-hud` is the HUD marginalia row layout (flex row, space-between); `.ls-stats` groups multiple `.hstat`; `.ls-mute` is the 44×44 mute-toggle slot.

### `.ls-back` — L1075–1092
Quiet return control: `background:transparent; color:var(--ink-62);` (NOT a second CTA). **Gotcha for dark grounds**: `.reg-sky-night .ls-back, .nightfall .ls-back { color: var(--paper-62); }` — this override exists because `--ink-62` on a dark ground computes to ~1.2:1 (found by contrast-audit forced-state sweep) — any reused `.ls-back` (or similar quiet-ink control) placed on a dark register MUST get this same token swap, not a new colour.

### `.plate` / `.dab` / `.thread` / `.rosette` — L905–950 (celebration primitives)
Rare and tasteful only — never full-screen burst, never adjacent to scripture.
- `.dab`: 20×20 circle, `animation: drift var(--dur-drift) var(--ease) both;` (an ink dab drifting into place).
- `.thread`: SVG stroke, `stroke:var(--gold); stroke-width:2; stroke-linecap:round; animation: ink-draw var(--dur-draw) var(--ease) both;` — the Orbit gold-thread arc that inks itself in ONCE (established/earned segments are set `.op-thread { animation:none; }` — never replay, "law 9").
- `.plate`: Festival plate, `border:2px solid var(--olive); border-radius:var(--r-square); font:var(--font-festival) var(--fs-festival); color:var(--harissa); animation: stamp var(--dur-stamp) var(--ease) both;`
- `.rosette`: 64×64 filled gold circle seal, `box-shadow:0 0 0 2px var(--kiswah), var(--sh-1); color:var(--kiswah); animation: stamp ...;`

### `.ring` / `.onode` / `.onode-mark` grammar — L1951–2031, L2307–2309
`.ring` (motion layer): `display:block; position:relative; z-index:1; width:100%; height:auto;` — the tawaf-fingerprint macro-progress SVG. Centre/head-dot NEVER animates (law 9) — only frontier dabs draw once.
`.onode`: real `<button>`, `width:6.5rem; margin-inline-start: calc((100% - 6.5rem) * var(--lane, .5));` — the serpentine positioning knob is the CSS custom property `--lane` (0–1, set inline per node by JS/generator).
`.onode-mark`: 44×44 touch target, `border-radius:var(--r-round)` — hosts the thermal/celebration shape (hollow ring / half-dab / filled rosette per state via `[data-nstate]`/`.op-rosette`/`.op-plate` modifier classes).
`.onode-mark[data-ambient] { animation: breathe var(--dur-amb) var(--ease) infinite alternate; }` — the ONLY ambient on the path (the single active node breathes).

### `.npop` (node popup) — L2056–2110
Singleton cream "slip of paper" — mounts on `document.body`, **NEVER inside `.reg-orbit`** (else its CTA resolves to the invisible cream-on-cream `.reg-orbit .btn` key — "Pitfall 3", explicitly documented). `position:fixed; z-index:70;` (above the world, below the sheet scrim at 90). Arrow `::after` tracks the tapped station via `--ax` custom property + `[data-side="below"|"above"]`.

### `.scard` / `.ayah` scripture law styling — L1144–1179, §399–434 (base)
`.scard`: `--go:0` (no grain — law 3, scripture always on clean ground), `background:var(--cream); border-radius:var(--r-4); box-shadow:var(--keyline);` — paints its own opaque cream so it always sits clean even nested in a dark register.
`.ayah` (base layer, universal): `font-family:var(--font-quran); font-size:var(--fs-ayah); line-height:1.9; letter-spacing:0; direction:rtl; unicode-bidi:isolate;`
`.scripture`: `font-family:var(--font-scrip); font-size:var(--fs-scrip); line-height:1.85;` same rtl/isolate/letter-spacing:0.
**The ONE permitted glow, dark grounds only**: `.reg-sky-night .ayah, .reg-sky-night .scripture, .nightfall .ayah, .nightfall .scripture { text-shadow: 0 0 24px rgba(244,240,247,.30); }` — this exact value is reused verbatim at L1877 (`.oayah .ayah`) — never invent a different glow value.

### `.grain` — L255–268
`.grain { position:relative; }` + `::after` tiles `var(--grain)` at `background-size:128px 128px; opacity:var(--go, .05); z-index:0;` (below content, which must set `position:relative; z-index:1`). Scripture wrappers set `--go:0`.

### Paper-press mechanics (MOT-03, D-A4) — L800–814
THE one press, applied identically across the FULL tappable inventory: `.btn, .opt, .tf, .tile, .tab, .hstat, .cite, .term { transition: transform var(--dur-press) var(--ease), border-color var(--dur-press) var(--ease), background var(--dur-press) var(--ease), filter var(--dur-press) var(--ease); }` then on `:active` → `transform: translateY(1px);` PLUS a border-colour ink-deepen: `.opt:active, .tf:active, .tile:active { border-color: var(--crimson); }` (fill: `.btn:active { filter: brightness(.95); }`). No drop shadow, no bounce.
**Register override precedent (WR-01, L1716–1723)**: on Orbit (`.rv-shell`), crimson is banned, so the SAME press mechanic is re-inked: `.rv-shell .opt:active, .rv-shell .tf:active, .rv-shell .tile:active { border-color: var(--gold); }` — a register-scoped override of the unscoped `:active` rule, NOT a re-declaration of the layer order. Any v2 dark-register tappable must follow this exact pattern.

### Thermal `[data-state]` shapes — L882–903
SHAPE first, colour secondary (colour-blind + cream-contrast safe):
- `[data-state="not-yet"]`: `border:2px solid var(--ink-62); background:transparent;` (hollow ring). **WR-04 note**: `--ink-62` = 5.02:1 clears WCAG 1.4.11's 3:1 non-text threshold; `--ink-40` = 2.56:1 FAILS — never substitute. `.reg-orbit [data-state="not-yet"], .reg-sky-night [data-state="not-yet"] { border-color: var(--powder); }` on dark grounds.
- `[data-state="progress"]`: `border:2px solid var(--st); background: linear-gradient(90deg, var(--st) 50%, transparent 50%);` (half-inked dab).
- `[data-state="mastered"]`: `border:0; background:var(--gold); box-shadow:var(--keyline); color:var(--kiswah);` (filled + check glyph inks dark on gold). `.reg-orbit [data-state="mastered"], .reg-sky-night [data-state="mastered"] { box-shadow:none; }` on dark (keyline is a cream-ground cue only).

### `.aw-sr` — see §3 above.

---

## 5. Motion vocabulary (`@layer motion`, L2249–2353)

### Keyframes + register verbs
| keyframe | verb | register | recipe |
|---|---|---|---|
| `settle` | settle | Page | `opacity:0→1; transform:translateY(8px)→0;` — cards/options/sheet/quiz reveals |
| `breathe` | breathe | Sky | `opacity:.72→1` alternate infinite — ambient night/du'a halo |
| `breathe-halo` | breathe (halo variant) | Sky | adds `transform:scale(.97)→scale(1)` to the opacity swell |
| `drift` | drift | Circle | `translate(var(--dx,8px),var(--dy,-6px)) rotate(28deg) opacity:0` → settled `translate(0,0) rotate(0) opacity:1`, with a 34%/58% easing waypoint — pilgrim ink-dab arriving |
| `stamp` | stamp | Festival | `scale(1.03) opacity:0` → `scale(1) opacity:1` — the wax-seal press |
| `ink-draw` | draw | Orbit | `stroke-dashoffset:var(--len) opacity:0` → `stroke-dashoffset:0 opacity:1`, 8% waypoint opacity kick — the Ring's frontier reveal, plays ONCE, never replays on established segments |

One easing family for ALL of the above and every transition anywhere in the system: `var(--ease)` = `cubic-bezier(0.23,1,0.32,1)`.

### `[data-ambient]` and BOTH reduced-motion triggers (MOT-04)
Two independent triggers sharing rule bodies (both required — the boot-stamp fires only on in-app override, never reflects the OS setting):
1. `@media (prefers-reduced-motion: reduce)` — the OS setting.
2. `[data-motion="reduce"]` — the `awba_prefs` boot-stamp JS sets on `<html>`.

Both bodies do the SAME two things:
```css
:root { --dur-press:1ms; --dur-fade:1ms; --dur-stamp:1ms; --dur-draw:1ms; --dur-settle:1ms; --dur-sheet:1ms; --dur-drift:1ms; }
.sky-breathe, .dab, [data-ambient] { animation: none !important; }
```
- Finite UI durations COLLAPSE to 1ms (shortens, never vanishes, the state-communicating transition).
- Ambient ("breathe"/loop) animations are STOPPED outright with `animation:none` — NEVER collapsed to a 1ms period (that would spin them at a near-instant rate = seizure risk). `--dur-amb`/`--dur-amb-drift` are deliberately left un-collapsed for this reason.
- `[data-ambient]` is the generic opt-in attribute any future ambient loop should use so this one quieting rule covers it automatically.

### View-transition kill block
```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; }
}
[data-motion="reduce"] ::view-transition-group(*),
[data-motion="reduce"] ::view-transition-old(*),
[data-motion="reduce"] ::view-transition-new(*) { animation: none !important; }
```
An author `!important` is required here specifically because native page-morph animations are UA-origin (wins regardless of layer) — both quieting triggers still apply.

### Top-level `@view-transition` rule
`@view-transition { navigation: auto; }` — **line 23**, NOT inside any `@layer`, kept top-level and high in the file deliberately (a layered or late declaration risks the browser ignoring it for navigation). One `<link>` to this file gives every page (all 20+ pages) the calm native page-to-page morph for free, zero per-page CSS required.

---

## 6. Typography detail

| stack var | face(s) | used for |
|---|---|---|
| `--font-work` | Readex Pro 300/400/500/600/700, Inter 400 (silent fallback) | all UI, general Arabic UI (law 4 — NOT Amiri) |
| `--font-quran` | Amiri Quran 400, Amiri, Noto Naskh Arabic, Geeza Pro | `.ayah` — verbatim ayat ONLY |
| `--font-scrip` | Amiri 400/700, Noto Naskh Arabic, Geeza Pro | `.scripture` — hadith + du'a |
| `--font-display` | Marcellus 400, Georgia, Times New Roman | Orbit/Sky English display ≥28px, stat numerals |
| `--font-term` | Aref Ruqaa 400/700, Amiri | the 15 chapter key-terms ≥40px, Farag squares |
| `--font-festival` | Rakkas 400, Marcellus | Festival signage ≥28px; NEVER scripture |
| `--font-marg` | Courier Prime 400, ui-monospace, SFMono-Regular, Menlo | marginalia ONLY: dates, counters, footnotes |

**Arabic laws**: `letter-spacing:0` ALWAYS (Arabic is connected — any tracking breaks glyph joining). Line-height 1.8+ minimum for Arabic body (`.ayah` lh 1.9, `.scripture` lh 1.85, general `[lang="ar"]` UI lh 1.8) vs 1.6 for Latin body. `unicode-bidi: isolate` on all Arabic/RTL containers so mixed Arabic/Latin lines never scramble. `[dir="rtl"] { unicode-bidi: isolate; }` globally.

**Font file loading**: self-hosted `@font-face` in `@layer tokens`, CSS-relative `src:url('fonts/....woff2')` — resolves from THIS file's own `shared/` folder to `shared/fonts/...`, file://-safe. **NEVER a leading-slash `/shared/fonts/...`** — root-absolute under RFC 3986, resolves to filesystem root under `file://`, 404s every font on double-click review. Same law applies to `--grain: url('img/grain.png')`.

Font weights shipped: Readex Pro 300/400/500/600/700; Amiri 400/700; Amiri Quran 400; Marcellus 400; Aref Ruqaa 400/700; Rakkas 400; Courier Prime 400; Inter 400 (fallback-only).

---

## 7. Page-authored `@layer screens` precedent (learn.html, L26–45)

learn.html has ONE `<style>` block, placed AFTER the engine `<link>`:
```html
<link rel="stylesheet" href="shared/awba-engine.css">
<script src="shared/awba-engine.js"></script>
<style>
  @layer screens {
    #streakStrip { appearance:none; -webkit-appearance:none; background:none; border:0; padding:0; margin:0; font:inherit; color:inherit; text-align:inherit; ... }
    /* + the quiet marginalia affordance on the daily-ayah card */
  }
</style>
```
**What is allowed in a page's own `@layer screens { }` block**:
- Only a CONTENT block for the already-declared `screens` name (never the bare name-list order line).
- Narrow, page-specific seam styling — here, converting `<div>`s to native `<button>`s (D-62/R-9) and resetting UA button chrome so the shipped `.ob-streak` class styling reads unchanged.
- Zero new tokens, zero new hex — every value must be a shipped variable (explicitly stated in the file's own comment).
- The register `:focus-visible` ring rides in automatically from the engine grammar — must NOT be re-authored per-page.

This is the model v2 builders should copy: engine `<link>` first, then one small `<style>@layer screens{...}</style>` block only for unavoidable page-specific seams (native-element resets, etc.) — never for new design decisions.

---

## 8. Contrast facts

### Banned pairings
- **Crimson on Kiswah (Orbit) = 2.65:1 — BANNED.** Every Orbit-ground accent uses gold or ember instead. This is why `.tab.active`, the paper-press active border, and focus rings all get explicit Orbit overrides re-inking crimson→gold.
- `--apricot` (Horizon Apricot) is NEVER text on cream (not AA) — decorative glow/background only (`.rw-returns::before`, `--dawn` glow, `.reg-sky-night::before`).
- `--mustard` and `--pink` (Festival fills) NEVER carry text, ever.
- `--rose` (Rose Ember) is a retry FRAME only (D-A12) — never red, never load-bearing text.
- `--ink-40` (2.56:1) FAILS WCAG 1.4.11 non-text contrast on cream — do not use for any shape-carrying border/indicator (superseded by `--ink-62` at 5.02:1, per WR-04 comment at L887).

### Known-good verified values (cited inline throughout the file as "§2.1 ... X:1")
- Gold on Kiswah: **8.40:1** (also cited as 6.95–8.40:1 range depending on context) — the standard Orbit accent value.
- Cream on Kiswah: **16.22:1**.
- `--paper-85` on Kiswah, `--paper-62` on Kiswah: **6.69:1** (clears WCAG 1.4.3).
- Crimson on cream: **6.13:1**.
- Ember on Kiswah: **5.05:1** (working warmth, never alarm — used for the review timer's "low" state and timeout notes).
- Olive on cream: **4.95:1** (D-A9 sound/verified grade ink).
- Madder on cream: **5.44:1**.
- `--ink-62` on cream: **5.02:1** (clears 1.4.11's 3:1 non-text threshold).
- Cream on Last Third (Sky): **13.42:1**.
- Moonmilk on Sky: **13.89:1**.
- Cream/navy-family on Kiswah (the `.oh-chip-sq` island): **13.33:1**.

### "CONTRAST NOTE" conventions
Every colour choice in `@layer screens` carries an inline comment of the form `/* §2.1 --token on ground, X.XX:1 */` citing the exact ratio and its source (03-UI-SPEC-ATHAR §2.1). v2 builders should follow this same annotation convention for any new colour pairing — cite the exact ratio inline, never leave a bare colour choice unexplained. When placing an existing component on a NEW ground register, check whether an override already exists for that ground (search for `.reg-orbit`/`.reg-sky-night`/`.nightfall` scoped rules first) before assuming the base rule's contrast holds — several documented gotchas (`.ls-back` on `.reg-sky-night`, `.rv-shell .opt:active`, `.tab.active`) exist precisely because a shipped component's DEFAULT ink fails on a different register and needed a register-scoped override.
