# Phase 3: Components, Icon Kit & Motion Language - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-12
**Phase:** 3-components-icon-kit-motion-language
**Areas discussed:** Icon registry architecture, Gold-lantern variant, Sheet system, Press-physics inventory, Reduced-motion mechanics, Demo vehicle & gate
**Mode:** `--auto` — recommended option selected for every question, no interactive prompts.

---

## Icon registry architecture

| Option | Description | Selected |
|--------|-------------|----------|
| KIT section in the one engine file: multi-line template literal per icon from the canonical 20-SVG folder, svgo'd once, committed | Zero runtime fetch, offline/classic-script safe, supersedes Gen-3's 12-icon embed + learn.html duplicates | ✓ |
| External `<symbol>` sprite + `<use>` | Rejected by ARCHITECTURE.md (currentColor plumbing refactor, cross-file dependency) | |

[auto] Q: "Accessor shape?" → Selected: "AW.icon(name,{size,label}) injecting aria-hidden/focusable=false by default; label path emits role=img" (recommended)

## Gold lantern variant

| Option | Description | Selected |
|--------|-------------|----------|
| Authored `lantern-gold` SVG committed (hand-recolored to gold scale) | FND-04's literal requirement; night-register safe | ✓ |
| Port AW.recolor() regex substitution | Explicitly banned by FND-04 ("not a regex recolor") | |

## Sheet system

| Option | Description | Selected |
|--------|-------------|----------|
| One AW.sheet primitive; citation + gloss sheets built on it; Phase-5 sheets reuse | Single implementation (LRN-06 requires it later anyway); singleton + scrim-tap close | ✓ |
| Separate cite-sheet and gloss-sheet implementations | Duplicates Gen-3's copy-paste sheet HTML bug class | |

[auto] Q: "Demo content?" → Selected: "One ref + one term ported VERBATIM from Josh's u1-m1.html — scripture never authored" (recommended)

## Press physics & motion vocabulary

| Option | Description | Selected |
|--------|-------------|----------|
| One shared gummy-press pattern over the full tappable inventory; motion layer consumes ONLY Phase-1 tokens; one WAAPI exemplar; hand-rolled AW.confetti | MOT-01/03 as written; Phase 4 copies patterns, never invents | ✓ |
| Per-component bespoke transitions | The exact fragmentation Gen-4 exists to kill | |

## Reduced motion (MOT-04)

| Option | Description | Selected |
|--------|-------------|----------|
| Shared rule bodies for `@media (prefers-reduced-motion)` + `[data-motion=reduce]`; confetti no-op checks both at call time; state transitions shorten, ambient loops stop | Binds the Phase-2 prefs stamp; one mechanism, two triggers | ✓ |
| Handle only the OS media query | Drops FND-06's user override half | |

## Demo vehicle & phase gate

| Option | Description | Selected |
|--------|-------------|----------|
| Extend preview.html (icon grid, sheet demos, press inventory, motion demos) + human visual gate with automated prechecks | One living style reference; matches Phase-1 D-12 gate pattern | ✓ |
| New components.html | Splits the style reference in two | |

## Claude's Discretion

- svgo settings, KIT formatting, sheet markup, non-scripture demo copy, WAAPI exemplar choice, preview section layout.

## Deferred Ideas

- V2-02 companion reactions, V2-06 gold shimmer, V2-04 shared-element morphs (v2)
- Per-citation verified state (scholar-gate workflow)
