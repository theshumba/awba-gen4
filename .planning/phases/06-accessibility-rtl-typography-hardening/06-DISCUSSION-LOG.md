# Phase 6 Discussion Log — auto mode

**Date:** 2026-07-14 · **Mode:** `--auto` (standing owner directive: fully autonomous chain) · **Single pass, cap honoured**

All gray areas auto-selected; recommended option chosen per question.

## Areas + auto-selected decisions

1. **Keyboard model** — Q: native semantics + DOM-order tab vs custom roving-focus/arrow-key navigation? → Selected: **native semantics, DOM order = journey order, no positive tabindex; arrow-key spatial nav deferred to v2** (simplest correct model; the path is a sequence). → D-62.
2. **Modal focus containment** — Q: per-surface bespoke traps vs one shared engine helper? → Selected: **one shared contained-tab-cycle helper for sheet/popup/Festival, focus-return-to-trigger, Escape closes** (lands 05-REVIEW SG-01 + 04-REVIEW note). → D-63.
3. **Announcement scope** — Q: announce everything vs a calm curated set? → Selected: **one polite role="status" region via AW.announce; verdicts/noor/combo/screen-heads/timeout/chest/stars; never the timer tick (one 10s warning only)** — the app's warm voice, never debug output. → D-64.
4. **Contrast audit method** — Q: token-table-on-paper audit vs computed-style audit of rendered pages? → Selected: **scripted computed-style audit of the real rendered app (headless), token-only fixes, STOP-and-log if a pairing can't pass with existing tokens** (paper audits missed WR-04-class bugs three phases running). → D-65.
5. **Typography/RTL stress** — Q: manual eyeball vs committed executable stress artifact? → Selected: **committed fixture (neutral copy, never scripture) + automated lang/dir/bidi-isolate checks over the REAL pages + headless tofu check** (extends the Phase-1 glyph-gate method). → D-66.
6. **Fix placement** — Q: page-level patches vs engine-level shared seams? → Selected: **narrowest correct seam; shared behaviour in the engine (announce/focus helpers), page-authored markup fixed in place; regression pin per behaviour fix**. → D-67.
7. **Gate shape** — mirrors 04-07/05-06 (prechecks + blocking human checkpoint per standing directive); the new audits become permanent suite members. → D-68.

## Deferred (captured)
SR-specific tuning · arrow-key path nav · forced-colors mode · (owner ledger unchanged).

## Notes
- ACC-03's "amber/green" vocabulary translated to the Athar palette (amber retired) — binding note in 06-CONTEXT `<domain>`.
- Carried-forward items explicitly folded in: path-node aria-labels (STATE todo), SG-01 focus traps, 04-REVIEW aria-live note.
