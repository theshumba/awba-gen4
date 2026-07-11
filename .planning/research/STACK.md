# Stack Research

**Domain:** Zero-build vanilla HTML/CSS/JS, multi-page, static-hosted Duolingo-style learning PWA
**Researched:** 2026-07-11
**Confidence:** HIGH for platform API support (verified against MDN, caniuse, and WebKit primary sources); a few practical judgment calls flagged MEDIUM inline

Hard constraints already locked in PROJECT.md (not relitigated here): no framework, no bundler, no backend, localStorage progress, static hosting (GitHub Pages/Vercel), multi-page architecture with a shared engine JS/CSS. Everything below is about squeezing world-class polish out of *that* stack using native browser platform capabilities instead of dependencies.

## Recommended Stack

### Core Technologies

| Technology | Minimum Support (target: modern mobile Safari + Chrome) | Purpose | Why Recommended |
|------------|------|---------|-----------------|
| Native CSS Nesting | Safari 16.5+ (May 2023), Chrome 112+ | Component-scoped CSS without Sass/PostCSS | Baseline widely available; gives Sass-like `&` nesting with zero build step — the #1 reason teams reach for a CSS preprocessor is gone |
| CSS Container Queries | Safari 16.0+ (Sept 2022), Chrome 105+ | Responsive components (lesson cards, node popups, bottom sheets) that respond to their own container, not viewport | Path/node UI needs to resize based on its container (sidebar vs full-width, sheet vs modal) not just screen width — media queries can't do this |
| `@property` (CSS Properties & Values API) | Safari 16.4+ (Mar 2023), Chrome 85+ | Registers custom properties with a type so they can be smoothly animated/transitioned (progress rings, gradient angles, counters) | Without registration, browsers can't interpolate a custom property's value — this is what makes CSS-only animated progress rings, noor counters, and gradient sweeps possible without JS |
| `color-mix()` | Baseline widely available since May 2023 (Safari 16.2+/17+, Chrome 111+) | Derive tints/shades/state-colors (hover, disabled, unit-tinted variants) from the 4 unit brand colors at runtime | Replaces hand-computed hex palettes per unit color; one line (`color-mix(in oklch, var(--unit-color) 85%, white)`) generates consistent tonal ramps for all 4 unit themes |
| CSS `linear()` easing function | Safari **17.2+** (Dec 2023), Chrome 113+ | Native spring/bounce/elastic easing curves in `transition-timing-function` and WAAPI's `easing` option | This is the single biggest unlock for "Duolingo-grade" motion without a JS animation library — verified directly via caniuse/MDN (earlier folklore claiming "Safari doesn't support linear()" is outdated; it shipped Dec 2023 and is Baseline) |
| Web Animations API (`element.animate()`) | Universal in target browsers (Safari 13.1+, Chrome 84+ for full feature set incl. `.finished` promises) | JS-orchestrated, sequenced, cancellable animations (reward choreography, quiz feedback) | Runs on the compositor like CSS, but gives Promise-based sequencing (`await anim.finished`) needed to chain verdict → noor claim → returns → done without setTimeout guesswork |
| View Transitions API — same-document | Safari 18.0+ (Sept 2024), Chrome 111+ | Smooth transitions between DOM states within one page (quiz beat → beat, accordion open) | `document.startViewTransition(() => updateDOM())` — native crossfade/morph, zero animation code |
| View Transitions API — cross-document (MPA) | Safari **18.2+** (Dec 2024), Chrome 126+ — verified via webkit.org primary source | Native page-to-page transitions between `learn.html` → `lesson.html` → reward screens | Two lines of CSS (`@view-transition { navigation: auto; }`) on every page = free native page transitions for a genuinely multi-page site. This is the technology that makes MPA architecture *not* feel like a step down from an SPA in 2026 |
| Web App Manifest + Service Worker | Universal (all target browsers support both without flags) | Installable PWA shell, offline shell caching | Required by PROJECT.md; keep the service worker hand-written and under ~50 lines — no Workbox needed at this scale |

### Supporting "Libraries" (vendored files, not npm packages)

There is no package manager at runtime in this stack — "library" here means a single, small, MIT-licensed file downloaded once and committed into `shared/vendor/`, referenced with a plain `<script src="...">`. This keeps the PWA offline-cacheable (same-origin, service-worker-precacheable) and avoids a CDN as a runtime dependency and point of failure.

| File | Size | Purpose | When to Use |
|------|------|---------|-------------|
| Hand-rolled canvas confetti (~100-150 lines, write in-repo) | ~2-4KB | PERFECT combo celebration burst | Default choice — the need is narrow (one burst pattern, brand colors, respects `prefers-reduced-motion`), and hand-rolling avoids inheriting an external library's API surface/edge cases for a single use case |
| `canvas-confetti` (catdad), vendored as a single local file | ~12KB unminified, 0 deps | Same purpose, if richer effects are wanted (multiple bursts, custom shapes, realistic gravity/drift presets) | Only if design wants effects beyond a simple burst — vendor the single `confetti.module.mjs` file locally, do not load from a CDN (breaks offline PWA guarantee and adds a supply-chain dependency with no build step to pin/audit it) |
| Precomputed `linear()` easing strings | 0KB (just CSS custom properties) | Spring/bounce curves for buttons, node pop-ins, card reveals | Generate once with a spring-to-`linear()` converter (e.g., the Linear Easing Generator popularized by Jake Archibald/Josh Comeau), hardcode the resulting string as `--ease-spring: linear(0, 0.5 15%, 1.09 32%, ...)`, reuse via `var()`. Zero runtime dependency — the "physics" is baked into a static string at design time |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| A local static file server (`npx serve`, `python3 -m http.server`, VS Code "Live Server" extension) | Required to test the service worker and installable PWA behavior | Service workers **do not register** over `file://` — they require `http://localhost` or HTTPS. This is unavoidable regardless of any other decision in this doc; budget for it as a one-time dev-environment setup, not a build step |
| `pyftsubset` (fonttools) or glyphhanger | One-time manual font subsetting pass | Run once by a developer to cut Poppins/Inter/Amiri down to only the glyphs actually used (Latin + Arabic + diacritics), producing static `.woff2` files that get committed to the repo — this is data preparation, not a build pipeline step, and matches "Josh opens files directly" since the output is a static asset |
| SVGO (run via `npx svgo` once per icon, not wired into any pipeline) | Optimize/minify hand-authored or exported SVG icons (lantern companion, path nodes, unit badges) | One-off CLI pass per asset update, output committed as static `.svg` — never a build-time dependency |
| Browser DevTools "Application" tab (Service Workers, Manifest, Storage panels) | Debugging PWA install criteria, cache contents, localStorage schema | No extra install; built into Chrome/Safari |

## Setup / Vendoring (no `npm install` — this is a zero-build static site)

```bash
# Fonts: self-host, subset once, commit the .woff2 files
# (download from Google Fonts / GitHub releases, then subset)
pyftsubset Poppins-Regular.ttf --output-file=poppins-regular-latin.woff2 \
  --flavor=woff2 --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+2000-206F"

pyftsubset Amiri-Quran-Regular.ttf --output-file=amiri-quran-regular.woff2 \
  --flavor=woff2 --unicodes="U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF"

# Confetti (only if vendoring the richer library instead of hand-rolling):
curl -o shared/vendor/confetti.module.mjs \
  https://raw.githubusercontent.com/catdad/canvas-confetti/master/src/confetti.module.mjs

# No bundler, no package.json required for the app to run.
# A package.json is only useful (optional) to pin dev-tool versions (svgo, fonttools) locally.
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|--------------------------|
| Classic `<script src="...">` for shared engine + all lesson/review data files (Josh's proven Gen-3 pattern) | ES modules (`<script type="module">`) throughout | **Only if the team confirms Josh's review workflow uses a local server (`npx serve`) rather than double-clicking HTML files.** ES modules fail to load over `file://` in Chrome (CORS policy blocks local module fetches) — verified via multiple sources. Since PROJECT.md says "Josh can open files directly to review," classic scripts are the safe default. If confirmed server-based, ES modules give better internal organization for the ~800-line engine (real `import`/`export` instead of one giant file), but this is an architecture decision, not a research verdict — flag for owner/roadmap sign-off |
| Native CSS `linear()` easing + WAAPI for orchestration | A JS spring-physics library (`react-spring`-style, `spring-easing` npm package, GSAP) | Only if the team wants runtime-configurable spring parameters (e.g., a settings UI where stiffness/damping change dynamically) — this project's motion needs (fixed, designed micro-interactions) don't require that; a library adds 10-40KB for a capability (runtime physics recomputation) that isn't used |
| Native View Transitions API for page-to-page motion | Hand-rolled CSS crossfade/slide between pages (e.g., `sessionStorage` flag + `animation-fill-mode` tricks) | Only for the ~15% of users on browsers without View Transitions support (older iOS <18.2, Firefox stable). Recommend: ship View Transitions as **progressive enhancement** (feature-detect `document.startViewTransition` / the `@view-transition` at-rule is inert if unsupported — pages just navigate normally, no fallback code required). Do not build a manual crossfade fallback; it's not worth the complexity for graceful degradation to "just navigates normally" |
| Hand-rolled canvas confetti | `canvas-confetti` vendored | See Supporting Libraries table above — richer effects only |
| localStorage with a versioned wrapper (see pattern below) | IndexedDB | If progress data ever needs to store large binary blobs (it won't — noor/streak/stars/completion state is small JSON) or exceeds ~2-5MB. Not relevant given PROJECT.md's fixed constraint, noted for completeness |
| Self-hosted, subsetted static font files | Google Fonts CDN `<link>` | Never for this project — a PWA that promises offline/installable behavior cannot depend on a third-party CDN for its type system; self-hosting is also Baseline best practice for 2026 regardless of PWA concerns (removes a third-party connection, full caching control) |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|--------------|
| GSAP, Framer Motion, anime.js, Motion One, or any animation library | 20-70KB+ of runtime dependency for capabilities (timelines, physics springs, SVG morphing) that CSS `linear()` + WAAPI already cover for this project's actual needs (micro-interactions, staged reveals, page transitions) — only justified for complex SVG shape-morphing at a scale this project doesn't have | Native `linear()` easing + `element.animate()` (WAAPI) |
| Tailwind via CDN `<script>` (JIT-in-browser mode) | Ships the entire JIT compiler and recompiles on every page load; Tailwind's own docs advise against this for production. Directly conflicts with the zero-build, fast-load goals | Plain CSS with custom properties, native nesting, and `color-mix()` for the theming Tailwind utilities would otherwise provide |
| jQuery | Solves DOM query/manipulation problems that `querySelector`, `classList`, and `fetch` already solve natively in every target browser | Native DOM APIs |
| Any bundler (Webpack/Vite/Rollup/esbuild/Parcel) | Excluded by hard constraint, but worth stating why it matters here specifically: a build step breaks "Josh opens files directly to review" and adds tooling Josh (non-engineer reviewer) can't run himself | Plain `<script>`/`<link>` tags, static file serving |
| `localForage`/`Dexie` (IndexedDB wrappers) | Unneeded abstraction layer for localStorage-sized state; adds a dependency for a problem (structured storage) this project's data shape doesn't have | A small hand-written localStorage wrapper (see pattern below) |
| SMIL (`<animate>`, `<animateTransform>`) for anything interactive or JS-controlled | Harder to pause for `prefers-reduced-motion` (needs `svg.pauseAnimations()`, not CSS-controllable) and harder to sequence/cancel than WAAPI | CSS animations or WAAPI targeting the SVG's presentation attributes; reserve SMIL only for a genuinely passive, always-on ambient loop (e.g., a designer-exported flickering lantern glow) where JS control is never needed |
| `@custom-media` | Not Baseline (Safari lacks support as of 2026); using it "for real" requires PostCSS to compile it away, which reintroduces a build step this project explicitly rejects | CSS custom properties + repeated `@media` queries, or just accept the minor repetition |
| Any CDN-hosted script/font/icon (except a one-time download step) | Every third-party network dependency is a hole in the "installable, offline-capable PWA" promise, and static hosting + a service worker can only precache same-origin assets reliably | Vendor everything into the repo under the app's own origin |
| `apple-mobile-web-app-capable` meta tag | Deprecated by Apple's own current guidance; provides an inferior home-screen experience that ignores `start_url`/`scope` | `<link rel="apple-touch-icon" href="...">` (180×180px, no transparency) is still required in 2026 because iOS Safari ignores the manifest for the home-screen icon specifically and reads this tag instead — keep it alongside a correct `manifest.json`, don't use it as a manifest replacement |

## Stack Patterns by Variant

**If Josh's review workflow is "double-click index.html / open via `file://`":**
- Use classic, non-module `<script src="...">` tags everywhere, load order matters (engine before data files), exactly matching the Gen-3 pattern that's already proven across 5 review rounds
- Accept that service worker / PWA install testing is a separate step that requires `npx serve` regardless — this is unavoidable and orthogonal to the module decision (SW never registers over `file://` no matter what)

**If Josh's review workflow is confirmed to use a local server (or reviews are always done via the deployed GitHub Pages/Vercel URL):**
- ES modules are viable for the shared engine's internal organization (`shared/engine/state.js`, `shared/engine/render.js`, etc., real `import`/`export`)
- Critical rule if adopted: mark **every** `<script>` tag `type="module"` uniformly across every page — including Josh's "dumb" lesson/review data files that contain no imports. Module scripts execute in document order *after* HTML parsing (deferred by default), while classic scripts execute synchronously at parse time; mixing the two types on one page breaks the load-order guarantee that lets a data file call a global `AwbaLesson(cfg)` function defined by the engine module. Data files' *content* doesn't need to change (they can still call global functions), only their `<script>` tag's `type` attribute does

**For Arabic scripture rendering (Clear Quran ayahs vs. general Arabic UI copy):**
- Use **Amiri Quran** (the Quran-optimized companion face, not the general Amiri family) specifically for verbatim ayah text — it was designed against the metal typefaces historically used for Quran typesetting
- Use general **Amiri** (regular/bold, 2 static weights — neither Amiri nor Amiri Quran ship as variable fonts) for hadith text and general Arabic UI copy
- `line-height: 1.8+` minimum for Arabic body text (vs. 1.5 for Latin) to accommodate diacritics; `letter-spacing: 0` always (Arabic is a connected script — any letter-spacing breaks glyph joining and makes it unreadable)
- Never mix a separate Latin webfont with an Arabic webfont in the same visual block unless their x-heights/proportions are manually matched — default fallback stacking looks visually broken

**For "springy" motion specifically:**
- Simple state-driven transitions (hover, press, locked→available) → CSS `transition` with a precomputed `linear()` easing custom property
- JS-orchestrated multi-step sequences (reward choreography: verdict → noor claim → returns → done) → WAAPI (`element.animate()`) chained via `await anim.finished`, using the same `linear()` easing strings passed as the `easing` option
- Page-to-page motion → native View Transitions API (`@view-transition { navigation: auto; }` cross-document, `document.startViewTransition()` same-document), with `view-transition-name` on persistent elements (e.g., the lantern companion, a path node morphing into a lesson header) for shared-element continuity
- Always wrap non-essential motion (confetti, view-transition animations) in a `prefers-reduced-motion: reduce` guard — for view transitions: `@media (prefers-reduced-motion: reduce) { ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; } }`

## Reference Patterns

### localStorage versioned schema wrapper

```javascript
const STORAGE_KEY = 'awba_state_v1'; // bump the whole key on breaking changes
const CURRENT_SCHEMA_VERSION = 3;

const migrations = {
  1: (state) => ({ ...state, chests: state.chests ?? [] }),
  2: (state) => ({ ...state, schemaVersion: 3, noorClaimed: state.noorClaimed ?? {} }),
};

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState();
  let state = JSON.parse(raw);
  let v = state.schemaVersion ?? 1;
  while (v < CURRENT_SCHEMA_VERSION) {
    state = migrations[v](state);
    v = state.schemaVersion ?? v + 1;
  }
  return state;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // QuotaExceededError or private-browsing restrictions — fail soft
    console.warn('awba: could not persist state', e);
  }
}
```
All reads/writes route through this wrapper — never scatter raw `localStorage.setItem` calls across engine files.

### Minimal service worker (cache-first assets, network-first HTML, manual cache-busting)

```javascript
const CACHE_NAME = 'awba-shell-v3'; // bump on every deploy that changes cached files

const SHELL_ASSETS = [
  './', './learn.html', './shared/awba-engine.js', './shared/awba-engine.css',
  './shared/vendor/confetti.module.mjs',
  './assets/fonts/poppins-regular-latin.woff2',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(SHELL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const isHTML = e.request.mode === 'navigate';
  e.respondWith(
    isHTML
      ? fetch(e.request).catch(() => caches.match(e.request)) // network-first for pages
      : caches.match(e.request).then((hit) => hit || fetch(e.request)) // cache-first for assets
  );
});
```
Register with a relative path and scope so GitHub Pages project subpaths (`username.github.io/repo/`) work: `navigator.serviceWorker.register('./sw.js', { scope: './' })`. `manifest.json`'s `start_url` and `scope` must also be relative for the same reason.

## Version Compatibility

| Feature | Safari min | iOS Safari min | Chrome min | Notes |
|---------|-----------|-----------------|------------|-------|
| CSS Nesting | 16.5 (May '23) | 16.5 | 112 | Baseline |
| Container Queries | 16.0 (Sep '22) | 16.0 | 105 | Baseline |
| `@property` | 16.4 (Mar '23) | 16.4 | 85 | Animating a custom property still runs off the compositor thread even when registered — don't assume it's "free" like a transform animation |
| `color-mix()` | ~16.2-17 | ~16.2-17 | 111 | Baseline widely available since May 2023 |
| `linear()` easing | **17.2 (Dec '23)** | **17.2** | 113 | Verified directly against caniuse/MDN — supersedes outdated "Safari doesn't support this" claims found in older articles |
| WAAPI `.finished` / full feature set | 13.1+ | 13.1+ | 84+ | Safe to treat as universal in this project's target range |
| View Transitions — same-document | 18.0 (Sep '24) | 18.0 | 111 | |
| View Transitions — cross-document (MPA) | **18.2 (Dec '24)** | **18.2** | 126 | Verified via webkit.org primary source; ~85% global browser coverage as of the search date. Firefox stable still lacks support — treat as progressive enhancement, never a hard requirement |
| Service Worker + Web App Manifest | Universal | Universal | Universal | No flags needed anywhere in target range |
| ES Modules (`type="module"`) | Universal for `http(s)://` | Universal for `http(s)://` | Universal for `http(s)://` | **Fails over `file://` in Chrome** (CORS policy) — decisive factor for the classic-script-vs-ES-module decision above |

**Practical floor:** iOS Safari 17.x (released Sept 2023) covers nesting, container queries, `@property`, `color-mix()`, and `linear()` easing, but **not** cross-document View Transitions (needs 18.2+, Dec 2024). Given the current date, the overwhelming majority of active iOS devices are on 18.2+, but ship View Transitions strictly as progressive enhancement regardless — there's no fallback code to write since unsupported browsers simply navigate normally.

## Sources

- MDN — [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API), [`easing-function: linear()`](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear), [`color-mix()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix), [CSS Properties and Values API guide](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Properties_and_Values_API/guide), [`@custom-media`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@custom-media) — HIGH confidence, fetched directly
- caniuse.com — `linear()` easing function, View Transitions API, `color-mix()` — HIGH confidence, fetched directly for exact version numbers
- WebKit.org — [Two lines of Cross-Document View Transitions code](https://webkit.org/blog/16967/two-lines-of-cross-document-view-transitions-code-you-can-use-on-every-website-today/) — HIGH confidence, primary source, confirms Safari 18.2 + exact CSS
- Chrome for Developers — [Cross-document view transitions for multi-page applications](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document) — HIGH confidence
- firt.dev — [iOS PWA Compatibility](https://firt.dev/notes/pwa-ios/) — MEDIUM-HIGH confidence, well-known specialist source on iOS PWA quirks (apple-touch-icon requirement, apple-mobile-web-app-capable deprecation)
- GitHub — [catdad/canvas-confetti](https://github.com/catdad/canvas-confetti), [WHATWG html issue #8121 on file:// module loading](https://github.com/whatwg/html/issues/8121) — HIGH confidence for the file:// + ES modules CORS restriction, cross-verified against freeCodeCamp forum and GitHub community discussion reports of the identical error
- Wikipedia / Google Fonts / Fontsource — Amiri vs. Amiri Quran typeface distinction (4 static styles, no variable font for either) — MEDIUM confidence (consistent across multiple secondary sources, not independently verified against a single canonical spec)
- Josh W. Comeau — [Springs and Bounces in Native CSS](https://www.joshwcomeau.com/animation/linear-timing-function/) — MEDIUM confidence, respected independent source, used for the `linear()`-as-spring-approximation technique (not for version support numbers, which were verified separately against caniuse/MDN)
- web.dev — [Best practices for fonts](https://web.dev/articles/font-best-practices) — MEDIUM-HIGH confidence, official Google web platform guidance on `font-display`, preload, self-hosting, subsetting
- Poppins variable-font-availability claim (static weights only on Google Fonts, no variable axis) — **LOW-MEDIUM confidence**, not independently re-verified this session (Google Fonts specimen pages are JS-rendered and WebFetch could not retrieve the compatibility table); recommend a 2-minute manual check of `fonts.google.com/specimen/Poppins` before committing to the self-hosting/subsetting plan, since if Poppins does ship a variable instance it changes the subsetting approach (one variable file vs. per-weight static files)

---
*Stack research for: zero-build vanilla JS/CSS Duolingo-style micro-learning PWA*
*Researched: 2026-07-11*
