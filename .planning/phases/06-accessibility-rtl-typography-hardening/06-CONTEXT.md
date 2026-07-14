# Phase 6: Accessibility, RTL & Typography Hardening - Context

**Gathered:** 2026-07-14 (auto mode — standing owner directive: fully autonomous chain; recommended options auto-selected, logged in 06-DISCUSSION-LOG.md)
**Status:** Ready for planning

<domain>
## Phase Boundary

A cross-cutting hardening pass over the COMPLETE app (learn.html + 15 lessons + 4 reviews + preview.html reference): keyboard operability, screen-reader announcements, contrast + non-colour signals, and a full-app typography/RTL stress test. NO new features, NO new surfaces, NO visual redesign — every visible change is a hardening of what shipped (focus rings, accessible names, live regions, contrast-only token repoints). PWA/deploy is Phase 7.

**BINDING TRANSLATION (same pattern as D-45/D-53):** ACC-03's requirement text says "Amber, green, and gold state colours" — Gen-3 vocabulary. The Athar reading: the state palette is grey-ink (wrongness, law 8), ember (in progress), gold (earned/mastered), olive (hadith grade pill), powder (not-yet). Amber is retired and appears nowhere. The audit targets the ACTUAL shipped token pairings per 03-UI-SPEC-ATHAR §2.1.

</domain>

<decisions>
## Implementation Decisions

### D-62 — Keyboard operability (ACC-01): native semantics first, one focus grammar
Every interactive element must be reachable and operable by keyboard alone: learn nodes (already `<button>`s — verify), popup CTAs, sheet rows/close, tabs, HUD stats, mute toggles, quiz options/tf/tiles, the 3-lens accordion headers, reflect textarea, retry/continue buttons, Festival dismiss. Rules: native elements only (`button`/`a` — no div-with-handler retrofits; where one exists, convert), NO positive tabindex, DOM order = tab order (the path's serpentine tab order follows the journey sequence). One `:focus-visible` grammar app-wide, register-aware: gold ring on dark grounds (Orbit/Sky), crimson-on-cream for Page objects (both already precedented — Phase 1 laid the [data-register] hook, Phase 5 shipped gold focus on Orbit; unify + audit for the suppressed tap-highlight compensation). Escape closes any open sheet/popup/Festival overlay.

### D-63 — Modal focus management (the SG-01 carry-forward lands here)
The three body-mounted overlay families (AW.sheet singleton, .npop node popup, .reg-festival interstitial) get: focus moved to the surface on open (the close button or the surface heading), a contained tab cycle while open (loop within the overlay — a small shared helper in the engine, one implementation for all three), focus RETURNED to the triggering element on close, aria-modal="true" + role="dialog" + an accessible name (the Festival overlay already ships role="dialog" aria-modal — extend the pattern). Outside-tap close behaviour unchanged.

### D-64 — Announcements (ACC-02): one polite live region, calm voice
One visually-hidden `role="status"` (polite) live region per page, engine-provided (`AW.announce(text)` helper). Announced: quiz verdicts ("Correct — that's it." / the gentle line on a miss), noor claims ("+12 noor — total N"), combo milestones (2+ accrual, 3-streak — the same praise copy), lesson/review screen transitions (the new screen's heading), review timeout ("Time — it will wait at the end"), chest claim ("+25 noor — a sure gift"), star results. NEVER announced: the 100ms timer tick (a single soft "10 seconds" warning at 10s remaining is the only mid-question time announcement), ambient motion, sky changes. Icon-only controls get aria-labels: the mute toggle already has one; add the path nodes per the Phase-5 checker todo — `aria-label="{node label}, {locked|available|done|review|gift}"` — plus HUD stats ("N noor — tap for details"), sheet close, popup close. The reflect textarea gets a real `<label>` (visually the existing prompt).

### D-65 — Contrast + non-colour signals (ACC-03): audit against the shipped reality
Sweep every text/UI pairing in the app against §2.1 (WCAG AA: 4.5:1 text, 3:1 UI shapes) — the phases already fixed the known offenders (WR-04/05 Phase 3, WR-02/03/04 Phase 4, WR-02/03 Phase 5); this pass PROVES the full surface with a scripted audit (computed styles from rendered pages, not just token pairs on paper) and fixes stragglers token-only. Non-colour signals: correct = the gold dot draw + check shapes (shipped), wrong = grey ink-blot + the why-line (shipped), thermal states = shape-first hollow/half/filled (shipped, D-A8) — verify each carries its shape cue everywhere it appears and fill any colour-only gap found (e.g. the review timer .low state gains a text cue via the 10s announcement + the numeric time already visible; the earned vs un-earned thread differs by continuity+weight, not just hue — verify).

### D-66 — Typography/RTL stress test (FND-03 + CNT-04 at full-app scale)
A committed, executable stress artifact: extend the existing glyph/render harness with (a) a fixture page (scripts/fixtures/typo-stress.html — neutral copy, NEVER scripture per the Phase-2 fixture law) exercising every rationed face with the full diacritic set (ʿ ʾ ā ī ū ḥ ṣ ṭ ẓ ḍ ġ), Khattab ˹ ˺ brackets, ﷺ, and mixed Arabic/Latin lines; (b) automated checks: every Arabic-bearing element in the REAL app carries lang="ar" dir="rtl" (grep/DOM-walk over rendered pages) and Arabic containers use unicode-bidi:isolate (computed-style check); (c) a headless render at 320px + desktop proving no tofu (the Phase-1 glyph-gate method: glyph coverage verified in the subset .woff2 files). Real scripture is verified in situ on the rendered lesson pages (byte-identity already SHA-gated — this phase checks RENDERING).

### D-67 — Scope discipline for a cross-cutting pass
Fixes land at the narrowest correct seam: engine-level for shared behaviour (focus helper, announce helper, focus-visible tokens), page-level only where a page authored its own markup (learn.html inline script). No mechanics changes, no copy rewrites beyond aria/label text, no schema/prefs bumps, localStorage count stays 13, @layer order line stays 1, zero new hex (token-only fixes; if a pairing genuinely cannot pass with existing tokens, STOP and log for the owner — do not invent colours). Suite baseline 114 never shrinks; every behaviour fix gets a regression pin (the Phase-4/5 lesson: real-DOM coverage, not stand-ins).

### D-68 — Verification shape
The phase gate mirrors 04-07/05-06: automated prechecks (suite + the new a11y/typo audits + all standing gates) then the blocking human checkpoint (resolved per the standing directive, walk carried forward). The scripted contrast audit and the keyboard-walk probe (headless Chrome driving Tab/Enter/Escape through a lesson, a review, and the learn page) become PERMANENT suite members, not one-off checks.

### Claude's Discretion
Focus-ring exact offsets/widths per register (within tokens), the tab-cycle helper implementation, live-region debouncing, the stress-fixture layout, announcement copy micro-wording (within the calm-voice law and existing praise pools), audit-script implementation details.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design + a11y authority
- `.planning/ATHAR-SYSTEM.md` — constitution (laws 3/8/9 constrain what a11y fixes may change)
- `.planning/phases/03-components-icon-kit-motion-language/03-UI-SPEC-ATHAR.md` — §2.1 the contrast table (the audit's ground truth), focus/press states
- `.planning/phases/05-learn-page-cross-page-view-transitions/05-UI-SPEC.md` — S4 popup/sheet/tab aria contracts already specified, R-5 gold tab cue
- WCAG 2.2 AA (1.4.3 text contrast, 1.4.11 non-text contrast, 2.1.1 keyboard, 2.4.7 focus visible, 4.1.3 status messages) — the standard ACC-03 names

### Carried-forward items this phase MUST land
- STATE.md Pending Todo: path-node accessible names (Phase-5 UI checker Dimension 2)
- 05-REVIEW SG-01: focus containment for sheet/popup/Festival (documented-not-applied, Phase-6-scoped)
- 04-REVIEW SG (documented): aria-live verdicts + focus management in the reward choreography

### In-repo state
- `shared/awba-engine.js` — AwbaLesson/AwbaReview runners (verdict/announce insertion points), AW.sheet, the boot-stamp block (where AW.announce/focus helpers belong), muteBtnHtml (aria precedent)
- `learn.html` — inline script (nodes, popup, chest, Festival) — page-level aria/focus fixes
- `shared/awba-engine.css` — :focus-visible precedents (grep focus-visible), @layer screens
- `scripts/tests/` — learn-dom-flows.test.js (the real-DOM harness precedent to extend for keyboard walks), render-smoke.mjs, the glyph-gate method from Phase 1 (scripts/check-glyph-coverage.py if present)
- Suite baseline: **114/114**; render-smoke 21 checks; all standing grep gates

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Festival overlay already ships role="dialog" aria-modal + Escape handling precedent (05-05); mute toggle ships the aria-pressed/label-swap pattern; accordion headers ship aria-expanded (04-03); popup triggers ship aria-expanded (05-04).
- The real-DOM test harness (learn-dom-flows.test.js) is the proven pattern for keyboard-walk probes; render-smoke for page-level assertions.
- [data-register]/register-scoped focus hook laid in Phase 1; gold focus ring on Orbit shipped in Phase 5 (.rv-shell precedent from 04-05).

### Established Patterns
- All prior hard rules stand: glob test command, exit-code-first validator, ugrep paren-wrapping, gated literals never in comments (incl. the VT property name), verbatim-content vs grep gates ('One religion, one thread'), localStorage 13/learn 0, @layer order line ×1, token-only zero-new-hex, hand-edit STATE.md, executor model routing (opus visual / sonnet mechanical), executors read ~/.claude/skills/emil-design-eng/SKILL.md directly.

### Integration Points
- Phase 7 (PWA/deploy) follows — precaches whatever this phase adds (fixture pages are dev-only, keep them out of any future precache list by location: scripts/fixtures/).
- The scripted audits become permanent suite members — Phase 7's gate re-runs them.

</code_context>

<specifics>
## Specific Ideas

- The bar: a blind or keyboard-only user can complete a full lesson, a timed review, and claim a chest — same mercy, same calm. Announcements read like the app's own voice (warm, brief), never like debug output.
- The stress test is the FND-03 promise finally proven at full scale — Phase 1 proved the subset fonts; this proves the rendered app.

</specifics>

<deferred>
## Deferred Ideas

- Full screen-reader scripting beyond aria-live basics (VoiceOver rotor optimization, custom announcements per SR quirk) — v2.
- Arrow-key spatial navigation on the path (nodes remain sequential-tab) — v2 polish.
- High-contrast/forced-colors mode support — v2.
- Owner ledger unchanged (sound cues, du'a, licensing, scholar gate, Arabic chapter-terms, Ibrahim splice, doodle pool, visual walks).
</deferred>

---

*Phase: 6-accessibility-rtl-typography-hardening*
*Context gathered: 2026-07-14*
