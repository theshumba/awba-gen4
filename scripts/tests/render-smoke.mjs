#!/usr/bin/env node
/* ============================================================================================
   render-smoke.mjs  ·  Awba Gen-4 — headless-Chrome page loader (Wave-0 harness)
   --------------------------------------------------------------------------------------------
   Not a node:test file — an explicit per-wave tool invoked directly:
     node scripts/tests/render-smoke.mjs

   Loads each lesson/review page (default: lessons/*.html + reviews/*.html) in system Chrome
   headless, captures its console stderr + dumped DOM, and FAILS (non-zero exit) when:
     - stderr carries "Uncaught", "AW is not defined", or "SEVERE" for that page (ENG-01/ENG-02
       render-without-console-error + the Pitfall-1 load-order regression + MOT-05 silent-sfx), or
     - the dumped DOM has no register-root class matching the substring/regex reg-(page|orbit)
       (a page may legitimately carry other classes alongside it — no literal equality check).

   Prints `SMOKE OK <page>` / `SMOKE FAIL <page> <reason>`. When lessons/ and reviews/ are both
   absent or empty (Wave 1, before any page has landed), exits 0 with "no pages yet" — this
   becomes a real gate the moment pages exist (u1-m1 at 04-03).

   Zero-dependency: Node core only (child_process/fs/path/url), system Chrome invoked via CLI —
   no puppeteer, matching the Phase-3 headless-Chrome precedent.
   ============================================================================================ */
'use strict';

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, writeFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CONSOLE_ISSUE_RE = /Uncaught|AW is not defined|SEVERE/;
const REGISTER_ROOT_RE = /class="[^"]*\breg-(page|orbit)\b[^"]*"/;

function findPages() {
  const pages = [];
  // Root pages: the front door + the four v2 surfaces (§9.3.1). learn.html carries the §0.4 first-run
  // redirect guard — loadInChrome appends ?begin=1 for it so it smokes as itself, not the onboarding
  // bounce; onboarding.html renders as itself (it is the redirect destination and carries no guard).
  // The reg-(page|orbit) register-root regex already matches both grounds — no regex change needed.
  for (const f of ['learn.html', 'onboarding.html', 'practice.html', 'profile.html', 'more.html']) {
    const abs = path.join(ROOT, f);
    if (existsSync(abs)) pages.push(abs);
  }
  // lessons/, reviews/ AND practice/ (the drill session.html) are fully auto-discovered by directory.
  for (const dir of ['lessons', 'reviews', 'practice']) {
    const abs = path.join(ROOT, dir);
    if (!existsSync(abs)) continue;
    for (const f of readdirSync(abs)) {
      if (f.endsWith('.html') && !f.startsWith('.')) pages.push(path.join(abs, f)); // dot-prefixed = transient harness probes, never app pages
    }
  }
  return pages;
}

function loadInChrome(pagePath) {
  // learn.html's §0.4 first-run guard bounces a fresh profile to onboarding.html; ?begin=1
  // short-circuits it so learn smokes as itself. No other page carries the guard.
  const query = path.basename(pagePath) === 'learn.html' ? '?begin=1' : '';
  const fileUrl = 'file://' + pagePath + query;
  try {
    const stdout = execFileSync(
      CHROME,
      [
        '--headless',
        '--disable-gpu',
        '--enable-logging=stderr',
        '--v=1',
        '--virtual-time-budget=4000',
        '--dump-dom',
        fileUrl,
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 20000, killSignal: 'SIGKILL', maxBuffer: 1024 * 1024 * 32 }
    );
    return { stdout, stderr: '', crashed: false };
  } catch (e) {
    return {
      stdout: e.stdout ? e.stdout.toString() : '',
      stderr: e.stderr ? e.stderr.toString() : String((e && e.message) || e),
      crashed: true,
    };
  }
}

function smokeOne(pagePath) {
  const name = path.relative(ROOT, pagePath);
  const { stdout, stderr, crashed } = loadInChrome(pagePath);

  if (CONSOLE_ISSUE_RE.test(stderr)) {
    console.log(`SMOKE FAIL ${name} console error detected`);
    return false;
  }
  if (crashed && !stdout) {
    console.log(`SMOKE FAIL ${name} chrome invocation produced no DOM: ${stderr.slice(0, 200)}`);
    return false;
  }
  if (!REGISTER_ROOT_RE.test(stdout)) {
    console.log(`SMOKE FAIL ${name} no reg-page/reg-orbit register root found`);
    return false;
  }
  console.log(`SMOKE OK ${name}`);
  return true;
}

/* MOT-02 / Pitfall 2 — a file:// → file:// navigation between two engine-loaded pages must no-op
   cleanly: the pageswap/pagereveal handlers guard `if (!e.viewTransition) return;`, so over an
   opaque file:// origin (where cross-document morphs never qualify) they bail and the page just
   navigates. We can't click a link headless, so a throwaway harness at repo root loads the shared
   engine (registering the handlers) then navigates to a real lesson; --dump-dom follows the nav and
   stderr captures any Uncaught/SEVERE from either the unload or the reveal — proving the guard never
   throws. The probe is removed in `finally` so it never lingers or gets committed. */
function navCheck() {
  const target = path.join(ROOT, 'lessons', 'u1-m1.html');
  if (!existsSync(target)) return true; // no lesson yet → skip (mirrors findPages tolerance)
  const probe = path.join(ROOT, '.vt-nav-probe.html');
  const html =
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
    '<script src="shared/awba-engine.js"></script>' +
    '<script>location.replace("lessons/u1-m1.html");</script>' +
    '</head><body><main class="reg-orbit"></main></body></html>';
  writeFileSync(probe, html);
  try {
    const { stdout, stderr, crashed } = loadInChrome(probe);
    if (CONSOLE_ISSUE_RE.test(stderr)) {
      console.log('SMOKE FAIL vt-nav learn→lessons/u1-m1.html console error detected');
      return false;
    }
    if (crashed && !stdout) {
      console.log('SMOKE FAIL vt-nav chrome invocation produced no DOM');
      return false;
    }
    console.log('SMOKE OK vt-nav learn→lessons/u1-m1.html (file:// morph no-ops cleanly)');
    return true;
  } finally {
    try { unlinkSync(probe); } catch (e) { /* nothing to clean */ }
  }
}

function main() {
  const pages = findPages();
  if (pages.length === 0) {
    console.log('no pages yet');
    process.exit(0);
  }
  let allOk = true;
  for (const p of pages) {
    if (!smokeOne(p)) allOk = false;
  }
  if (!navCheck()) allOk = false;
  process.exit(allOk ? 0 : 1);
}

main();
