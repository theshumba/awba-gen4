# Roadmap: Awba Gen-4

## Overview

Awba Gen-4 is a detail-layer execution rebuild of Josh's owner-approved Gen-3 MVP: the same product, rebuilt at world-class quality on the same zero-build, vanilla, `file://`-openable stack. The journey moves from the two highest-blast-radius decisions first — a true responsive shell replacing the fixed 380px phone-card (Phase 1) and a frozen state/engine contract with a standing validator (Phase 2) — then builds the shared components, icon registry, and motion language (Phase 3) that the screen runners consume. The lesson and review engines are ported next, rendering all 19 of Josh's data files verbatim with the reward choreography and P1 detail polish that make it feel alive (Phase 4). The net-new Learn page and native cross-page transitions come after the engine is proven (Phase 5), followed by a cross-cutting accessibility/RTL/typography hardening pass (Phase 6), and finally the PWA shell, offline caching, and the Gen-3 regression ship-gate (Phase 7). Every scripture word stays verbatim, sourced, scholar-gated, and every scholar hold carries over exactly.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation — Design Tokens, Responsive Shell & Fonts** - True full-viewport shell, one token layer, self-hosted fonts; kills the fixed 380px card
- [ ] **Phase 2: State Layer & Engine-Contract Freeze** - Versioned storage + migration, frozen `AW`/`AwbaLesson`/`AwbaReview` contract, standing validator
- [ ] **Phase 3: Components, Icon Kit & Motion Language** - Shared chrome, one 20-SVG icon registry, citation/gloss sheets, one `linear()` motion vocabulary
- [ ] **Phase 4: Lesson & Review Engine Port + Detail Layer** - All 19 data files render verbatim; reward choreography, sound, holds verified
- [ ] **Phase 5: Learn Page & Cross-Page View Transitions** - Winding node path, live states, daily ayah, native page-to-page transitions
- [ ] **Phase 6: Accessibility, RTL & Typography Hardening** - Keyboard, aria-live, contrast, bidi + glyph stress-test across every screen
- [ ] **Phase 7: PWA Shell, Offline & Delivery** - Installable PWA, offline-after-first-visit, static deploy, Gen-3 regression ship-gate

## Phase Details

### Phase 1: Foundation — Design Tokens, Responsive Shell & Fonts
**Goal**: The app renders inside a true full-viewport responsive shell, styled entirely from one design-token layer, with self-hosted fonts — replacing Gen-3's fixed phone-card and Google Fonts CDN.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: FND-01, FND-02, FND-03, PLT-01
**Success Criteria** (what must be TRUE):
  1. On a phone the app fills the viewport edge-to-edge (`100dvh`, safe-area insets honored) with no fixed 380px card; on desktop it presents as an intentional centered column — a reviewer resizes the window and the layout adapts gracefully at every width.
  2. Switching a page to any unit (blue / purple / teal / gold) fully recolors both primary AND secondary accents — no half-themed indigo elements survive on purple/teal pages (Gen-3's fixed `blue2`/`blue3` bug is gone).
  3. All colors, type, radii, shadows, and motion values come from one CSS `@layer tokens` source (unit colors defined once as custom properties, read by JS from that same source) — a reviewer greps screen code and finds no invented literal hex/px.
  4. Fonts (Poppins, Inter, Amiri, Amiri Quran) load from self-hosted subset `.woff2` files with zero Google Fonts CDN requests and no FOUC on navigation; `˹ ˺` brackets and transliteration diacritics render as correct glyphs.
**Plans**: 4 plans
  - [x] 01-01-PLAN.md — Repo scaffold + self-hosted font subset pipeline (glyph-coverage gate green)
  - [ ] 01-02-PLAN.md — One-stylesheet token + base shell layers (@layer order, per-unit accent scales, responsive grid)
  - [ ] 01-03-PLAN.md — preview.html verification vehicle (token sheet, live unit-switch, glyph test, zero-CDN)
  - [ ] 01-04-PLAN.md — Reviewer D-12 checklist gate (human-verify)
**UI hint**: yes

### Phase 2: State Layer & Engine-Contract Freeze
**Goal**: One versioned state layer and a frozen engine contract are locked, tested, and gated — so content can port later against a stable, verified foundation instead of a moving target.
**Mode:** mvp
**Depends on**: Nothing (state layer is DOM-independent; can run in parallel with Phase 1)
**Requirements**: FND-05, FND-06, FND-07, ENG-07
**Success Criteria** (what must be TRUE):
  1. All progress (noor, returns, stars, days, chests) lives in one versioned `awba_state` blob behind `AW.S.get/set`; loading a browser seeded with legacy Gen-3 `awba_*` keys migrates them losslessly — a reviewer seeds old keys, reloads, and sees every value preserved.
  2. A separate user-preferences store persists sound-mute and reduced-motion overrides independently of progress state.
  3. Every page loads over `file://` via classic `<script>` tags under one `AW` global namespace — no ES modules, no `defer`/`async` on the engine tag — so a reviewer double-clicks an HTML file and it runs.
  4. A standalone validator (runnable via `node`) checks every lesson/review data file for known beat types, resolvable citation/term IDs, required per-type fields, and in-range answer indices — it flags a deliberately broken fixture and passes all real files.
**Plans**: TBD

### Phase 3: Components, Icon Kit & Motion Language
**Goal**: A shared component library, a single icon registry, and one motion vocabulary exist and are proven before the screen runners consume them.
**Mode:** mvp
**Depends on**: Phase 1 (consumes design tokens)
**Requirements**: FND-04, ENG-06, MOT-01, MOT-03, MOT-04
**Success Criteria** (what must be TRUE):
  1. One icon registry renders every branded icon from the canonical 20-SVG source (inline, `aria-hidden`, single source of truth); the gold lantern is an authored variant, not a regex recolor, and no duplicate per-page icon constants remain.
  2. Tapping a citation chip opens a bottom sheet (RTL Arabic, verbatim translation, source line, grade pill for hadith, `unverified · pending review` pill); tapping a term opens its gloss sheet (Arabic, transliteration, word, definition, context).
  3. Every tappable surface (buttons, options, tiles, chips, sheet rows, tabs) shares the same token-defined press physics and one `linear()`-easing motion vocabulary used across nodes, sheets, and quiz feedback.
  4. With `prefers-reduced-motion` set (or the user override on), all animation quietens globally — a reviewer toggles the OS setting and confetti, bob/glow, and transitions all calm down.
**Plans**: TBD
**UI hint**: yes

### Phase 4: Lesson & Review Engine Port + Detail Layer
**Goal**: All 15 lessons and 4 reviews render end-to-end from Josh's verbatim data files through the compatible engine, with the reward choreography and P1 detail polish that make it feel world-class.
**Mode:** mvp
**Depends on**: Phase 2 (frozen contract + validator), Phase 3 (shared components, icons, motion)
**Requirements**: ENG-01, ENG-02, ENG-03, ENG-04, ENG-05, CNT-01, CNT-02, CNT-04, RWD-01, RWD-02, RWD-03, MOT-05
**Success Criteria** (what must be TRUE):
  1. All 15 Gen-3 lesson files and 4 review files render end-to-end unmodified through `AwbaLesson(cfg)` / `AwbaReview(cfg)` — every beat type (read, frame, verse, panel×4, depth, reflect, mc, tf, tile) displays correctly and scripture text is byte-identical to source.
  2. Sensitive-content holds are verified present by an explicit grep/diff pass, recorded: U4-03 absent entirely, U3-13 not surfaced, U3-16 principle-only, group-namings held.
  3. Quiz and review mechanics match Gen-3 exactly: +12 noor/correct, +15 reflect, combo chip at 2+, PERFECT at 3-streak, stars 3/2/1 (never 0), amber-never-red; review 14s soft timer, timeout → auto-skip → untimed no-noor circle-back, any timeout caps at 2★, gold lamp progress, no back button.
  4. The post-lesson sequence (verdict → noor claim → returns → done) plays as choreography — staggered star/stat reveals, noor count-up, orange returns hero with a week calendar that never shows a "miss" state — and combo pill / PERFECT / confetti fire only on meta-progress screens, never over a scripture (`verse`) beat.
  5. Calm, dignified sound cues play on correct/incorrect/complete with a visible mute toggle; 3-Lens depth renders as an individually-expanding accordion (amber/blue/green, fixed order) that never blocks Continue; every Arabic span carries `lang="ar" dir="rtl"`, ayah text uses the Quran face, and ﷺ / honorifics / brackets render intact.
**Plans**: TBD
**UI hint**: yes

### Phase 5: Learn Page & Cross-Page View Transitions
**Goal**: A learner walks a beautiful winding path through the full Aqeedah course — live node states, anchored popups, daily ayah, chest — with native page-to-page transitions between every screen.
**Mode:** mvp
**Depends on**: Phase 4 (proven engine, state derivation, components, motion)
**Requirements**: LRN-01, LRN-02, LRN-03, LRN-04, LRN-05, LRN-06, LRN-07, CNT-03, RWD-04, MOT-02
**Success Criteria** (what must be TRUE):
  1. The Learn page renders the full journey — HUD (course chip, returns flame, noor, all tappable), "NEVER BREAKS" streak band, daily ayah card, 4 colour-coded unit header cards, a real connected winding node path, and a tab bar — and the path animates (nodes pop in with overshoot, path fills as units complete).
  2. Node states derive live from storage — locked (gentle shake + microcopy on tap, never a buzzer), available, active (breathing ring + lantern mascot), done (stars), review nodes gold, chest nodes gift-framed — and unlock order matches Gen-3 exactly (strictly sequential incl. m3/m3b, m2/m2b splits; chest after review), verified by walking the storage-driven states.
  3. Node popups anchor to their node with edge clamping + arrow offset (singleton, outside-tap closes) showing START / REVIEW / LEGENDARY CTAs with noor hints; tapping a chest grants a deterministic +25 noor exactly once (idempotent), never randomized.
  4. The daily ayah rotates through the verified 7-verse pool by day-of-year (no monthly repeat) and is revealed reverently; streak / noor / course-switcher bottom sheets share one implementation (Fiqh/Seerah/Qur'an as coming-soon rows), and every tab (Practice/Returns/Profile/More) gives designed coming-soon feedback — never a dead tap.
  5. Navigating path↔lesson↔review cross-fades/morphs via Cross-Document View Transitions wired on every page, degrading gracefully to a normal navigation on browsers without support (e.g. Firefox).
**Plans**: TBD
**UI hint**: yes

### Phase 6: Accessibility, RTL & Typography Hardening
**Goal**: Every screen is keyboard-operable, screen-reader-aware, contrast-safe, and renders Arabic and scholarly typography correctly across the whole app — the accessibility pass Gen-3 never had.
**Mode:** mvp
**Depends on**: Phase 5 (all screens exist for a cross-cutting hardening pass)
**Requirements**: ACC-01, ACC-02, ACC-03
**Success Criteria** (what must be TRUE):
  1. The entire app is operable by keyboard alone, with a visible `:focus-visible` style on every interactive element (compensating for suppressed tap-highlight).
  2. Quiz verdicts, noor changes, combo, and screen changes are announced via `aria-live` / `role=status`; icon-only controls carry accessible names and the reflect textarea is properly labelled.
  3. Amber, green, and gold state colours pass WCAG AA contrast, and correct/incorrect states carry a non-colour signal (icon/shape), verified against the standard.
  4. A final typography/RTL stress-test (verifying FND-03 and CNT-04 at full-app scale) confirms transliteration diacritics (ʿ ʾ ā ī ū ḥ ṣ ṭ ẓ ḍ ġ) and Khattab `˹˺` brackets display correctly, and Arabic containers use `unicode-bidi: isolate` so mixed Arabic/Latin lines never scramble.
**Plans**: TBD
**UI hint**: yes

### Phase 7: PWA Shell, Offline & Delivery
**Goal**: The site installs as a PWA, works offline after first visit, deploys as pure static files with zero build step, and passes the Gen-3 regression gate before ship.
**Mode:** mvp
**Depends on**: Phase 6 (asset paths stable before precache; final gate runs on hardened screens)
**Requirements**: PLT-02, PLT-03, PLT-04, PLT-05
**Success Criteria** (what must be TRUE):
  1. The app installs to the home screen (manifest + lantern icon family: any / maskable / apple) and, after a first visit, opens and navigates offline via a root-scoped service worker (cache-first static/hashed assets, network-first HTML navigations, `activate`-time cache purge).
  2. A mercy-toned, dismissible "add to home screen" nudge appears (mitigating iOS's 7-day storage eviction threat to the un-loseable promise) — never nagging, honoring dismissal.
  3. The site deploys to GitHub Pages/Vercel as pure static files with zero build step, and the README documents structure, how Josh reviews (open files directly via `file://`), and how to run the validator.
  4. The Gen-3 v1.1–v1.5 regression checklist passes before ship: popup anchoring, footer/hero spacing, review timer teeth, accordion lenses, chest idempotency, TF selection visibility, and back-button rules all verified intact.
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation — Tokens, Shell & Fonts | 1/4 | In Progress|  |
| 2. State Layer & Engine-Contract Freeze | 0/TBD | Not started | - |
| 3. Components, Icon Kit & Motion | 0/TBD | Not started | - |
| 4. Lesson & Review Engine Port | 0/TBD | Not started | - |
| 5. Learn Page & View Transitions | 0/TBD | Not started | - |
| 6. Accessibility, RTL & Typography | 0/TBD | Not started | - |
| 7. PWA Shell, Offline & Delivery | 0/TBD | Not started | - |
