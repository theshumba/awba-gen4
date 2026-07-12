---
phase: 03-components-icon-kit-motion-language
plan: 06
subsystem: ui
tags: [athar, design-tokens, register-architecture, motion-tokens, grain, scripture-law, focus-rings, thermal-state, file-protocol, css-layers]

# Dependency graph
requires:
  - phase: 03-01
    provides: "the immutable @layer tokens, base, components, screens, motion cascade + the original :root token body / @layer base reset+shell this plan rewrites"
  - phase: "font-vendoring (b66b75a)"
    provides: "the committed subset .woff2 set (readex-pro-300..700, amiri-400/700, amiri-quran-400, marcellus-400, aref-ruqaa-400/700, rakkas-400, courier-prime-400, inter-400) + shared/img/grain.png the @font-face + grain var reference"
provides:
  - "@layer tokens = the Athar token sheet: the §2.2 @font-face set (Readex Pro workhorse, Amiri/Amiri Quran scripture, Marcellus/Aref Ruqaa/Rakkas/Courier display+marginalia, Inter as the silent corner-bracket fallback), the seven --font-* role stacks, the retained 4px --sp-* scale, the Athar type roles, the 17 verbatim-hex colour tokens + ink/paper opacity ramps, the print radii scale, the ink/edge depth set, --grain, and the one-easing motion tokens (MOT-01/MOT-04)"
  - "@layer base = the Athar register architecture: the cream body/shell ground, the .grain/.grain::after utility with per-ground --go, the four .reg-* grounds (orbit/page/sky-night/festival) each with --icon-accent, the data-sky tint layer over Orbit (law 1), the [data-state] --st thermal map + ramp bar, ground-scoped :focus-visible (crimson on cream / gold on dark), scripture law (.ayah/.scripture + the sole permitted glow), and the .nightfall interstitial"
  - "data-unit dismantled CSS-side: the four [data-unit] colour blocks + the --accent set deleted (AW.UNIT_ICON JS untouched, so data-unit survives as the unit→icon key only)"
affects: [07 (Ring SPOF renders on real colour tokens), 08 (icons consume --icon-accent per ground), 09 (components re-skin — owns the retired-token cleanup in @layer components/motion), 10 (Sky screens build on .reg-sky-night + data-sky), 11 (preview.html walks the register worlds), 12 (whole-file --accent/rgba(37,54 closure gate)]

# Tech tracking
tech-stack:
  added: []
  patterns: [register grounds as scoped classes setting ink + --go + --icon-accent, ink hierarchy as opacity ramps of two ground inks (not new colours), one-easing motion family with per-register verb recipes, sky-as-tint over Orbit ground (data-sky, law 1), thermal state as data-state --st map (shape-first colour-second), ground-scoped focus-ring recolour, scripture-only text-shadow glow]

key-files:
  created: [.planning/phases/03-components-icon-kit-motion-language/03-06-SUMMARY.md]
  modified: [shared/awba-engine.css]

key-decisions:
  - "The immutable layer-order line (:16) was never touched — only the CONTENT of @layer tokens and @layer base was rewritten; grep-count stays exactly 1"
  - "position:relative was added to each .reg-* ground (a faithful implementation detail beyond the §3.1 verbatim snippet) so the specced ::before horizon glow / checker trim and the data-sky ::after anchor to the ground rather than the viewport"
  - "The desktop backdrop keeps its radial-wash STRUCTURE, re-tokened to a barely-there warm-ink wash over --cream (no second cream token exists — one cream wins); the column separates via --sh-3 + --keyline"
  - ".ayah/.scripture set no explicit colour — they inherit each register ground's full-opacity ink (kiswah on cream, moonmilk/cream on dark), which is exactly 'strongest ink on the page' with no per-ground override needed"
  - "The default :focus-visible ring is Crimson (Page is ~90% of minutes); .reg-orbit/.reg-sky-night/.nightfall scopes override to Gold — both AA-safe non-text (crimson 6.13:1 on cream, gold 6.95–8.40:1 on dark)"

patterns-established:
  - "Gated-literal hygiene: every retired name (poppins / --accent / rgba(37,54, / gummy / data-unit) is kept out of BOTH code and prose in the rewritten layers, so absence-grep gates never trip on a comment"
  - "Scoped-verify discipline: the poppins + rgba(37,54, checks are sed-scoped to the @layer tokens region because @layer components/motion still legitimately carry the retired values until plan 09 (the accepted transient)"

requirements-completed: [MOT-01, MOT-04]

# Metrics
duration: 14 min
completed: 2026-07-12
---

# Phase 3 Plan 06: Tokens + Base Re-ground — @layer tokens Rewrite + Register Architecture Summary

**Re-grounded the whole visual system in `shared/awba-engine.css`: `@layer tokens` is now the Athar sheet — the transplant-ready `@font-face` set (Readex Pro the sole workhorse, Amiri/Amiri Quran for scripture, the rationed display/marginalia faces, Inter demoted to the silent U+02F9/U+02FA fallback), the 17 verbatim-hex colour tokens with their two ink/paper opacity ramps, the shallow print radii, the ink/edge depth model (no indigo shadow survives), the grain var, and the one `cubic-bezier(0.23,1,0.32,1)` easing family with UI ≤300ms + ambient 4–6s durations; `@layer base` is re-grounded onto the four register scopes (`.reg-orbit/.reg-page/.reg-sky-night/.reg-festival`), the home Sky-as-tint over the Kiswah ground (law 1), the thermal `data-state` `--st` map, ground-scoped focus rings, the grain utility, scripture law (`.ayah`/`.scripture` + the sole permitted glow), and the Nightfall interstitial — with `data-unit`/`--accent` colour theming fully dismantled CSS-side. The layer-order line was never touched and the 37-test JS suite stayed green.**

## Performance

- **Duration:** ~14 min
- **Started:** 2026-07-12T21:42Z
- **Completed:** 2026-07-12T21:56Z
- **Tasks:** 2
- **Files modified:** 1 (`shared/awba-engine.css` — 292 insertions / 191 deletions across the two layers)

## Accomplishments

- **Task 1 — @layer tokens is the Athar sheet:** transplanted the §2.2 `@font-face` block verbatim (5 Readex Pro weights, Amiri 400/700, Amiri Quran 400, Marcellus 400, Aref Ruqaa 400/700, Rakkas 400, Courier Prime 400, and the single Inter 400 marked the silent corner-bracket fallback), every `src` CSS-relative; set the seven `--font-*` role stacks with `'Inter'` appearing exactly twice file-wide (the `@font-face` family + the `--font-work` slot); retained the Phase-1 4px `--sp-*` scale verbatim (D-A1); authored the Athar type roles (`--fs-body/--fs-ar-ui/--fs-ui/--fs-h2/--fs-h1/--fs-display/--fs-term/--fs-festival/--fs-marg/--fs-ayah/--fs-scrip`); authored the 17 colour tokens verbatim-hex (`--kiswah … --pink`) + the two ink/paper opacity ramps; replaced radii with the print scale (§2.4) and shadows with the ink/edge depth set (§2.5, no `rgba(37,54,` authored); added `--grain: url('img/grain.png')`; authored the one `--ease` family + all UI/ambient duration tokens (§2.7 — MOT-01/MOT-04). Deleted the four `[data-unit]` colour blocks, the default `--accent*` set, and the retired `--press-rest/--press-active/--scrim/--overlay-hero` + all legacy semantic tokens (`--amber*`/`--green*`/`--danger*`/`--flame*`/`--bg`/`--card`/`--paper`/`--tint`/…).
- **Task 2 — @layer base re-grounded:** re-tokened `body` + `.app-shell` to the cream ground; kept the responsive-shell structure and swapped the desktop column to `--cream`/`--r-4`/`--sh-3` + `--keyline`; added the `.grain`/`.grain::after` utility with the per-ground `--go` knob; added the four register grounds verbatim (§3.1) each with its `--go` + `--icon-accent`, including the Sky horizon-apricot glow and the Festival conic checker trim; added the `data-sky` tint layer over Orbit with all five dawn/day/dusk/night/lastthird gradients (law 1 — the ground stays Kiswah); added the `[data-state]` `--st` map (powder/ember/gold) + the legend ramp bar (token layer only — shape rules deferred to plan 09); recoloured `:focus-visible` per ground (crimson on cream, gold on dark) replacing the old `[data-register="night"]` hook; refined scripture law — general Arabic UI on the Readex workhorse (law 4), `.ayah` = Amiri Quran, new `.scripture` = general Amiri for hadith/du'a, and the sole permitted `text-shadow` glow scoped to scripture on dark grounds; added the `.nightfall` interstitial (§3.4).

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite @layer tokens to the Athar sheet + dismantle data-unit/accent** — `2cf8ecd` (feat)
2. **Task 2: Re-ground @layer base — register grounds, data-sky, data-state, focus, scripture law** — `15a2b48` (feat)

**Plan metadata:** _(this SUMMARY + STATE/ROADMAP/REQUIREMENTS — final docs commit)_

## Files Created/Modified

- `shared/awba-engine.css` — `@layer tokens` content fully replaced by the Athar token sheet; `@layer base` content re-grounded to the register architecture. `@layer components`/`@layer screens`/`@layer motion` were **not touched** (plan 09 owns them; their `var(--accent…)`/`var(--scrim)`/`var(--sh-*)`/`rgba(37,54,` references are the accepted transient). The immutable `@layer tokens, base, components, screens, motion;` order line (:16) is unchanged.
- `.planning/phases/03-components-icon-kit-motion-language/03-06-SUMMARY.md` — this summary.

## Decisions Made

- The layer-order statement was never re-declared or moved — only layer *content* was rewritten (grep-count remains exactly 1).
- `position:relative` was added to each `.reg-*` ground beyond the §3.1 verbatim snippet, because the specced `::before` (Sky horizon glow, Festival checker trim) and the `data-sky` `::after` use `position:absolute` and must anchor to the ground, not the viewport. Faithful implementation of the spec's intent (deviation Rule 3 — non-optional for correct rendering).
- The desktop backdrop keeps its radial-wash structure, re-tokened to a faint warm-ink wash (`rgba(19,16,19,.035)`) over `var(--cream)` — there is no second cream token (one cream wins), so separation of the column is carried by `--sh-3` + `--keyline`.
- `.ayah`/`.scripture` deliberately set no explicit `color`; they inherit each register ground's full-opacity ink (kiswah on cream, moonmilk/cream on dark) — precisely "strongest ink on the page" with no per-ground override.
- Default focus ring is Crimson (Page dominates minutes); dark-ground scopes override to Gold. Both clear AA non-text ≥3:1.

## Deviations from Plan

**None affecting scope or behaviour — plan executed as written.** Two verify iterations were needed on Task 1 only:

- **[Rule 3 — Blocking gate self-trip] Reworded a `@layer tokens` comment that contained `'Inter'`.** The first Task-1 verify run reported `'Inter'` count = 3 (not 2): my own font-role comment used the phrase "The 'Inter' slot in --font-work", and the single-quoted literal tripped the `grep -c "'Inter'"` gate — the exact gated-literal-in-prose trap the plan warns about. Fixed by rewording the comment to "The fallback slot in --font-work" (no quoted literal). Re-verify → `TASK1_VERIFY_PASS`. No code/behaviour change; comment only. Fixed within Task 1 before commit.

`position:relative` on the `.reg-*` grounds (see Decisions) is a faithful implementation detail, not a scope deviation — the §3.1 pseudo-elements are non-functional without it.

## Issues Encountered

None blocking. The one first-pass gate miss (the `'Inter'` prose trap) is documented above and was resolved before the Task-1 commit — the working tree never carried a failing state into a commit.

## Known Stubs

None. This is a pure token/ground foundation plan — every token and ground class is fully authored to spec. The dangling `var(--accent…)`/`var(--scrim)`/`var(--sh-4)` references now sitting in `@layer components`/`@layer motion` are **not stubs** — they are the plan's explicitly-declared accepted transient, owned and removed by plan 09; gating on them is prohibited by this plan's verification note. The `[data-state]` shape rules (hollow ring / half-dab / filled+check) are intentionally the token layer only here, deferred to plan 09 per §3.3.

## User Setup Required

None — no external service, no package install, zero CDN, zero build. `shared/awba-engine.css` is a static stylesheet; all font/grain `url()` references are CSS-relative and resolve under `file://` double-click.

## Next Phase Readiness

- The Athar foundation is in place: 17 colours + ink ramps, print radii, ink/edge depth, grain, four register grounds, `data-sky`/`data-state`, ground focus, and the one motion family — everything the Ring (07), icons (08), components (09), Sky (10), and preview (11) build on.
- `--icon-accent` is set on all four grounds (Orbit/Sky gold, Page crimson, Festival harissa) ready for the icon re-inking in plan 08.
- **Open gate for plan 12 (whole-file closure), not this plan:** `! grep -q -- '--accent'` and `! grep -qE 'rgba\(37,54,'` are NOT fully closed — `@layer components`/`@layer motion` still reference the retired tokens by design. Plan 09 removes the last usages; do NOT touch those layers before then.
- No blockers.

## Self-Check: PASSED

- FOUND: `shared/awba-engine.css`
- FOUND: `.planning/phases/03-components-icon-kit-motion-language/03-06-SUMMARY.md`
- FOUND commit: `2cf8ecd` (Task 1)
- FOUND commit: `15a2b48` (Task 2)
- GATES: layer-order ×1, `'Inter'` ×2, no `[data-unit]`, no poppins/`rgba(37,54,` in @layer tokens, no leading-slash `url()`, 17 colours + `--ease` + grain var, four `.reg-*` grounds, five `data-sky` tints, three `data-state` maps, ground-scoped focus, `.grain::after`, `.nightfall`, braces balanced 132/132 — all green; `node --test scripts/tests/*.test.js` → pass 37 / fail 0.

---
*Phase: 03-components-icon-kit-motion-language*
*Completed: 2026-07-12*
