# Architecture Research

**Domain:** Zero-build, multi-page, vanilla-JS gamified micro-learning PWA (Duolingo-style course engine)
**Researched:** 2026-07-11
**Confidence:** HIGH (derived directly from reading the reference implementation source — `_MVP-BUILD/learn.html`, `shared/awba-engine.js` (464 lines), `shared/awba-engine.css` (326 lines), `lessons/u1-m1.html`, `reviews/u1-review.html` — cross-checked against current web-platform facts for the PWA/CSS-layer/module-loading decisions)

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│  SCREEN INSTANCES (multi-page, zero build — one .html file per screen)   │
│                                                                            │
│  index.html          lessons/u1-m1.html …    reviews/u1-review.html …    │
│  (tiny cfg,           (tiny cfg, JOSH'S        (tiny cfg, JOSH'S          │
│   AwbaLearn(cfg))      CONTENT, unchanged,      CONTENT, unchanged,       │
│                        AwbaLesson(cfg))         AwbaReview(cfg))          │
└───────────┬───────────────────┬──────────────────────┬───────────────────┘
            │                   │                       │
            ▼                   ▼                       ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  shared/awba-learn.js     shared/awba-engine.js  (THE contract surface)  │
│  (AwbaLearn — new,        ┌────────────────────────────────────────┐    │
│   only loaded by           │ SCREEN RUNNERS   AwbaLesson() AwbaReview()│  │
│   index.html)               ├────────────────────────────────────────┤  │
│                             │ COMPONENTS  skeleton/sheets/cite/wire/  │  │
│                             │             confetti/markerHtml/btn/foot│  │
│                             ├────────────────────────────────────────┤  │
│                             │ KIT/ASSETS  AW.KIT icons, AW.recolor()  │  │
│                             ├────────────────────────────────────────┤  │
│                             │ STATE       AW.S get/set, AW.state(),  │  │
│                             │             AW.touchDay(), migration,  │  │
│                             │             AW.deriveNodeState()       │  │
│                             └────────────────────────────────────────┘  │
└───────────────────────────────────┬──────────────────────────────────────┘
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  shared/awba-engine.css  — ONE design-system file, native @layer stack:  │
│  @layer tokens, base, components, motion, screens;                       │
└───────────────────────────────────┬──────────────────────────────────────┘
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  PERSISTENCE — localStorage['awba_state'] (single versioned JSON blob)   │
│  { schemaVersion, noor, returns, lastDay, days[], stars{}, chests{} }    │
└──────────────────────────────────────────────────────────────────────────┘
                                     ▲
┌──────────────────────────────────────────────────────────────────────────┐
│  PWA SHELL (layered on top, built last) — manifest.webmanifest, sw.js at │
│  repo root, icons/*.png — network-first HTML, cache-first shared assets  │
└──────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Boundary rule |
|-----------|-----------------|----------------|
| Lesson/review data files (`lessons/*.html`, `reviews/*.html`) | Pure content: a JS object literal (`cfg`) passed to `AwbaLesson`/`AwbaReview`. Zero logic, zero styling. This is Josh's asset. | Never contains rendering code, only calls the global runner function. |
| `index.html` (Learn/path screen) | Course structure data (`UNITS`/`DAILY` shape) + one call to `AwbaLearn(cfg)`. Same "tiny data file" contract extended to the shell page. | Never contains node-state logic or path-rendering markup inline. |
| `shared/awba-learn.js` (new) | Screen renderer for the Learn path: HUD, streak band, daily ayah, unit cards, zig-zag node path, popups, course switcher, tab bar. | Reads state via `AW.state()`/`AW.deriveNodeState()` only — never touches `localStorage` directly. |
| `shared/awba-engine.js` — Screen Runners | `AwbaLesson(cfg)` and `AwbaReview(cfg)`: own the full lesson/review step machine (opener → beats → verdict → reward choreography → done). | Only entry points lesson/review files are allowed to call. Signature is the contract (see below). |
| `shared/awba-engine.js` — Components | Shared chrome + widgets: phone skeleton, HUD, bottom sheets (citation/gloss), citation chip wiring (`AW.wire`), confetti, marker badges, button/foot builders. | Pure functions/DOM builders; no direct `localStorage` access; take data in, return/inject markup. |
| `shared/awba-engine.js` — Kit/Assets | `AW.KIT` (12 inline-SVG brand illustrations), small icon glyphs (flame, spark, check, star…), `AW.recolor()`. | Data + one helper; never contains behavior. |
| `shared/awba-engine.js` — State | `AW.S.get/set` (storage engine + migration hidden behind this interface), `AW.state()`, `AW.touchDay()`, `AW.greetMode()`, `AW.weekCal()`, `AW.deriveNodeState()`. | **Only** module allowed to read/write `localStorage`. Everything else goes through `AW.S`/`AW.state()`. |
| `shared/awba-engine.css` | Every visual rule for every screen, organized in native cascade layers. | No page ships its own `<style>` block; page-specific CSS lives in the `screens` layer of this one file. |
| `sw.js` (root) | Precache app shell, runtime-cache lesson/review pages, serve offline fallback. | Registered defensively (`if ('serviceWorker' in navigator && location.protocol.startsWith('http'))`) so it never errors when a file is opened via `file://` for review. |

## Recommended Project Structure

```
awba-gen4/
├── index.html                     # Learn/path screen — new canonical entry point
├── manifest.webmanifest
├── sw.js                          # service worker — MUST live at repo root (its scope
│                                   #   is its own directory + below; shared/sw.js could
│                                   #   never control lessons/ or reviews/)
├── offline.html                   # tiny branded fallback SW serves on failed navigation
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-512-maskable.png
│   ├── apple-touch-icon.png
│   └── favicon.svg
├── fonts/                         # self-hosted Poppins/Inter/Amiri .woff2
│   └── *.woff2
├── shared/
│   ├── awba-engine.css            # ONE design-system file (see @layer stack below)
│   ├── awba-engine.js             # ONE engine file — the protected contract surface
│   └── awba-learn.js              # NEW — AwbaLearn(cfg), only loaded by index.html
├── lessons/
│   ├── u1-m1.html … u4-m3.html    # Josh's 15 files — ported verbatim, cfg untouched
├── reviews/
│   ├── u1-review.html … u4-review.html   # Josh's 4 files — ported verbatim
```

### Structure Rationale

- **Two shared JS files, not five.** The milestone brief asks for a layered module design (tokens / components / screens / motion / state). Because this is a zero-build multi-page site, every extra `<script src>` tag would have to be added to all 19 of Josh's existing lesson/review files to keep load order correct — that is a structural edit to files the constraint says must port with **zero content edits**. The fix: realize the five conceptual layers as clearly banner-commented *sections inside one file* (state → kit → components → lesson runner → review runner), not as five physical files. `awba-engine.js` keeps the exact same `<script src="../shared/awba-engine.js">` tag Josh's files already have — nothing in `lessons/` or `reviews/` needs to change. The one exception is `awba-learn.js`: it is genuinely new code with no legacy file depending on it (Josh's data files never load it), so splitting it out costs nothing and gives the Learn page the same "tiny data + shared renderer" shape as lessons — a real quality win, not a compatibility risk.
- **One CSS file with native cascade layers, not five files.** `@layer` has 96%+ global support in 2026 (Chrome 99+, Firefox 97+, Safari 15.4+) and gives exactly the tokens/base/components/motion/screens separation the brief asks for, inside the single file the fixed constraint requires. Layer order in the `@layer` statement controls precedence regardless of source order within the file, so `screens` can safely override `components` even though both live in the same file.
- **`shared/` holds nothing page-specific.** Anything unique to one screen (the Learn page's HUD/path CSS, currently an inline `<style>` block in `learn.html`) moves into the `screens` layer of the one CSS file, so there is exactly one place to open to review *all* visual design — not one file plus n inline `<style>` blocks scattered across pages.
- **`sw.js` at root, not in `shared/`.** A service worker's default scope is its own directory and everything below it. Placed in `shared/`, it could only ever control `shared/` — never `lessons/`, `reviews/`, or `index.html`. It must live at the repo root to protect the whole site.
- **Fonts self-hosted, not Google Fonts CDN.** The reference pulls Poppins/Inter/Amiri from `fonts.googleapis.com` on every page. That is a third-party network dependency that breaks true offline-first behavior and adds a render-blocking cross-origin request on every screen. Self-hosting under `fonts/` and referencing via `@font-face` in the one CSS file removes the dependency entirely and lets the service worker precache fonts like any other asset.

## Backward-Compatible Engine Contract (Non-Negotiable)

This is the exact public surface `lessons/*.html` and `reviews/*.html` depend on today. Gen-4 may restructure everything *behind* this surface; it must never change the surface itself.

| Contract element | Must stay exactly as-is |
|---|---|
| `function AwbaLesson(cfg)` | Global function name, called as `AwbaLesson({...})` from an inline `<script>` in each lesson file. `cfg` shape: `{id, unitColor, icon?, journey, opener:{h2,p,thought,thoughtLabel?}, terms:{}, refs:{}, beats:[...], grew, recap:[...], doneTitle?, doneLine?, next:{href,label}}`. |
| `function AwbaReview(cfg)` | Global function name. `cfg` shape: `{id, title, sub, mastery, items:[{q,quote?,o,c,t} \| {tf:true,q,c,t}], next:{href,label}}`. |
| Beat type vocabulary in `cfg.beats[]` | `read`, `frame`, `verse`, `panel`, `depth`, `reflect`, `mc`, `tf`, `tile` — each keeps its exact field names (`kicker`, `title`, `html`, `marker`; `lead`; `ar/tr/label`; `items[]` with `n/name/tell/tag/body`; `point/lenses{reality,revelation,ruling}`; `prompt/model`; `q/o/c/good/gentle`; `q/c/good/gentle` for `tf`; `prompt/bank/solution` for `tile`). |
| `AW.cite(id, label)` | Lesson content calls this **inline, as a JS expression concatenated into `cfg` strings** (e.g. `'...'+AW.cite('hujurat-49-15','al-Ḥujurāt 49:15')+'...'` inside `u1-m1.html`). It must exist on `window.AW` and return the same `<span class="cite" data-ref="...">` markup before any lesson script executes — i.e. `awba-engine.js` must define it synchronously at parse time, not inside a `DOMContentLoaded` handler. |
| `data-ref` / `data-term` wiring | `AW.wire(root, cfg)` must keep resolving `.cite[data-ref]` against `cfg.refs` and `.term[data-term]` against `cfg.terms` exactly as today, since lesson HTML embeds these attributes directly. |
| Script/link boilerplate | `<link rel="stylesheet" href="../shared/awba-engine.css">` + `<script src="../shared/awba-engine.js"></script>` — the two-line head Josh's files already carry. No new `<script>` tag may be required in any of the 19 existing files. |
| `AW.S.get(key, default)` / `AW.S.set(key, value)` | External call shape stays a generic key/value pair. Internals may change (see Persistent State Layer below) — callers never notice. |

**Why not ES modules (`<script type="module">`):** Chrome and Firefox block module script loading over `file://` with a CORS-style error ("Cross origin requests are only supported for protocol schemes: http, data, chrome…"), because local files are treated as opaque origins (a fix for CVE-2019-11730). Josh's explicit workflow is opening files directly to review — any move to ES modules would break that on the spot. Classic `<script src>` tags plus a single `window.AW` global namespace (already the reference's pattern) is the only loading strategy compatible with file-based review, and it is kept unchanged in Gen-4.

## Persistent State Layer: Schema & Versioning

**Reference schema today** (discrete top-level keys, each independently JSON-stringified, prefixed `awba_`): `awba_noor` (number), `awba_returns` (number), `awba_stars` (`{[nodeId]: 1|2|3}`), `awba_days` (array of `Date.toDateString()` strings, capped last 90), `awba_lastDay` (string|null), `awba_chest_<id>` (boolean, one key per chest). No version field exists — Gen-3 has nothing to migrate *from*, but Gen-4 must not repeat that gap.

**Gen-4 schema v1** — consolidate into a single versioned JSON object so it can be migrated, exported, and reasoned about atomically:

```js
// localStorage['awba_state']
{
  schemaVersion: 1,
  noor: 0,
  returns: 0,
  lastDay: null,        // "YYYY-MM-DD" local date string (not toDateString() —
                         // stable format, easier to diff/debug/export)
  days: [],              // capped last 90, same semantics as today
  stars: {},              // { [nodeId]: 0|1|2|3 }
  chests: {}              // { [chestId]: true }  — replaces awba_chest_<id> keys
}
```

**Migration is hidden entirely inside `AW.S`** — no caller (lesson/review runner, Learn page) ever touches `localStorage` directly, so this can change again in a future schema bump without touching any screen code:

1. On first read, `AW.S` checks for `awba_state`. If present with `schemaVersion === CURRENT`, use as-is.
2. If present with an older `schemaVersion`, run a sequential chain of migration functions (`migrations[1] = s0 => ({...s0, ...})`) up to current.
3. If absent but legacy discrete keys (`awba_noor`, `awba_returns`, …) exist from an earlier Gen-4 dev build, construct a v1 object from them and write it once.
4. If nothing exists, initialize the default v1 object above.

`AW.S.get(key, default)` / `AW.S.set(key, value)` keep reading/writing against the in-memory parsed blob and persisting the whole blob on every `set` — the external call shape lesson/review code already uses is untouched.

**Session vs. persistent state — explicit, deliberate split.** In-flight lesson state (`pos`, `stepIndex`, `combo`, `mistakes`, `noorEarned`, …) lives only in the closure variables inside `AwbaLesson`/`AwbaReview` and is never written to `localStorage`. Leaving mid-lesson simply restarts that lesson on return. This is a feature of the mercy/simplicity design (no penalty, no resume-engineering needed), not a gap — call it out explicitly so it doesn't get "fixed" into unwanted complexity later.

## Data Flow

### Render Flow (per screen load)

```
HTML file loads → <link> CSS (@layer stack applies) → <script src="shared/awba-engine.js">
   (defines window.AW: state, kit, components, AwbaLesson, AwbaReview — synchronously)
→ [awba-learn.js, index.html only] → inline <script> calls Awba*(cfg)
→ runner reads AW.state() once → renders opener/first screen → user interacts
→ each answer/step: runner mutates local session vars → calls AW.S.set(...) for
  persistent effects (noor, stars) → re-renders next step from cfg
→ terminal screen (verdict → noor claim → returns → done) → AW.S.set() persists →
  "Back to the path" link → index.html reloads → AwbaLearn(cfg) recomputes node
  state from the now-updated localStorage blob
```

### Learn Page Node-State Derivation

`AW.deriveNodeState(unit_nodes_flat, progress)` — a pure function, promoted into the state layer so it is reusable and independently testable (open the console, call it with a fixture, no DOM needed):

1. Flatten `UNITS → nodes` into a single ordered array (chest nodes included).
2. For a **chest** node: `available` once the immediately preceding node has a `stars` entry and the chest hasn't been opened yet (`chests[id]` false/absent); `done` once opened.
3. For a **lesson/review** node: `done` if `stars[id]` exists; else `active` if every prior non-chest node in sequence is done; else `locked`.
4. The Learn page renderer calls `AW.state()` **once per full render pass** and threads the returned `stars`/`chests` down through the loop — the reference implementation calls `AW.state()` again inside the per-node loop (`AW.state().stars[nd.id]`), causing a redundant `localStorage.getItem` + `JSON.parse` per node on every render. Gen-4 fixes this by computing state once and passing it down; flag this explicitly as a pitfall to avoid re-introducing.

### Key Data Flows

1. **Content → Runner:** lesson/review `cfg` object (Josh's content, verbatim) is the only input `AwbaLesson`/`AwbaReview` ever receive — no network fetch, no build-time injection. This is why scripture/citations are embedded directly in `cfg.refs`/`cfg.terms` rather than fetched at runtime from an external Quran API: it keeps every lesson correct offline-by-default and removes a licensing/availability dependency at render time (the `quranapi.pages.dev` licensing flag noted in PROJECT.md only affects *how the text was originally sourced into the data files*, not runtime behavior — preserve this "content is data, not a live fetch" pattern).
2. **Runner → State:** correct answers/reflections call `AW.S.set('noor', …)`; lesson/review completion calls `AW.S.set('stars', …)`; first activity of a calendar day calls `AW.touchDay()` which bumps `returns` and appends to `days`. All persistent writes funnel through `AW.S`.
3. **State → Learn Path:** `index.html` → `AwbaLearn(cfg)` → `AW.state()` + `AW.deriveNodeState()` → path markup (locked/available/active/done nodes, star counts, HUD streak/noor counters).
4. **State → HUD (every lesson/review screen):** each runner reads `AW.state()` at render time to paint the streak flame and noor spark in its own HUD — the only cross-screen "shared UI" that reflects persisted state live during a session.

## Scaling Considerations

This app has no multi-user traffic-scaling dimension (device-local `localStorage`, static hosting). The dimension that actually matters for architecture is **content scale** — how many courses/units/lessons the same engine must carry — because the roadmap already anticipates Fiqh/Seerah/Qur'an courses as future (currently stubbed "coming soon") entries in the course switcher.

| Scale | Architecture implication |
|-------|---------------------------|
| Today: 1 course, 4 units, 15 lessons + 4 reviews | Exactly what's described above; `index.html`'s `cfg` can stay a flat `{units:[...]}` shape if desired. |
| Near-term (same milestone): same content, elevated execution | No structural change — this is the target this document designs for. |
| Future: 2nd/3rd/4th course goes live | Design `index.html`'s cfg shape now as `{courses:[{id,title,units:[...]}], activeCourse}` rather than a flat `units` array, even though only one course is populated — this is a data-shape decision, not new logic, so it costs nothing today and avoids a rewrite of `awba-learn.js` later when Fiqh/Seerah ship. Do **not** build the course-switching logic itself yet (YAGNI) — only the shape. |
| Far future: accounts/sync (explicitly out of scope) | `AW.S.get/set` already hides storage implementation behind a stable interface; a future Supabase-backed adapter could sit behind the same two functions without touching any screen code. Do not build this now — the awba-app Next.js repo is the reserved home for it. |

## Anti-Patterns

### Anti-Pattern 1: ES modules for a file://-reviewed site
**What people do:** Reach for `<script type="module">` + `import`/`export` to get "real" module boundaries.
**Why it's wrong:** Chrome/Firefox block module script loading over `file://` (opaque-origin CORS restriction, CVE-2019-11730 fix) — Josh's file-open review workflow breaks immediately, and it only surfaces when someone tries to open the file locally rather than via a dev server.
**Instead:** Classic `<script src>` tags + one `window.AW` global namespace, exactly as the reference already does.

### Anti-Pattern 2: Splitting the engine into many files "for cleanliness"
**What people do:** Break `awba-engine.js` into 5+ files matching the 5 conceptual layers 1:1.
**Why it's wrong:** Every lesson/review file's `<script src>` list must then be kept in the correct dependency order across 19 files — the exact "content edit" the fixed constraint forbids, and a real source of load-order bugs (e.g. a lesson file missing the new `awba-state.js` tag silently breaks `AW.S`).
**Instead:** One file, five clearly banner-commented sections, one dependency-free namespace object. Only split out code with zero legacy callers (`awba-learn.js`).

### Anti-Pattern 3: Re-reading `localStorage` inside render loops
**What people do:** Call `AW.state()` (or raw `localStorage.getItem`) once per node/item inside a `forEach`, as the reference's Learn-page renderer does today (`AW.state().stars[nd.id]` inside the per-node loop, despite already having called `AW.state()` once at the top of `render()`).
**Why it's wrong:** Each call does a `localStorage.getItem` + `JSON.parse`; harmless at 20 nodes, a real cost once the node graph grows across multiple courses.
**Instead:** Compute state once per render pass, thread it down as a parameter.

### Anti-Pattern 4: Third-party runtime dependencies for offline-first content
**What people do:** Load fonts from `fonts.googleapis.com` (as the reference does today) or fetch scripture text from an external API at render time.
**Why it's wrong:** Both break true offline behavior and add cross-origin requests the service worker can't reliably guarantee availability of; the Quran-API route also carries the licensing exposure already flagged in PROJECT.md.
**Instead:** Self-host font files under `fonts/` with `@font-face`; keep scripture embedded verbatim in `cfg.refs`/`cfg.terms` (already the pattern — preserve it, don't regress toward a live fetch).

### Anti-Pattern 5: Precaching every lesson/review page in the service worker
**What people do:** Precache the entire site (all 19 content pages) on install "to be safe."
**Why it's wrong:** Content changes frequently during scholar review/iteration; an aggressive precache means Josh can be looking at stale content while online and not realize it, and install/activate takes longer as content scale grows.
**Instead:** Precache only the true app shell (`index.html`, `manifest.webmanifest`, `shared/*`, `icons/*`, `fonts/*`); use network-first-with-cache-fallback for lesson/review page navigations so online users always get the latest content and offline users still get the last-visited version.

### Anti-Pattern 6: Ignoring `prefers-reduced-motion`
**What people do:** Ship the companion bob/glow keyframes and confetti unconditionally (the current reference has no reduced-motion guard at all).
**Why it's wrong:** PROJECT.md explicitly requires an accessibility pass; unconditional looping animations are a known vestibular-disorder trigger and a common a11y audit failure.
**Instead:** Wrap non-essential looping keyframes (`bob`, `glow`, `glowg`) in `@media (prefers-reduced-motion: no-preference)`; keep state-communicating transitions (button press, sheet slide-up) but shorten/disable them under `reduce`.

## Integration Points

### External Services

| Service | Integration pattern | Notes |
|---------|---------------------|-------|
| GitHub Pages / Vercel (static hosting) | Push repo, zero build step, files served as-is. | `sw.js` must be at the served root for full-site scope; Vercel/GH Pages both serve `manifest.webmanifest` with correct MIME by default. |
| Google Fonts (Poppins/Inter/Amiri) | **Replace** with self-hosted `.woff2` under `fonts/`, referenced via `@font-face` in the one CSS file. | Reference currently loads these from `fonts.googleapis.com` on every page — removes a render-blocking third-party request and an offline gap. |
| Quran text source (`quranapi.pages.dev`, licensing flag in PROJECT.md) | Not a runtime integration at all — text is embedded verbatim in lesson `cfg.refs` at authoring time. | Keep it that way; do not introduce a live-fetch integration for v1. The licensing question is an owner-level decision about *how content was sourced*, not a build-blocking runtime dependency. |
| Supabase / accounts (explicitly out of scope) | None in Gen-4. | `AW.S.get/set` is the seam where a future backend adapter could attach without touching screen code — mentioned only so nobody accidentally forecloses it, not something to build now. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Lesson/review data file ↔ `awba-engine.js` runners | One-shot function call: `AwbaLesson(cfg)` / `AwbaReview(cfg)`. | This *is* the protected contract — see dedicated section above. |
| Runners/Learn page ↔ State layer | `AW.S.get/set`, `AW.state()`, `AW.touchDay()`, `AW.deriveNodeState()` — never raw `localStorage`. | Only `AW.S`'s internals know about the `awba_state` key or schema version. |
| Any screen ↔ Components layer | Direct function calls (`AW.wire`, `AW.sheetRef`, `AW.confetti`, `AW.markerHtml`, `AW.ill`) — all synchronous, all DOM-string based, no events/pub-sub needed at this scale. | Keep it this simple; a pub/sub or event-bus layer would be over-engineering for a single-user, single-tab, page-reload-per-screen app. |
| `awba-learn.js` ↔ `awba-engine.js` | Load-order dependency only (`awba-engine.js` must load first so `window.AW` exists) — no formal API beyond the shared global namespace. | Document the required `<script>` order at the top of `awba-learn.js` in a comment. |

## Suggested Build Order

1. **Design tokens** (`@layer tokens` in the one CSS file — colors incl. `--u1..--u4` unit palette, type scale, spacing, radii, shadows, motion-easing custom properties). Everything downstream references these; lock them first.
2. **State layer** (`AW.S`, schema v1 + migration, `AW.state()`, `AW.touchDay()`, `AW.deriveNodeState()`). Zero DOM dependency — buildable and testable in isolation (open the file, call functions from a console) before any screen exists.
3. **Kit/assets layer** (`AW.KIT` icons, `AW.recolor()`). Independent of state; can proceed in parallel with step 2.
4. **Components layer** (`@layer components` CSS + shared JS UI helpers: phone skeleton, HUD, sheets, citation chips, buttons/foot). Depends on tokens (step 1).
5. **Motion layer** (`@layer motion` — keyframes, transitions, `prefers-reduced-motion` guards). Depends on tokens + components; motion refines already-correct structure, so it comes after, not before.
6. **`AwbaLesson` runner.** Build/validate this before `AwbaReview` because all 15 of Josh's existing lesson files exercise it immediately — fastest path to proving backward compatibility against real content.
7. **`AwbaReview` runner.** Same dependencies as step 6; validate against the 4 review files second.
8. **`AwbaLearn` (new) + `index.html`.** Depends on state (`AW.deriveNodeState`) + components + motion. Build last among the screen runners — it's net-new code with no legacy constraint, and benefits from the component/motion layer already being proven inside the lesson/review screens.
9. **PWA shell** (`manifest.webmanifest`, `icons/`, `sw.js`, `offline.html`). Build last. The precache list references exact file paths from steps 1–8; standing up the service worker before those paths are stable just produces stale-cache debugging noise during active development. Keep the SW registration guarded (`if ('serviceWorker' in navigator && location.protocol.startsWith('http'))`) so file-based review is never affected.

## PWA Layering

- **Manifest** (`manifest.webmanifest`, linked from `index.html` and, for installability parity, every screen): `name`, `short_name`, `start_url: "/"` (or `"./index.html"`), `display: "standalone"`, `background_color`/`theme_color` matching the brand blue (`#2E6BF5`), an `icons` array with `192`, `512`, and a `purpose: "maskable"` `512` entry. iOS does not fully honor the manifest — also add `<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">` and `<meta name="apple-mobile-web-app-capable" content="yes">` to each page's head boilerplate.
- **Icons are the one place raster files are unavoidable.** Everything else in the UI stays inline SVG (see Asset Strategy below), but manifest/install icons and `apple-touch-icon` must be pre-exported PNGs (maskable-icon requirements and iOS support are unreliable for SVG manifest icons). These are hand-exported once from the lantern/mosque brand mark and checked into `icons/` — not generated by any build step.
- **Service worker (`sw.js`, repo root — scope requirement, see Structure Rationale):**
  - *Install:* precache the app shell only — `index.html`, `manifest.webmanifest`, `shared/awba-engine.css`, `shared/awba-engine.js`, `shared/awba-learn.js`, `icons/*`, `fonts/*`, `offline.html`.
  - *Activate:* delete any cache whose name doesn't match the current version string (`awba-shell-v{N}`, manually bumped in `sw.js` whenever a precached file changes — there is no bundler to content-hash filenames, so the version bump is the manual cache-busting mechanism).
  - *Fetch — navigation requests* (lesson/review/learn HTML): network-first, falling back to cache, falling back to `offline.html` if neither succeeds. Guarantees Josh/learners see the latest content when online, and still get *something* usable offline.
  - *Fetch — shared engine CSS/JS/fonts/icons:* cache-first (rarely change once stable).
  - Registered defensively so opening any file via `file://` never throws — SW simply never activates in that context, which is correct (SW requires a secure/http(s) context regardless).

## Asset Strategy: Icon Kit

**Decision: keep inline-SVG-in-JS (`AW.KIT`), do not move to an external `<symbol>` sprite file.**

- The reference's `AW.KIT` object (12 brand illustrations as inline SVG strings) already delivers zero extra HTTP requests, zero build step, and a trivially simple recolor trick (`AW.KIT.lantern.replace(/#2E6BF5/g,'#E8A400')` for the gold "legendary" companion variant) — this exact mechanism is exercised today and battle-tested through 5 owner-review rounds.
- **Alternative considered and rejected:** an external SVG sprite (`<symbol id="lantern">` in one `.svg` file, referenced via `<use href="icons.svg#lantern">`). Pros would be independent browser caching and the ability to open one `.svg` file directly to visually preview every icon at once. Rejected because: (a) recoloring an externally-referenced `<use>` icon requires plumbing `fill: currentColor` + a `color` CSS variable through every icon consistently — a real CSS refactor with no functional payoff at this scale — and (b) it reintroduces a cross-file dependency exactly where the current string-substitution trick is simplest and already works.
- **Concrete improvement for Gen-4:** move `AW.KIT` out of the dense single-line format it's in today (the whole icon kit is currently one very long line, unreadable when the file is opened) into its own clearly-formatted section with one multi-line, indented template literal per icon, each preceded by a one-line comment naming what it depicts. Formalize the recolor pattern as `AW.recolor(svgString, {from, to})` instead of ad hoc inline `.replace()` calls scattered through engine code, so every recolor site is discoverable by searching for one function name.
- **Confetti stays DOM-node based** (creating ~14–30 absolutely-positioned `<div>`s with inline styles and a `setTimeout` cleanup, as today) rather than moving to `<canvas>`. At this element count the DOM approach is cheap and, critically, simple — matching the project's stated preference to avoid over-engineering. Revisit only if a future screen needs hundreds of particles simultaneously, which nothing in the current requirements calls for.

## Sources

- Primary source (read in full): `/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD/learn.html`, `shared/awba-engine.js`, `shared/awba-engine.css`, `lessons/u1-m1.html`, `reviews/u1-review.html` — HIGH confidence, this is the ground truth for the existing contract.
- [CSS-Tricks — CSS Cascade Layers Guide](https://css-tricks.com/css-cascade-layers/) — `@layer` architecture patterns and browser support (96%+ as of 2026).
- [MDN — @layer CSS at-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer)
- [MDN — CORS Errors: Reason: CORS request not HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSRequestNotHttp) — confirms `file://` cannot load `type="module"` scripts (CVE-2019-11730 mitigation), the basis for rejecting ES modules.
- [whatwg/html issue #8121 — module-scripts under file://](https://github.com/whatwg/html/issues/8121) — confirms this is a known, currently-unresolved browser platform limitation, not a misconfiguration.
- Service worker caching strategy guidance (network-first for HTML navigations, cache-first for static/hashed assets, explicit cache versioning + `activate` cleanup): synthesized from multiple 2026 PWA guides — [jsmanifest Service Workers Guide](https://jsmanifest.com/service-workers-pwa-guide), [MagicBell — Offline-First PWAs Caching Strategies](https://www.magicbell.com/blog/offline-first-pwas-service-worker-caching-strategies), [Zeepalm — PWA Offline Functionality Checklist](https://www.zeepalm.com/blog/pwa-offline-functionality-caching-strategies-checklist) — MEDIUM confidence (cross-corroborated consensus, not one canonical spec).
- Service worker scope rules (a service worker only controls its own directory and below by default) — well-established, spec-level Service Worker API behavior. HIGH confidence.

---
*Architecture research for: Awba Gen-4 (zero-build, multi-page, vanilla-JS gamified micro-learning PWA)*
*Researched: 2026-07-11*
