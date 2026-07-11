# Project Research Summary

**Project:** Awba Gen-4
**Domain:** Zero-build, vanilla HTML/CSS/JS, multi-page, static-hosted Duolingo-style Islamic micro-learning PWA — a from-scratch execution rebuild of an already-shipped, owner-approved MVP
**Researched:** 2026-07-11
**Confidence:** HIGH

## Executive Summary

Awba Gen-4 is not a green-field product-decision project — it's a **detail-layer execution rebuild**. Josh's Gen-3 MVP (`_MVP-BUILD/`, 5 live owner-review rounds on 2026-07-10) already locks the macro feature set, the design direction (blue/purple/teal/gold unit system, lantern companion, gold "legendary" reviews, noor/returns mercy mechanics), and the non-negotiable engine contract (`AwbaLesson(cfg)`/`AwbaReview(cfg)` global functions called from classic `<script>` tags, because Josh reviews by opening files directly via `file://`, and `type="module"` scripts are blocked by Chrome/Firefox over `file://`). Research confirms the right technical strategy is to squeeze world-class polish out of *that exact stack* using 2024–2026 native browser platform capabilities — CSS nesting, container queries, `@property`, `color-mix()`, `linear()` easing, the Web Animations API, and (the single biggest structural unlock) the Cross-Document View Transitions API, which gives a genuinely multi-page static site native page-to-page motion with one CSS rule and zero JS router. No framework, bundler, animation library, or CDN dependency is justified at this scale; every "library" need is either a native platform API or a small vendored file.

The recommended build order (see Architecture + roadmap below) starts with fixing the foundational shell (Josh's MVP renders everything inside a fixed 380×788px "phone card" centered on a colored backdrop — a prototype-in-a-frame, not a true responsive layout, and the single most consequential thing to get right first since every later phase builds on top of the container decision), then locks the storage/state schema and the engine contract as a protected surface with a standing regression gate, then layers components → motion → the lesson/review runners (ported verbatim against Josh's exhaustively-documented `cfg` schema) → the new Learn page → an accessibility/RTL pass → the PWA shell last. Detail-layer work Josh's engine currently lacks entirely — sound design, node entrance/pulsing-ring animation, reward-screen stagger/count-up, and page transitions — is what turns "a Duolingo clone shell" into something that reads as world-class.

The key risks all cluster around **silently breaking locked contracts while polishing execution**: (1) modularizing the engine (ES modules, `defer`/`async`) breaks Josh's file:// review workflow and all 19 content pages simultaneously and silently; (2) porting the fixed phone-card layout literally instead of building a true full-viewport responsive shell; (3) regenerating lesson prose "for polish" from source atom documents instead of porting Josh's already-redacted HTML, risking silent reintroduction of scholar-held-back content (U4-03 is a full hold); (4) new celebration/motion polish bleeding confetti or full-screen overlays into scripture (`verse` beat) screens, violating the locked "no casino juice over scripture" rule; and (5) iOS Safari's 7-day idle eviction of script-writable storage threatening the product's core "un-loseable noor, unbreakable returns" promise for any learner who hasn't installed the PWA to their home screen. None of these are exotic — they are all concretely documented with prevention/detection steps in PITFALLS.md and should each anchor a specific phase gate rather than be treated as generic QA line items.

## Key Findings

### Recommended Stack

The stack is fully constrained (vanilla, zero-build, static-hosted) but not primitive: modern browsers (target: iOS Safari 17.x+/Chrome 105+) now natively support most of what used to require a framework or animation library. Classic `<script src>` tags (not ES modules) are the confirmed, non-negotiable loading strategy because Josh's proven review workflow is opening files via `file://`, and module scripts fail to load in that context. Fonts (Poppins/Inter/Amiri, plus **Amiri Quran** specifically for verbatim ayah text) must be self-hosted and subsetted, never pulled from a CDN, to protect the PWA's offline/installable promise.

**Core technologies:**
- Native CSS Nesting, Container Queries, `@property`, `color-mix()` — Baseline-available component-scoped styling and unit-color theming without Sass/PostCSS or a build step
- CSS `linear()` easing + Web Animations API (`element.animate()`) — native spring/bounce motion and Promise-sequenced choreography (verdict → noor claim → returns → done), the single biggest unlock for "Duolingo-grade" motion without a JS animation library
- View Transitions API (same-document + **cross-document/MPA**, Safari 18.2+/Chrome 126+) — native page-to-page transitions between static HTML pages with `@view-transition { navigation: auto; }`, zero JS router; ship as progressive enhancement (Firefox/older Safari just navigate normally, no fallback code needed)
- Web App Manifest + hand-written Service Worker (~50 lines) — installable PWA shell; SW never registers over `file://`, which is fine and expected, not a bug to work around
- Hand-rolled or vendored `canvas-confetti` (single local file, no CDN) for celebration bursts

### Expected Features

This is the **detail layer only** — the macro feature set is already shipped and fixed by PROJECT.md; research read Josh's actual engine code (`awba-engine.js`/`.css`) directly to find the gap between "a working shell" and "feels world-class."

**Must have (P1 — table stakes to clear the "feels cheap" bar):**
- Node entrance/unlock animation, pulsing active-node ring — cheap, highest-visibility "path feels alive" fixes
- Correct/wrong/lesson-complete sound cues + mute toggle — the single biggest sensory gap versus Duolingo (zero audio exists today)
- Full-coverage tap-press physics (extend Josh's existing gumdrop-button pattern everywhere, not new invention)
- Reward-screen stagger reveal + noor count-up — makes the already-built verdict→claim→returns→done sequence read as choreography, not a stack of static screens
- Locked-node gentle-shake feedback (currently silent no-op)
- Cross-Document View Transitions on all 20 pages — fixes the current hard flash-cut between every page navigation, additive CSS, low risk

**Should have (P2 — differentiators, distinctly Awba not a Duolingo reskin):**
- Chest opening anticipation sequence (deterministic reward, ceremony without gambling — explicitly *not* Duolingo's randomized-odds mechanic)
- Character reaction states (companion responds to right/wrong/finished, never sad/disappointed)
- Returns tally rendered as a heatmap of presence (never a calendar with visible "gap" cells)
- Named/shared-element morph transitions (node icon → lesson header icon)

**Defer (v1.x/v2+):**
- Tap-to-hear daily ayah recitation — needs licensed audio, a content pipeline decision, not an engineering task
- Legendary-specific gold shimmer completion moment — pure delight-layer polish on an already-working result screen

**Deliberately reject (anti-features):** escalating streak urgency, streak freeze economy, randomized-odds chest rewards, guilt-framed/sad-mascot notifications, leaderboards/leagues this milestone, confetti layered over scripture, and treating the Vibration API (zero iOS Safari support) as a primary feedback channel. Each of these is a well-documented, tempting Duolingo default that directly contradicts the locked mercy-framing thesis.

### Architecture Approach

One CSS file using native `@layer` (tokens/base/components/motion/screens) and one JS engine file organized into clearly banner-commented sections (state/kit/components/lesson-runner/review-runner) — not five physical files — because every lesson/review `<script src>` tag across Josh's 19 content files would need touching to add more script tags, which the zero-content-edit constraint forbids. `AwbaLearn`/`awba-learn.js` is the one genuinely new file (no legacy dependents). All persistent state consolidates into a single versioned `localStorage['awba_state']` JSON blob (replacing today's ungoverned discrete `awba_*` keys) with migration logic hidden entirely inside an `AW.S` interface — no caller ever touches `localStorage` directly. The `AwbaLesson(cfg)`/`AwbaReview(cfg)` global-function contract, `AW.cite`, and the two-line `<link>`/`<script>` head boilerplate are frozen and must never change shape.

**Major components:**
1. **State layer (`AW.S`)** — the only module allowed to read/write `localStorage`; versioned schema + migration, `AW.deriveNodeState()` as a pure, testable function
2. **Components + Kit layer** — shared chrome (skeleton, HUD, sheets, citation chips, confetti), inline-SVG icon registry built from the canonical 20-icon brand set
3. **Screen runners (`AwbaLesson`, `AwbaReview`, `AwbaLearn`)** — the protected content contract surface; own their own step machines, read state via `AW.state()` only
4. **PWA shell (`sw.js` at repo root, manifest, icons)** — built last; precaches app shell only (never content pages, which change during scholar review), network-first for HTML navigations

### Critical Pitfalls

1. **Fixed 380×788 "phone card" ported as literal layout** — Josh's MVP is a prototype-in-a-frame, not a true mobile layout. Rebuild against real viewport units (`100dvh`) + `env(safe-area-inset-*)` from day one, with an explicit, deliberate desktop presentation — don't just scale the mobile card.
2. **Breaking the `AwbaLesson`/`AwbaReview` global-function contract** — any move to ES modules, or adding `defer`/`async` to the engine `<script>` tag, silently breaks all 19 content pages at once (blank page, no visible error to a non-technical reviewer). Freeze the API; extend Josh's existing `node --check` + headless-load-all-pages verification into a standing regression gate after every engine change.
3. **Over-trusting localStorage for the "un-loseable" promise** — iOS Safari's 7-day idle eviction of script-writable storage can wipe noor/returns/stars for learners who bookmark rather than install the PWA. Mitigate with explicit install-to-home-screen prompting (framed as a data-safety feature), honest in-product copy, and consider a backup/export affordance; this cannot be caught by normal QA and should be logged as a known v1 limitation for the owner.
4. **Re-deriving lesson content from atom source instead of porting Josh's verbatim redacted HTML** — risks silently reintroducing scholar-held-back content (U4-03 full hold, U3-13, U3-16, several group-namings). Port `beats[]`/`refs{}`/`terms{}` verbatim; diff any rewritten copy against the hold list per lesson.
5. **New celebration effects/motion polish bleeding into scripture screens** — confetti or full-screen overlays must never fire while a `verse` beat is on-screen or fading out; this is a locked pedagogy rule, not a style preference, and is easy to accidentally violate when adding "more delight."

## Implications for Roadmap

Based on combined research, the ARCHITECTURE.md "Suggested Build Order" maps directly onto a phase structure, sequenced so that irreversible/high-blast-radius decisions (container shell, state schema, engine contract) are locked before anything downstream depends on them.

### Phase 1: Foundation — Design Tokens, True Responsive Shell & Font Pipeline
**Rationale:** Every other phase renders inside this container; Pitfall #1 (fixed phone-card-as-layout) must be resolved before any lesson porting or motion work begins, or fixing it later means re-touching all 19 pages' layout assumptions.
**Delivers:** `@layer tokens` design system (colors incl. proper per-unit theming — Gen-3 only overrides `--blue`, leaving secondary elements half-themed on purple/teal units, a bug to fix here), self-hosted subsetted `.woff2` fonts (Poppins/Inter/Amiri + Amiri Quran), a true full-viewport (`100dvh` + safe-area-aware) mobile shell with an explicit desktop presentation.
**Addresses:** STACK.md font self-hosting + native CSS custom-property theming.
**Avoids:** Pitfall #1, the moderate "iOS overscroll/safe-area" pitfall, and the Google Fonts FOUC/Arabic-tofu pitfall.

### Phase 2: State Layer & Engine-Contract Freeze
**Rationale:** The state layer has zero DOM dependency and is independently testable in isolation; the frozen global-function contract is the single most catastrophic risk in the whole rebuild (Pitfall #2), so it must be locked, tested, and gated before content porting starts, not discovered after 15 lesson files are already touched.
**Delivers:** Consolidated versioned `localStorage['awba_state']` schema with migration hidden in `AW.S`, `AW.deriveNodeState()` as a pure function, a standing regression harness (`node --check` + headless load + `document.title`/root-node assertions across all 19 pages), and a `cfg`-shape validator (beat types, required per-type fields, orphaned `refs`/`terms` ids).
**Implements:** ARCHITECTURE.md's state layer; ENGINE-CONTRACT.md's exact schema.
**Avoids:** Pitfall #2, Pitfall #3 (decide the install-prompt/backup mitigation strategy here), Pitfall #6 (no schema validation).

### Phase 3: Components, Icon Kit & Motion Language
**Rationale:** Depends on tokens (Phase 1); shared components (skeleton, HUD, sheets, citation chips) must exist and be proven before the lesson/review runners consume them. Motion refines already-correct structure, so it comes after components, not before.
**Delivers:** `AW.KIT` icon registry rebuilt from the canonical 20-SVG brand set (resolving the current 12-vs-20 mismatch and duplicated unit-icon maps), a formalized `AW.recolor()` helper, and a `linear()`-easing motion vocabulary with `prefers-reduced-motion` guards applied everywhere (currently absent entirely).
**Uses:** STACK.md's native CSS nesting/container queries/`@property`/`color-mix()`/`linear()` easing + WAAPI.

### Phase 4: Lesson & Review Engine Port (content + P1 detail layer)
**Rationale:** Build/validate `AwbaLesson` before `AwbaReview` — 15 of Josh's 19 files exercise it immediately, the fastest path to proving backward compatibility against real content. This is where the highest-stakes content-integrity and pedagogy-guardrail pitfalls live.
**Delivers:** The full beat-type renderer (read/frame/verse/panel/depth/reflect/mc/tf/tile) exactly per ENGINE-CONTRACT.md's schema, all 15 lessons + 4 reviews ported verbatim with per-lesson hold-list diff checks, the legendary review engine (timer/lamp-path/circle-back), and the P1 detail-layer features: node entrance animation, pulsing active-node ring, sound cues + mute toggle, reward-screen stagger + count-up, locked-node feedback, full-coverage tap physics.
**Addresses:** FEATURES.md P1 items; ENGINE-CONTRACT.md's exhaustive `cfg` schema.
**Avoids:** Pitfall #4 (content re-derivation), Pitfall #5 (confetti near scripture), and the moderate pitfall of regressing Josh's v1.1–v1.5 owner-fixed bugs (popup anchoring, hero/footer overlap, review-timer mercy mechanic, chest idempotency) — convert Build Record §7 into a literal regression checklist here.

### Phase 5: Learn Page & Cross-Page View Transitions
**Rationale:** `AwbaLearn` is net-new code with no legacy constraint; per ARCHITECTURE.md's build order it should come last among screen runners, once state + components + motion are already proven inside the lesson/review screens.
**Delivers:** `index.html` + `awba-learn.js` (HUD, daily ayah, streak band, unit cards, zigzag node path with correct locked/active/done derivation), Cross-Document View Transitions wired across all 20 pages as progressive enhancement, and (P2) named/shared-element morph transitions (node icon → lesson header icon).
**Addresses:** FEATURES.md's single biggest structural "feels cheap" fix (page transitions) and its top differentiator (shared-element morph).
**Avoids:** the repeated-localStorage-read-in-render-loop anti-pattern already present in Gen-3.

### Phase 6: Accessibility, RTL & Typography Hardening
**Rationale:** Josh's engine has near-zero accessibility today (2 `aria-label`s total, no `:focus-visible`, no `aria-live`, no `lang="ar"`) and handles RTL via CSS `direction` only, not the `dir` attribute — PROJECT.md explicitly requires an accessibility pass. Best done as a dedicated cross-cutting phase once all screens exist, though checks should run continuously from Phase 1 onward.
**Delivers:** `aria-live` on quiz verdicts/state changes, keyboard operability, `dir="rtl"`/`lang="ar"`/`unicode-bidi: isolate` on Arabic containers, a diacritic + `˹˺`-bracket-glyph font stress test, WCAG AA contrast verification (amber especially).
**Avoids:** the RTL bidi pitfall, the font-coverage-gap pitfall (flagged LOW-MEDIUM confidence, needs an actual rendering test, not an assumption).

### Phase 7: PWA Shell & Offline
**Rationale:** Build order puts this last deliberately — the precache list references exact file paths from every prior phase; standing up the service worker before those paths are stable produces stale-cache debugging noise.
**Delivers:** `manifest.webmanifest`, a versioned `sw.js` at repo root (network-first HTML navigations, cache-first shared assets, explicit `activate`-time cache purge), `offline.html` fallback, install-to-home-screen prompting (the concrete mitigation for Pitfall #3), `overscroll-behavior`/`viewport-fit=cover` handling.
**Uses:** STACK.md's minimal hand-written service-worker pattern.
**Avoids:** the first-time SW cache-versioning mistake and iOS overscroll-bounce pitfall.

### Phase Ordering Rationale

- **Irreversible/high-blast-radius decisions come first:** the container shell (Phase 1) and the engine/state contract (Phase 2) are the two things every other phase depends on and are the most expensive to fix late — both are called out explicitly in PITFALLS.md as "fix at the start or re-touch everything."
- **Content porting (Phase 4) is deliberately sequenced after the supporting layers are proven**, not first, because building components/motion in isolation against fixtures is safer than discovering contract bugs while simultaneously hand-porting 19 real content files.
- **Net-new code (Learn page, Phase 5) comes after ported legacy code (lessons/reviews, Phase 4)**, matching ARCHITECTURE.md's explicit build-order reasoning — it has no backward-compatibility constraint to protect and benefits from a proven component/motion layer.
- **Cross-cutting hardening passes (accessibility/RTL, Phase 6) and infrastructure (PWA, Phase 7) come last** because they touch every screen and are cheapest to apply uniformly once the screens are stable, not because they're low priority — PROJECT.md requires both as active requirements, not nice-to-haves.

### Research Flags

Needs deeper research during planning (`/gsd:plan-phase --research-phase N`):
- **Phase 5 (Cross-Document View Transitions with named/shared elements):** the underlying API is well-verified (STACK.md, HIGH confidence), but the *pattern* of shared-element "becomes" transitions across 20 independently-loaded static pages with consistent DOM naming is newer/less battle-tested than the base feature-detection case — worth a focused pass before implementation.
- **Phase 4 (sound design asset sourcing):** engineering the mute toggle/Web Audio wiring is straightforward, but sourcing or commissioning a "calm, dignified, reharmonized" cue set (explicitly not a stock chime pack, not literal Duolingo brightness) is a content/asset decision needing its own research or a design pass before wiring.
- **Phase 6 (font glyph coverage):** the diacritic (ʿ ʾ ā ī ū ḥ ṣ ṭ ẓ ḍ ġ) and Khattab-bracket (˹˺, U+02F9/U+02FA) glyph coverage in Poppins/Inter/Amiri was flagged LOW-MEDIUM confidence in both STACK.md and PITFALLS.md — not independently verified against actual font files, needs a real rendering stress-test, not just research.

Standard patterns (skip research-phase, patterns are already well-documented in this research):
- **Phase 1 (tokens/shell):** native CSS layer/nesting/container-query patterns are Baseline and HIGH confidence.
- **Phase 2 (state layer):** the versioned-localStorage-wrapper pattern is standard and fully specified in ARCHITECTURE.md with working reference code.
- **Phase 3 (components/motion):** `linear()` easing + WAAPI patterns are verified against MDN/caniuse directly, with concrete reference patterns already provided.
- **Phase 4 (beat-type rendering):** the entire `cfg` contract is exhaustively documented in ENGINE-CONTRACT.md (read directly from source) — implementation is porting against a known spec, not research.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified directly against MDN, caniuse, and WebKit/Chrome primary sources for every version-support claim; the only LOW-MEDIUM item (Poppins variable-font availability) is flagged for a 2-minute manual check, not load-bearing to any decision |
| Features | MEDIUM-HIGH | Duolingo mechanics are extensively documented via official blog posts and detailed design-breakdown sources; faith-app specifics (Hallow/YouVersion/Tarteel/Quranly/Jibreel) are MEDIUM (marketing pages + reviews, not internal data); the calibration against what's *actually already built* is HIGH because it was read directly from Josh's shipped engine code, not inferred |
| Architecture | HIGH | Derived directly from reading the full reference implementation (`learn.html`, `awba-engine.js`/`.css`, sample lesson/review files) rather than general best-practice inference; cross-checked against current platform facts (`@layer` support, `file://` module-loading restriction via a WHATWG issue + MDN CORS docs) |
| Pitfalls | HIGH for code-level pitfalls (read directly from source + Josh's own build-record changelog); MEDIUM for the iOS 7-day storage eviction claim (corroborated by a WebKit forum statement + real-world GitHub issue reports, not a canonical spec); LOW-MEDIUM for exact font glyph-table coverage (flagged explicitly as needing a stress-test, not verified) |

**Overall confidence:** HIGH — this research is unusually strong because three of the four files (Architecture, Pitfalls, and the session-intel Engine-Contract/Assets docs) are grounded in direct reads of the actual reference implementation rather than general-domain inference, and the Stack research's platform-capability claims were independently re-verified against primary sources rather than trusted from secondary blog posts.

### Gaps to Address

- **Poppins variable-font availability** (STACK.md, LOW-MEDIUM): not independently re-verified this session — do a 2-minute manual check of `fonts.google.com/specimen/Poppins` before committing to the subsetting approach (variable-instance vs. per-weight static files changes the vendoring script).
- **Amiri/Inter/Poppins glyph coverage for transliteration diacritics + Khattab `˹˺` brackets** (STACK.md + PITFALLS.md, LOW-MEDIUM): not independently verified against actual font files — resolve with a real rendering stress-test during the typography phase (Phase 6), not an assumption.
- **iOS Safari 7-day storage-eviction risk to the "un-loseable" promise** (PITFALLS.md, MEDIUM): cannot be caught by normal QA (requires real multi-day idle testing) — treat as a known, documented v1 limitation requiring an explicit owner-level decision on install-prompt strategy and/or a backup/export affordance, not something to silently "test away."
- **Clear Quran commercial licensing** (PROJECT.md, carried over, not re-litigated by this research): flagged as an owner-level item, not build-blocking for v1 — the current pattern (verbatim text embedded in lesson `cfg.refs` at authoring time, no live API fetch) is architecturally correct regardless of how the licensing question resolves.
- **Sound cue sourcing** (FEATURES.md): the *engineering* (Web Audio wiring, mute toggle, settings-preference storage pattern) is well-specified; the *content* (which 3-4 audio cues, commissioned vs. sourced, reharmonized tone) is an open creative decision that should be resolved before Phase 4 sound wiring begins.

## Sources

### Primary (HIGH confidence)
- Direct reads of `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/` — `learn.html`, `shared/awba-engine.js` (464-465 lines), `shared/awba-engine.css` (326 lines), `lessons/u1-m1.html`, `reviews/u1-review.html`, `00_BUILD-RECORD.md` §4/§5/§7 — the ground truth for the existing engine contract, quality gaps, and owner-fixed bug history
- MDN — View Transition API, `easing-function: linear()`, `color-mix()`, CSS Properties and Values API guide, `@layer`, CORS/`file://` module-loading restriction
- caniuse.com — `linear()` easing, View Transitions API, `color-mix()` exact version numbers
- WebKit.org — Two lines of Cross-Document View Transitions code (confirms Safari 18.2+)
- Chrome for Developers — Cross-document view transitions for multi-page applications
- `/Users/theshumba/Documents/GitHub/awba-gen4/.planning/PROJECT.md` and session-intel files `ENGINE-CONTRACT.md`/`ASSETS.md` — active requirements and the exact `cfg` compatibility contract, both read directly

### Secondary (MEDIUM confidence)
- Duolingo Blog (streak-milestone design, character design) — official design-team accounts
- deconstructoroffun.com, Blake Crosley, 60fps.design — detailed Duolingo interaction/timing breakdowns
- Hallow, YouVersion, Tarteel, Quranly, Jibreel official sites/help centers — faith-app feature comparison
- Apple Developer Forums thread + WebKit team statement, corroborating GitHub issue — iOS Safari 7-day storage-eviction behavior and standalone-PWA exemption
- CSS-Tricks, jsmanifest, MagicBell, Zeepalm — service-worker caching strategy consensus (cross-corroborated, not one canonical spec)

### Tertiary (LOW confidence, flagged for validation)
- Poppins variable-font availability — not independently re-verified (Google Fonts specimen page is JS-rendered, WebFetch could not retrieve the table)
- Amiri/Amiri Quran/Inter exact glyph-table coverage for scholarly diacritics and Khattab-convention bracket glyphs — general typeface-intent knowledge, not a verified font-file check

---
*Research completed: 2026-07-11*
*Ready for roadmap: yes*
