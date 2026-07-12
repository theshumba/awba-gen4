/* ============================================================================================
   date-helpers.js  ·  Awba Gen-4 — shared local-date test helper (IN-01)
   --------------------------------------------------------------------------------------------
   `pad`/`ymd` were previously byte-identical, independently declared in both
   state-storage.test.js and state-helpers.test.js. state-storage.test.js also did
   `module.exports = { ymd }` inviting reuse — but `require()`-ing a test file with top-level
   `test(...)` calls re-executes/re-registers its entire suite as a side effect, which is a
   latent footgun, not a safe import. This module is NOT a test file (no `test(...)` calls), so
   both suites can `require()` it directly with zero side effects.
   ============================================================================================ */
'use strict';

function pad(n) {
  return String(n).padStart(2, '0');
}

function ymd(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

module.exports = { pad, ymd };
