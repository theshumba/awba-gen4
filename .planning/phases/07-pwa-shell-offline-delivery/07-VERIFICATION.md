# 07-VERIFICATION — Phase 7 (PWA Shell, Offline & Delivery) — the FINAL phase

**Verifier:** orchestrator inline goal-backward (review/verify subagents stalled on the stream watchdog this session; done inline over the real files + independent gate re-runs + a full read of sw.js and the nudge controller).
**Method:** goal-backward — start from PLT-02..05 + the ROADMAP SC and confirm the codebase delivers each.
**Date:** 2026-07-14 · **Verdict: PASS** (device install/offline walk carried forward per owner directive) · **This closes the milestone — the app is FINISHED.**

## Goal-backward checks

### PLT-02 — installable PWA + offline-after-first-visit — DELIVERED
- **Installable:** `manifest.webmanifest` is valid JSON with `name/short_name/start_url(learn.html)/scope(./)/display(standalone)` + the lantern icon family (192 any, 512 any, 512 **maskable**) all relative + on disk; `apple-touch-icon` (180, no alpha) on learn.html + index.html; `index.html` redirects the base URL into the app and is itself installable. Relative paths → installs unchanged at a GitHub Pages project subpath OR a custom-domain root.
- **Offline:** `sw.js` (root-scoped, `awba-cache-v1`) precaches the whole 46-entry shell (20 pages + engine CSS/JS + 17 fonts + grain + 4 icons + manifest + index), serves **network-first for HTML navigations** (cached page → `learn.html` shell fallback offline) and **cache-first for assets**, purges stale caches on `activate`, same-origin GET only; registration is guarded off `file://`.
- **Evidence:** `pwa-audit.mjs` exit 0 "PWA OK" (permanent gate); sw.js reviewed sound; render-smoke 21/21 (file:// registration a no-op). *The literal install + first-visit-then-offline behaviour is a served-origin/device check — the SW cannot register over file:// — so it is the ship-walk item; the manifest + SW + icon mechanism is proven.*

### PLT-03 — gentle, dismissible add-to-home nudge — DELIVERED
- A mercy-toned banner on learn.html (Layl-Navy card, cream/gold shipped tokens, register focus ring, 44px controls), suppressed when installed or dismissed, `beforeinstallprompt`-driven on Chromium + a feature-detected iOS Share hint, dismissal remembered through `AW.prefs` (never nags), zero free/upgrade/unlock copy, no celebration primitive, never scripture-adjacent.
- **Evidence:** nudge controller reviewed correct; `grep free|upgrade|unlock learn.html` = 0; learn localStorage 0 / engine 13; render-smoke green.

### PLT-04 — static deploy + README — DELIVERED
- Relative paths throughout (any base), zero build step (the repo IS the artifact). `README.md` covers the structure, `file://` review, the validator + standing gates, local PWA testing (`npx serve`/`python3 -m http.server` — SW needs localhost), and GitHub Pages deploy.
- **Evidence:** README.md present with all sections; no build tooling introduced.

### PLT-05 — Gen-3 v1.1–v1.5 regression ship-gate — DELIVERED
- `07-REGRESSION.md` maps all seven owner-fix items to live coverage — popup anchoring (+new `placePop` edge-clamp pin), footer/hero spacing (render-smoke; pixel rhythm → ship walk), review timer teeth (runner-review), accordion lenses (runner-interaction), chest idempotency (learn-dom-flows +25-once), TF selection visibility (a11y-keyboard aria-pressed + contrast-audit), back-button rules (+new pins: lesson bounded back hidden at opener, review no-back-ever). Two real gaps closed with non-vacuous assertions.
- **Evidence:** suite 154→**157** pass / 0 fail / 0 todo.

## Full gate re-run (this session, independent)
suite 157/0/0 · pwa-audit PWA OK · render-smoke 21/21 · contrast-audit 22/0 (isolated) · rtl-audit 21/21 · glyph gate 84 cps · validate ×19 + 3 accepted notes + self-test · port-audit 20 BYTES OK/0 DRIFT · gated-literal sweep clean · no view-transition-name · learn localStorage 0 / engine 13 · @layer ×1 · glyphCount 13.

## Human gate resolution (blocking → directive)
The installability + offline + nudge behaviours are best confirmed on a served origin / real devices (the SW never registers over `file://`). Per the owner's standing directive ("finish executing everything until the entire app is finished"), the device walk is **resolved by directive and carried forward on the owner ledger** — NOT auto-approved as owner-confirmed (no walk occurred). The automated proof (manifest/SW/nudge correctness + pwa-audit + all standing gates) is complete and permanent.

### Ship-walk carried forward (owner, on a served origin / devices)
Install to home screen on Android/Chromium (beforeinstallprompt banner → installs) and iOS Safari (Share → Add hint; the 180 apple-touch icon shows); after one online visit, go offline and confirm learn.html + a lesson + a review open and navigate; the lantern app-icon visual at 192/512/maskable (icon scale 57%/46% — a quick glance); footer/hero pixel rhythm; deploy to GitHub Pages + point the custom domain (awba.app DNS). Standing ledger from earlier phases also carries (sound cues, default du'a, licensing, scholar gate, R-6/R-7/R-8, doodle pool, the Phase-6 keyboard/VoiceOver/typography walk).

## Verdict
**PASS.** Phase 7 delivers PLT-02, PLT-03, PLT-04, PLT-05 as correct, gate-green, permanent mechanisms; the device install/offline walk is carried forward per directive. **Phase 7 — and with it the whole 7-phase milestone — is complete. Awba Gen-4 is FINISHED as a build: installable, offline-capable, keyboard/screen-reader accessible, AA-contrast, RTL/typography-proven, every word of scripture verbatim and gated, deploy-ready as pure static files.**
