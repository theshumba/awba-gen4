# Awba Gen-4

Awba is a calm, Duolingo-style Islamic micro-learning web app that walks a learner through the
complete Aqeedah Level 1 course (4 units, 15 lessons, 4 "legendary" reviews) — a companion, not a
cop, built as a zero-build static site so anyone can open, review, and ship it without tooling.

## What this repo is

A plain static site. There is **no build step, no bundler, no `npm install`, no framework**. Every
page is a hand-written `.html` file that loads one shared engine and (for lessons/reviews) one small
per-page data file. The repo *is* the deploy artifact.

## Structure

```
index.html                 → a tiny redirect to learn.html (the base URL, still installable)
learn.html                 → the front door: the Orbit "path" home screen
onboarding.html            → first-run welcome (skippable, replayable); a fresh visitor to learn.html
                             is sent here once, then "Begin" lands them back on the path
practice.html              → Practice hub: re-walk questions from lessons you've finished (no scoring)
profile.html               → a private, on-device ledger: noor, returns, stars, the Ring, per-unit
more.html                  → settings & about: sound / motion toggles, replay onboarding, start-over
practice/
  session.html             → the practice drill (deterministic 8-item set, driven by AW.practiceRun)
lessons/                   → 15 lesson pages; each calls AwbaLesson({...}) with its own content
reviews/                   → 4 review pages; each calls AwbaReview({...}) with its own content
shared/
  awba-engine.css          → the ONE stylesheet (design tokens, registers, components, motion)
  awba-engine.js           → the ONE engine (state, storage, icon kit, runners, sheets, a11y)
  practice-pool.js         → the dev-generated, byte-verbatim practice item pool (see below)
  fonts/                   → self-hosted, subset .woff2 faces (no third-party font network calls)
  img/                     → grain texture + raster art
  sfx/                     → sound cues
icons/                     → generated PWA icons (192 / 512 / 512-maskable / 180 apple-touch) + sources
manifest.webmanifest       → the Web App Manifest (start_url = learn.html, scope = ./ relative)
sw.js                      → a hand-written service worker (< 50 lines): 52-entry precache + offline shell
preview.html               → a DEV-only reference sheet — not part of the app, never precached
scripts/                   → the validator + the standing quality gates (see below)
```

**The v2 surfaces** (onboarding / practice / profile / more) are plain root pages cloned from the same
head template as `learn.html` — relative paths, classic scripts, `file://`-openable. They add no new
religious content and read all state through `AW.*` only (zero direct storage). The practice drill
reuses quiz items **byte-verbatim** from the lessons a learner has already finished; nothing in
practice is scored and nothing is ever written.

**How a page works:** the engine is loaded first with a classic `<script src="shared/awba-engine.js">`,
then a lesson/review page's own inline script calls the global `AwbaLesson(cfg)` / `AwbaReview(cfg)`
with its content object. Load order matters — the engine must parse before the data file runs. Every
asset path is **relative** (`shared/...`), never rooted with a leading slash, so the site works
unchanged at a GitHub Pages project subpath *or* a custom-domain root.

## Reviewing the content (no server, no build)

Content reviewers can open **any `.html` file directly** by double-clicking it — it loads over
`file://` in the browser with no server and no build. Start at `learn.html`, or open a single
`lessons/*.html` / `reviews/*.html` to read one screen in isolation. The service worker deliberately
does **not** register over `file://`, so double-click review is never affected by caching.

## The validator + the standing gates

Run these from the repo root. Each is zero-dependency (Node core / system Python / system Chrome) —
no packages to install. Every one exits `0` on pass and non-zero on failure.

```sh
# Content validator — scripture verbatim, sourced refs, sensitive-atom holds (CNT-01/CNT-02)
node scripts/validate-content.js lessons/*.html reviews/*.html

# The standing quality gates
node scripts/tests/render-smoke.mjs        # every page renders with no console error (headless Chrome)
node scripts/port-audit.mjs                # byte-fidelity of ported content + zero-CDN + retired-element gate
node scripts/tests/practice-pool-audit.mjs # the practice pool is byte-verbatim vs the frozen lesson cfgs
node scripts/tests/rtl-audit.mjs           # Arabic RTL / bidi correctness
python3 scripts/check-glyph-coverage.py    # every rendered codepoint has a real font glyph
node scripts/tests/pwa-audit.mjs           # manifest / icons / service-worker shape / precache integrity
node scripts/tests/contrast-audit.mjs      # WCAG contrast swept from real rendered pages (run LAST, alone)

# The unit + interaction suite (always run via the glob — incl. state-token.test.js,
# the travel-code seam: export/import round-trip, tamper + future-schema refusals)
node --test scripts/tests/*.test.js
```

**Run the Chrome-based gates one at a time, never concurrently** — `render-smoke`, `rtl-audit`,
`contrast-audit`, and the `node --test` glob (three of its files spawn headless Chrome) all shell out
to system Chrome, which flakes under parallel contention. `contrast-audit` is the heaviest; run it last
and on its own.

## Regenerating the practice pool

`shared/practice-pool.js` is a **dev-generated** data file (like the font-subsetting step — data
preparation, not a build pipeline). It extracts the `mc` / `tf` / `tile` quiz items from the 15 lesson
cfgs **byte-verbatim** so Practice can reuse them offline without fetching. Regenerate it whenever a
lesson's quiz content changes:

```sh
node scripts/build-practice-pool.js        # rewrites shared/practice-pool.js from the lesson cfgs
node scripts/tests/practice-pool-audit.mjs # proves the pool still byte-matches its source cfgs
```

The audit gate fails if the committed pool ever drifts from the frozen lesson content, so the two can
never diverge silently.

## Testing the PWA locally

The installable / offline behaviour needs a real origin — a **service worker never registers over
`file://`**, only over `http://localhost` or HTTPS. Serve the repo root with any static server and
open the printed `http://localhost` URL:

```sh
npx serve            # or:  python3 -m http.server 8000
```

Then, in the browser's DevTools "Application" tab, you can inspect the manifest, the registered
service worker, and the cache. Installing to the home screen surfaces the in-app add-to-home nudge on
`learn.html`. This local-server step is for PWA testing only — it is **not** a build step, and plain
content review still works over `file://` without it.

## Deploying (GitHub Pages, static, zero build)

Deployment is just a push. Enable **GitHub Pages** for the repository (serve from the default branch);
Pages serves the static files as-is with **no build**. Because every path is relative, the same commit
works whether Pages serves it at a project subpath (`…/awba-gen4/`) or a custom domain at the root — no
code change is needed when the base URL moves. There is no CI and no pipeline: the repo is the artifact.
