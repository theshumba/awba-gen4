# R4 — Quality Machinery: sw.js, manifest, index.html, gate scripts, test suite

Repo root: `/Users/theshumba/Documents/GitHub/awba-gen4`. Static, zero-build, file://-openable.
This doc is exhaustive reference for v2 builders adding 4 new root pages: `onboarding.html`,
`practice.html`, `profile.html`, `more.html` (exact filenames assumed — confirm against the design
spec, but every gate below keys off root-level `*.html` discovery so the names matter).

---

## 1. `sw.js` — service worker (`/Users/theshumba/Documents/GitHub/awba-gen4/sw.js`)

- Cache name: `var CACHE = 'awba-cache-v1';` (line 21) — a plain string constant, NOT auto-derived.
- **PRECACHE array — the full 46 entries, in file order** (lines 23-70):
  ```
  learn.html, index.html, manifest.webmanifest,
  shared/awba-engine.css, shared/awba-engine.js, shared/img/grain.png,
  lessons/u1-m1.html, lessons/u1-m2.html, lessons/u1-m3.html, lessons/u1-m4.html,
  lessons/u2-m1.html, lessons/u2-m2.html, lessons/u2-m3.html, lessons/u2-m3b.html,
  lessons/u3-m1.html, lessons/u3-m2.html, lessons/u3-m3.html,
  lessons/u4-m1.html, lessons/u4-m2.html, lessons/u4-m2b.html, lessons/u4-m3.html,
  reviews/u1-review.html, reviews/u2-review.html, reviews/u3-review.html, reviews/u4-review.html,
  shared/fonts/amiri-400.woff2, shared/fonts/amiri-700.woff2, shared/fonts/amiri-quran-400.woff2,
  shared/fonts/aref-ruqaa-400.woff2, shared/fonts/aref-ruqaa-700.woff2,
  shared/fonts/courier-prime-400.woff2,
  shared/fonts/inter-400.woff2, shared/fonts/inter-500.woff2, shared/fonts/inter-600.woff2,
  shared/fonts/inter-700.woff2, shared/fonts/marcellus-400.woff2, shared/fonts/rakkas-400.woff2,
  shared/fonts/readex-pro-300.woff2, shared/fonts/readex-pro-400.woff2,
  shared/fonts/readex-pro-500.woff2, shared/fonts/readex-pro-600.woff2,
  shared/fonts/readex-pro-700.woff2,
  icons/apple-touch-icon-180.png, icons/icon-192.png, icons/icon-512.png,
  icons/icon-maskable-512.png
  ```
  Count check: 6 shell + 15 lessons + 4 reviews + 17 fonts + 4 icons = **46**. `preview.html` is
  deliberately excluded (dev-only).
- Relative paths, no leading slash — required by `pwa-audit.mjs` (fails any PRECACHE entry starting
  with `/`).
- Routing (`fetch` handler, lines 90-123):
  - non-GET or cross-origin → pass through untouched (`return` with no `respondWith`).
  - Navigation requests (`req.mode === 'navigate'` OR `Accept` header contains `text/html`) →
    **network-first**: fetch, clone+cache on success; on failure fall back to `caches.match(req)`,
    then to `caches.match('learn.html')` as the last-resort offline shell.
  - Everything else (CSS/JS/fonts/img/icons) → **cache-first** with network fill-through on miss
    (fetch, clone+cache, return).
- Install: `caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(skipWaiting)`. **`c.addAll` fails
  the entire install if even one PRECACHE entry 404s** — every new page/asset added must actually
  exist on disk before this ships.
- Activate: deletes every cache key that isn't `CACHE`, then `clients.claim()`.

### Exactly what MUST change when v2 adds pages/assets
1. Add each new root page's relative path (`onboarding.html`, `practice.html`, `profile.html`,
   `more.html`) as a new PRECACHE array entry (quoted string, no leading slash, comma-separated).
2. Add any new supporting assets (new CSS/JS/font/icon files these pages introduce) as PRECACHE
   entries too — same rule.
3. **Bump `CACHE`** to a new version string (e.g. `'awba-cache-v2'`) — this is the ONLY thing that
   triggers the activate-time purge of the old cache and forces clients to pick up the new
   precache list. Forgetting the bump means existing installs keep serving the stale v1 cache
   until every one of its own entries happens to be network-first-refreshed (only navigations are
   network-first; CSS/JS/font entries would silently keep serving old bytes).
4. Update the file-header comment's page count if it wants to stay useful (not gate-enforced, but
   `pwa-audit.mjs` DOES re-derive and file-check every PRECACHE entry against disk regardless of
   the comment).
5. Do NOT add `preview.html` — established convention is dev-only, excluded.
6. `learn.html` is the offline-fallback target hardcoded in the fetch handler
   (`caches.match('learn.html')`, line 107) — if v2 wants a different offline fallback (e.g. a new
   root page as the fallback shell) that line itself must change; nothing auto-discovers it.

---

## 2. `manifest.webmanifest` (`/Users/theshumba/Documents/GitHub/awba-gen4/manifest.webmanifest`)

Full content (26 real lines):
```json
{
  "name": "Awba", "short_name": "Awba",
  "description": "A companion, not a cop — walk the Aqeedah course a tap away.",
  "start_url": "learn.html", "scope": "./",
  "display": "standalone", "orientation": "portrait",
  "background_color": "#131013", "theme_color": "#131013",
  "lang": "en", "dir": "ltr",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```
- `start_url`/`scope` are relative (no leading slash) — required for GitHub Pages subpath installs;
  `pwa-audit.mjs` fails on an absolute leading-slash value in either.
- Exactly 3 icons; at least one MUST carry `"purpose":"maskable"` (gate-checked). New pages do NOT
  need new manifest icons — v2 adding pages doesn't touch this file at all unless a new
  `start_url` target is intentionally chosen (unlikely — `learn.html` stays the front door).

### `index.html` redirect behavior
`/Users/theshumba/Documents/GitHub/awba-gen4/index.html` (27 lines) is a tiny redirect shim, NOT
renamed to any new page:
- `<meta http-equiv="refresh" content="0; url=learn.html">` + `<script>location.replace('learn.html')</script>`
  + a plain `<a href="learn.html">` fallback (works with JS off).
- Carries the install head trio: `<meta name="theme-color" content="#131013">`,
  `<link rel="manifest" href="manifest.webmanifest">`, `<link rel="apple-touch-icon" href="icons/apple-touch-icon-180.png">`.
- SW registration guarded: `if ('serviceWorker' in navigator && location.protocol !== 'file:') { ... navigator.serviceWorker.register('sw.js'); }`.
- **v2 impact**: if onboarding.html should become the new first-run landing target ahead of
  learn.html, this file's redirect target and possibly `manifest.webmanifest`'s `start_url` are the
  two places that encode "the front door" — nothing else in the repo needs to change for that
  routing decision, but `pwa-audit.mjs` literally regexes for `learn\.html` and
  `location\.replace\(['"]learn\.html['"]\)` (see §3.2) so the gate script itself would need
  updating too if the front door moves.

---

## 3. Gate scripts — discovery mechanism, pass criteria, current counts, what changes

All live in `scripts/tests/*.mjs` (except `port-audit.mjs`, which is `scripts/port-audit.mjs` — one
level up) and `scripts/check-glyph-coverage.py`. All are standing exit-code-first gates invoked
directly (`node <path>` / `python3 <path>`), NOT part of the `node --test` glob.

### 3.1 `render-smoke.mjs` (`scripts/tests/render-smoke.mjs`)
Discovery — **`findPages()`, lines 35-49**:
```js
function findPages() {
  const pages = [];
  const rootLearn = path.join(ROOT, 'learn.html');
  if (existsSync(rootLearn)) pages.push(rootLearn); // hardcoded single root page
  for (const dir of ['lessons', 'reviews']) {
    const abs = path.join(ROOT, dir);
    if (!existsSync(abs)) continue;
    for (const f of readdirSync(abs)) {
      if (f.endsWith('.html')) pages.push(path.join(abs, f));
    }
  }
  return pages;
}
```
**Only `learn.html` is hardcoded as a root page — `practice.html`/`profile.html`/`more.html`/
`onboarding.html` will NOT be auto-discovered.** `lessons/` and `reviews/` subdirectories ARE
fully auto-discovered (any `.html` file). Current count: learn.html (1) + 15 lessons + 4 reviews =
**20 pages**, plus a `navCheck()` file:// nav probe (not counted as a page).
Pass criteria per page: no `Uncaught|AW is not defined|SEVERE` in stderr, AND the dumped DOM
contains a class matching `reg-(page|orbit)` (regex substring match, not literal equality).
**What changes for v2**: the `findPages()` function's root-page block must be edited to add each
new root page explicitly (either individually, like the `rootLearn` line, or by globbing root
`*.html` minus `index.html`/`preview.html`). Page count rises from 20 to 24 once all 4 new pages are
added and pass. Never silently declare "24/24" — verify it by running the discovery change first.

### 3.2 `contrast-audit.mjs` (`scripts/tests/contrast-audit.mjs`)
Discovery — **`findPages()`, lines 515-532**: identical hardcode pattern — root `learn.html` pushed
explicitly (`type: 'learn'`), then all `lessons/*.html` (`type: 'lesson'`) and `reviews/*.html`
(`type: 'review'`) auto-discovered. **New root pages are invisible to this gate too** unless
`findPages()` is edited to add them (and a new `driverFor()`/`budgetFor()`/`timeoutFor()` branch
for whatever their "type" should be — the existing three types have bespoke per-type interaction
drivers: `LEARN_LOAD_DRIVER`, `LESSON_LOAD_DRIVER`, `REVIEW_LOAD_DRIVER`; a genuinely new page
family needs its own driver script or reuse of the closest existing shape).
Current count: 20 pages (learn + 15 lessons + 4 reviews). Ground-truth reproduction check
(`checkGroundTruthReproduction`, line 656) additionally asserts gold-on-Kiswah ~8.40:1 and
ember-on-Kiswah ~5.05:1 appear SOMEWHERE across the whole sweep, and that no TEXT node lands in one
of 4 banned ratio cells (crimson-on-Kiswah 2.60-2.70, gold-on-cream 1.88-1.98, powder-on-cream
1.53-1.63, rose-on-cream 1.68-1.78) — these are corpus-wide checks, not per-page, so adding pages
can only add more sweep data, never remove the existing ground-truth requirement.
The ONE documented non-gating exception: gold-as-shape-on-cream ~1.93:1 (matches §2.1's own cited
ratio) prints as `CONTRAST NOTE`, never `CONTRAST FAIL` — this must never be "fixed" by darkening
gold, and new pages using that same gold-on-cream shape pattern get the same NOTE treatment
automatically via `classify()`'s `isGoldish`/`isLightBg` heuristic (lines 603-614).
Report line format: `contrast-audit coverage: N pages, T text pairings, U non-text UI boundary
pairings, S distinct forced states swept` — N will go from 20 to 24 (or however many new pages are
wired into `findPages()`); T/U/S are corpus-size-dependent, never hardcode expected values for them.

### 3.3 `rtl-audit.mjs` (`scripts/tests/rtl-audit.mjs`)
Discovery — **`findPages()`, lines 124-137**: same hardcode-root-learn + auto-discover-lessons/
reviews pattern, PLUS one extra fixed target: `scripts/fixtures/typo-stress.html` (line 135,
comment: "the 21st target — overflow + mixed-bidi"). Current total: **20 real pages + 1 fixture =
21 targets** (matches the task brief's "21/21"). New root pages again need an explicit add to this
`findPages()` — not auto-discovered.
Pass criteria (5 checks per page, computed styles only): (a) every Arabic-codepoint text node's
host has `closest('[lang="ar"]')`; (b) every `[lang="ar"]` element computes
`unicode-bidi: isolate` (or `isolate-override`); (c) every `.ayah`/`.scripture` computes
`direction: rtl` AND `unicode-bidi: isolate`; (d) every `.ayah` computes a font-family starting
`"Amiri Quran"`; (e) no horizontal overflow (`scrollWidth <= innerWidth`) at both a narrow
(320×800, clamped to headless's ~500px floor) and desktop (1280×900) window size. Any Arabic text
a new page introduces (e.g. onboarding copy, profile Arabic labels) must follow the same
`lang="ar"` + isolate + (if scripture) `.ayah`/`.scripture` class convention or this gate fails on
it the moment the page is wired in.

### 3.4 `pwa-audit.mjs` (`scripts/tests/pwa-audit.mjs`)
**Does NOT enumerate pages at all** — it re-derives PRECACHE from `sw.js`'s own source via regex
(`arrayMatch = swSrc.match(/\[([\s\S]*?)\]/)`, line 142) and asserts every extracted path resolves
to a real on-disk file (this is the "20 BYTES OK" / precache-integrity style check the task brief
alludes to, but it's actually a 46-entry-resolves-to-disk check, not a page-count check). So: **the
moment §1's PRECACHE edits are made correctly (new paths added, files exist), this gate passes
automatically with zero further changes** — it needs no per-page awareness beyond what's inside
`sw.js`. Also checks (independent of pages): manifest JSON validity + required keys + relative
start_url/scope + maskable icon + icon file existence + optional PNG IHDR dimension match;
`index.html` links manifest + redirects to learn.html; `learn.html` links manifest +
apple-touch-icon; `sw.js` parses (`node --check`), declares `awba-cache-v\d+`, has
`caches.delete`/`clients.claim`/`skipWaiting`, and a navigate-or-text/html branch; both
`learn.html` and `index.html` register `sw.js` guarded by `protocol !== 'file:'`.
**If v2's new pages also need SW registration** (they should, to be offline-installable), each new
page's own `<script>` block must carry the same guarded `navigator.serviceWorker.register('sw.js')`
pattern — `pwa-audit.mjs` currently only checks `learn.html`+`index.html` for this, so a new page
missing SW registration would NOT be caught by this gate; it's a manual-parity requirement, not an
enforced one, unless the gate is extended.

### 3.5 `check-glyph-coverage.py` — see §4 below (separate numbered item per task brief).

### Current-count summary table (what the task brief's "21/21, 22/0, 84 cps, 20 BYTES OK, 3 notes" map to)
| Gate | current count | source |
|---|---|---|
| render-smoke | 20 pages (1 learn + 15 lessons + 4 reviews) | hardcoded root + 2 auto-dirs |
| rtl-audit | 21 targets (20 pages + 1 fixture) | same + `typo-stress.html` |
| contrast-audit | 20 pages | same hardcode pattern, no fixture |
| pwa-audit | 46 PRECACHE entries all resolve to disk (not a "page count") | regex-extracted from `sw.js` |
| port-audit | 19 content files (15 lessons + 4 reviews) + 1 DAILY root-file compare | `listPages('lessons')+listPages('reviews')` |
| validate-content.js | 19 files (15 lessons + 4 reviews), 3 accepted `note:` warnings | `defaultFiles()` |
| check-glyph-coverage.py | glyph roster of 14 faces, `AW.GLYPHS` count pinned at 13 (separate, in `components.test.js`, not this script) | harvest() over `learn.html`+`lessons/*`+`reviews/*`+engine JS |

None of these "20/21/19" counts are hardcoded as literal expected-N assertions inside the gate
scripts themselves (they're organic — whatever `findPages()`/`defaultFiles()` returns) EXCEPT
`checkGroundTruthReproduction`'s ratio requirements and the `AW.GLYPHS===13` unit test (see §5).
So the honest integration rule is: **wire new pages into each `findPages()`/`listPages()` function,
run the gate, report whatever new totals it prints — never hand-edit a comment to claim a number
the gate itself didn't produce.**

---

## 4. `check-glyph-coverage.py` (`scripts/check-glyph-coverage.py`)

- Harvest sources (`harvest()`, lines 150-163): `learn.html`, sorted `lessons/*.html`, sorted
  `reviews/*.html`, `shared/awba-engine.js`. **New root pages (onboarding/practice/profile/more) are
  NOT in this list — they will NOT be scanned automatically.** Any new codepoint those pages render
  (a new Arabic word, a new special character, an emoji, etc.) must be added to the `sources` list
  in `harvest()` or the gate simply never sees it — it will pass falsely, not fail, so this is a
  silent gap the integration wave must close explicitly, not something that self-announces.
- Harvest method: character-level JS string-literal walk (`_js_string_contents`, skips `//`/`/* */`
  comments and unquoted code) + HTML text-node walk (`_html_text_nodes`, strips
  script/style/comment blocks) — never picks up comment-only prose/code notation.
- Role-stack fallback law (§2.2 in the file header): WORKHORSE = Readex (300/400/500/600/700) +
  Inter-400 (Latin baseline, union coverage); SCRIPTURE = Amiri Quran-400 + Amiri-400/700 (all
  Arabic, incl. rare Quranic annotation marks); workhorse Arabic-UI = Readex-400 alone, EXEMPT from
  the scripture-only mark ranges `(0x0610-0x061A, 0x0656-0x065F, 0x06D6-0x06ED, 0x08D3-0x08FF)`;
  MARGINALIA = Courier Prime-400 (must directly cover the 10 macron-vowel codepoints in
  `MACRON_VOWELS`); DISPLAY faces (Aref Ruqaa, Rakkas, Marcellus) exempt from rare marks, checked
  only for base-Arabic-letter coverage.
- Fails when: a harvested printing codepoint isn't covered by ANY face in its required stack — e.g.
  a new page rendering a novel Unicode character (new punctuation, an emoji, a new transliteration
  letter) with no covering face in the 14-face roster at `FONTS = "shared/fonts"`.
- `glyphCount==13` invariant — **this lives in `scripts/tests/components.test.js` line 128-136, NOT
  in `check-glyph-coverage.py`** (the two are different things: `check-glyph-coverage.py` audits
  FONT FILE cmap coverage; `components.test.js`'s `AW.GLYPHS` test audits the shared engine's
  in-JS SVG icon-glyph dictionary object). Exact assertion:
  `assert.equal(sandbox.__out.glyphCount, 13);` after `glyphCount: Object.keys(AW.GLYPHS).length`.
  If v2's new pages need a NEW icon not in the current 13-entry `AW.GLYPHS` set, this test's
  literal `13` must be bumped in the same commit that adds the icon — otherwise it's a guaranteed
  regression, not a maybe.

---

## 5. `scripts/tests/*.test.js` inventory (run via `node --test scripts/tests/*.test.js`)

15 files, 3138 total lines. Every count/invariant a v2 builder could accidentally break:

| File | Pins that could break |
|---|---|
| `components.test.js` (138L) | **`AW.GLYPHS` exactly 13 entries**, every value starts with `<svg` (line 128-136) — bump on new icon. |
| `learn-state.test.js` (210L) | **`NODE_ATOMS` sums to exactly 61 across exactly the 15 lesson ids** (line 39, `assert.equal(sum, 61)`), ids must equal the 15 `LESSON_IDS` sorted (line 47), no review/chest id ever appears in `NODE_ATOMS` (line 50). `AW.atomsDone` sums only starred lesson ids (line 74). `AW.dailyIndex` month-repeat-bug fix (line 93). **A new "atom" count (e.g. if practice/onboarding introduce taught atoms) must NOT silently change 61 without an explicit, deliberate edit to this test.** |
| `state-storage.test.js` (297L) | Legacy key migration: seeds `awba_noor, awba_returns, awba_lastDay, awba_days, awba_stars, awba_chest_u1c` and asserts lossless migration into `awba_state`; idempotent re-run; local-date-parts parsing (no UTC off-by-one); corrupted-entry tolerance (no throw). No literal "13 keys" count found anywhere in this file or `state-helpers.test.js` — the task brief's "localStorage==13" lead did not reproduce; the real fixed literal is `AW.GLYPHS===13` above, not a key-count. **Do not invent a localStorage-key-count invariant that doesn't exist in the current suite** — but any NEW localStorage key v2 introduces (profile/settings prefs, onboarding-seen flag, etc.) should follow the existing `awba_state`/`awba_prefs` versioned-blob pattern (FND-05/FND-06) rather than a new bare top-level key, to stay consistent with this migration test's shape. |
| `state-helpers.test.js` (162L) | `touchDay` streak logic (returns/lastDay/days array) — content-agnostic, page-count-agnostic. |
| `runner-math.test.js` (107L) | **Fixed engine constants**: `PER_LESSON=12, REFLECT=15, PER_REVIEW=15, SWIFT=5, QTIME=14` (line 40) + `lessonStars`/`comboShow` thresholds. A Practice page reusing scoring must not silently redefine these. |
| `runner-review.test.js` (97L) | `AW.QTIME=14`s timer, `AW.reviewScore` 20-in-time/15-late+swift5. |
| `runner-lesson.test.js` (271L) | `AwbaLesson` is a function on the engine; `AW.MLAB` fact/remember/fard/angle labels; `AW._beatHtml` verse scripture law (`.scard`, `--go:0`, lang/dir, source line, no celebration class). |
| `runner-interaction.test.js` (127L) | WR-02 flourish-timer clearTimeout bug fix; WR-03 depth-lens open handler doesn't re-wire. |
| `ring.test.js` (248L) | `ringSVG` determinism (same seed+progress → byte-identical SVG); different seed → different fingerprint; atomsDone 0 vs 61+4 (note: 61 taught + presumably +4 review atoms — cross-check against `learn-state.test.js`'s 61 if v2 touches atom totals). |
| `sky.test.js` (148L) | `skyTemp` 5 fixed-now fixtures → 5 temperatures; Fajr/Dhuhr/Maghrib/Isha window-boundary inclusivity. |
| `a11y-keyboard.test.js` (303L) | Every click control is a native `<button>`/`<a>` (no div-with-handler) — **applies to any new page's interactive elements**; zero positive `tabindex` anywhere in the shipped surface (learn.html + engine + every lesson + every review) — **a new page with a positive tabindex fails this categorically the moment it's added to the swept surface, if the test's file list is extended to include it.** Check whether this test's own file-glob needs the 4 new pages added — likely yes, since it names `learn.html`/lessons/reviews explicitly rather than globbing. |
| `a11y-announce.test.js` (334L), `a11y-dialogs.test.js` (317L), `learn-dom-flows.test.js` (227L) | **These 3 files spawn headless Chrome directly via `execFileSync` inside `node --test`** (`const CHROME = '/Applications/Google Chrome.app/...'`, guarded by a `skip` var when Chrome/target files are absent). This means running the full `node --test scripts/tests/*.test.js` glob ALREADY invokes Chrome 3+ times — never run this suite concurrently with `render-smoke.mjs`/`contrast-audit.mjs`/`rtl-audit.mjs` (which also invoke Chrome), and never run two of these processes in parallel. |
| `validate.test.js` (152L) | Exercises `scripts/validate-content.js`'s self-test fixtures (valid-lesson/valid-review/broken-lesson) — 0 errors / 0 errors / ≥3 named errors. |

**No test file was found hardcoding a literal "20 pages" or "46 entries" total.** The task brief's
lead on that point does not reproduce against the current repo; the two real hardcoded literals
that must be bumped deliberately when v2 adds content are: `AW.GLYPHS===13` (`components.test.js`)
and `NODE_ATOMS` sum `===61` (`learn-state.test.js`) — both are cross-checked, not guessed.
Also confirm/extend `a11y-keyboard.test.js`'s explicit page list (it does not appear to glob root
`*.html`) if v2's 4 new pages introduce any interactive controls — that test's "zero positive
tabindex ... across learn.html + the engine + every lesson + every review" phrasing (line 90-91
comment) implies a fixed file list that would need the new pages added to stay meaningful for them.

---

## 6. `port-audit.mjs` (`scripts/port-audit.mjs`)

- SHA-256 gates the cfg region (`AwbaLesson({...})`/`AwbaReview({...})`) of the **19 content files**
  (15 lessons + 4 reviews, via `listPages('lessons')` + `listPages('reviews')`) against the
  byte-identical region in Josh's Gen-3 source (`SOURCE_ROOT =
  '/Users/theshumba/Downloads/AWBA APP/_MVP-BUILD'`). Any drift → `BYTES DRIFT <page>`, non-zero
  exit.
- Plus the **DAILY-pool gate** (`checkDailyFidelity`, lines 74-97): a SEPARATE root-file compare —
  SHA-256s the `const DAILY=[ … ];` region inside root `learn.html` against the same region in the
  Gen-3 source `learn.html`, independent of the lessons/reviews page set, runs first, always.
- Also: zero-CDN check (`fonts\.googleapis` must not appear in lessons/reviews), retired-element
  check (`confetti|class="perfect"|class="combo"|poppins` must not appear), and the U4-03 sensitive
  hold (`u4-m4` file must be ABSENT — the absence itself IS the hold; presence = `HOLD VIOLATION`).
- Prints the 3 accepted `validate-content.js` note-warnings as `NOTE ACCEPTED` (exact strings, see
  §7) so no future run "fixes" them.
- **v2 must NOT touch any of these 19 lesson/review files, nor the DAILY region in `learn.html`** —
  they are Josh's byte-frozen content; a new Practice page must draw from a NEW derived pool (see
  next point), never mutate these.
- **Precedent for a future derived practice-pool gate**: `checkDailyFidelity`'s pattern —
  (1) locate a well-delimited region by regex (`const DAILY=\[[\s\S]*?\];`), (2) SHA-256 it,
  (3) compare against the SAME region extracted the SAME way from its declared source-of-truth
  file(s), (4) print `<NAME> BYTES OK`/`<NAME> BYTES DRIFT`, (5) run this check unconditionally
  even before the derived artifact exists (printing an "OK — not yet present" until it lands). A
  future `practice-pool-audit` gating a generated practice-question pool against its lesson/review
  sources should follow this exact shape: extract the pool via a stable delimiter, SHA-256 both
  sides, never let the pool's generator silently drift from the 19 frozen content files it draws
  from.

---

## 7. `validate-content.js` (`scripts/validate-content.js`)

- The 3 accepted `note:` warnings (verbatim, printed by `port-audit.mjs` too — never "fix" these,
  they are intentional unused-dictionary-entry warnings, not errors):
  ```
  NOTE ACCEPTED — u3-m1 unused ref baqarah-2-163
  NOTE ACCEPTED — u3-m3 unused ref imran-3-19
  NOTE ACCEPTED — u4-m2 unused term rububiyah
  ```
  (Raw `validate-content.js` output form is `note:  unused ref: refs["baqarah-2-163"] is never cited
  via AW.cite/data-ref` etc. — warnings never affect exit code, errors do.)
- **The `node:vm` ingest mechanism** (`ingest(file)`, lines 38-67) — the pattern to copy for a
  dev-time practice-pool extractor:
  1. Read the file's raw source; regex out the ONE inline (non-`src=`) `<script>` block:
     `/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/i`.
  2. Build a `vm.createContext(sandbox)` where the sandbox stubs exactly the globals the inline
     script calls: `AW.cite(id,label)` (returns the real `<span class="cite" data-ref="...">`
     markup shape so downstream ID-resolution regexes work identically to production) and
     `AwbaLesson(c){cfg=c}` / `AwbaReview(c){cfg=c}` capture functions (assign to a closure
     variable rather than doing anything with the object — the call itself is what the real page
     does; the sandbox just captures the argument instead of rendering it).
  3. `vm.runInContext(scriptBody, sandbox, {filename: file})` — never regex-parse the object
     literal itself; cfg is real JS with `AW.cite(...)` calls and string concatenation, not JSON.
  4. Read the captured `cfg`/`kind` closure variables after the run.
  A practice-pool extractor would follow the same shape: stub whatever global function the
  source files call to hand over their data (`AwbaLesson`/`AwbaReview` again, most likely, since
  practice items are presumably drawn FROM the 19 existing lesson/review cfgs), capture the cfg
  objects across all 19 files, then transform/derive a pool from the captured beats/items — never
  regex-scraping the HTML source text directly for question data.
- ID-resolution check walks RAW captured strings (`collectStrings`, never `JSON.stringify(cfg)`)
  because `JSON.stringify` escapes quotes and silently finds zero `data-ref`/`data-term` ids
  (documented "Pitfall 2") — apply the same raw-string-walk discipline in any new extractor that
  needs to find embedded markup ids inside captured cfg.
- Contract: `BEAT_TYPES = ['read','frame','verse','panel','depth','reflect','mc','tf','tile']`,
  `PANEL_VARIANTS = ['pull','tell','guard','check']`, `DEPTH_LENSES = ['reality','revelation','ruling']`,
  `MARKER_TYPES = ['fact','remember','fard','angle']` — the full shape any practice-pool extractor
  reading `mc`/`tf`/`tile` beats must respect (e.g. `tile.solution` is a SUBSET-of-`bank` check,
  not equal-length).
- Default files: `lessons/*.html` + `reviews/*.html` only (`defaultFiles()`, lines 352-369) — **new
  root pages are NOT validated by this tool** unless explicitly passed as CLI argv
  (`node scripts/validate-content.js <files...>`), since it has no `AwbaLesson`/`AwbaReview` config
  contract to check on a settings/profile page anyway.

---

## 8. The gated-literal sweep (banned literals, scoped files)

Exact form found in `06-07-SUMMARY.md` (Phase 6 gate) and echoed in `07-03-SUMMARY.md` (Phase 7
gate) — the retired-Gen-3-vocabulary / celebration-primitive sweep run against the shipped surface:

> No gated literal in `learn.html` / `shared/awba-engine.js` / `shared/awba-engine.css`
> (`fonts.googleapis`, `confetti`, `class="perfect"`, `class="combo"`, `poppins`, `lantern-gold`,
> `gold-bg` all absent).

Scoped files: `learn.html`, `shared/awba-engine.js`, `shared/awba-engine.css` (the Phase 6/7 sweep
scope) — separately, `port-audit.mjs`'s own retired-element check scopes `lessons/` + `reviews/`
with a narrower literal set: `confetti|class="perfect"|class="combo"|poppins` (no
`lantern-gold`/`gold-bg` in that particular script — those two are additional literals the
Phase 6/7 human/gate sweep checked on top of `port-audit.mjs`'s programmatic set). Run via `grep`
equivalent (`grepFindsMatch` in `port-audit.mjs`, or an ad-hoc `grep -rqiE` for the wider Phase 6/7
list) — **any new v2 page must be added to this sweep's file scope** (grep it against
onboarding/practice/profile/more.html too) since none of these tools currently include them.
Remember this machine's grep is `ugrep`: a pattern starting with `-` needs `--` or paren-wrapping.

---

## 9. Test command law

- Full unit-test suite: **`node --test scripts/tests/*.test.js`** (glob form — README.md line 64
  confirms this exact invocation; Node v24 supports the glob expansion via shell, not a Node
  built-in glob flag). This is a SEPARATE invocation from the 5 standing gate scripts (render-smoke,
  contrast-audit, rtl-audit, pwa-audit, port-audit) and from `check-glyph-coverage.py` —
  README.md's full command block:
  ```
  node scripts/validate-content.js lessons/*.html reviews/*.html
  node scripts/tests/render-smoke.mjs
  node scripts/port-audit.mjs
  node scripts/tests/contrast-audit.mjs
  node scripts/tests/rtl-audit.mjs
  python3 scripts/check-glyph-coverage.py
  node scripts/tests/pwa-audit.mjs
  node --test scripts/tests/*.test.js
  ```
- **Chrome-spawning members of the `node --test` glob**: `a11y-announce.test.js`,
  `a11y-dialogs.test.js`, `learn-dom-flows.test.js` — each spawns
  `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` headless via `execFileSync`,
  guarded by a `skip` flag when Chrome or the target page is missing.
- **Never run any two of these concurrently** — `render-smoke.mjs`, `contrast-audit.mjs`,
  `rtl-audit.mjs`, AND the `node --test` glob (via its 3 Chrome-spawning files) all shell out to
  system Chrome headless. Running them in parallel processes causes flaky Chrome contention
  (per this task's own operating rule) — run them sequentially, one at a time, always.
