---
phase: 3
slug: components-icon-kit-motion-language
doc: UI-SPEC-ATHAR
status: draft
authored_by: Opus (design-contract author)
supersedes: 03-UI-SPEC.md, and the D-44 human-gate checklist
authority: .planning/ATHAR-SYSTEM.md  (the LOCKED design contract — canon; this doc never contradicts it)
adoption: docs/superpowers/specs/2026-07-12-athar-adoption-design.md  (Gate 2 lock — pure Athar, total replacement)
created: 2026-07-12
---

# Phase 3 (re-cut) — UI Design Contract · THE ATHAR SYSTEM

> **This document is the single executable design source for the Athar re-skin.** Executors need
> NO other design reference. Where a value here disagrees with anything in the superseded
> `03-UI-SPEC.md`, the old spec is wrong: **this document wins.** Where a value here disagrees with
> `.planning/ATHAR-SYSTEM.md`, the **contract wins** — flag it, do not silently diverge.
>
> **What this supersedes:**
> - `03-UI-SPEC.md` (the Gen-3 "cream field / indigo shadow / gummy press / per-unit accent"
>   contract) — retired wholesale as design authority for this repo.
> - The **D-44 10-item human-gate checklist** — retired. The new plain-language gate is §9 below.
> - The `preview.html` §1–12 sections as gate material — rebuilt as an Athar reference (§8 below).
>
> **What it does NOT touch (the invisible machine survives — adoption §"What survives"):**
> - The cascade architecture `@layer tokens, base, components, screens, motion;` — declared ONCE,
>   order immutable, `motion` last = reduced-motion supremacy. Phase 3 re-cut writes only
>   *content blocks* for names already declared. **Never re-declare the layer-order statement.**
> - `AwbaLesson(cfg)`/`AwbaReview(cfg)` data contract; `scripts/validate-content.js` freeze;
>   `AW.S`/`AW.prefs`/state layer + 37 tests; the `AW.cite` `<span class="cite" data-ref="…">`
>   byte-shape (the validator regex depends on it — breaking it breaks the Phase-4 port gate).
> - Zero-build / zero-CDN / classic scripts / `file://` double-click; **font `src` URLs are
>   CSS-relative** (`'fonts/…'`), never a leading slash. The grain URL is `'img/grain.png'`,
>   never `/shared/img/…`.
> - `AW.icon / AW.cite / AW.wire / AW.sheet / AW.sheetRef / AW.sheetTerm / AW.reducedMotion /
>   AW.animate` — skin-agnostic JS; they survive. `AW.confetti` is **retired** (see §4).
>
> **Immutable Athar laws bound to every visual below (from the 10-law constitution):**
> 1. One register per screen — exactly one ground; other registers appear only as tokens.
> 2. Aniconism absolute — no faces, no mascots, no limbs, ever.
> 3. Scripture law — Amiri only, ≥1.35–1.5× adjacent Latin, lh 1.9, ﴾…﴿, full tashkeel, strongest
>    ink on the page, the ONLY glow permitted, never on texture/pattern, nothing celebratory adjacent.
> 4. One workhorse — Readex Pro carries ALL UI text in both scripts, in every register.
> 5. Display faces rationed (§2 type roles).
> 6. One grain — a single tiled PNG over every ground (~2–3% cream, ~5–9% dark); no runtime turbulence.
> 7. Accent budget — ≤10% expressive colour on a working screen; a daily screen sees ≤6 colour tokens.
> 8. Wrongness is a strike, never a colour — grey ink-blot fade + one-line explanation; Rose Ember
>    frames the retry only; never red, nothing shakes, nothing flashes.
> 9. The centre never animates — one verb per register (draw/settle/breathe/drift/stamp), one easing
>    family `cubic-bezier(0.23,1,0.32,1)`, UI ≤300ms, ambient 4–6s, all gated by reduced-motion.
> 10. Artefacts private by default — completion pieces carry date + seed as a maker's mark.

---

## 0 · Design System

| Property | Value |
|---|---|
| Tool | none (vanilla HTML/CSS/JS, zero build — hard constraint) |
| Token architecture | inherited ONE stylesheet `shared/awba-engine.css`, `@layer tokens, base, components, screens, motion`. This re-cut **rewrites the `tokens` layer values, refills `base`/`components`/`motion`** — never re-declares the layer-order line. |
| Component library | none — the shared library in `shared/awba-engine.js` (already built) is re-skinned via CSS only, except: remove `AW.confetti`, remove `AW.KIT['lantern-gold']` (see §5). |
| Icon library | `AW.KIT` (20 scenes) + `AW.GLYPHS` (13 glyphs), **re-inked** to the currentColor + `--icon-accent` model (§5). No runtime recolour. |
| Font | Readex Pro (sole workhorse) · Amiri + Amiri Quran (scripture) · Marcellus · Aref Ruqaa · Rakkas · Courier Prime — all self-hosted subset `.woff2`, zero CDN (§2). |
| Grain | `shared/img/grain.png` (128×128 tileable PNG-8, committed). One tile, every ground (§2.6). |
| Verification vehicle | `preview.html` at repo root — rebuilt as the Athar living reference (§8). |

**Font vendoring is DONE and committed (b66b75a).** The subset `.woff2` files are on disk in
`shared/fonts/`, Arabic shaping HarfBuzz-verified: `readex-pro-{300,400,500,600,700}`,
`marcellus-400`, `aref-ruqaa-{400,700}`, `rakkas-400`, `courier-prime-400`, plus the pre-existing
`amiri-{400,700}` and `amiri-quran-400`. The grain tile is committed at `shared/img/grain.png`
(128×128 tileable PNG-8, built for a 2–9% opacity overlay). `inter-400` stays on disk as a **silent
glyph-fallback** (coverage finding below); **Poppins is fully retired** — remove the four `poppins-*`
faces and all Poppins references. Reference these exact files in the `@font-face` block (§2.2).

---

## 1 · Header — authority & precedence (restated for executors)

- **Canon:** `.planning/ATHAR-SYSTEM.md`. On any conflict, the contract wins.
- **This doc supersedes:** `03-UI-SPEC.md` + the D-44 checklist (see box above).
- **Coverage report — RESOLVED (settled fact, not speculation):** Readex Pro contains **all**
  ḥ-class Latin diacritics (`U+1E25` etc.) but does **not** contain `U+02F9 ˹` / `U+02FA ˺` (absent
  from the Google Fonts source itself). Therefore **Inter is listed as the silent glyph-fallback
  immediately after Readex Pro** in the workhorse stack — it catches only ˹ ˺ (which appear solely in
  Clear-Quran translation prose, set in the workhorse per scripture law) and is **never a design
  voice**. `--font-work` is finalised in §2.2; no conditional remains.
- **Grain tile — DONE:** committed at `shared/img/grain.png` (128×128 tileable PNG-8). Referenced at
  the CSS-relative path `'img/grain.png'` (§2.6). Never an inline SVG turbulence filter (law 6).

---

## 2 · Token sheet (transplant-ready)

All tokens live in `@layer tokens { :root { … } }`. Rewrite the existing `:root` body with the
values below. **Delete** every `[data-unit="u1..u4"]{…}` block and every `--accent*` custom
property — the per-unit colour mechanism is gone (§3 dismantle).

### 2.1 · Colour — the 17 tokens, register-grouped

Contract colours, verbatim hex. Grouped by register so a daily screen pulls ≤6 (law 7). Named to
the contract; CSS names are short and stable.

```css
/* ── CORE (Orbit + shared) ─────────────────────────────────── */
--kiswah:    #131013;  /* Kiswah Black  — Orbit ground; the ink on cream */
--cream:     #F3EDE2;  /* Haram Cream   — Page/Festival ground; the ink on dark */
--crimson:   #A32C21;  /* Mihrab Crimson— Page rubrication / jadwal rules / Page accent (≤10%) */
--ember:     #E8502A;  /* Farag Ember   — thermal "in progress"; TEXT only on dark grounds */
--gold:      #D9A441;  /* Hajar Gold    — earned thread, rosette seals, thermal "mastered"; dark-ground accent + focus ring */
--navy:      #1B2436;  /* Layl Navy     — deep structural panel; un-inked Ring rows base */

/* ── PAGE ──────────────────────────────────────────────────── */
--madder:    #8F4B58;  /* Madder Wash   — secondary Page ink: metadata, doodles-at-rest, marginalia tint */
--nightfall: #201418;  /* Nightfall     — the interstitial ground ONLY (a moment, not a dark mode) */

/* ── SKY ───────────────────────────────────────────────────── */
--lastthird: #251D46;  /* Last Third    — night canvas ground */
--moonmilk:  #F4F0F7;  /* Moonmilk      — night text */
--apricot:   #F0A583;  /* Horizon Apricot — dawn/horizon warmth; the --dawn degree */
--powder:    #A9BFEE;  /* Powder Veil   — thermal "not yet" (cool end) */
--rose:      #E7A5B4;  /* Rose Ember    — gentle retry FRAME only; never red; never load-bearing text */

/* ── FESTIVAL ──────────────────────────────────────────────── */
--harissa:   #C13A20;  /* Harissa Tomato — Festival primary folk red */
--olive:     #6B682A;  /* Za'atar Olive  — Festival ink / secondary */
--mustard:   #E3A63A;  /* Mustard        — Festival fill; NEVER carries text */
--pink:      #EFB5AC;  /* Souk Pink      — Festival fill; NEVER carries text */
```

**Ink hierarchy is opacity ramps of the two ground inks — NOT new colours** (keeps the ≤6-token
budget honest; a screen using `--ink-62` is still "one colour"):

```css
/* on CREAM grounds — ink = kiswah */
--ink:     var(--kiswah);
--ink-85:  rgba(19,16,19,.85);   /* strong body */
--ink-62:  rgba(19,16,19,.62);   /* secondary / captions */
--ink-40:  rgba(19,16,19,.40);   /* muted / disabled ink, quiet icons */
--rule:    rgba(19,16,19,.12);   /* jadwal hairline, card keyline, dividers on cream */

/* on DARK grounds — ink = cream */
--paper-85: rgba(243,237,226,.85);
--paper-62: rgba(243,237,226,.62);
--paper-45: rgba(243,237,226,.45);
--edge:     rgba(243,237,226,.14); /* light-edge hairline / separation on dark (never a drop shadow) */
```

**AA verification — every text/ground pairing, real rendered sizes (ratios computed this session):**

*Orbit — Kiswah Black `#131013` ground:*

| Text token | Ratio | AA (normal 4.5 / large·non-text 3.0) | Verdict |
|---|---|---|---|
| Cream `#F3EDE2` | 16.22:1 | ✓ / ✓ | body + everything |
| Moonmilk `#F4F0F7` | 16.79:1 | ✓ / ✓ | body |
| Powder `#A9BFEE` | 10.24:1 | ✓ / ✓ | thermal dot / small text |
| Apricot `#F0A583` | 9.37:1 | ✓ / ✓ | horizon accent / text |
| Rose `#E7A5B4` | 9.39:1 | ✓ / ✓ | retry frame |
| Gold `#D9A441` | 8.40:1 | ✓ / ✓ | earned thread, focus ring, thermal mastered |
| Ember `#E8502A` | 5.05:1 | ✓ / ✓ | thermal in-progress, small text OK |
| Crimson `#A32C21` | 2.65:1 | ✗ / ✗ | **BANNED on Orbit** (Page-only ink) |

*Page / Festival — Haram Cream `#F3EDE2` ground:*

| Text token | Ratio | AA (4.5 / 3.0) | Verdict |
|---|---|---|---|
| Kiswah `#131013` | 16.22:1 | ✓ / ✓ | body, headings, strongest ink |
| Navy `#1B2436` | 13.33:1 | ✓ / ✓ | alt strong ink |
| Crimson `#A32C21` | 6.13:1 | ✓ / ✓ | rubrication, kickers, focus ring, jadwal |
| Madder `#8F4B58` | 5.44:1 | ✓ / ✓ | secondary ink, marginalia |
| Olive `#6B682A` | 4.95:1 | ✓ / ✓ | Festival ink |
| Harissa `#C13A20` | 4.63:1 | ✓ / ✓ | Festival red text (small OK, just clears 4.5) |
| Ember `#E8502A` | 3.21:1 | ✗ / ✓ | **large text ≥24px/≥18.66px-bold or shape/border only** — never small body |
| Gold `#D9A441` | 1.93:1 | ✗ / ✗ | **never text or lone indicator on cream** — filled shape w/ ink outline only |

*Sky night — Last Third `#251D46` ground (gradient darkest stop `#1C1637` only brightens ratios):*

| Text token | Ratio | AA (4.5 / 3.0) | Verdict |
|---|---|---|---|
| Moonmilk `#F4F0F7` | 13.89:1 | ✓ / ✓ | night body |
| Cream `#F3EDE2` | 13.42:1 | ✓ / ✓ | night body alt |
| Powder `#A9BFEE` | 8.47:1 | ✓ / ✓ | thermal not-yet, constellation |
| Rose `#E7A5B4` | 7.77:1 | ✓ / ✓ | retry frame |
| Apricot `#F0A583` | 7.76:1 | ✓ / ✓ | horizon, du'a accent |
| Gold `#D9A441` | 6.95:1 | ✓ / ✓ | thread, focus ring |

*Nightfall `#201418` ground:* Moonmilk 15.88:1 ✓, Cream 15.34:1 ✓, Gold 7.95:1 ✓, Rose 8.89:1 ✓.
*Festival cream:* Harissa 4.63:1 ✓, Olive 4.95:1 ✓, Kiswah 16.22:1 ✓, Crimson 6.13:1 ✓.

**Load-bearing contrast rulings (do not deviate):**
- **Ember is a dark-grounds text colour.** On cream it is a *shape/border/large-display* colour only
  (3.21:1). Thermal "in progress" on Page is a **half-inked dab shape**, not ember body text.
- **Gold never texts or lone-indicates on cream** (1.93:1). On Page, "mastered" is a gold **rosette
  filled shape with a `--rule` ink keyline** + the check glyph — shape carries it, gold is fill.
- **Powder never lone-indicates on cream** (1.58:1) — "not yet" on Page is a **hollow ink ring**
  (stroke `--ink-62` = 5.02:1 on cream — this border IS the shape-first signal, so it must clear
  WCAG 1.4.11's 3:1 non-text/UI-component threshold; the earlier `--ink-40` computed to only 2.56:1
  and failed it, WR-04); powder is its home only on dark grounds (Orbit/Circle/Sky).
- **Rose retry frame on cream is 1.73:1 — decorative, never the signal.** The WCAG-load-bearing
  signals of a wrong answer are the **grey ink-blot + the one-line explanation text** (`--ink-85`)
  + the shape change. Rose only tints the frame; reinforce it with a 2px border **and** the text.
  (On dark grounds rose clears 3:1, but the text still carries the meaning.)

**Focus-ring colours (AA-checked non-text ≥3.0, recoloured per ground):**
- Cream grounds (`.reg-page`, `.reg-festival`): **Crimson** ring — 6.13:1 on cream. ✓
- Dark grounds (`.reg-orbit`, `.reg-sky-night`, Nightfall): **Gold** ring — 6.95–8.40:1. ✓

### 2.2 · Type roles

**`@font-face` block (transplant-ready — matches the committed files; `src` CSS-relative, never a
leading slash).** Replace the Gen-3 Poppins/Inter-as-voice block with this. Inter 400 is retained
solely as the ˹ ˺ glyph-fallback:

```css
@font-face{ font-family:'Readex Pro'; font-weight:300; font-display:swap; src:url('fonts/readex-pro-300.woff2') format('woff2'); }
@font-face{ font-family:'Readex Pro'; font-weight:400; font-display:swap; src:url('fonts/readex-pro-400.woff2') format('woff2'); }
@font-face{ font-family:'Readex Pro'; font-weight:500; font-display:swap; src:url('fonts/readex-pro-500.woff2') format('woff2'); }
@font-face{ font-family:'Readex Pro'; font-weight:600; font-display:swap; src:url('fonts/readex-pro-600.woff2') format('woff2'); }
@font-face{ font-family:'Readex Pro'; font-weight:700; font-display:swap; src:url('fonts/readex-pro-700.woff2') format('woff2'); }
@font-face{ font-family:'Amiri';      font-weight:400; font-display:swap; src:url('fonts/amiri-400.woff2') format('woff2'); }
@font-face{ font-family:'Amiri';      font-weight:700; font-display:swap; src:url('fonts/amiri-700.woff2') format('woff2'); }
@font-face{ font-family:'Amiri Quran';font-weight:400; font-display:swap; src:url('fonts/amiri-quran-400.woff2') format('woff2'); }
@font-face{ font-family:'Marcellus';  font-weight:400; font-display:swap; src:url('fonts/marcellus-400.woff2') format('woff2'); }
@font-face{ font-family:'Aref Ruqaa'; font-weight:400; font-display:swap; src:url('fonts/aref-ruqaa-400.woff2') format('woff2'); }
@font-face{ font-family:'Aref Ruqaa'; font-weight:700; font-display:swap; src:url('fonts/aref-ruqaa-700.woff2') format('woff2'); }
@font-face{ font-family:'Rakkas';     font-weight:400; font-display:swap; src:url('fonts/rakkas-400.woff2') format('woff2'); }
@font-face{ font-family:'Courier Prime'; font-weight:400; font-display:swap; src:url('fonts/courier-prime-400.woff2') format('woff2'); }
@font-face{ font-family:'Inter';      font-weight:400; font-display:swap; src:url('fonts/inter-400.woff2') format('woff2'); } /* silent ˹ ˺ glyph-fallback ONLY */
```

**Workhorse stack — FINAL (Inter is the silent ˹ ˺ fallback; Poppins retired):**

```css
--font-work:     'Readex Pro', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
--font-quran:    'Amiri Quran', 'Amiri', 'Noto Naskh Arabic', 'Geeza Pro', serif; /* .ayah — verbatim ayat ONLY */
--font-scrip:    'Amiri', 'Noto Naskh Arabic', 'Geeza Pro', serif;                /* hadith + du'a */
--font-display:  'Marcellus', Georgia, 'Times New Roman', serif;                  /* Orbit/Sky English display ≥28px */
--font-term:     'Aref Ruqaa', 'Amiri', serif;                                    /* the 15 chapter key-terms ≥40px, in Farag squares */
--font-festival: 'Rakkas', 'Marcellus', serif;                                    /* Festival signage ≥28px; NEVER scripture */
--font-marg:     'Courier Prime', ui-monospace, 'SFMono-Regular', Menlo, monospace; /* marginalia ONLY: dates, counters, footnotes, the Ibrahim line */
```

`--font-work` is the *only* stack Clear-Quran translation prose (with its ˹ ˺ corner brackets) is
ever set in — so the Inter fallback is only ever reached for those two codepoints. Never add Inter to
any other stack.

**Glyph-coverage law (settled findings — bake in, do not re-litigate):**
- **Scripture is Amiri / Amiri Quran ONLY**, which carry the full Quranic mark set (`U+0657–065F`) +
  the ornate brackets `U+FD3E ﴾` / `U+FD3F ﴿`. All ﴾…﴿ + full-tashkeel strings render in these faces.
- **Readex Pro** carries common tashkeel `U+064B–0656` + `U+0670` but **lacks the rare Quranic marks
  `U+0657–065F`.** **Aref Ruqaa** lacks `U+0659`,`U+065B–065F`. **Rakkas** lacks `U+0659`,`U+065A–065F`.
  Therefore: **no Quranic / heavy-tashkeel string is ever set in Readex Pro, Aref Ruqaa, or Rakkas.**
  The 15 chapter key-terms in Aref Ruqaa use the **plain or common-tashkeel form only** (never a
  rare-mark vocalisation). Arabic UI strings in Readex Pro stay to common tashkeel. This is safe
  because every heavy-tashkeel string in the app is scripture, which is Amiri-only by law 3.
- The ﴾…﴿ brackets (`U+FD3E`/`U+FD3F`) are present in all Arabic faces; the Clear-Quran translation's
  ˹ ˺ corner brackets (`U+02F9`/`U+02FA`) are the only glyphs Readex Pro misses → the Inter fallback.

**Role → face / size / lh / weight (Latin + Arabic; fluid clamp where warranted):**

| Role | Token | Face / weight | Size | lh | Notes |
|---|---|---|---|---|---|
| Body (Latin) | `--fs-body` | Readex Pro 400 | `1rem` (16px) | 1.6 | all reading prose; 300 allowed only ≥18px soft intros |
| Body (Arabic UI) | `--fs-ar-ui` | Readex Pro 400 | `1.1rem` (17.6px) | **1.8** | Arabic UI strings — workhorse, NOT Amiri (law 4); ls 0 |
| UI / meta | `--fs-ui` | Readex Pro 400/500 | `0.875rem` (14px) | 1.45 | controls, captions |
| Section / quiz Q | `--fs-h2` | Readex Pro 500/600 | `clamp(1.125rem,1.05rem+0.4vw,1.25rem)` (18→20) | 1.3 | |
| Screen title | `--fs-h1` | Readex Pro 600 | `clamp(1.375rem,1.25rem+0.6vw,1.625rem)` (22→26) | 1.18 | Readex title (Page); Marcellus is the *display* face, not this |
| Display (Orbit/Sky) | `--fs-display` | **Marcellus 400** | `clamp(28px,1.6rem+1.6vw,46px)` | 1.08 | law-5 floor 28px; home/Sky headlines, stat numerals |
| Chapter term (Ar) | `--fs-term` | **Aref Ruqaa 400/700** | `clamp(40px,2rem+2vw,48px)` | 1.0 | law-5 floor 40px; clipped in a Farag square; `--ember`/`--crimson` ink |
| Festival signage | `--fs-festival` | **Rakkas 400** | `clamp(28px,2rem+1vw,34px)` | 1.2 | law-5 floor 28px; plates/posters only; never on scripture screen |
| Marginalia | `--fs-marg` | **Courier Prime 400** | `0.6875rem`–`0.75rem` (11–12px) | 1.4 | dates, "18/65", footnotes, the Ibrahim line; ls .1–.26em per context |
| **Ayah (verbatim)** | `--fs-ayah` | **Amiri Quran 400** | `clamp(24px,22.4px+0.4vw,27px)` | **1.9** | ≥1.5× the 16px translation beneath it; ﴾…﴿; full tashkeel; strongest ink; the only glow |
| Hadith / du'a (Ar) | `--fs-scrip` | **Amiri 400/700** | `23px` (≈1.44× body) | 1.85 | ﴾…﴿ not used (hadith); full tashkeel; scripture-law ink |

**Scripture law — the binding block (law 3):**
- `.ayah` = Amiri Quran only; general Amiri (`.scripture`) for hadith/du'a. Never Readex, never a
  display face.
- Size ≥1.35–1.5× the *adjacent Latin* it sits with. Since the translation beneath is `--fs-body`
  (16px), the ayah floor is **24px** (1.5×). If ever placed beside `--fs-ui`, the floor drops
  proportionally but never below 24px.
- lh 1.9 (ayah) / 1.85 (hadith); `letter-spacing:0` always; `unicode-bidi:isolate`; `dir="rtl"`.
- **Strongest ink on the page:** `--kiswah` on cream / `--cream` on dark — full opacity, no ramp.
- **The only glow any element may carry:** a soft `text-shadow` is permitted ONLY on scripture, and
  only on dark grounds (Sky/Nightfall): `text-shadow: 0 0 24px rgba(244,240,247,.30)`. Nothing else
  in the system glows.
- **Never on texture/pattern:** a scripture block sits on clean ground — the grain pseudo-element
  (§2.5) must not render within a scripture panel (`--go:0` on that wrapper, or no `.grain` on it).
- **Nothing celebratory adjacent:** no dab/thread/stamp/rosette in the same panel as scripture.
- Transliteration + translation under every display-Arabic moment — no exceptions.

**Rationing enforcement (law 5):** Marcellus ≥28px; Aref Ruqaa ≥40px; Rakkas ≥28px. **Rakkas and
Aref Ruqaa never share a screen.** Courier Prime never sets body text. A grep gate should assert no
`font-family: … Rakkas` and `font-family: … Aref` selectors resolve on the same register scope.

### 2.3 · Spacing

**DECISION (D-A1): retain the Phase-1 4px scale verbatim.** The manuscript world still needs a
consistent vertical rhythm; nothing in the contract argues for a different base unit, and keeping
the token names avoids churn across every component reference. Keep exactly:

```css
--sp-2: 2px;  --sp-1: 4px;  --sp-2s: 8px; --sp-3: 12px; --sp-4: 16px;
--sp-5: 20px; --sp-6: 24px; --sp-8: 32px; --sp-12: 48px; --sp-16: 64px;
```

`--sp-2` (2px) is the hairline exception — now doing double duty as the **jadwal margin-rule width**
and card keyline. 44px touch-target minimum and `env(safe-area-inset-*)` sit outside the scale.

### 2.4 · Radii — the Athar manuscript scale

**DECISION (D-A2): replace the soft/large Gen-3 radii (8–28px + pill everywhere) with a shallow,
crisp print scale.** A manuscript leaf, a ruled margin, a stamped plate, a tipped-in card — these
have shallow, honest corners. The 24–28px "gummy app bubble" radius reads as modern SaaS and
contradicts the paper world, so it is retired. Justification per tier below.

```css
--r-square: 0;      /* Farag squares (Aref Ruqaa terms), plate frames, jadwal cells — hard manuscript corners */
--r-1: 3px;         /* input fields, chips, small controls — a barely-eased edge */
--r-2: 6px;         /* tiles, options, cards — a tipped-in leaf */
--r-3: 10px;        /* buttons, primary panels */
--r-4: 14px;        /* sheet top corners, large panels (paper laid down — the "settle" object) */
--r-round: 50%;     /* thermal dabs, rosette seal, Ring head-dot, node — the pilgrim-dab is a circle */
--r-pill: 999px;    /* RATIONED: thermal state chip + marginalia counter capsule only, never a card */
```

Rationale: `--r-square` exists because the contract literally places chapter terms in *Farag
squares* and plates in hard folk frames. Buttons/tiles carry a shallow ease (they are still tappable
UI, not decorative paper) but at 6–10px, half the Gen-3 value. Sheets keep the largest ease (14px)
because a sheet is "paper laid on cloth" — the largest paper object. Circles are reserved for the
tawaf-dab vocabulary (dabs, rosette, Ring head, node). The 999px pill is demoted from "every chip"
to two uses.

### 2.5 · Shadows & depth — ink-based, never indigo

**DECISION (D-A3): depth reads differently on cream vs black, and never as a coloured glow.** Gen-3's
indigo-tinted shadows (`rgba(37,54,206,a)`) are retired entirely (grep gate: no `rgba(37,54,206`,
no `rgba(37,54,` anywhere). On paper, objects cast a faint *warm-ink* shadow and manuscripts separate
regions with *ruled keylines*. On a black ground a dark shadow is invisible, so depth there is a
*light edge* — the highlight where light catches a lifted edge — plus tint separation.

```css
/* CREAM grounds — warm-ink drop shadows (tight, low-opacity: paper, not float) + keyline */
--sh-1: 0 1px 2px rgba(19,16,19,.06);
--sh-2: 0 6px 18px rgba(19,16,19,.10);
--sh-3: 0 18px 48px rgba(19,16,19,.16);       /* sheet */
--keyline: 0 0 0 1px var(--rule);              /* manuscript separation — the primary depth cue on cream */

/* DARK grounds — light edge, NEVER a drop shadow */
--edge-top:  inset 0 1px 0 rgba(243,237,226,.10); /* light catching the top edge */
--edge-line: 0 0 0 1px var(--edge);               /* hairline separation on dark */
```

Usage rule: on Page/Festival, prefer `--keyline` for card/section separation and reserve `--sh-*`
for genuinely lifted objects (the sheet, a pressed-then-raised plate). On Orbit/Sky/Nightfall, use
`--edge-top`/`--edge-line` — a `--sh-*` drop shadow on a dark ground is forbidden (invisible +
wrong material logic).

### 2.6 · Grain application

One tile, every ground (law 6). The parallel-generated `shared/img/grain.png` (128px tileable).

```css
:root { --grain: url('img/grain.png'); }   /* CSS-relative from shared/awba-engine.css — NEVER a leading slash */

.grain { position: relative; }
.grain::after{
  content:""; position:absolute; inset:0;
  background-image: var(--grain);
  background-repeat: repeat;
  background-size: 128px 128px;              /* native tile size */
  opacity: var(--go, .05);                   /* per-ground density knob */
  pointer-events: none;
  border-radius: inherit;
  z-index: 0;                                /* sits below content (content sets position:relative;z-index:1) */
}
```

**Per-ground `--go` density (harvested from the rendered demo, matched to the contract's ~2–3% cream
/ 5–9% dark):**

| Ground | `--go` |
|---|---|
| Haram Cream (Page / Festival) | `.028` |
| Kiswah Black (Orbit) | `.07` |
| Last Third night (Sky) | `.06`–`.09` |
| Nightfall interstitial | `.05` |

**Scripture exclusion (law 3):** any panel containing `.ayah`/`.scripture` must NOT carry a `.grain`
pseudo-element (set `--go:0` on that wrapper or omit `.grain`). Scripture always sits on clean ground.

### 2.7 · Motion tokens

One easing family for **everything** (law 9). Verbs are recipes on top of it.

```css
--ease: cubic-bezier(0.23,1,0.32,1);   /* THE family — no other curve exists in the system */

/* UI durations — all ≤300ms (law 9) */
--dur-press:  140ms;   /* press feedback (any register) */
--dur-fade:   180ms;   /* micro fade / hover / colour shift */
--dur-stamp:  150ms;   /* Festival stamp */
--dur-draw:   240ms;   /* Orbit ink-stroke reveal (UI-scale) */
--dur-settle: 260ms;   /* Page settle */
--dur-sheet:  280ms;   /* sheet in/out (a large Page settle) */
--dur-drift:  300ms;   /* Circle single-dab settle (UI-scale) */

/* Ambient durations — 4–6s; NEVER collapsed under reduced motion (loops are stopped instead) */
--dur-amb:       5200ms;  /* Sky breathe, halo, gold-thread ambient */
--dur-amb-drift: 6000ms;  /* Circle crowd-drift ambient */
```

**Per-register verb → concrete recipe (keyframes authored in `@layer motion`):**

| Verb (register) | Where | Recipe |
|---|---|---|
| **draw** (Orbit) | Ring inking, ink strokes on the black world | SVG: `stroke-dasharray:<len>; animation: ink-draw var(--dur-draw) var(--ease) both`. `@keyframes ink-draw{from{stroke-dashoffset:var(--len);opacity:0}8%{opacity:1}to{stroke-dashoffset:0;opacity:1}}`. UI-scale (non-SVG reveals): `opacity 0→1 + translateY(4px→0)` over `--dur-draw`. |
| **settle** (Page) | cards, options, sheet, quiz reveals | `@keyframes settle{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}` over `--dur-settle`. "Ink soaks" = the opacity ease only (no blur filter — perf). |
| **breathe** (Sky) | ambient sky, du'a halo, dawn horizon | `@keyframes breathe{from{opacity:.72}to{opacity:1}}` `var(--dur-amb) var(--ease) infinite alternate`; halo variant adds `transform:scale(.97→1)`. |
| **drift** (Circle) | dabs arriving around the Ring | `@keyframes drift{0%{transform:translate(var(--dx),var(--dy)) rotate(28deg);opacity:0}34%{opacity:.85}58%{transform:translate(0,0) rotate(0);opacity:.85}100%{opacity:.85}}`. Crowd = `var(--dur-amb-drift)` staggered `animation-delay`; single UI dab = translate+fade over `--dur-drift`. |
| **stamp** (Festival) | plates, posters, rosette seal | `@keyframes stamp{0%{transform:scale(1.03);opacity:0}60%{opacity:1}100%{transform:scale(1)}}` over `--dur-stamp` (150ms). Instant fill, tiny settle — the wax-seal press. |

**Press feedback (gummy retired — D-A4):** the 5px indigo hard-shadow drop is gone. Press is a quiet
paper press — `translateY(1px)` + a one-step ink deepen of border/fill — over `--dur-press` on
`--ease`, no shadow drop, no bounce, on every tappable. Each register's *hover*/reveal may carry its
verb, but *press* is this one calm motion everywhere (coherence over per-element flourish).

---

## 3 · Register architecture

Four register grounds as scoped classes, plus Nightfall as a Page moment. **One ground per screen
(law 1).** Sky appears over Orbit/Page only as a *tint layer*, never a second ground.

### 3.1 · The four scoped grounds

```css
/* ORBIT — Kiswah Black; the sacred centre (home, Ring, celebrations) */
.reg-orbit{
  background-color: var(--kiswah);
  color: var(--cream);
  --go: .07;
  --icon-accent: var(--gold);      /* icon detail colour on this ground */
}

/* PAGE — Haram Cream; ~90% of minutes (lessons, quizzes, reading, journal) */
.reg-page{
  background-color: var(--cream);
  color: var(--ink);
  --go: .028;
  --rule: rgba(19,16,19,.12);
  --icon-accent: var(--crimson);
}

/* SKY (night) — Last Third gradient; Sky-OWNED screens (du'a, night sessions, constellation) */
.reg-sky-night{
  background: linear-gradient(180deg,#1C1637 0%, var(--lastthird) 58%, #2C2150 100%);
  color: var(--moonmilk);
  --go: .07;
  --icon-accent: var(--gold);
}
.reg-sky-night::before{   /* Horizon Apricot glow at the base — the dawn edge (ambient, not a ground) */
  content:""; position:absolute; left:0; right:0; bottom:0; height:120px; pointer-events:none;
  background: radial-gradient(130% 130% at 50% 122%,
              rgba(240,165,131,.34), rgba(240,165,131,.08) 55%, transparent 78%);
}

/* FESTIVAL — Haram Cream + folk trim; thresholds ONLY (4 plates, poster, Eid, share cards) */
.reg-festival{
  background-color: var(--cream);
  color: var(--ink);
  --go: .028;
  --rule: rgba(19,16,19,.12);
  --icon-accent: var(--harissa);
  padding-top: 44px;               /* clears the checker trim */
}
.reg-festival::before{             /* the folk checker trim — Festival's only chrome, day-of only */
  content:""; position:absolute; left:0; right:0; top:0; height:16px;
  background: conic-gradient(var(--harissa) 25%, var(--cream) 0 50%, var(--mustard) 0 75%, var(--cream) 0);
  background-size:16px 16px; border-bottom:2px solid rgba(19,16,19,.65);
}
```

Every register scope also sets its `:focus-visible` recolour (§4 focus) and its `--icon-accent`
(§5). Circle is **not** a ground — it is the thermal token layer + crowd-drift moments, applied
inside whatever register hosts them (usually Orbit/Sky). It has no `.reg-circle` ground class in
production (the demo's dashed `.reg-circle` panel is documentation only).

### 3.2 · Sky-as-tint over Orbit/Page (law 1 — a tint, never a second ground)

Home is Orbit-ground with a Sky *tint* keyed to the real prayer clock (§7). The tint is an additive
overlay inside the same register — the ground stays Kiswah, so law 1 holds ("Sky appears only as a
token"). Implement as a `data-sky` attribute driving a single overlay gradient:

```css
.reg-orbit[data-sky]{ position: relative; }
.reg-orbit[data-sky]::after{           /* NB: distinct from .grain::after — a screen uses one or nests wrappers */
  content:""; position:absolute; inset:0; pointer-events:none; z-index:0;
  background-image: var(--sky-tint, none);
}
[data-sky="dawn"]      { --sky-tint: linear-gradient(180deg, rgba(240,165,131,.30) 0%, rgba(240,165,131,0) 46%); }
[data-sky="day"]       { --sky-tint: none; }                       /* neutral — the black world, unwarmed */
[data-sky="dusk"]      { --sky-tint: linear-gradient(180deg, rgba(37,29,70,.42) 0%, rgba(37,29,70,0) 42%); }
[data-sky="night"]     { --sky-tint: linear-gradient(180deg, rgba(27,22,52,.55) 0%, rgba(27,22,52,0) 50%); }
[data-sky="lastthird"] { --sky-tint: linear-gradient(180deg, rgba(37,29,70,.62) 0%, rgba(37,29,70,.12) 60%); }
```

The **`--dawn` course-progress warmth** is a *second, independent* apricot degree on home — ambient,
never the metric (§7.4). It layers as an extra low-alpha apricot glow; the Ring is the metric.

*(If a screen needs both grain and a sky tint, nest: an outer `.grain` ground wrapper and an inner
`[data-sky]` layer, so the two pseudo-elements don't collide. Executor discretion; keep the ground = Kiswah.)*

### 3.3 · Thermal state as `data-state`

State colour is app-wide (law: the thermal ramp, always shape-cued). Applied as a `data-state`
attribute on any state-bearing element (dab, node, chip). **Shape is the primary channel; colour is
secondary** (colour-blind safe + cream-ground contrast safe):

```css
[data-state="not-yet"]  { --st: var(--powder);  }   /* cool end */
[data-state="progress"] { --st: var(--ember);   }   /* warming */
[data-state="mastered"] { --st: var(--gold);    }   /* earned */
```

Shape rules (mandatory, both grounds):
- **not-yet** = a **hollow ring** (border 2px). On cream: border `--ink-40` (powder fails 1.58:1);
  on dark: border `--powder`.
- **progress** = a **half-inked dab** (`linear-gradient(90deg, var(--st) 50%, transparent 50%)`),
  ring border `--st`. Ember clears 3:1 on cream as a border/shape.
- **mastered** = a **filled dab + check glyph**. On cream: fill `--gold` with a `--rule` keyline so
  the edge is perceivable; on dark: fill `--gold`, no keyline needed.

The ramp bar (specimen/legend): `linear-gradient(90deg, var(--powder) 4%, var(--ember) 52%, var(--gold) 96%)`.

### 3.4 · Nightfall interstitial

Nightfall is a *Page moment*, not a register of its own — the weightiest ayah dims the room. It is a
full-bleed overlay with ground `--nightfall` `#201418`, text `--moonmilk`, one ayah under scripture
law (with its permitted glow), the line "Sit with this" in Courier marginalia, tap-to-return. No
grain over the ayah; no celebration. Class `.nightfall` (full-screen `.reg`-like overlay); it borrows
Page's ownership but wears its own ground for the one moment — this is explicitly sanctioned by the
contract ("Nightfall as a Page moment").

### 3.5 · Dismantling `data-unit` without breaking `AW.UNIT_ICON`

The Gen-3 mechanism was: `data-unit="u1..u4"` on `<html>` → CSS `[data-unit]{--accent* …}` 7-slot
recolour. **Remove it entirely, CSS-side only:**
- Delete the four `[data-unit="u1..u4"]{…}` blocks and the default `--accent*` set in `:root`.
- No selector in the whole stylesheet may read `[data-unit]` for colour ever again.

`AW.UNIT_ICON = {u1:'compass', u2:'lanterns', u3:'kaaba', u4:'mosque'}` is **pure JS** and is
**untouched** — `data-unit` survives solely as the unit→icon/term key that runner code reads. A page
that still sets `data-unit` has zero colour effect (harmless). This is the contract's "the `data-unit`
mechanism is repupposed: it keeps mapping unit→icon/term, never→colour scale." No JS change is needed
to dismantle the colour mechanism; it is a CSS deletion.

---

## 4 · Component re-skin — every existing class

States listed rest / hover / press / focus / disabled, in Athar tokens. Colour references resolve
against the host register (`color`, `--rule`, `--icon-accent`, `--st`). **Retired** classes and their
functional replacements are called out.

### 4.1 · Buttons & tappables — `.btn` `.opt` `.tf` `.tile` `.tab` `.hstat`

The gummy press is retired (D-A4). All share the **one Athar press**: `translateY(1px)` + ink deepen,
`--dur-press var(--ease)`, no drop shadow.

**`.btn` (primary CTA):**
- *Rest:* fill = register accent as a solid ink block. On **Page**: `background:var(--crimson);
  color:var(--cream)` (Mihrab CTA — this is the ≤10% accent). On **Orbit/Sky (dark)**:
  `background:var(--cream); color:var(--kiswah)` (a cream key on the black world) OR
  `background:transparent; color:var(--gold); box-shadow:var(--edge-line)` for a quieter "gold-thread"
  button. Radius `--r-3`; Readex Pro 600; `letter-spacing:.01em`; padding `--sp-4`. Depth on cream =
  `--sh-1`; on dark = `--edge-top`.
- *Hover (fine pointer):* `filter:brightness(1.04)` on cream fills; on the gold ghost button, fill in
  a `rgba(217,164,65,.12)` wash. `--dur-fade`.
- *Press:* `translateY(1px)`; fill deepens one step (`color-mix(in srgb, <fill> 90%, black 10%)`).
- *Focus-visible:* ground-scoped ring (§4 focus block).
- *Disabled:* `opacity:.5; pointer-events:none;` (v1 rarely disables — the un-loseable promise).

**`.opt` (quiz option, Page):**
- *Rest:* `background:var(--cream); color:var(--ink); border:2px solid var(--rule); border-radius:--r-2`;
  Readex 400; text-align left; `--sh-1` optional. Reveal on mount uses **settle**.
- *Hover:* `border-color:var(--ink-40)`.
- *Press:* `translateY(1px)`; `border-color:var(--crimson)`.
- *Selected-correct (Circle state):* a **gold dot draws itself** at the option's lead (the "draw"
  micro), `border-color:var(--gold)`, fill a `rgba(217,164,65,.10)` wash — no confetti.
- *Selected-wrong (law 8):* `border-color` stays neutral, a **grey ink-blot** dabs over the option
  and fades (`--ink-40`→transparent), a one-line explanation appears beneath in `--ink-85`, and the
  **retry** control is framed by a 2px `--rose` border. Never red, no shake, no flash.
- *Focus/disabled:* as base.

**`.tf` (true/false), `.tile` (word-bank / matching), `.tab` (bottom-nav):** same Page rest chrome
(`--cream`/`--ink`/`--rule` border, radius `--r-2` for tf/tile, `--r-3` for tab), same one-press,
same ground-scoped focus. `.tab` active-state = `color:var(--crimson)` + a 2px `--crimson` top-rule
(a ruled tab, not a filled pill); icon via `--icon-accent`. `.tab` items keep the 44px min target.

**`.hstat` (HUD stat — noor/returns/streak):** Athar re-frame — the HUD reads as **marginalia**, not
game chrome. `background:transparent; border:none; color:var(--paper-62)` on dark / `--ink-62` on
cream; the numeral in `--font-marg` (Courier) or Marcellus (if ≥28px on Orbit); the leading glyph via
`AW.icon` at glyph-ui 18px in `--icon-accent`. No pill fill. Press: `--dur-press` translate only.

### 4.2 · Citation & term chips — `.cite` `.term`

- **`.cite`** (opens the citation sheet): re-inked to Page rubrication. *Rest:*
  `color:var(--crimson); background:transparent; border-bottom:1.5px solid var(--crimson);
  border-radius:0;` inline, Readex 500, `0.9em`, leading cite glyph (`AW.icon('cite')`) inking to
  `--icon-accent`. It reads like a rubricated reference mark, not a filled tag. *Hover:*
  `background: rgba(163,44,33,.08)`. *Press:* `translateY(1px)`. *Focus:* ground ring.
  The `<span class="cite" data-ref="…">` **byte-shape is preserved** (validator) — only CSS changes.
- **`.term`** (opens gloss): *Rest:* `color:inherit; text-decoration:underline dotted var(--crimson);
  text-underline-offset:3px`. *Hover:* underline goes solid `--crimson`. *Press:* `translateY(1px)`.
  *Focus:* ground ring. (On dark grounds, both chips recolour their accent to `--gold` via
  `--icon-accent` / a scoped override, since crimson fails on Kiswah — but citations live on Page in
  practice, so crimson is the default.)

### 4.3 · Bottom-sheet — `.scrim` `.sheet` `.grip` `.sheet-x` + `.r-*` / `.g-*`

The singleton `AW.sheet` primitive survives; re-skin only.
- **`.scrim`:** `background: rgba(19,16,19,.52)` (warm-ink dim, not the old navy `--scrim`). Fade
  `--dur-sheet var(--ease)`.
- **`.sheet`:** `background:var(--cream); color:var(--ink); border-radius:var(--r-4) var(--r-4) 0 0;
  box-shadow:var(--sh-3);` max-width 480 (matches shell). Motion = **settle**: IN
  `translateY(100%)→0` over `--dur-sheet var(--ease)`; OUT the same curve reversed (one easing family
  — no separate ease-in). The sheet is a Page object even when opened from Orbit/Sky (paper laid over
  the world) — it carries the cream ground so scripture inside it renders under Page rubrication.
- **`.grip`:** 40×4, `--r-pill`, `background:var(--rule)`.
- **`.sheet-x`:** 44×44 hit area, `color:var(--ink-40)`; hover `color:var(--ink); background:rgba(19,16,19,.06)`.
- **Citation sheet `.r-*`** (face split preserved): `.r-src` kicker = Courier marginalia,
  `letter-spacing:.14em`, `color:var(--madder)`. `.r-ar.ayah` = Amiri Quran `--fs-ayah` lh 1.9,
  `color:var(--kiswah)` (strongest ink), on clean cream (no grain). `.r-ar` (hadith) = Amiri
  `--fs-scrip` lh 1.85. `.r-mean` translation `--fs-body var(--ink-85)` (carries ˹ ˺). `.r-ref`
  provenance = Courier `--fs-marg italic var(--madder)`. **Pending pill `.r-pill`** = calm neutral:
  `color:var(--ink-62); border:1px solid var(--rule); border-radius:--r-pill; background:transparent`,
  lowercase `unverified · pending review` — never rose, never any warm alarm colour. **Grade pill
  `.r-pill.grade`** = authenticity signal in `--olive` ink + `--olive` hairline (green→olive:
  Athar has no separate affirm-green; Za'atar Olive is the "sound/verified" ink, 4.95:1 on cream).
- **Term gloss `.g-*`:** `.g-ar` = Amiri `--fs-scrip`+ centered (or `--font-term` Aref Ruqaa if the
  term is one of the 15 chapter key-terms shown ≥40px in a Farag square); `.g-tl` transliteration
  Courier/Readex `--ink-62`; `.g-wd` Readex 600 `--fs-h2`; `.g-df` body; `.g-cx` `--fs-ui var(--ink-62)`.

### 4.4 · Retired classes → functional replacements

| Retired | What it did | Athar replacement (same functional moment) |
|---|---|---|
| **`.combo`** | gold "streak ×N" chip, pop-in | **Nothing celebratory.** A correct streak accrues **gold dots on the Ring** (Orbit "draw"). If a count is wanted at all, it is a quiet **Courier marginalia counter** ("3 in a row") — never a floating pill. Delete the class + CSS. |
| **`.perfect`** | full-stage indigo PERFECT overlay | **No mid-quiz overlay.** Per-atom: one brushstroke **draws itself onto the Ring** (Orbit) + Sky closes with a du'a + "Alhamdulillah — continue." Threshold-only celebration = the **Festival plate `.plate`** (stamp). Delete `.perfect` + `--overlay-hero`. |
| **`.confetti` / `.cf`** | falling confetti burst | **Ink dabs drift** (`.dab`, Circle "drift") + **gold thread draws** (Orbit) at thresholds only — never a full-screen rainbow burst, never over scripture. Delete `.confetti`/`.cf` CSS **and remove `AW.confetti` from the engine JS.** |
| **`.companion`** | lantern bob ambient (mascot presence) | **Retired — no ambient mascot** (aniconism reinforced). The lantern lives only as a scene icon (`AW.KIT.lantern`). "Presence" is carried by the **Sky breathing** ambient and the Ring at the centre. Delete `.companion` + `@keyframes bob`/`glow`. |
| **`.breathing-ring`** | pulsing halo on the available node | **Static available-node cue:** an **ink-drawn ring outline + a single gold head-dot** (the tawaf head), no pulse — "the centre never animates" (law 9). Delete `.breathing-ring` + `@keyframes breathe`-as-node-pulse (the *Sky* `breathe` keyframe is a different, retained ambient). |

New celebration classes to author: `.dab` (drift), `.thread` (Orbit gold-thread draw), `.plate`
(Festival stamp), `.rosette` (gold review seal — a filled circle + inked rim + check, stamped).

---

## 5 · Icon re-inking — `AW.KIT` (20) + `AW.GLYPHS` (13)

The Gen-3 icons are two-blue illustrations with warm-lit panels. Athar retires the blue and the
glow (only scripture glows). Icons become **quiet ink line-drawings** that re-ink themselves by
ground.

### 5.1 · The currentColor + `--icon-accent` model (D-A5)

Re-author each SVG (an authored, committed pass — exactly how `lantern-gold` was done; **no runtime
`.replace()` recolour**, law honoured) so that:
- **Structural ink** (the old `#2E6BF5` bodies + `#2536CE` linework) → `fill="currentColor"` /
  `stroke="currentColor"`. The icon then inherits the register's text ink automatically: `--cream`
  on Orbit, `--ink` on Page, `--moonmilk` on Sky. One asset, every ground.
- **Halos & light panels** (`#C9D7F5` blob halo, `#EAF0FE`/`#F4F7FE` lit windows) →
  `fill="currentColor"` at authored low opacity (`opacity=".12"` halo, `opacity=".06"` panel) — an
  ink wash, never a coloured glow. Where a panel should read as negative space, use `fill="none"`.
- **Accent detail** (sparkles, the flame, a key mark — the old `#2536CE` stars) →
  `fill="var(--icon-accent)"`, which each register sets (Page crimson, Orbit/Sky gold, Festival
  harissa). This is the single spot of expressive colour per icon, inside the ≤10% budget.

**Deterministic source-hex → Athar map (apply per icon):**

| Source hex (role) | → Athar |
|---|---|
| `#2E6BF5` (primary body/shape) | `currentColor` |
| `#2536CE` (linework, base ink) | `currentColor` |
| `#C9D7F5` (blob halo) | `currentColor` @ `opacity .12` |
| `#EAF0FE` / `#F4F7FE` / `#DCE6FB` (lit panels/faces) | `currentColor` @ `opacity .06`, or `fill="none"` |
| `#2536CE` sparkle/star marks | `var(--icon-accent)` |
| kaaba dimensional greys (`#5486F8`/`#2450C9`/`#1C3C9C`/`#31489C`) | flatten to `currentColor` @ `.85`/`.62`/`.45` opacity steps (drop the blue dimensionality; keep the light/dark reading in ink) |
| `#A9BCEB` (quran-stand text lines) | `currentColor` @ `.4` |

**Glyph map (`AW.GLYPHS`):**

| Glyph | Source | → Athar |
|---|---|---|
| `flame` | `#F0730B` | `var(--ember)` (thermal warmth) |
| `spark` | `#E8A400` | `var(--gold)` |
| `star` | `#FFD34D`/`#E8A400` | fill `var(--gold)`, stroke `--icon-accent` |
| `cite` | `#2536CE` | `currentColor` (inks to the chip's crimson) |
| `lamp` | `#E8A400`/`#FFF3CC` | `var(--gold)` + panel `currentColor` @ `.08` |
| `check` | `#fff` | `currentColor` (sits on a filled dab; contrast comes from the dab) |
| `lock` | `#AAB4CC` | `currentColor` @ `.45` (a quiet ink lock = "not yet") |
| `chest` | `#fff`/`#B4720C` | `currentColor` + latch `var(--gold)` |
| `trophy` | `#fff` | `var(--gold)` (legendary) |
| `fact`/`remember`/`fard`/`angle` (the 4 lesson markers) | `#2E6BF5` | `var(--icon-accent)` (Page crimson) |

### 5.2 · Colour rules per ground

- Icons inherit `color` from the register (§3), so **default handling = do nothing at the call
  site** — an icon in a `.reg-page` tile is kiswah ink; in a `.reg-orbit` HUD it is cream.
- To quiet an icon below text weight (nodes, muted tiles), set `color:var(--ink-62)` /
  `color:var(--paper-62)` on the icon wrapper.
- `--icon-accent` is register-scoped (§3.1); never hardcode crimson/gold in an icon's markup —
  always `var(--icon-accent)` so a scene icon shown on a dark celebration surface picks up gold, and
  on a Page picks up crimson, from one asset.

### 5.3 · The lantern-gold variant's fate (D-A6)

**`AW.KIT['lantern-gold']` is retired and its entry deleted.** With the currentColor model, the
single `lantern` icon renders gold automatically on any dark/celebration ground (where `color`
resolves to `--cream` and `--icon-accent` to `--gold`) — a bespoke recoloured second asset is
redundant, and removing it deletes the last hex-literal art variant. The lantern remains only as the
one scene icon the contract permits ("the lantern exists only as a scene icon"). `AW.UNIT_ICON`
never referenced `lantern-gold`, so nothing breaks. KIT count returns to 20 scenes.

---

## 6 · Ring generator spec — the tawaf fingerprint (first spike / SPOF)

The Ring is macro progress and the single point of failure — build and judge it **first**, on visual
output, before anything depends on it.

### 6.1 · Inputs

```
ringSVG({
  seed,            // integer, stable per learner — created ONCE, stored in awba_state.ringSeed
                   //   (add to defaultState; migrate: absent → crypto/Math.random int, persisted once)
  atomsDone,       // 0..65 — completed atom count (from AW.state()/stars)
  circuitsDone,    // 0..4  — completed circuits (drives the outer gold thread arcs)
  structure = { circuits:4, lessons:15, atoms:65 },  // the course shape
  size = 300,      // px viewBox is 0 0 size size; CSS scales
  inked            // optional explicit override for demo (else derived from atomsDone)
})
```

### 6.2 · Determinism

- A **seeded PRNG** (mulberry32 or equivalent, ~6 lines, inline in the engine) initialised from
  `seed`. Every jitter (radius, angle, stroke width, opacity, wobble) is drawn from it in a fixed
  order. **Same `seed` + same `atomsDone`/`circuitsDone` ⇒ byte-identical SVG.** No `Date`, no
  `Math.random` inside the generator.
- The seed is the maker's mark (law 10): the completion poster prints `seed` + date in Courier.

### 6.3 · SVG construction (concentric jittered pilgrim-rows, variable stroke, ink-bleed)

Mirrors the rendered demo's tawaf-fingerprint (harvested: many short `<path>` strokes, stroke-width
1.8–4px, opacity 0.45–0.95, round linecaps; un-inked rows faded, inked rows bright; one gold outer
ring).

- **Rows = lessons (15)**, banded into the 4 circuits. Each row is a broken arc at a jittered radius
  (rows march inward/outward from `size/2` centre), composed of **short dab-strokes** (~14–22 per
  row), each a 2–4 point `<path>` with small seeded positional wobble → the hand-inked, ink-bleed
  feel. Round linecaps; no `<filter>` blur (perf + "no runtime turbulence").
- **Variable stroke:** per-dab stroke-width from the PRNG in `[1.8, 4.1]`; per-dab opacity in
  `[0.45, 0.95]`. Ink-bleed is these two variances + round caps — never a blur filter.
- **Colour by state (thermal, shape-cued by density/opacity too):**
  - un-inked dab → `--navy`-ish faint (`#4A5C82` @ ~.5 on the black world) = "not yet".
  - inked dab (its atom complete) → thermal per its circuit's state: in-progress rows warm toward
    `--ember`, completed rows are `--cream` bright, mastered/sealed rows carry `--gold`.
- **Outer gold thread:** one near-full-circle `<path>` stroke `--gold` (width ~1.9, opacity ~.95),
  drawn as **4 arcs** — one per completed circuit; at `circuitsDone === 4` the thread closes the ring.
- **Head-dot:** a single `--gold` filled circle at the current inking frontier (the tawaf head) —
  static (the centre never animates).

### 6.4 · Progressive inking

- Map `atomsDone` → which dabs are inked, in course order (circuit → lesson → atom). Completing an
  atom flips its dab from faint to inked; completing a lesson brightens its whole row; completing a
  circuit draws that circuit's gold arc.
- The **draw** animation (Orbit verb) plays only on the *newly* inked dab(s) when returning from a
  lesson (`ink-draw` on the added strokes' `stroke-dashoffset`). The existing Ring never re-draws.

### 6.5 · Reduced motion & performance

- **Reduced motion:** render the **final inked state statically** — no `stroke-dash` draw, no head
  pulse. `AW.reducedMotion()` gate at call time (the generator returns SVG with animations omitted).
- **Perf budget:** one inline SVG; **≤ ~600 path nodes** total (15 rows × ~22 dabs + thread + head ≈
  340 — comfortably under); no filters; no runtime turbulence; first render < 16ms on a mid mobile.
  Regenerate only on progress change, not per frame.

### 6.6 · Acceptance criteria

1. Same `seed` + progress → identical markup across reloads and machines (determinism test).
2. Two different seeds → visibly different fingerprints (no two learners share a ring).
3. `atomsDone` 0 → all-faint ring; 65 + `circuitsDone` 4 → fully inked + closed gold thread.
4. Reduced motion → the exact final state, zero animation nodes.
5. Reads as **hand-inked tawaf**, not a mechanical progress ring (owner-visual, §9 gate item).
6. ≤600 path nodes; no `<filter>`; renders on the black Orbit ground with AA-legible inked dabs.

---

## 7 · Prayer-clock sky spec (second spike)

Canvas temperature follows the *real* prayer clock — five temperatures, manual-set as the v1 floor,
no geolocation dependency. Ambient, never the metric.

### 7.1 · Five canvas temperatures

| Temperature | Window | `data-sky` | Tint (over Orbit home) / ground (Sky screens) |
|---|---|---|---|
| Post-Fajr brightness | Fajr → sunrise/Duha | `dawn` | apricot warmth from the top (`--sky-tint` dawn) |
| Neutral day | Duha → Maghrib | `day` | no tint — the black world, unwarmed |
| Dusk | Maghrib → Isha | `dusk` | violet dusk from the top (`--sky-tint` dusk) |
| Night | Isha → local midnight | `night` | deeper violet (`--sky-tint` night) |
| **Last-Third violet** | midnight → Fajr | `lastthird` | deepest `--lastthird` violet (`--sky-tint` lastthird); Sky-owned screens use the `.reg-sky-night` ground |

### 7.2 · Trigger logic (manual v1 floor)

```
awba_prefs.prayerTimes = { fajr:"HH:MM", dhuhr:"HH:MM", asr:"HH:MM", maghrib:"HH:MM", isha:"HH:MM" }
                          // stored in awba_prefs (add to defaultPrefs; absent → the DEFAULT below)
awba_prefs.skyMode      = "manual" | "off"   // "off" ⇒ always data-sky="day" (opt-out)
```

- On boot (in the existing `if (typeof document !== 'undefined')` block), compute the current
  temperature from `now` vs the stored times (local time only — reuse the D-16 local-date helpers;
  **never** a UTC serialization). Midnight uses local `00:00`.
- **No geolocation, no network.** If `prayerTimes` is absent, use a sensible **default schedule**
  (e.g. fajr 05:00, dhuhr 13:00, asr 16:30, maghrib 19:30, isha 21:00) so the sky always has a
  temperature; a settings screen (later phase) lets the learner set real times. Manual is the floor;
  location-aware is a future enhancement that writes the same `prayerTimes` blob.
- Set `document.documentElement.dataset.sky` (or on the home shell) to the computed value; CSS §3.2
  paints the tint. Re-evaluate on visibility-change / next open (no timers needed for v1).

### 7.3 · `--dawn` progress warmth

Course progress adds **one degree of horizon apricot** on home — an extra faint apricot glow layered
under the Ring, scaled by `atomsDone/65`. It is **ambient, never the metric** (the Ring is the
metric). Implement as `--dawn: <0..1>` driving the opacity of a second apricot horizon gradient;
cap the max so it never competes with the real prayer-clock tint or the scripture/Ring.

### 7.4 · Reduced motion

The sky temperature is **information/ambience, applied statically** — a static tint is not motion, so
it stays under reduced motion (the learner still sees the right time-of-day). Only the *breathe*
ambient (the slow opacity pulse on the tint/halo) is gated off: `@media (prefers-reduced-motion) /
[data-motion="reduce"] { .sky-breathe { animation: none } }`. The tint itself never animates away.

### 7.5 · Acceptance criteria

1. With default times, opening at 4 different clock times yields 4 correct `data-sky` values (unit-test
   the pure window→temperature function with fixed `now` fixtures).
2. Setting `prayerTimes` changes the boundaries accordingly; no geolocation call ever fires.
3. `skyMode:"off"` ⇒ always `day`.
4. Reduced motion → correct static temperature, zero sky animation.
5. Last-third violet shows in the genuine last-third window (when the app is really opened) — owner
   confirms it "reads like night," not a synthetic reward (§9 gate).
6. `--dawn` warmth is perceptibly ambient and never mistaken for the progress metric.

---

## 8 · New `preview.html` structure (the Athar living reference)

Rebuild `preview.html` as the Athar reference — real `AW.*` output, zero CDN
(`! grep -qE 'https?://(fonts\.googleapis|cdn)' preview.html` must pass; all fonts self-hosted). It
must *feel* like Athar, not a spec dump. Sections:

1. **Register worlds** — the four grounds side by side (`.reg-orbit`, `.reg-page`, `.reg-sky-night`,
   `.reg-festival`), each with its grain `--go`, its `--icon-accent`, a real scene icon, and its
   motion verb named. Proves law 1 (one ground each) at a glance.
2. **Type specimens** — the 6 faces at their rationed roles: Readex Pro (both scripts), Amiri +
   Amiri Quran under scripture law, Marcellus display ≥28px, Aref Ruqaa term ≥40px in a Farag square,
   Rakkas festival ≥28px, Courier marginalia. A note that Rakkas + Aref never co-appear.
3. **Thermal ramp** — the ramp bar + the three `data-state` dabs (not-yet hollow ring / progress
   half-dab / mastered filled+check) shown on **both** cream and dark, proving the shape-cue holds
   where colour contrast is weak.
4. **Component inventory** — real `AW.*`: `.btn` (Page crimson + Orbit ghost-gold), `.opt`/`.tf`/
   `.tile`/`.tab`/`.hstat`, `.cite`/`.term`, all sharing the one Athar press; a wrong-answer demo
   (grey blot + explanation + rose retry frame, law 8) far from any scripture.
5. **Scripture demo (under scripture law)** — a real `.cite` opening the citation sheet for
   `hujurat-49-15` (Qur'an → `.ayah` / Amiri Quran, no grade) **and** `muslim-8` (hadith → general
   Amiri + olive grade pill), plus a `.term` gloss. On clean cream (no grain), strongest ink, nothing
   celebratory adjacent. (Content ported byte-identical from `_MVP-BUILD` — never retyped.)
6. **Ring demo** — `ringSVG` at three states (0 atoms, mid, 65+closed) on the Orbit ground; a note it
   is deterministic per seed; a reduced-motion static render beside the animated one.
7. **Sky demo** — the five temperatures as a row of home cards (`data-sky` dawn/day/dusk/night/
   lastthird), plus the `--dawn` warmth degree shown separately.
8. **Reduced-motion proof** — a `data-motion="reduce"` toggle + a note about the OS setting; the
   reviewer sees the Sky breathe stop, the dabs render settled-in-place, the Ring render static.

The old §1–12 (indigo/gummy/confetti) are removed, not retained — this is a total replacement.

---

## 9 · The new human visual gate (plain language)

Melusi is the product owner, not a designer. He walks `preview.html` and answers yes/no. ~10 items,
zero jargon:

1. **Does every screen feel like it belongs to one calm app** — five different moods, but clearly the
   same product?
2. **Does the black home screen feel like the sacred centre** — quiet, a little sky-warmed, with your
   ring at the heart?
3. **Does the cream lesson page feel like a real page of a book** — warm paper, crisp margins, easy
   to read?
4. **Is the Arabic Qur'an the most important, most beautiful thing on any page it appears on** — and
   is it never sitting on a busy background, never next to anything celebratory?
5. **When you get an answer wrong, does it feel gentle** — a soft grey mark and a one-line
   explanation, nothing red, nothing shaking, nothing flashing?
6. **Do the "not yet / in progress / done" marks make sense even without colour** — can you tell them
   apart by their shape (empty circle / half-filled / filled with a tick)?
7. **Does the ring look hand-drawn and personal** — like your own path traced in ink, not a plain
   loading bar? And would two people's rings clearly look different?
8. **Does the sky match the time of day** — brighter after dawn, violet late at night — without it
   feeling like a fake reward?
9. **Is the celebration rare and tasteful** — a gold thread, a few ink dabs, a festival plate only at
   big milestones — never confetti, never a mascot, never a party mid-quiz?
10. **When you turn on "reduce motion," does everything go still and calm** — the sky stops breathing,
    the ring shows finished, nothing keeps moving?

A "no" on any item is a blocker and routes back to the responsible plan.

---

## 10 · "What got cut" ledger (from the contract + adoption)

| Cut | Why (contract) |
|---|---|
| The 4 unit **accent colour scales** (blue/purple/teal/gold `data-unit` theming) | Units keep structure + icons; colour identity retired. State colour = thermal ramp only. |
| **Gummy press** (5px indigo hard-shadow drop) | Retired for the one Athar paper-press (per-register verbs on one easing family). |
| **Indigo shadows** (`rgba(37,54,206,a)`) + `--overlay-hero` | Depth is ink-based (cream) / light-edge (dark); never a coloured glow. |
| **Amber mercy palette** | Wrongness is a strike not a colour (law 8): grey ink-blot + explanation, Rose Ember frames retry. |
| **Confetti · PERFECT overlay · combo chip · companion bob/glow** | Celebration is Athar (thread draw, dab drift, Festival stamp at thresholds only). No mascot. `AW.confetti` deleted. |
| **Poppins + Inter as design faces** | Readex Pro is the sole workhorse. Poppins fully retired. Inter survives ONLY as the silent ˹ ˺ (U+02F9/02FA) glyph-fallback in `--font-work` — the two codepoints Readex Pro lacks. |
| **`lantern-gold` bespoke recoloured entry** | currentColor + `--icon-accent` re-inks the one lantern by ground; the second asset is redundant (D-A6). |
| Young Serif, Alegreya, Alegreya Sans, IBM Plex Sans Arabic, Hanken Grotesque, Bricolage Grotesque | Merged away — Readex Pro + the rationed display faces only. |
| Samarkand Paper & Samovar Cream; Pomegranate Ink `#6B1F2F`; Nur Gold; Ember's spiral map; the 65-plant Bustān; Fajr's dawn-as-reward | One cream wins (Haram); Kiswah is the ink (+ Madder warmth); Hajar Gold wins; the Ring is the only macro map; Bustān → per-lesson seed-rows + 15 stamps; the Sky tracks real time. |

---

## 11 · Decision log (every judgement call this doc makes)

| # | Decision | Rationale |
|---|---|---|
| **D-A1** | Retain the Phase-1 4px spacing scale verbatim (`--sp-*`). | Manuscript layouts still need a consistent rhythm; no contract reason to change; avoids churn. `--sp-2` (2px) now also = jadwal rule width / keyline. |
| **D-A2** | Replace Gen-3 radii with a shallow print scale (`--r-square 0 … --r-4 14`, `--r-round`, rationed `--r-pill`). | 24–28px "gummy bubble" radius reads as SaaS; manuscript objects have crisp/shallow corners; Farag squares + plates are hard-cornered; circles reserved for the tawaf-dab vocabulary. |
| **D-A3** | Depth = warm-ink shadows + keyline on cream; light-edge on dark; **never** a coloured/indigo shadow. | A dark shadow is invisible on black (wrong material logic); manuscripts separate with ruled keylines; the only permitted glow is scripture. |
| **D-A4** | Retire gummy press for one Athar paper-press (`translateY(1px)` + ink deepen, `--dur-press`, no drop). | Gummy bounce is Gen-3 game-feel; Athar press is paper being pressed. One press across the inventory = coherence over per-element flourish. |
| **D-A5** | Icons re-inked to `currentColor` (structure) + `var(--icon-accent)` (detail) + low-opacity ink washes (halos/panels), authored per-icon (no runtime `.replace`). | The contract's "ink-stroke language, colour rules per ground": one asset re-inks by register; honours the no-runtime-recolour law; retires blue + the icon glow. |
| **D-A6** | Delete `AW.KIT['lantern-gold']`. | currentColor renders the one lantern gold on dark grounds automatically; the second asset is redundant; `AW.UNIT_ICON` never referenced it. |
| **D-A7** | Sky is a `data-sky` **tint layer** over the Kiswah Orbit ground on home; a full `.reg-sky-night` **ground** only on Sky-owned screens. | Law 1 (one ground per screen): home stays Orbit-ground; Sky appears as a token/tint. Sky owns its own screens outright. |
| **D-A8** | Thermal state is **shape-first, colour-second**, with dark-ground colour and cream-ground ink-outlines. | Powder (1.58:1) and Gold (1.93:1) fail on cream; law demands colour-blind safety anyway. Shape (hollow/half/filled+check) carries meaning on every ground. |
| **D-A9** | Grade pill uses **Za'atar Olive**, not a new affirm-green. | Athar has no green token; olive (4.95:1 on cream) is the "sound/verified" ink; keeps the palette at 17. |
| **D-A10** | Focus rings: **Crimson** on cream grounds, **Gold** on dark grounds (both AA-checked ≥3:1 non-text). | Crimson fails on Kiswah; gold fails on cream; each ground gets its on-brand, contrast-safe ring. |
| **D-A11** | Ember is a dark-grounds text colour; on cream it is shape/border/large-display only. Gold/Powder never lone-indicate on cream. | Real contrast math (Ember 3.21, Gold 1.93, Powder 1.58 on cream). Prevents illegible state text. |
| **D-A12** | Rose retry frame is decorative (1.73:1 on cream); the WCAG signal is the ink-blot + explanation text + shape. | Law 8 says rose *frames* the retry; it must not be the sole indicator where it fails contrast. |
| **D-A13** | Ring seed stored once in `awba_state.ringSeed`; prayer times + skyMode in `awba_prefs`. | Determinism (seed = maker's mark, law 10) and the manual-times floor (no geolocation) need persistence in the existing state/prefs blobs; both add via the existing migration seam. |
| **D-A14** | `AW.confetti` removed from the engine; `AW.icon/cite/wire/sheet/sheetRef/sheetTerm/reducedMotion/animate` retained. | Confetti has no Athar home (celebration is thread/dab/stamp). The rest are skin-agnostic and drive the re-skinned components. |

---

## 12 · Grep gates for the re-cut (verification aids)

- `! grep -qE 'rgba\(37,54,' shared/awba-engine.css` — no indigo shadows survive.
- `! grep -qE '\[data-unit="u[1-4]"\]' shared/awba-engine.css` — per-unit colour blocks gone.
- `! grep -q -- '--accent' shared/awba-engine.css` — accent scale removed.
- `! grep -qiE 'poppins' shared/awba-engine.css` — Poppins fully retired (no `@font-face`, no stack ref).
- `grep -c "'Inter'" shared/awba-engine.css` returns exactly `2` — one `@font-face`, one appearance
  in `--font-work` only. Inter must NOT appear in any other font stack (it is the ˹ ˺ fallback only).
- `! grep -q 'AW.confetti' shared/awba-engine.js` — confetti removed.
- `! grep -q "KIT\['lantern-gold'\]" shared/awba-engine.js` — variant removed.
- `! grep -q "\.replace(/#" shared/awba-engine.js` — no runtime icon recolour (already true; keep it).
- font `src`/grain URLs are relative: `! grep -qE "url\(['\"]?/" shared/awba-engine.css` — no leading slash.
- `! grep -qE 'https?://(fonts\.googleapis|cdn)' preview.html` — zero CDN.
- `AW.cite('x','y')` still returns `<span class="cite" data-ref="x">…` — validator byte-shape intact.
- `@layer tokens, base, components, screens, motion;` appears **exactly once** — order never re-declared.
