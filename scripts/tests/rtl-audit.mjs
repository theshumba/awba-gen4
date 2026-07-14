#!/usr/bin/env node
/* ============================================================================================
   rtl-audit.mjs  ·  Awba Gen-4 — the permanent RTL / bidi census (D-66 / CNT-04)
   --------------------------------------------------------------------------------------------
   Not a node:test file — a standing exit-code gate invoked directly, joining the full-suite
   command alongside render-smoke:
       node scripts/tests/rtl-audit.mjs

   It DOM-walks every rendered page (learn.html + lessons/*.html + reviews/*.html = 20 pages) plus
   the neutral typographic fixture (scripts/fixtures/typo-stress.html) in system Chrome headless,
   and for each page injects a read-only driver that proves, from COMPUTED styles on the real DOM:

     (a) every element whose direct text carries an Arabic-range codepoint has closest('[lang="ar"]')
         — no Arabic run is left untagged;
     (b) every element with lang="ar" computes unicode-bidi: isolate (or isolate-override) — the
         isolation that keeps mixed Arabic/Latin lines from scrambling (this pins the fixture's
         mixed-bidi spans and every shipped Arabic run);
     (c) every .ayah / .scripture container computes direction: rtl AND unicode-bidi: isolate;
     (d) every .ayah container computes a font-family beginning "Amiri Quran" (the Qur'an face is
         the one ASKED for — the scripture-law binding);
     (e) documentElement.scrollWidth <= window.innerWidth at a narrow (--window-size=320,800) and a
         desktop width — no horizontal overflow.

   This reproduces the shipped isolate census (engine CSS §2.2) as a permanent regression gate: the
   5 Arabic-emitting paths already carry lang/dir/isolate, so today it exits 0 — it exists to PIN
   that forever and to catch any future regression (re-run at the 06-07 and Phase-7 gates).

   HONEST LIMITS (stated, never over-claimed):
     - Glyph VISUAL ORDER (that runs do not scramble on screen) is best-effort only; computed
       isolate + the human fixture walk are the authoritative checks. Range rect x-ordering is a
       weak heuristic and is NOT used as a pass/fail lever here.
     - Headless Chrome clamps its layout viewport to a ~500px minimum, so the "320px" render is
       actually exercised at that floor; the true sub-500 visual is a human-gate item. The
       no-overflow property is genuinely asserted at the narrow floor and at desktop.

   Exit-code-first: the pass/fail decision is the process exit code from the parsed driver result,
   never a grep of stdout. Prints `RTL OK <page>` / `RTL FAIL <page> <reason>`.
   Zero-dependency: Node core + system Chrome via CLI (the render-smoke precedent).
   ============================================================================================ */
'use strict';

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const FIXTURE = path.join(ROOT, 'scripts', 'fixtures', 'typo-stress.html');
const NARROW = '320,800';    // requested per D-66; headless clamps to a ~500px floor (documented)
const DESKTOP = '1280,900';

/* The read-only census driver — injected before </body> of a THROWAWAY copy so the real page
   renders byte-for-byte, then runs on load (after the runner/IIFE has built the DOM). It publishes
   a JSON <script id="rtl-result"> that the DOM dump carries back out. All checks are computed-style
   reads; nothing is mutated. */
const DRIVER = [
  '<script>',
  "window.addEventListener('load', function () {",
  '  try {',
  '    var AR = /[\\u0600-\\u06FF\\u0750-\\u077F\\uFB50-\\uFDFF\\uFE70-\\uFEFF]/;',
  '    var R = { orphanArabic: [], langArNoIsolate: [], scriptureBad: [], ayahFace: [],',
  '              arabicSeen: 0, langArSeen: 0, ayahSeen: 0, scriptureSeen: 0,',
  '              scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth };',
  '    function tag(el) {',
  "      var t = el.tagName ? el.tagName.toLowerCase() : '?';",
  "      var c = el.className && el.className.toString ? ('.' + el.className.toString().trim().split(/\\s+/).slice(0,2).join('.')) : '';",
  '      return t + c;',
  '    }',
  '    // (a) every Arabic-bearing RENDERED text node sits inside a [lang="ar"]. Script/style/',
  '    //     template source is code, not rendered text — skip it (the DAILY data lives in a',
  '    //     <script> whose Arabic ar: strings must not be read as page content).',
  '    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);',
  '    var n;',
  '    while ((n = walker.nextNode())) {',
  '      if (!n.nodeValue || !AR.test(n.nodeValue)) continue;',
  '      var host = n.parentElement;',
  '      if (!host) continue;',
  "      if (host.closest('script, style, noscript, template')) continue;",
  '      R.arabicSeen++;',
  "      if (!host.closest('[lang=\"ar\"]')) {",
  '        R.orphanArabic.push(tag(host) + ": " + n.nodeValue.trim().slice(0, 24));',
  '      }',
  '    }',
  '    // (b) every [lang="ar"] element computes unicode-bidi: isolate (or isolate-override)',
  "    var langs = document.querySelectorAll('[lang=\"ar\"]');",
  '    for (var i = 0; i < langs.length; i++) {',
  '      R.langArSeen++;',
  '      var ub = getComputedStyle(langs[i]).unicodeBidi;',
  "      if (ub.indexOf('isolate') !== 0) R.langArNoIsolate.push(tag(langs[i]) + ' unicode-bidi=' + ub);",
  '    }',
  '    // (c) every .ayah / .scripture computes direction:rtl + unicode-bidi:isolate',
  "    var scr = document.querySelectorAll('.ayah, .scripture');",
  '    for (var j = 0; j < scr.length; j++) {',
  '      R.scriptureSeen++;',
  '      var cs = getComputedStyle(scr[j]);',
  "      if (cs.direction !== 'rtl' || cs.unicodeBidi.indexOf('isolate') !== 0) {",
  "        R.scriptureBad.push(tag(scr[j]) + ' dir=' + cs.direction + ' bidi=' + cs.unicodeBidi);",
  '      }',
  '    }',
  '    // (d) every .ayah asks for the Amiri Quran face first',
  "    var ayah = document.querySelectorAll('.ayah');",
  '    for (var k = 0; k < ayah.length; k++) {',
  '      R.ayahSeen++;',
  "      var fam = getComputedStyle(ayah[k]).fontFamily.replace(/[\"']/g, '').trim();",
  "      if (fam.indexOf('Amiri Quran') !== 0) R.ayahFace.push(tag(ayah[k]) + ' font-family=' + fam.slice(0, 40));",
  '    }',
  "    var s = document.createElement('script');",
  "    s.type = 'application/json'; s.id = 'rtl-result';",
  '    s.textContent = JSON.stringify(R);',
  '    document.body.appendChild(s);',
  "    document.title = 'RTL-DONE';",
  '  } catch (e) {',
  "    var f = document.createElement('script');",
  "    f.type = 'application/json'; f.id = 'rtl-result';",
  "    f.textContent = JSON.stringify({ driverError: String((e && e.message) || e) });",
  '    document.body.appendChild(f);',
  '  }',
  '});',
  '</scr' + 'ipt>',
].join('\n');

function findPages() {
  const pages = [];
  const learn = path.join(ROOT, 'learn.html');
  if (existsSync(learn)) pages.push(learn);
  for (const dir of ['lessons', 'reviews']) {
    const abs = path.join(ROOT, dir);
    if (!existsSync(abs)) continue;
    for (const f of readdirSync(abs)) {
      if (f.endsWith('.html')) pages.push(path.join(abs, f));
    }
  }
  if (existsSync(FIXTURE)) pages.push(FIXTURE); // the 21st target — overflow + mixed-bidi
  return pages;
}

function runOnce(probePath, windowSize) {
  try {
    const stdout = execFileSync(
      CHROME,
      [
        '--headless',
        '--disable-gpu',
        '--window-size=' + windowSize,
        '--virtual-time-budget=5000',
        '--dump-dom',
        'file://' + probePath,
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 25000, maxBuffer: 1024 * 1024 * 48 }
    );
    const m = stdout.match(/<script[^>]*id="rtl-result"[^>]*>([\s\S]*?)<\/script>/);
    if (!m) return { ok: false, reason: 'driver produced no result block' };
    try {
      return { ok: true, data: JSON.parse(m[1]) };
    } catch (e) {
      return { ok: false, reason: 'result JSON parse failed' };
    }
  } catch (e) {
    const err = e && e.stderr ? e.stderr.toString() : String((e && e.message) || e);
    return { ok: false, reason: 'chrome invocation failed: ' + err.slice(0, 160) };
  }
}

function auditOne(pagePath) {
  const name = path.relative(ROOT, pagePath);
  const dir = path.dirname(pagePath);
  const probe = path.join(dir, '.rtl-probe-' + path.basename(pagePath));
  let html = readFileSync(pagePath, 'utf8');
  html = html.includes('</body>')
    ? html.replace(/<\/body>(?![\s\S]*<\/body>)/, DRIVER + '\n</body>')
    : html + DRIVER;
  writeFileSync(probe, html);
  try {
    const desk = runOnce(probe, DESKTOP);   // canonical DOM checks + desktop overflow
    const narrow = runOnce(probe, NARROW);  // narrow overflow
    if (!desk.ok) { console.log('RTL FAIL ' + name + ' ' + desk.reason); return false; }
    if (!narrow.ok) { console.log('RTL FAIL ' + name + ' (narrow) ' + narrow.reason); return false; }
    const d = desk.data, na = narrow.data;
    if (d.driverError) { console.log('RTL FAIL ' + name + ' driver error: ' + d.driverError); return false; }
    if (na.driverError) { console.log('RTL FAIL ' + name + ' (narrow) driver error: ' + na.driverError); return false; }
    const reasons = [];
    if (d.orphanArabic.length) reasons.push('untagged Arabic [' + d.orphanArabic.join(' | ') + ']');
    if (d.langArNoIsolate.length) reasons.push('lang=ar not isolated [' + d.langArNoIsolate.join(' | ') + ']');
    if (d.scriptureBad.length) reasons.push('scripture not rtl+isolate [' + d.scriptureBad.join(' | ') + ']');
    if (d.ayahFace.length) reasons.push('ayah not Amiri Quran [' + d.ayahFace.join(' | ') + ']');
    if (d.scrollW > d.innerW) reasons.push('desktop overflow ' + d.scrollW + '>' + d.innerW);
    if (na.scrollW > na.innerW) reasons.push('narrow overflow ' + na.scrollW + '>' + na.innerW);
    if (reasons.length) { console.log('RTL FAIL ' + name + ' ' + reasons.join('; ')); return false; }
    console.log('RTL OK ' + name
      + ' (ar-nodes=' + d.arabicSeen + ' lang-ar=' + d.langArSeen
      + ' ayah=' + d.ayahSeen + ' scripture=' + d.scriptureSeen
      + ' w:' + na.innerW + '/' + d.innerW + ')');
    return true;
  } finally {
    try { unlinkSync(probe); } catch (e) { /* nothing to clean */ }
  }
}

function main() {
  if (!existsSync(CHROME)) {
    console.log('RTL SKIP system Chrome not found — audit unavailable');
    process.exit(0); // mirror the harness skip guard (Chrome absent ≠ failure)
  }
  const pages = findPages();
  if (pages.length === 0) {
    console.log('no pages yet');
    process.exit(0);
  }
  console.log('rtl-audit · ' + pages.length + ' targets · computed lang/dir/isolate + Quran-face + no-overflow');
  console.log('  (limits: glyph visual-order is best-effort/human-gate; narrow width clamps to the '
    + 'headless ~500px floor — the true 320px visual is a human-gate item)');
  let allOk = true;
  for (const p of pages) {
    if (!auditOne(p)) allOk = false;
  }
  process.exit(allOk ? 0 : 1);
}

main();
