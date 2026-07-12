# Phase 3: Components, Icon Kit & Motion Language - Context

**Gathered:** 2026-07-12 (auto mode — owner directive: proceed autonomously; recommended options selected, logged in 03-DISCUSSION-LOG.md)
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the shared visual/interaction layer the Phase-4/5 screen runners consume: ONE icon registry built from the canonical 20-SVG branded set (FND-04), the citation-chip + term-gloss bottom-sheet system (ENG-06), one `linear()` motion vocabulary + gummy press physics on every tappable surface class (MOT-01, MOT-03), and global reduced-motion quieting via OS setting OR the Phase-2 user override (MOT-04). Components are proven in the living style reference (preview.html) BEFORE any runner consumes them. NO lesson/review runner logic, NO content port, NO Learn page — Phases 4–5.

</domain>

<decisions>
## Implementation Decisions

### Icon registry (FND-04)
- **D-31:** `AW.KIT` lives in the engine file's KIT banner section (D-22 single-file rule): one readable multi-line template literal per icon, each preceded by a one-line comment naming the icon — built from the canonical 20-SVG folder (`~/Downloads/AWBA APP/_ORGANIZED/03_Branding/icon files/`, 240×300 viewBox, blob-bg + brand-blue + sparkle motif). *(AMENDED 2026-07-12 post-research: svgo pass SKIPPED — the id-collision audit found zero ids/defs/gradients across all 20 files, removing svgo's only correctness purpose; icons are hand-authored into the KIT — strip `xmlns`/`width`/`height`, keep `viewBox` — avoiding `npx` entirely. Recorded in 03-UI-SPEC.md Recorded Decisions #2.)* Gen-3's embedded 12-icon KIT and learn.html's duplicate UIC/IC_* constants are superseded — this registry is the ONLY icon source going forward.
- **D-32:** Public accessor `AW.icon(name, {size?, label?})` returns the inline SVG string with `aria-hidden="true" focusable="false"` injected by default; passing `label` instead emits `role="img"` + `aria-label` (forward-compat for ACC-02). Raw `AW.KIT.name` access stays available for legacy-shaped runner code, but every NEW call site uses `AW.icon()`.
- **D-33:** Gold lantern = **authored variant** committed as its own optimized SVG entry (`lantern-gold`), hand-recolored from 03-lantern.svg to the gold scale (`--gold`/`--gold2` values, night-register-safe) — NOT a runtime regex recolor. `AW.recolor()` is NOT ported; if a future case needs tinting, it must be authored or use currentColor deliberately. Small standalone glyphs Gen-3 used (flame, spark, check, star, cite, lamp, lock, chest, trophy + marker glyphs fact/remember/fard/angle) join the registry as a `GLYPHS` sub-map — single source, no per-page constants.
- **D-34:** Icons ship at author-time inside the engine JS (zero runtime fetch — offline/PWA-safe, classic-script-safe). No external sprite file (ARCHITECTURE.md's rejection stands).

### Sheet system (ENG-06)
- **D-35:** ONE bottom-sheet primitive (`AW.sheet(contentHtml)` + scrim) in the COMPONENTS section — singleton (opening a sheet closes any open one), outside-tap/scrim-tap closes, close affordance in-sheet, slide-in via the motion vocabulary, `role="dialog"` + `aria-modal` basics now (full focus-trap/a11y hardening is Phase 6). Streak/noor/course-switcher sheets (Phase 5, LRN-06) MUST reuse this same primitive.
- **D-36:** Citation sheet built on D-35: ref pill + optional grade pill (hadith `kind`/`grade`), Arabic block ALWAYS `lang="ar" dir="rtl"` in the correct face (`.ayah`→Amiri Quran for Quran refs; general Amiri for hadith), verbatim translation, source line, and the `unverified · pending review` pill on EVERY citation (global pending state — per-citation verified state stays deferred). Term gloss sheet: Arabic large, transliteration, gloss word, definition, context — field-for-field per ENGINE-CONTRACT §1.
- **D-37:** `AW.cite(id,label)` (already stubbed in the validator) ships for real in COMPONENTS: synchronous at parse time (D-23 — Josh's data files call it inside cfg string concatenation), returns `<span class="cite" data-ref="…">` markup identical to Gen-3. `AW.wire(root, cfg)` resolves `.cite[data-ref]`→cfg.refs and `.term[data-term]`→cfg.terms exactly as Gen-3.
- **D-38:** Demo content for sheets in preview.html = ONE citation + ONE term ported VERBATIM from Josh's `_MVP-BUILD/lessons/u1-m1.html` refs/terms dicts (scripture is never authored/generated; porting his redacted output is the only permitted source). Nothing celebratory renders over or around the scripture demo block.

### Motion vocabulary & press physics (MOT-01, MOT-03)
- **D-39:** The `@layer motion` + `@layer components` layers of `shared/awba-engine.css` are filled now, consuming ONLY Phase-1 motion tokens (D-08 durations + `linear()` springs — no new easing literals outside the tokens layer). One vocabulary: press, pop-in (overshoot), sheet-in, fade/slide micro-transitions, breathing/bob ambient loops — each demo'd and labelled in preview.html.
- **D-40:** Gummy press physics (shadow-collapse + translateY on `:active`) applied via ONE shared class/mixin pattern to the FULL tappable inventory: `.btn`, `.opt`, `.tf`, `.tile`, citation chips, sheet rows, tabs, HUD stat chips, node circles (Phase 5 consumes). Token-defined depths (no literal px in component rules where a token exists).
- **D-41:** JS-orchestrated sequences (Phase 4 reward choreography) will use WAAPI `element.animate()` with the same token easing strings — Phase 3 establishes the pattern with one proven example (PERFECT overlay pop or combo chip entrance) so Phase 4 copies, not invents. Confetti = hand-rolled primitive (`AW.confetti(n)`, DOM-div based like Gen-3, ~Gen-3 counts) living in COMPONENTS with its reduced-motion guard built in from day one.

### Reduced motion (MOT-04)
- **D-42:** One global quieting mechanism, defined once in the motion layer: `@media (prefers-reduced-motion: reduce)` AND `[data-motion="reduce"]` (the Phase-2 `awba_prefs` boot-stamp) share the same rule bodies — durations collapse to ~1ms, ambient loops (bob/glow/breathing) stop, confetti becomes a no-op (`AW.confetti` checks `matchMedia` OR the html attribute at call time), PERFECT overlay reduces to a simple fade. State-communicating transitions (press feedback, sheet appearing) shorten rather than vanish. preview.html demonstrates both trigger paths.

### Verification vehicle & gate
- **D-43:** preview.html is EXTENDED (new sections: icon registry grid with all 20 + gold lantern + glyphs; sheet demos with live open/close; press-physics inventory row; motion vocabulary demos with reduced-motion toggle note). It remains the one living style reference. Showcase chrome stays in the unlayered preview `<style>` block; all real component CSS goes in the engine layers.
- **D-44:** Phase gate = human visual verify (like Phase 1's D-12): Melusi opens preview.html over file:// and walks a short checklist (icons render crisply at UI sizes, gold lantern reads intentional, sheets feel premium, press physics gummy-not-mushy, reduced-motion collapses everything). Automated prechecks first (icon count in KIT = 20 + variants, zero CDN, grep gates, tests still green). The `frontend-design` skill (and emil-design-eng craft bar) loads during execution of any visual plan; executor_hint `opus-visual` for the flagship visual work.

### Claude's Discretion
- Exact svgo settings, KIT string formatting, sheet markup structure, demo copy (non-scripture), how the press-physics inventory is presented in preview.html, WAAPI example choice — within the locked decisions and Gen-3 warmth (cream, rounded, soft, gummy — elevated).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Assets & contract
- `/Users/theshumba/Downloads/AWBA APP/_ORGANIZED/03_Branding/icon files/` — the canonical 20 SVGs (01-mosque … 20-ramadan-calendar, 240×300) — THE icon source (not Josh's embedded 12)
- `.planning/research/ASSETS.md` — icon-kit taxonomy, canon note, Arabic typography laws that bind sheet rendering
- `.planning/research/ENGINE-CONTRACT.md` §1 (refs/terms field shapes the sheets render), §5 (Gen-3 icon kit state being superseded), §6 (motion/a11y gaps Phase 3 owns: no reduced-motion handling, zero icon a11y semantics)
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/shared/awba-engine.js` — Gen-3 `AW.cite`/`AW.wire`/sheet/confetti implementations (behavior ground truth to elevate)
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/lessons/u1-m1.html` — source of the ONE verbatim demo ref + term (D-38)

### Prior phase decisions that bind
- `.planning/phases/01-foundation-design-tokens-responsive-shell-fonts/01-CONTEXT.md` — D-04 (single stylesheet, layers pre-declared), D-05/D-06 (semantic tokens, per-unit scales — components consume `--accent*` only), D-08 (motion tokens exist; Phase 3 consumes, never invents)
- `.planning/phases/02-state-layer-engine-contract-freeze/02-CONTEXT.md` — D-21 (`data-motion="reduce"` boot-stamp Phase 3 binds to), D-22 (KIT/COMPONENTS are banner sections in the ONE engine file), D-23 (parse-time synchronous definitions), D-24 (components never touch localStorage — prefs read via `AW.prefs`)
- `.planning/research/STACK.md` — `linear()` easing, WAAPI patterns, hand-rolled confetti recommendation, SVGO one-off pass, what NOT to use

### In-repo state
- `shared/awba-engine.css` — tokens/base layers live; `@layer components` and `@layer motion` are declared but empty (fill them, never redeclare the layer order)
- `shared/awba-engine.js` — STATE section live; KIT/COMPONENTS banner placeholders await this phase; RUNNERS stays a placeholder
- `preview.html` — the extension target (§ numbering continues after the glyph test)
- `scripts/tests/*.test.js` — 26 green tests that MUST stay green; `node --test scripts/tests/*.test.js` (never the directory form — Node v24.13.0 gotcha)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phase-1 motion tokens (`--ease-spring` etc., durations) and per-unit accent scales — the entire component layer paints from these.
- Phase-2 `AW.prefs` + `data-motion`/`data-sound` boot-stamp — MOT-04's user-override half is already plumbed.
- preview.html's unlayered showcase-chrome pattern + section structure — extend, don't fork.
- `scripts/check-glyph-coverage.py` + validator — gate precedents; any new automated precheck follows the same exit-code convention.

### Established Patterns
- Classic scripts, parse-time `AW`, zero CDN, page-relative URLs, `! grep -q` gates, literal D-NN in must_haves.truths, `node --test scripts/tests/*.test.js`.
- Section banners in both engine files; component CSS goes in `@layer components`, keyframes/transitions in `@layer motion`.

### Integration Points
- Phase 4 runners consume: `AW.icon`/`AW.KIT`, `AW.cite`/`AW.wire`, `AW.sheet`, `AW.confetti`, press-physics classes, WAAPI pattern.
- Phase 5 Learn page consumes: node pop-in, breathing ring, sheet primitive (streak/noor/switcher), tab press physics.
- Phase 6 hardens: sheet focus management, `AW.icon(label)` accessible-name path, contrast.

</code_context>

<specifics>
## Specific Ideas

- The owner bar stays: preview.html's new sections must FEEL premium — the icon grid is a brand moment, not an asset dump. Gen-3 warmth (cream field, soft radii, indigo shadows, gummy) elevated, never generic-minimal.
- Mercy laws bind visuals: amber never red; nothing celebratory over the scripture demo block; the pending-review pill is calm, not alarming.

</specifics>

<deferred>
## Deferred Ideas

- Companion reaction states (V2-02) and legendary gold-dust shimmer (V2-06) — v2, recorded in REQUIREMENTS.md.
- Per-citation verified/pending state — stays with the scholar-gate workflow discussion.
- Named shared-element morphs (V2-04) — v1 ships cross-fade only (Phase 5).

</deferred>

---

*Phase: 3-components-icon-kit-motion-language*
*Context gathered: 2026-07-12*
