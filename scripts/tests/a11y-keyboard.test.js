/* ============================================================================================
   a11y-keyboard.test.js  ·  Awba Gen-4 — ACC-01 keyboard/focus probe (D-62 / D-68, Wave 0)
   --------------------------------------------------------------------------------------------
   A PERMANENT suite member (D-68) that pins the shipped-correct ACC-01 baseline as ACTIVE
   assertions and stages the not-yet-built gaps as todo-gated assertions (the node:test `todo`
   option), so the suite reports `fail 0` today while the contract is fully written. Each
   downstream implementation plan (06-05, 06-06) un-todos exactly its own assertions with a
   RED→GREEN flip.

   Automation boundary (06-RESEARCH §Keyboard-Walk Probe, empirically verified this session):
   synthetic KeyboardEvent('Tab') does NOT move focus (isTrusted=false) — real Tab traversal is
   not drivable, so this probe asserts DOM-order + zero-positive-tabindex instead. Programmatic
   `el.focus()` DOES register as `:focus-visible` in headless Chrome (assertable). Synthetic
   Enter does NOT click a button — flows are driven via `.click()`, the proven harness verb.

   Harness shell copied byte-faithfully from `scripts/tests/learn-dom-flows.test.js`: a throwaway
   copy of the real page with an injected driver `<script>` before `</body>`, run in system
   headless Chrome, JSON results block round-tripped out via `--dump-dom`, cleaned up in `finally`.

   Todo-staging contract (the phase's residue ledger depends on this exact count): FOUR todo
   blocks — three flip in 06-06 (node state-in-name, native streak strip, native ayah affordance),
   one flips in 06-05 (the aria-pressed selection cue). No test here combines the `skip` option
   with the `todo` option — a todo assertion that needs Chrome early-returns in its own body
   instead.

   Runs only via the glob:  node --test scripts/tests/*.test.js
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { existsSync, readFileSync, writeFileSync, unlinkSync, readdirSync } = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const LEARN = path.join(ROOT, 'learn.html');
const ENGINE_JS = path.join(ROOT, 'shared', 'awba-engine.js');
const LESSON_SOURCE = path.join(ROOT, 'lessons', 'u1-m1.html');
// v2 surfaces (Wave-C §9.3.5) — swept for native controls + zero positive tabindex alongside the shipped set.
const ONBOARDING = path.join(ROOT, 'onboarding.html');
const PRACTICE = path.join(ROOT, 'practice.html');
const PROFILE = path.join(ROOT, 'profile.html');
const MORE = path.join(ROOT, 'more.html');

/* the canonical CNT-03 unlock-sequence — the .onode DOM-order assertion (interfaces block,
   cross-checked against learn-state.test.js's own FLAT list). */
const CANONICAL_JOURNEY = [
  'u1m1', 'u1m2', 'u1m3', 'u1m4', 'u1r', 'u1c',
  'u2m1', 'u2m2', 'u2m3', 'u2m3b', 'u2r', 'u2c',
  'u3m1', 'u3m2', 'u3m3', 'u3r', 'u3c',
  'u4m1', 'u4m2', 'u4m2b', 'u4m3', 'u4r', 'u4c',
];

function listHtml(dir) {
  const abs = path.join(ROOT, dir);
  if (!existsSync(abs)) return [];
  // dot-prefixed entries are transient harness probes (.a11yan-*/.contrast-probe-* etc.) another
  // concurrently-running test file may write+unlink mid-sweep — never treat one as an app page
  return readdirSync(abs).filter((f) => f.endsWith('.html') && !f.startsWith('.')).map((f) => path.join(abs, f));
}

const chromeMissing = !existsSync(CHROME) || !existsSync(LEARN) || !existsSync(LESSON_SOURCE);
const skip = chromeMissing ? 'system Chrome, learn.html, or a lesson page not found — interactive harness unavailable' : false;

/* ============================================================================================
   PART A — static native-semantics + zero-positive-tabindex scan (no Chrome needed: the plain
   emitter source strings + DOM order are enough to prove this without spawning a browser).
   ============================================================================================ */

/* Every SHIPPED interactive control's emitter, cross-checked against 06-RESEARCH §Inventory's
   ✓ rows — the two known gaps (#streakStrip, #ayahHost) are DELIBERATELY excluded here; they are
   pinned separately below as the todo-gated conversions (D-62's "the two exceptions"). */
const NATIVE_EMITTER_CHECKS = [
  { file: ENGINE_JS, re: /<button class="opt" type="button" data-i="/, label: 'the lesson mc quiz option (.opt)' },
  { file: ENGINE_JS, re: /<button class="tf" type="button" data-v="true">/, label: 'the true/false quiz option (.tf)' },
  { file: ENGINE_JS, re: /<button class="tile" type="button" data-w="/, label: 'the tile-builder quiz option (.tile)' },
  { file: ENGINE_JS, re: /'<button class="btn ' \+ \(cls \|\| ''\) \+ '" id="'/, label: 'the shared Continue/Check/retry .btn helper' },
  { file: ENGINE_JS, re: /function muteBtnHtml\(\) \{[\s\S]{0,400}?<button class="ls-mute"/, label: 'the shared 44px mute toggle' },
  { file: LEARN, re: /<button class="onode" type="button" data-id="/, label: 'the .onode path stations' },
  { file: LEARN, re: /<button class="hstat" id="hudReturns" type="button"/, label: 'the returns HUD stat' },
  { file: LEARN, re: /<button class="hstat" id="hudNoor" type="button"/, label: 'the noor HUD stat' },
  { file: LEARN, re: /<button class="oh-chip" id="courseChip" type="button"/, label: 'the course chip' },
  { file: LEARN, re: /return '<button class="tab' \+/, label: 'the tab bar' },
  { file: LEARN, re: /<a class="btn ghost cc-go" href="/, label: 'the continue-card CTA' },
  { file: LEARN, re: /<button class="btn ofest-close" type="button">/, label: 'the Festival dismiss control' },
];

test('every shipped click/interaction control across learn.html + the engine emitters is a native <button> or <a> — no div-with-handler retrofit', () => {
  NATIVE_EMITTER_CHECKS.forEach((c) => {
    const src = readFileSync(c.file, 'utf8');
    assert.match(src, c.re, c.label + ' must be emitted as a native <button>/<a>, never a div-with-handler retrofit');
  });
});

test('zero positive tabindex exists anywhere in the shipped surface (learn.html, the v2 surfaces, the engine, every lesson, every review, the drill)', () => {
  const POSITIVE_TABINDEX_RE = /tabindex="[1-9][0-9]*"/;
  const files = [LEARN, ONBOARDING, PRACTICE, PROFILE, MORE, ENGINE_JS, ...listHtml('lessons'), ...listHtml('reviews'), ...listHtml('practice')];
  assert.ok(files.length > 3, 'the sweep found lesson/review/practice pages to scan');
  files.forEach((f) => {
    const src = readFileSync(f, 'utf8');
    assert.doesNotMatch(src, POSITIVE_TABINDEX_RE, path.relative(ROOT, f) + ' must never carry a positive tabindex (DOM order = tab order, D-62)');
  });
});

test('the v2 surfaces (onboarding/practice/profile/more + the drill) use native controls only — no div/span-with-handler or role="button" retrofit', () => {
  const v2 = [ONBOARDING, PRACTICE, PROFILE, MORE, ...listHtml('practice')];
  assert.ok(v2.length >= 5, 'the v2 surface sweep found its pages (4 root + the drill session)');
  const INLINE_HANDLER_RE = /<(?:div|span|li|p|section|nav)\b[^>]*\son(?:click|keydown|keyup|keypress)=/i;
  const DIV_ROLE_BUTTON_RE = /<(?:div|span|li|p)\b[^>]*\brole="button"/i;
  v2.forEach((f) => {
    const src = readFileSync(f, 'utf8');
    assert.doesNotMatch(src, INLINE_HANDLER_RE, path.relative(ROOT, f) + ' must not wire a non-native element with an inline click/key handler (use a native <button>/<a>)');
    assert.doesNotMatch(src, DIV_ROLE_BUTTON_RE, path.relative(ROOT, f) + ' must not retrofit a div/span as role="button" — use a native <button>');
  });
});

test('the reflect textarea carries a real native label (D-64 verify-only item — already shipped)', () => {
  const src = readFileSync(ENGINE_JS, 'utf8');
  assert.match(src, /<label for="lsrt">/, 'the reflect textarea must be labelled via a real <label for="lsrt">, not a bare placeholder');
  assert.match(src, /<textarea id="lsrt"/, 'the labelled textarea itself must carry the matching id');
});

/* ============================================================================================
   PART B — Chrome-driven register-token / DOM-order / gap probes. Two throwaway copies (learn.html
   at repo root, a lesson page inside lessons/ so its ../shared/ asset paths keep resolving) with an
   injected driver before </body>; a single cached Chrome run per copy (Chrome is slow).
   ============================================================================================ */

/* the learn.html driver — focus-visible register token (gold on Orbit) + the .onode DOM order +
   the three not-yet-built gap probes (state-in-name, streak-strip nativeness, ayah inner button). */
const LEARN_DRIVER = [
  '<script>',
  "window.addEventListener('load', function () {",
  '  var R = {};',
  '  try {',
  "    var ref = document.createElement('span');",
  "    ref.style.position = 'absolute'; ref.style.left = '-9999px'; ref.style.top = '-9999px';",
  "    ref.style.color = 'var(--gold)';",
  '    document.body.appendChild(ref);',
  '    var goldRGB = getComputedStyle(ref).color;',
  '',
  "    var node = document.querySelector('.onode');",
  '    var fv = null, outlineStyle = null, outlineColor = null;',
  '    if (node) {',
  '      node.focus();',
  "      fv = node.matches(':focus-visible');",
  '      var cs = getComputedStyle(node);',
  '      outlineStyle = cs.outlineStyle;',
  '      outlineColor = cs.outlineColor;',
  '    }',
  '    R.focusVisible = { fv: fv, outlineStyle: outlineStyle, outlineColor: outlineColor, goldRGB: goldRGB };',
  '',
  "    R.journeyOrder = Array.prototype.map.call(document.querySelectorAll('.onode[data-id]'), function (n) {",
  "      return n.getAttribute('data-id');",
  '    });',
  '',
  "    var firstNode = document.querySelector('.onode');",
  "    R.firstNodeAriaLabel = firstNode ? firstNode.getAttribute('aria-label') : null;",
  "    R.firstNodeState = firstNode ? firstNode.getAttribute('data-nstate') : null;",
  "    R.firstNodeKind = firstNode ? firstNode.getAttribute('data-kind') : null;",
  '',
  "    var strip = document.getElementById('streakStrip');",
  '    R.streakStripTag = strip ? strip.tagName : null;',
  '',
  "    var ayah = document.getElementById('ayahHost');",
  "    R.ayahCiteButton = ayah ? !!ayah.querySelector('button.oayah-cite') : null;",
  '  } catch (e) { R.driverError = String((e && e.message) || e); }',
  "  var s = document.createElement('script');",
  "  s.type = 'application/json'; s.id = 'a11ykb-learn-results';",
  '  s.textContent = JSON.stringify(R);',
  '  document.body.appendChild(s);',
  "  document.title = 'A11YKB-LEARN-DONE';",
  '});',
  '</scr' + 'ipt>',
].join('\n');

/* the lesson driver (u1-m1.html) — six real .click()s through the opener + read + depth + the
   two-click reflect reveal/advance + one more read beat lands EXACTLY on the mc quiz beat (verified
   against the real beats array: read, depth, reflect, read, mc, panel, tf). Then: focus-visible
   register token (crimson on Page) + the aria-pressed selection-cue gap probe. */
const LESSON_DRIVER = [
  '<script>',
  "window.addEventListener('load', function () {",
  '  var R = {};',
  '  function click(sel) { var el = document.querySelector(sel); if (el) el.click(); return el; }',
  '  try {',
  "    click('#cont');",
  "    click('#cont');",
  "    click('#cont');",
  "    click('#cont');",
  "    click('#cont');",
  "    click('#cont');",
  '',
  "    var ref = document.createElement('span');",
  "    ref.style.position = 'absolute'; ref.style.left = '-9999px'; ref.style.top = '-9999px';",
  "    ref.style.color = 'var(--crimson)';",
  '    document.body.appendChild(ref);',
  '    var crimsonRGB = getComputedStyle(ref).color;',
  '',
  "    var opt = document.querySelector('.opt[data-i=\"3\"]');",
  '    var fv = null, outlineStyle = null, outlineColor = null;',
  '    if (opt) {',
  '      opt.focus();',
  "      fv = opt.matches(':focus-visible');",
  '      var cs = getComputedStyle(opt);',
  '      outlineStyle = cs.outlineStyle;',
  '      outlineColor = cs.outlineColor;',
  '    }',
  '    R.focusVisible = { fv: fv, outlineStyle: outlineStyle, outlineColor: outlineColor, crimsonRGB: crimsonRGB };',
  '',
  '    if (opt) opt.click();',
  "    R.selectedAriaPressed = opt ? opt.getAttribute('aria-pressed') : null;",
  '  } catch (e) { R.driverError = String((e && e.message) || e); }',
  "  var s = document.createElement('script');",
  "  s.type = 'application/json'; s.id = 'a11ykb-lesson-results';",
  '  s.textContent = JSON.stringify(R);',
  '  document.body.appendChild(s);',
  "  document.title = 'A11YKB-LESSON-DONE';",
  '});',
  '</scr' + 'ipt>',
].join('\n');

function runProbe(sourcePath, driver, probePath, resultId, doneTitle) {
  const html = readFileSync(sourcePath, 'utf8');
  writeFileSync(probePath, html.replace('</body>', driver + '\n</body>'));
  try {
    let stdout = '';
    try {
      stdout = execFileSync(
        CHROME,
        // ?begin=1 short-circuits learn.html's §0.4 first-run redirect guard so the probe renders the
        // real page instead of bouncing to onboarding.html (harmless for the lesson probe, which has no guard).
        ['--headless', '--disable-gpu', '--enable-logging=stderr', '--v=1', '--virtual-time-budget=5000', '--dump-dom', 'file://' + probePath + '?begin=1'],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 30000, killSignal: 'SIGKILL', maxBuffer: 1024 * 1024 * 64 }
      );
    } catch (e) {
      stdout = e.stdout ? e.stdout.toString() : '';
    }
    const re = new RegExp('<script type="application/json" id="' + resultId + '">([\\s\\S]*?)<\\/script>');
    const m = stdout.match(re);
    return { results: m ? JSON.parse(m[1]) : null, ranToCompletion: stdout.indexOf(doneTitle) !== -1 };
  } finally {
    try { unlinkSync(probePath); } catch (e) { /* nothing to clean */ }
  }
}

const learnProbePath = path.join(ROOT, '.a11ykb-learn-probe.html');
const lessonProbePath = path.join(ROOT, 'lessons', '.a11ykb-lesson-probe.html');

const learnRun = chromeMissing ? null : runProbe(LEARN, LEARN_DRIVER, learnProbePath, 'a11ykb-learn-results', 'A11YKB-LEARN-DONE');
const lessonRun = chromeMissing ? null : runProbe(LESSON_SOURCE, LESSON_DRIVER, lessonProbePath, 'a11ykb-lesson-results', 'A11YKB-LESSON-DONE');
const learnResult = learnRun && learnRun.results;
const lessonResult = lessonRun && lessonRun.results;

/* ---------- ACTIVE (Chrome-driven): the register-aware :focus-visible grammar applies ---------- */

test('the learn.html interactive harness drives the shipped inline script to completion', { skip }, () => {
  assert.ok(learnRun, 'the learn.html probe produced a run');
  assert.equal(learnRun.ranToCompletion, true, 'the injected driver reached its final stamp');
  assert.ok(learnResult, 'the driver published a results block');
  assert.equal(learnResult.driverError, undefined, 'the learn.html driver ran without an unexpected error');
});

test('the lesson interactive harness drives the shipped inline script to completion', { skip }, () => {
  assert.ok(lessonRun, 'the lesson probe produced a run');
  assert.equal(lessonRun.ranToCompletion, true, 'the injected driver reached its final stamp');
  assert.ok(lessonResult, 'the driver published a results block');
  assert.equal(lessonResult.driverError, undefined, 'the lesson driver ran without an unexpected error');
});

test('register-aware :focus-visible applies the gold token on the Orbit ground (learn.html, D-62/S1)', { skip }, () => {
  assert.ok(learnResult, 'the learn.html driver produced a run');
  const fv = learnResult.focusVisible;
  assert.ok(fv, 'a focusable .onode station was found');
  assert.equal(fv.fv, true, 'programmatic focus registers as :focus-visible in headless Chrome');
  assert.notEqual(fv.outlineStyle, 'none', 'a visible outline is drawn on focus');
  assert.equal(fv.outlineColor, fv.goldRGB, 'the Orbit ground resolves the focus ring to the live --gold token, never a hardcoded hex');
});

test('register-aware :focus-visible applies the crimson token on the Page ground (a lesson, D-62/S1)', { skip }, () => {
  assert.ok(lessonResult, 'the lesson driver produced a run');
  const fv = lessonResult.focusVisible;
  assert.ok(fv, 'a focusable .opt quiz option was found');
  assert.equal(fv.fv, true, 'programmatic focus registers as :focus-visible in headless Chrome');
  assert.notEqual(fv.outlineStyle, 'none', 'a visible outline is drawn on focus');
  assert.equal(fv.outlineColor, fv.crimsonRGB, 'the Page ground resolves the focus ring to the live --crimson token, never a hardcoded hex');
});

test('the .onode DOM order equals the canonical CNT-03 journey sequence (DOM order = tab order, D-62)', { skip }, () => {
  assert.ok(learnResult, 'the learn.html driver produced a run');
  assert.deepEqual(learnResult.journeyOrder, CANONICAL_JOURNEY, 'the path renders nodes in unlock-sequence DOM order, never reordered');
});

/* ---------- TODO (exactly FOUR — the phase's residue ledger depends on this exact count) ---------- */

test('ACC-01: each .onode carries a state-in-name aria-label ("{label}, {state phrase}") — lands in 06-06', () => {
  if (chromeMissing) return;
  assert.ok(learnResult, 'the learn.html driver produced a run');
  // u1m1 on fresh storage is the lesson's first, active node — 06-UI-SPEC's Node state-phrase
  // table composes "{label}, available" for a lesson in the active state.
  const label = learnResult.firstNodeAriaLabel || '';
  assert.equal(learnResult.firstNodeState, 'active', 'the probe assumes fresh-storage default state for u1m1 (sanity check)');
  assert.equal(label, 'What sound belief is, available', 'the node aria-label must compose label + its state phrase');
});

test('ACC-01: #streakStrip is a native <button>, not a role="button" DIV with dead Enter/Space — lands in 06-06', () => {
  if (chromeMissing) return;
  assert.ok(learnResult, 'the learn.html driver produced a run');
  assert.equal(learnResult.streakStripTag, 'BUTTON', '#streakStrip must be a native <button>, never a role="button" DIV');
});

test('ACC-01: the daily ayah card exposes a native inner citation button (R-9: button.oayah-cite) — lands in 06-06', () => {
  if (chromeMissing) return;
  assert.ok(learnResult, 'the learn.html driver produced a run');
  assert.equal(learnResult.ayahCiteButton, true, 'a native "Read the citation" button must exist inside #ayahHost — the section itself keeps its scripture semantics (R-9), the button owns keyboard/SR');
});

test('ACC-01: selecting an .opt/.tf/.tile sets aria-pressed="true" as a non-colour selection cue (R-11) — lands in 06-05', () => {
  if (chromeMissing) return;
  assert.ok(lessonResult, 'the lesson driver produced a run');
  assert.equal(lessonResult.selectedAriaPressed, 'true', 'a selected quiz option must carry aria-pressed="true" — the border-recolour alone is a hue-only signal (WCAG 1.4.1)');
});
