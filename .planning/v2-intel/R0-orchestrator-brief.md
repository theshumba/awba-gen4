# R0 — Orchestrator Brief: Awba Gen-4 v2 ("Complete the Shell")

**Date:** 2026-07-15 · **Author:** Fable (orchestrator) · **Authority:** owner directive — "build out everything: onboarding, practice, profiles and more — literally everything else." Standing directive: work fully autonomously; owner-gated religious/legal items are NEVER resolved by us.

## What v2 is

v1.5 shipped the complete course app: the path (learn.html), 15 lessons, 4 reviews, PWA/offline, live at https://theshumba.github.io/awba-gen4/. The tab bar and course switcher show designed coming-soon sheets for everything else. v2 replaces those stubs with four REAL surfaces:

1. **Onboarding** — a first-run welcome experience. Explains what Awba is (a companion, not a cop), what noor and returns are, and eases a new person onto the path before their first lesson. Skippable, replayable (from More). First-run detection via `AW.prefs` (a prefs key, NOT progress state). No login, no signup — the app stays passwordless and on-device.
2. **Practice** — a real practice experience: re-strengthen what you've already learned. Item pool = quiz items (mc/tf/tile) REUSED VERBATIM from lessons the learner has completed. Empty state (nothing completed yet) is a designed, gentle nudge to the path — never a dead end.
3. **Profile** — who you are on the path, entirely from local state: noor, returns (streak), stars, atoms done + the Ring, week constellation, per-unit progress. Optional local display name (on-device only). A plain-language "all your data lives on this device" privacy note.
4. **More** — settings & about: sound mute toggle, motion (reduce-motion) toggle, replay onboarding, how-Awba-works, scripture-sourcing honesty note (the pending-review posture), install-to-home-screen help, version/credits. A tucked-away "start over" (clear local progress) is allowed ONLY behind a calm double-confirm; mercy voice, no drama.

## What v2 is NOT

- **No new religious content, ever.** No new questions, no paraphrased scripture, no generated du'a, no Arabic chapter-terms. Practice reuses Josh's existing quiz items byte-verbatim. The 19 content files stay SHA-immutable.
- **Fiqh / Seerah / Qur'an courses stay coming-soon** (course switcher unchanged in meaning) — they need scholar-approved content that does not exist.
- **No login/accounts/cloud.** localStorage-only, passwordless, zero backend.
- **Owner-gated items stay gated:** scholar sign-off, Clear Quran licensing, default du'a (cfg.dua), R-7 Ibrahim splice, R-6 Arabic terms, sound assets (D-52 — sound stays silent plumbing; onboarding must not invent sounds).

## Architecture decisions (binding unless recon contradicts)

- **Four new root pages:** `onboarding.html`, `practice.html`, `profile.html`, `more.html` — cloned from learn.html's head template, classic scripts, relative paths, file://-openable. Each carries its own page-authored `@layer screens` `<style>` block (learn.html precedent). Engine files are touched ONLY in the shared-seams wave.
- **Tab bar goes real:** Learn / Practice / Profile / More become real page links with correct active states on every page that has the bar. Returns tab → still the streak sheet. No dead taps anywhere.
- **Onboarding flow:** learn.html boot checks an `AW.prefs` onboarded flag → first visit redirects to onboarding.html (guarded so it can never loop); "Begin" sets the flag and lands on learn.html. Direct links to lessons never trap anyone.
- **Practice pool = dev-time extraction, not runtime fetch.** file:// forbids fetching local files, and the cfgs live inline in lesson HTML. So: a node script (`scripts/build-practice-pool.js`, run by a developer like the font-subsetting step — "data preparation, not build pipeline") extracts quiz items VERBATIM into a classic-script data file (e.g. `shared/practice-pool.js`), with provenance. A NEW port-audit-style gate must prove every pool item byte-matches its source cfg item, so the pool can never drift from Josh's content. validate-content.js's vm-stub ingest is the extraction precedent.
- **Practice session mechanics:** reuse the shipped quiz mechanics/components — do not fork feel. Session = modest fixed length (designer decides, ~8 items) sampled from completed lessons only. Noor in practice: designer decides between "no noor — practice is for you" and a modest deterministic award (≤ +5/correct); must not distort the shipped economy; decision recorded as owner-reviewable.
- **Profile/More read state ONLY through AW.S/AW.prefs** — direct storage-API references on pages stay at 0; the engine's count stays exactly 13. If a seam is genuinely missing, it's added to the engine in the shared-seams wave (count law re-proven), not worked around on-page.
- **Service worker:** all four pages + any new assets join the precache; cache version bumps (v1 → v2) so existing installs update. pwa-audit must stay green.
- **Gates updated honestly:** render-smoke/contrast/rtl/glyph sweeps must COVER the new pages (auto-discovery or explicit list per recon findings); expected counts change to the new true totals — never pinned-around.

## Hard laws carried from v1.5 (violations = build failure)

- Test command: `node --test scripts/tests/*.test.js` (glob form only). Suite + Chrome-based gates NEVER run concurrently (contrast-audit flakes under Chrome contention; run isolated).
- Invariants: engine storage-word count == 13 (unless a seam wave deliberately changes it — then the new count is proven and pinned in tests), learn.html == 0 (new pages == 0 too), `@layer tokens, base, components, screens, motion;` order line appears exactly once repo-wide, glyphCount == 13 (decorative art = inline aria-hidden SVG per the D-55 doodle precedent, never new AW.GLYPHS entries), ZERO new hex (token-only `var(--…)`), relative asset paths (no leading slash).
- Gated literals never appear even in comments/strings: the retired font name, confetti, amber, lantern-gold, PERFECT, gold-bg, the Google-Fonts host, `--accent`, `rgba(37,54,`, the view-transition property name (write "the shared morph property"), and the label "One religion, one thread" is byte-immutable content — scoped checks only.
- ugrep: `--`-separate or paren-wrap any pattern starting with `-`. `grep -c` exits 1 on zero → `! grep -q` in && chains.
- Design authority: THE ATHAR SYSTEM. Aniconism. Scripture law. Never-red mercy (grey-ink + Rose Ember). Law 9: the Ring is the one macro map; no replay. One register per screen. Copy voice: mercy language, no "free" language, no guilt.
- Reviews/verification run INLINE by the orchestrator where subagents stall; every claim needs command evidence.
- Deploy: local commits on main; ONE push at the end after all gates are green (push = live).

## Build waves (planned)

- **Wave A (shared seams, one agent on main):** engine collector hook for AwbaLesson/AwbaReview (practice extraction + any practice-mode seam), practice-pool build script + pool file + pool fidelity gate, any genuinely-shared CSS additions, tests. Smallest possible engine diff.
- **Wave B (4 parallel agents, isolated worktrees):** one page each — onboarding / practice / profile / more — self-contained new files only; no engine, sw.js, learn.html, or gate edits; static self-checks only (no Chrome, no full suite).
- **Wave C (integration, one agent on main):** merge review done by orchestrator first; then learn.html tab re-wiring + first-run redirect, sw.js precache + version bump, gate coverage extension + honest count updates, new tests, README.
- **Review + gates:** multi-lens adversarial review workflow, fixes, then the orchestrator runs the FULL gate board inline, isolated, before the single deploy push.
