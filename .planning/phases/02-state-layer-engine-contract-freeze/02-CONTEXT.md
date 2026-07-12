# Phase 2: State Layer & Engine-Contract Freeze - Context

**Gathered:** 2026-07-12 (auto mode — owner directive: proceed autonomously; recommended options selected, logged in 02-DISCUSSION-LOG.md)
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the persistence + contract foundation the content port depends on: one versioned `awba_state` localStorage blob behind Josh's exact `AW.S.get/set` call shape with a lossless Gen-3 migration chain (FND-05), a separate user-preferences store (FND-06), the classic-script `window.AW` namespace discipline every page follows over `file://` (FND-07), and a standalone node-runnable content validator that freezes the `AwbaLesson`/`AwbaReview` config contract as executable checks (ENG-07). NO DOM components, NO icons, NO engine runners, NO content — those are Phases 3–4. The state layer is DOM-independent by design and testable in isolation.

</domain>

<decisions>
## Implementation Decisions

### State schema & migration (FND-05)
- **D-13:** Single blob `localStorage['awba_state']`, shape per ARCHITECTURE.md: `{schemaVersion: 1, noor, returns, lastDay, days[], stars{}, chests{}}`. Legacy `awba_chest_<id>` boolean keys consolidate into the `chests{}` map. `stars` stays best-of, never downgrades, shared namespace lessons+reviews.
- **D-14:** Migration is hidden entirely inside `AW.S` (the only code allowed to touch `localStorage`): (1) `awba_state` at current version → use; (2) older version → sequential migration chain `migrations[n]`; (3) absent but legacy Gen-3 discrete keys (`awba_noor`, `awba_returns`, `awba_lastDay`, `awba_days`, `awba_stars`, `awba_chest_*`) present → construct v1 from them, write once; (4) nothing → default v1.
- **D-15:** Migration is **non-destructive**: legacy `awba_*` keys are read but never deleted (once `awba_state` exists it wins on later loads). Cheap rollback insurance for Josh's existing browser data; reviewer can verify losslessness by diffing legacy keys against the new blob.
- **D-16:** `lastDay`/`days[]` move to stable `"YYYY-MM-DD"` **local-date** strings internally; the migration converts legacy `toDateString()` values. Day boundaries stay local-timezone exactly like Gen-3 (`touchDay` semantics unchanged, days capped at last 90) — no timezone robustness engineering in v1; that would change mercy-streak behavior Josh shipped.

### AW.S surface & state API (FND-05)
- **D-17:** External call shape frozen: `AW.S.get(key, default)` / `AW.S.set(key, value)` — generic key/value against the in-memory parsed blob, whole blob persisted on every `set`. Callers never learn about `awba_state` or versions. (This is also the future backend seam — do NOT build any adapter now.)
- **D-18:** State-layer helpers land now as pure, DOM-free functions per ARCHITECTURE.md build-order step 2: `AW.state()`, `AW.touchDay()`, `AW.greetMode()`, `AW.weekCal()`, `AW.deriveNodeState(nodesFlat, progress)`. `deriveNodeState` ships as a pure function with fixture tests (console/node callable); its unlock-order behavior against the real course map is *verified* in Phase 5 (CNT-03), not here.
- **D-19:** Gen-3 semantics preserved exactly in helpers: `touchDay()` dedups by day and appends to `days` (fires on lesson/review begin, never on page load — callers wire that in Phase 4/5); `greetMode()` returns first/streak/returning by day-diff; single `AW.state()` read per render pass is the documented consumption pattern (anti-pattern 3: never re-read in loops).

### Preferences store (FND-06)
- **D-20:** Separate blob `localStorage['awba_prefs']` — never mixed into progress state, so clearing/migrating one can't corrupt the other. Shape: `{schemaVersion: 1, soundMuted: false, motion: 'system' | 'reduce'}` behind `AW.prefs.get/set` (same wrapper pattern as AW.S, own key).
- **D-21:** Prefs apply at boot by stamping attributes on `<html>`: `data-motion="reduce"` (only when user override active) and `data-sound="muted"`. Phase 1's engine CSS already anticipates attribute hooks; Phase 3 binds the motion layer to `prefers-reduced-motion` OR `[data-motion="reduce"]`; Phase 4 reads `data-sound`/prefs for cues. Phase 2 only ships the store + boot stamping.

### Classic scripts & namespace (FND-07)
- **D-22:** One engine file `shared/awba-engine.js` begins now with banner-commented sections (STATE first; KIT/COMPONENTS/RUNNERS are labelled placeholders for Phases 3–4). NOT split into multiple JS files — every extra `<script>` tag would force edits to Josh's 19 data files (ARCHITECTURE.md anti-pattern 2). Only net-new `awba-learn.js` (Phase 5) ever splits out.
- **D-23:** `window.AW` is defined **synchronously at parse time** — no `defer`/`async` on the engine tag, no DOMContentLoaded wrapping for namespace definition — because Josh's lesson files call `AW.cite(...)` inside cfg string concatenation the moment their inline script runs. Everything works double-clicked from `file://`; zero ES modules; font/CSS URLs stay page-relative (never leading slash).
- **D-24:** Strict boundary from day one: `AW.S`/`AW.prefs` are the ONLY localStorage readers/writers in the codebase — enforced by a grep gate in plans (`localStorage` appears only inside the state section of awba-engine.js).

### Content validator — the executable contract freeze (ENG-07)
- **D-25:** `scripts/validate-content.js` — plain Node, zero npm dependencies, classic single file, exit 0/1 with a human-readable per-file error report. Dev tooling may use Node freely (like the existing python glyph gate); the *site* stays zero-build.
- **D-26:** Data files are HTML pages with inline `AwbaLesson({...})`/`AwbaReview({...})` calls, so the validator executes each file's inline script in a `node:vm` sandbox with stubbed globals (`AwbaLesson`/`AwbaReview` capture cfg; `AW.cite(id,label)` returns the real `<span class="cite" data-ref="…">` markup so embedded citation IDs are extractable and cfg strings stay intact). No regex-parsing of the object literal — evaluate, then validate the captured cfg.
- **D-27:** Checks (the frozen contract, from `.planning/research/ENGINE-CONTRACT.md` §1): known beat types only (read/frame/verse/panel/depth/reflect/mc/tf/tile); required per-type fields present with correct types; every `data-ref`/`AW.cite` ID resolves in `cfg.refs` and every `data-term` in `cfg.terms` (and flag unused dictionary entries as warnings); `mc.c` in range of `o[]`; `tile.solution ⊆ bank` and exact-length; panel `variant` ∈ {pull,tell,guard,check}; depth lenses = exactly {reality,revelation,ruling}; marker types ∈ {fact,remember,fard,angle}; review items MC/TF shapes with explanation `t`; `next.href`/`label` present where required; top-level required fields (`id`, `unitColor`, `opener`, `beats`, `refs`, `terms`, `recap` for lessons; `id`, `title`, `sub`, `mastery`, `items` for reviews).
- **D-28:** Fixtures in `scripts/fixtures/`: one **valid** lesson + one valid review using neutral placeholder copy (obviously non-scripture filler — we NEVER author religious content, even in fixtures), and one **deliberately broken** lesson violating multiple rules (unknown beat type, dangling ref ID, out-of-range answer index). Validator self-test: broken fixture MUST fail with specific errors, valid fixtures MUST pass. In Phase 4 the same validator runs against all 19 real ported files as the port gate.
- **D-29:** The contract documentation stays in `.planning/research/ENGINE-CONTRACT.md` (already exhaustive); the validator is the *executable* freeze. No duplicate contract doc in the repo root — Josh-facing README (incl. how to run the validator) is Phase 7 scope (PLT-04).

### Verification vehicle
- **D-30:** Phase-2 proof is script-first, not visual: (a) validator self-test (broken fixture flagged, valid fixtures pass); (b) a migration test that seeds legacy Gen-3 `awba_*` keys and asserts every value lands losslessly in `awba_state` — runnable headlessly (node vm with a localStorage stub) AND reproducible by a reviewer in a real browser via a short seeded-console recipe recorded in the SUMMARY. If a small dev harness page helps the human gate, keep it inside `preview.html`-style dev surface or `scripts/` — never shipped navigation.

### Claude's Discretion
- Internal file organization of the state section, exact error-message wording in the validator, warning-vs-error classification for non-contract lint findings, fixture copy (neutral placeholder text), and whether the migration test harness is a node script or an HTML dev page — planner/executor judgment within the decisions above.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### The contract being frozen (primary)
- `.planning/research/ENGINE-CONTRACT.md` — §1 exact `AwbaLesson`/`AwbaReview` cfg shapes + beat-type table (the validator's rule source), §2 Gen-3 storage schema (migration source: keys, types, semantics, `touchDay`/`greetMode`/caps), §6 quality gaps (no-versioning + silent-error-swallowing gaps are Phase-2-owned)
- `.planning/research/ARCHITECTURE.md` — "Backward-Compatible Engine Contract" table (AW.cite parse-time requirement, script boilerplate that must not change), "Persistent State Layer: Schema & Versioning" (the v1 blob shape + 4-step migration resolution adopted in D-13/D-14), anti-patterns 1–3 (ES modules, file-splitting, loop re-reads)

### Prior phase decisions that bind here
- `.planning/phases/01-foundation-design-tokens-responsive-shell-fonts/01-CONTEXT.md` — D-04 (one stylesheet; Phase 2 adds NO CSS), D-07 (JS reads unit colors FROM CSS custom properties via getComputedStyle — the state layer must not introduce a second color source; the cfg.unitColor→data-unit mapping itself is Phase 4 engine work)
- `.planning/phases/01-foundation-design-tokens-responsive-shell-fonts/01-04-SUMMARY.md` — Phase 1 gate record; `preview.html` head boilerplate is the template for any dev harness page

### Research
- `.planning/research/STACK.md` — localStorage versioned-wrapper reference pattern; what NOT to use (no IndexedDB wrappers, no libraries)
- `.planning/research/PITFALLS.md` — storage pitfalls incl. iOS 7-day eviction context (owner-level; Phase 7 mitigates)

### Source material (Josh's Gen-3 — behavior ground truth)
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/shared/awba-engine.js` — the actual `AW.S`, `touchDay`, `greetMode`, `weekCal` implementations whose semantics D-19 preserves; read before reimplementing
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/lessons/u1-m1.html` — real lesson data-file shape the validator must ingest (inline script + AW.cite concatenation)
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/reviews/u1-review.html` — real review data-file shape
- `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/learn.html` — chest-key usage (`awba_chest_<id>`) and node-state derivation the migration + `deriveNodeState` must honor

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `shared/awba-engine.css` (Phase 1, 307 lines) — `@layer tokens, base, components, screens, motion` declared once; Phase 2 touches NO CSS.
- `preview.html` — proven classic-inline-JS-over-file:// pattern (getComputedStyle reads, data-attribute switching) and the canonical head boilerplate; template for any dev harness.
- `scripts/check-glyph-coverage.py` — the existing dev-gate precedent `validate-content.js` joins (same directory, same "gate exits non-zero" convention).

### Established Patterns
- Zero build step; classic scripts only; page-relative URLs (never leading slash); `data-*` attributes on `<html>` as the JS↔CSS switching mechanism (Phase 1's `data-unit`; Phase 2 adds `data-motion`/`data-sound`).
- GSD plan gotchas that bind: literal "D-NN" strings required in plan must_haves.truths; `grep -c` exits 1 on zero count (use `! grep -q` in verify chains).

### Integration Points
- Phase 3 motion layer binds to `[data-motion="reduce"]` stamped by the prefs boot code (D-21).
- Phase 4 engine runners consume `AW.S`/`AW.state()`/`AW.touchDay()` and run the validator against all 19 ported files (D-28); the runners join the same `shared/awba-engine.js` file in their own banner sections (D-22).
- Phase 5's `AwbaLearn` consumes `AW.deriveNodeState()` (D-18) and `AW.weekCal()`.

</code_context>

<specifics>
## Specific Ideas

- The freeze exists so Josh's 15 lessons + 4 reviews port **verbatim** in Phase 4 — every validator rule is derived from what his files already do, never from what we wish they did. When ENGINE-CONTRACT.md and Josh's actual files disagree, his files win and the contract doc gets corrected.
- Mercy laws bind even in dev tooling: validator output is calm and specific (file → what's wrong → how to fix), no alarm-red ANSI walls; fixtures never contain scripture or generated religious content.

</specifics>

<deferred>
## Deferred Ideas

- Timezone-robust day boundaries (UTC or tz-aware streaks) — deliberately NOT v1 (D-16); would silently change Josh's shipped mercy-streak behavior. Revisit only with owner sign-off.
- Backend/Supabase storage adapter behind `AW.S` — explicitly out of scope (PROJECT.md); the seam exists, nothing more.
- Per-citation verified/pending state (vs the global "pending review" string) — content-workflow feature, belongs with the scholar-gate workflow discussion, not the state layer.

</deferred>

---

*Phase: 2-state-layer-engine-contract-freeze*
*Context gathered: 2026-07-12*
