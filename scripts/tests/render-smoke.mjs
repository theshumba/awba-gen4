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
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CONSOLE_ISSUE_RE = /Uncaught|AW is not defined|SEVERE/;
const REGISTER_ROOT_RE = /class="[^"]*\breg-(page|orbit)\b[^"]*"/;

function findPages() {
  const pages = [];
  const rootLearn = path.join(ROOT, 'learn.html');
  if (existsSync(rootLearn)) pages.push(rootLearn); // Pitfall 7 — the root front door joins the
  // smoke set the moment 05-02 creates it; skipped (not yet present) until then. Register-root
  // regex already matches reg-orbit — no regex change needed.
  for (const dir of ['lessons', 'reviews']) {
    const abs = path.join(ROOT, dir);
    if (!existsSync(abs)) continue;
    for (const f of readdirSync(abs)) {
      if (f.endsWith('.html')) pages.push(path.join(abs, f));
    }
  }
  return pages;
}

function loadInChrome(pagePath) {
  const fileUrl = 'file://' + pagePath;
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
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 20000, maxBuffer: 1024 * 1024 * 32 }
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
  process.exit(allOk ? 0 : 1);
}

main();
