# 07-REGRESSION — the PLT-05 Gen-3 v1.1–v1.5 ship-checklist

**Requirement:** PLT-05 · **Decision:** D-74 · **Wave:** 07-03 · **Verified:** 2026-07-14

The Gen-3 owner fixes (rounds v1.1–v1.5) are the hard-won behaviours the rebuild must not regress.
This checklist maps each one to where it is proven in the **shipped Gen-4 code + tests**, and records
the exact check run to confirm it. Where a fix had no live pin, a minimal source-invariant assertion
was added (never a re-implementation, never a new test for an already-covered item). Pure-pixel
spacing that only a human eye can judge is carried to the ship walk, not faked as a code gate.

Every command below is run from the repo root and exits `0` on pass.

## Ship-checklist summary

| # | Gen-3 owner fix | Verified by | Status |
|---|-----------------|-------------|--------|
| 1 | Popup anchoring (node popup stays on-screen near an edge) | `a11y-dialogs` dialog contract + **new** `placePop` edge-clamp source pin | PASS (+pin) |
| 2 | Footer / hero spacing | `render-smoke` (renders clean) + the `@layer screens` `.foot`/`.hero` | PASS (pixel = human walk) |
| 3 | Review timer teeth (14s soft timer + timeout cap) | `runner-review` `AW.QTIME` + `AW.reviewStars` + `contrast-audit` `.rv-timer.low` | PASS |
| 4 | Accordion lenses (`.lens.open > .lb` reveal) | `runner-interaction` WR-03 lens-open handler + `render-smoke` | PASS |
| 5 | **Chest idempotency** (+25 once, survives Escape) | `learn-dom-flows` write-once claim + Festival-dismiss | PASS |
| 6 | True/False selection visibility (non-colour cue) | `a11y-keyboard` ACC-01 `aria-pressed` + `contrast-audit` `.tf` sweep | PASS |
| 7 | Back-button rules (lesson bounded step-back; review none) | **new** `runner-interaction` source pins (Gen-3 348) | PASS (+pin) |

Two real coverage gaps were found (items 1 and 7) and closed with source-invariant pins; the other
five items were already covered and were confirmed by running their checks (no new tests invented).

---

## Per-item detail

### 1 — Popup anchoring · PASS (+pin added)

- **Code:** `learn.html` `placePop()` — anchors the `.npop` node popup below/above the tapped
  station and **clamps it horizontally** to the viewport
  (`cx = Math.max(half + m, Math.min(window.innerWidth - half - m, nx))`), offsetting the arrow via
  `--ax = (nx - cx)` so it still points at the station when clamped.
- **Already covered:** the popup's dialog contract (role="dialog", singleton, Escape, outside-tap,
  aria-modal, focus move/return) — `a11y-dialogs.test.js` ("the .npop node popup is role=dialog,
  singleton, and closes on Escape and on an outside tap").
- **Gap found:** the edge-clamp geometry itself had no assertion — the harness proved the popup
  *behaves* as a dialog but never that it stays *inside the viewport*.
- **Pin added:** `a11y-dialogs.test.js` → *"PLT-05 regression: learn.html placePop clamps the node
  popup inside the viewport + keeps the arrow pointing"* — a zero-dep source invariant (no Chrome,
  never skips) that fails if the clamp or the compensating `--ax` offset is removed.
- **Run:** `node --test scripts/tests/*.test.js` (green) · `node scripts/tests/render-smoke.mjs`
  → `SMOKE OK learn.html`.

### 2 — Footer / hero spacing · PASS (pixel judgement → human walk)

- **Code:** the lesson/review `@layer screens` `.foot` / `.hero` blocks in `shared/awba-engine.css`.
- **Verified by:** `node scripts/tests/render-smoke.mjs` loads every page in headless Chrome and
  fails on any console error or missing register root — so the footer/hero **render** intact on all
  20 pages (`SMOKE OK …` for each).
- **Carried to the ship walk:** the *exact pixel rhythm* of the footer and hero (whether the spacing
  reads as balanced) is a visual judgement no automated gate can make honestly. Logged as a human
  sensory-walk item, not a code gap. The structure existing + rendering without error is the
  automatable half, and it passes.

### 3 — Review timer teeth · PASS

- **Code:** `AwbaReview(cfg)` — the 14s soft timer, the `.low` fill state near expiry, and the
  timeout-caps-your-stars rule.
- **Verified by:** `node --test scripts/tests/runner-review.test.js`
  - *"AW.QTIME: the soft timer is 14s and seeds 140 deciseconds"* — the 14s seed arithmetic.
  - *"AW.reviewStars: flawless + all-in-time → 3; a single timeout permanently caps at 2; any miss
    → 1"* — the timeout "teeth" (a timed-out answer caps the reward).
  - `node scripts/tests/contrast-audit.mjs` sweeps `.rv-timer.low .rv-timer-fill` for non-text
    contrast (the low-timer visual cue), exit `0`.

### 4 — Accordion lenses · PASS

- **Code:** `shared/awba-engine.js` depth runner — `root.querySelectorAll('.lens')` +
  `lens.classList.toggle('open')`, revealing the `.lens.open > .lb` body.
- **Verified by:** `node --test scripts/tests/runner-interaction.test.js`
  - *"WR-03: the depth-lens open handler does not re-wire the lens body"* — anchors the real
    `querySelectorAll('.lens')` open handler and proves one `AW.wire` pass binds the (hidden) lens
    body exactly once.
  - `render-smoke` renders the lens accordions clean on every lesson page.
- *(The plan mapped this to `components` tests; the live coverage actually lives in
  `runner-interaction` — located by content, per the stale-line-ref rule. Already covered → no new
  pin.)*

### 5 — Chest idempotency · PASS

- **Code:** `learn.html` `window.__awbaClaimChest` — write-once (+25 noor), a second claim is a
  no-op; the claim persists across the Festival overlay's Escape/dismiss.
- **Verified by:** `node --test scripts/tests/learn-dom-flows.test.js`
  - *"real chest claim grants exactly +25 noor once; a second claim is a no-op"*.
  - *"WR-01: a corrupted chests:null blob claims cleanly instead of throwing (+25, chest marked)"*
    plus its non-vacuous twin (*"reverting the WR-01 guard reintroduces the uncaught TypeError"*).
  - *"the Festival overlay mounts on document.body as an aria-modal dialog and dismisses cleanly"* —
    the claim survives the overlay teardown. Already covered → no new pin.

### 6 — True/False selection visibility · PASS

- **Code:** the `.tf` (and `.opt`/`.tile`) selection carries `aria-pressed="true"` plus a
  border-weight cue — a non-colour signal (WCAG 1.4.1).
- **Verified by:**
  - `node --test scripts/tests/a11y-keyboard.test.js` → *"ACC-01: selecting an .opt/.tf/.tile sets
    aria-pressed=true as a non-colour selection cue (R-11)"*.
  - `node scripts/tests/contrast-audit.mjs` snapshots the `.tf` **selected-but-not-yet-checked**
    state and sweeps its state-conveying border for the 3:1 non-text threshold, exit `0`.
  Already covered → no new pin.

### 7 — Back-button rules · PASS (+pin added)

- **Code:** `shared/awba-engine.js` —
  - `AwbaLesson(cfg)`: a **bounded** `.ls-back` "Back a step" control, hidden at the opener
    (`(pos < 0 ? ' hidden' : '')`) and clamped at the opener on step-back
    (`if (pos >= 0) { pos--; stepIndex = Math.max(pos, 0); … }`).
  - `AwbaReview(cfg)`: *"No back button, ever (Gen-3 348)"* — actively suppresses any stray
    `#awback` (`if (rb) rb.style.display = 'none';`); no back affordance is ever emitted.
- **Gap found:** neither half had any automated pin (the ship-checklist expected coverage in
  `runner-interaction`, which only pinned WR-02/WR-03).
- **Pins added:** `runner-interaction.test.js` →
  - *"WR-05 / PLT-05: the lesson runner carries a BOUNDED 'Back a step' control, hidden at the
    opener"*.
  - *"WR-05 / PLT-05: the review runner has NO back affordance on any screen (Gen-3 348)"* — includes
    a non-vacuous check that the lesson step-back markup never appears inside the `AwbaReview` body.
- **Run:** `node --test scripts/tests/*.test.js` (green).

---

## Full gate set (run at close)

```sh
node scripts/tests/pwa-audit.mjs          # → PWA OK              (exit 0)
node --test scripts/tests/*.test.js       # → tests 157, fail 0, todo 0
node scripts/tests/render-smoke.mjs       # → SMOKE OK ×(20 pages + vt-nav), no SMOKE FAIL
node scripts/port-audit.mjs               # → BYTES OK / HOLD OK  (exit 0)
node scripts/tests/contrast-audit.mjs     # (exit 0)
node scripts/tests/rtl-audit.mjs          # (exit 0)
python3 scripts/check-glyph-coverage.py   # (exit 0)
```

**Result:** every Gen-3 v1.1–v1.5 owner fix is proven intact in the shipped code — five confirmed by
running their existing checks, two closed with new source-invariant pins. The suite is `fail 0` /
`todo 0`; pwa-audit + render-smoke + every standing gate are green. The only carry-forward is the
footer/hero *pixel* spacing, which is a human ship-walk judgement by design.
