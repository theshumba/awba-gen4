# Roadmap: Awba Gen-4

## Overview

Awba Gen-4 is a detail-layer execution rebuild of Josh's owner-approved Gen-3 MVP: the same product, rebuilt at world-class quality on the same zero-build, vanilla, `file://`-openable stack. The journey moves from the two highest-blast-radius decisions first — a true responsive shell replacing the fixed 380px phone-card (Phase 1) and a frozen state/engine contract with a standing validator (Phase 2) — then builds the shared components, icon registry, and motion language (Phase 3) that the screen runners consume. The lesson and review engines are ported next, rendering all 19 of Josh's data files verbatim with the reward choreography and P1 detail polish that make it feel alive (Phase 4). The net-new Learn page and native cross-page transitions come after the engine is proven (Phase 5), followed by a cross-cutting accessibility/RTL/typography hardening pass (Phase 6), and finally the PWA shell, offline caching, and the Gen-3 regression ship-gate (Phase 7). Every scripture word stays verbatim, sourced, scholar-gated, and every scholar hold carries over exactly.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation — Design Tokens, Responsive Shell & Fonts** - True full-viewport shell, one token layer, self-hosted fonts; kills the fixed 380px card (completed 2026-07-12, VERIFICATION PASSED 4/4)
- [x] **Phase 2: State Layer & Engine-Contract Freeze** - Versioned storage + migration, frozen `AW`/`AwbaLesson`/`AwbaReview` contract, standing validator (completed 2026-07-12)
- [x] **Phase 3: Components, Icon Kit & Motion Language** - Athar re-cut: register architecture, 20-icon currentColor registry, citation/gloss sheets, paper-press + one-easing motion vocabulary, Ring generator, prayer-clock sky (completed 2026-07-13 — §9 human gate APPROVED, 9/9 review warnings fixed, VERIFICATION 5/5)
- [x] **Phase 4: Lesson & Review Engine Port + Detail Layer** - All 19 data files render verbatim; reward choreography, sound, holds verified (completed 2026-07-13 — gate passed by owner directive, 5 review warnings fixed, VERIFICATION 5/5)
- [x] **Phase 5: Learn Page & Cross-Page View Transitions** - Winding node path, live states, daily ayah, native page-to-page transitions (completed 2026-07-14 — gate passed by owner directive, review-fixed, VERIFICATION 5/5 incl. the VT-morph selector fix)
- [x] **Phase 6: Accessibility, RTL & Typography Hardening** - Keyboard, aria-live, contrast, bidi + glyph stress-test across every screen (completed 2026-07-14 — all 7 plans, gate passed by owner directive, 1 review Warning fixed [W1 AW.sheet re-entrancy], VERIFICATION PASS; human sensory walk carried forward on the owner ledger)
- [x] **Phase 7: PWA Shell, Offline & Delivery** - Installable PWA, offline-after-first-visit, static deploy, Gen-3 regression ship-gate (completed 2026-07-14 — manifest + lantern icon family + root-scoped service worker [precache/cache-first/network-first/activate-purge] + mercy-toned install nudge + README + PLT-05 Gen-3 regression gate; gate resolved by owner directive, code-review 0 findings, VERIFICATION PASS; device install/offline walk carried forward on the owner ledger) — **MILESTONE COMPLETE: all 7 phases done, the app is FINISHED**

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
  - [x] 01-02-PLAN.md — One-stylesheet token + base shell layers (@layer order, per-unit accent scales, responsive grid)
  - [x] 01-03-PLAN.md — preview.html verification vehicle (token sheet, live unit-switch, glyph test, zero-CDN)
  - [x] 01-04-PLAN.md — Reviewer D-12 checklist gate (human-verify)
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
**Plans**: 2 plans
  - [x] 02-01-PLAN.md — State layer: versioned `awba_state` blob + lossless Gen-3 migration + `awba_prefs` store, all under one parse-time `AW` namespace, headless node:test proven (FND-05/06/07)
  - [x] 02-02-PLAN.md — Content validator: node:vm cfg ingestion + frozen contract checks + fixtures + self-test (ENG-07)

### Phase 3: Components, Icon Kit & Motion Language
**Goal**: A shared component library, a single icon registry, and one motion vocabulary exist and are proven before the screen runners consume them.
**Mode:** mvp
**Depends on**: Phase 1 (consumes design tokens)
**Requirements**: FND-04, ENG-06, MOT-01, MOT-03, MOT-04
**Design authority (re-cut 2026-07-12):** the Athar System — `03-UI-SPEC-ATHAR.md` supersedes `03-UI-SPEC.md`; the old D-44 gate is superseded by plan 03-12's gate.
**Success Criteria** (what must be TRUE):
  1. One icon registry renders every branded icon from the canonical 20-SVG source (inline, `aria-hidden`, single source of truth); every icon follows the one currentColor + `--icon-accent` re-inking model (no runtime recolour, no bespoke colour variants — lantern-gold deleted per D-A6), and no duplicate per-page icon constants remain.
  2. Tapping a citation chip opens a bottom sheet (RTL Arabic, verbatim translation, source line, grade pill for hadith, `unverified · pending review` pill); tapping a term opens its gloss sheet (Arabic, transliteration, word, definition, context).
  3. Every tappable surface (buttons, options, tiles, chips, sheet rows, tabs) shares the same token-defined paper-press and the one Athar motion vocabulary (one easing family, one register verb per screen) across nodes, sheets, and quiz feedback.
  4. With `prefers-reduced-motion` set (or the user override on), all animation quietens globally — a reviewer toggles the OS setting and every ambient loop and transition calms down; the Ring renders its final state statically.
  5. The Ring generator (deterministic seeded tawaf-fingerprint, §6 acceptance criteria) and the prayer-clock sky (manual-set times, 5 canvas temperatures, §7 acceptance criteria) are built and proven before Phase 4 consumes them.
**Plans**: 12 plans (03-05 superseded by the Athar re-cut 2026-07-12)
  - [x] 03-01-PLAN.md — CSS: 4 tokens + @layer components chrome + gummy press + @layer motion vocabulary + dual-trigger reduced-motion (MOT-01/03/04) — visual values superseded by re-cut
  - [x] 03-02-PLAN.md — Engine KIT: AW.KIT (20 scenes + authored lantern-gold) + AW.GLYPHS (13) + AW.UNIT_ICON (FND-04) — lantern-gold later deleted by 03-08
  - [x] 03-03-PLAN.md — Engine COMPONENTS: AW.icon/cite/wire/sheet(+sheetRef face-split/sheetTerm)/confetti/reducedMotion/animate + components.test.js (FND-04/ENG-06/MOT-04)
  - [x] 03-04-PLAN.md — preview.html sections 9-12 (old-look living reference; rebuilt by 03-11)
  - [~] 03-05-PLAN.md — SUPERSEDED (old D-44 gate; never walked — replaced by 03-12)
  - [x] 03-06-PLAN.md — Tokens + base re-ground: @layer tokens rewrite + register architecture (§2/§3)
  - [x] 03-07-PLAN.md — Ring generator spike — deterministic tawaf-fingerprint SPOF (§6)
  - [x] 03-08-PLAN.md — Icon re-inking: currentColor + `--icon-accent` model, lantern-gold deleted (§5)
  - [x] 03-09-PLAN.md — Components re-skin + motion vocabulary rewrite (§4)
  - [x] 03-10-PLAN.md — Prayer-clock sky: 5 temperatures, manual times, `--dawn` (§7) — pure now→temperature fn, no schema bump, boot dataset.sky + home-shell mirror, --dawn horizon glow; suite 53/53
  - [x] 03-11-PLAN.md — New Athar preview.html — the living reference (§8) — rebuilt from scratch as 8 sections of real AW.* output (register worlds / type under scripture law / thermal ramp / component inventory / byte-verbatim citation sheet / deterministic tawaf ring / prayer-clock sky / reduced-motion proof); demoCfg spliced byte-identical (SHA f7ec7f07); the four poppins-*.woff2 deleted (Poppins fully retired); suite 53/53; watched live in headless Chrome
  - [x] 03-12-PLAN.md — Final human visual gate: §12 prechecks + §9 checklist — prechecks all green; Melusi walked the ten items 2026-07-13: **APPROVED**, no items routed back
**UI hint**: yes

### Phase 4: Lesson & Review Engine Port + Detail Layer
**Goal**: All 15 lessons and 4 reviews render end-to-end from Josh's verbatim data files through the compatible engine, with the reward choreography and P1 detail polish that make it feel world-class.
**Mode:** mvp
**Depends on**: Phase 2 (frozen contract + validator), Phase 3 (shared components, icons, motion)
**Requirements**: ENG-01, ENG-02, ENG-03, ENG-04, ENG-05, CNT-01, CNT-02, CNT-04, RWD-01, RWD-02, RWD-03, MOT-05
**Success Criteria** (what must be TRUE):
  1. All 15 Gen-3 lesson files and 4 review files render end-to-end unmodified through `AwbaLesson(cfg)` / `AwbaReview(cfg)` — every beat type (read, frame, verse, panel×4, depth, reflect, mc, tf, tile) displays correctly and scripture text is byte-identical to source.
  2. Sensitive-content holds are verified present by an explicit grep/diff pass, recorded: U4-03 absent entirely, U3-13 not surfaced, U3-16 principle-only, group-namings held.
  3. Quiz and review mechanics match Gen-3 exactly in NUMBERS, expressed in Athar language: +12 noor/correct, +15 reflect, combo accrual at 2+ (gold-dot accrual per D-A14), 3-streak celebration (Athar expression, never the retired PERFECT overlay), stars 3/2/1 (never 0), grey-ink mercy — never red, never amber (Athar law 8); review 14s soft timer, timeout → auto-skip → untimed no-noor circle-back, any timeout caps at 2★, gold progress thread, no back button.
  4. The post-lesson sequence (verdict → noor claim → returns → done) plays as choreography — staggered star/stat reveals, noor count-up, a returns hero in Athar language with a week calendar that never shows a "miss" state — and celebratory expressions (gold-dot accrual, streak celebration, Ring draw, Festival stamp) fire only on meta-progress screens, never over a scripture (`verse`) beat.
  5. Calm, dignified sound cues play on correct/incorrect/complete with a visible mute toggle; 3-Lens depth renders as an individually-expanding accordion (three visually distinct lenses per the Athar contract, fixed order) that never blocks Continue; every Arabic span carries `lang="ar" dir="rtl"`, ayah text uses the Quran face, and ﷺ / honorifics / brackets render intact.
**Plans**: 7 plans
  - [x] 04-01-PLAN.md — Test foundation: pure runner-math helpers (ENG-03/04) + AW.sound plumbing (MOT-05) + render-smoke & port-audit harnesses (completed 2026-07-13 — suite 64→70 green)
  - [x] 04-02-PLAN.md — Lesson @layer screens CSS (Page register): shell, 9 beat surfaces, scripture-law scard, 3-lens accordion, reward screens (completed 2026-07-13 — token-only S1–S4 surfaces filled; suite held 70/70; runtime verification of ENG-01/ENG-05/CNT-04 pends the 04-03 runner)
  - [x] 04-03-PLAN.md — AwbaLesson(cfg) runner: all 9 beats + quiz (exact numbers) + port u1-m1 — the walking slice (one lesson renders end-to-end) (completed 2026-07-13 — suite 70→87 green; u1-m1 cfg SHA-identical, validate/port-audit/render-smoke all exit 0; plain terminus, choreography is 04-04)
  - [x] 04-04-PLAN.md — Reward choreography flagship: WAAPI verdict→noor→returns→done→Ring→du’a (RWD-01/02/03), celebration never over scripture (completed 2026-07-13 — six-moment WAAPI choreography, one register per screen; Ring draws only the new frontier via animateFrom=preLessonAtoms captured at init [no replay, law 9]; noor persists once via AW._noorClaimer seam; du'a close cfg-gated for content integrity; suite 87→88 green, render-smoke SMOKE OK)
  - [x] 04-05-PLAN.md — AwbaReview(cfg) runner + review CSS (Orbit+gold) + port u1-review: 14s timer state-machine, circle-back, rosette mastery (ENG-02/04) (completed 2026-07-13 — mechanics byte-preserved via the 04-01 helpers; whole session on .reg-orbit + Hajar Gold, gold thread progress + rosette seal, quiet ember .low; u1-review cfg SHA-identical, validate/port-audit/render-smoke all exit 0; suite 88→94 green)
  - [x] 04-06-PLAN.md — Full content port: 14 lessons + 3 reviews byte-verbatim, holds verified (U4-03 absent, U3-13/U3-16), all 19 exit 0 (CNT-01/02/04) (completed 2026-07-13 — all 19 files now exist and render; port-audit BYTES OK ×19 zero DRIFT; validator exit 0 with exactly the 3 accepted notes; render-smoke 19/19 SMOKE OK; suite held 94/94)
  - [x] 04-07-PLAN.md — Phase gate: automated prechecks (suite + validator×19 + grep gates + render-smoke) then BLOCKING human visual walk (autonomous:false)
**UI hint**: yes

### Phase 5: Learn Page & Cross-Page View Transitions
**Goal**: A learner walks a beautiful winding path through the full Aqeedah course — live node states, anchored popups, daily ayah, chest — with native page-to-page transitions between every screen.
**Mode:** mvp
**Depends on**: Phase 4 (proven engine, state derivation, components, motion)
**Requirements**: LRN-01, LRN-02, LRN-03, LRN-04, LRN-05, LRN-06, LRN-07, CNT-03, RWD-04, MOT-02
**Success Criteria** (what must be TRUE):
  1. The Learn page renders the full journey — HUD (course chip, returns, noor, all tappable), streak band, daily ayah card, 4 unit header cards (identity via chapter-term + icon per Athar — no unit colour-coding), a real connected winding node path, and a tab bar — and the path animates per the Athar motion vocabulary as units complete.
  2. Node states derive live from storage — locked (gentle microcopy on tap, never a buzzer), available, active (Athar active-node treatment — no mascot, aniconism), done (stars), review nodes gold, chest nodes gift-framed — and unlock order matches Gen-3 exactly (strictly sequential incl. m3/m3b, m2/m2b splits; chest after review), verified by walking the storage-driven states.
  3. Node popups anchor to their node with edge clamping + arrow offset (singleton, outside-tap closes) showing START / REVIEW / LEGENDARY CTAs with noor hints; tapping a chest grants a deterministic +25 noor exactly once (idempotent), never randomized.
  4. The daily ayah rotates through the verified 7-verse pool by day-of-year (no monthly repeat) and is revealed reverently; streak / noor / course-switcher bottom sheets share one implementation (Fiqh/Seerah/Qur'an as coming-soon rows), and every tab (Practice/Returns/Profile/More) gives designed coming-soon feedback — never a dead tap.
  5. Navigating path↔lesson↔review cross-fades/morphs via Cross-Document View Transitions wired on every page, degrading gracefully to a normal navigation on browsers without support (e.g. Firefox).
**Plans**: 6 plans
  - [x] 05-01-PLAN.md — Engine seams + Wave-0 tests + atom re-wire (65→61 denominator, D-57) (completed 2026-07-13 — NODE_ATOMS/AW.atomsDone/AW.dailyIndex/mute exports added + tested (learn-state.test.js, RED→GREEN); 65→61 denominator swept atomically across engine + ring.test.js/sky.test.js/preview.html; render-smoke discovers root learn.html; suite 98→107 green)
  - [x] 05-02-PLAN.md — learn.html Orbit shell: HUD + Ring hero (static) + continue card + streak/constellation + daily ayah (LRN-01/05) (completed 2026-07-13 — learn.html at repo root, root-relative head; static Ring hero (no animateFrom, law 9); AW.weekCal() constellation; navy continue card → live active node; DAILY spliced byte-verbatim (SHA e23fd7cf…) + day-of-year rotation + port-audit DAILY BYTES OK; @layer-screens-only CSS, order line count 1; render-smoke clean; suite 107/107)
  - [x] 05-03-PLAN.md — Unit headers + winding path + live node grammar + earned gold thread + Ibrahim line (LRN-02/04, CNT-03) (completed 2026-07-14 — 4 cream-Farag-square unit headers (chapter-term + gold scene icon, no colour-coding); real <button> node stations on a serpentine (not Duolingo circles) with live data-state from AW.deriveNodeState mapped to the shipped thermal/rosette/plate grammar; one SVG ink thread per section through node centres, earned portion gold + STATIC on load (law 9/W8, no ink-draw replay), recomputed on load+resize+ResizeObserver; Ibrahim 14:24 Courier epigraph (R-7 fallback — verse absent from corpus, no scripture generated); D-61 auto-scroll (next node / hash validated vs UNITS id set); node-state walk verified fresh + seeded; suite 107/107, render-smoke 20/20)
  - [x] 05-04-PLAN.md — Node popup + navigation wiring + cross-document View Transitions morph (LRN-03, MOT-02) (completed 2026-07-14 — singleton cream popup mounted on document.body [Pitfall 3: CTA resolves to visible Page-crimson .btn, probe ctaBg=rgb(163,44,33)], placePop edge-clamp + arrow --ax + above/below flip, outside-tap+Esc, aria-expanded; contents per §S4 copy table [binary-done seed-row R-2, star row, verbatim CTAs START·earn noor/REVIEW·improve your stars/START/LEGENDARY AGAIN], locked = gentle 'Not yet — finish what comes before.' no CTA [D-54], chest gift copy + __awbaClaimChest stub for 05-05; @view-transition{navigation:auto} top-level high [line 23 < @layer screens 930, order line count 1], reduced-motion VT kill block in @layer motion both triggers, guarded pageswap/pagereveal stamp/clear ONE circuit-term pair [node .onode-mark ↔ .journey, uniqueness proved countAtSnapshot=1, scripture never named, cleared after finished], file:// = clean no-op; render-smoke 20/20 + vt-nav check; localStorage 13, suite 107/107)
  - [x] 05-05-PLAN.md — Shared sheet family + tab bar coming-soon + chest claim + Festival interstitial (LRN-06/07, RWD-04) (completed 2026-07-14 — the ONE shared sheet family on the shipped AW.sheet singleton [no bespoke sheet DOM]: openStreakSheet [Marcellus returns count + day/days + AW.weekCal week row + verbatim never-breaks note] opened from the HUD returns stat + streak strip + Returns tab [one implementation], openNoorSheet [gold-filled Marcellus count + verbatim note], openSwitcher [Aqeedah ACTIVE olive pill + Fiqh/Seerah/Qur'an .sheet-row.off COMING SOON, calm neutral pill, never disabled-dead]; the tab bar Learn active with the R-5 GOLD active cue on Orbit [.reg-orbit .tab.active override + 2px gold top-rule in @layer screens, crimson 2.65:1 banned → gold 8.40:1, shipped crimson rule OVERRIDDEN never edited], every inactive tab a designed coming-soon AW.sheet + Returns→streak sheet [no dead tap]; window.__awbaClaimChest = write-once chests guard granting +25 noor EXACTLY ONCE [deterministic, never randomized, idempotent — claim-twice probe delta=25] opening the Festival circuit-plate interstitial [a separate .reg-festival overlay on document.body: dated folk .plate stamps in with Rakkas title, CIRCLE crowd-arrival .dab drift-settle around a small Ring, that circuit's gold thread arc closes, private + maker's-marked date+seed in Courier; learn screen stays Orbit law 1; reduced motion → final-static, +25 still granted; no new keyframe]; render-smoke 20/20 + vt-nav, suite 107/107, localStorage 0/13, @layer order 1, glyphCount 13; commits 8367513/8a0fbc1/d1bd0be)
  - [x] 05-06-PLAN.md — Phase gate: automated prechecks + BLOCKING human visual walk (autonomous:false)
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
**Plans**: 7 plans (3 Wave-0 foundation gates -> 3 narrow-seam implementation plans -> the two-stage gate; sequential waves, one executor at a time on main)
**Wave model**: each plan's `wave` number is its SEQUENCE POSITION (sequential-on-main, one executor at a time), NOT a parallel batch — 06-04 (depends on 06-01) and 06-06 (depends on 06-01/06-04) carry wave numbers above max(deps)+1 by design, not as a dependency error.
  - [x] 06-01-PLAN.md — a11y probe harness: keyboard/dialogs/announce probes (shipped baseline pinned ACTIVE, gaps { todo }-gated so the suite holds fail 0) (ACC-01/02) (completed 2026-07-14 — three permanent probe files added: a11y-keyboard.test.js [8 active: native-semantics sweep, zero positive tabindex, reflect label, register-token :focus-visible gold-on-Orbit/crimson-on-Page via live-token comparison, .onode journey DOM order; 4 todo: state-in-name, native streak strip, native ayah citation button, aria-pressed selection cue], a11y-dialogs.test.js [5 active: AW.sheet/npop/Festival role+aria-modal+Escape+singleton+focus-restore, claim-before-open Escape ordering; 10 todo: sheet/popup/Festival containment-wrap via synthetic-Tab defaultPrevented + focus-into/name/focus-move/focus-return], a11y-announce.test.js [all 10 todo: region exists+survives-swaps, correct/miss/reflect composed announce, reward focus-to-heading, review answer announce, 10s single-fire, timeout mercy narration, Question-N-of-M narration, result focus-and-stat — driven via --virtual-time-budget]; suite 114→154 [130 pass/0 fail/24 todo, exact 4+10+10 ledger]; zero product source touched; localStorage 13; commits 72f0879/4d71489/4802036)
  - [x] 06-02-PLAN.md — typography/RTL gate: rewrite the broken glyph gate (14-face roster, real-string harvest) + rtl-audit.mjs + the neutral-copy typo-stress fixture (ACC-03 / FND-03 / CNT-04 re-verify, D-66) (completed 2026-07-14 — check-glyph-coverage.py REWRITTEN [was exit-1 crash on the retired-font ref]: 14 faces mapped to CSS --font-* role-stacks, codepoints HARVESTED from real app strings via a comment-skipping tokenizer, cmap-proven per role with the fallback law — workhorse Latin readex∪inter [˹˺ via Inter], scripture Arabic Amiri-Quran∪Amiri, Readex Arabic-UI minus the scripture-only marks U+06D6–06E6 (the actual shipped marks, a correction to the plan's U+0657–065F), Courier macron proof, display faces exempt — catches Ḥ U+1E24/Ḏ U+1E0E/Courier ā automatically, exit 0; rtl-audit.mjs NEW permanent exit-code gate [render-smoke template, read-only computed-style driver over 20 pages + the fixture = 21 targets: every rendered Arabic run in [lang=ar], every [lang=ar] computes unicode-bidi:isolate, .ayah/.scripture rtl+isolate, .ayah asks Amiri Quran, no overflow narrow+desktop — exit-code-first, exit 0]; typo-stress.html NEW neutral-copy specimen [every face + full diacritic/bracket/mark set + mixed-bidi, out of precache by location]; suite held 154 [130 pass/0 fail/24 todo]; localStorage 13, @layer order ×1, glyphCount 13; render-smoke/port-audit/validate-content all exit 0; zero product source touched; 3 Rule-1 deviations self-caught [exempt-range correction, fixture caption lang-tagging, audit skip-script-source]; commits 691c3cf/0e01539/635f5ef)
  - [x] 06-03-PLAN.md — contrast-audit.mjs: WCAG computed-style sweep over 20 pages + the full interaction-state forcing table (ACC-03, D-65) (completed 2026-07-14 — one shared relativeLuminance/contrastRatio fn + one effectiveBackground(el) ancestor-compositing resolver [register-ground TERMINAL in the walk, live CSS-custom-property token, never a hardcoded hex]; a TreeWalker text sweep [4.5:1/3:1 large] + a curated non-text UI-boundary sweep [.opt/.tf/.tile correct border, thermal [data-state] shapes, .np-seed inked, review timer-low fill, a rolling :focus-visible sample] at 3:1; the full interaction-state forcing table [learn.html pre-IIFE seed + popup variants + Festival; a generic content-agnostic per-lesson walker through every real beat incl. depth-lens force-expand + a pre-#check SELECTED snapshot + wrong/correct resolution + the full reward chain to du'a-close; a review driver that lets the real 14s timer genuinely expire once via virtual-time to reach .low/timeout, then answers the rest quickly through circle-back/result]; ground-truth reproduced [gold-on-Kiswah ~8.40:1, ember-on-Kiswah ~5.05:1] + banned-cell check confirmed; coverage 20 pages / 2972 text + 2568 non-text UI pairings / 305 forced states; suite held 154 [130/0/24]; localStorage 13, @layer order ×1, glyphCount 13; zero product source touched [no authority this plan]. ONE REAL FINDING escalated not fixed: .ls-back on the du'a-close Sky-night terminal ~1.2:1 [needs 4.5:1] on all 15 lessons — shared/awba-engine.css:1054-1061 has no reg-sky-night override; suggested one-line zero-new-hex fix logged for 06-05/06-06 [re-point to --paper-62, matching the .rv-shell .ls-count precedent]; contrast-audit.mjs currently exits 1 on the real shipped surface until that fix lands. 1 audit-script bug self-caught+fixed pre-commit [Rule 1: the ancestor walk fell through a gradient-painted register ground to body's own unrelated opaque background before the register-ground-terminal fix]. Two documented non-gating interpretation calls flagged for the 06-07 gate [gold-as-shape-on-cream NOTE vs FAIL; the idle .opt/.tf/.tile keyline excluded from 3:1]; commits 30967a7/77d8f97)
  - [ ] 06-04-PLAN.md — engine a11y primitives: AW.announce + .aw-sr live region + AW._trapFocus + AW.sheet(html,label) name/focus-into + focus-ring unify (ACC-01/02, D-63/D-64)
  - [ ] 06-05-PLAN.md — runner a11y: composed announce + focus-to-heading + 10s/timeout narration + non-colour selection cue + real disabled states (ACC-01/02/03, D-64/D-65)
  - [ ] 06-06-PLAN.md — learn.html a11y: node state-in-name + streak/ayah conversions (R-9) + popup/Festival dialog contract + sheet-caller labels (ACC-01/02, D-62/D-63)
  - [ ] 06-07-PLAN.md — two-stage phase gate: automated prechecks (suite + the 3 new permanent audits + standing gates) then the BLOCKING human keyboard/VoiceOver/tofu/bidi walk (autonomous:false, D-68)
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
| 1. Foundation — Tokens, Shell & Fonts | 4/4 | Complete | 2026-07-12 |
| 2. State Layer & Engine-Contract Freeze | 2/2 | Complete   | 2026-07-12 |
| 3. Components, Icon Kit & Motion | 12/12 | Complete | 2026-07-13 |
| 4. Lesson & Review Engine Port | 7/7 | Complete | 2026-07-13 |
| 5. Learn Page & View Transitions | 6/6 | Complete | 2026-07-14 |
| 6. Accessibility, RTL & Typography | 7/7 | Complete | 2026-07-14 |
| 7. PWA Shell, Offline & Delivery | 3/3 | Complete | 2026-07-14 |
