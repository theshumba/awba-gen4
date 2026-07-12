/* ============================================================================================
   awba-engine.js  ·  Awba Gen-4 — the one engine script
   --------------------------------------------------------------------------------------------
   The single shared classic-script every page (`index.html`, `learn.html`, every lesson/review
   data file) loads via `<script src="../shared/awba-engine.js"></script>` — no `type="module"`,
   no `defer`/`async` on this tag, ever. `window.AW` (below, `const AW = {}`) is defined the
   instant this script parses, synchronously, at the top level: Josh's 15 lesson + 4 review data
   files call `AW.cite(...)` and friends *inside* their own inline `<script>` the moment it runs,
   so `AW` must already exist. This is what makes every page work double-clicked from `file://`
   (FND-07 / D-22 / D-23).

   Sections land in this file, in this order, over the life of the project — ONE file, never
   split (every extra <script> tag would force edits into all 19 of Josh's data files):

     STATE       — Phase 2 (this phase). awba_state + awba_prefs versioned localStorage blobs,
                   the lossless Gen-3 migration chain, and the pure state-derivation helpers
                   (FND-05, FND-06, FND-07). DOM-independent by design.
     KIT         — Phase 3/4 placeholder. Icon kit (AW.KIT), companion lantern art, glyphs.
     COMPONENTS  — Phase 3/4 placeholder. Shared UI builders (sheets, cite chips, confetti).
     RUNNERS     — Phase 4 placeholder. AwbaLesson(cfg) / AwbaReview(cfg) engine runners.

   `AW.S`/`AW.prefs` (below) are the ONLY code in this codebase allowed to touch `localStorage`
   (D-24, enforced by a grep gate in every plan's verification). Every other page/section reads
   and writes progress exclusively through `AW.S.get(key, default)` / `AW.S.set(key, value)`.
   ============================================================================================ */

/* ============================================================
   STATE  ·  FND-05 (awba_state + migration) / FND-06 (awba_prefs)
              / FND-07 (parse-time AW namespace, classic script)
   ============================================================ */

const AW = {};

/* ---------- shared local-date helper (D-16: local YYYY-MM-DD, never a UTC-based ISO format) ----------
   Any UTC-serializing date-to-string conversion can silently return the WRONG calendar day
   depending on the reviewer's UTC offset (measured this session: 2026-07-11 local rendered as
   2026-07-10 via a UTC-based conversion in BST). Every date this file stores or compares is
   formatted from local getters (getFullYear/getMonth/getDate) instead — never from a UTC
   serialization method. */
function pad2(n) {
  return String(n).padStart(2, '0');
}
function toLocalYMD(d) {
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
}
function isValidDate(d) {
  return d instanceof Date && !isNaN(d.getTime());
}

/* ---------- AW.S — versioned awba_state blob + lazy Gen-3 migration (D-13/D-14/D-17) ----------
   External call shape is frozen: AW.S.get(key, default) / AW.S.set(key, value) — a generic
   key/value surface over the in-memory parsed blob. Callers never learn about `awba_state` or
   schema versions; the whole blob is re-persisted on every `set` (Pattern 1, verified). */
AW.S = (function () {
  var KEY = 'awba_state';
  var CURRENT = 1;
  var mem = null;

  function defaultState() {
    return { schemaVersion: CURRENT, noor: 0, returns: 0, lastDay: null, days: [], stars: {}, chests: {} };
  }

  /* Sequential migration chain seam for future schema bumps — empty at v1. migrations[n] takes
     a state object at schemaVersion n and returns one at schemaVersion n+1. */
  var migrations = [];

  function runMigrations(state) {
    var s = state;
    while (s.schemaVersion < CURRENT) {
      var step = migrations[s.schemaVersion];
      if (typeof step !== 'function') break; // no migration registered — stop where we are
      s = step(s);
    }
    if (s.schemaVersion !== CURRENT) s.schemaVersion = CURRENT;
    return s;
  }

  /* readLegacy: same silent-tolerant try/catch as Gen-3's AW.S.get — corrupted/missing legacy
     fields resolve to `undefined`, never throw (Pitfall 5/6). */
  function readLegacy(rawKey) {
    try {
      var v = localStorage.getItem(rawKey);
      return v === null ? undefined : JSON.parse(v);
    } catch (e) {
      return undefined;
    }
  }

  function migrateFromLegacy() {
    var s = defaultState();
    var found = false;

    try {
      var noor = readLegacy('awba_noor');
      if (typeof noor === 'number' && !isNaN(noor)) {
        s.noor = noor;
        found = true;
      }
    } catch (e) {}

    try {
      var ret = readLegacy('awba_returns');
      if (typeof ret === 'number' && !isNaN(ret)) {
        s.returns = ret;
        found = true;
      }
    } catch (e) {}

    try {
      var last = readLegacy('awba_lastDay');
      if (last != null) {
        var ld = new Date(last);
        if (isValidDate(ld)) {
          s.lastDay = toLocalYMD(ld);
          found = true;
        }
      }
    } catch (e) {}

    try {
      var days = readLegacy('awba_days');
      if (Array.isArray(days)) {
        s.days = days
          .map(function (d) {
            return new Date(d);
          })
          .filter(isValidDate)
          .map(toLocalYMD)
          .slice(-90);
        found = true;
      }
    } catch (e) {}

    try {
      var st = readLegacy('awba_stars');
      if (st && typeof st === 'object' && !Array.isArray(st)) {
        s.stars = st;
        found = true;
      }
    } catch (e) {}

    /* Enumerate awba_chest_<id> keys via the standard Storage length/key(i) API — portable
       across both real browser localStorage AND a plain-object test stub. (Object.keys() only
       works on real Storage instances, whose entries are exposed as enumerable own properties;
       a hand-written stub implementing just getItem/setItem/key/length would silently find
       nothing.) */
    try {
      var chestCount = localStorage.length;
      for (var ci = 0; ci < chestCount; ci++) {
        var chestKey = localStorage.key(ci);
        if (chestKey && chestKey.indexOf('awba_chest_') === 0) {
          var val = readLegacy(chestKey);
          if (val === true) {
            s.chests[chestKey.slice('awba_chest_'.length)] = true;
            found = true;
          }
        }
      }
    } catch (e) {}

    return found ? s : null;
  }

  function persist(s) {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (e) {
      /* quota exceeded / private-mode: session keeps working from `mem`, just isn't saved */
    }
  }

  function load() {
    var raw = null;
    try {
      raw = localStorage.getItem(KEY);
    } catch (e) {
      raw = null;
    }
    if (raw) {
      try {
        var s = JSON.parse(raw);
        if (s && s.schemaVersion === CURRENT) return s;
        if (s && typeof s.schemaVersion === 'number' && s.schemaVersion < CURRENT) {
          var migrated = runMigrations(s);
          persist(migrated);
          return migrated;
        }
      } catch (e) {
        /* corrupted awba_state blob — fall through to legacy/default resolution */
      }
    }
    var fromLegacy = migrateFromLegacy();
    if (fromLegacy) {
      persist(fromLegacy); // write ONCE (D-14 step 3); legacy keys are NEVER deleted (D-15)
      return fromLegacy;
    }
    var def = defaultState();
    persist(def);
    return def;
  }

  return {
    get: function (k, d) {
      if (!mem) mem = load();
      return k in mem && mem[k] !== undefined ? mem[k] : d;
    },
    set: function (k, v) {
      if (!mem) mem = load();
      mem[k] = v;
      persist(mem);
    },
  };
})();

/* ---------- AW.prefs — separate versioned awba_prefs blob (D-20) ----------
   Same wrapper shape as AW.S, own key, never mixed into progress state so clearing/migrating
   one can never corrupt the other. */
AW.prefs = (function () {
  var KEY = 'awba_prefs';
  var CURRENT = 1;
  var mem = null;

  function defaultPrefs() {
    return { schemaVersion: CURRENT, soundMuted: false, motion: 'system' };
  }

  function persist(p) {
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch (e) {}
  }

  function load() {
    var raw = null;
    try {
      raw = localStorage.getItem(KEY);
    } catch (e) {
      raw = null;
    }
    if (raw) {
      try {
        var p = JSON.parse(raw);
        if (p && p.schemaVersion === CURRENT) return p;
      } catch (e) {
        /* corrupted awba_prefs — fall through to default */
      }
    }
    var def = defaultPrefs();
    persist(def);
    return def;
  }

  return {
    get: function (k, d) {
      if (!mem) mem = load();
      return k in mem && mem[k] !== undefined ? mem[k] : d;
    },
    set: function (k, v) {
      if (!mem) mem = load();
      mem[k] = v;
      persist(mem);
    },
  };
})();

/* ---------- boot-stamp — apply prefs to <html> at parse time (D-21) ----------
   Guarded so the headless migration test (no `document` global) never executes this block. */
if (typeof document !== 'undefined') {
  if (AW.prefs.get('motion', 'system') === 'reduce') {
    document.documentElement.setAttribute('data-motion', 'reduce');
  }
  if (AW.prefs.get('soundMuted', false)) {
    document.documentElement.setAttribute('data-sound', 'muted');
  }
}

/* Test ergonomics only (harmless in-browser): expose AW on globalThis so a headless test can
   read `ctx.AW` directly after a separate vm run, without needing the engine+probe
   concatenation trick. In-browser, data files already reference `AW` as a free identifier
   resolving against this script's lexical scope regardless of this line. */
if (typeof globalThis !== 'undefined') globalThis.AW = AW;

/* ============================================================
   KIT  ·  Phase 3/4 placeholder — icon kit, companion art, glyphs (D-22)
   ============================================================ */

/* ============================================================
   COMPONENTS  ·  Phase 3/4 placeholder — shared UI builders (D-22)
   ============================================================ */

/* ============================================================
   RUNNERS  ·  Phase 4 placeholder — AwbaLesson(cfg) / AwbaReview(cfg) (D-22)
   ============================================================ */
