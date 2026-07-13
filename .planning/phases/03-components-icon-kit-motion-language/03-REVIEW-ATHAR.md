---
phase: 3
slug: components-icon-kit-motion-language
doc: REVIEW-ATHAR
reviewed: 2026-07-13T00:17:59Z
depth: deep
scope: "wave commits 2cf8ecd..eb8e17d (Athar re-cut of Phase 3): shared/awba-engine.css, shared/awba-engine.js, preview.html, scripts/tests/ring.test.js, scripts/tests/sky.test.js, scripts/tests/components.test.js (adjusted)"
files_reviewed:
  - shared/awba-engine.css
  - shared/awba-engine.js
  - preview.html
  - scripts/tests/ring.test.js
  - scripts/tests/sky.test.js
  - scripts/tests/components.test.js
findings:
  critical: 0
  warning: 9
  suggestion: 7
  total: 16
status: issues_found
---

# Phase 3 (Athar re-cut) — Code Review Report

**Reviewed:** 2026-07-13
**Depth:** deep (cross-file, reproduced against a live `node --test` engine load, not just read-through)
**Files reviewed:** shared/awba-engine.css, shared/awba-engine.js, preview.html, scripts/tests/ring.test.js, scripts/tests/sky.test.js, scripts/tests/components.test.js
**Status:** issues found — 0 Critical, 9 Warning, 7 Suggestion

## Summary

Verified first, before reviewing: `node --test scripts/tests/*.test.js` → **53/53 green**. All twelve §12 grep gates (no indigo shadow, no `[data-unit="uN"]`, no `--accent`, no Poppins, `'Inter'` count = 2, no `AW.confetti`, no `lantern-gold`, no runtime `.replace(/#`, no leading-slash `url()`, no CDN in `preview.html`, single `@layer` declaration) pass. CSS brace balance and JS parseability check out. No leftover Gen-3 blue hex literals in `AW.KIT`/`AW.GLYPHS` — every icon is `currentColor`/`var(--icon-accent)`/`var(--gold)`/`var(--ember)` per the deterministic re-inking map. This is a clean, disciplined pass at the letter-of-the-law contract checks the plan asked for.

The defects below are all things the grep gates and the 53 passing tests do **not** catch: an architecture gap in the Ring generator's "never re-draws" law (reproduced), a public API (`AW.ringSVG`) that silently emits broken/`NaN` accessible output on a plausible malformed input (reproduced), a computed WCAG contrast failure in the exact token the design doc chose specifically *to fix* an earlier contrast failure (computed), a second computed contrast failure in `preview.html`'s own captions, two exposed pure functions (`AW.skyDawn`, and `AW.ringSVG`'s numeric edge cases) with zero test coverage despite being exactly what this review was asked to check, and a "living reference" whose own demo copy doesn't match the real engine's own boundary logic. Nothing here breaks a currently-wired user flow (Ring/Sky aren't consumed by any real screen yet — RUNNERS is still a Phase-4 placeholder), which is why nothing below is classified Critical — but several of these will surface as real, user-visible bugs the moment Phase 4/5 wires the Ring and thermal states into an actual lesson/path screen, and two are concrete accessibility regressions today, in the artifact that just passed the §9 human gate.

## Critical Issues

None found. See Warnings for the closest candidates (WR-01, WR-09) and why they were not classified Critical.

## Warnings

### WR-01: `AW.ringSVG` replays the ink-draw animation on every regeneration at unchanged progress — violates §6.4 "the existing Ring never re-draws"

**File:** `shared/awba-engine.js:1205-1224` (colour/animate assignment), `1216` (`animate = !reduce`)

**Issue:** The generator decides which dabs get `animate:true` purely from the dab's *current colour bucket* (`!inked` / `sealed` / `lessonDone` / else-ember-and-animate), not from any delta against a previously-rendered state. There is no "since last render" or "newly completed" parameter anywhere in `AW.ringSVG`'s contract. Every dab belonging to the *currently in-progress* lesson (ember-coloured, not yet lesson-complete, not yet sealed) gets `animate:true` on **every single call**, regardless of whether that dab was already drawn in a prior render.

**Reproduced:**
```
$ node -e "... AW.ringSVG({seed:5,atomsDone:30,circuitsDone:1}) called twice ..."
call A ink-draw occurrences: 5
call B ink-draw occurrences (same progress, simulating reload): 5
identical output: true
```
Two consecutive calls with **identical** `atomsDone`/`circuitsDone` (simulating a learner reloading the app having made no new progress since the last visit) both emit 5 `ink-draw` animation attachments on the exact same dabs. `ringSVG` is pure/deterministic (correct, and tested — §6.2), but "deterministic" here means "deterministically re-plays the draw animation," which directly contradicts the spec's own words: *"The draw animation... plays only on the newly inked dab(s)... The existing Ring never re-draws"* (§6.4), and the CSS's own comment at `shared/awba-engine.css:971-973` ("the established ring never re-draws"). `preview.html`'s only workaround (`ringStatic()` at `preview.html:559-567`) is to force `AW.reducedMotion()` to `true` at generation time — conflating "already seen, don't replay" with "user prefers reduced motion," two different concepts that happen to share one boolean gate today.

**Failure scenario:** Once Phase 4/5 wires a real home screen to call `AW.ringSVG(AW.state()...)` on every page load (the natural integration — there is no other trigger point given today's contract), a learner who is mid-lesson (say, 2 of 5 atoms done in the active lesson) will see that lesson's dabs "ink themselves in" from scratch on **every visit**, not just the visit where they completed something. That's a visibly broken "the centre never animates" promise (law 9) and a real regression against the acceptance criteria this exact generator claims to satisfy.

**Fix:** Give the generator (or its caller) an explicit way to distinguish "just completed" from "already seen, still in-progress": e.g. accept an optional `sincedAtomsDone` (or `newAtomIds`) param and only set `animate:true` for dabs whose `atomIdx >= sincedAtomsDone`; when omitted, default to the current (animate-everything-in-progress) behavior so existing tests keep passing, but document the omission as unsafe for repeat-render callers. Alternatively push this explicitly onto the Phase-4/5 caller contract with a `static:true` cfg flag independent of `AW.reducedMotion()`, and update the doc comment/tests to make the "caller must diff, not the generator" contract explicit rather than implied.

---

### WR-02: `AW.ringSVG`'s head-dot renders gold even at `atomsDone: 0` — contradicts its own §6.6 acceptance criterion #3

**File:** `shared/awba-engine.js:1237-1239`

**Issue:** `var head = frontier || dabs[0];` — when `atomsDone` is `0`, `frontier` is never set (the `if (atomIdx < atomsDone) frontier = dab;` guard never fires when `atomsDone` is `0`), so `head` falls back to `dabs[0]`, and a full-opacity `--gold` (`#D9A441`) filled circle is drawn regardless.

**Reproduced:**
```
$ node -e "... AW.ringSVG({seed:1, atomsDone:0}) ..."
head circle: <circle class="ring-head" cx="275.44" cy="159.17" r="3.9" fill="#D9A441"/>
```
Spec §6.6 item 3 states explicitly: *"atomsDone 0 → all-faint ring."* A solid gold dot is not faint. `ring.test.js:67-69` explicitly locks in the current behavior ("the head-dot exists even at zero progress") rather than the literal acceptance-criterion wording — this may be a deliberate, considered interpretation (the head-dot as "where the journey begins" rather than "progress achieved"), but as written it's an unreconciled contradiction between the acceptance-criteria prose and the shipped+tested behavior.

**Fix:** Either (a) confirm with design authority that a static gold "start" dot at zero progress is intentional and update §6.6's wording to say so explicitly, or (b) gate the head-dot on `atomsDone > 0` (or `frontier !== null`) so a fresh learner's ring is genuinely all-faint per the written criterion.

---

### WR-03: `AW.ringSVG` silently emits broken/`NaN`-laced, accessibility-hostile output when `cfg.structure` is a partial object

**File:** `shared/awba-engine.js:1130-1131` (`var struct = cfg.structure || {...}`)

**Issue:** `cfg.structure` is used wholesale via a truthy `||` fallback rather than being merged field-by-field with the default `{circuits:4, lessons:15, atoms:65}`. Only a totally-absent/falsy `structure` gets the default; any non-empty object — even one missing required fields — is used as-is.

**Reproduced:**
```
$ node -e "... AW.ringSVG({ seed: 1, atomsDone: 5, structure: { circuits: 4 } }) ..."
<svg ... role="img" aria-label="Tawaf ring — NaN of undefined inked" data-seed="1"
     data-atoms="NaN" data-circuits="0"><g class="ring-dabs"></g></svg>
```
No exception is thrown, but the output is a visually empty ring (`<g class="ring-dabs">` has zero children, since `LESSONS` is `undefined` and `for (i=0; i<LESSONS; i++)` never executes) carrying `aria-label="Tawaf ring — NaN of undefined inked"` and `data-atoms="NaN"` — a screen-reader user would hear a nonsensical label, and a sighted user would see a blank Orbit panel with no explanation.

**Failure scenario:** No current call site in this codebase passes a partial `structure` (all real calls omit it or pass nothing), so today's risk is latent, not active. But `AW.ringSVG` is a public, documented API surface (`AW.ringSVG(cfg)`) that Phase 4/5 will call from real UI code — a future caller constructing `structure` from a partially-loaded course-config object (a very plausible real-world shape) will trip this silently.

**Fix:** Merge `cfg.structure` field-by-field against the default (`Object.assign({circuits:4,lessons:15,atoms:65}, cfg.structure || {})`), or validate/coerce each of `circuits`/`lessons`/`atoms` to a positive integer with a fallback per-field. Add a regression test pinning this (see WR-07).

---

### WR-04: `--ink-40` as the "not-yet" hollow-ring border on cream computes to 2.56:1 — fails WCAG 1.4.11's 3:1 non-text/UI-component threshold

**File:** `shared/awba-engine.css:119` (token def), `858-861` (`[data-state="not-yet"] { border: 2px solid var(--ink-40); background: transparent; }`)

**Issue:** Computed (WCAG relative-luminance formula, `rgba(19,16,19,.40)` composited over `#F3EDE2`): **2.56:1**. This is the exact border that carries the *primary, shape-first* signal for the "not-yet" thermal state on Page/Festival grounds (per D-A8: "shape is the primary channel... colour is secondary"). A UI-component boundary that IS the meaning (not decoration) needs ≥3:1 under WCAG 1.4.11 Non-text Contrast. `--ink-40` was specifically chosen in D-A8 to replace Powder, which the spec's own table shows fails at 1.58:1 on cream — but the replacement itself still falls short of the threshold it was chosen to satisfy. The spec's §2.1 AA-verification table never actually checks any of the `--ink-*`/`--paper-*` opacity-ramp tokens (it only verifies the named hue tokens), so this gap was never caught by the design doc's own audit.

**Fix:** Either bump the not-yet cream border to a token that clears 3:1 — computed: `rgba(19,16,19,.46)` ≈ 3.04:1 is the minimum crossing point; `--ink-62` (already defined, 5.02:1) is a safe, existing token to reuse — or thicken/darken the stroke and re-verify. Recommend adding the ink-ramp tokens to the spec's own AA table so this class of gap doesn't repeat for future tokens.

---

### WR-05: `--paper-45` used for caption text in `preview.html` computes to 4.05:1 on Kiswah black — fails the 4.5:1 AA threshold for text under 18px

**File:** `shared/awba-engine.css:124` (token def); usages at `preview.html:61` (`.pv-hero-mark`) and `preview.html:488` (inline `style="color:var(--paper-45)"` on `.pv-ring-cap`)

**Issue:** Computed: `rgba(243,237,226,.45)` over `#131013` = **4.05:1**. Both usages set this on `--font-marg` (Courier Prime) at `--fs-marg` (12px) — well under the 18.66px-bold/24px-regular "large text" threshold that would permit the lower 3:1 bar, so normal-text AA (4.5:1) applies and this fails it. `--paper-45` is a real engine token (`shared/awba-engine.css:124`), not a preview-only invention, and the spec's AA table (like WR-04) never verifies it.

**Fix:** Use `--paper-62` (6.69:1, already defined and used elsewhere for the same "quiet marginalia" role) instead of `--paper-45` anywhere the text is legible copy rather than a purely decorative wash. Reserve `--paper-45` for non-text decoration only (borders, icon washes), matching how `--ink-40` should also be scoped (see WR-04).

---

### WR-06: `AW.skyDawn` has zero test coverage anywhere in the suite

**File:** `shared/awba-engine.js:1302-1309` (function), exposed publicly at `1312` (`AW.skyDawn = skyDawn;`)

**Issue:** `AW.skyDawn` implements the `--dawn` degree's entire contract — the 0.6 cap that spec §7.3/§7.5 acceptance item 6 explicitly requires ("`--dawn` warmth is perceptibly ambient and never mistaken for the progress metric... cap the max so it never competes with the real prayer-clock tint or the scripture/Ring"). Nothing in `sky.test.js`, `ring.test.js`, or anywhere else calls `AW.skyDawn` or asserts on `--dawn`. `grep -rn "skyDawn" scripts/tests/` returns zero matches.

**Failure scenario:** A future edit that removes or raises the `SKY_DAWN_CAP` (or breaks the `atomsDone/65` scaling, or reintroduces a `Math.random()`/`Date` dependency) would pass `node --test` cleanly — this is exactly the kind of silent regression the review was asked to surface, on a function this codebase explicitly calls out as load-bearing for a written acceptance criterion.

**Fix:** Add unit tests: `skyDawn(0) === 0`, `skyDawn(65) === 0.6` (the cap, not `1.0`), `skyDawn(negative|NaN) === 0` (defensive), and one mid-value assertion (`skyDawn(32.5) ≈ 0.5`, i.e. below the cap so the scaling math itself is pinned, not just the cap).

---

### WR-07: `ring.test.js` has no coverage for negative/NaN `atomsDone`, `seed` 0/NaN/negative, or `atomsDone` > 65

**File:** `scripts/tests/ring.test.js` (whole file — no such cases present)

**Issue:** The review brief explicitly asked to check "Ring generator edge cases (0 atoms, 65 atoms, seed 0, negative/NaN inputs, progress > 65)." Manual reproduction confirms the *implementation* handles all of these defensively today (clamped via `Math.max(0, Math.min(ATOMS, cfg.atomsDone | 0))` and `cfg.seed >>> 0`):
```
atomsDone: -5   -> data-atoms= 0   pathNodes= 261  (no throw)
atomsDone: NaN  -> data-atoms= 0   pathNodes= 261  (no throw)
atomsDone: 999  -> data-atoms= 65  pathNodes= 265  (clamped)
seed: 0         -> data-atoms= 10  pathNodes= 271  (no throw, valid distinct seed)
seed: NaN       -> data-atoms= 10  pathNodes= 271  (silently becomes seed 0 via `NaN >>> 0`)
seed: -5        -> data-atoms= 10  pathNodes= 272  (no throw)
```
But none of this is asserted anywhere — it was verified by this review manually, not by the suite. A future refactor of the clamping logic (e.g. someone "simplifying" `Math.max(0, Math.min(ATOMS, cfg.atomsDone | 0))`) could silently reintroduce a crash or an out-of-range render with zero test failure.

**Fix:** Add explicit assertions for each case above (does-not-throw + expected `data-atoms`/clamped value), plus WR-03's partial-`structure` case in the same pass.

---

### WR-08: `preview.html`'s own Sky demo labels contradict the real `skyTemp()` implementation it claims to demonstrate

**File:** `preview.html:447-451` (§7 Sky demo cards); implementation at `shared/awba-engine.js:1287-1300`

**Issue:** The demo cards read *"Dawn / Fajr → Duha"* and *"Day / Duha → Maghrib · unwarmed"*. But `skyTemp()`'s actual dawn→day boundary is **Dhuhr**, not Duha/sunrise — there is no `duha` field anywhere in the `prayerTimes` schema (`fajr, dhuhr, asr, maghrib, isha` only), and `03-10-SUMMARY.md:39,86` confirms this was a deliberate implementation choice ("Dhuhr is the dawn→day boundary... the manual times table has no Duha"). With the default schedule (`fajr 05:00, dhuhr 13:00`), the real "dawn" tint window is **05:00–13:00 (8 hours)**, not the "Fajr → sunrise" reading the label implies — a large, user-visible difference from what the living reference's own copy tells a reviewer to expect.

**Failure scenario:** `preview.html` is the artifact the §9 human gate was walked against and the artifact future engineers will treat as ground truth ("real `AW.*` output, zero CDN... it must *feel* like Athar, not a spec dump" — §8's own framing). A reviewer or future engineer reading "Fajr → Duha" here and then observing the real app's dawn tint still active at noon will reasonably conclude something is broken, when in fact the demo's own label is wrong, not the app.

**Fix:** Update the §7 card copy to say "Fajr → Dhuhr" (matching the real boundary) or, if "Duha" framing is preferred for the learner-facing product copy, add a `duha`/`sunrise` field to the `prayerTimes` schema and wire `skyTemp()` to use it — but the demo text and the pure function it's demonstrating must agree.

---

### WR-09: `memFallback` suppresses `AW.S.set()`'s persist for the **rest of the session**, not just the write that would clobber the unrecognized blob

**File:** `shared/awba-engine.js:59-63` (flag + comment), `218-222` (set on load), `256-260` (`set: function(k,v){ ... if (!memFallback) persist(mem); }`)

**Issue:** This directly answers the review brief's question — *"does it ever wrongly SUPPRESS a legitimate persist?"* Yes. Once `load()` resolves from an unrecognized-schema (`schemaVersion` missing/non-numeric/greater-than-`CURRENT`) blob, `memFallback` is set `true` for the lifetime of the `AW.S` closure (i.e. for the rest of that page's session) — not just for the one write that would have clobbered the untouched-on-disk blob. Every subsequent `AW.S.set()` call in that session — `noor` increments, `AW.touchDay()`'s `returns`/`lastDay`/`days` writes, `stars`, `chests`, the `ringSeed` mint — silently stops persisting, with **no user-facing indicator that saving has stopped**.

**Does it correctly prevent the CR-01 clobber?** Yes — confirmed both by `state-storage.test.js`'s three CR-01 tests (load-time) and, more importantly, by `ring.test.js:136-142`'s dedicated W1 test, which proves a `set()` call (via `AW.ringSeed()`) after loading a future-schema blob leaves the on-disk blob byte-identical. That part of the fix is solid and well-tested.

**Failure scenario:** This trigger condition (an on-disk `awba_state` blob with a `schemaVersion` the current build doesn't recognize) is not reachable through any normal v1 flow today — no code path here ever writes a future `schemaVersion`. It becomes reachable via multi-tab races against a newer deployed build, manual devtools tampering, or a future migration bug. If it fires, a learner could play an entire session — complete lessons, earn noor, extend a streak — and have **all of it silently discarded** on next reload, with the app behaving normally the whole time (no error, no console warning visible to a real user, nothing in the UI says "not saving").

**Fix:** At minimum, `console.warn` once when `memFallback` is set, so the condition is discoverable in devtools during development/support. Consider whether a future-schema blob should instead trigger a one-time non-blocking in-app notice ("this device has newer data than this version of Awba understands — your progress this session won't be saved until you update") rather than degrading completely silently. Not urgent for v1 (unreachable today) but worth a tracked follow-up before this trigger becomes reachable.

## Suggestions

### SG-01: `skyTemp()` has no validation on `prayerTimes` format or chronological order

**File:** `shared/awba-engine.js:1273-1276` (`skyMinutes`), `1287-1300` (`skyTemp`)

A malformed `"HH:MM"` string (`Number(p[0])||0`) silently resolves to minute 0 (midnight) rather than falling back to the default schedule. Times set out of chronological order (e.g. a hypothetical future settings screen letting a user set `maghrib` earlier than `dhuhr`) silently misclassify, since the boundary checks assume ascending `fajr < dhuhr < maghrib < isha`. No settings UI exists yet to trigger this in v1, so it's low-priority today — flagging so it's not forgotten when the settings screen (mentioned in §7.2 as a later phase) ships.

### SG-02: `.thread` / `.plate` / `.rosette` — 3 of the 4 new celebration primitives (§4.4) — are authored but never instantiated anywhere

**File:** `shared/awba-engine.css:890-921`; absent from `preview.html` and the rest of the repo (`grep -n 'class="[^"]*\b(thread|rosette|plate)\b'` across all `*.html` returns nothing)

Only `.dab` is demonstrated (in `preview.html`'s §8 reduced-motion panel). §9 gate item 9 explicitly asks the reviewer to judge "a gold thread... a festival plate," but neither has ever actually been rendered anywhere in this codebase, so their visual correctness (token resolution, stacking, sizing, animation binding) has not been exercised by either an automated test or the passed human gate. The plan for the preview rebuild (`03-11-PLAN.md`) never explicitly called for demoing them either, so this isn't a deviation from plan — just an untested code path worth flagging before it's assumed "already visually verified."

### SG-03: `.opt.correct::before`'s "draw" micro reuses the Page `settle` keyframe rather than a dedicated non-SVG draw recipe

**File:** `shared/awba-engine.css:796-806`

Spec §2.7's recipe table specifies, for the Orbit "draw" verb at UI scale (non-SVG reveals): `opacity 0→1 + translateY(4px→0)`. The implementation uses `animation: settle var(--dur-draw) var(--ease) both;` — the Page `settle` keyframe (`translateY(8px)→0`), just timed with the Orbit `--dur-draw` token. Visually very similar, functionally harmless, but it's a minor motion-vocabulary purity gap (an Orbit-verb component borrowing the Page keyframe) worth a follow-up polish pass.

### SG-04: `--dur-amb`'s doc comment claims a "gold-thread ambient" consumer that doesn't exist in the CSS

**File:** `shared/awba-engine.css:168`

`--dur-amb: 5200ms; /* Sky breathe, halo, gold-thread ambient */` — but `.thread` (`shared/awba-engine.css:890-896`) uses the one-shot `--dur-draw` (240ms), not `--dur-amb`. Either the comment is aspirational (a planned ambient shimmer on the completed gold thread that hasn't been built) or stale copy-paste from an earlier draft. Low priority; just needs reconciling with intent.

### SG-05: `preview.html` §1's Sky panel copy ("a horizon that breathes") describes motion the panel itself doesn't show

**File:** `preview.html:230`; underlying element `shared/awba-engine.css:289-293` (`.reg-sky-night::before`, no `animation` property — static, and this matches the spec's own literal CSS for that pseudo-element, so this is not a CSS defect)

The §1 register-world panel's own description text says "a horizon that breathes," but the `.reg-sky-night::before` ambient glow shown in that exact panel is static (pseudo-elements can't carry the `.sky-breathe` utility class — it's only demonstrated on a separate, real DOM element in §8). A reviewer reading §1 in isolation would reasonably expect to see the horizon pulsing and would not. Copy-accuracy nit in the living reference, not a functional bug.

### SG-06: `.reg-sky-night::before` omits the explicit `z-index: 0` every sibling decorative pseudo-element in this file sets

**File:** `shared/awba-engine.css:289-293` (compare to `.reg-orbit::before` at `330-336`, `.reg-orbit[data-sky]::after` at `312-316`, `.grain::after` at `251-261`, `.reg-festival::before` at `303-307`, all of which set `z-index: 0` explicitly)

Almost certainly harmless in practice (an absolutely-positioned, `z-index:auto` pseudo-element still paints in normal document order relative to later `z-index:1` content), but it's the one inconsistency against an otherwise-perfectly-consistent pattern in this file. Worth a one-line normalization pass; recommend a quick visual spot-check on a real Sky-owned screen once one exists.

### SG-07: `AW.ringSVG`'s `size` parameter uses a truthy `||` guard instead of the `typeof`-based clamping used for `seed`/`atomsDone`

**File:** `shared/awba-engine.js:1134` (`var size = cfg.size || 300;`)

Inconsistent defensive-coding style within the same function — `seed`/`atomsDone` are guarded with careful `typeof`/`Math.max`/`Math.min` clamps, but `size` falls back on any falsy value (so `cfg.size: 0` silently becomes `300` rather than being treated as caller error). Not currently exploitable (no caller passes `size: 0`), purely a consistency nit.

---

_Reviewed: 2026-07-13T00:17:59Z_
_Reviewer: Claude (adversarial code review)_
_Depth: deep — cross-file, with live reproduction against `node --test` for every Ring/Sky finding and computed WCAG contrast ratios for every colour finding (not just read-through)_

---

## FIXES (applied 2026-07-13)

**All 9 Warnings fixed.** Suite 53/53 → **64/64 green** (+11 tests; 1 existing test updated for WR-02).
`node scripts/validate-content.js --self-test` OK after every engine edit. §12 grep gates re-verified
(gated literals in `shared/` = 0; single `@layer` order line; CSS braces balanced; JS parses; no CDN
in `preview.html`). Each fix committed atomically. Suggestions: **0 applied, 7 documented** (none was
unambiguously trivial-AND-zero-risk once second-order effects were weighed — see notes below).

| Finding | Fix applied | Commit |
|---|---|---|
| **WR-01** | Added an `animateFrom` cfg param (previous atom count). Ink-draw now attaches ONLY to dabs in `[animateFrom, atomsDone)` — the span newly inked since the last render. **DEFAULT `animateFrom = atomsDone` ⇒ empty span ⇒ fully static**, so a reload/regeneration at unchanged progress replays nothing (§6.4, law 9). Reduced motion still overrides to static. `preview.html`'s animated demo + Replay button pass `animateFrom:25` explicitly (the in-progress lesson's start atom at atomsDone 28) so the frontier still draws on demand; every other ring stays static. Tests: unchanged progress → 0 ink-draw + byte-identical; `animateFrom 25` → 20 animated paths, a strict subset of the 116 at `animateFrom 0`; determinism holds. | `16638dc` |
| **WR-02** | Gated the head-dot on an **actual frontier** (`var head = frontier;`, dropping the `|| dabs[0]` fallback). At `atomsDone 0` there is no frontier ⇒ no head-dot ⇒ the ring is genuinely all-faint, matching §6.6 #3 and §6.3 ("head at the current inking frontier"). Spec-edit ban (only the WR-04 AA annotation permitted) made the review's option (a) — rewrite §6.6 — impossible, so the code was corrected instead. Updated the zero-progress assertion in `ring.test.js`. | `ab60978` |
| **WR-03** | `cfg.structure` now merges field-by-field against the canonical `{circuits:4,lessons:15,atoms:65}` and coerces each field to a positive finite integer. A partial object (`{circuits:4}`) or a malformed field can no longer produce a `NaN` aria-label / `data-atoms` or a silently empty ring. Regression test pins both the partial and all-invalid cases. | `fb8b8bd` |
| **WR-04** | Repointed the `[data-state="not-yet"]` cream border from `--ink-40` (**2.56:1**, failed WCAG 1.4.11) to **`--ink-62`** — computed **5.02:1** on Haram Cream (compositing `rgba(19,16,19,.62)` over `#F3EDE2`), clearing the 3:1 non-text threshold. Shape language (hollow/half/filled) unchanged. Annotated the UI-SPEC §2.1 contrast ruling with the corrected token + ratio (the one permitted spec edit). | `55b80e3` |
| **WR-05** | Repointed both `preview.html` captions using `--paper-45` (**4.05:1** on Kiswah, failed AA 4.5:1 for 12px text) to **`--paper-62`** — computed **6.69:1** (compositing `rgba(243,237,226,.62)` over `#131013`), clearing AA. `--paper-45` remains defined for non-text decoration only. | `c78bc29` |
| **WR-06** | Added `AW.skyDawn` coverage (previously zero): `skyDawn(0)===0`; the exact `/65` scaling below the cap (`skyDawn(26)===26/65 < 0.6`); the **0.6 cap** at and past its crossing (`skyDawn(65)===0.6`, `skyDawn(45)===0.6`); defensive flooring of negative/NaN to 0. | `cd524d1` |
| **WR-07** | Pinned the verified-correct Ring numeric edge cases: negative/NaN `atomsDone` → `data-atoms="0"` all-faint (no throw); `atomsDone 999` → clamped to 65; `seed` 0 / NaN / negative → `data-seed` `"0"` / `"0"` (`NaN >>> 0`) / `"4294967291"` (uint32 wrap), all without throwing. | `aa01104` |
| **WR-08** | Corrected the §7 Sky demo cards from "Fajr → Duha" / "Duha → Maghrib" to **"Fajr → Dhuhr" / "Dhuhr → Maghrib · unwarmed"**, matching `skyTemp()`'s real Dhuhr boundary (no `duha` field exists; 03-10-SUMMARY documents Dhuhr as the deliberate boundary). | `5b4a144` |
| **WR-09** | Kept the (correct) future-schema persist-suppression semantics unchanged and made them **explicit**: added read-only **`AW.S.isFallback()`** and documented the session-wide blast radius in the STATE banner comment (no gated literals). Test proves `AW.S` persistence is suppressed while `AW.prefs` persistence is UNAFFECTED, and that a recognized blob reports `isFallback()===false` and persists normally. | `3ceb152` |

### Suggestions — documented, not applied (rationale)

- **SG-01** (`skyTemp` prayerTimes format/order validation) — non-trivial (needs validation logic); no settings UI can trigger it in v1. **Deferred** to the settings-screen phase.
- **SG-02** (`.thread`/`.plate`/`.rosette` never instantiated) — requires adding demo instances to the §9-gated `preview.html`; not a comment-only change. **Deferred** to a preview follow-up.
- **SG-03** (`.opt.correct::before` reuses the Page `settle` keyframe) — needs a dedicated Orbit-draw keyframe; a motion-vocabulary purity polish, not trivial. **Deferred.**
- **SG-04** (`--dur-amb` comment claims a gold-thread ambient consumer) — comment-only, BUT the identical comment lives in UI-SPEC §2.7 (which I may not edit), so "fixing" only the CSS side would create a CSS↔spec divergence, and the review notes it may be an intentional aspirational marker. **Left documented** to avoid divergence.
- **SG-05** (§1 "a horizon that breathes" describes motion the static panel doesn't show) — a copy change to a §9-gate artifact; a design-authority/copy call, not obviously zero-risk. **Deferred.**
- **SG-06** (`.reg-sky-night::before` omits explicit `z-index:0`) — the review itself asks for "a quick visual spot-check on a real Sky-owned screen," so it is **not** verified zero-risk (could alter stacking). **Deferred** to that visual check.
- **SG-07** (`size` uses `||` instead of a `typeof` clamp) — a real code change to a pure function for a currently-unreachable input (`size:0`); a consistency nit, not clearly zero-risk. **Deferred.**

_Fixed: 2026-07-13 · Fixer: Claude (gsd-code-fixer) · Iteration 1_
