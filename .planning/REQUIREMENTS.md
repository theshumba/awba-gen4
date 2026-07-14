# Requirements — Awba Gen-4 v1

**Defined:** 2026-07-11 · **Mode:** auto (owner directive: proceed autonomously) · **Source:** PROJECT.md scope + research corpus (FEATURES P1 = v1 detail layer; P2/P3 deferred)

Macro product scope is fixed by Josh's Gen-3 MVP (the owner-approved direction). v1 = rebuild that product at world-class quality. Deferred items are recorded, not forgotten.

## v1 Requirements

### Foundation (design system + state)

- [x] **FND-01**: A single design-token layer (CSS `@layer` in one engine stylesheet) defines all colors, type, radii, shadows, motion durations/easings — no literal hex/px invention in screen code; unit colors exist ONCE (CSS custom properties, consumed by JS from the same source)
- [x] **FND-02**: Unit theming fully recolors a lesson page (primary AND secondary accents — no half-themed pages on purple/teal units like Gen-3's fixed blue2/blue3)
- [x] **FND-03**: Fonts self-hosted as subset .woff2 (Poppins, Inter, Amiri, Amiri Quran for ayah text) with font-display strategy — no Google Fonts CDN dependency, no FOUC flash on navigation; ˹ ˺ brackets and transliteration diacritics render correctly (glyph test)
- [x] **FND-04**: One icon registry built from the 20 canonical branded SVGs (inline, aria-hidden, single source — no per-page duplicate icon constants); gold lantern is a properly authored variant, not a regex recolor
- [x] **FND-05**: All progress state lives in one versioned localStorage blob with a migration chain that imports existing Gen-3 `awba_*` keys losslessly, exposed behind the same `AW.S.get/set` call shape
- [x] **FND-06**: A user-preferences store (sound mute, reduced motion override) exists separately from progress state
- [x] **FND-07**: Classic scripts + one `AW` global namespace (NO ES modules) so every page works opened directly from file:// — Josh's review workflow

### Engine (lesson + review runners)

- [x] **ENG-01**: `AwbaLesson(cfg)` accepts Josh's Gen-3 config shape unchanged — all 9 beat types (read, frame, verse, panel×4 variants, depth, reflect, mc, tf, tile), refs/terms dictionaries, markers (fact/remember/fard/angle), opener/recap/grew/next fields — verified by rendering all 15 real lesson files
- [x] **ENG-02**: `AwbaReview(cfg)` accepts Josh's Gen-3 review config shape unchanged (items MC/TF with explanation `t`, mastery, next) — verified by rendering all 4 real review files
- [x] **ENG-03**: Quiz mechanics preserved exactly: +12 noor/correct, +15 reflect, combo chip at 2+, PERFECT at 3-streak, stars 3/2/1 by mistakes (never 0), amber-never-red misses, varied praise pool, good/gentle copy surfaces
- [x] **ENG-04**: Review mechanics preserved exactly: 14s soft timer, +15/+5 swift, timeout → auto-skip → untimed no-noor circle-back, any timeout caps at 2★, lamp progress, gold intro/result, no back button
- [x] **ENG-05**: 3-Lens depth renders as individually-expanding accordion (Reality amber / Revelation blue / Ruling green, fixed order), always opt-in, never blocking Continue
- [x] **ENG-06**: Citation chips open a bottom sheet (Arabic RTL, verbatim translation, source line, grade pill for hadith, `unverified · pending review` pill); term glosses open their sheet (Arabic, transliteration, gloss, definition, context)
- [x] **ENG-07**: A lesson-config validator (standalone script, runnable via node) checks every lesson/review data file: known beat types, resolvable citation/term IDs, required fields, answer indices in range — CI-style gate for the port and for Josh's future lessons

### Content port

- [x] **CNT-01**: All 15 lessons + 4 reviews ported from Josh's redacted Gen-3 output verbatim (NOT regenerated from atoms — the sensitive holds live in his omissions); scripture text byte-identical to source files
- [x] **CNT-02**: Sensitive-content holds verified present in the port: U4-03 absent entirely, U3-13 not surfaced, U3-16 principle-only, group-namings held — checked by explicit diff/grep pass, recorded
- [x] **CNT-03**: Learn path unlock order matches Gen-3 (strictly sequential incl. m3/m3b, m2/m2b splits; chest after review), verified by walking the storage-driven states
- [x] **CNT-04**: Every Arabic span carries `lang="ar" dir="rtl"`; ayah text uses the Quran-specific face; ﷺ renders after the Prophet's name; honorifics/brackets intact

### Learn page

- [x] **LRN-01**: Learn page renders HUD (course chip, returns flame, noor — all tappable), streak band ("NEVER BREAKS"), daily ayah card, 4 unit header cards, winding node path, tab bar
- [x] **LRN-02**: Node states derive live from storage: locked (with gentle "not yet" feedback on tap — shake + microcopy, never a buzzer), available, active (breathing ring + lantern mascot), done (stars) — review nodes gold, chest nodes gift-framed
- [x] **LRN-03**: Node popups anchor to their node with edge clamping + arrow offset (Gen-3 v1.4 fix preserved), singleton, outside-tap closes; START/REVIEW/LEGENDARY CTAs with noor hints
- [x] **LRN-04**: The path is drawn as a real visual journey (connected/flowing, not just alternating circles) and animates: nodes enter with overshoot pops, path fills as units complete
- [x] **LRN-05**: Daily ayah rotates through the verified 7-verse pool by day-of-year (no monthly repeat bug), rendered reverently (quiet reveal, no celebration effects on scripture)
- [x] **LRN-06**: Streak/noor/course-switcher bottom sheets (one shared implementation, no duplicated HTML); course switcher shows Fiqh/Seerah/Qur'an as polished coming-soon rows
- [x] **LRN-07**: Tab bar: Learn active; Practice/Returns/Profile/More give designed coming-soon feedback on tap (sheet or state — never a dead tap)

### Reward choreography

- [x] **RWD-01**: Post-lesson sequence (verdict → noor claim → returns → done) is choreographed: staggered star/stat reveals, noor count-up animation, per-beat companion presence — reads as a sequence of moments, not static screens
- [x] **RWD-02**: Returns screen: orange hero, big count, week calendar whose visual grammar never shows a "miss" state (lighter presence, never gaps/red/broken)
- [x] **RWD-03**: Combo pill + PERFECT overlay + confetti preserved and elevated (confetti performant, never fires over scripture screens); reward screens keep clear button/footer separation (Gen-3 v1.2 fix)
- [x] **RWD-04**: Chest = deterministic gift (+25 noor, contents implied before tap), idempotent claim (Gen-3 v1.1 fix), never randomized odds

### Motion & feel

- [x] **MOT-01**: One motion vocabulary (token-defined durations + `linear()` spring easings) used across nodes, buttons, sheets, quiz feedback, reward beats
- [x] **MOT-02**: Cross-document View Transitions wired on every page (`@view-transition`) so path↔lesson↔review navigations cross-fade/morph instead of hard-cutting; graceful no-op on Firefox
- [x] **MOT-03**: Tap press physics (gummy shadow-collapse) applied to every tappable surface (options, tiles, chips, sheet rows, tabs — full inventory)
- [x] **MOT-04**: `prefers-reduced-motion` respected globally (confetti, PERFECT, bob/glow, transitions all quieten) plus user override in preferences
- [x] **MOT-05**: Correct/incorrect/complete/streak sound cues — calm, dignified, own identity (not arcade-bright) — with a visible mute toggle; celebration audio peaks land on meta-progress screens, never the ayah/scripture moment

### Accessibility

- [ ] **ACC-01**: Full keyboard operability with visible `:focus-visible` styles on every interactive element (tap-highlight suppression compensated)
- [ ] **ACC-02**: Quiz verdicts, noor changes, combo, and screen changes announced via aria-live/role=status; icon-only controls carry accessible names; reflect textarea properly labelled
- [ ] **ACC-03**: Colour contrast of amber/green/gold states verified against WCAG AA; correct/incorrect states carry a non-colour signal

### Platform & delivery

- [x] **PLT-01**: True responsive layout: full-bleed app on phones (dvh-safe, overscroll handled, safe-area insets), gracious centered-column presentation on desktop — no fixed 380px card
- [ ] **PLT-02**: Installable PWA: manifest, lantern icon family (any+maskable+apple), root-scoped service worker (cache-first hashed/static assets, network-first navigations), offline works after first visit
- [ ] **PLT-03**: A gentle "add to home screen" nudge exists (mitigates iOS 7-day localStorage eviction threat to the un-loseable promise) — mercy-toned, dismissible, never nagging
- [ ] **PLT-04**: Site deploys as pure static files (GitHub Pages/Vercel compatible), zero build step; repo has a README covering structure, how Josh reviews (open files), and how to run the validator
- [ ] **PLT-05**: Regression checklist carried from Gen-3 v1.1–v1.5 owner fixes, checked before ship (popup anchoring, footer spacing, timer teeth, accordion lenses, chest idempotency, TF selection visibility, back button rules)

## v2 Requirements (deferred, recorded)

- [ ] **V2-01**: Chest opening anticipation sequence (two-beat: shake/lid → reveal with count-up + cue)
- [ ] **V2-02**: Companion reaction states (settled-content on correct, calm on miss, celebrate on milestone — never sad/disappointed)
- [ ] **V2-03**: Returns-as-heatmap presence view (longer history once `awba_days` accumulates)
- [ ] **V2-04**: Named shared-element morphs (node icon "becomes" lesson header) upgrading the v1 cross-fade
- [ ] **V2-05**: Tap-to-hear recitation on daily ayah (licensed audio — content-gated)
- [ ] **V2-06**: Legendary gold-dust shimmer completion moment
- [ ] **V2-07**: Practice hub / profile / quests surfaces (currently coming-soon states)

## Out of Scope

- Accounts, backend, Supabase, Stripe — v1 is device-local by design; awba-app repo is the infra reserve
- Chat/speak-back companion layer (Gen-2 V2) — parked by Josh; post-v1 conversation
- Leagues/leaderboards/friend streaks — out of scope + tension with mercy framing; coming-soon only
- Streak freeze economy / escalating streak urgency / randomized chest odds / sad-mascot guilt — anti-features, permanently out (contradict the un-loseable premise)
- New religious content of any kind — nothing generated; Josh's redacted output is the only content source
- Fiqh/Seerah/Qur'an courses — no content exists; switcher shows coming soon
- Device vibration as a primary feedback channel — zero iOS support; CSS press physics is the mechanism

## Traceability

Every v1 requirement maps to exactly one phase. Coverage: 42/42 (100%). See `.planning/ROADMAP.md` for phase detail.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FND-01 | Phase 1 | Complete |
| FND-02 | Phase 1 | Complete |
| FND-03 | Phase 1 | Complete |
| PLT-01 | Phase 1 | Complete |
| FND-05 | Phase 2 | Complete |
| FND-06 | Phase 2 | Complete |
| FND-07 | Phase 2 | Complete |
| ENG-07 | Phase 2 | Complete |
| FND-04 | Phase 3 | Complete |
| ENG-06 | Phase 3 | Complete |
| MOT-01 | Phase 3 | Complete |
| MOT-03 | Phase 3 | Complete |
| MOT-04 | Phase 3 | Complete |
| ENG-01 | Phase 4 | Complete |
| ENG-02 | Phase 4 | Complete |
| ENG-03 | Phase 4 | Complete |
| ENG-04 | Phase 4 | Complete |
| ENG-05 | Phase 4 | Complete |
| CNT-01 | Phase 4 | Complete |
| CNT-02 | Phase 4 | Complete |
| CNT-04 | Phase 4 | Complete |
| RWD-01 | Phase 4 | Complete |
| RWD-02 | Phase 4 | Complete |
| RWD-03 | Phase 4 | Complete |
| MOT-05 | Phase 4 | Complete |
| LRN-01 | Phase 5 | Complete |
| LRN-02 | Phase 5 | Complete |
| LRN-03 | Phase 5 | Complete |
| LRN-04 | Phase 5 | Complete |
| LRN-05 | Phase 5 | Complete |
| LRN-06 | Phase 5 | Complete |
| LRN-07 | Phase 5 | Complete |
| CNT-03 | Phase 5 | Complete |
| RWD-04 | Phase 5 | Complete |
| MOT-02 | Phase 5 | Complete |
| ACC-01 | Phase 6 | Pending |
| ACC-02 | Phase 6 | Pending |
| ACC-03 | Phase 6 | Pending |
| PLT-02 | Phase 7 | Pending |
| PLT-03 | Phase 7 | Pending |
| PLT-04 | Phase 7 | Pending |
| PLT-05 | Phase 7 | Pending |
