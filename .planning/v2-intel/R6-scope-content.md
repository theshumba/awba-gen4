# R6 — Scope + Content Intel for v2 (Onboarding / Practice / Profile / More)

Read-only recon for v2 builders. Repo: `/Users/theshumba/Documents/GitHub/awba-gen4` (no git remote here — GitHub-hosted separately, see §6).

---

## 1. Exact requirement wording that governs v2

### LRN-07 (v1, SHIPPED — the ONLY existing behaviour for these tabs today)
> **LRN-07**: Tab bar: Learn active; Practice/Returns/Profile/More give designed coming-soon feedback on tap (sheet or state — never a dead tap)

Shipped exactly as: tapping Practice/Returns/Profile/More opens the shared `AW.sheet` singleton with a scene icon + one calm line (Returns tab opens the **streak sheet**, a real surface — it is NOT coming-soon, it already shows returns count + week constellation). Practice/Profile/More currently open a generic "coming soon" sheet — **no dedicated HTML pages exist for them today**.

### V2-07 (the exact deferred item this whole v2 milestone satisfies)
> **V2-07**: Practice hub / profile / quests surfaces (currently coming-soon states)

This is the ONLY REQUIREMENTS.md line that names Practice/Profile as future real surfaces. There is no separate "onboarding" or "More/settings" requirement ID anywhere in REQUIREMENTS.md — those two are net-new scope for this v2 milestone, not a pre-existing deferred item. Treat onboarding and More/settings as genuinely new product surfaces with no prior owner-approved spec; Practice and Profile at least trace to V2-07.

### Full v2/deferred block (REQUIREMENTS.md lines 76–84) — quote verbatim, nothing else in that section touches these 4 surfaces
```
## v2 Requirements (deferred, recorded)

- [ ] V2-01: Chest opening anticipation sequence (two-beat: shake/lid → reveal with count-up + cue)
- [ ] V2-02: Companion reaction states (settled-content on correct, calm on miss, celebrate on milestone — never sad/disappointed)
- [ ] V2-03: Returns-as-heatmap presence view (longer history once awba_days accumulates)
- [ ] V2-04: Named shared-element morphs (node icon "becomes" lesson header) upgrading the v1 cross-fade
- [ ] V2-05: Tap-to-hear recitation on daily ayah (licensed audio — content-gated)
- [ ] V2-06: Legendary gold-dust shimmer completion moment
- [ ] V2-07: Practice hub / profile / quests surfaces (currently coming-soon states)
```
Note: **V2-02 (companion reaction states) is explicitly RETIRED by the Athar pivot** (D-45: "companion presence... RETIRED as mascot [aniconism]"). If v2 designs revive any companion/mascot/character for onboarding, Practice, Profile, or More, that directly violates the locked Constitution law 2 ("Aniconism, absolute. No faces, no mascots, no limbs. Ever.") — flag to owner, do not build it.

### Out of Scope (REQUIREMENTS.md lines 86–94) — the guardrails v2 must not cross
- Accounts, backend, Supabase, Stripe — **no login/accounts screen is in scope for v2 onboarding**; v1/v2 stay device-local by design (awba-app repo is the separate infra reserve).
- Leagues/leaderboards/friend streaks — out of scope + tension with mercy framing; any Profile/quests design must not add these.
- Streak freeze economy / escalating streak urgency / randomized chest odds / sad-mascot guilt — permanently banned anti-features (contradict the un-loseable premise). A Profile "streak" widget must follow the same never-a-gap/never-red grammar as the shipped week constellation.
- New religious content of any kind — nothing generated; Josh's redacted output is the only content source. This binds Practice hardest (see §4).
- Fiqh/Seerah/Qur'an courses — no content exists; any course-switcher-adjacent Practice/Profile UI must keep showing coming-soon for these.
- Device vibration as a primary feedback channel — zero iOS support; CSS press physics is the mechanism (any new Practice quiz UI must reuse this, not haptics).

---

## 2. Product summary a designer can trust

**What Awba is:** a calm, Duolingo-style Islamic micro-learning web app teaching the complete Aqeedah Level 1 course (4 units, 15 lessons, 4 "legendary" reviews, 65 verified atoms). Zero-build, static, `file://`-openable vanilla HTML/CSS/JS PWA. Live at `theshumba.github.io/awba-gen4/`.

**Mercy stance — "a companion, not a cop":** the entire mechanic set is engineered to remove guilt/punishment loops that Duolingo-style apps normally run on:
- Noor (points) is **un-loseable** — no decay, no penalty, never goes down.
- Returns (the streak) is **unbreakable** — the product's own copy states this outright: *"N returns · your streak never breaks."* There is no streak-freeze economy because there is nothing to freeze — missing a day never breaks it, never shows a gap, never shows red.
- Wrong answers are **never punitive**: "amber-never-red" (Gen-3 vocabulary) / in the shipped Athar system, wrongness renders as a grey ink-blot fade + one calm explanation line, never a flash of red, never a shake, never a buzzer (Constitution law 8: "Wrongness is a strike, never a colour").
- No hearts/lives system, no blocking gate on retries, stars are 0–3 and always replayable (never permanently locked at a bad grade).
- Locked content gives "gentle 'not yet'" feedback, not a slammed door: shipped copy is literally `"Not yet — finish what comes before."`

**The noor/returns/stars economy AS SHIPPED (exact numbers, byte-preserved from Gen-3, do not alter for v2):**
- Quiz (lesson): **+12 noor per correct answer**, **+15 noor for the reflect beat**. Combo chip appears at streak ≥2. A quiet gold-thread flourish ("PERFECT" in Gen-3 vocabulary) fires at exactly a 3-streak, once per streak.
- Stars per lesson: 0 mistakes = 3★, 1 mistake = 2★, ≥2 mistakes = 1★ — **never 0 stars**. Best-of only, stars never downgrade.
- Review (legendary): **14-second soft timer per question**, **+15 noor correct, +5 bonus if answered "swift"** (in time) — but ONLY in the main phase. Timeout auto-skips the question after 1.5s with **no penalty**, then offers an **untimed no-noor circle-back** at the end. Any single timeout permanently caps that review at **2★ max** (never higher, regardless of correctness). No back button in reviews (lessons DO allow back, reviews do not).
- Chest: **exactly +25 noor**, **idempotent** (claiming twice never grants twice — enforced by `window.__awbaClaimChest` write-once guard). Never randomized odds — contents are always implied before tap ("a sure gift").
- Storage keys (Gen-3 legacy, now migrated into one versioned `awba_state` blob): `awba_noor` (cumulative), `awba_returns`, `awba_lastDay`, `awba_days[]` (capped last 90), `awba_stars{}` (best-of, shared namespace lessons+reviews), `awba_chest_<id>` (booleans, now a `chests{}` map).

**Unlock model:** strictly sequential across the WHOLE course, flattened — a node is `available` only when EVERY prior non-chest node in the entire 4-unit course has stars (not just within its own unit). This includes the dense-lesson splits (m2/m2b, m3/m3b). A chest unlocks specifically when its unit's review has stars. `AW.deriveNodeState(nodesFlat, progress)` is the one pure function that derives this — v2 surfaces (e.g. a Profile progress summary or Practice mode picker) MUST read node state through this same function, never reimplement unlock logic.

**What Ring / Festival / chest mean (Athar system, current design authority — NOT Gen-3's visual look):**
- **The Ring** = the single macro progress map for the whole course (an SVG, seeded, deterministic — `AW.ringSVG({atomsDone, seed})`). It lives ONLY on the Orbit home screen (`learn.html`). Law 9: "The centre never animates [outside its one moment]" — the Ring is STATIC on every normal page load; it only draws its newly-earned frontier once, right after a lesson/review completes (`animateFrom` = the atom count before that session). It must never replay a past draw. There is no second "map" anywhere else in the app — a Practice or Profile page must not invent a second progress map; if progress needs summarizing there, reuse/read the Ring's data, don't compete with it visually.
- **Chest** = the "gift" node at the end of each unit, unlocked once that unit's review has stars. Re-voiced under Athar as a **Festival circuit-plate threshold**: claiming it briefly opens a Festival-register overlay (dated, private-by-default "circuit plate" stamps in with a maker's mark of date+seed), grants +25 noor exactly once, then returns to Orbit. Gen-3's literal treasure-chest/box art is retired — no chest iconography in new v2 art.
- **Festival register** = the "joy is rationed" register: it opens at only ~9 points in the whole journey (4 unit chests + course-completion poster + the 2 Eids + user-chosen share/export). It must NEVER appear as daily UI chrome. If v2 Profile/Practice/onboarding wants a celebratory moment, it must justify itself as one of these rationed threshold moments, not invent a new one casually — default to the quieter Orbit/Page/Circle registers instead.

**Pending-review honesty posture:** every citation (Quran verse or hadith) shown anywhere in the app carries an `unverified · pending review` pill, unconditionally — because "every atom is `draft — none approved`" by scholars (owner-level fact, not resolved by any phase). This pill is global/blanket, not per-citation-verified (a finer-grained "verified" state was explicitly deferred, "belongs with the scholar-gate workflow discussion"). Any new v2 surface that shows or references scripture/hadith (e.g. a Practice review-mode summary, a Profile "verses learned" widget) MUST carry this same pill — never imply scripture has been cleared.

**Aniconism + scripture constraints in product terms:**
- No faces, mascots, or limbs anywhere, ever (Constitution law 2) — this retired Gen-3's lantern companion character entirely; the lantern survives ONLY as an inert scene icon/glyph (e.g. the app icon), never as a character with reactions/expressions. Any v2 "companion" idea (onboarding guide character, Profile avatar, encouragement mascot) is a hard no under current law — flag to owner if desired, do not build.
- Scripture (ayat/du'as) renders in Amiri only, ≥1.35–1.5× the size of adjacent Latin text, line-height 1.9, full tashkeel (diacritics), `﴾…﴿`-style Quranic brackets, and is always the strongest ink on the page (never over pattern/texture/photo) — it also carries the ONLY glow effect permitted anywhere in the app. Nothing celebratory (confetti-equivalent, PERFECT-equivalent) may render on or adjacent to a scripture screen — this is grep-gated in the existing test suite and must be respected by any new v2 screen that touches scripture.
- Transliteration + translation must accompany every display-Arabic moment, no exceptions.

---

## 3. Binding D-NN / R-NN decisions constraining NEW surfaces (not lesson internals)

These are the decisions a v2 onboarding/Practice/Profile/More build must design AROUND. (Full ledger: 75 D-NN decisions across 7 phases; below is every one that constrains chrome/shell/navigation/state/motion/a11y a new surface would touch — lesson-beat-internal decisions like exact beat-type rendering are omitted as out of scope for new surfaces.)

| ID | One-line meaning |
|---|---|
| D-04 | ONE stylesheet `shared/awba-engine.css` with `@layer tokens, base, components, screens, motion` — v2 pages add ONLY new `@layer screens` content blocks, never touch the `@layer` order line, never add a 2nd stylesheet. |
| D-05/D-06 | Tokens are semantic (`--accent`, never raw hex); per-unit theming lives in `data-unit` scales — a v2 surface never invents a literal colour, never reintroduces "unit colour" chrome (Athar retired unit colour-coding entirely, see D-53). |
| D-07 | JS reads colours FROM CSS custom properties via `getComputedStyle` — CSS is the single colour source of truth. |
| D-13/14/15/16/17 | ONE versioned blob `localStorage['awba_state']`; only `AW.S.get/set` may touch it; migrations are non-destructive; local-date `"YYYY-MM-DD"` day boundaries (never `toISOString`/UTC). A new Profile/Practice page must read progress ONLY via `AW.S`/`AW.state()`, never touch `localStorage` directly (grep-gated: `localStorage` may only appear inside the STATE section of `awba-engine.js`; every other file's count must stay 0). |
| D-18/19 | `AW.deriveNodeState`, `AW.touchDay()`, `AW.greetMode()`, `AW.weekCal()` are the canonical pure-function seams — reuse, never reimplement, for any new progress/streak UI. |
| D-20/21 | Separate `localStorage['awba_prefs']` blob (`soundMuted`, `motion`) behind `AW.prefs.get/set` — a "More/settings" page's mute/reduced-motion controls MUST read/write through `AW.prefs`, never invent a parallel prefs store. |
| D-22/23/24 | Classic scripts only, ONE engine JS file (`shared/awba-engine.js`), `window.AW` defined synchronously at parse time (no `defer`/modules) — any net-new v2 JS should follow the Phase-5 precedent: a SEPARATE page-level script file is allowed only the way `awba-learn.js` was split out; do not split the shared engine itself. `AW.S`/`AW.prefs` remain the ONLY localStorage readers/writers codebase-wide. |
| D-31–34 | `AW.KIT` is the ONE icon registry (20 canonical SVGs + glyphs sub-map), accessed via `AW.icon(name, {size?, label?})` — no new per-page icon constants for onboarding/Practice/Profile/More; if new icons are needed they join `AW.KIT`, never a local duplicate. |
| D-35/36/37 | `AW.sheet(contentHtml)` is the ONE bottom-sheet primitive (singleton, outside-tap closes) — any v2 sheet (Practice mode picker, Profile detail, More settings row detail) MUST reuse this, never build bespoke sheet DOM. |
| D-39/40/41/42 | ONE motion vocabulary (token `linear()` easings) + gummy press physics applied via shared classes (`.btn/.opt/.tf/.tile/.tab/...`) to the FULL tappable inventory — any new tappable element in v2 joins this same class-based system. Reduced-motion respected via `prefers-reduced-motion` OR `[data-motion="reduce"]` — both must be honoured on any new animated element. |
| D-45 | THE Gen-3→Athar translation table — binding reading of retired vocabulary. Confetti/PERFECT-overlay/companion-mascot/amber/unit-colours are ALL RETIRED; do not reintroduce any of them in v2 surfaces even though REQUIREMENTS.md text still uses that vocabulary. |
| D-53 | Learn page = ONE register (Orbit) per screen (law 1) — any new v2 page must likewise commit to exactly one register/ground; other registers appear only as small tokens, never a second full ground. |
| D-58 | `@view-transition { navigation: auto; }` is already wired app-wide via the shared stylesheet — new v2 pages inherit it automatically by using the shared engine files; scripture elements must NEVER carry a `view-transition-name`. |
| D-60 | HUD/sheets/tabs pattern: transparent marginalia HUD, ONE shared sheet implementation for streak/noor/course-switcher/tab-coming-soons — a v2 Practice/Profile/More page replaces the current "coming-soon sheet" behaviour for its own tab but must still reuse `AW.sheet`. |
| D-62–68 (Phase 6, a11y) | Native `button`/`a` only (no div-with-handler), one `:focus-visible` grammar register-aware (gold ring on dark/Orbit grounds, crimson-on-cream on Page), Escape closes overlays, one shared modal-focus-trap helper for ALL sheet/popup/overlay families, one polite `role="status"` live region via `AW.announce(text)`, WCAG AA contrast (4.5:1 text / 3:1 UI shapes) — every new v2 interactive surface must meet ALL of these from day one, not retrofit later. |
| D-69–75 (Phase 7, PWA) | `index.html` redirects to `learn.html` (do not rename `learn.html`); manifest `scope`/`start_url` are RELATIVE (no leading slash) so the app works at any base path; `sw.js` precache list is fixed (20 app pages + engine CSS/JS + fonts + icons) — any new v2 HTML page must be ADDED to this precache list or it will 404 offline; add-to-home nudge logic lives via `AW.prefs`, never a separate localStorage key. |
| Constitution laws 1–10 (ATHAR-SYSTEM.md) | Full list: (1) one register/ground per screen, (2) aniconism absolute, (3) scripture law, (4) Readex Pro is the one workhorse UI font everywhere, (5) display faces rationed (Marcellus/Aref Ruqaa/Rakkas/Courier Prime — Aref Ruqaa is ONLY the 15 chapter terms; Rakkas is Festival-only; never share a screen), (6) one grain texture everywhere, (7) ≤10% expressive colour on any working screen, (8) wrongness = strike not colour, (9) macro progress (the Ring) never animates outside its one moment, (10) artefacts private-by-default with a maker's mark. |

### Owner-ledger items v2 must NOT resolve itself (build AROUND these, never fabricate)
- **Scholar sign-off** — every atom is "draft — none approved"; no v2 surface may imply scripture/hadith has been cleared.
- **Clear Quran licensing** — commercial-launch text source (`quranapi.pages.dev`) likely needs a publisher licence; logged for Josh/Melusi, not a build blocker but never silently resolved.
- **Default du'a (`cfg.dua`)** — no default du'a content has been decided; don't invent one for a new "onboarding closing du'a" screen.
- **R-7 / Ibrahim splice** — the Ibrahim 14:24 epigraph on the Learn page is a Courier fallback line because the actual verse text is "absent from corpus" — v2 must not generate/paraphrase the missing verse.
- **R-6 / Arabic chapter-terms** — the 4 unit "chapter-term" labels (Aref Ruqaa squares) currently render an English-fallback pending owner-supplied Arabic terms; don't invent Arabic terms yourself.
- **D-52 / sound assets** — `AW.sound(cue)` plumbing exists (correct/incorrect/complete/streak slots + mute toggle wired to `awba_prefs.soundMuted`) but ships with SILENT placeholder files; actual sound-effect sourcing (owner preference: sound EFFECTS not music, calm/dignified) is an owner decision, not a v2 build task — if v2 adds new interactions needing cues, wire them into the existing `AW.sound(cue)` slots, don't source new audio yourself.
- **R-8 / visible timer readout** — an owner-ledger item about the review timer's visible-time display; don't redesign review timer UI as part of v2 without checking this first.
- **D-55 / doodle pool** — only ~15–20 of a possible plant-doodle set shipped (fast-follow logged); a "Practice" or "Profile" progress visualization must not invent a full 65-plant map (explicitly banned: "NEVER a 65-plant map" — the Ring is the only macro map).

---

## 4. Content law for Practice specifically

- **The 19 content files are byte-immutable.** All 15 lesson files (`lessons/*.html`) + 4 review files (`reviews/*.html`) were ported byte-verbatim from Josh's Gen-3 `_MVP-BUILD/` folder and are SHA-gated by `scripts/port-audit.mjs` (byte-fidelity check) and structurally gated by `scripts/validate-content.js` (schema/contract validator, runs via `node scripts/validate-content.js lessons/*.html reviews/*.html`). Any v2 Practice feature must treat these files as read-only source data — never edit them, never regenerate them, never "fix" or paraphrase their content, even if a bug or omission is found (the omissions ARE deliberate sensitive-content holds: U4-03 absent entirely, U3-13 not surfaced, U3-16 principle-only, group-namings held for scholar review — "fixing" these would violate the content-integrity law).
- **Quiz item REUSE verbatim is the only lawful Practice content.** A Practice mode may re-present existing `mc`/`tf` beats (and their `refs`/`terms` dictionaries) already embedded in the 19 files, e.g. as a "practice past questions" or "review weak areas" feature — but it must reuse the EXACT question/answer/explanation text (`o[]`, `c`, `t` fields) already shipped, never generate new questions, never paraphrase, never write new distractors.
- **NO new religious content of any kind** — no new questions, no new scripture citations, no new hadith, no new explanatory copy that touches doctrine. This is a hard project-wide law (REQUIREMENTS.md Out of Scope), not a Practice-specific invention.
- **Where quiz items live:** inline `AwbaLesson({...})`/`AwbaReview({...})` config-object literals embedded directly in each HTML file's own `<script>` tag (classic script, not JSON, not a separate data file) — e.g. `lessons/u1-m1.html` has a beats array with `{type:'mc', q:'...', o:[...], c:0, t:'...'}`-shaped objects inline. There is no separate machine-readable question bank anywhere in the repo today.
- **`file://` forbids runtime fetch of local files** — a v2 Practice feature CANNOT `fetch()` the 19 HTML files at runtime to harvest their quiz items live in the browser (fails over `file://`, and even over http(s) it's fragile/wasteful). The sanctioned pattern is a **dev-time extraction script** (Node, run once by a developer, output committed as a static asset) — exactly like the existing precedent: `scripts/check-glyph-coverage.py` extracts glyph data once; the CLAUDE.md STACK section calls font-subsetting "data preparation, not a build pipeline step... matches 'Josh opens files directly' since the output is a static asset." A Practice question-bank extractor should follow the identical shape: write a one-off `node scripts/extract-practice-bank.js` (or similar) that parses the 19 files' inline cfg objects (reusing the `node:vm`-sandbox technique already proven in `scripts/validate-content.js`'s D-26 pattern) and writes a static JSON/JS file committed to the repo — NOT a build step, NOT run at page-load time, NOT wired into any pipeline.
- **`scripts/validate-content.js` is the reusable extraction precedent** — it already ingests each file's inline `AwbaLesson`/`AwbaReview` call via a `node:vm` sandbox with stubbed globals (`AwbaLesson`/`AwbaReview` capture the cfg object; `AW.cite(id,label)` returns real markup so citation IDs stay resolvable) rather than regex-parsing the object literal. Any Practice-bank extractor should reuse this exact ingestion technique rather than re-inventing a parser.

---

## 5. Standing label-collision gotcha

The U3-m3 lesson node label is the byte-verbatim Gen-3 string **`"One religion, one thread"`** (`lessons/u3-m3.html`'s corresponding node in `learn.html`'s `UNITS` array). This trips ANY naive `grep -qE '(dab|thread|plate|rosette)'`-style "no celebration primitive" gate, because it's a true substring match on "thread" inside ordinary content, not the `.thread`/`.dab`/`.plate`/`.rosette` CSS classes the gate is actually trying to catch.

**Rule for v2 builders:** NEVER edit this label to dodge a grep (content-integrity law forbids touching ported content for tooling convenience). Any new grep/gate a v2 build adds that checks for "no gold-thread/celebration primitive leaking onto page X" must be **scoped to class/attribute context** (e.g. `grep -nE 'class="[^"]*\b(dab|thread|plate|rosette)\b'` or check for the literal CSS class token, not a bare substring across all page text) — this exact false-positive already bit Phase 5 twice (05-02, logged in STATE.md and 06-RESEARCH.md) and the fix each time was "scope the check, never touch the label."

---

## 6. Deploy truth

- Public repo: `github.com/theshumba/awba-gen4`.
- `main` branch auto-deploys to **GitHub Pages** at `https://theshumba.github.io/awba-gen4/` — no CI, no build step, a push IS the deploy.
- **Relative-path law**: every asset reference is relative (`shared/...`, never a leading `/`) so the exact same commit works at a GitHub Pages project subpath (`/awba-gen4/`) OR at a custom-domain root with zero code change. Manifest `start_url = learn.html`, `scope = ./` — both relative. v2 pages must follow this exactly (no leading-slash asset URLs, ever).
- `awba.app` custom-domain DNS is **pending, owner action** — do NOT add a `CNAME` file or otherwise wire the custom domain before DNS is actually configured; this is explicitly logged as an owner-gated step across multiple phases (Phase 5 CONTEXT, Phase 7 D-75).
- Service worker (`sw.js`, <50 lines, hand-written) never registers over `file://` (guarded by `location.protocol !== 'file:'`) — Josh's file:// double-click review workflow is unaffected by any v2 PWA change. Any new v2 HTML page must be added to `sw.js`'s precache list or it 404s offline after install.
- `README.md` (repo root) is the canonical onboarding doc for how to review/run/deploy — read it before making any v2 process assumptions; it documents the validator + all standing gates (`render-smoke.mjs`, `port-audit.mjs`, `contrast-audit.mjs`, `rtl-audit.mjs`, `check-glyph-coverage.py`, `pwa-audit.mjs`, `node --test scripts/tests/*.test.js`).

---

## 7. Voice / copy corpus — 10–15 verbatim shipped strings for new-surface copywriting

Use these as the calibration set for tone (warm, brief, mercy-toned, never alarmed, never "free"/"upgrade"/"unlock" marketing language):

1. `"Not yet — finish what comes before."` — locked-node microcopy (gentle, no CTA, never a buzzer)
2. `"N returns · your streak never breaks"` — streak-band line (the exact "un-loseable" promise stated in-product)
3. `"Continue the path"` — primary CTA button label on the home continue-card
4. `"Alhamdulillah — continue."` — the lesson-close line, always renders regardless of performance
5. `"Begin, gently"` — the lesson-start CTA (note: "gently," not "Start!")
6. `"A gift"` / `"A gift of light"` — chest/plate node label and popup heading
7. `"Keep Awba a tap away"` — add-to-home-screen nudge title
8. `"Add it to your home screen, and your path is always here."` — nudge body copy (non-iOS)
9. `"Keep Awba a tap away — add it to your home screen."` — the same nudge, screen-reader announced version
10. `"Keep Awba on your home screen"` — nudge's accessible aria-label
11. `"unverified · pending review"` — the mandatory pill on every citation, everywhere
12. `"COMING SOON"` — course-switcher pill copy for Fiqh/Seerah/Qur'an rows (calm neutral pill, never disabled-grey)
13. `"Circuit N · <chapter-term>"` — the continue-card's progress-framing copy pattern (e.g. `"Circuit 1 · The Foundation"`)
14. `"Time — it will wait at the end."` — review timeout announcement (calm, non-punitive framing of a miss)
15. `"+12 noor — total N"` / `"+25 noor — a sure gift"` — the aria-live announcement pattern for noor gains (always states the gift/amount plainly, never gamified exclamation)

Never use in new copy: "Free", "Upgrade", "Unlock now", any streak-loss/urgency language, any exclamation-heavy "gamer" tone, any reference to competing with other users.
