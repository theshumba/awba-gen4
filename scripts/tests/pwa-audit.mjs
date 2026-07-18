#!/usr/bin/env node
/* ============================================================================================
   pwa-audit.mjs  ·  Awba Gen-4 — permanent PWA manifest/icon/redirect/SW gate (07-01/07-02, PLT-02)
   --------------------------------------------------------------------------------------------
   Not a node:test file — an explicit exit-code-first tool invoked directly, joining the full
   standing gate set alongside render-smoke/port-audit/contrast/rtl/glyph:
     node scripts/tests/pwa-audit.mjs

   Verifies:
     1. manifest.webmanifest parses as valid JSON.
     2. It carries the required keys: name, short_name, start_url, scope, display, icons.
     3. start_url and scope are RELATIVE (no leading slash) — the app must install unchanged at
        a GitHub Pages project subpath or a custom-domain root.
     4. At least one icon declares purpose "maskable".
     5. Every icon's `src` resolves to a real file on disk, and where a `sizes` value is cheaply
        checkable (WxW PNG), the on-disk pixel dimensions match via a zero-dependency PNG IHDR
        read (no sips/child_process — keeps this gate dependency-free and fast).
     6. index.html contains the learn.html redirect (meta-refresh or location.replace target)
        and links the manifest.
     7. learn.html links the manifest and the apple-touch-icon.
     8. sw.js (D-71/07-02): exists, `node --check`-parses, declares a versioned `awba-cache-vN`
        cache constant, has an activate-time purge (cache-key delete loop) + `clients.claim()`,
        and a navigate/`text/html` network-first branch. Every re-derived PRECACHE path (the same
        quoted-string extraction the Task-1 verify used) resolves to a real file on disk — no
        404 could ever be cached, which would otherwise fail the whole `addAll()` install.
     9. learn.html + index.html both carry the file://-guarded registration
        (`serviceWorker.register('sw.js')` behind `protocol !== 'file:'`).

   Prints `PWA OK` + exits 0 on success; prints a specific reason + exits 1 on any failure.
   Zero-dependency: Node core only (fs/path/url/child_process).
   ============================================================================================ */
'use strict';

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');

function fail(reason) {
  console.log(`PWA FAIL ${reason}`);
  process.exit(1);
}

// Reads a PNG file's IHDR chunk (bytes 16-23) for width/height — no dependency, ~30 lines.
function pngDimensions(absPath) {
  const buf = readFileSync(absPath);
  const isPng =
    buf.length >= 24 &&
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  if (!isPng) return null;
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

function main() {
  const manifestPath = path.join(ROOT, 'manifest.webmanifest');
  if (!existsSync(manifestPath)) fail('manifest.webmanifest missing');

  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (e) {
    fail(`manifest.webmanifest is not valid JSON — ${e.message}`);
    return;
  }

  const requiredKeys = ['name', 'short_name', 'start_url', 'scope', 'display', 'icons'];
  for (const key of requiredKeys) {
    if (!(key in manifest)) fail(`manifest missing required key "${key}"`);
  }

  if (manifest.start_url[0] === '/') fail('manifest start_url is absolute (leading slash)');
  if (manifest.scope[0] === '/') fail('manifest scope is absolute (leading slash)');

  if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
    fail('manifest icons array is empty or missing');
  }

  if (!manifest.icons.some((i) => /maskable/.test(i.purpose || ''))) {
    fail('manifest has no icon with purpose "maskable"');
  }

  for (const icon of manifest.icons) {
    if (!icon.src) fail('an icon entry has no src');
    const absIconPath = path.join(ROOT, icon.src);
    if (!existsSync(absIconPath)) fail(`icon src does not resolve to a file: ${icon.src}`);
    if (icon.src[0] === '/') fail(`icon src is absolute (leading slash): ${icon.src}`);

    // Cheap dimension check: "WxH" sizes on a real PNG.
    const match = /^(\d+)x(\d+)$/.exec(icon.sizes || '');
    if (match && (icon.type || '').includes('png')) {
      const dims = pngDimensions(absIconPath);
      if (dims) {
        const [, w, h] = match;
        if (dims.width !== Number(w) || dims.height !== Number(h)) {
          fail(
            `icon ${icon.src} declares sizes "${icon.sizes}" but is actually ${dims.width}x${dims.height}`
          );
        }
      }
    }
  }

  const indexPath = path.join(ROOT, 'index.html');
  if (!existsSync(indexPath)) fail('index.html missing');
  const indexHtml = readFileSync(indexPath, 'utf8');
  if (!/learn\.html/.test(indexHtml)) fail('index.html does not reference learn.html');
  if (!/url=learn\.html/.test(indexHtml) && !/location\.replace\(['"]learn\.html['"]\)/.test(indexHtml)) {
    fail('index.html has no meta-refresh or location.replace redirect to learn.html');
  }
  if (!/rel="manifest"/.test(indexHtml)) fail('index.html does not link the manifest');

  const learnPath = path.join(ROOT, 'learn.html');
  if (!existsSync(learnPath)) fail('learn.html missing');
  const learnHtml = readFileSync(learnPath, 'utf8');
  if (!/rel="manifest"/.test(learnHtml)) fail('learn.html does not link the manifest');
  if (!/apple-touch-icon/.test(learnHtml)) fail('learn.html does not link the apple-touch-icon');

  // --- D-71/07-02: sw.js shape + precache-list integrity -----------------------------------
  const swPath = path.join(ROOT, 'sw.js');
  if (!existsSync(swPath)) fail('sw.js missing');

  try {
    execFileSync(process.execPath, ['--check', swPath], { stdio: 'pipe', timeout: 30000, killSignal: 'SIGKILL' });
  } catch (e) {
    fail(`sw.js does not parse — ${e.message}`);
  }

  const swSrc = readFileSync(swPath, 'utf8');
  if (!/awba-cache-v\d+/.test(swSrc)) fail('sw.js does not declare a versioned awba-cache-vN cache constant');
  if (!/caches\.delete/.test(swSrc)) fail('sw.js has no activate-time cache-key delete (purge)');
  if (!/clients\.claim/.test(swSrc)) fail('sw.js activate does not call clients.claim()');
  if (!/skipWaiting/.test(swSrc)) fail('sw.js install does not call skipWaiting()');
  if (!/mode\s*===\s*['"]navigate['"]/.test(swSrc) && !/text\/html/.test(swSrc)) {
    fail('sw.js has no navigate/text-html network-first branch');
  }

  const arrayMatch = swSrc.match(/\[([\s\S]*?)\]/);
  if (!arrayMatch) fail('sw.js has no PRECACHE array literal');
  const precachePaths = (arrayMatch[1].match(/'[^']+'|"[^"]+"/g) || [])
    .map((s) => s.slice(1, -1))
    .filter((p) => !/^https?:/.test(p));
  if (precachePaths.length === 0) fail('sw.js PRECACHE array is empty');
  for (const p of precachePaths) {
    if (p[0] === '/') fail(`sw.js PRECACHE entry is absolute (leading slash): ${p}`);
    const absPrecachePath = path.join(ROOT, p);
    if (!existsSync(absPrecachePath)) fail(`sw.js PRECACHE entry does not resolve to a file: ${p}`);
  }

  // --- D-71/07-02: file://-guarded registration on learn.html + index.html ------------------
  const registerRe = /serviceWorker\.register\(\s*['"]sw\.js['"]\s*\)/;
  const guardRe = /protocol\s*!==\s*['"]file:['"]/;
  if (!registerRe.test(learnHtml)) fail('learn.html does not register sw.js');
  if (!guardRe.test(learnHtml)) fail('learn.html SW registration is not guarded off file://');
  if (!registerRe.test(indexHtml)) fail('index.html does not register sw.js');
  if (!guardRe.test(indexHtml)) fail('index.html SW registration is not guarded off file://');

  console.log('PWA OK');
  process.exit(0);
}

main();
