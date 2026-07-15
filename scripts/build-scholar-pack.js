#!/usr/bin/env node
/* ============================================================================================
   scripts/build-scholar-pack.js  ·  Awba Gen-4 v2.1 — the scholar review-pack generator (S7)
   --------------------------------------------------------------------------------------------
   A DEV-TIME tool (run by hand, like build-practice-pool.js — NOT a build pipeline). Writes a
   dignified, printable, SELF-CONTAINED review document — docs/scholar-pack.html — carrying every
   religious text in the app VERBATIM with full provenance, so a scholar can read it on paper and
   sign it off. EXTRACTION ONLY: it reuses validate-content.js's node:vm ingest() exactly as the
   practice-pool builder does — zero paraphrase, no generated religious content, every item marked
   "pending review". No SHA-frozen content file is touched (the pack only READS them).

   It is a GATE by construction: it EXITS NON-ZERO if the corpus it ingests is the wrong size —
   15 lessons + 4 reviews, the 7 daily verses, the one engine du'a — or if the U4-03 hold is
   violated (lessons/u4-m4.html present). A short pack is a broken pack; it must never ship silently.

   Run:  node scripts/build-scholar-pack.js       # writes docs/scholar-pack.html
   ============================================================================================ */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { ingest } = require('./validate-content.js');

const ROOT = path.join(__dirname, '..');
const LESSONS_DIR = path.join(ROOT, 'lessons');
const REVIEWS_DIR = path.join(ROOT, 'reviews');
const ENGINE = path.join(ROOT, 'shared', 'awba-engine.js');
const COURSE = path.join(ROOT, 'shared', 'course-structure.js');
const LEARN = path.join(ROOT, 'learn.html');
const OUT = path.join(ROOT, 'docs', 'scholar-pack.html');

/* A short pack is a broken pack — every count is asserted; a miss aborts the whole build. */
function must(cond, msg) {
  if (!cond) {
    console.error('build-scholar-pack: ' + msg);
    process.exit(1);
  }
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* Raw-string walk (the validator's own idiom) — collect every string in an object graph. */
function collectStrings(o, acc) {
  if (typeof o === 'string') acc.push(o);
  else if (Array.isArray(o)) o.forEach((x) => collectStrings(x, acc));
  else if (o && typeof o === 'object') Object.keys(o).forEach((k) => collectStrings(o[k], acc));
  return acc;
}
function refIdsIn(node) {
  const blob = collectStrings(node, []).join('\n');
  const ids = new Set();
  const re = /data-ref=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(blob))) ids.add(m[1]);
  return ids;
}

/* Load the single course source (S6) for canonical unit titles + node labels + order. */
function loadCourse() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(COURSE, 'utf8'), sandbox, { filename: COURSE });
  return sandbox.window.AWBA_COURSE;
}

/* The 7 daily verses — vm-eval the byte-frozen `const DAILY=[ … ];` region from learn.html. */
function loadDaily() {
  const m = fs.readFileSync(LEARN, 'utf8').match(/const DAILY=\[[\s\S]*?\];/);
  must(m, 'could not locate the DAILY region in learn.html');
  // eslint-disable-next-line no-new-func
  return new Function(m[0] + '\nreturn DAILY;')();
}

/* The default closing du'a — eval the byte-frozen `var DUA_DEFAULT = { … };` literal from the engine. */
function loadDua() {
  const m = fs.readFileSync(ENGINE, 'utf8').match(/var DUA_DEFAULT = \{[\s\S]*?\};/);
  must(m, 'could not locate DUA_DEFAULT in the engine');
  // eslint-disable-next-line no-new-func
  return new Function(m[0] + '\nreturn DUA_DEFAULT;')();
}

function ingestDir(dir, wantKind) {
  const out = {};
  fs.readdirSync(dir)
    .filter((f) => f.endsWith('.html'))
    .sort()
    .forEach((f) => {
      const { cfg, kind } = ingest(path.join(dir, f));
      must(kind === wantKind, f + ' did not ingest as a ' + wantKind);
      must(cfg && cfg.id, f + ' has no cfg.id');
      out[cfg.id] = cfg;
    });
  return out;
}

/* ---------- markup helpers (the pack's own dignified, print-first vocabulary) ---------- */
const PENDING = '<span class="pend">pending review</span>';

function arBlock(ar) {
  return '<p class="ar" dir="rtl" lang="ar">' + esc(ar) + '</p>';
}
function citationCard(r) {
  let head = '';
  if (r.kind) head += '<span class="kind">' + esc(r.kind) + '</span>';
  if (r.ref) head += '<span class="ref">' + esc(r.ref) + '</span>';
  let meta = '';
  if (r.grade) meta += '<span class="grade">' + esc(r.grade) + '</span>';
  if (r.src) meta += '<span class="src">' + esc(r.src) + '</span>';
  // Many verbatim src lines already end in "pending review" — never print the marker twice on one card.
  const marker = /pending review\s*$/.test(r.src || '') ? '' : PENDING;
  return (
    '<div class="card">' +
    (head ? '<div class="card-head">' + head + '</div>' : '') +
    arBlock(r.ar) +
    (r.mean !== undefined ? '<p class="tr">' + esc(r.mean) + '</p>' : '') +
    '<div class="card-foot">' + meta + marker + '</div>' +
    '</div>'
  );
}
function verseCard(v) {
  return (
    '<div class="card">' +
    (v.label ? '<div class="card-head"><span class="ref">' + esc(v.label) + '</span></div>' : '') +
    arBlock(v.ar) +
    (v.tr !== undefined ? '<p class="tr">' + esc(v.tr) + '</p>' : '') +
    '<div class="card-foot"><span class="src">The Clear Quran · Dr. Mustafa Khattab</span>' + PENDING + '</div>' +
    '</div>'
  );
}

function main() {
  const course = loadCourse();
  const lessons = ingestDir(LESSONS_DIR, 'lesson');
  const reviews = ingestDir(REVIEWS_DIR, 'review');
  const daily = loadDaily();
  const dua = loadDua();

  /* ---- the completeness gate: a short pack is a broken pack ---- */
  must(Object.keys(lessons).length === 15, 'expected 15 lessons, got ' + Object.keys(lessons).length);
  must(Object.keys(reviews).length === 4, 'expected 4 reviews, got ' + Object.keys(reviews).length);
  must(Array.isArray(daily) && daily.length === 7, 'expected 7 daily verses, got ' + (daily && daily.length));
  must(dua && dua.ar && dua.tr && dua.source, 'the default du\'a did not extract with ar/tr/source');
  /* U4-03 is absent entirely — the absence IS the hold; error if the file reappears (a live check). */
  must(!fs.existsSync(path.join(LESSONS_DIR, 'u4-m4.html')), 'HOLD VIOLATION — lessons/u4-m4.html (U4-03) is present');

  /* ---- Part 1: course scripture, grouped by unit → lesson/review via AWBA_COURSE ---- */
  let part1 = '';
  let refCount = 0;
  let verseCount = 0;
  course.units.forEach((u) => {
    part1 += '<h3 class="unit">Unit ' + u.n + ' · ' + esc(u.title) + '</h3>';
    u.nodes.forEach((nd) => {
      if (nd.kind === 'lesson') {
        const cfg = lessons[nd.id];
        if (!cfg) return;
        part1 += '<section class="lesson"><h4>' + esc(nd.label) + ' <span class="nid">(' + esc(nd.id) + ')</span></h4>';
        const verses = (cfg.beats || []).filter((b) => b && b.t === 'verse');
        const refKeys = Object.keys(cfg.refs || {});
        if (!verses.length && !refKeys.length) {
          part1 += '<p class="none">No scripture taught in this lesson.</p>';
        }
        verses.forEach((v) => { part1 += verseCard(v); verseCount++; });
        // which beats cite which ref — a "taught in" provenance line, then the verbatim card.
        refKeys.forEach((id) => {
          const citedIn = [];
          (cfg.beats || []).forEach((b, i) => { if (refIdsIn(b).has(id)) citedIn.push(i); });
          const where = citedIn.length
            ? 'taught in beat ' + citedIn.join(', ')
            : 'carried in refs, not directly cited (see the accepted notes in Part 4)';
          part1 += '<p class="where">' + esc(where) + '</p>' + citationCard(cfg.refs[id]);
          refCount++;
        });
        part1 += '</section>';
      } else if (nd.kind === 'review') {
        const cfg = reviews[nd.id];
        if (!cfg) return;
        part1 += '<section class="lesson review"><h4>' + esc(nd.label) + ' <span class="nid">(' + esc(nd.id) + ')</span></h4>';
        const refKeys = Object.keys(cfg.refs || {});
        const cited = refIdsIn(cfg.items || []);
        if (!refKeys.length && cited.size === 0) {
          part1 += '<p class="none">Recalls Unit ' + u.n + ' — this review introduces no new scripture.</p>';
        } else {
          refKeys.forEach((id) => { part1 += citationCard(cfg.refs[id]); refCount++; });
          // Items may recall lesson citations by data-ref without carrying refs of their own —
          // surface those pointers honestly rather than dropping them (verbatim text lives at the source lesson).
          const recalled = [...cited].filter((id) => !(cfg.refs && cfg.refs[id]));
          if (recalled.length) {
            part1 += '<p class="none">Recalls citations from the lessons above: ' + recalled.map(esc).join(', ') +
              ' — verbatim text listed at each source lesson.</p>';
          }
        }
        part1 += '</section>';
      }
    });
  });

  /* ---- Part 2: the 7 daily verses ---- */
  let part2 = '';
  daily.forEach((v) => { part2 += verseCard({ label: v.ref, ar: v.ar, tr: v.tr }); });

  /* ---- Part 3: the default closing du'a (honest per CONTENT-DECISIONS §G3) ---- */
  const part3 =
    '<div class="card">' +
    '<div class="card-head"><span class="kind">The closing du\'a</span></div>' +
    arBlock(dua.ar) +
    '<p class="tr">' + esc(dua.tr) + '</p>' +
    '<div class="card-foot"><span class="grade">class-b · corroborated</span>' +
    '<span class="src">' + esc(dua.source) + '</span>' + PENDING + '</div>' +
    '<p class="note">Corroborated byte-identical across two of the owner\'s prior collections; ' +
    'spliced, never generated. Not labelled verified — this pack is the pre-sign-off state.</p>' +
    '</div>';

  /* ---- Part 4: placeholders & holds ---- */
  const held = ['U1-15', 'U1-16', 'U2-02', 'U2-04', 'U2-05', 'U3-13', 'U3-16', 'U4-03'];
  const terms = course.units.map((u) => u.title);
  const notes = [
    'u3-m1 — refs entry baqarah-2-163 is carried but never directly cited (intentional).',
    'u3-m3 — refs entry imran-3-19 is carried but never directly cited (intentional).',
    'u4-m2 — terms entry rububiyah is carried but never directly referenced (intentional).',
  ];
  /* R-7 epigraph — extracted LIVE from learn.html (never a second copy in this generator). */
  const learnSrc = fs.readFileSync(LEARN, 'utf8');
  const epiLine = learnSrc.match(/<p class="oib-line">([^<]*)<\/p>/);
  const epiRef = learnSrc.match(/<p class="oib-ref">([^<]*)<\/p>/);
  must(epiLine && epiRef, 'could not locate the oib-line/oib-ref epigraph in learn.html');
  const part4 =
    '<h3 class="unit">The learn-page epigraph (R-7 — spliced, pending review)</h3>' +
    '<div class="card"><p class="tr">' + esc(epiLine[1]) + '</p>' +
    '<div class="card-foot"><span class="src">' + esc(epiRef[1]) + '</span></div>' +
    '<p class="note">Qur\'an 14:24, The Clear Quran (Dr. Mustafa Khattab). Spliced 2026-07-16 on the ' +
    'owner\'s explicit fetch authorization — not from the owner\'s document corpus. Cross-verified ' +
    'word-identical across three independent mirrors (quranapi.pages.dev, the-quran-project ' +
    'eng-mustafakhattaba, quran.com/14/24); the trailing comma follows quran.com, the translation\'s ' +
    'official digital home — the two API mirrors omit it (one-character variance for the reviewer to ' +
    'confirm). Byte-pinned by SHA in scripts/port-audit.mjs. Not labelled verified.</p></div>' +
    '<h3 class="unit">The English unit terms (R-6)</h3>' +
    '<p>The four chapter key-terms currently render an English fallback, ' + PENDING +
    ', pending an owner-supplied, scholar-checked Arabic set:</p><ul>' +
    terms.map((t) => '<li>' + esc(t) + '</li>').join('') +
    '</ul>' +
    '<h3 class="unit">Sensitive-content holds</h3>' +
    '<p><strong>U4-03 is absent from the app entirely — the absence IS the hold.</strong> ' +
    'The withheld / held set (U3-16 principle-only, group-namings held):</p><ul>' +
    held.map((h) => '<li>' + esc(h) + '</li>').join('') +
    '</ul>' +
    '<h3 class="unit">Accepted content notes (intentional, not defects)</h3><ul>' +
    notes.map((n) => '<li>' + esc(n) + '</li>').join('') +
    '</ul>';

  /* ---- Part 5: the sign-off checklist (FINAL copy, S7.4) ---- */
  const part5 =
    '<p class="lead"><strong>For the reviewing scholar — please confirm each, or note corrections:</strong></p>' +
    '<ul class="checklist">' +
    '<li>Every Qur\'anic verse is verbatim and correctly attributed (surah : āyah, translation named).</li>' +
    '<li>Every hadith is verbatim, correctly attributed (collection · number), and its grade is accurate.</li>' +
    '<li>The transliterations and translations carry no error of meaning.</li>' +
    '<li>The default closing du\'a (Ibn Ḥibbān 974 · Sahih) is sound and appropriate at a lesson\'s close.</li>' +
    '<li>The sensitive-content holds are appropriate — nothing withheld should be shown, nothing shown should be withheld.</li>' +
    '<li>The English unit terms and the pending epigraph may stand until Arabic/verbatim text is supplied.</li>' +
    '<li>Nothing in this pack, once corrected, requires content the app does not already carry.</li>' +
    '</ul>' +
    '<p class="signoff">Reviewed by: ____________________&nbsp;&nbsp;&nbsp;Date: ____________&nbsp;&nbsp;&nbsp;Notes overleaf.</p>';

  const generated = new Date().toISOString().slice(0, 10);
  const html = renderDoc({ generated, part1, part2, part3, part4, part5 });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, html);
  console.log(
    'scholar-pack: wrote ' + path.relative(ROOT, OUT) + ' — ' +
      Object.keys(lessons).length + ' lessons + ' + Object.keys(reviews).length + ' reviews, ' +
      refCount + ' citations, ' + verseCount + ' verse beats, ' + daily.length + ' daily verses, 1 du\'a.'
  );
}

/* The whole document — one self-contained file: inline <style>, SYSTEM fonts only, no engine CSS,
   no app woff2, no external host. Print-first: black ink on white, generous margins, cards that
   never break across a page. Plain neutral colours only (a review artefact, not a gated app
   surface) — and ZERO gated literals. */
function renderDoc(p) {
  const style = [
    ':root{color-scheme:light}',
    '*{box-sizing:border-box}',
    'body{margin:0;background:#ffffff;color:#111111;',
    'font-family:-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.55}',
    '.wrap{max-width:820px;margin:0 auto;padding:40px 28px 80px}',
    'h1{font-size:30px;margin:0 0 6px;line-height:1.15}',
    'h2{font-size:21px;margin:44px 0 10px;padding-top:14px;border-top:2px solid #111111}',
    'h3.unit{font-size:16px;margin:26px 0 8px;color:#333333}',
    'h4{font-size:15px;margin:18px 0 6px}',
    '.nid{font-weight:400;color:#777777;font-size:13px}',
    '.posture{background:#f4f4f2;border:1px solid #dddddd;padding:12px 16px;border-radius:6px;color:#333333}',
    '.gen{color:#777777;font-size:13px;margin:2px 0 0}',
    'ol.toc{color:#333333}',
    'section.lesson{margin:0 0 4px}',
    'section.review h4{color:#555555}',
    '.card{border:1px solid #d8d8d8;border-radius:8px;padding:14px 16px;margin:10px 0;page-break-inside:avoid;break-inside:avoid}',
    '.card-head{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:baseline;margin-bottom:6px}',
    '.kind{font-weight:600}',
    '.ref{color:#333333}',
    '.ar{font-family:"Geeza Pro","Noto Naskh Arabic",serif;font-size:23px;line-height:1.9;letter-spacing:0;',
    'margin:8px 0;text-align:right}',
    '.tr{margin:6px 0 0;color:#222222}',
    '.card-foot{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:baseline;margin-top:10px;',
    'font-size:12px;color:#666666}',
    '.grade,.src{color:#666666}',
    '.pend{color:#8a5a00;font-weight:600}',
    '.where{font-size:12px;color:#777777;margin:12px 0 0}',
    '.note{font-size:12px;color:#777777;margin:8px 0 0}',
    '.none{color:#777777;font-style:italic}',
    'ul.checklist{list-style:none;padding:0}',
    'ul.checklist li{padding:6px 0 6px 30px;position:relative}',
    'ul.checklist li::before{content:"\\2610";position:absolute;left:0;font-size:18px;line-height:1}',
    '.signoff{margin-top:24px}',
    '@media print{body{font-size:12px}.wrap{padding:0}h2{border-top-color:#000000}}',
  ].join('');

  return (
    '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>Awba · Scholarly review pack</title>\n<style>' + style + '</style>\n</head>\n<body>\n' +
    '<div class="wrap">\n' +
    '<h1>Awba — Scholarly review pack</h1>\n' +
    '<p class="gen">Generated ' + esc(p.generated) + '. Every religious text in the app, verbatim, with its provenance.</p>\n' +
    '<p class="posture">This is the <strong>pre-sign-off</strong> state. Nothing here is labelled ' +
    'verified — every item is marked pending review. The pack is the instrument by which the content is cleared, ' +
    'not a claim that it already has been.</p>\n' +
    '<ol class="toc">' +
    '<li>Part 1 — Course scripture (lessons &amp; reviews)</li>' +
    '<li>Part 2 — Daily verses (7)</li>' +
    '<li>Part 3 — Default closing du\'a</li>' +
    '<li>Part 4 — Placeholders &amp; holds</li>' +
    '<li>Part 5 — Sign-off checklist</li>' +
    '</ol>\n' +
    '<h2>Part 1 · Course scripture</h2>\n' + p.part1 +
    '<h2>Part 2 · Daily verses</h2>\n' + p.part2 +
    '<h2>Part 3 · Default closing du\'a</h2>\n' + p.part3 +
    '<h2>Part 4 · Placeholders &amp; holds</h2>\n' + p.part4 +
    '<h2>Part 5 · Sign-off checklist</h2>\n' + p.part5 +
    '\n</div>\n</body>\n</html>\n'
  );
}

main();
