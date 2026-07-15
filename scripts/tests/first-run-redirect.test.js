/* ============================================================================================
   first-run-redirect.test.js  ·  Awba Gen-4 v2 — the §0.4 first-run guard (Wave-C §9.4)
   --------------------------------------------------------------------------------------------
   Drives the REAL learn.html in system Chrome headless (throwaway probe at repo root, removed in
   `finally`) to prove the loop-proof first-run redirect end-to-end:
     - a fresh visitor (onboardingDone unset, no ?begin=1)  → lands on onboarding.html
     - learn.html?begin=1                                    → stays on learn (the loop-breaker)
     - onboardingDone already set (seeded pre-IIFE)          → stays on learn (no redirect)
   Each probe runs in a fresh ephemeral Chrome profile (no --user-data-dir), so localStorage never
   leaks between cases. Guarded by `skip` when Chrome/learn.html are absent. Zero npm deps.
   ============================================================================================ */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { existsSync, readFileSync, writeFileSync, unlinkSync } = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const LEARN = path.join(ROOT, 'learn.html');

const chromeMissing = !existsSync(CHROME) || !existsSync(LEARN);
const skip = chromeMissing ? 'system Chrome or learn.html not found — headless redirect harness unavailable' : false;

/* onboarding.html renders `.onb-wrap`; learn.html renders `.otabs`. These are page-unique markers. */
const LANDED_ON_ONBOARDING = /class="onb-wrap"/;
const LANDED_ON_LEARN = /class="otabs"/;

function loadLearn(probeName, query, preIifeSeed) {
  let html = readFileSync(LEARN, 'utf8');
  if (preIifeSeed) {
    // inject a seed right after the engine <script src=...> (BEFORE learn's own IIFE) so AW.prefs
    // is already set when the §0.4 guard reads it.
    const engineTagRe = /<script src="[^"]*awba-engine\.js"><\/script>/;
    html = html.replace(engineTagRe, (m) => m + '\n' + preIifeSeed);
  }
  const probe = path.join(ROOT, probeName);
  writeFileSync(probe, html);
  try {
    return execFileSync(
      CHROME,
      ['--headless', '--disable-gpu', '--virtual-time-budget=4000', '--dump-dom', 'file://' + probe + (query || '')],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 30000, maxBuffer: 1024 * 1024 * 32 }
    );
  } catch (e) {
    return e.stdout ? e.stdout.toString() : '';
  } finally {
    try { unlinkSync(probe); } catch (e) { /* nothing to clean */ }
  }
}

test('first-run: a fresh visitor to learn.html is redirected to onboarding.html', { skip }, () => {
  const dom = loadLearn('.fr-fresh-probe.html', '', null);
  assert.match(dom, LANDED_ON_ONBOARDING, 'a fresh profile (onboardingDone unset) must land on onboarding.html');
  assert.doesNotMatch(dom, LANDED_ON_LEARN, "learn's tab bar must not render — it returned out of the IIFE before #app");
});

test('first-run: learn.html?begin=1 short-circuits the guard and stays on learn', { skip }, () => {
  const dom = loadLearn('.fr-begin-probe.html', '?begin=1', null);
  assert.match(dom, LANDED_ON_LEARN, '?begin=1 must keep the visitor on learn.html even with onboardingDone unset');
  assert.doesNotMatch(dom, LANDED_ON_ONBOARDING, 'onboarding must not render when ?begin=1 is present');
});

test('first-run: with onboardingDone set, learn.html stays (no redirect)', { skip }, () => {
  const seed = "<script>try { AW.prefs.set('onboardingDone', true); } catch (e) {} </scr" + "ipt>";
  const dom = loadLearn('.fr-done-probe.html', '', seed);
  assert.match(dom, LANDED_ON_LEARN, 'onboardingDone=true must keep the visitor on learn.html');
  assert.doesNotMatch(dom, LANDED_ON_ONBOARDING, 'onboarding must not render once onboardingDone is set');
});
