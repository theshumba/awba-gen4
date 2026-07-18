# Full-App Code Review — Awba Gen-4 v2.3 (2026-07-18)

Reviewed at commit `45357f0` (the v2.3 deploy, tree clean). Scope: the entire runtime
surface — `shared/awba-engine.js` (all 3,043 lines), `shared/awba-engine.css` (structure +
mechanisms), `shared/course-structure.js`, `shared/practice-pool.js`, all 7 root pages,
`practice/session.html`, lesson/review wiring (content itself is SHA-frozen and was not
re-reviewed), `sw.js`, `manifest.webmanifest`, and the test/gate harnesses.

## Verdict

The app itself is in excellent shape — no Critical defects found in shipped code.
Re-verified today: unit suite **204 / 204 / 0** (serialized run), `validate-content` exit 0
(3 accepted notes), `port-audit` all BYTES/HOLD/EPIGRAPH/DAILY OK, `pwa-audit` PWA OK
(57-entry precache, awba-cache-v5), `practice-pool-audit` 32 items byte-verbatim.

Two Medium findings (one is why the suite *looked* broken today), three Low, three
cosmetic/cleanup. Nothing blocks the owner ledger (scholar sign-off / licensing / DNS /
device walk).

---

## M-1 · Test infrastructure: probe-file race + unkillable Chrome (Medium)

**Observed live this session** — first suite run failed with
`ENOENT reviews/.a11yan-review-answered-probe.html`; a later run hung >20 minutes on a
wedged headless-Chrome process at 0% CPU.

Two independent defects:

1. **Probe race.** `a11y-announce.test.js` writes throwaway `.a11yan-*.html` probe copies
   into `lessons/` and `reviews/` (`runProbe`, ~line 208–235) and unlinks them when done.
   Meanwhile `a11y-keyboard.test.js:56-60` (`listHtml`) sweeps `*.html` in those same
   directories with **no dotfile filter** — and `node --test` runs test files concurrently.
   If the sweep lists a probe that gets unlinked before `readFileSync`, the whole test file
   errors. The same unfiltered sweep exists in `render-smoke.mjs:49`, `rtl-audit.mjs:136`,
   and `contrast-audit.mjs:629/635/641` — so a probe **stranded** by a killed/crashed run
   also breaks the board's pinned page counts (smoke 26 / rtl 26 / contrast 25) with a
   confusing red.
2. **No SIGKILL reaping.** All 10 Chrome-spawning harnesses
   (a11y-announce/dialogs/keyboard, learn-dom-flows, first-run-redirect, practice-run,
   render-smoke, pwa-audit, contrast-audit, rtl-audit) call `execFileSync` with a `timeout`
   but **no `killSignal: 'SIGKILL'`**. Node's default kill is SIGTERM; a wedged Chrome that
   ignores it blocks `execFileSync` forever — the observed >20-minute hang.

**Fix (small):** add `&& !f.startsWith('.')` to the four directory sweeps, and
`killSignal: 'SIGKILL'` to every `execFileSync` options object. Until then, a green run is
reproducible with `node --test --test-concurrency=1 scripts/tests/*.test.js` (verified
204/204 today, ~6 min).

## M-2 · Version-skew guards missing on learn.html + profile.html (Medium)

The v2.2 review's standing rule — *"every page that uses a new engine seam ships a
seam-absent guard"* (HTML is network-first, the engine cache-first, so the first post-deploy
load can pair fresh HTML with the previous cached engine) — is applied in
`practice.html:184` (`if (AW.streakSheet)`) and `more.html:282` (exportToken/importToken
guard), but **not** at these call sites:

- `learn.html:186` `window.AWBA_COURSE.units` · `:672` `AW.muteBtnHtml()` · `:787`
  `AW.sproutFor()` · `:904/908/918` `AW.streakSheet`
- `profile.html:231` `AWBA_COURSE` · `:369` `AW.sproutFor` · `:432/436/438`
  `AW.streakSheet`/`AW.noorSheet`
- `more.html:607` `AW.streakSheet` (the Returns tab; the move-sheet is guarded, this isn't)

**Consequence:** a returning visitor whose cache is still v1.5/v2.0 gets **one fully blank
learn.html load** (fresh HTML calls `AW.muteBtnHtml` → TypeError → `render()` dies) right
after a deploy that added seams. Self-heals on reload once the new SW has claimed. Learn is
the front door, so worth closing — either per-site guards (the established pattern) or one
boot check that reloads once when a required seam is absent and `serviceWorker.ready`.

## L-1 · AW.sheet: a stale Escape steals focus (Low)

`awba-engine.js` sheet singleton: `ensure()` installs a document-level Escape handler that
always calls `api.close()`, and `close()` neither checks that the sheet is open nor clears
`invoker` after restoring. Once any sheet has been opened, **every** later Escape press
(sheet closed, e.g. while a learn.html node popup is open) re-runs the focus-restore and
yanks focus to the remembered invoker — fighting the popup's own restore.
**Fix:** in `close()`, return unless `scrim.classList.contains('open')`; set
`invoker = null` after restoring.

## L-2 · exportToken can throw on non-ASCII state (Low)

`AW.S.exportToken` (`btoa(JSON.stringify(blob))`, ~line 336) is "ASCII by construction"
only for blobs this build wrote. Two paths copy foreign values verbatim into the export:
`migrateFromLegacy` accepts **any** `awba_stars` object (values uninspected), and
memFallback blobs are exported wholesale. Any non-Latin-1 character anywhere → `btoa`
throws → "Move to a new device" dies before its sheet renders (`more.html:290` calls
exportToken first). **Fix:** wrap the export in try/catch returning a gentle failure line,
or sanitize star values to numbers at migration time.

## L-3 · Review timeUp leaves the selection cue (Low, cosmetic-behavioural)

`timeUp()` clears `borderWidth`/`transform` on the parked options but not `borderColor`
(the gold selection cue) — a selected-then-timed-out option keeps its gold border while
disabled. `bind()`'s resolve path clears all three. One property for consistency.

## Cosmetic / cleanup

- **Dead `.journey` CSS** (`awba-engine.css:1058`, ~15 lines) — flagged at Phase-5 close,
  still shipping; nothing emits `class="journey"` (Phase 4 renders `cfg.journey` as
  `.kicker`).
- **`data-sound=""`** — `bindMuteBtn` sets the attribute to empty string on unmute
  (`awba-engine.js:2067`) where the boot-stamp convention is attribute-absent. Harmless
  today (CSS matches the value), inconsistent.
- **`skyTemp` never reads `times.asr`** — stored/defaulted but not a temperature boundary.
  Intentional per the §7.2 five-temp map; noting so nobody "fixes" it blind.

## Known-and-accepted (documented previously; listed for the owner ledger)

- **Back-nav re-scoring (SG-01, Gen-3-preserved by design):** backing into an answered
  quiz beat and re-answering earns another +12 noor and increments `correct` again — the
  verdict screen's accuracy tile can exceed 100%; the reflect +15 can likewise be re-farmed
  via back/forward. Deliberately preserved; a one-line cap per beat is available if ever
  wanted.
- **_trapFocus Shift+Tab-from-heading ghost** (v2.2 documented-accepted).
- **memFallback sessions silently don't persist** — `AW.S.isFallback()` exists but no UI
  surfaces it (WR-09 documented trade).

## Verified clean (no findings)

State layer (schema migration chain, non-destructive future-schema fallback, defensive
copies); travel-code import (prefix/checksum/base64/schema/shape validation, id whitelists,
clamps, days sort+dedupe, future-version refusal — the v2.2 attack list stays closed); XSS
posture (displayName via `textContent` only, location.hash validated against the known-id
set, only author-controlled content reaches `innerHTML` per the documented accept);
chest +25 write-once + derived-state gate; noor claim-once in both runners; local-YMD date
discipline throughout (no UTC serialization anywhere); review timer state machine
(single-fire 10s announce, permanent allInTime kill, untimed circle-back with no swift
leak); practice runner's zero-writes promise; sw.js (network-first HTML with learn.html
offline fallback, cache-first assets with fill-through, activate purge, same-origin GET
only); manifest; first-run redirect loop-breaker; the install nudge; onboarding; Ring/Sky
determinism (no Date/Math.random in generator paths).

## Session housekeeping

During testing I killed one wedged Chrome + suite process and removed a stranded
`lessons/.a11yan-lesson-probe.html` (evidence for M-1). Tree left clean at `45357f0`;
nothing committed.

---

## OUTCOME — ALL FINDINGS FIXED 2026-07-18 (same day, owner directive "fix all the problems now")

- **M-1a FIXED** — dotfile filter (`!f.startsWith('.')`) added to **seven** sweeps, not four:
  the verify panel found three more the review missed — `port-audit.mjs:56`,
  `validate-content.js:359`, `practice-pool-audit.mjs:60` — alongside
  `a11y-keyboard listHtml`, `render-smoke`, `rtl-audit`, `contrast-audit` (3 spots).
- **M-1b FIXED** — `killSignal: 'SIGKILL'` added to every `execFileSync` in all 10 Chrome
  harnesses (+ a 30s timeout on pwa-audit's `node --check`).
- **M-2 FIXED** — engine-freshness guards landed on `learn.html`, `profile.html`,
  `more.html` (which also gained its missing `window.AW` check), and
  `practice/session.html`: seam-absent → a calm "One moment … Continue" one-tap heal in
  each page's own register, never a blank throw. The learn guard carries `!window.AW`
  first (panel catch) and its heal link keeps the `?begin=1` loop-breaker (panel catch).
- **L-1 FIXED** — `AW.sheet` close() is inert unless the sheet is open and nulls the
  invoker after restore; a stray Escape can never steal focus again.
- **L-2 FIXED** — `exportToken` wraps btoa in try/catch → `null`; `openMoveSheet`
  degrades its take-half to one honest line and keeps "Bring it here" working.
- **L-3 FIXED** — review `timeUp()` also clears `borderColor` (full cue clear, matching
  `bind()`).
- **Cosmetic FIXED** — dead `.journey` CSS removed (tombstone comment left);
  `bindMuteBtn` now removes `data-sound` instead of setting it empty.
- **`sw.js` CACHE bumped v5 → v6** so the fixed engine/CSS actually reach installed
  clients (cache-first assets never revalidate without a version change).

Verification after fixes: suite **204/204/0** (serialized), validate-content OK +
self-test OK, port-audit 21× BYTES OK + DAILY + EPIGRAPH + HOLD OK, pwa-audit OK (v6),
practice-pool OK, render-smoke OK, rtl-audit OK, contrast-audit 25 pages / 0 fail.
Adversarial 3-lens verify panel (regression / skew-correctness / test-pins, 3 agents):
fixes confirmed safe; its three residual catches are folded in above. Known-accepted
items (SG-01 back-nav re-score, trapFocus Shift+Tab ghost, silent memFallback) remain
deliberately unchanged.
