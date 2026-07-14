---
phase: 6
slug: accessibility-rtl-typography-hardening
status: approved
reviewed_at: 2026-07-14 (gsd-ui-checker — 1 Dimension-3 blocker fixed per its prescribed one-token change [ink-62]; 3 recommendations applied/ruled R-11; ratios independently recomputed by checker, all exact)
shadcn_initialized: false
preset: none
created: 2026-07-14
authority: .planning/phases/03-components-icon-kit-motion-language/03-UI-SPEC-ATHAR.md  (the SYSTEM contract — §2.1 contrast table is this phase's ground truth; this doc extends, never contradicts it)
canon: .planning/ATHAR-SYSTEM.md  (the Gate-2 lock — laws 3/8/9 bound every hardening cue below)
binding_translation: 06-CONTEXT.md D-62..D-68 (the a11y decisions; ACC-03's "amber/green/gold" is the retired-vocabulary reading → grey-ink/ember/gold/olive/powder)
precedent: .planning/phases/05-learn-page-cross-page-view-transitions/05-UI-SPEC.md  (S-numbering format + the aria contracts it already specified; R-8..R-10 continue its R-1..R-7 series)
research: .planning/phases/06-accessibility-rtl-typography-hardening/06-RESEARCH.md  (the element inventory with line refs, empirical automation limits, the 3 Open Questions this doc resolves)
---

# Phase 6 — UI Design Contract · Accessibility, RTL & Typography Hardening

> **Scope of THIS document — a HARDENING pass, not a redesign.** The Athar design system is locked
> (Gate 2; extended screen-by-screen through Phase 5, checker-passed). This doc adds **zero tokens,
> zero faces, zero hex, zero `@layer`-order changes.** It governs the **VISIBLE artifacts of the a11y
> work** (focus rings, non-colour state signals, the one new selection cue, the one new ayah-card
> affordance) and the **invisible-but-specified** (the polite live region, accessible-name grammar,
> the announcement copy table, the typo-stress fixture). **Every visible choice extends the shipped
> Athar reality** — focus rings, selection cues, and disabled states are drawn from the §2.1 palette
> with cited ratios; nothing is invented here.
>
> **Binding law stack (precedence order):** `ATHAR-SYSTEM.md` (canon) → `03-UI-SPEC-ATHAR.md` (system
> contract, §2.1 the contrast ground truth) → `06-CONTEXT.md` D-62..D-68 (this phase's locked
> decisions). On any conflict the higher wins; flag, never silently diverge.
>
> **Immutable laws bound to every cue below:** law 3 scripture (Amiri only, strongest ink, the only
> glow, never on texture, nothing celebratory adjacent — a11y cues never touch a scripture panel) ·
> law 8 wrongness is a strike, never a colour (grey ink-blot + why-line, rose frames retry only,
> nothing flashes/shakes — announcements read calm, never like an alarm) · law 9 the centre never
> animates (the one selection cue is static; focus rings never pulse) · law 7 accent ≤10% (focus
> rings and state cues reuse the register accent already budgeted).
>
> **The bar (CONTEXT §specifics):** a blind or keyboard-only user completes a full lesson, a timed
> review, and claims a chest — *same mercy, same calm*. Announcements read like the app's own voice
> (warm, brief), never like debug output.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | **none** — vanilla HTML/CSS/JS, zero build, `file://`-openable (CLAUDE.md hard constraint). shadcn gate **N/A** (not a React/Next/Vite stack; no `components.json`/`tailwind.config.*` present — confirmed via CLAUDE.md + 05-UI-SPEC §0). |
| Preset | not applicable |
| Component library | **none as a package** — the in-repo `AW.*` primitives (`shared/awba-engine.js`) are consumed as-is. This phase adds **three engine primitives** (`AW.announce`, the `AW._trapFocus` containment helper, the `.aw-sr` visually-hidden CSS in `@layer base`) + narrow page/runner fixes at their authored seams (D-67). No new component classes except the one static selection cue and the one ayah-card affordance. |
| Icon library | `AW.KIT` (20 scenes) + `AW.GLYPHS` (13 glyphs) — **frozen** (`components.test.js` pins `glyphCount===13`; no new glyph, incl. no speaker/announce glyph). Icon-only controls get **accessible names**, not new icons (S4). |
| Font | Locked §2.2 roster — Readex Pro (workhorse, both scripts) · Amiri / Amiri Quran (scripture) · Marcellus · Aref Ruqaa · Rakkas · Courier Prime · Inter (silent `˹ ˺` fallback ONLY). This phase **proves** the roster renders tofu-free at full-app scale (S5); it does not add or change a face. |
| Registry safety | **not applicable** — no external registry, no npm, zero dependencies (S/§Registry Safety). |

**What is empty and awaits this phase (RESEARCH §aria-live: grep = 0 hits today):** the live region
(`.aw-sr role=status`) does not exist anywhere · no overlay has tab containment · two learn-page
surfaces (streak strip, ayah card) are `role=button` divs with **dead Enter/Space** · path nodes
carry **no state in their accessible name** · the popup dialog lacks `aria-modal`/name/focus-move ·
"disabled" buttons are **class-only** (focusable, silently inert) · quiz selection is **colour-only**
(inline `borderColor`, no `aria-pressed`) · the Phase-1 glyph gate is **broken** (Poppins crash, exit 1).

### Engine primitives added this phase (DOM-thin, unit-pinned)

| Primitive | Home | Purpose | Note |
|---|---|---|---|
| `AW.announce(text)` | boot-stamp block (js:495–537) | one polite live region per page; lazy-ensures the region (create-if-absent, append to `document.body`) + a `DOMContentLoaded` ensure (the `readyState==='loading'` precedent at js:534–536). | 150ms trailing last-write-wins coalescer; clear-then-set-in-rAF for repeat strings. The word `localStorage` must NOT appear even in its comments (D-24 grep pinned at 13). |
| `AW._trapFocus(overlayEl) → untrap()` | near `AW.sheet` (js:1049–1135) | ONE shared Tab-cycle containment helper for all three overlay families (D-63). | keydown ON the overlay; recompute focusables live; wrap first↔last. Selector excludes `button:not([disabled])` — consistent with the real-disabled fix (S2). |
| `.aw-sr` visually-hidden utility | `@layer base` (additive — order line at :16 **never** re-declared) | hosts the live region off-screen. | `position:absolute;width:1px;height:1px;clip-path:inset(50%);overflow:hidden;white-space:nowrap;` — **no colour, zero new hex**. |

---

## Spacing Scale

**Locked system scale (D-A1 — the Phase-1 4px scale, verbatim; NOT re-derived).** This phase adds no
spacing. The one binding spacing law for a11y: **44px minimum touch target** on every interactive
control (already met — nodes, tabs, HUD stats, mute, sheet-row, popup CTA, `.sheet-x`, the new
"Read the citation" button). Focus-ring geometry (outline 3px + 2px offset + 6px halo, S1) sits
**outside** the type scale — it is a non-text UI indicator, cited to WCAG 1.4.11, not a spacing token.

| Token | Value | A11y usage this phase |
|---|---|---|
| `--sp-2` | 2px | node-mark ring border, the shipped `.opt`/`.tf`/`.tile` rest border |
| `--sp-1`..`--sp-16` | 4–64px | inherited — no new spacing; the fixture (S5) uses the shipped rhythm |
| (outside scale) | **44px** | every tappable min target — verify, don't change |
| (outside scale) | **3px / 2px / 6px** | focus outline width / offset / halo (UI indicator, §2.1 focus rulings) |

Exceptions: none added. The 3px selection-border weight (S2) is a **non-colour signal**, not a
spacing token.

---

## Typography

**Locked §2.2 roles — inherited, not re-derived.** This phase touches type in exactly two ways, both
non-visual-redesign:

1. **The typo-stress fixture (S5)** exercises every rationed face + the full diacritic/bracket set in
   **neutral copy** to prove tofu-free rendering. It is a `scripts/fixtures/` dev artifact, never a
   product surface, never scripture.
2. **The glyph gate (S5)** is rewritten to prove the 14 subset `.woff2` files carry every codepoint
   the real app strings demand, per role-stack.

No product typography changes. Scripture law (law 3) is **verified in situ** on the rendered lesson
pages — `.ayah` = Amiri Quran, `lang="ar" dir="rtl"`, `unicode-bidi:isolate`, `letter-spacing:0`,
strongest ink, the one permitted glow — not restyled. The RTL/bidi census (S5) proves all 5
Arabic-emitting paths already carry `lang/dir` and all containers already isolate (css:378–414);
this phase **pins** that, adds nothing.

| Role | Face / weight | Where it appears in Phase-6 artifacts |
|---|---|---|
| Fixture specimen labels | Readex Pro 400 | each face's row heading in `typo-stress.html` |
| Fixture Arabic samples | the face under test | common-tashkeel dictionary words + the Arabic alphabet — **never** a basmala/ayah/hadith (fixture law) |
| Announcement text | (none — visually hidden) | `.aw-sr` carries text with no rendered type; SR voice only |
| "Read the citation" button (S4/R-9) | Courier Prime 400 (`--fs-marg`, marginalia) | the one new visible control on the Orbit ground — a quiet mono line, not a display face |

---

## Color

**Every focus / state / disabled colour is drawn from the §2.1 palette with a cited ratio. No pairing
is invented. Zero new hex.** WCAG thresholds: text **4.5:1** (3:1 large), non-text UI indicators
(focus rings, state shapes, borders) **3:1** (SC 1.4.11).

### S1 focus-ring palette (already shipped css:361–376 — cited, verified, extended never contradicted)

The ring shows on `:focus-visible` **only** (keyboard) — never on plain `:focus` — so there is no ring
flash on tap; the suppressed `-webkit-tap-highlight-color` is the compensation D-62 names. Recoloured
per ground; radius follows the element's own shape.

| Register | Ground | Ring colour | Width / offset / halo | Ring-on-ground ratio | §2.1 cite |
|---|---|---|---|---|---|
| **Orbit** | Kiswah `#131013` | **gold** `#D9A441` | 3px / 2px / gold 28% 6px | **8.40:1** ✓ | §2.1 Orbit gold |
| **Page** | Haram Cream `#F3EDE2` | **crimson** `#A32C21` | 3px / 2px / crimson 22% 6px | **6.13:1** ✓ | §2.1 Page crimson / focus rulings |
| **Sky night** | Last Third `#251D46` | **gold** `#D9A441` | 3px / 2px / gold 28% 6px | **6.95:1** ✓ | §2.1 Sky gold |
| **Festival** | Haram Cream `#F3EDE2` | **crimson** `#A32C21` | 3px / 2px / crimson 22% 6px | **6.13:1** ✓ | §2.1 Festival cream |
| **Nightfall** | `#201418` | **gold** `#D9A441` | 3px / 2px / gold 28% 6px | **7.95:1** ✓ | §2.1 Nightfall gold |

**Register-follow is automatic:** the rules key off `.reg-*`/`.nightfall` ancestors, and reward-screen
`setGround()` swaps the register class (js:2009), so the ring colour follows the ground with **no extra
work** (RESEARCH Pitfall 2). The default (unscoped) ring is crimson (Page = ~90% of minutes).

### S2 state / selection / disabled palette (all cited; the one new visible cue is token-only)

| State | Visible cue(s) | Colour + ratio | Non-colour channel |
|---|---|---|---|
| Quiz **selected** (pre-check) | border recolour + **3px weight** + held paper-press `translateY(1px)` | Page: crimson border `6.13:1` · Orbit review: gold border `8.40:1` (both ≥3:1 UI) | **border-weight 2→3px + depressed position + `aria-pressed="true"`** — selection is NOT hue-only (fixes 1.4.1 gap) |
| Quiz **correct** | gold dot draws + `check` glyph (shipped) | gold on Page ≥3:1 as filled shape w/ ink keyline | **shape** (dot + check) |
| Quiz **wrong** (law 8) | grey ink-blot + `.opt-why` why-line (shipped) | `--ink-62`→transparent blot + `--ink-85` text 16.22:1 | **shape + text** (never red/shake/flash) |
| Thermal **not-yet / progress / mastered** | hollow ring / half-dab / filled+check (shipped D-A8) | powder/ink-62 border, ember half `3.21:1`, gold fill+keyline | **shape-first** (colour secondary; verify each carries its shape everywhere it appears) |
| Review **timer `.low`** | bar-width % + `.low` ember deepen (shipped) | ember on dark ≥3:1 | **announcement-only** — the 10s single-fire warning + the timeout mercy line (R-8; no numeric readout exists in source) |
| **Disabled** button (Check) | opacity `.5` (shipped `.disabled`) + real `disabled` attr | disabled controls are **exempt** from 1.4.3 | **removed from tab order + SR "dimmed" via `disabled`** (was class-only, silently inert) |

**No destructive semantic colour.** This phase adds none — there are no destructive actions (the
un-loseable promise). `--rose` is used only as the shipped retry frame; it is decorative (1.73:1 on
cream), never the load-bearing signal (law 8).

---

## Copywriting Contract

**Tone: the app's own calm voice — warm, brief, never debug output, never an alarm (law 8).** Every
announcement below **reuses a shipped string** (verdict/praise/gentle/reward/result copy, cited to
source line) or composes from shipped fragments. New micro-wording is permitted only within the calm
voice + existing praise pools (Claude's discretion, D-64). Scripture is never announced or restyled.

| Element | Copy (exact string / composed form) | Source |
|---|---|---|
| Live region | one `<div class="aw-sr" role="status" aria-live="polite" aria-atomic="true">`, **direct child of `document.body`** (never inside `#app`/`#root`/`<main>`) | RESEARCH §aria-live |
| Quiz verdict — **correct** | `"{PRAISE} +12 noor"` + (combo ? ` — {N} in a row` : ``) — reuse the SAME chosen `PRAISE` word the visible foot shows (read `PRAISE[correct % 4]`, never reselect) | PRAISE = `['That’s it.','Beautiful.','Exactly right.','Masha’Allah.']` js:1962; `+12` = `AW.PER_LESSON` js:1435; combo copy js:1974 |
| Quiz verdict — **miss** | `"Nothing lost. {it.gentle}"` | "Nothing lost" js:1992; `it.gentle` js:1993 (the beat's own gentle line) |
| 3-streak flourish | **folded into the correct line** as ` — 3 in a row` (no separate loud announcement — the visible `.thread` flourish is quiet, law 9) | comboPerfect js:1451/1974 |
| Reflect reveal | `"+15 noor — a reflection"` | `AW.REFLECT` = 15 js:1436; reflect handler js:1874–1883 |
| Lesson screen change | **focus-to-heading, NOT announce** — see the focus rule below | R-10 |
| Review answer verdict | `"{word}. +{n} noor"` where word ∈ `Named — thread lit` / `Swift and sound` / `That’s it` / (miss) `Nothing lost`; `n` = 15 (+5 swift) | verdict words js:2422; `PER_REVIEW`/`SWIFT` js:1437–1438 |
| Review timeout | `"Time — this one will wait at the end"` | shipped fw heading js:2303 (verbatim) |
| Review auto-skip narration | after a timeout auto-skip, the next question announces `"Question {n} of {m}"` (factual, calm) so the 1500ms swap is narrated (Pitfall 3 — never pause/extend the timer) | `renderQ` js:2364; new calm copy (D-64 discretion) |
| 10s warning | `"10 seconds"` — single-fire at `tleft === 100` (deciseconds; monotonic → free single-fire) | tick js:2287–2291 |
| Review result | **focus the result heading** (`.rv-title`: `Legendary`/`Mastered`/`Reviewed`) + announce once `"{verdict}, {correct} of {CH.length} named · +{noor} noor"` | result() js:2446–2455 (compose from shipped values; do not invent) |
| Chest claim | `"+25 noor — a sure gift"` | D-64 verbatim; fires in `__awbaClaimChest` **after** the noor set (learn:521); "a sure gift" is the shipped voice (learn:428) |
| Sheet open | **no announce** — focus-into-sheet makes the SR read it (S4) | RESEARCH §aria-live |

**The focus-vs-announce rule (R-10 — codifies D-64's "screen transitions announced"):**
`focus()` for **screen changes**, `announce()` for **in-place events**. Each reward/review screen's
`h1`/`.rw-word`/`.rv-title` gets `tabindex="-1"` + `.focus()` after render — this simultaneously fixes
focus-evaporation on `innerHTML` swap (Pitfall 2) **and** makes the SR read the heading naturally.
**Never also announce the same heading** (that is the double-speak, Pitfall 9). The praise word renders
visibly in the foot (js:1977) — never wire `aria-live` onto `#lsfoot` or any visible container;
announcements go ONLY through the one region, composed once per resolve.

**Accessible-name grammar (icon-only + shape-only controls — D-64 / the STATE.md Pending Todo):**

| Control | Accessible name | Status |
|---|---|---|
| Path node `.onode` | `aria-label="{nd.label}, {state phrase}"` composed in `nodeHtml()` (learn:663–670) from `data-kind` + `data-nstate`. **State phrase table** below. | ✗ build — the STATE.md Pending Todo |
| HUD returns / noor | `"{N} returns — open your streak"` / `"{N} noor — open your light"` | ✓ shipped (learn:550–551) — **verify only** (calmer than D-64's "tap for details" example; keep shipped) |
| Course chip | `"Switch course"` | ✓ shipped (learn:546) |
| Mute toggle | `aria-pressed` + `"Mute sounds"`/`"Unmute sounds"` swap | ✓ shipped (js:1711) |
| Sheet close `.sheet-x` | `"Close"` | ✓ shipped (js:1072) |
| Reflect textarea | real `<label for="lsrt">` | ✓ **already shipped** (js:1604) — D-64's "gets a label" = verify, not build |

**Node state-phrase table** (reconciles the STATE todo `{locked|available|done}` with D-64's
`{…|review|gift}` — "review"/"gift" already live in the node *label*, so the phrase carries only
status; kind disambiguates the chest's open/closed verbs):

| `data-kind` | `data-nstate` | State phrase | Composed example |
|---|---|---|---|
| lesson | locked | `locked` | "What sound belief is, locked" |
| lesson | active | `available` | "How we keep it sound, available" |
| lesson | done | `complete` (+ `, {N} of 3 stars`) | "Why belief matters, complete, 2 of 3 stars" |
| review | locked | `locked` | "Legendary review, locked" |
| review | active | `available` | "Legendary review, available" |
| review | done | `complete` (+ `, {N} of 3 stars`) | "The final review, complete, 3 of 3 stars" |
| chest | locked | `locked` | "A gift, locked" |
| chest | available | `ready to open` | "A gift, ready to open" |
| chest | done | `opened` | "The course gift, opened" |

**Overlay accessible names (D-63):**

| Overlay | Name mechanism | Status |
|---|---|---|
| `AW.sheet` | extend `AW.sheet(html, label)` — backwards-compatible 2nd arg → `aria-label`; default `"Details"`; callers pass natural labels (`sheetRef` → `r.ref`, `sheetTerm` → `t.word`, learn → "Your streak" / "Noor gathered" / "Switch course" / the tab name) | ✗ build (R-10) — role=dialog + aria-modal shipped (js:1057–1058); name missing |
| `.npop` node popup | `aria-modal="true"` + `aria-labelledby` → give `.np-label` an id | ✗ build — role=dialog shipped (learn:239); aria-modal + name missing |
| `.ofest` Festival | `"A gift of light"` | ✓ shipped (learn:489) — extend the pattern, add containment + focus-return |

**Empty / error / degraded state:** unchanged from 05-UI-SPEC — silent sound on missing sfx (D-52),
reduced-motion = a calm stilled mode (not an error), VT-unsupported/`file://` = normal nav. This phase
adds no error surface; announcements never narrate a fault.

**Destructive confirmation:** none — no destructive actions exist. The chest claim is write-once
additive; there is nothing to lose and nothing to confirm.

---

## S1 · Focus grammar — the one register-aware `:focus-visible` (D-62 / ACC-01)

**One grammar app-wide, already shipped (css:361–376); this phase unifies + audits, builds no new
ring.** See the Color/S1 table for the per-register palette + cited ratios. The rules:

- **Keyboard-only:** `:focus-visible` only (never plain `:focus`) → no ring flash on tap; the
  suppressed tap-highlight is the compensation D-62 names.
- **Register-aware:** gold ring on dark grounds (Orbit/Sky/Nightfall, 6.95–8.40:1), crimson on cream
  (Page/Festival, 6.13:1). Ground swap via `setGround()` re-scopes the colour automatically.
- **Press-state interplay:** the ONE Athar paper-press (`translateY(1px)` + ink-deepen, `--dur-press`
  140ms, **no shadow drop** — D-A4) and the focus ring coexist: the `outline` follows the box, so the
  ring rides the 1px press down as one motion. Under reduced motion the press collapses to the
  ink-deepen only; the ring is unaffected (it never animates — law 9).
- **The one sanctioned ring suppression:** non-interactive headings given `tabindex="-1"` purely for
  focus-landing (reward/review screens, Pitfall 2) may carry `[tabindex="-1"]:focus-visible { outline:
  none }` — they are not operable controls, so no visible ring is owed. **Every operable control keeps
  its ring** (no `outline:none` on any `button`/`a`/`textarea`/`input`).
- **Escape** closes any open sheet/popup/Festival overlay (all three listeners shipped — verify + pin,
  build none; RESEARCH §Focus Containment).

**Coverage (RESEARCH §Inventory):** every quiz/nav control is already a native `<button>`/`<a>` — the
ring applies. The two exceptions this phase fixes: the **streak strip** (div→`<button>`, S4) and the
**ayah card** (gains a native inner button, R-9) so both become ring-bearing, keyboard-operable
controls. No positive `tabindex` anywhere (DOM scan + grep gate); DOM order = the serpentine journey
order (the probe asserts the `.onode` focusable list equals the journey sequence).

---

## S2 · Non-colour state signals — the inventory + the two gaps filled (D-65 / ACC-03)

**Shipped signals to VERIFY carry their shape everywhere (do not restyle):**

| Signal | Shape cue (shipped) | Where | Verify |
|---|---|---|---|
| Quiz correct | gold dot draws + `check` glyph | `.opt`/`.tf`/`.tile` resolve | shape present on every quiz type |
| Quiz wrong (law 8) | grey ink-blot + `.opt-why` why-line | resolve miss (js:1919/1992) | blot + text present; never red/shake |
| Thermal not-yet / progress / mastered | hollow ring / half-dab / filled+check (D-A8) | nodes, dabs, chips | shape carries it on cream AND dark |
| 3-lens accordion | left-rule style (solid/double/dashed) + glyph + label | lesson body (STATE 04-02) | style + label, not hue |
| Earned vs un-earned thread | continuity + weight (gold overlays a faint navy base, learn:163–171) | learn path | weight+continuity present, not hue-only |

**The two colour-only gaps this phase fills:**

1. **Quiz selection cue (both runners).** Today: inline `borderColor` swap only — Page crimson
   (js:1907), Orbit review gold (js:2397) — **hue-only, no `aria-pressed`** → fails WCAG 1.4.1. Fix
   (token-only, no new hex, no reflow):
   - **R-11 (deliberate APG deviation, accepted):** these are action-buttons whose activation selects/resolves — full APG radio/listbox semantics would obligate arrow-key selection + roving tabindex, changing the shipped interaction contract mid-hardening. `aria-pressed` closes the WCAG 1.4.1 hue-only gap without altering interaction; radiogroup semantics deferred to v2.
   - **SR channel:** `aria-pressed="true"` on the selected `.opt`/`.tf`/`.tile` (cleared on
     re-selection).
   - **Visible non-colour channel:** the selected control **holds the paper-press depressed state**
     (`translateY(1px)`) **and its border goes 2px → 3px** (a weight change) in addition to the
     shipped recolour. "Pushed in and thicker" is a genuine non-hue signal. (A richer lead-dab is
     available under discretion, but the weight+position cue is the contract floor — it needs no new
     element and no layout reflow.)
   - **After resolve:** set the real `disabled` attribute on the resolved options (they currently keep
     `pointer-events:none` only — which does **not** block the keyboard; the `answered` guard makes
     Enter a safe no-op today, but the dead buttons must leave the tab order — Pitfall 4). The
     containment selector already excludes `:not([disabled])` — consistent.

2. **Review timer `.low` (R-8 — resolves RESEARCH OQ1).** Today: ember deepen + bar width only; **no
   numeric time is rendered anywhere** (js:2240–2243 emit the bar + an empty `tnote`), so D-65's "the
   numeric time already visible" premise is **false against source**. Fix: **announcement-only** — the
   single 10s warning (`"10 seconds"`) + the timeout mercy line (`"Time — this one will wait at the
   end"`) are the text cues; the bar width + `.low` deepen remain the visual cue. **No visible seconds
   readout is added** — that is the safest choice under the no-visual-redesign law (flagged for the
   gate walk).

**Disabled buttons (class-only → real).** The lesson "Check" ships as `btn('Check','disabled','check')`
(class-only, focusable, Enter silently no-ops behind `chosen===null`, js:1894). Add the real `disabled`
attribute (toggle with the existing `classList` calls at js:1909; review at js:2380/2399). Same for the
review Check. Non-colour signal = the control leaves the tab order + SR reads "dimmed"; the shipped
`opacity:.5` is the visible cue (disabled controls are exempt from 1.4.3).

---

## S3 · The live region + announcement copy (D-64 / ACC-02)

**One region, one voice.** `<div class="aw-sr" role="status" aria-live="polite" aria-atomic="true">`
appended as a **direct child of `document.body`** — never inside a container the runners wipe
(`document.body.innerHTML` at js:1763/2237; `#app.innerHTML` at learn:736). `AW.announce(text)`
lazy-ensures the region at call time + a `DOMContentLoaded` ensure (so a region exists before the first
update — VoiceOver can miss a just-inserted region's first message). The `countUp` numeral (js:2036)
**never** sits inside the region — announce the final `+N noor` once from `rewardNoor()`.

**Insertion points + exact copy — see the Copywriting Contract table above (every string cited to
source line).** The composed rules:

- **One composed announce per `resolve()`** (js:1963) — verdict + noor + combo fold into a single
  message; never three separate calls (Pitfall 9). The probe asserts region text is set **exactly
  once** per answer.
- **Screen changes → `focus()` the heading** (R-10), never announce (Pitfall 2 + no double-speak).
- **In-place events → `announce()`** (verdict, noor, reflect, 10s warning, timeout, chest, result stat).
- **10s warning fires once** at `tleft === 100` (monotonic single-fire, free).
- **The auto-skip (Pitfall 3)** is narrated at the announcement layer only — the timeout line fires at
  `timeUp()`, the next question announces `"Question {n} of {m}"`; the 1500ms and the 100ms timer are
  **byte-preserved** (ENG-04), never paused or extended.
- **Debounce backstop:** `AW.announce` keeps a 150ms trailing last-write-wins coalescer; repeat strings
  are re-announced via clear-then-set-in-rAF.

---

## S4 · Accessible names + the two conversions (D-62 / D-63 / D-64)

**Accessible-name grammar — see the Copywriting Contract "Accessible-name grammar" + "Node state-phrase"
tables above** (node `aria-label`, HUD, mute, sheet close, reflect label; the overlay names). Summary of
what BUILDS vs what VERIFIES:

- **Build:** node `aria-label="{label}, {state phrase}"` in `nodeHtml()`; `AW.sheet(html, label)`
  accessible name; `.npop` `aria-modal` + `aria-labelledby`→`.np-label` **+ `tabindex="-1"` on the `.npop` element itself** (a plain div dialog silently ignores `.focus()` without it — 06-RESEARCH §Focus Containment); focus-move-into on open
  (sheet→`.sheet-x`, popup→the dialog itself since the locked popup has no CTA, Festival→shipped);
  focus-return on close (sheet shipped; popup→`popNode` if connected; Festival→re-query the chest node
  by `data-id` **after** `render()` rebuilds the path, Pitfall 6); the `AW._trapFocus` cycle on all
  three (D-63).
- **Verify only:** HUD labels, course chip, mute toggle, sheet close, reflect `<label>`, Festival
  role/aria-modal/name/focus-on-open, the accordion/popup-trigger `aria-expanded`, and the
  `.sheet-row.osw-row` coming-soon divs (they must **NOT** gain `tabindex` — display-only by design,
  LRN-06).

**The two conversions (D-62):**

- **Streak strip `#streakStrip` (learn:571):** `<div role="button" tabindex="0">` with a click handler
  but **dead Enter/Space** → convert to a real `<button>` (block-level button styling, keep the
  classes). No rich inner content to protect.
- **Ayah card `#ayahHost` (learn:607) — R-9 (resolves RESEARCH OQ2):** the card is **scripture** (the
  daily `.ayah` — strongest ink, the reverence budget, `lang/dir/isolate`). Converting the whole
  `<section>` to a `<button>` would flatten the sacred Arabic into a single control-label blob and
  strip the `.ayah` element's own scripture semantics from the SR reading. **Ruling:** keep the
  `<section>` (drop `role="button"`/`tabindex`), and add a **native inner `<button class="oayah-cite">
  Read the citation</button>`** as the keyboard/SR affordance (Courier marginalia on the Orbit ground,
  gold focus ring; opens `AW.sheetRef`). A pointer-only convenience click on the whole card may remain,
  delegating to the button — but the button owns keyboard/SR. This honours D-62's intent (a native,
  operable control with no dead keydown) **and** law 3 (the ayah keeps its isolated scripture reading).

---

## S5 · The typo-stress fixture + audits (D-66 / FND-03 / CNT-04)

**Fixture — `scripts/fixtures/typo-stress.html` (neutral copy law, NEVER scripture — Phase-2 fixture
law; location keeps it out of any Phase-7 precache).** Composition:

- **Every declared face** gets a specimen row with its role label: Readex Pro 300/400/500/600/700,
  Amiri 400/700, Amiri Quran 400, Marcellus 400, Aref Ruqaa 400/700, Rakkas 400, Courier Prime 400,
  Inter 400 (as the `˹ ˺` fallback demonstrator).
- **Full diacritic set** (D-66): ʿ U+02BF · ʾ U+02BE · ā U+0101 · ī U+012B · ū U+016B · ḥ U+1E25 ·
  ṣ U+1E63 · ṭ U+1E6D · ẓ U+1E93 · ḍ U+1E0D · ġ U+0121 — **plus the uppercase forms the real app uses**
  (Ḥ U+1E24, Ḏ U+1E0E) and ā U+0101 in **Courier Prime** (the Ibrahim line, untested today).
- **Bracket / mark cases:** Khattab corner brackets ˹ U+02F9 ˺ U+02FA (workhorse + the Inter fallback),
  ﷺ U+FDFA, ornate ﴾ U+FD3E ﴿ U+FD3F (Amiri faces only — the rare-mark faces are exempt).
- **Mixed Arabic/Latin + bidi cases:** a line mixing an Arabic run + Latin + digits; an RTL-isolated
  span followed by a Latin run — assert computed `direction`/`unicode-bidi:isolate` (glyph
  visual-order is best-effort via `Range.getClientRects()` x-ordering; the authoritative check is
  computed isolate + the human gate walk — state this limit in the audit output).
- **Rendered at 320px + desktop:** assert `documentElement.scrollWidth <= innerWidth` (no horizontal
  overflow).

**Audits (permanent suite members, D-68):**

- **RTL/bidi DOM-walk (`scripts/tests/rtl-audit.mjs`):** every element whose direct text matches the
  Arabic ranges must have `closest('[lang="ar"]')`; `.ayah`/`.scripture` containers compute
  `direction:rtl` + `unicode-bidi:isolate`; ayah containers compute `font-family` starting `Amiri
  Quran`. All 5 emitter paths already pass (census verified css:378–414) — this **pins** them.
- **Glyph gate rewrite (`scripts/check-glyph-coverage.py`) — currently BROKEN (Poppins crash, exit 1):**
  rewrite for the 14-face Athar roster; **harvest REQUIRED codepoints from the real app strings**
  (learn.html + lessons/ + reviews/ + engine emitters), bucket by role-stack; encode the settled
  fallback law (Readex ∪ Inter covers `˹ ˺`; Aref Ruqaa/Rakkas exempt from rare Quranic marks
  U+0657–065F — heavy tashkeel is Amiri-only, law 3). Tofu at the rendering level is proven by
  cmap-coverage + the computed font-family assertion + the human fixture walk (canvas/`document.fonts`
  heuristics false-pass — do not promise automated pixel tofu detection).

**Scripture rendering is verified in situ** on the real lesson pages (byte-identity already SHA-gated —
this phase checks RENDERING, not bytes).

---

## S6 · What does NOT change — the hardening no-touch list (D-67)

Fixes land at the **narrowest correct seam**; everything below is **untouched**:

| Domain | No-touch |
|---|---|
| **Mechanics** | byte-preserved: `PER_LESSON`=12, `REFLECT`=15, `PER_REVIEW`=15, `SWIFT`=5, star math, combo, best-of, the 100ms timer + the 1500ms auto-skip (ENG-04), chest write-once +25, the CNT-03 unlock rules. No runner logic changes beyond announce-insertion + real-disabled + `aria-pressed` + focus-to-heading. |
| **Copy** | no rewrites beyond aria/label text. Verdict/praise/gentle/reward/result strings verbatim; scripture verbatim + SHA-gated; the "Question {n} of {m}" auto-skip line + node state-phrases are the only NEW strings (aria/announce only). |
| **Layout** | no repositioning — node serpentine, HUD, tab bar, Ring hero, sheet/popup anchoring, continue card, daily-ayah card all stay. The one new visible element is the small "Read the citation" button (S4/R-9). |
| **Motion** | the one `--ease` family, one verb per register, all reduced-motion behaviour untouched. **No new keyframes** — the selection cue is static (the held press is the shipped press, not a new animation); focus rings never animate (law 9). |
| **Tokens / hex** | **zero new** — focus rings, selection, disabled all from §2.1; the 3px selection-border weight is a width, not a colour; `.aw-sr` carries no colour. If a pairing genuinely cannot pass with existing tokens, **STOP and log for the owner** — never invent a colour (D-67). |
| **Schema / gates** | localStorage grep = **13** (engine) / **0** (learn); no `CURRENT` schema bump; `@layer` order line ×**1**; `glyphCount`=**13**; suite baseline **114** never shrinks (every behaviour fix gets a regression pin). The word `localStorage` must not enter any new comment (incl. `AW.announce`). |
| **Registers / Ring / Sky** | no re-derivation — this doc applies the locked system, never re-opens it. Sky-as-tint, `--dawn`, the Ring-as-only-macro-map all stand. |

---

## Decision Log (this phase's rulings — R-8..R-10, continuing the Phase-5 R-1..R-7 series)

| # | Ruling | Rationale |
|---|---|---|
| **R-8** | **Review timer `.low` non-colour cue = announcement-only; no visible numeric readout is added.** (Resolves RESEARCH Open Question 1.) | D-65's parenthetical "the numeric time already visible" is **false against source** — `rv-timerwrap` (js:2240–2243) renders the bar + an **empty** `tnote`; no seconds are shown anywhere. The bar-width + `.low` ember deepen remain the visual cue; the single 10s warning (`"10 seconds"`) + the timeout mercy line (`"Time — this one will wait at the end"`) are the text cues. Adding a visible seconds readout is a visual change weighed against the phase's no-redesign law; **zero visual change is the safest reading.** Flag the discrepancy for the human gate walk. |
| **R-9** | **Ayah card → keep the `<section>` and add a native inner "Read the citation" `<button>`; streak strip → convert to a native `<button>`.** (Resolves RESEARCH Open Question 2.) | The ayah card is **scripture** (law 3 — strongest ink, the reverence budget, `lang/dir/isolate`). Converting the whole `<section>` to a `<button>` (the literal D-62 "convert") would flatten the sacred Arabic into one control-label blob and strip the `.ayah` element's own scripture SR semantics — an a11y **and** scripture regression. An explicit inner button gives a native, keyboard-operable, ring-bearing affordance (honouring D-62's intent) while the ayah keeps its isolated reading. The streak strip has **no** rich/scripture inner content, so it converts cleanly per D-62. RESEARCH OQ2 confirms "either satisfies ACC-01" — this reading additionally satisfies law 3. |
| **R-10** | **Sheet accessible names via a backwards-compatible `AW.sheet(html, label)` 2nd arg (default `"Details"`); AND the focus-vs-announce rule is codified: `focus()` for screen changes, `announce()` for in-place events.** (Resolves RESEARCH Open Question 3 + settles D-64's "screen transitions announced" reading.) | Extending `AW.sheet` is backwards-compatible (existing single-arg calls default to "Details") and lets `sheetRef`/`sheetTerm`/learn callers pass natural labels — richer than a generic fixed name (RESEARCH OQ3 recommendation). The focus-vs-announce split makes focus-landing on a `tabindex="-1"` heading the announcement mechanism for screen swaps (fixing focus-evaporation, Pitfall 2) while reserving the live region for in-place events — preventing the double-speak of announcing a heading that focus already reads (Pitfall 9). |

**Owner-ledger items (unchanged, not build-blocking):** the 15 Arabic chapter-terms (R-6) · the
verbatim Ibrahim 14:24 splice (R-7) · sound-cue assets · scholar gate · Clear Quran licensing. This
phase adds one gate-walk item to the ledger: **R-8's announcement-only timer decision** (the owner may
later choose a quiet Courier seconds readout — a visible change, deferred).

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|---|---|---|
| none (vanilla, zero-build, zero-dependency) | none | **not applicable** — no shadcn, no npm, no external component registry (CLAUDE.md hard constraint; RESEARCH "Package Legitimacy Audit: N/A — zero external packages"). All code is in-repo `AW.*` primitives + native browser APIs + Node-core dev tooling. |

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
