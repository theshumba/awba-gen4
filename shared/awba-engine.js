/* ============================================================================================
   awba-engine.js  ·  Awba Gen-4 — the one engine script
   --------------------------------------------------------------------------------------------
   The single shared classic-script every page (`index.html`, `learn.html`, every lesson/review
   data file) loads via `<script src="../shared/awba-engine.js"></script>` — never an ES module
   script type, no `defer`/`async` on this tag, ever. `window.AW` (below, `const AW = {}`) is defined the
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

/* ---------- pure, DOM-free state helpers (D-18/D-19) ----------
   AW.state()/touchDay()/greetMode()/weekCal() read/write ONLY through AW.S (never localStorage
   directly). The node-state derivation helper further below is fully PURE — it takes progress
   as an argument and never touches AW.S/localStorage at all, so it is unit-testable with
   hand-built fixtures independent of any real course map (real-map unlock order is verified in
   Phase 5, CNT-03). */

/* parseLocalYMD: the inverse of toLocalYMD — parses "YYYY-MM-DD" from local parts. Constructing
   via `new Date(y, m-1, d)` (NOT `new Date(ymdString)`) matters: parsing a bare "YYYY-MM-DD"
   string is defined to land on UTC midnight, which would silently shift greetMode's day-diff in
   any non-zero UTC offset — the exact class of bug D-16 exists to avoid. */
function parseLocalYMD(ymd) {
  var parts = ymd.split('-');
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}
function localMidnight(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

AW.todayStr = function () {
  return toLocalYMD(new Date());
};

/* AW.state() — one-read snapshot; consumers read once per render pass and never re-read inside
   loops (anti-pattern 3). Adds `chests` to the Gen-3 snapshot shape (D-13). */
AW.state = function () {
  return {
    noor: AW.S.get('noor', 0),
    returns: AW.S.get('returns', 0),
    stars: AW.S.get('stars', {}),
    days: AW.S.get('days', []),
    lastDay: AW.S.get('lastDay', null),
    chests: AW.S.get('chests', {}),
  };
};

/* AW.touchDay() — the mercy-streak engine. Fires on lesson/review "begin", never on page load
   (callers wire that in Phase 4/5). returns++ only on the first activity of a new day; seeds
   returns at 1 on the first-ever visit (lastDay starts null, so `last !== t` on the first call). */
AW.touchDay = function () {
  var t = AW.todayStr();
  var last = AW.S.get('lastDay', null);
  var ret = AW.S.get('returns', 0);
  if (last !== t) {
    ret = ret + 1;
    AW.S.set('returns', ret);
    AW.S.set('lastDay', t);
    var days = AW.S.get('days', []);
    if (days.indexOf(t) < 0) {
      days.push(t);
      AW.S.set('days', days.slice(-90));
    }
  }
  return ret;
};

/* AW.greetMode() — first / streak (diff<=1) / returning. Both sides of the diff are constructed
   from local date parts (parseLocalYMD / localMidnight), never from `new Date(ymdString)`. */
AW.greetMode = function () {
  var last = AW.S.get('lastDay', null);
  if (!last) return 'first';
  var todayL = localMidnight(new Date());
  var lastL = parseLocalYMD(last);
  var diff = Math.round((todayL - lastL) / 86400000);
  return diff <= 1 ? 'streak' : 'returning';
};

/* AW.weekCal() — DOM-free Mon-Su week membership over `days` (internal YYYY-MM-DD format).
   Returns structured day data (array of {label, on}); building the markup half is Phase 3/5. */
AW.weekCal = function () {
  var days = AW.S.get('days', []);
  var labels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  var now = new Date();
  var dow = (now.getDay() + 6) % 7; // Mon=0..Sun=6
  var week = [];
  for (var i = 0; i < 7; i++) {
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dow + i);
    var on = days.indexOf(toLocalYMD(d)) >= 0;
    week.push({ label: labels[i], on: on });
  }
  return week;
};

/* AW.deriveNodeState(nodesFlat, progress) — PURE: this body reaches no storage layer of any
   kind; the caller passes progress.stars/progress.chests explicitly. Promoted from
   learn.html's nodeState() (Gen-3), rewritten as a pure function returning per-node state for
   the whole flat array: [{id, state}], state in {locked, active, done, available}.
   - chest node: 'available' if the immediately-preceding node has stars AND the chest is
     unopened; 'done' if opened; else 'locked'.
   - lesson/review node: 'done' if it has stars; else 'active' if every prior non-chest node has
     stars (strictly linear across all units); else 'locked'. */
  AW.deriveNodeState = function (nodesFlat, progress) {
    var stars = (progress && progress.stars) || {};
    var chests = (progress && progress.chests) || {};
    return nodesFlat.map(function (node, idx) {
      var state;
      if (node.chest) {
        var prev = nodesFlat[idx - 1];
        var prevHasStars = prev && stars[prev.id];
        if (!prevHasStars) {
          state = 'locked';
        } else {
          state = chests[node.id] ? 'done' : 'available';
        }
      } else if (stars[node.id]) {
        state = 'done';
      } else {
        var locked = false;
        for (var i = 0; i < idx; i++) {
          if (nodesFlat[i].chest) continue;
          if (!stars[nodesFlat[i].id]) {
            locked = true;
            break;
          }
        }
        state = locked ? 'locked' : 'active';
      }
      return { id: node.id, state: state };
    });
  };

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
