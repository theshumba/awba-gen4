# Phase 1: Foundation — Design Tokens, Responsive Shell & Fonts - Pattern Map

**Mapped:** 2026-07-12
**Files analyzed:** 8 (1 stylesheet, 1 HTML page, 4 font-family groups, 1 Python script, 1 config file)
**Analogs found:** 2 / 8 (both structural/role analogs from the Gen-3 reference implementation — no in-repo codebase exists yet, this is a greenfield repo)

**Analog source note:** This repo contains only `.planning/` + `CLAUDE.md` — there is no existing Gen-4 code to pattern-match against. Per the orchestrator's brief, analogs are drawn from Josh's Gen-3 MVP (`/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/`), which is the explicit design authority being elevated (not rewritten from scratch). Three Gen-3 files were read in full: `shared/awba-engine.css` (326 lines), `shared/awba-engine.js` (464 lines, targeted reads), `learn.html` (314 lines). Every excerpt below is tagged **KEEP-THE-FEEL** (echo the mechanic, values may be refined) or **REPLACE** (the Gen-3 approach is the exact problem this phase's UI-SPEC decisions were written to kill — cite the UI-SPEC/RESEARCH section that supersedes it).

## File Classification

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|-----------------|----------------|
| `shared/awba-engine.css` | config (design-token stylesheet, `@layer` architecture) | static-asset (request-response) | Gen-3 `shared/awba-engine.css` | **exact** — same file purpose (the one engine stylesheet), internal structure superseded |
| `preview.html` | component (living style-guide / verification page) | request-response (static render, no data fetch) | Gen-3 `learn.html` | **role-match** — HUD/stage/footer shell shape is the structural analog; content is a token showcase, not lesson content |
| `shared/fonts/poppins-{500,600,700,800}.woff2` | config (static font asset, 4 files) | file-I/O (pyftsubset output → static serve) | none — Gen-3 never self-hosts | **no-analog** (net-new capability; anti-pattern being replaced is cited below) |
| `shared/fonts/inter-{400,500,600,700}.woff2` | config (static font asset, 4 files) | file-I/O | none | **no-analog** |
| `shared/fonts/amiri-{400,700}.woff2` | config (static font asset, 2 files) | file-I/O | none | **no-analog** |
| `shared/fonts/amiri-quran-400.woff2` | config (static font asset, 1 file) | file-I/O | none — Gen-3 uses general Amiri for everything, has no Amiri Quran split | **no-analog** (genuinely new in Gen-4, per D-09) |
| `scripts/check-glyph-coverage.py` | utility/test (font glyph-coverage check) | batch (one-shot CLI, run after each subsetting pass) | none — no test scripts exist in Gen-3 or the greenfield repo | **no-analog** (RESEARCH.md supplies the script verbatim — use as-is, don't reinvent) |
| `shared/fonts/.gitignore` (or root `.gitignore` entry for `shared/fonts/src/`) | config | n/a | none | **no-analog**, trivial |

## Pattern Assignments

### `shared/awba-engine.css` (config, design-token stylesheet)

**Analog:** Gen-3 `shared/awba-engine.css` (full 326-line file read)

#### 1. `:root` token block — **REPLACE**
`/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/shared/awba-engine.css` lines 5-18:
```css
:root{
  --bg:#EEF2FB; --card:#F6F9FF; --paper:#FFFFFF; --tint:#E7EEFF; --blob:#C9D7F5;
  --blue:#2E6BF5; --blue2:#2536CE; --blue3:#4E82F7;
  --ink:#232A3D; --ink2:#59607A; --ink3:#98A0B8;
  --line:#DEE5F3; --line2:#C9D3EA;
  --green:#1F9D6B; --green-bg:#E7F6EF; --green-ink:#15774F; --green-line:#A6E0C6;
  --amber:#C68A2E; --amber-bg:#FBEFD6; --amber-ink:#7A5111; --amber-line:#EBD4A6;
  --flame:#F0730B; --flame2:#FFB03A; --gold:#E8A400; --gold2:#FFD34D; --goldDeep:#B47F00;
  --u1:#2E6BF5; --u2:#7C5CE0; --u3:#0FA3A3; --u4:#E8A400;
  --nightA:#241A05; --nightB:#3A2A08;
  --sans:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  --disp:'Poppins',var(--sans);
  --naskh:'Amiri',Georgia,serif;
}
```
**Why REPLACE:** This is a single flat, literal-value `:root` with one shared `--blue`/`--blue2`/`--blue3` triplet that every screen references directly — the exact structural cause of Gen-3's half-themed-page bug (D-05/D-06, ENGINE-CONTRACT §6). Gen-4's `tokens` layer replaces this with: (a) a `data-unit="u1|u2|u3|u4"`-scoped full 7-slot accent scale per unit (`--accent`, `--accent-deep`, `--accent-bright`, `--accent-soft`, `--accent-line`, `--accent-ink`, `--accent-on` — UI-SPEC "Per-Unit Accent Scales" table, exact hex values already locked there), so there is no shared `--blue2` for a screen to accidentally inherit; (b) semantic non-color-literal names (`--accent` not `--blue`) per D-05; (c) `--font-disp`/`--font-body`/`--font-ar`/`--font-quran` replacing `--disp`/`--sans`/`--naskh` (adds the Amiri Quran split, D-09). **Do port forward:** the neutral surface values (`--bg #EEF2FB`, `--card #F6F9FF`, `--paper #FFFFFF`, `--tint #E7EEFF`) and semantic-color values (green/amber/flame/gold) are the *starting values* UI-SPEC already carried over verbatim/refined — those are KEEP-THE-FEEL at the value level, REPLACE at the structural (flat vs. per-unit-scoped) level.

#### 2. Body/`.phone` fixed-card treatment — **REPLACE**
Lines 19-26:
```css
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;height:100%}
body{background:#DCE5F6;font-family:var(--sans);color:var(--ink);
  display:flex;align-items:center;justify-content:center;padding:22px 0}
.phone{width:380px;max-width:96vw;height:788px;max-height:94vh;background:var(--bg);
  border-radius:32px;position:relative;overflow:hidden;
  box-shadow:0 26px 70px rgba(37,54,206,.24),0 2px 0 rgba(255,255,255,.7) inset}
.phone.gold-bg{background:linear-gradient(165deg,var(--nightA),var(--nightB) 60%,#4a3609)}
```
**Why REPLACE:** This is the exact fixed `380×788` phone-card-on-grey-background pattern D-01/D-02/PLT-01 exist to kill (RESEARCH.md Pitfall/Anti-Pattern, UI-SPEC "Responsive Shell Anatomy"). Gen-4's `base` layer replaces it with `.app-shell{min-height:100dvh;display:grid;grid-template-rows:auto 1fr auto}` full-bleed on mobile (no `.phone` wrapper at all — "the app IS the page," D-01), and only at `≥600px` does a centered column appear (`max-width:460–480px`, `border-radius:var(--r-2xl)`, `box-shadow:var(--sh-4)` — RESEARCH.md Pattern 3 gives the exact media-query shape). **Do port forward (KEEP-THE-FEEL, value-refined):** the indigo-tinted shadow recipe itself — `rgba(37,54,206,.24)` → UI-SPEC's `--sh-4: 0 26px 70px rgba(37,54,206,.20)` (alpha softened .24→.20, Claude's Discretion) — and the `0 2px 0 rgba(255,255,255,.7) inset` top-highlight → UI-SPEC's `--sh-inset`. Same DNA, new alpha, new host element (desktop column, not a phone bezel).

#### 3. HUD structure — **KEEP-THE-FEEL** (elevated, re-hosted)
Lines 28-46:
```css
.hud{position:absolute;top:0;left:0;right:0;height:54px;display:flex;align-items:center;
  gap:9px;padding:0 14px;z-index:8;background:linear-gradient(var(--bg),rgba(238,242,251,.4));opacity:0;transition:.25s;pointer-events:none}
.hud.on{opacity:1;pointer-events:auto}
.hud .close{width:26px;height:26px;border:none;background:none;color:var(--ink3);font-size:21px;cursor:pointer;flex:0 0 auto;text-decoration:none;display:flex;align-items:center;justify-content:center}
.segbar{flex:1;display:flex;gap:4px}
.seg{flex:1;height:9px;border-radius:99px;background:#DBE3F5;overflow:hidden;position:relative}
.seg .sf{position:absolute;inset:0;width:0;border-radius:99px;background:var(--blue);transition:width .4s ease}
.hstat{display:flex;align-items:center;gap:4px;font-family:var(--disp);font-weight:700;font-size:14px;flex:0 0 auto}
.hstat.streak{color:var(--flame)} .hstat.noor{color:var(--gold)}
```
**Why KEEP-THE-FEEL:** The *content* shape — close/back control, segmented progress bar, streak stat, noor stat — is exactly what UI-SPEC's Responsive Shell Anatomy names for HUD row 1 ("course/close, progress segments or lamps, streak stat, noor stat"). Elevate the *mechanism*: Gen-3's HUD is `position:absolute` floating over a fixed-height phone card; Phase 1's HUD is `grid-template-rows` row 1 (`auto`, real document flow, `env(safe-area-inset-top)` added on top per UI-SPEC's spacing exceptions). Phase 1 builds the empty HUD *shell region* in `preview.html` with placeholder content (per D-12); the `.hud`/`.segbar`/`.hstat` component classes themselves are Phase 3 (`components` layer is empty in Phase 1) — but the grid-row skeleton and its safe-area padding are Phase 1's job now.

#### 4. Gummy button hard-offset shadow — **KEEP-THE-FEEL** (token only; component build is later)
Lines 182-191:
```css
.btn{width:100%;border:none;border-radius:16px;padding:15px;font-family:var(--disp);font-weight:700;
  font-size:16px;cursor:pointer;background:var(--blue);color:#fff;transition:.12s;box-shadow:0 5px 0 #1E51D6;
  letter-spacing:.02em;text-decoration:none;display:block;text-align:center}
.btn:active{transform:translateY(3px);box-shadow:0 2px 0 #1E51D6}
.btn.gold{background:linear-gradient(160deg,var(--gold2),var(--gold));color:#3a2b00;box-shadow:0 5px 0 var(--goldDeep)}
.btn.disabled{background:#D7E0F3;color:#9DAAC6;box-shadow:0 5px 0 #C4D0EA;cursor:default}
```
**Why KEEP-THE-FEEL, token-only:** This is the signature "gummy 3D button" physics UI-SPEC's Shadows table names explicitly: `0 5px 0 var(--accent-deep)` → `0 2px 0` + `translateY(3px)` on `:active`. Phase 1 does **not** write the `.btn` class (components layer is empty in Phase 1, `.btn`/`.opt`/`.tf`/`.tile` full inventory is Phase 3 MOT-03) — but Phase 1's `tokens` layer MUST define `--accent-deep` per unit (already locked in UI-SPEC's per-unit table) so this mechanic is drop-in ready for Phase 3, and `preview.html`'s motion demo (D-12 item 5, "buttons with the gummy press... labelled with its easing token") DOES need one live example button using these tokens now. **Value correction to apply, not port verbatim:** Gen-3's `.btn.gold` uses ink `#3a2b00` on gold fill (measured 3.92:1, fails at real 16px/700 button size — RESEARCH.md Pitfall 1); UI-SPEC deepens this to `#241A00` (4.89:1, full AA) — use the UI-SPEC value, not the Gen-3 value, for `--accent-on` on u4.

#### 5. Bottom sheet / scrim mechanics — **KEEP-THE-FEEL**, directly usable in `preview.html`
Lines 268-274:
```css
.scrim{position:absolute;inset:0;background:rgba(30,40,80,.42);opacity:0;pointer-events:none;transition:.25s;z-index:24}
.scrim.open{opacity:1;pointer-events:auto}
.sheet{position:absolute;left:0;right:0;bottom:0;background:var(--paper);border-radius:24px 24px 0 0;
  padding:22px 22px 26px;transform:translateY(100%);transition:transform .3s ease;z-index:25;max-height:82%;overflow-y:auto}
.scrim.open .sheet{transform:translateY(0)}
.sheet .grip{width:40px;height:4px;border-radius:9px;background:var(--line2);margin:0 auto 16px}
```
**Why KEEP-THE-FEEL, and directly relevant to Phase 1:** UI-SPEC's `preview.html` contract §5 explicitly requires "a sheet-in [demo], each labelled with its easing token." This exact mechanic (scrim fade + `translateY(100%)→0` sheet slide + grip handle) is the reference shape for that demo — reimplement using Phase 1 tokens: `border-radius:24px 24px 0 0` → `var(--r-xl) var(--r-xl) 0 0`, `transition:transform .3s ease` → `var(--dur-4) var(--ease-gentle)` (UI-SPEC's declared 280ms sheet-in-out duration + the gentle-settle easing curve), shadow via `--sh-3`. Position mechanics (`position:absolute`/`inset:0`) are fine to keep as-is for a demo tile inside `preview.html` (this is a self-contained showcase element, not the app shell itself).

#### 6. Font family variable naming — **REPLACE** (naming convention kept, roles expanded)
Lines 15-17:
```css
--sans:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
--disp:'Poppins',var(--sans);
--naskh:'Amiri',Georgia,serif;
```
**Why REPLACE:** UI-SPEC names the four font-role tokens as `--font-disp:'Poppins'` / `--font-body:'Inter'` / `--font-ar:'Amiri'` / `--font-quran:'Amiri Quran'` — same *idea* (semantic role variables, not raw family names inline), but (a) renamed for clarity/consistency with the `--font-*` prefix, (b) splits Arabic into general (`--font-ar`) vs. verbatim-Quran (`--font-quran`) which Gen-3 never had, (c) drops the generic system fallback chain in favor of UI-SPEC's metric-tuned fallback stacks (D-11) to keep the `font-display:swap` first paint gentle — do not reuse Gen-3's bare `system-ui,-apple-system,...` stack verbatim.

---

### `preview.html` (component, verification page)

**Analog:** Gen-3 `learn.html` (structural/shell analog only — content is entirely different)

#### 1. `<head>` boilerplate — **REPLACE** (font loading + missing meta)
`/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/learn.html` lines 1-7:
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Awba · Learn</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="shared/awba-engine.css">
```
**Why REPLACE:** Two concrete defects to fix, not port: (1) the Google Fonts CDN `<link>` (line 6) — Phase 1's entire font mandate (D-09, zero-CDN) exists to delete this exact line; replace with `<link rel="preload">` for the 2 critical self-hosted faces (RESEARCH.md Step 5) and let `@font-face` in the `tokens` layer handle the rest. (2) the viewport meta (line 4) is missing `viewport-fit=cover` — silently zeroes every `env(safe-area-inset-*)` on notched devices (RESEARCH.md Pitfall 2, UI-SPEC binding requirement); add it: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`. **Do keep exactly (KEEP-THE-FEEL):** the single `<link rel="stylesheet" href="shared/awba-engine.css">` line (line 7) — one CSS file, one link, per page, unchanged pattern (D-04) — reuse this exact line in `preview.html` and every future page.

#### 2. Shell region nesting (HUD / body / tabs / scrim-sheet) — **KEEP-THE-FEEL**, re-hosted in grid
Lines 104-115:
```html
<div class="phone">
  <div class="lhud">...</div>
  <div class="lbody" id="lbody"></div>
  <div class="tabs" id="tabs"></div>
  <div class="scrim" id="scrim"><div class="sheet" id="sheet"></div></div>
</div>
```
**Why KEEP-THE-FEEL:** This confirms the three-region shape (top chrome / scrolling middle / bottom chrome, with an overlaid scrim+sheet) that UI-SPEC's Responsive Shell Anatomy formalizes as `.app-shell` grid rows `auto 1fr auto` (HUD / stage / footer). `preview.html`'s shell skeleton (D-12 item 6) should mirror this three-region idea but as real grid rows inside `.app-shell`, not `position:absolute` children of a fixed-size `.phone` div — and it needs no scrim/sheet overlay div at the top level (that's shown as an isolated demo tile per item 5 above, not live shell chrome, since Phase 1 has no engine logic to open it).

---

### `shared/fonts/*.woff2` (config, static font assets — 4 family groups, 11 files)

**Analog:** none in Gen-3 (Gen-3 always CDN-loads; never self-hosts). The Gen-3 equivalent is the exact anti-pattern being eliminated:
`learn.html` line 6:
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet">
```
**REPLACE, in full — do not port any part of this line into Gen-4.** The weight *set* it requests (Poppins 500/600/700/800, Inter 400/500/600/700, Amiri 400/700) is the one thing worth keeping (KEEP-THE-FEEL at the weight-discipline level — UI-SPEC's weight table matches it, plus adds Amiri Quran 400 as a new fifth family). Because there is no in-repo acquisition/subsetting code to pattern-match against, use RESEARCH.md's **verified, session-tested** commands verbatim rather than improvising:
- Acquisition + subsetting commands: RESEARCH.md "Font Subset Pipeline" Step 4 (exact `curl`/`python3 -m fontTools.subset` invocations, already run and confirmed working this session — `fontTools 4.60.2` present locally).
- Verified codepoint ranges: `LATIN_RANGE="U+0000-00FF,U+0100-017F,U+1E00-1EFF,U+02B0-02FF,U+2000-206F"` (Poppins/Inter) and `ARABIC_RANGE="U+0600-06FF,U+FDFA"` (Amiri/Amiri Quran) — these are byte-scan-verified against Josh's 19 real content files, not the generic illustrative range in CLAUDE.md's stack notes.
- Critical constraint: never pass a custom `--layout-features` list when subsetting Amiri/Amiri Quran (breaks Arabic letter-joining/diacritic positioning silently — RESEARCH.md Step 4 explanation + Anti-Patterns).

---

### `scripts/check-glyph-coverage.py` (utility/test)

**Analog:** none — no test scripts exist anywhere in Gen-3 or this greenfield repo.

**Source to use verbatim** (RESEARCH.md "Code Examples" section, already written and ready):
```python
from fontTools.ttLib import TTFont
import sys

REQUIRED = {
    'shared/fonts/inter-400.woff2':        [0x02F9, 0x02FA, 0x02BF, 0x02BE, 0x0101, 0x012B, 0x016B, 0x1E25, 0x1E63, 0x1E6D, 0x1E0F, 0x00B7, 0x2014, 0x2019],
    'shared/fonts/poppins-600.woff2':      [0x02F9, 0x02FA, 0x0101, 0x1E25, 0x00B7, 0x2014],
    'shared/fonts/amiri-400.woff2':        [0x0621, 0x0640, 0x064E, 0x0652, 0xFDFA],
    'shared/fonts/amiri-quran-400.woff2':  [0x0621, 0x0670, 0x0671, 0x06DD, 0x06DE, 0xFDFA],
}

failed = False
for path, codepoints in REQUIRED.items():
    font = TTFont(path)
    cmap = font.getBestCmap()
    for cp in codepoints:
        if cp not in cmap:
            print(f"MISSING U+{cp:04X} in {path}")
            failed = True
sys.exit(1 if failed else 0)
```
No REPLACE/KEEP-THE-FEEL tagging applies here — this is new tooling with no prior version to diverge from. Run as `python3 scripts/check-glyph-coverage.py` after every subsetting pass (RESEARCH.md Validation Architecture).

---

## Shared Patterns

### Indigo-tinted shadows (never grey/black)
**Source:** Gen-3 `awba-engine.css` line 25 (`.phone` box-shadow, `rgba(37,54,206,.24)`)
**Superseded value:** UI-SPEC `--sh-1` … `--sh-4`, `--sh-inset` (Shadows table) — same `rgba(37,54,206,α)` DNA, alphas refined
**Apply to:** every shadow declared in `shared/awba-engine.css`'s `tokens` layer; every shadow demo tile in `preview.html` item 4
```css
/* KEEP-THE-FEEL — tint family, not the literal alpha */
box-shadow: 0 26px 70px rgba(37,54,206,.20);      /* --sh-4, was .24 in Gen-3 */
box-shadow: 0 2px 0 rgba(255,255,255,.7) inset;   /* --sh-inset, unchanged */
```

### Gummy hard-offset button/press physics (token only — component ships Phase 3)
**Source:** Gen-3 `awba-engine.css` lines 182-185 (`.btn`, `.btn:active`)
**Apply to:** `--accent-deep` per-unit token (already locked in UI-SPEC's per-unit table) must exist in Phase 1's `tokens` layer so Phase 3's `.btn`/`.opt`/`.tf`/`.tile` can consume `box-shadow:0 5px 0 var(--accent-deep)` → `0 2px 0` + `translateY(3px)` on `:active` without inventing new tokens. `preview.html`'s motion demo (item 5) needs one live button example now.

### Semantic accent tokens replace hardcoded `--blue` (closes the half-theming bug)
**Source (anti-pattern to structurally prevent):** Gen-3 `awba-engine.css` `:root` (lines 5-18, single shared `--blue`/`--blue2`/`--blue3`) **and** Gen-3 `shared/awba-engine.js` line 123:
```js
if(cfg.unitColor) document.documentElement.style.setProperty('--blue',cfg.unitColor);
```
This is the exact runtime mechanism that produces Gen-3's "half-themed page" bug — it overwrites one custom property (`--blue`) while every other blue-family value (`--blue2`, `--blue3`, `--tint`, etc.) stays hardcoded, so only *some* UI elements recolor per unit. **Phase 1 does not write this JS** (Phase 2+ engine territory, D-07) — but Phase 1's `tokens` layer must expose the full `[data-unit="u1|u2|u3|u4"] { --accent:...; --accent-deep:...; ... }` scale (UI-SPEC's per-unit table, values already locked) so that when Phase 2 writes its engine code, there is no `--blue`-shaped single-property escape hatch left to fall into. Flag this explicitly for the planner: the *reason* Phase 1's token architecture is shaped the way it is, is to make this specific Gen-3 bug structurally impossible.

### One CSS file, one `<link>`, every page
**Source:** Gen-3 `learn.html` line 7
```html
<link rel="stylesheet" href="shared/awba-engine.css">
```
**Apply to:** `preview.html` (Phase 1) and every later page — reuse this exact line unchanged (D-04). Combine with the corrected `<meta viewport-fit=cover>` (see `preview.html` pattern #1 above) and the two `<link rel="preload">` font tags (RESEARCH.md Step 5) as the shared `<head>` boilerplate every page must repeat identically (D-11's cache-dedup requirement depends on byte-identical font URLs across pages).

### Bottom-sheet scrim/slide mechanic
**Source:** Gen-3 `awba-engine.css` lines 268-274 (`.scrim`, `.sheet`, `.grip`)
**Apply to:** `preview.html`'s motion demo section (D-12 item 5) — the one place in Phase 1 that needs this mechanic live, using `--r-xl`, `--sh-3`, `--dur-4`, `--ease-gentle` instead of Gen-3's literal values.

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `shared/fonts/poppins-{500,600,700,800}.woff2` | config | file-I/O | Gen-3 never self-hosts fonts (CDN `<link>` only) — net-new; use RESEARCH.md's verified `pyftsubset` commands (Font Subset Pipeline Step 4), not an in-repo precedent |
| `shared/fonts/inter-{400,500,600,700}.woff2` | config | file-I/O | Same as above |
| `shared/fonts/amiri-{400,700}.woff2` | config | file-I/O | Same as above |
| `shared/fonts/amiri-quran-400.woff2` | config | file-I/O | Genuinely new family in Gen-4 — Gen-3 uses general Amiri for both hadith and Quran text (see RESEARCH.md Pitfall 4); no analog exists even conceptually |
| `scripts/check-glyph-coverage.py` | utility/test | batch | No test tooling exists anywhere in Gen-3 or the greenfield repo; RESEARCH.md supplies the exact script to use, verbatim |
| `shared/fonts/.gitignore` (or root `.gitignore` `shared/fonts/src/` entry) | config | n/a | Trivial, no precedent needed — `shared/fonts/src/` (raw downloaded TTFs) must be gitignored per RESEARCH.md's Recommended Project Structure |

## Metadata

**Analog search scope:** Gen-3 reference implementation only (`/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/shared/awba-engine.css`, `shared/awba-engine.js`, `learn.html`) — this repo (`awba-gen4`) has no source code yet besides `.planning/` and `CLAUDE.md`.
**Files scanned:** 3 Gen-3 files read in full or via targeted greps (326 + 464 + 314 lines); cross-referenced against `01-CONTEXT.md`, `01-RESEARCH.md`, `01-UI-SPEC.md` for the exact superseding values/decisions cited above.
**Pattern extraction date:** 2026-07-12
