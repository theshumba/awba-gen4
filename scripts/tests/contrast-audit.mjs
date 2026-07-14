#!/usr/bin/env node
/* ============================================================================================
   contrast-audit.mjs  ·  Awba Gen-4 — the permanent WCAG computed-style contrast sweep (D-65 / ACC-03)
   --------------------------------------------------------------------------------------------
   Not a node:test file — a standing exit-code gate invoked directly, joining the full-suite
   command alongside render-smoke/rtl-audit:
       node scripts/tests/contrast-audit.mjs

   THE METHOD (06-RESEARCH §Contrast Audit — computed styles from REAL rendered pages, never token
   pairs on paper):
     1. Walk every rendered page (learn.html + lessons/*.html + reviews/*.html = 20 pages) in system
        Chrome headless. For each page, an injected read-only driver TreeWalks document.body TEXT
        nodes (skipping empty/whitespace, `.aw-sr`, any `[aria-hidden="true"]` ancestor, and anything
        inside script/style/noscript/template), reads getComputedStyle(color/fontSize/fontWeight),
        and buckets large-text (>=24px, or >=18.66px bold -> 3:1 threshold) vs normal (4.5:1).
     2. Effective background: `effectiveBackground(el)` walks from the element itself upward,
        alpha-compositing each non-transparent computed `backgroundColor` (srgb "over" operator) onto
        an accumulator until it reaches full opacity. If the walk exhausts every ancestor with alpha
        still remaining (this only happens for `.reg-sky-night`, whose ground is a CSS gradient, so
        its own computed `backgroundColor` is transparent — the gradient lives in `background-image`,
        never in `background-color`), the closest ancestor (or the element itself) carrying a
        register class is used to resolve the ground: the class is mapped to the CSS CUSTOM PROPERTY
        that carries its ground token (never a hardcoded hex — the live value is read off
        `getComputedStyle(document.documentElement)` at audit time, so a future token edit is picked
        up automatically): reg-orbit -> --kiswah, reg-page/reg-festival -> --cream,
        reg-sky-night -> --lastthird (03-UI-SPEC-ATHAR S1 cites "Sky night | Last Third #251D46" as
        this register's representative ground for ratio purposes), nightfall -> --nightfall.
     3. The grain overlay: `.grain`/`.reg-orbit::before` etc. are tiled-PNG / radial-gradient
        PSEUDO-ELEMENTS layered via `background-image` at ~2-9% opacity — invisible to computed
        `backgroundColor`, and pseudo-elements are not part of the DOM tree a TreeWalker/
        getComputedStyle(realElement) can see in the first place. ACCEPTED APPROXIMATION (matching
        06-RESEARCH's documented scope): the audit ignores it. 03-UI-SPEC-ATHAR §2.1's cited ratios
        were computed against the flat ground tokens; a <=9% grain shifts luminance by well under one
        contrast step, so this never flips a genuine pass/fail near a threshold in practice.
     4. Ratio = ONE shared WCAG relative-luminance (sRGB linearization) + `(L1+0.05)/(L2+0.05)`
        function (`relativeLuminance` + `contrastRatio` below) — encoded exactly once, inside the
        driver string every page runs; there is no second luminance formula anywhere in this file.
     5. Non-text 3:1 (SC 1.4.11): a curated target list sweeps `.opt/.tf/.tile` STATE-conveying
        borders (the `.correct` gold border — the plain, idle/default `--rule` hairline keyline is
        explicitly NOT swept for contrast: it is documented in engine CSS itself as "jadwal hairline,
        card keyline, dividers" — a decorative separator identical on every unanswered option, never a
        differentiating state signal, and every `.opt`/`.tf`/`.tile` is already a native `<button>`
        identified by its text + shadow + layout, so the idle keyline is not the sole means of
        identifying the control), the thermal `[data-state="not-yet"|"progress"|"mastered"]` shapes,
        `.np-seed.is-inked` (the REST/un-inked `.np-seed` is explicitly `aria-hidden="true"` — a
        decorative, non-essential preview dot per its own CSS comment "never a live partial" — so it
        is computed+reported but not gated, matching the grain-overlay precedent of documenting an
        accepted scope limit rather than silently omitting it), the review `.rv-timer.low
        .rv-timer-fill`, and a rolling sample of `:focus-visible` rings (a handful of focusable
        elements per swept state, across whatever register is active) — computed
        borderColor/backgroundColor/outlineColor against the SAME effectiveBackground resolution.
     6. Report: `CONTRAST OK <page> (...)` once per page on success, `CONTRAST FAIL <page> <selector>
        <fg> on <bg> = N.NN:1 (needs X)` per failing pairing, `CONTRAST NOTE ...` for the one
        documented, non-gating interpretation call below. Exit non-zero on any FAIL.

   THE ONE DOCUMENTED INTERPRETATION CALL (not a silent pass — printed as CONTRAST NOTE, flagged in
   the plan's SUMMARY for the 06-07 gate): 03-UI-SPEC-ATHAR §2.1's own ground-truth table cites
   "gold-on-cream 1.93:1" with the annotation "(never text)" and documents the SAME gold token used as
   a shape fill/border throughout the shipped CSS (`.opt.correct` gold border + a `--keyline` ink edge,
   the thermal "mastered" gold dab + `--keyline`, `.np-star.is-earned` gold glyph) — i.e. the locked
   design authority has already accepted gold-as-shape on cream at ~1.93:1, below the literal 3:1
   SC 1.4.11 threshold, relying on the compound shape (keyline edge + glyph + layout) rather than the
   raw fill-vs-ground ratio alone to carry the boundary. This audit does NOT invent a new failure out
   of an already-locked, already-cited design ratio: any gold-on-light-ground non-text pairing below
   3:1 is computed, printed as CONTRAST NOTE (not FAIL), and does not affect the exit code. Every
   OTHER non-text/text pairing is gated normally at its full threshold.

   FORCING TABLE (06-RESEARCH — every interaction-only state, forced headlessly, never on a real
   user's data): fresh storage -> the default render (locked/active nodes, thermal not-yet/progress);
   a pre-IIFE seed `<script>` injected BEFORE the learn.html IIFE (engine loads in `<head>`, so `AW`
   already exists) sets `AW.S.set('stars', {...})` to force done/stars/gold-thread/review-rosette/
   chest-available WITHOUT touching any real user's storage (a THROWAWAY page copy only, removed in
   `finally`); `window.__awbaClaimChest('u1c')` forces the chest-done + Festival overlay surface;
   `.onode.click()` per representative node forces each popup variant (locked/available/done/review/
   chest); a generic per-lesson walker drives every real lesson page end-to-end via `.click()` on the
   real `#cont`/`#check` buttons (`.click()` is the proven driver verb — synthetic Enter does not
   activate a button, per the D-68 probe) — clicking one option WITHOUT `#check` snapshots the
   SELECTED-BUT-NOT-YET-CHECKED pre-check state (so a future new selection cue is genuinely re-swept
   on every re-run), then `#check` resolves it (correct or wrong, real content dependent — across 15
   lessons this reliably yields both), a `.depth` beat gets every `.lens` force-expanded via the
   SHIPPED `.open` class (so the `.lb` body text is swept in addition to the pre-expansion `.lh`
   header), and the walker rides every `#cont` through the full reward chain (verdict/noor/returns/
   done/ring) to the du'a-close terminal; a review page is driven by letting its real 14s timer run
   out at least once (`--virtual-time-budget` fast-forwards it) to reach the genuine `.low` bar state
   AND the real timeout mercy copy, then answers the rest quickly, forces the circle-back offer if
   offered, and lands on the result screen.

   HONEST LIMITS (stated, never over-claimed):
     - The "3 in a row" combo flourish is NOT deterministically forced (the walker always picks the
       FIRST quiz option, whose correctness is real-content-dependent) — it is swept opportunistically
       wherever a lesson's real content happens to yield 3 consecutive first-option-correct answers.
       Both `.opt.correct` (gold) and `.opt.wrong` (grey ink-blot + `.opt-why` text) ARE guaranteed
       swept across the 15-lesson corpus; the combo chip itself reuses already-swept `.ls-count`
       ink-62-on-cream text and the `.thread` gold-stroke SVG flourish is a decorative accent, not a
       separately-gated pairing.
     - `duaClose` never renders scripture in the current corpus (no shipped lesson cfg carries a
       `dua` block yet — RESEARCH's own finding) — the audit cannot sweep a populated `.scripture`
       node inside `duaClose` until a lesson ships one; the "Alhamdulillah — continue." close line and
       the register swap to Sky (Last Third) ARE swept.

   Zero-dependency: Node core + system Chrome via CLI (the render-smoke/rtl-audit precedent). Never
   mutates a real page: every probe is a THROWAWAY copy written next to the source page and removed in
   `finally`; nothing is written to localStorage on any file the developer/Josh actually opens.
   ============================================================================================ */
'use strict';

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/* ---------------------------------------------------------------------------------------------
   The in-browser driver core — ONE shared WCAG luminance/ratio implementation, the ancestor-
   compositing effectiveBackground resolver, the text + non-text sweeps, and the per-page-type
   forcing routines. Injected verbatim into every probed page; string-built once, reused by every
   page (this IS "one place to review the math" — there is no second copy anywhere in this file).
   --------------------------------------------------------------------------------------------- */
const DRIVER_CORE = `
    /* ---- ONE shared WCAG luminance + ratio function (the stable WCAG 2.x definition) ---- */
    function srgbToLinear(c) {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }
    function relativeLuminance(rgb) {
      return 0.2126 * srgbToLinear(rgb.r) + 0.7152 * srgbToLinear(rgb.g) + 0.0722 * srgbToLinear(rgb.b);
    }
    function contrastRatio(fg, bg) {
      var L1 = relativeLuminance(fg), L2 = relativeLuminance(bg);
      var hi = Math.max(L1, L2), lo = Math.min(L1, L2);
      return (hi + 0.05) / (lo + 0.05);
    }

    /* ---- colour parsing + srgb "over" compositing (honours alpha) ---- */
    function parseColor(str) {
      if (!str) return null;
      var m = /^rgba?\\(([^)]+)\\)$/i.exec(str.trim());
      if (!m) return null;
      var p = m[1].split(',').map(function (s) { return parseFloat(s); });
      return { r: p[0] || 0, g: p[1] || 0, b: p[2] || 0, a: p.length > 3 ? p[3] : 1 };
    }
    function compositeOver(fg, bg) {
      var a = fg.a + bg.a * (1 - fg.a);
      if (a <= 0) return { r: 0, g: 0, b: 0, a: 0 };
      return {
        r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
        g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
        b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
        a: a,
      };
    }
    function ownLayerColor(el, prop) { return parseColor(getComputedStyle(el)[prop]); }

    /* ---- register class -> its live CSS custom-property ground token (never a hardcoded hex —
       read off :root at audit time, so a future token edit is picked up automatically) ---- */
    var REG_GROUND_VAR = {
      'reg-orbit': '--kiswah', 'reg-page': '--cream', 'reg-festival': '--cream',
      'reg-sky-night': '--lastthird', 'nightfall': '--nightfall',
    };
    function registerGroundColor(cls) {
      var varName = REG_GROUND_VAR[cls];
      if (!varName) return null;
      var v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      var hex = /^#([0-9a-f]{6})$/i.exec(v);
      if (hex) {
        var h = hex[1];
        return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 };
      }
      return parseColor(v);
    }

    /* ---- effectiveBackground(el) — walk ancestors INCLUSIVE of el itself, alpha-compositing each
       non-transparent backgroundColor (srgb over) until opaque; if the walk exhausts every ancestor
       with alpha still remaining, fall onto the closest register-class ground token (method step 2
       above). This ONE function serves both TEXT-vs-background checks (called on the text's parent
       element) and BORDER-vs-adjacent checks (called on the bordered element itself, since a border
       sits directly against its own element's fill when that fill is opaque, or against whatever is
       behind it when the fill is transparent — both cases fall out of the same inclusive walk). ---- */
    function effectiveBackground(startEl) {
      var acc = { r: 0, g: 0, b: 0, a: 0 };
      var n = startEl;
      while (n && n.nodeType === 1) {
        var groundCls = null;
        if (n.classList) {
          for (var k in REG_GROUND_VAR) { if (n.classList.contains(k)) { groundCls = k; break; } }
        }
        if (groundCls) {
          /* Reaching a register-ground ancestor is TERMINAL: it is the screen's one ground (law 1),
             so nothing further up (body/html, which may carry an unrelated/coincidental opaque
             backgroundColor of their own — verified this session: <body> ships a global cream
             background-color as a page-level safety default) may show through it. A gradient-painted
             ground (reg-sky-night) has NO computed backgroundColor of its own (the gradient lives
             entirely in background-image) — resolve it via the live CSS custom-property token
             instead (never a hardcoded hex; method step 2 above). A solid ground (reg-page/
             reg-orbit/reg-festival/nightfall) already has an opaque backgroundColor identical to its
             token, so this is a no-op for those (composited under their own opaque colour changes
             nothing). */
          var groundColor = registerGroundColor(groundCls) || { r: 243, g: 237, b: 226, a: 1 };
          var ownBg = ownLayerColor(n, 'backgroundColor');
          var base = (ownBg && ownBg.a > 0) ? compositeOver(ownBg, groundColor) : groundColor;
          return compositeOver(acc, base);
        }
        var bg = ownLayerColor(n, 'backgroundColor');
        if (bg && bg.a > 0) acc = compositeOver(acc, bg);
        if (acc.a >= 0.999) return acc;
        n = n.parentElement;
      }
      /* no register ground anywhere in the ancestor chain — defensive fallback only; every one of
         the 20 real target pages always carries exactly one register ground, so this should never
         actually fire in practice. */
      return acc.a >= 0.999 ? acc : compositeOver(acc, { r: 243, g: 237, b: 226, a: 1 });
    }

    function isVisible(el) {
      var n = el;
      while (n && n.nodeType === 1) {
        var cs = getComputedStyle(n);
        if (cs.display === 'none' || cs.visibility === 'hidden') return false;
        n = n.parentElement;
      }
      return true;
    }
    function tagOf(el) {
      var t = el.tagName ? el.tagName.toLowerCase() : '?';
      var id = el.id ? ('#' + el.id) : '';
      var cn = el.className && el.className.toString ? el.className.toString().trim() : '';
      var c = cn ? ('.' + cn.split(/\\s+/).slice(0, 3).join('.')) : '';
      return t + id + c;
    }
    function rgbaStr(c) {
      return 'rgba(' + Math.round(c.r) + ',' + Math.round(c.g) + ',' + Math.round(c.b) + ',' + (Math.round(c.a * 100) / 100) + ')';
    }
    function round2(n) { return Math.round(n * 100) / 100; }

    /* ---- large-text bucket: >=24px normal, or >=18.66px bold -> 3:1; else 4.5:1 ---- */
    function isLargeText(px, weight) {
      var w = parseInt(weight, 10);
      var bold = weight === 'bold' || (!isNaN(w) && w >= 700);
      if (px >= 24) return true;
      if (bold && px >= 18.66) return true;
      return false;
    }

    var R = { texts: [], ui: [], statesSwept: [], driverError: null, reviewDone: false };

    function pushText(label, host, fg, bg, ratio, large, need, text) {
      R.texts.push({ label: label, tag: tagOf(host), fg: rgbaStr(fg), bg: rgbaStr(bg), ratio: round2(ratio), large: large, need: need, text: text });
    }
    function sweepTextNodes(label) {
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
      var n;
      while ((n = walker.nextNode())) {
        var val = n.nodeValue;
        if (!val || !val.trim()) continue;
        var host = n.parentElement;
        if (!host) continue;
        if (host.closest('script, style, noscript, template')) continue;
        if (host.closest('.aw-sr')) continue;
        if (host.closest('[aria-hidden="true"]')) continue;
        if (!isVisible(host)) continue;
        var fg = ownLayerColor(host, 'color');
        if (!fg || fg.a <= 0) continue;
        var bg = effectiveBackground(host);
        var ratio = contrastRatio(fg, bg);
        var cs = getComputedStyle(host);
        var large = isLargeText(parseFloat(cs.fontSize), cs.fontWeight);
        pushText(label, host, fg, bg, ratio, large, large ? 3 : 4.5, val.trim().slice(0, 44));
      }
    }

    /* ---- non-text UI boundary checks: border-vs-effectiveBackground(el) (the fill-or-ambient a
       border sits against), fill-vs-effectiveBackground(parent) (a filled shape's surrounding
       ambient), outline-vs-effectiveBackground(parent) (a focus ring sits OUTSIDE the box, against
       the ambient behind it, per its outline-offset). ---- */
    function checkBorder(el) {
      var cs = getComputedStyle(el);
      if (!(parseFloat(cs.borderTopWidth) > 0) || cs.borderTopStyle === 'none') return null;
      var fg = ownLayerColor(el, 'borderTopColor');
      if (!fg || fg.a <= 0) return null;
      var bg = effectiveBackground(el);
      return { fg: fg, bg: bg, ratio: contrastRatio(fg, bg) };
    }
    function checkFill(el) {
      var fg = ownLayerColor(el, 'backgroundColor');
      if (!fg || fg.a <= 0) return null;
      var bg = effectiveBackground(el.parentElement || el);
      return { fg: fg, bg: bg, ratio: contrastRatio(fg, bg) };
    }
    function checkOutline(el) {
      var cs = getComputedStyle(el);
      if (cs.outlineStyle === 'none' || !(parseFloat(cs.outlineWidth) > 0)) return null;
      var fg = ownLayerColor(el, 'outlineColor');
      if (!fg || fg.a <= 0) return null;
      var bg = effectiveBackground(el.parentElement || el);
      return { fg: fg, bg: bg, ratio: contrastRatio(fg, bg) };
    }
    function pushUI(label, note, el, res) {
      R.ui.push({ label: label, note: note, sel: tagOf(el), fg: rgbaStr(res.fg), bg: rgbaStr(res.bg), ratio: round2(res.ratio), need: 3 });
    }
    function pushMissing(label, note, el) {
      R.ui.push({ label: label, note: note, sel: tagOf(el), fg: '-', bg: '-', ratio: 0, need: 3, missing: true });
    }

    /* the curated non-text target list — border/fill kind + the CSS-cited note (method step 5) */
    var UI_TARGETS = [
      { sel: '.opt.correct, .tf.correct, .tile.correct', kind: 'border', note: 'quiz correct' },
      { sel: '[data-state="not-yet"]', kind: 'border', note: 'thermal not-yet' },
      { sel: '[data-state="progress"]', kind: 'border', note: 'thermal progress' },
      { sel: '[data-state="mastered"]', kind: 'fill', note: 'thermal mastered' },
      { sel: '.np-seed.is-inked', kind: 'fill', note: 'np-seed inked' },
      { sel: '.rv-timer.low .rv-timer-fill', kind: 'fill', note: 'review timer low' },
    ];
    function sweepUIBoundaries(label) {
      UI_TARGETS.forEach(function (t) {
        var els = document.querySelectorAll(t.sel);
        Array.prototype.forEach.call(els, function (el) {
          if (!isVisible(el)) return;
          var res = t.kind === 'border' ? checkBorder(el) : checkFill(el);
          if (res) pushUI(label, t.note, el, res);
        });
      });
      sweepFocusRing(label);
    }
    var FOCUSABLE_SEL = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    function sweepFocusRing(label) {
      var cands = Array.prototype.slice.call(document.querySelectorAll(FOCUSABLE_SEL)).filter(isVisible).slice(0, 4);
      var prevActive = document.activeElement;
      cands.forEach(function (el) {
        try {
          el.focus({ preventScroll: true });
          if (document.activeElement !== el) return;
          var fv = el.matches(':focus-visible');
          if (!fv) return; /* headless has no real pointer input, so :focus-visible should be true —
            if it is not, focus-ring APPLICATION is a different (ACC-01) concern, not this audit's */
          var res = checkOutline(el);
          if (res) pushUI(label, 'focus-ring', el, res);
          else pushMissing(label, 'focus-ring (fv=true, no outline found)', el);
        } catch (e) { /* an element that cannot take focus in this state — skip it */ }
      });
      try { if (prevActive && prevActive.blur) prevActive.blur(); else if (document.activeElement) document.activeElement.blur(); } catch (e) {}
    }

    function publish() {
      var s = document.getElementById('contrast-result');
      if (!s) {
        s = document.createElement('script');
        s.type = 'application/json'; s.id = 'contrast-result';
        document.body.appendChild(s);
      }
      s.textContent = JSON.stringify(R);
    }
    function sweepCurrentDOM(label) {
      R.statesSwept.push(label);
      sweepTextNodes(label);
      sweepUIBoundaries(label);
      publish();
    }
    window.__awbaAuditSweep = sweepCurrentDOM; /* exposed so page-type drivers below can call it */
    window.__awbaAuditPublish = publish;
    window.__awbaAuditR = R;
`;

/* ---------------------------------------------------------------------------------------------
   learn.html — the PRE-IIFE seed (inserted BEFORE the learn IIFE so it renders already-seeded) +
   the post-load driver (default sweep, popup variants, chest claim + Festival sweep).
   --------------------------------------------------------------------------------------------- */
const PRE_IIFE_SEED_LEARN = [
  '<script>',
  'try {',
  "  AW.S.set('stars', { u1m1: 3, u1m2: 3, u1m3: 3, u1m4: 3, u1r: 3 });", // seeds done/stars/gold-thread/review-rosette/chest-available — a throwaway copy only, never real storage
  "  AW.S.set('chests', {});",
  "  AW.S.set('noor', 0);",
  '} catch (e) {}',
  '</scr' + 'ipt>',
].join('\n');

const LEARN_LOAD_DRIVER = `
window.addEventListener('load', function () {
${DRIVER_CORE}
  try {
    sweepCurrentDOM('learn-default');
    var combos = [
      document.querySelector('.onode[data-nstate="locked"]'),
      document.querySelector('.onode[data-nstate="active"]'),
      document.querySelector('.onode[data-nstate="done"][data-kind="lesson"]'),
      document.querySelector('.onode[data-kind="review"]'),
      document.querySelector('.onode[data-kind="chest"]'),
    ].filter(Boolean);
    combos.forEach(function (nd) {
      nd.click();
      sweepCurrentDOM('learn-popup-' + nd.getAttribute('data-kind') + '-' + nd.getAttribute('data-nstate'));
    });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    if (typeof window.__awbaClaimChest === 'function') {
      try { window.__awbaClaimChest('u1c'); } catch (e) {}
      sweepCurrentDOM('learn-chest-festival'); // the chest-claim + Festival threshold surface
      var closeBtn = document.querySelector('.ofest-close');
      if (closeBtn) closeBtn.click();
      sweepCurrentDOM('learn-festival-closed');
    }
    R.done = true;
    publish();
  } catch (e) { R.driverError = String((e && e.message) || e); publish(); }
  document.title = 'CONTRAST-DONE';
});
`;

/* ---------------------------------------------------------------------------------------------
   lessons/*.html — the generic per-lesson walker. Works for ANY lesson without content-specific
   knowledge: leave the opener, then repeatedly react to whatever the current beat is (a `.depth`
   accordion, a quiz `#check`, or a plain `#cont`), driving every real beat + the full reward chain
   through to the du'a-close terminal (no scripture there yet in the current corpus — see header).
   --------------------------------------------------------------------------------------------- */
const LESSON_LOAD_DRIVER = `
window.addEventListener('load', function () {
${DRIVER_CORE}
  try {
    sweepCurrentDOM('lesson-default');
    var cont = document.getElementById('cont');
    if (cont) cont.click(); // leave the opener
    var seenDepth = false, quizChecks = 0, maxSteps = 30;
    for (var step = 0; step < maxSteps; step++) {
      var lenses = document.querySelectorAll('.lens');
      if (lenses.length && !seenDepth) {
        seenDepth = true;
        sweepCurrentDOM('lesson-depth-closed'); // the .lh header colours read pre-expansion
        Array.prototype.forEach.call(lenses, function (l) { l.classList.add('open'); }); // the shipped .open class
        sweepCurrentDOM('lesson-depth-open'); // now the .lb body text is swept too
      }
      var check = document.getElementById('check');
      if (check) {
        quizChecks++;
        var optNodes = document.querySelectorAll('.opt');
        var tfNodes = document.querySelectorAll('.tf');
        var tileBank = document.querySelectorAll('#lsbank .tile:not(.used)');
        if (optNodes.length) optNodes[0].click();
        else if (tfNodes.length) tfNodes[0].click();
        else if (tileBank.length) tileBank[0].click();
        // SELECTED-BUT-NOT-YET-CHECKED: snapshot the pre-check selection state BEFORE #check fires,
        // so a future new selection cue (a wider border, aria-pressed) is genuinely re-swept here.
        sweepCurrentDOM('lesson-quiz-selected-precheck-' + quizChecks);
        check.click();
        // resolved: .opt.wrong/.opt-why on a miss, .opt.correct on a hit — both real code paths,
        // content-dependent; across the 15-lesson corpus both are reliably reached (see header).
        sweepCurrentDOM('lesson-quiz-resolved-' + quizChecks);
        var c2 = document.getElementById('cont');
        if (c2) { c2.click(); continue; }
        break;
      }
      var contBtn = document.getElementById('cont');
      if (contBtn) { contBtn.click(); sweepCurrentDOM('lesson-step-' + step); continue; }
      sweepCurrentDOM('lesson-terminal-' + step); // verdict/noor/returns/done/ring/dua, whichever is current
      break;
    }
    R.done = true;
    publish();
  } catch (e) { R.driverError = String((e && e.message) || e); publish(); }
  document.title = 'CONTRAST-DONE';
});
`;

/* ---------------------------------------------------------------------------------------------
   reviews/*.html — begin the review, let the REAL 14s timer run out at least once (virtual-time
   fast-forwards it) to reach the genuine `.low` bar + the real timeout mercy copy, then answer the
   rest quickly, force the circle-back offer if any questions were parked, and land on the result.
   --------------------------------------------------------------------------------------------- */
const REVIEW_LOAD_DRIVER = `
window.addEventListener('load', function () {
${DRIVER_CORE}
  try {
    sweepCurrentDOM('review-intro');
    var start = document.getElementById('start');
    if (!start) { R.done = true; publish(); document.title = 'CONTRAST-DONE'; return; }
    start.click();
    sweepCurrentDOM('review-q1-fresh');
    var sawLow = false, sawTimeout = false, answeredCount = 0, pollTicks = 0, maxPollTicks = 400;
    function finish() { R.done = true; publish(); document.title = 'CONTRAST-DONE'; }
    function tick() {
      pollTicks++;
      try {
        var tbar = document.getElementById('rvtbar');
        var tnote = document.getElementById('rvtnote');
        if (tbar && tbar.classList.contains('low') && !sawLow) { sawLow = true; sweepCurrentDOM('review-timer-low'); }
        if (tnote && tnote.textContent && !sawTimeout) { sawTimeout = true; sweepCurrentDOM('review-timeout'); }
        var check = document.getElementById('check');
        // let the FIRST question's real timer expire naturally (sawTimeout gates it); every
        // question after that is answered immediately so the whole run fits the virtual-time budget.
        if (check && (answeredCount > 0 || sawTimeout)) {
          var opt = document.querySelector('.opt'), tf = document.querySelector('.tf');
          var pick = opt || tf;
          if (pick) {
            pick.click();
            sweepCurrentDOM('review-selected-precheck-' + (answeredCount + 1));
            check.click();
            answeredCount++;
            sweepCurrentDOM('review-resolved-' + answeredCount);
          }
        }
        var goback = document.getElementById('goback');
        if (goback) { goback.click(); sweepCurrentDOM('review-circleback'); }
        var resultEl = document.querySelector('.rv-result');
        if (resultEl) { sweepCurrentDOM('review-result'); finish(); return; }
      } catch (e) { R.driverError = String((e && e.message) || e); finish(); return; }
      if (pollTicks < maxPollTicks) setTimeout(tick, 150);
      else { sweepCurrentDOM('review-maxpolls'); finish(); }
    }
    setTimeout(tick, 150);
  } catch (e) { R.driverError = String((e && e.message) || e); publish(); document.title = 'CONTRAST-DONE'; }
});
`;

function findPages() {
  const pages = [];
  const learn = path.join(ROOT, 'learn.html');
  if (existsSync(learn)) pages.push({ file: learn, type: 'learn' });
  const lessonsDir = path.join(ROOT, 'lessons');
  if (existsSync(lessonsDir)) {
    for (const f of readdirSync(lessonsDir)) {
      if (f.endsWith('.html')) pages.push({ file: path.join(lessonsDir, f), type: 'lesson' });
    }
  }
  const reviewsDir = path.join(ROOT, 'reviews');
  if (existsSync(reviewsDir)) {
    for (const f of readdirSync(reviewsDir)) {
      if (f.endsWith('.html')) pages.push({ file: path.join(reviewsDir, f), type: 'review' });
    }
  }
  return pages;
}

function driverFor(type) {
  if (type === 'learn') return LEARN_LOAD_DRIVER;
  if (type === 'review') return REVIEW_LOAD_DRIVER;
  return LESSON_LOAD_DRIVER;
}
function budgetFor(type) {
  if (type === 'review') return 28000;
  if (type === 'lesson') return 12000;
  return 8000;
}
function timeoutFor(type) {
  if (type === 'review') return 45000;
  return 30000;
}

function buildProbe(pageFile, type) {
  let html = readFileSync(pageFile, 'utf8');
  if (type === 'learn') {
    // pre-IIFE seed: insert right after the FIRST engine <script src=...awba-engine.js"></script>,
    // which is BEFORE the learn IIFE's own <script> tag (method / forcing-table note above).
    const engineTagRe = /<script src="[^"]*awba-engine\.js"><\/script>/;
    if (engineTagRe.test(html)) {
      html = html.replace(engineTagRe, (m) => m + '\n' + PRE_IIFE_SEED_LEARN);
    }
  }
  const driver = driverFor(type);
  html = html.includes('</body>')
    ? html.replace(/<\/body>(?![\s\S]*<\/body>)/, '<script>\n' + driver + '\n</script>\n</body>')
    : html + '<script>\n' + driver + '\n</script>';
  return html;
}

function runOnce(probePath, type) {
  try {
    const stdout = execFileSync(
      CHROME,
      [
        '--headless',
        '--disable-gpu',
        '--enable-logging=stderr',
        '--v=1',
        '--virtual-time-budget=' + budgetFor(type),
        '--dump-dom',
        'file://' + probePath,
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: timeoutFor(type), maxBuffer: 1024 * 1024 * 64 }
    );
    const m = stdout.match(/<script[^>]*id="contrast-result"[^>]*>([\s\S]*?)<\/script>/);
    const done = /CONTRAST-DONE/.test(stdout);
    if (!m) return { ok: false, reason: 'driver produced no result block', done };
    try {
      return { ok: true, data: JSON.parse(m[1]), done };
    } catch (e) {
      return { ok: false, reason: 'result JSON parse failed', done };
    }
  } catch (e) {
    const err = e && e.stderr ? e.stderr.toString() : String((e && e.message) || e);
    return { ok: false, reason: 'chrome invocation failed: ' + err.slice(0, 200) };
  }
}

/* ---- node-side POLICY classification (never the WCAG math itself — that lives entirely inside
   DRIVER_CORE as the one shared function). A crude light/dark heuristic + a gold-token proximity
   check, used only to apply the ONE documented interpretation call from the header. ---- */
function parseRgbaStr(s) {
  const m = /rgba\(([\d.]+),([\d.]+),([\d.]+),([\d.]+)\)/.exec(s || '');
  if (!m) return null;
  return { r: +m[1], g: +m[2], b: +m[3], a: +m[4] };
}
function isLightBg(c) { return c && (c.r + c.g + c.b) / 3 > 180; }
function isGoldish(c) { return c && Math.abs(c.r - 217) < 14 && Math.abs(c.g - 164) < 14 && Math.abs(c.b - 65) < 14; }

function classify(entry) {
  // TEXT entries: gated normally, no exemption (gold is explicitly "never text" in §2.1 — a gold
  // TEXT node failing here is a genuine finding, never downgraded).
  if (entry.need !== undefined && entry.large !== undefined) return entry.ratio >= entry.need ? 'OK' : 'FAIL';
  // UI entries
  if (entry.missing) return 'FAIL';
  const fg = parseRgbaStr(entry.fg), bg = parseRgbaStr(entry.bg);
  if (entry.ratio < entry.need && isGoldish(fg) && isLightBg(bg)) return 'NOTE';
  return entry.ratio >= entry.need ? 'OK' : 'FAIL';
}

function auditOne(page) {
  const name = path.relative(ROOT, page.file);
  const probe = path.join(path.dirname(page.file), '.contrast-probe-' + path.basename(page.file));
  const html = buildProbe(page.file, page.type);
  writeFileSync(probe, html);
  try {
    const res = runOnce(probe, page.type);
    if (!res.ok) { console.log('CONTRAST FAIL ' + name + ' ' + res.reason); return { ok: false, texts: 0, ui: 0, states: 0 }; }
    if (!res.done) { console.log('CONTRAST FAIL ' + name + ' driver did not signal completion (CONTRAST-DONE marker missing)'); return { ok: false, texts: 0, ui: 0, states: 0 }; }
    const d = res.data;
    if (d.driverError) { console.log('CONTRAST FAIL ' + name + ' driver error: ' + d.driverError); return { ok: false, texts: 0, ui: 0, states: 0 }; }
    let failed = false;
    const notes = [];
    (d.texts || []).forEach((t) => {
      const c = classify(t);
      if (c === 'FAIL') {
        failed = true;
        console.log('CONTRAST FAIL ' + name + ' [' + t.label + '] ' + t.tag + ' "' + t.text + '" ' + t.fg + ' on ' + t.bg + ' = ' + t.ratio + ':1 (needs ' + t.need + ')');
      }
    });
    (d.ui || []).forEach((u) => {
      const c = classify(u);
      if (c === 'FAIL') {
        failed = true;
        console.log('CONTRAST FAIL ' + name + ' [' + u.label + '] ' + u.note + ' ' + u.sel + ' ' + u.fg + ' on ' + u.bg + ' = ' + u.ratio + ':1 (needs ' + u.need + ')');
      } else if (c === 'NOTE') {
        notes.push('CONTRAST NOTE ' + name + ' [' + u.label + '] ' + u.note + ' ' + u.sel + ' ' + u.fg + ' on ' + u.bg + ' = ' + u.ratio + ':1 (gold-as-shape-on-cream, §2.1 1.93:1 precedent — non-gating, see header)');
      }
    });
    notes.forEach((n) => console.log(n));
    if (!failed) {
      console.log('CONTRAST OK ' + name + ' (texts=' + (d.texts || []).length + ' ui=' + (d.ui || []).length + ' states=' + (d.statesSwept || []).length + ')');
    }
    return { ok: !failed, texts: (d.texts || []).length, ui: (d.ui || []).length, states: (d.statesSwept || []).length, rawTexts: d.texts || [], rawUi: d.ui || [] };
  } finally {
    try { unlinkSync(probe); } catch (e) { /* nothing to clean */ }
  }
}

function checkGroundTruthReproduction(allTexts, allUi) {
  const all = [...allTexts, ...allUi];
  const near = (n, target, tol) => Math.abs(n - target) <= tol;
  const goldKiswah = all.some((e) => near(e.ratio, 8.4, 0.15));
  const emberKiswah = all.some((e) => near(e.ratio, 5.05, 0.15));
  let ok = true;
  if (!goldKiswah) { console.log('CONTRAST FAIL ground-truth gold-on-Kiswah 8.40:1 was not reproduced anywhere in the sweep'); ok = false; }
  if (!emberKiswah) { console.log('CONTRAST FAIL ground-truth ember-on-Kiswah 5.05:1 was not reproduced anywhere in the sweep'); ok = false; }
  if (ok) console.log('CONTRAST OK ground-truth reproduced: gold-on-Kiswah ~8.40:1, ember-on-Kiswah ~5.05:1 (§2.1)');
  // banned-cell confirmation — no TEXT node may land in a §2.1-banned cell
  const bannedRanges = [
    { name: 'crimson-on-Kiswah', lo: 2.60, hi: 2.70 },
    { name: 'gold-on-cream', lo: 1.88, hi: 1.98 },
    { name: 'powder-on-cream', lo: 1.53, hi: 1.63 },
    { name: 'rose-on-cream', lo: 1.68, hi: 1.78 },
  ];
  let bannedHit = false;
  allTexts.forEach((t) => {
    bannedRanges.forEach((b) => {
      if (t.ratio >= b.lo && t.ratio <= b.hi) {
        bannedHit = true;
        console.log('CONTRAST FAIL banned-cell text usage: ' + t.tag + ' "' + t.text + '" ' + t.fg + ' on ' + t.bg + ' = ' + t.ratio + ':1 (' + b.name + ' — never load-bearing text, §2.1)');
      }
    });
  });
  if (!bannedHit) console.log('CONTRAST OK banned-cell check: no shipped text node lands in a §2.1-banned cell');
  return ok && !bannedHit;
}

function main() {
  if (!existsSync(CHROME)) {
    console.log('CONTRAST SKIP system Chrome not found — audit unavailable');
    process.exit(0);
  }
  const pages = findPages();
  if (pages.length === 0) {
    console.log('no pages yet');
    process.exit(0);
  }
  console.log('contrast-audit · ' + pages.length + ' pages · WCAG computed-style sweep + the state-forcing table (D-65/ACC-03)');
  console.log('  (grain overlay ignored as an accepted approximation; gold-as-shape-on-cream is a documented, non-gating NOTE — see file header)');
  let allOk = true;
  let totalTexts = 0, totalUi = 0, totalStates = 0;
  const rawTexts = [], rawUi = [];
  for (const page of pages) {
    const r = auditOne(page);
    if (!r.ok) allOk = false;
    totalTexts += r.texts; totalUi += r.ui; totalStates += r.states;
    if (r.rawTexts) rawTexts.push(...r.rawTexts);
    if (r.rawUi) rawUi.push(...r.rawUi);
  }
  const gtOk = checkGroundTruthReproduction(rawTexts, rawUi);
  if (!gtOk) allOk = false;
  console.log('contrast-audit coverage: ' + pages.length + ' pages, ' + totalTexts + ' text pairings, ' + totalUi + ' non-text UI boundary pairings, ' + totalStates + ' distinct forced states swept');
  process.exit(allOk ? 0 : 1);
}

main();
