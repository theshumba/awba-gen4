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
     KIT         — Phase 3 (built). Icon kit (AW.KIT, 20 scenes) + glyph marks (AW.GLYPHS, 13).
     COMPONENTS  — Phase 3 (built). Shared UI builders (icon accessor, cite/term chips,
                   the singleton sheet, the reduced-motion self-guard, the WAAPI exemplar).
     RUNNERS     — Phase 4 (built). AwbaLesson(cfg) / AwbaReview(cfg) engine runners: pure
                   quiz/review math helpers, the 9 beat renderers, the WAAPI reward
                   choreography + Ring moment, and the timed review state-machine.

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
  /* memFallback (W1): set true when load() resolves from an in-memory COPY of an
     unrecognized-schema blob it deliberately declined to persist (the fall-through below).
     set() consults it to skip persist() so a later write (e.g. the ringSeed lazy accessor)
     can never clobber that untouched-on-disk blob.
     BLAST RADIUS (WR-09) — this is intentionally session-wide, NOT per-write: once tripped, EVERY
     AW.S.set() for the rest of the session (noor, returns, lastDay/days, stars, chests, the ringSeed
     mint) works from the in-memory copy and is not written back, so that session's progress is
     discarded on the next load. That is the correct trade — a future-schema blob a newer build wrote
     must never be overwritten by this older build — but it is otherwise silent. AW.S.isFallback()
     below exposes this flag so a caller/support tool can detect the degraded-persistence state and
     surface a notice. AW.prefs is a separate closure with its own key and is UNAFFECTED: prefs still
     persist normally. The suppression semantics are unchanged; only its discoverability is added. */
  var memFallback = false;

  function defaultState() {
    return { schemaVersion: CURRENT, noor: 0, returns: 0, lastDay: null, days: [], stars: {}, chests: {} };
  }

  /* Sequential migration chain seam for future schema bumps — empty at v1. migrations[n] takes
     a state object at schemaVersion n and returns one at schemaVersion n+1. */
  var migrations = [];

  function runMigrations(state) {
    var s = state;
    var guard = 0;
    while (s.schemaVersion < CURRENT) {
      if (++guard > 50) {
        // Safety valve — never trust a migration step blindly. 50 is far more than this app
        // will ever need (one bump per schema change), so hitting it means something is wrong.
        throw new Error('runMigrations: exceeded 50 iterations without reaching schemaVersion ' + CURRENT + ' — aborting to avoid an infinite loop');
      }
      var step = migrations[s.schemaVersion];
      if (typeof step !== 'function') break; // no migration registered — stop where we are
      var next = step(s);
      if (!next || typeof next.schemaVersion !== 'number' || next.schemaVersion <= s.schemaVersion) {
        // WR-02: a migration step that doesn't bump schemaVersion would otherwise spin this
        // while loop forever (a full synchronous main-thread hang, not a crash) — bail loudly
        // instead. The caller (load()) already wraps this in a try/catch and falls back to
        // legacy/default resolution.
        throw new Error('runMigrations: migration step for schemaVersion ' + s.schemaVersion + ' did not advance schemaVersion — aborting to avoid an infinite loop');
      }
      s = next;
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
        if (s) {
          /* Anything else for a successfully-parsed, truthy blob — schemaVersion missing,
             non-numeric (incl. NaN/string), or GREATER than CURRENT (a newer tab's build
             already wrote a higher schemaVersion, or a stray DevTools edit dropped the field).
             This build doesn't recognize the shape well enough to migrate it, but the existing
             blob may hold real noor/stars/days/chests progress that must never be silently
             wiped (non-destructive principle, D-15 extends here). Work this session from an
             in-memory COPY only — deliberately do NOT persist() over the untouched blob, so it
             survives on disk exactly as-is for a build that DOES recognize it (or a human) to
             resolve later. */
          var isPlainObj = typeof s === 'object' && !Array.isArray(s);
          if (isPlainObj) {
            memFallback = true; // W1: work from a copy; never persist over the untouched blob
            return Object.assign({}, s);
          }
          return defaultState();
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

  /* defensiveCopy: WR-01 — never return a live reference into `mem` for object/array-valued
     keys (stars/days/chests). Without this, `AW.S.get('stars', {})[id] = 3` (or any future
     RUNNERS caller doing the same) would mutate `mem.stars` in place WITHOUT ever calling
     `AW.S.set()`, silently bypassing the get/set-only write contract this file's header
     documents as load-bearing. Values here are always small, JSON-safe (numbers/strings/
     booleans/plain objects/arrays), so a JSON round-trip is correct and cheap; `structuredClone`
     is used when available as the more direct native primitive. */
  function defensiveCopy(v) {
    if (v === null || typeof v !== 'object') return v;
    return typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v));
  }

  return {
    get: function (k, d) {
      if (!mem) mem = load();
      return k in mem && mem[k] !== undefined ? defensiveCopy(mem[k]) : d;
    },
    set: function (k, v) {
      if (!mem) mem = load();
      mem[k] = v;
      if (!memFallback) persist(mem); // W1: skip persist over an unrecognized-schema blob
    },
    /* isFallback (WR-09): read-only view of the degraded-persistence state. Ensures load() has run
       (the same lazy contract as get/set) then reports whether this session is working from an
       un-persisted in-memory copy of an unrecognized-schema blob — i.e. whether AW.S.set() writes
       are being suppressed for the session. Never mutates state; does not change the suppression
       semantics. Callers/support tooling can use it to surface a "progress not saving" notice. */
    isFallback: function () {
      if (!mem) mem = load();
      return memFallback;
    },
    /* reset (S2 · More Start-over, D.4) — rebuild awba_state to defaults, clearing noor/returns/
       lastDay/days/stars/chests, but PRESERVE ringSeed (law 10 — the maker's mark is minted once and
       NEVER regenerated; the same fingerprint re-inks the fresh path, keeping "the same ring… inked
       again" honest). Lazily loads first (same contract as get/set) so an on-disk ringSeed is captured
       even before any other AW.S access. Reuses defaultState()/persist — adds NO new storage-API
       literal (the count stays 13) — and no-ops the write under memFallback exactly like set(), so a
       newer-schema blob is never clobbered. Persisting a defaultState() blob (schemaVersion CURRENT)
       also blocks legacy re-migration on the next load(): a recognized awba_state blob short-circuits
       migrateFromLegacy, leaving the orphaned Gen-3 keys untouched (D-15). */
    reset: function () {
      if (!mem) mem = load();
      var seed = mem.ringSeed;
      mem = defaultState();
      if (seed != null) mem.ringSeed = seed;
      if (!memFallback) persist(mem);
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
    /* prayerTimes + skyMode seed the prayer-clock Sky (§7.2 / D-A13) for fresh installs. CURRENT is
       deliberately NOT bumped: AW.prefs.get(k, d) returns d when a key is absent, so an existing v1
       awba_prefs blob (soundMuted/motion only, no Sky fields) still loads untouched and every Sky
       read falls back to its default. skyDefaultTimes() returns a fresh object (never a shared
       singleton) — the single source of truth shared with the boot read's fallback. */
    return {
      schemaVersion: CURRENT,
      soundMuted: false,
      motion: 'system',
      prayerTimes: skyDefaultTimes(),
      skyMode: 'manual',
    };
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
   loops (anti-pattern 3). Adds `chests` to the Gen-3 snapshot shape (D-13). Every field below is
   built from AW.S.get(), whose object/array-valued results are already defensive copies
   (WR-01) — so mutating the snapshot this returns (e.g. `AW.state().stars[id] = 3`) can never
   corrupt `mem` or bypass AW.S.set(). */
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

/* NODE_ATOMS — the verbatim per-node taught-atom map (D-57/R-1), copied byte-faithfully from
   05-RESEARCH.md §Atom Map (Josh's BUILD-RECORD §4, cross-checked against the source atom
   files). The 15 lesson ids only — reviews/chests teach no atoms of their own, so they are
   deliberately absent (AW.atomsDone below reads NODE_ATOMS[id]||0, which is 0 for any id not
   listed here). Σ === 61 = the 65-atom corpus minus 4 documented, un-earnable holds (U3-13,
   U3-16, U4-03, U4-09) — never invent a count; this map IS the taught total. */
  var NODE_ATOMS = {
    u1m1: 3, u1m2: 4, u1m3: 5, u1m4: 5,
    u2m1: 5, u2m2: 4, u2m3: 3, u2m3b: 3,
    u3m1: 4, u3m2: 5, u3m3: 5,
    u4m1: 3, u4m2: 4, u4m2b: 4, u4m3: 4
  };

/* AW.atomsDone(progress) — PURE: Σ NODE_ATOMS[id] over every id present in progress.stars.
   Review/chest star keys contribute 0 (they are simply absent from NODE_ATOMS). One constant,
   one place — every Ring caller + AW.skyDawn + the boot --dawn stamp reads this, never a *3
   proxy or an invented number (D-57/R-1). */
  AW.atomsDone = function (progress) {
    var stars = (progress && progress.stars) || {};
    var total = 0;
    for (var id in stars) {
      if (Object.prototype.hasOwnProperty.call(stars, id)) total += (NODE_ATOMS[id] || 0);
    }
    return total;
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

  /* SKY (§7.2) — paint the manual prayer-clock temperature as the §3.2 [data-sky] tint OVER the
     Kiswah Orbit ground (law 1: a tint, never a second ground). Manual times are the v1 floor —
     no device-location API, no network, no timers ever fire (T-03-10). skyTemp/skyDawn/
     skyDefaultTimes are hoisted declarations (in the SKY block below), so this parse-time DOM
     touch can call them even though they read later in the file. dataset.sky is stamped on the
     canonical <html> carrier AND mirrored onto the home shell (a .reg-orbit) when it exists, so
     the §3.2 painter (.reg-orbit[data-sky]::after) fires. Re-evaluated on tab-return / next open
     via events — never a timer. */
  var applySky = function () {
    var mode = AW.prefs.get('skyMode', 'manual');
    var times = AW.prefs.get('prayerTimes', skyDefaultTimes());
    var temp = skyTemp(new Date(), times, mode);
    document.documentElement.dataset.sky = temp;
    var home = document.querySelector('.reg-orbit');
    if (home) home.dataset.sky = temp;
  };
  applySky();

  /* --dawn (§7.3) — the subordinate horizon-warmth degree, scaled by course progress and capped by
     skyDawn so it stays ambient and can never be mistaken for the Ring (the Ring is the metric).
     Reads the exact taught-atom frontier via AW.atomsDone(AW.state()) (D-57/R-1, the 61-atom
     total) — never a node-count proxy. Set on <html> so .reg-orbit::before inherits var(--dawn). */
  try {
    document.documentElement.style.setProperty('--dawn', String(skyDawn(AW.atomsDone(AW.state()))));
  } catch (e) {}

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') applySky();
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applySky);
  }

  /* ---------- AW.announce(text) — the ONE body-level polite live region (D-64/ACC-02) ----------
     Mirrors the applySky lazy+DCL-ensure precedent immediately above. `ensureAnnounceRegion()`
     lazily creates (or re-finds) a single role="status" <div class="aw-sr"> as a DIRECT child of
     document.body — never nested inside a container a runner's innerHTML wipe destroys (Pitfall
     1: both runners wipe document.body.innerHTML at init; learn.html rebuilds #app.innerHTML per
     render). document.body is null at parse time on every page (this engine loads in <head> with
     no defer — D-22/D-23), so the immediate call below is a safe no-op there; the DOMContentLoaded
     ensure (the SAME readyState==='loading' guard as applySky) creates the region once body exists
     — which always lands AFTER a runner's own inline script (further down the same body) has
     already run and wiped body.innerHTML, so the region is never caught by that wipe. `AW.announce`
     sets `textContent` ONLY — never innerHTML, so no markup/script can ever reach the region
     (T-06-04a). The write is SYNCHRONOUS last-write-wins (a later call in the same task replaces
     the text at once, no trailing delay), so an in-place event's line is inspectable in the very
     task that fired it — the 06-05 a11y probes read the region synchronously right after the
     triggering .click(); the runners announce exactly ONCE per resolve/answer, so there is no burst
     to batch (Pitfall 9 / T-06-05b). An identical repeat string is re-announced via
     clear-then-set-in-rAF, since some screen readers do not re-announce a node whose text didn't
     change. */
  var ensureAnnounceRegion = function () {
    if (!document.body) return null;
    var r = document.body.querySelector(':scope > [role="status"]');
    if (r) return r;
    r = document.createElement('div');
    r.className = 'aw-sr';
    r.setAttribute('role', 'status');
    r.setAttribute('aria-live', 'polite');
    r.setAttribute('aria-atomic', 'true');
    document.body.appendChild(r);
    return r;
  };
  ensureAnnounceRegion();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureAnnounceRegion);
  }
  AW.announce = function (text) {
    var next = text == null ? '' : String(text);
    var r = ensureAnnounceRegion();
    if (!r) return;
    if (r.textContent === next) {
      r.textContent = '';
      var raf = window.requestAnimationFrame || function (cb) { setTimeout(cb, 0); };
      raf(function () { var rr = ensureAnnounceRegion(); if (rr) rr.textContent = next; });
    } else {
      r.textContent = next;
    }
  };
}

/* ---------- cross-document page morph (MOT-02 / D-58) — the ONE shared-element name pair ----------
   Guarded (typeof document) exactly like the boot-stamp above, so the headless ls-stub tests (no
   window/document in the vm sandbox) never run this. Each handler bails when e.viewTransition is
   null — an opaque-origin file:// navigation (or an unsupported browser) then simply navigates,
   with zero console noise (Pitfall 2 / T-05-04a). Because the engine loads on all 20 pages, this
   one block gives every page the calm native morph with NO per-page edit: the learn side stamps the
   tapped square handed over in window.__awbaMorphEl (pageswap), the lesson side stamps its .hero-ico
   opener scene-icon square (pagereveal — the SAME unit icon the tapped node carries, and the only
   .hero-ico in the document at snapshot time), and BOTH clear the mark after `finished` so successive navigations
   never carry two same-named boxes (a collision aborts the morph — the uniqueness rule). Scripture
   is never a source (no .ayah/.scard/epigraph is ever handed in — D-58). Reads/writes no storage. */
if (typeof document !== 'undefined') {
  window.addEventListener('pageswap', function (e) {
    if (!e.viewTransition) return;                        // file:// / unsupported → plain nav, clean no-op
    var el = window.__awbaMorphEl;
    if (el && el.style) {
      el.style.viewTransitionName = 'circuit-term';        // the tapped node / continue-card square
      e.viewTransition.finished.then(function () { el.style.viewTransitionName = ''; });
    }
  });
  window.addEventListener('pagereveal', function (e) {
    if (!e.viewTransition) return;
    var opener = document.querySelector('.hero-ico');      // the opener's unit scene-icon square (05-VERIFICATION gap fix: '.journey' matched nothing on real pages — Phase 4 renders cfg.journey as a .kicker breadcrumb; the icon square is the true shared element)
    if (opener && opener.style) {
      opener.style.viewTransitionName = 'circuit-term';    // the SAME mark — the pair the browser tweens
      e.viewTransition.finished.then(function () { opener.style.viewTransitionName = ''; });
    }
  });
}

/* Test ergonomics only (harmless in-browser): expose AW on globalThis so a headless test can
   read `ctx.AW` directly after a separate vm run, without needing the engine+probe
   concatenation trick. In-browser, data files already reference `AW` as a free identifier
   resolving against this script's lexical scope regardless of this line. */
if (typeof globalThis !== 'undefined') globalThis.AW = AW;

/* ============================================================
   KIT  ·  Phase 3/4 placeholder — icon kit, companion art, glyphs (D-22)
   ============================================================ */

/* AW.KIT — the ONE branded icon registry (FND-04 / D-31 / D-34). The 20 canonical scene
   icons, hand-transformed from _ORGANIZED/03_Branding/icon files/ (240x300 portrait, blob
   halo + structural body + accent mark). Re-inked to the Athar one-colour model (03-08 /
   D-A5, §5.1): structural ink -> currentColor (inherits the register ground), halos/panels ->
   currentColor at authored low opacity or fill="none", and the single sparkle/star mark ->
   var(--icon-accent). No runtime recolour — this is an authored, committed pass; geometry
   (every d="...") is byte-identical to the source. KEEP viewBox="0 0 240 300" so CSS scales
   without distorting the 0.8 portrait aspect. Backtick literals, one icon per entry with a
   naming comment. This is the only icon source going forward — Gen-3's embedded 12-icon KIT
   and the per-page duplicate constants are superseded. AW.GLYPHS joins this section below. */
AW.KIT = {
  // 01-mosque
  mosque: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <rect x="44" y="230" width="152" height="12" rx="6" fill="currentColor"></rect>
        <rect x="55" y="120" width="15" height="112" rx="7" fill="currentColor"></rect>
        <rect x="170" y="120" width="15" height="112" rx="7" fill="currentColor"></rect>
        <circle cx="62.5" cy="116" r="9" fill="currentColor"></circle>
        <circle cx="177.5" cy="116" r="9" fill="currentColor"></circle>
        <circle cx="62.5" cy="100" r="3" fill="currentColor"></circle>
        <circle cx="177.5" cy="100" r="3" fill="currentColor"></circle>
        <rect x="80" y="150" width="80" height="82" rx="8" fill="currentColor"></rect>
        <path d="M84 152 C84 120 96 108 108 100 C114 96 116 90 120 84 C124 90 126 96 132 100 C144 108 156 120 156 152 Z" fill="currentColor"></path>
        <line x1="120" y1="86" x2="120" y2="74" stroke="currentColor" stroke-width="4" stroke-linecap="round"></line>
        <path d="M120 74 a5 5 0 1 1 4 2" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"></path>
        <path d="M110 232 L110 196 Q120 182 130 196 L130 232 Z" fill="none"></path>
        <path d="M90 196 L90 182 Q96 175 102 182 L102 196 Z" fill="none"></path>
        <path d="M138 196 L138 182 Q144 175 150 182 L150 196 Z" fill="none"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(42,72)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(196,152) scale(0.8)"></path>
</svg>`,
  // 02-prayer-carpet
  carpet: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <path d="M78 72 Q78 62 88 62 L152 62 Q162 62 162 72 L162 214 L78 214 Z" fill="currentColor"></path>
        <path d="M88 82 L152 82 L152 204 L88 204 Z" fill="none" stroke="currentColor" stroke-width="3"></path>
        <path d="M104 150 L104 116 Q104 100 120 100 Q136 100 136 116 L136 150 Z" fill="none"></path>
        <line x1="120" y1="112" x2="120" y2="128" stroke="currentColor" stroke-width="3" stroke-linecap="round"></line>
        <circle cx="120" cy="132" r="5" fill="currentColor"></circle>
        <path d="M108 170 l6 8 l-6 8 l-6 -8 Z" fill="currentColor"></path>
        <path d="M132 170 l6 8 l-6 8 l-6 -8 Z" fill="currentColor"></path>
        <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
          <line x1="84" y1="214" x2="84" y2="224"></line><line x1="94" y1="214" x2="94" y2="225"></line><line x1="104" y1="214" x2="104" y2="224"></line><line x1="114" y1="214" x2="114" y2="225"></line><line x1="124" y1="214" x2="124" y2="224"></line><line x1="134" y1="214" x2="134" y2="225"></line><line x1="144" y1="214" x2="144" y2="224"></line><line x1="154" y1="214" x2="154" y2="225"></line>
        </g>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(178,88) scale(0.85)"></path>
</svg>`,
  // 03-lantern
  lantern: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <circle cx="120" cy="46" r="6" fill="none" stroke="currentColor" stroke-width="3"></circle>
        <line x1="120" y1="52" x2="120" y2="66" stroke="currentColor" stroke-width="3"></line>
        <path d="M100 78 L140 78 L131 66 L109 66 Z" fill="currentColor"></path>
        <circle cx="120" cy="62" r="4" fill="currentColor"></circle>
        <path d="M98 82 L142 82 Q151 112 142 152 L133 170 L107 170 L98 152 Q89 112 98 82 Z" fill="currentColor"></path>
        <path d="M112 98 L128 98 L128 152 L112 152 Z" fill="none"></path>
        <path d="M120 116 c-5 5 -6 12 0 18 c6 -6 5 -13 0 -18 z" fill="currentColor"></path>
        <path d="M108 170 L132 170 L120 186 Z" fill="currentColor"></path>
        <circle cx="120" cy="190" r="4" fill="currentColor"></circle>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(168,110)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(74,132) scale(0.8)"></path>
</svg>`,
  // 04-lanterns
  lanterns: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <path d="M46 58 Q120 46 194 58" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path>
        <g>
          <line x1="72" y1="62" x2="72" y2="96" stroke="currentColor" stroke-width="3"></line>
          <path d="M60 100 L84 100 L79 92 L65 92 Z" fill="currentColor"></path>
          <path d="M60 102 L84 102 Q89 124 84 150 L78 162 L66 162 L60 150 Q55 124 60 102 Z" fill="currentColor"></path>
          <rect x="68" y="114" width="8" height="34" fill="none"></rect>
          <path d="M66 162 L78 162 L72 172 Z" fill="currentColor"></path>
        </g>
        <g>
          <line x1="120" y1="60" x2="120" y2="82" stroke="currentColor" stroke-width="3"></line>
          <path d="M106 86 L134 86 L128 78 L112 78 Z" fill="currentColor"></path>
          <path d="M106 88 L134 88 Q140 114 134 144 L127 158 L113 158 L106 144 Q100 114 106 88 Z" fill="currentColor"></path>
          <rect x="114" y="102" width="12" height="40" fill="none"></rect>
          <path d="M113 158 L127 158 L120 170 Z" fill="currentColor"></path>
        </g>
        <g>
          <line x1="168" y1="62" x2="168" y2="104" stroke="currentColor" stroke-width="3"></line>
          <path d="M156 108 L180 108 L175 100 L161 100 Z" fill="currentColor"></path>
          <path d="M156 110 L180 110 Q185 132 180 158 L174 170 L162 170 L156 158 Q151 132 156 110 Z" fill="currentColor"></path>
          <rect x="164" y="122" width="8" height="34" fill="none"></rect>
          <path d="M162 170 L174 170 L168 180 Z" fill="currentColor"></path>
        </g>
        <circle cx="46" cy="118" r="3" fill="currentColor"></circle>
        <circle cx="196" cy="150" r="3" fill="currentColor"></circle>
</svg>`,
  // 05-crescent-star
  crescent: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <path d="M118 78 A72 72 0 1 0 118 222 A58 58 0 1 1 118 78 Z" fill="currentColor"></path>
        <path d="M0 -18 L5.3 -5.6 L18 -5.6 L7.6 2.7 L11.1 15 L0 7.4 L-11.1 15 L-7.6 2.7 L-18 -5.6 L-5.3 -5.6 Z" fill="var(--icon-accent)" transform="translate(168,150)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(178,96)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(160,210) scale(0.8)"></path>
        <circle cx="196" cy="150" r="3" fill="currentColor"></circle>
</svg>`,
  // 06-woman-hijab
  hijab: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <rect x="62" y="250" width="116" height="10" rx="5" fill="currentColor"></rect>
        <path d="M120 52 C154 52 168 80 168 108 C168 132 158 152 152 164 L88 164 C82 152 72 132 72 108 C72 80 86 52 120 52 Z" fill="currentColor"></path>
        <ellipse cx="120" cy="96" rx="25" ry="29" fill="currentColor" opacity=".12"></ellipse>
        <path d="M92 152 L148 152 L172 250 L68 250 Z" fill="currentColor"></path>
        <path d="M104 152 L120 178 L136 152 Z" fill="currentColor" opacity="0.28"></path>
        <path d="M95 160 L80 210 Q78 218 86 218 Q92 218 92 210 L102 170 Z" fill="currentColor"></path>
        <path d="M145 160 L160 210 Q162 218 154 218 Q148 218 148 210 L138 170 Z" fill="currentColor"></path>
        <path d="M0 2 C-2 -2 -8 -2 -8 2 C-8 6 -3 8 0 11 C3 8 8 6 8 2 C8 -2 2 -2 0 2 Z" fill="var(--icon-accent)" transform="translate(120,116) scale(0.75)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(186,138) scale(0.85)"></path>
</svg>`,
  // 07-man
  man: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <rect x="62" y="250" width="116" height="10" rx="5" fill="currentColor"></rect>
        <ellipse cx="120" cy="94" rx="24" ry="27" fill="currentColor" opacity=".12"></ellipse>
        <path d="M96 88 Q120 56 144 88 Q120 80 96 88 Z" fill="currentColor"></path>
        <path d="M100 104 Q120 140 140 104 Q120 116 100 104 Z" fill="currentColor"></path>
        <path d="M94 152 L146 152 L156 250 L84 250 Z" fill="currentColor"></path>
        <line x1="120" y1="152" x2="120" y2="250" stroke="currentColor" stroke-width="2" opacity="0.5"></line>
        <path d="M96 158 L82 208 Q80 216 88 216 Q94 216 94 208 L102 168 Z" fill="currentColor"></path>
        <path d="M144 158 L158 208 Q160 216 152 216 Q146 216 146 208 L138 168 Z" fill="currentColor"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(54,84) scale(0.85)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(184,120) scale(0.8)"></path>
</svg>`,
  // 08-family
  family: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <rect x="34" y="252" width="172" height="10" rx="5" fill="currentColor"></rect>
        <ellipse cx="82" cy="150" rx="17" ry="19" fill="currentColor" opacity=".12"></ellipse>
        <path d="M65 146 Q82 126 99 146 Q82 139 65 146 Z" fill="currentColor"></path>
        <path d="M64 172 L102 172 L110 252 L56 252 Z" fill="currentColor"></path>
        <path d="M158 118 C178 118 186 136 186 156 C186 174 179 188 175 196 L141 196 C137 188 130 174 130 156 C130 136 138 118 158 118 Z" fill="currentColor"></path>
        <ellipse cx="158" cy="152" rx="15" ry="17" fill="currentColor" opacity=".12"></ellipse>
        <path d="M138 186 L178 186 L192 252 L124 252 Z" fill="currentColor"></path>
        <ellipse cx="120" cy="188" rx="13" ry="14" fill="currentColor" opacity=".12"></ellipse>
        <path d="M106 184 Q120 168 134 184 Q120 178 106 184 Z" fill="currentColor"></path>
        <path d="M104 200 L136 200 L142 252 L98 252 Z" fill="currentColor"></path>
        <path d="M0 2 C-2 -2 -8 -2 -8 2 C-8 6 -3 8 0 11 C3 8 8 6 8 2 C8 -2 2 -2 0 2 Z" fill="var(--icon-accent)" transform="translate(120,116) scale(0.8)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(196,120) scale(0.8)"></path>
</svg>`,
  // 09-prostration
  prostration: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <rect x="42" y="220" width="156" height="14" rx="7" fill="currentColor"></rect>
        <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
          <line x1="182" y1="234" x2="182" y2="244"></line><line x1="190" y1="234" x2="190" y2="244"></line><line x1="174" y1="234" x2="174" y2="244"></line>
        </g>
        <path d="M64 222 C64 180 96 166 122 174 C154 184 168 202 178 222 Z" fill="currentColor"></path>
        <circle cx="70" cy="204" r="17" fill="currentColor"></circle>
        <path d="M55 200 Q70 182 85 200 Q70 192 55 200 Z" fill="currentColor"></path>
        <path d="M76 218 L124 210" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(150,110)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(60,120) scale(0.75)"></path>
</svg>`,
  // 10-standing-prayer
  standing: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <rect x="64" y="248" width="112" height="12" rx="6" fill="currentColor"></rect>
        <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
          <line x1="70" y1="260" x2="70" y2="269"></line><line x1="80" y1="260" x2="80" y2="270"></line><line x1="160" y1="260" x2="160" y2="270"></line><line x1="170" y1="260" x2="170" y2="269"></line>
        </g>
        <ellipse cx="120" cy="88" rx="23" ry="26" fill="currentColor" opacity=".12"></ellipse>
        <path d="M97 84 Q120 56 143 84 Q120 76 97 84 Z" fill="currentColor"></path>
        <path d="M96 148 L144 148 L150 248 L90 248 Z" fill="currentColor"></path>
        <path d="M100 150 L118 194" fill="none" stroke="currentColor" stroke-width="15" stroke-linecap="round"></path>
        <path d="M140 150 L122 194" fill="none" stroke="currentColor" stroke-width="15" stroke-linecap="round"></path>
        <circle cx="120" cy="196" r="9" fill="currentColor"></circle>
        <line x1="120" y1="196" x2="120" y2="204" stroke="currentColor" stroke-width="2"></line>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(180,110) scale(0.85)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(56,116) scale(0.75)"></path>
</svg>`,
  // 11-quran-stand
  'quran-stand': `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <path d="M78 246 L150 172" fill="none" stroke="currentColor" stroke-width="13" stroke-linecap="round"></path>
        <path d="M162 246 L90 172" fill="none" stroke="currentColor" stroke-width="13" stroke-linecap="round"></path>
        <rect x="62" y="236" width="116" height="10" rx="5" fill="currentColor"></rect>
        <path d="M56 176 L120 164 L184 176 L184 188 L120 176 L56 188 Z" fill="currentColor"></path>
        <path d="M58 180 L118 170 L118 210 Q88 214 58 210 Z" fill="currentColor" opacity=".06"></path>
        <path d="M182 180 L122 170 L122 210 Q152 214 182 210 Z" fill="currentColor" opacity=".06"></path>
        <path d="M117 170 L123 170 L123 210 L117 210 Z" fill="currentColor"></path>
        <g stroke="currentColor" stroke-opacity=".4" stroke-width="2.4" stroke-linecap="round">
          <line x1="68" y1="184" x2="110" y2="178"></line><line x1="68" y1="192" x2="110" y2="186"></line><line x1="68" y1="200" x2="108" y2="195"></line>
          <line x1="130" y1="178" x2="172" y2="184"></line><line x1="130" y1="186" x2="172" y2="192"></line><line x1="132" y1="195" x2="172" y2="200"></line>
        </g>
        <path d="M120 150 a6 6 0 1 1 4.5 2.3" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(184,140) scale(0.8)"></path>
</svg>`,
  // 12-prayer-beads
  beads: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <path d="M96 82 Q60 118 74 168 Q84 200 120 206 Q156 200 166 168 Q180 118 144 82" fill="none" stroke="currentColor" stroke-opacity=".12" stroke-width="2"></path>
        <circle cx="120" cy="76" r="7" fill="none" stroke="currentColor" stroke-width="3"></circle>
        <g fill="currentColor">
          <circle cx="102" cy="88" r="7"></circle><circle cx="88" cy="104" r="7"></circle><circle cx="80" cy="124" r="7"></circle><circle cx="80" cy="146" r="7"></circle><circle cx="88" cy="166" r="7"></circle><circle cx="102" cy="182" r="7"></circle>
          <circle cx="138" cy="88" r="7"></circle><circle cx="152" cy="104" r="7"></circle><circle cx="160" cy="124" r="7"></circle><circle cx="160" cy="146" r="7"></circle><circle cx="152" cy="166" r="7"></circle><circle cx="138" cy="182" r="7"></circle>
        </g>
        <circle cx="120" cy="192" r="9" fill="currentColor"></circle>
        <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
          <line x1="120" y1="200" x2="112" y2="224"></line><line x1="120" y1="201" x2="120" y2="226"></line><line x1="120" y1="200" x2="128" y2="224"></line>
        </g>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(184,120) scale(0.8)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(52,120) scale(0.75)"></path>
</svg>`,
  // 13-kaaba
  kaaba: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <ellipse cx="122" cy="220" rx="82" ry="15" fill="none"></ellipse>
        <path d="M86 118 L154 118 L154 214 L86 214 Z" fill="currentColor"></path>
        <path d="M86 118 L108 100 L176 100 L154 118 Z" fill="currentColor" opacity=".85"></path>
        <path d="M154 118 L176 100 L176 196 L154 214 Z" fill="currentColor" opacity=".62"></path>
        <rect x="86" y="150" width="68" height="13" fill="currentColor"></rect>
        <path d="M154 150 L176 137 L176 150 L154 163 Z" fill="currentColor" opacity=".45"></path>
        <rect x="112" y="168" width="18" height="46" fill="none"></rect>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(64,92)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(190,78) scale(0.85)"></path>
</svg>`,
  // 14-hands-dua
  dua: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <path d="M98 198 L88 248" fill="none" stroke="currentColor" stroke-width="20" stroke-linecap="round"></path>
        <path d="M142 198 L152 248" fill="none" stroke="currentColor" stroke-width="20" stroke-linecap="round"></path>
        <path d="M78 168 Q120 146 162 168 Q152 202 120 202 Q88 202 78 168 Z" fill="currentColor"></path>
        <line x1="120" y1="150" x2="120" y2="200" stroke="currentColor" stroke-width="2"></line>
        <circle cx="80" cy="164" r="7" fill="currentColor"></circle>
        <circle cx="160" cy="164" r="7" fill="currentColor"></circle>
        <g stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5">
          <line x1="98" y1="156" x2="100" y2="176"></line><line x1="110" y1="152" x2="111" y2="174"></line><line x1="130" y1="152" x2="129" y2="174"></line><line x1="142" y1="156" x2="140" y2="176"></line>
        </g>
        <path d="M0 2 C-2 -2 -8 -2 -8 2 C-8 6 -3 8 0 11 C3 8 8 6 8 2 C8 -2 2 -2 0 2 Z" fill="var(--icon-accent)" transform="translate(120,104) scale(1.05)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(88,118)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(156,116) scale(0.85)"></path>
</svg>`,
  // 15-iftar-dates
  dates: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <path d="M158 70 A34 34 0 1 0 158 138 A27 27 0 1 1 158 70 Z" fill="currentColor"></path>
        <ellipse cx="98" cy="168" rx="12" ry="7.5" fill="currentColor" transform="rotate(-16 98 168)"></ellipse>
        <ellipse cx="120" cy="164" rx="12" ry="7.5" fill="currentColor"></ellipse>
        <ellipse cx="142" cy="168" rx="12" ry="7.5" fill="currentColor" transform="rotate(16 142 168)"></ellipse>
        <ellipse cx="109" cy="158" rx="11" ry="7" fill="currentColor" opacity=".45"></ellipse>
        <ellipse cx="131" cy="158" rx="11" ry="7" fill="currentColor" opacity=".45"></ellipse>
        <path d="M74 172 Q120 216 166 172 Z" fill="currentColor"></path>
        <ellipse cx="120" cy="172" rx="46" ry="9" fill="currentColor" opacity=".85"></ellipse>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(66,96) scale(0.85)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(196,150) scale(0.8)"></path>
</svg>`,
  // 16-qibla-compass
  compass: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <circle cx="120" cy="150" r="68" fill="currentColor"></circle>
        <circle cx="120" cy="150" r="53" fill="none"></circle>
        <g fill="currentColor">
          <circle cx="120" cy="108" r="3.5"></circle><circle cx="162" cy="150" r="3.5"></circle><circle cx="120" cy="192" r="3.5"></circle><circle cx="78" cy="150" r="3.5"></circle>
        </g>
        <path d="M120 110 L133 150 L120 150 Z" fill="currentColor"></path>
        <path d="M120 190 L107 150 L120 150 Z" fill="currentColor" opacity=".85"></path>
        <path d="M120 110 L107 150 L120 150 Z" fill="currentColor"></path>
        <path d="M120 190 L133 150 L120 150 Z" fill="currentColor" opacity=".62"></path>
        <circle cx="120" cy="150" r="6" fill="none"></circle>
        <path d="M120 96 a5 5 0 1 1 4 2" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(194,146) scale(0.8)"></path>
</svg>`,
  // 17-water-ewer
  ewer: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <rect x="96" y="230" width="48" height="10" rx="5" fill="currentColor"></rect>
        <path d="M104 218 L136 218 L142 230 L98 230 Z" fill="currentColor"></path>
        <path d="M96 152 Q96 220 120 220 Q144 220 144 152 Q144 128 120 128 Q96 128 96 152 Z" fill="currentColor"></path>
        <rect x="111" y="102" width="18" height="30" fill="currentColor"></rect>
        <path d="M107 104 Q120 88 133 104 Z" fill="currentColor"></path>
        <circle cx="120" cy="84" r="4" fill="currentColor"></circle>
        <path d="M144 156 Q178 150 174 118 Q172 106 162 110" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round"></path>
        <path d="M96 148 Q68 152 72 186 Q74 204 96 200" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round"></path>
        <path d="M120 168 Q114 176 120 184 Q126 176 120 168 Z" fill="none"></path>
        <path d="M166 122 c-4 4 -5 9 0 13 c5 -4 4 -9 0 -13 z" fill="currentColor"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(56,116) scale(0.8)"></path>
</svg>`,
  // 18-ramadan-night
  night: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <path d="M74 62 A30 30 0 1 0 74 122 A24 24 0 1 1 74 62 Z" fill="currentColor"></path>
        <line x1="168" y1="66" x2="168" y2="92" stroke="currentColor" stroke-width="3"></line>
        <path d="M158 96 L178 96 L174 88 L162 88 Z" fill="currentColor"></path>
        <path d="M158 98 L178 98 Q182 120 178 142 L172 152 L164 152 L158 142 Q154 120 158 98 Z" fill="currentColor"></path>
        <rect x="164" y="110" width="8" height="30" fill="none"></rect>
        <path d="M162 152 L174 152 L168 162 Z" fill="currentColor"></path>
        <path d="M40 226 L40 208 Q40 194 54 194 Q68 194 68 208 L68 226 Z" fill="currentColor"></path>
        <path d="M84 226 L84 196 Q84 176 104 176 Q124 176 124 196 L124 226 Z" fill="currentColor"></path>
        <path d="M140 226 L140 204 Q140 188 156 188 Q172 188 172 204 L172 226 Z" fill="currentColor"></path>
        <rect x="34" y="224" width="146" height="8" rx="4" fill="currentColor"></rect>
        <line x1="104" y1="176" x2="104" y2="166" stroke="currentColor" stroke-width="3" stroke-linecap="round"></line>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(120,74)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(196,120) scale(0.8)"></path>
        <circle cx="110" cy="110" r="3" fill="currentColor"></circle><circle cx="150" cy="70" r="3" fill="currentColor"></circle>
</svg>`,
  // 19-star-pattern
  pattern: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <path d="M120 80 L132.3 120.4 L169.5 100.5 L149.6 137.8 L190 150 L149.6 162.3 L169.5 199.5 L132.3 179.6 L120 220 L107.8 179.6 L70.5 199.5 L90.4 162.3 L50 150 L90.4 137.8 L70.5 100.5 L107.8 120.4 Z" fill="currentColor"></path>
        <path d="M132.3 120.4 L169.5 100.5 L149.6 137.8 L190 150 L149.6 162.3 L169.5 199.5 L132.3 179.6 L120 220 L107.8 179.6 L70.5 199.5 L90.4 162.3 L50 150 L90.4 137.8 L70.5 100.5 L107.8 120.4 L120 80 Z" fill="none"></path>
        <path d="M132.3 120.4 L149.6 137.8 L149.6 162.3 L132.3 179.6 L107.8 179.6 L90.4 162.3 L90.4 137.8 L107.8 120.4 Z" fill="currentColor" opacity=".12"></path>
        <path d="M132.3 120.4 L149.6 137.8 L149.6 162.3 L132.3 179.6 L107.8 179.6 L90.4 162.3 L90.4 137.8 L107.8 120.4 Z" fill="none" stroke="currentColor" stroke-width="2.5"></path>
        <circle cx="120" cy="150" r="11" fill="currentColor"></circle>
        <circle cx="120" cy="150" r="4.5" fill="currentColor" opacity=".12"></circle>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(120,86) scale(0.7)"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(184,150) scale(0.7)"></path>
</svg>`,
  // 20-ramadan-calendar
  calendar: `<svg viewBox="0 0 240 300" fill="none">
<path d="M119 20 C174 12 212 58 205 120 C200 163 222 210 178 252 C142 286 80 290 52 250 C28 216 36 166 42 118 C48 72 66 28 119 20 Z" fill="currentColor" opacity=".12"></path>
        <rect x="86" y="78" width="6" height="18" rx="3" fill="currentColor"></rect>
        <rect x="148" y="78" width="6" height="18" rx="3" fill="currentColor"></rect>
        <rect x="60" y="86" width="120" height="148" rx="14" fill="currentColor" fill-opacity=".06" stroke="currentColor" stroke-opacity=".12" stroke-width="3"></rect>
        <path d="M60 100 Q60 86 74 86 L166 86 Q180 86 180 100 L180 122 L60 122 Z" fill="currentColor"></path>
        <path d="M126 96 A14 14 0 1 0 126 124 A11 11 0 1 1 126 96 Z" fill="none"></path>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="none" transform="translate(146,110) scale(0.7)"></path>
        <g fill="currentColor" opacity=".12">
          <circle cx="80" cy="146" r="5"></circle><circle cx="104" cy="146" r="5"></circle><circle cx="128" cy="146" r="5"></circle><circle cx="152" cy="146" r="5"></circle>
          <circle cx="80" cy="170" r="5"></circle><circle cx="104" cy="170" r="5"></circle><circle cx="152" cy="170" r="5"></circle>
          <circle cx="80" cy="194" r="5"></circle><circle cx="104" cy="194" r="5"></circle><circle cx="128" cy="194" r="5"></circle><circle cx="152" cy="194" r="5"></circle>
          <circle cx="80" cy="218" r="5"></circle><circle cx="128" cy="218" r="5"></circle><circle cx="152" cy="218" r="5"></circle>
        </g>
        <circle cx="128" cy="170" r="9" fill="currentColor"></circle>
        <circle cx="104" cy="218" r="9" fill="none" stroke="currentColor" stroke-width="3"></circle>
        <path d="M0 -6 C1 -2 2 -1 6 0 C2 1 1 2 0 6 C-1 2 -2 1 -6 0 C-2 -1 -1 -2 0 -6 Z" fill="var(--icon-accent)" transform="translate(196,120) scale(0.8)"></path>
</svg>`,
};

/* AW.UNIT_ICON — u1..u4 scene mapping (Gen-3 semantics preserved so runner defaults resolve). */
AW.UNIT_ICON = { u1: 'compass', u2: 'lanterns', u3: 'kaaba', u4: 'mosque' };

/* AW.GLYPHS — the 13 small UI glyphs Gen-3 scattered as standalone + per-page constants,
   re-homed into ONE ~24x24 square sub-map (D-33). Single source, no per-page constants: these
   replace every duplicate per-page icon constant. Path data ported from Gen-3's standalone
   glyph + marker constants; each value is a self-contained <svg …>. */
AW.GLYPHS = {
  // flame — streak flame
  flame: '<svg viewBox="0 0 24 24"><path d="M12 2 C13 6 17 7 16.5 12 C16 16 13 16 13 13 C12 15 10 15.5 10.5 18 C8 16.5 7 14 8 11 C9 13 10.5 12 10 9 C11 8 12 6 12 2Z" fill="var(--ember)"/></svg>',
  // spark — combo/noor spark (gold)
  spark: '<svg viewBox="0 0 24 24"><path d="M12 3 C13 8 16 11 21 12 C16 13 13 16 12 21 C11 16 8 13 3 12 C8 11 11 8 12 3Z" fill="var(--gold)"/></svg>',
  // check — verdict tick
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  // star — earned star (gold)
  star: '<svg viewBox="0 0 24 24"><path d="M12 2.5 L14.9 9 L22 9.7 L16.7 14.4 L18.3 21.4 L12 17.6 L5.7 21.4 L7.3 14.4 L2 9.7 L9.1 9 Z" fill="var(--gold)" stroke="var(--icon-accent)" stroke-width="1"/></svg>',
  // cite — citation bookmark
  cite: '<svg viewBox="0 0 24 24"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-3.2L5 21V4a1 1 0 0 1 1-1Z" fill="currentColor"/></svg>',
  // lamp — small lantern glyph
  lamp: '<svg viewBox="0 0 20 24"><path d="M10 2 L13 5 L13 8 Q16 12 13 17 L13 20 L7 20 L7 17 Q4 12 7 8 L7 5 Z" fill="var(--gold)"/><path d="M8.5 9 h3 v7 h-3 z" fill="currentColor" opacity=".08"/></svg>',
  // lock — locked node
  lock: '<svg viewBox="0 0 24 24"><path d="M7 10 V8 a5 5 0 0 1 10 0 v2" fill="none" stroke="currentColor" stroke-opacity=".45" stroke-width="2.2"/><rect x="5.5" y="10" width="13" height="9.5" rx="2.5" fill="currentColor" fill-opacity=".45"/></svg>',
  // chest — reward chest
  chest: '<svg viewBox="0 0 24 24"><path d="M4 8 a4 4 0 0 1 4-4 h8 a4 4 0 0 1 4 4 v2 H4 Z" fill="currentColor"/><path d="M4 11 h16 v7 a2 2 0 0 1 -2 2 H6 a2 2 0 0 1 -2-2 Z" fill="currentColor" opacity=".75"/><rect x="10.6" y="9" width="2.8" height="5" rx="1.2" fill="var(--gold)"/></svg>',
  // trophy — legendary review
  trophy: '<svg viewBox="0 0 24 24"><path d="M7 3 h10 v3 a5 5 0 0 1 -3.2 4.66 L13 13 h2 l1 4 H8 l1-4 h2 l-.8-2.34 A5 5 0 0 1 7 6 Z" fill="var(--gold)"/><path d="M7 4 H4 v2 a3 3 0 0 0 3 3 M17 4 h3 v2 a3 3 0 0 1 -3 3" fill="none" stroke="var(--gold)" stroke-width="1.6"/><rect x="7" y="18.5" width="10" height="2.6" rx="1.3" fill="var(--gold)"/></svg>',
  // fact — "worth knowing" marker
  fact: '<svg viewBox="0 0 24 24"><path d="M12 3 C13 8 16 11 21 12 C16 13 13 16 12 21 C11 16 8 13 3 12 C8 11 11 8 12 3Z" fill="var(--icon-accent)"/></svg>',
  // remember — "worth remembering" marker
  remember: '<svg viewBox="0 0 24 24"><path d="M7 3h10a1 1 0 0 1 1 1v17l-6-4-6 4V4a1 1 0 0 1 1-1Z" fill="var(--icon-accent)"/></svg>',
  // fard — "the first duty" marker
  fard: '<svg viewBox="0 0 24 24"><path d="M17 4 A9 9 0 1 0 17 20 A7 7 0 1 1 17 4Z" fill="var(--icon-accent)"/></svg>',
  // angle — "another angle" marker
  angle: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="var(--icon-accent)" stroke-width="2"/><path d="M12 7 L14.5 12 L12 17 L9.5 12Z" fill="var(--icon-accent)"/></svg>',
};

/* ============================================================
   COMPONENTS  ·  Phase 3 — shared UI builders (D-22)
   ============================================================ */

/* ---------- escapeHtml / escapeAttr — output-encoding for the dynamic string params this phase
   controls (AW.icon `label` → aria-label, AW.cite `label`). Closes the ENGINE-CONTRACT §6
   no-escaping gap for exactly these params (T-03-04 mitigate); author-content scripture injected
   verbatim by sheetRef/sheetTerm stays as-is per the accept disposition (T-03-03). `&` is escaped
   FIRST so the entities the later passes introduce are never double-escaped. */
function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function escapeAttr(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ---------- AW.icon(name, {size?, label?}) — the ONE a11y icon accessor (FND-04 / D-32).
   Resolves the raw SVG from AW.KIT first, AW.GLYPHS second; a missing/malformed name returns ''
   (never a broken image or tofu, never throws). Injects attributes immediately after the first
   `<svg` — String.prototype.replace with a STRING first-arg replaces only the first match, so a
   nested `<svg>` can never be hit. Decorative by default (`aria-hidden="true" focusable="false"`),
   or an accessible image (`role="img" aria-label="…"`, label escaped) when `label` is passed.
   `size` sets width + height:auto so the viewBox preserves each icon's aspect (portrait scenes
   stay 0.8, square glyphs accept a square size). Raw AW.KIT[name] access stays available for
   legacy runner code. */
AW.icon = function (name, opts) {
  opts = opts || {};
  var raw = (AW.KIT && AW.KIT[name]) || (AW.GLYPHS && AW.GLYPHS[name]) || '';
  if (raw.indexOf('<svg') !== 0) return ''; // missing/malformed → empty, never throw
  var attrs = opts.label
    ? 'role="img" aria-label="' + escapeAttr(opts.label) + '"' // ACC-02 forward-compat
    : 'aria-hidden="true" focusable="false"'; // default: decorative
  if (opts.size) attrs += ' style="width:' + escapeAttr(opts.size) + ';height:auto"';
  return raw.replace('<svg', '<svg ' + attrs); // string first-arg = first match only
};

/* ---------- AW.cite(id, label) — synchronous, DOM-free, parse-time (Josh's data files call it
   inside cfg string concatenation, so it must resolve at author time with no DOM). The outer
   `<span class="cite" data-ref="ID">…</span>` shape is BYTE-preserved so the Phase-2 validator
   stub and its /data-ref=["']([^"']+)["']/g extractor keep matching — breaking it breaks the
   Phase-4 port gate. The leading cite glyph precedes the escaped label (id is an author slug key,
   left verbatim to stay byte-identical to the validator stub). */
AW.cite = function (id, label) {
  return (
    '<span class="cite" data-ref="' +
    id +
    '">' +
    AW.icon('cite') +
    escapeHtml(label == null ? '' : label) +
    '</span>'
  );
};

/* ---------- AW.wire(root, cfg) — binds citation + term chips on a rendered DOM root to their
   sheets: `.cite[data-ref]` → AW.sheetRef(cfg.refs, id); `.term[data-term]` → AW.sheetTerm(
   cfg.terms, id). sheetRef/sheetTerm are defined below and resolved at click time, so forward
   reference is safe. Runs entirely at call time (no parse-time DOM access). */
AW.wire = function (root, cfg) {
  cfg = cfg || {};
  root.querySelectorAll('.cite[data-ref]').forEach(function (el) {
    el.addEventListener('click', function () {
      AW.sheetRef(cfg.refs || {}, el.dataset.ref);
    });
  });
  root.querySelectorAll('.term[data-term]').forEach(function (el) {
    el.addEventListener('click', function () {
      AW.sheetTerm(cfg.terms || {}, el.dataset.term);
    });
  });
};

/* ---------- AW.reducedMotion() — the ONE self-guard every JS-driven motion primitive calls
   (D-42). True when the OS asks for reduced motion (matchMedia) OR the in-app awba_prefs override
   stamped `data-motion="reduce"` onto <html> (the boot-stamp above writes only the override, never
   the OS setting — so BOTH triggers are checked here). Guarded so bare window/document access can
   never throw headless (the engine loads in node:vm with neither global). matchMedia is read off
   the window object (not a bare global) so a stubbed `window` in tests resolves it. */
AW.reducedMotion = function () {
  return (
    (typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
    (typeof document !== 'undefined' &&
      document.documentElement.getAttribute('data-motion') === 'reduce')
  );
};

/* ---------- AW._trapFocus(overlayEl) — the ONE shared Tab-cycle containment helper (D-63),
   applied to all three overlay families (AW.sheet below; the .npop popup + .ofest Festival land
   in 06-06). Returns an untrap() disposer. A keydown listener ON THE OVERLAY (never document —
   06-RESEARCH §Focus Containment) that, on Tab, recomputes the visible focusable list LIVE
   (popup content is static but sheet content varies) and wraps first<->last (shift+Tab reverses).
   The focusable selector is verbatim from 06-RESEARCH, filtered by getClientRects().length > 0
   rather than offsetParent — robust for the fixed-position sheet, whose offsetParent is null.
   Never reaches outside the overlay or mutates content (T-06-04b); aria-modal already instructs
   SRs to ignore the background (Pitfall 8 — no `inert`). */
AW._trapFocus = function (overlayEl) {
  function focusables() {
    var list = overlayEl.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    var out = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].getClientRects().length > 0) out.push(list[i]);
    }
    return out;
  }
  function onKeydown(e) {
    if (e.key !== 'Tab') return;
    var f = focusables();
    if (!f.length) return;
    var first = f[0];
    var last = f[f.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first || f.indexOf(document.activeElement) === -1) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  overlayEl.addEventListener('keydown', onKeydown);
  return function untrap() {
    overlayEl.removeEventListener('keydown', onKeydown);
  };
};

/* ---------- AW.sheet(html, label) — ONE lazily-created singleton bottom-sheet (D-35, D-63/R-10).
   Mirrors the AW.prefs/AW.S closure idiom: private scrim/sheet/invoker/trap, an ensure() that
   builds the scrim + role="dialog"/aria-modal sheet on <body> once and wires outside-tap +
   Escape close, and an `api` with open(html, label)/close(). Opening REPLACES content (singleton
   — one element), captures the invoker for focus-restore (shipped, PRESERVED unchanged), sets a
   backwards-compatible accessible name (`label` arg, default "Details" — `AW.sheet(html)` still
   works), adds the in-sheet close button (D-35) and the <html> .sheet-lock scroll-lock, moves
   focus into `.sheet-x`, and attaches the shared `AW._trapFocus` containment. close() disposes
   the trap then restores focus to the invoker (idempotent — safe before any open). All DOM access
   is inside functions, so the IIFE is parse-time-safe (no DOM touched at definition). */
AW.sheet = (function () {
  var scrim, sheet, invoker, trap;
  function ensure() {
    if (scrim) return;
    scrim = document.createElement('div');
    scrim.className = 'scrim';
    sheet = document.createElement('div');
    sheet.className = 'sheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    scrim.appendChild(sheet);
    document.body.appendChild(scrim);
    scrim.addEventListener('click', function (e) {
      if (e.target === scrim) api.close(); // outside-tap closes
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') api.close();
    });
  }
  var api = {
    open: function (html, label) {
      ensure();
      if (trap) { trap(); trap = null; } // dispose a prior trap before replacing content (re-entrant singleton safety — mirrors openPopFor's closePop-first; W1 06-REVIEW)
      if (!scrim.classList.contains('open')) invoker = document.activeElement; // Phase-6 hook: capture invoker ONLY when opening from closed — a content-replace keeps the original restore target (shipped restore PRESERVED)
      sheet.setAttribute('aria-label', label || 'Details'); // D-63/R-10 — backwards-compatible name
      sheet.innerHTML = '<button class="sheet-x" aria-label="Close">×</button>' + html;
      sheet.querySelector('.sheet-x').addEventListener('click', api.close);
      scrim.classList.add('open'); // singleton: one element ⇒ opening replaces any open content
      document.documentElement.classList.add('sheet-lock'); // scroll-lock while open
      sheet.querySelector('.sheet-x').focus(); // D-63 — focus-into the sheet on open
      trap = AW._trapFocus(sheet); // D-63 — Tab containment, disposed on close
    },
    close: function () {
      if (!scrim) return; // idempotent — safe before any open
      if (trap) { trap(); trap = null; } // dispose the containment trap first
      scrim.classList.remove('open');
      document.documentElement.classList.remove('sheet-lock');
      if (invoker && invoker.focus) invoker.focus(); // Phase-6-ready focus restore (shipped, unchanged)
    },
  };
  var open = function (html, label) {
    api.open(html, label);
    return api;
  };
  open.close = api.close; // AW.sheet.close()
  return open;
})();
AW.sheetClose = function () {
  AW.sheet.close();
};

/* ---------- AW.sheetRef(refs, id) — the citation sheet (ENG-06 / D-36). Unknown id → no-op (never
   an error). The load-bearing elevation over Gen-3 is the FACE-SPLIT: a Qur'an ref (no `grade`)
   tags its Arabic block `.ayah` so it renders in Amiri Quran; a hadith ref (grade present) renders
   in general Amiri and surfaces its grade. The `unverified · pending review` pill is appended on
   EVERY citation (global pending state); the green grade pill joins the pill row only when the ref
   carries a grade. Scripture/translation/provenance fields inject verbatim (T-03-03 accept —
   author-controlled data, never user input). Nothing celebratory ever renders in this sheet. */
AW.sheetRef = function (refs, id) {
  var r = refs && refs[id];
  if (!r) return; // unknown id → no-op
  var isQuran = !r.grade; // Qur'an ref carries no grade → Amiri Quran (.ayah); hadith → general Amiri
  var arClass = isQuran ? 'r-ar ayah' : 'r-ar';
  var gradePill = r.grade ? '<span class="r-pill grade">' + r.grade + '</span>' : '';
  var html =
    '<div class="grip"></div>' +
    '<div class="r-src">' + (r.kind || 'The verse') + ' · ' + r.ref + '</div>' +
    '<div class="' + arClass + '" lang="ar" dir="rtl">' + r.ar + '</div>' +
    '<div class="r-mean">' + r.mean + '</div>' +
    '<div class="r-ref">' + r.src + '</div>' +
    '<div class="r-pills">' +
    '<span class="r-pill">unverified · pending review</span>' +
    gradePill +
    '</div>';
  return AW.sheet(html, r.ref); // D-63/R-10 — the citation's own reference is the sheet's accessible name
};

/* ---------- AW.sheetTerm(terms, id) — the term gloss sheet (ENG-06 / D-36). Unknown id → no-op.
   Field-for-field per ENGINE-CONTRACT §1: Arabic (Amiri, large, RTL) · transliteration · gloss
   word · definition · context. */
AW.sheetTerm = function (terms, id) {
  var t = terms && terms[id];
  if (!t) return; // unknown id → no-op
  var html =
    '<div class="grip"></div>' +
    '<div class="g-ar" lang="ar" dir="rtl">' + t.ar + '</div>' +
    '<div class="g-tl">' + t.tl + '</div>' +
    '<div class="g-wd">' + t.word + '</div>' +
    '<div class="g-df">' + t.def + '</div>' +
    '<div class="g-cx">' + t.ctx + '</div>';
  return AW.sheet(html, t.word); // D-63/R-10 — the gloss word is the sheet's accessible name
};

/* ---------- AW.streakSheet() / AW.noorSheet() — the returns/noor stat sheets (Wave-A seam S3, D-60).
   HOISTED VERBATIM from learn.html's page-private openStreakSheet/openNoorSheet: identical .osh-*
   markup, identical copy, reading ONLY AW.state()/AW.weekCal() and rendering via AW.sheet — so the
   Returns tab + Profile stat tiles open the exact shipped cream sheets, zero drift (D-60 requires ONE
   implementation). learn.html adopts these in Wave C; the temporary duplication there is expected.
   No new storage literal, no new glyph. ------------------------------------------------------------ */
AW.streakSheet = function () {
  var st = AW.state(), n = st.returns;
  var wk = AW.weekCal(), dots = '';
  wk.forEach(function (d) { dots += '<span class="day' + (d.on ? ' here' : '') + '"></span>'; });
  AW.sheet(
    '<div class="grip"></div>' +
    '<div class="osh-hero">' +
      '<div class="osh-big">' + n + '</div>' +
      '<div class="osh-sub">' + (n === 1 ? 'day you came back' : 'days you came back') + '</div>' +
    '</div>' +
    '<div class="weekcal osh-week">' + dots + '</div>' +
    '<div class="osh-note">This number can never break and never reset. Every return adds to it, however long the gap. That is the point of this place.</div>',
    'Your streak');                    /* D-63/R-10 — a natural accessible name for the sheet */
};

AW.noorSheet = function () {
  var st = AW.state();
  AW.sheet(
    '<div class="grip"></div>' +
    '<div class="osh-hero">' +
      '<div class="osh-big osh-gold">' + st.noor + '</div>' +
      '<div class="osh-sub">noor gathered</div>' +
    '</div>' +
    '<div class="osh-note">Light you collect as you learn. It is never spent against you, never dangled, and it never runs out.</div>',
    'Noor gathered');                  /* D-63/R-10 — a natural accessible name for the sheet */
};

/* ---------- AW.animate(el, keyframes, durToken, easeToken) — the WAAPI orchestration exemplar
   Phase 4 COPIES rather than invents (D-41). Reads the ms duration + the linear()/cubic-bezier
   easing straight off :root via getComputedStyle (`"600ms"` → 600; the linear(…) string is a
   valid WAAPI easing verbatim), self-guards `dur = 1` under reduced motion (JS snapshots at call
   time and never sees the CSS token-collapse), and returns the Animation so `.finished` is
   awaitable for sequencing. */
AW.animate = function (el, keyframes, durToken, easeToken) {
  var cs = getComputedStyle(document.documentElement);
  var dur = parseFloat(cs.getPropertyValue(durToken)) || 300; // "600ms" → 600 (ms)
  var ease = cs.getPropertyValue(easeToken).trim() || 'ease'; // linear(…) passes straight through
  if (AW.reducedMotion()) dur = 1; // self-guard — WAAPI won't see the CSS collapse
  return el.animate(keyframes, { duration: dur, easing: ease, fill: 'both' }); // .finished awaitable
};

/* ============================================================
   RING  ·  MOT-01 — the tawaf fingerprint (macro progress; the maker's mark, law 10)
   --------------------------------------------------------------------------------------------
   The Orbit `draw` verb realised as progressive inking. A seeded, DETERMINISTIC SVG generator:
   the same `seed` + same `atomsDone`/`circuitsDone` yield BYTE-IDENTICAL markup across reloads
   and machines. The seed is the only entropy — minted once (below) and stored; the generator
   path never touches `Date` or `Math.random`. Ink-bleed is stroke/opacity variance + round
   caps, never a blur filter (perf + no runtime turbulence). See spec §6.
   ============================================================ */

/* AW.ringSeed() — the learner's stable maker's mark. Read once from awba_state.ringSeed; if
   absent, mint a 32-bit unsigned int and persist it ONCE through the AW.S seam (D-24 — never
   localStorage directly). A lazy accessor BY DESIGN, not a schemaVersion bump: adding a random
   field to defaultState() would rewrite legacy blobs on load and break the blob-survives-
   untouched state tests. Math.random here mints the seed only (call-time, once); the generator
   below is seeded from it and never calls Math.random itself. Parse-time-safe (no DOM). */
AW.ringSeed = function () {
  var s = AW.S.get('ringSeed', null);
  if (s === null || typeof s !== 'number') {
    s = (Math.random() * 0x100000000) >>> 0;
    AW.S.set('ringSeed', s);
  }
  return s;
};

/* mulberry32 — a tiny, fast, seedable PRNG (~6 lines, inline). Returns a closure producing
   floats in [0,1). This is the ONLY entropy in the generator: every jitter is pulled from it in
   a FIXED order, so a given seed reproduces the exact same geometry byte-for-byte. */
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* AW.ringSVG(cfg) — the deterministic tawaf-fingerprint generator (spec §6.2–§6.5).
   GEOMETRY is a pure function of `seed`, drawn from mulberry32 in a fixed order and INDEPENDENT
   of progress. PROGRESS (`atomsDone`/`circuitsDone`) only decides each dab's colour-by-state and
   which frontier dabs carry the `draw` (ink-draw) animation. Concentric jittered pilgrim-rows
   (15 lessons banded into 4 circuits) of short round-capped dab-strokes with per-dab stroke-width
   in [1.8,4.1] and opacity in [0.45,0.95]; ink-bleed is that variance + round caps, NEVER a blur.
   One outer gold thread (up to 4 arcs, one per completed circuit) and a single static gold
   head-dot at the frontier (the centre never animates, law 9). Reduced motion → the final state,
   static. Returns an inline <svg> string. No Date, no Math.random in this path. */
AW.ringSVG = function (cfg) {
  cfg = cfg || {};
  /* WR-03: merge cfg.structure field-by-field against the canonical 4/15/61 shape (D-57/R-1 — the
     taught-atom total) and coerce each field to a positive finite integer. A partial or malformed
     structure object (e.g. { circuits: 4 } with lessons/atoms absent, or a non-numeric field) must
     never yield a NaN aria-label / data-atoms nor a silently empty ring — each missing/invalid
     field independently falls back to its default. */
  var DEF_STRUCT = { circuits: 4, lessons: 15, atoms: 61 };
  var cfgStruct = cfg.structure || {};
  var posInt = function (v, dflt) {
    return (typeof v === 'number' && isFinite(v) && v > 0) ? (v | 0) : dflt;
  };
  var CIRCUITS = posInt(cfgStruct.circuits, DEF_STRUCT.circuits);
  var LESSONS = posInt(cfgStruct.lessons, DEF_STRUCT.lessons);
  var ATOMS = posInt(cfgStruct.atoms, DEF_STRUCT.atoms);
  var seed = (typeof cfg.seed === 'number') ? (cfg.seed >>> 0) : AW.ringSeed();
  var atomsDone = Math.max(0, Math.min(ATOMS, cfg.atomsDone | 0));
  /* WR-01: animateFrom = the caller's PREVIOUS atom count. The ink-draw animation attaches ONLY to
     dabs whose atom index is in [animateFrom, atomsDone) — the span newly inked since the last render
     — so the established Ring never re-draws (§6.4, law 9). DEFAULT animateFrom = atomsDone ⇒ an empty
     span ⇒ a fully static render: a plain reload/regeneration at unchanged progress replays nothing.
     A caller returning from a completed lesson passes its pre-completion atom count to draw only the
     new dabs. Reduced motion still overrides to fully static regardless of animateFrom (§6.5). */
  var animateFrom = (typeof cfg.animateFrom === 'number' && isFinite(cfg.animateFrom))
    ? Math.max(0, Math.min(ATOMS, cfg.animateFrom | 0))
    : atomsDone;
  var size = cfg.size || 300;
  var reduce = AW.reducedMotion();
  var rnd = mulberry32(seed);

  // Colour-by-state tokens (§6.3): faint navy → warm ember → bright cream → sealed gold.
  var C_UNINK = '#4A5C82', C_EMBER = '#E8502A', C_CREAM = '#F3EDE2', C_GOLD = '#D9A441';
  var TAU = Math.PI * 2, cx = size / 2, cy = size / 2, i;
  var f = function (x) { return (Math.round(x * 100) / 100).toString(); };

  // Course shape: distribute atoms across lessons, band lessons into circuits.
  var b = Math.floor(ATOMS / LESSONS), extra = ATOMS - b * LESSONS;
  var lessonAtoms = [], lessonStart = [], acc = 0;
  for (i = 0; i < LESSONS; i++) {
    var na = b + (i < extra ? 1 : 0);
    lessonAtoms.push(na); lessonStart.push(acc); acc += na;
  }
  var perC = Math.floor(LESSONS / CIRCUITS), cExtra = LESSONS - perC * CIRCUITS;
  var lessonCircuit = [], cc = 0, rem = perC + (0 < cExtra ? 1 : 0);
  for (i = 0; i < LESSONS; i++) {
    while (rem === 0 && cc < CIRCUITS - 1) { cc++; rem = perC + (cc < cExtra ? 1 : 0); }
    lessonCircuit.push(cc); rem--;
  }
  var circuitEnd = new Array(CIRCUITS).fill(0);
  for (i = 0; i < LESSONS; i++) circuitEnd[lessonCircuit[i]] = lessonStart[i] + lessonAtoms[i];
  var circuitsDone;
  if (typeof cfg.circuitsDone === 'number') {
    circuitsDone = Math.max(0, Math.min(CIRCUITS, cfg.circuitsDone | 0));
  } else { // derive from atomsDone when the caller supplies only progress count
    circuitsDone = 0;
    for (i = 0; i < CIRCUITS; i++) if (atomsDone >= circuitEnd[i]) circuitsDone = i + 1;
  }

  // Radii: pilgrim-rows march inward; the gold thread rides just outside them.
  var rOuter = size * 0.42, rInner = size * 0.155, span = rOuter - rInner;

  // Build every dab's geometry (seed-driven, progress-INDEPENDENT) in a fixed rnd() order.
  var dabs = [], frontier = null;
  for (i = 0; i < LESSONS; i++) {
    var rowT = LESSONS > 1 ? i / (LESSONS - 1) : 0;
    var rowR = (rOuter - span * rowT) + (rnd() - 0.5) * (span / LESSONS) * 0.7;
    var start = rnd() * TAU;                     // where this row's broken arc opens
    var sweep = (0.60 + rnd() * 0.30) * TAU;      // < full circle → a gap remains
    var dabCount = 14 + Math.floor(rnd() * 9);    // 14..22
    var atomN = lessonAtoms[i], atom0 = lessonStart[i];
    for (var j = 0; j < dabCount; j++) {
      var t = dabCount > 1 ? j / (dabCount - 1) : 0;
      var ang = start + sweep * t + (rnd() - 0.5) * (sweep / dabCount) * 0.55;
      var r = rowR + (rnd() - 0.5) * 3.2;
      var px = cx + Math.cos(ang) * r, py = cy + Math.sin(ang) * r;
      var pts = 2 + Math.floor(rnd() * 3);        // 2..4 points per dab
      var tx = -Math.sin(ang), ty = Math.cos(ang);
      var lenPx = size * (0.018 + rnd() * 0.022);
      var coords = [], segLen = 0, prevx = null, prevy = null;
      for (var k = 0; k < pts; k++) {
        var along = (pts > 1 ? k / (pts - 1) - 0.5 : 0) * lenPx;
        var pw = (rnd() - 0.5) * 2.4;             // perpendicular ink wobble
        var dx = px + tx * along + Math.cos(ang) * pw;
        var dy = py + ty * along + Math.sin(ang) * pw;
        coords.push(f(dx) + ' ' + f(dy));
        if (prevx !== null) segLen += Math.hypot(dx - prevx, dy - prevy);
        prevx = dx; prevy = dy;
      }
      var sw = 1.8 + rnd() * (4.1 - 1.8);
      var op = 0.45 + rnd() * (0.95 - 0.45);
      var atomIdx = atom0 + (atomN > 0 ? Math.floor(j * atomN / dabCount) : 0);
      var dab = { d: 'M' + coords.join(' L'), sw: sw, op: op, lesson: i, atom: atomIdx, x: px, y: py, len: segLen };
      dabs.push(dab);
      if (atomIdx < atomsDone) frontier = dab;    // last inked dab in course order = the head
    }
  }

  // Emit dab paths: colour-by-state, with the draw animation ONLY on the in-progress frontier row.
  var parts = [];
  for (i = 0; i < dabs.length; i++) {
    var db = dabs[i];
    var inked = db.atom < atomsDone;
    var lessonDone = atomsDone >= (lessonStart[db.lesson] + lessonAtoms[db.lesson]);
    var sealed = lessonCircuit[db.lesson] < circuitsDone;
    var col;
    if (!inked) col = C_UNINK;
    else if (sealed) col = C_GOLD;
    else if (lessonDone) col = C_CREAM;
    else col = C_EMBER;
    // WR-01: draw ONLY the span newly inked since the last render — [animateFrom, atomsDone). At the
    // default (animateFrom === atomsDone) this range is empty, so an unchanged-progress re-render is
    // fully static and the established ring never re-draws. Reduced motion suppresses it entirely.
    var animate = !reduce && db.atom >= animateFrom && db.atom < atomsDone;
    var a = 'd="' + db.d + '" stroke="' + col + '" stroke-width="' + f(db.sw) +
      '" stroke-opacity="' + f(db.op) + '" stroke-linecap="round" fill="none"';
    if (animate) {
      var L = f(Math.max(1, db.len));
      a += ' stroke-dasharray="' + L + '" style="--len:' + L + ';animation:ink-draw var(--dur-draw) var(--ease) both"';
    }
    parts.push('<path ' + a + '/>');
  }

  // Outer gold thread: one arc per completed circuit; at CIRCUITS the thread closes the ring.
  var threadR = rOuter + size * 0.045;
  for (i = 0; i < circuitsDone; i++) {
    var a0 = -Math.PI / 2 + (i / CIRCUITS) * TAU, a1 = -Math.PI / 2 + ((i + 1) / CIRCUITS) * TAU;
    var x0 = cx + Math.cos(a0) * threadR, y0 = cy + Math.sin(a0) * threadR;
    var x1 = cx + Math.cos(a1) * threadR, y1 = cy + Math.sin(a1) * threadR;
    parts.push('<path class="ring-thread" d="M' + f(x0) + ' ' + f(y0) + 'A' + f(threadR) + ' ' + f(threadR) +
      ' 0 0 1 ' + f(x1) + ' ' + f(y1) + '" stroke="' + C_GOLD + '" stroke-width="1.9" stroke-opacity="0.95" stroke-linecap="round" fill="none"/>');
  }

  // Head-dot: a single static gold circle at the inking frontier (the tawaf head). WR-02: gated on
  // an ACTUAL frontier — at atomsDone 0 there is no frontier, so no head renders and the ring is
  // genuinely all-faint (§6.6 #3; §6.3 places the head "at the current inking frontier", and a solid
  // gold dot is not "faint"). It no longer falls back to dabs[0] at zero progress.
  var head = frontier;
  var headSVG = head ? '<circle class="ring-head" cx="' + f(head.x) + '" cy="' + f(head.y) +
    '" r="' + f(size * 0.013) + '" fill="' + C_GOLD + '"/>' : '';

  var label = 'Tawaf ring — ' + atomsDone + ' of ' + ATOMS + ' inked';
  return '<svg xmlns="http://www.w3.org/2000/svg" class="ring" viewBox="0 0 ' + size + ' ' + size +
    '" width="' + size + '" height="' + size + '" role="img" aria-label="' + label +
    '" data-seed="' + seed + '" data-atoms="' + atomsDone + '" data-circuits="' + circuitsDone +
    '"><g class="ring-dabs">' + parts.join('') + '</g>' + headSVG + '</svg>';
};

/* ============================================================
   SKY  ·  MOT-01 / MOT-04 — the prayer-clock temperature + the --dawn progress degree (§7)
   ------------------------------------------------------------
   The black home world's ambient Sky: a manual-times prayer clock (the v1 floor — no device-
   location API, no network, ever) that maps the LOCAL clock to one of five canvas temperatures,
   painted as the §3.2 [data-sky] tint OVER the Kiswah Orbit ground (law 1 — a tint, never a
   second ground). The temperature is TRUTHFUL ambience: a static tint is not motion, so it stays
   under reduced motion (§7.4); only the .sky-breathe pulse is gated off (plan 09 owns that
   gating). The separate --dawn degree is a subordinate horizon warmth that grows with progress
   but is never the metric (the Ring is the metric).

   These are hoisted `function` declarations so the parse-time boot-stamp block ABOVE (the one
   guarded DOM touch) can call them, and so defaultPrefs can seed the same default schedule — with
   NO awba_prefs schema bump, so existing v1 blobs are never reset. AW.skyTemp / AW.skyDawn expose
   the pure primitives for the headless suite.
   ============================================================ */

/* skyDefaultTimes() — the sensible manual DEFAULT schedule (§7.2 / D-A13). A fresh object each call
   (never a shared mutable singleton). The single source of truth for both defaultPrefs (fresh
   installs) and the boot read's fallback (existing v1 blobs that predate the prayerTimes field). */
function skyDefaultTimes() {
  return { fajr: '05:00', dhuhr: '13:00', asr: '16:30', maghrib: '19:30', isha: '21:00' };
}

/* skyMinutes("HH:MM") → local minutes-of-day. Pure string→number; no Date, no UTC serialization. */
function skyMinutes(hhmm) {
  var p = String(hhmm).split(':');
  return (Number(p[0]) || 0) * 60 + (Number(p[1]) || 0);
}

/* skyTemp(now, times, mode) — the PURE now→temperature function (§7.1/§7.2). Given a Date-like
   `now` (only getHours()/getMinutes() are read — LOCAL time, reusing the D-16 local discipline,
   NEVER a UTC/ISO serialization), the manual `times` table, and `mode`:
     · mode "off"  ⇒ always "day" (the opt-out, §7.2)
     · local midnight → Fajr ⇒ "lastthird"   · Fajr → Dhuhr ⇒ "dawn"    · Dhuhr → Maghrib ⇒ "day"
     · Maghrib → Isha ⇒ "dusk"               · Isha → local midnight ⇒ "night"
   Deterministic: identical (now, times, mode) always yield the identical temperature. References
   no device-location or network API — the Sky reveals nothing about the learner's whereabouts
   (T-03-10). midnight is local 00:00 (cur === 0). */
function skyTemp(now, times, mode) {
  if (mode === 'off') return 'day';
  times = times || skyDefaultTimes();
  var cur = now.getHours() * 60 + now.getMinutes();   // local minutes-of-day; midnight = 0
  var fajr = skyMinutes(times.fajr);
  var dhuhr = skyMinutes(times.dhuhr);
  var maghrib = skyMinutes(times.maghrib);
  var isha = skyMinutes(times.isha);
  if (cur < fajr) return 'lastthird';    // local midnight → Fajr (the Last Third)
  if (cur < dhuhr) return 'dawn';        // Fajr → Dhuhr (post-Fajr brightness)
  if (cur < maghrib) return 'day';       // Dhuhr → Maghrib (neutral day)
  if (cur < isha) return 'dusk';         // Maghrib → Isha
  return 'night';                        // Isha → local midnight
}

/* skyDawn(atomsDone) — the subordinate --dawn degree (§7.3): min(cap, atomsDone/61). A pure 0..1
   warmth scaled by course progress and CAPPED so it stays ambient and can never compete with the
   prayer-clock tint or the Ring. One degree of horizon apricot — never the metric. 61 = the
   taught-atom total (D-57/R-1), matching AW.ringSVG's DEF_STRUCT.atoms. */
function skyDawn(atomsDone) {
  var SKY_DAWN_CAP = 0.6, SKY_ATOMS = 61;
  var frac = Math.max(0, atomsDone | 0) / SKY_ATOMS;
  return Math.min(SKY_DAWN_CAP, frac);
}

AW.skyTemp = skyTemp;
AW.skyDawn = skyDawn;

/* AW.dailyIndex(date, poolLen) — PURE: the daily-ayah pool index, day-of-YEAR from LOCAL date
   parts only (D-16 — never toISOString/new Date(ymdString), which shift by the reviewer's UTC
   offset). Fixes the Gen-3 bug (`DAILY[new Date().getDate() % 7]`, day-of-MONTH, repeats every
   ~28-31 days) — day-of-year advances every real day of the year (LRN-05). Safe modulo handles
   any poolLen. */
AW.dailyIndex = function (date, poolLen) {
  var d = date || new Date();
  var start = new Date(d.getFullYear(), 0, 0);          // local Dec-31-prev-year midnight
  var cur = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  var doy = Math.round((cur - start) / 86400000);        // 1..366, local
  return ((doy % poolLen) + poolLen) % poolLen;           // safe modulo
};

/* ============================================================
   RUNNERS  ·  Phase 4 — AwbaLesson(cfg) / AwbaReview(cfg) (D-22)
   ============================================================ */

/* ---------- RUNNER MATH — pure, DOM-free contracts (D-47 / ENG-03 / ENG-04) ----------
   Byte-copied from Gen-3 (`_MVP-BUILD/shared/awba-engine.js`: resolve() 274-287, starsFor() 289,
   review bind() 438, review result() 451/369) — never invented, never "improved". These are the
   frozen mechanics the lesson/review runners (04-03/04-05) call instead of re-deriving the math
   inline; every helper below is pure (no DOM, no storage reads/writes of any kind). */

AW.PER_LESSON = 12;  // noor per correct quiz answer (Gen-3 PER, resolve() 274)
AW.REFLECT = 15;     // noor on a reflect-beat reveal (Gen-3 REFLECT, reflect 219)
AW.PER_REVIEW = 15;  // noor per correct review answer in the main phase (Gen-3 PER, bind() 438)
AW.SWIFT = 5;        // bonus noor when a review answer lands in time (Gen-3 SWIFT, bind() 438)
AW.QTIME = 14;        // review soft-timer seconds (Gen-3 QTIME, startTimer() 364)

/* AW.lessonStars(mistakes) — starsFor() 289: never 0. */
AW.lessonStars = function (mistakes) {
  return mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1;
};

/* AW.comboShow(combo) — showCombo() gate: the accruing chip shows at combo>=2 (resolve() 274). */
AW.comboShow = function (combo) {
  return combo >= 2;
};

/* AW.comboPerfect(combo) — the 3-streak flourish gate: fires once, at exactly combo===3
   (Gen-3 resolve() 274; re-voiced per D-45 as a quiet gold-thread flourish, never an overlay). */
AW.comboPerfect = function (combo) {
  return combo === 3;
};

/* AW.reviewScore(inTime) — bind() 438: PER + SWIFT bonus only when the answer landed in time. */
AW.reviewScore = function (inTime) {
  return AW.PER_REVIEW + (inTime ? AW.SWIFT : 0);
};

/* AW.reviewStars(correct, total, allInTime) — result() 451: flawless + never-timed-out -> 3;
   flawless but ANY timeout occurred (allInTime killed permanently at 369) -> capped at 2; any
   miss at all -> 1, regardless of timing. */
AW.reviewStars = function (correct, total, allInTime) {
  return correct === total ? (allInTime ? 3 : 2) : 1;
};

/* ---------- AW.sound — silent no-op sound plumbing (MOT-05 / D-52) ----------
   Full plumbing now, ships v1 silent: a missing cue file (or an autoplay block) resolves to a
   clean no-op with zero console errors. cue in {correct, incorrect, complete, streak}. Reads the
   existing awba_prefs.soundMuted slot via AW.prefs.get (no schema bump); the mute-toggle UI itself
   lands in the lesson/review HUD (04-03/04-05), not here. Path is page-relative to where
   lesson/review pages actually live (`lessons/`/`reviews/`, one level below `shared/` — the same
   relativity as their `<script src="../shared/awba-engine.js">` include). Cue asset format/set is
   an owner decision (Assumption A5); when files land in `shared/sfx/`, zero code change is
   required here. */
AW.sound = function (cue) {
  if (AW.prefs.get('soundMuted', false)) return;
  try {
    var a = new Audio('../shared/sfx/' + cue + '.mp3');
    a.play().catch(function () {});
  } catch (e) {
    /* no-op — missing Audio support / blocked playback never surfaces to the learner */
  }
};

/* ---------- AW.MLAB — marker display labels (ported from Gen-3 _MVP-BUILD/shared/awba-engine.js).
   The four validator marker types map to their manuscript labels; gen-4 ships only the four marker
   GLYPHS (fact/remember/fard/angle), not this label map, so it is ported here. */
AW.MLAB = {
  fact: 'Worth knowing',
  remember: 'Worth remembering',
  fard: 'The first duty',
  angle: 'Another angle',
};

/* ---------- pure beat-view helpers (DOM-free) — the Athar expression of Josh's Gen-3 beat markup.
   Every renderer emits ONLY the shipped @layer screens class names (04-02) + shipped AW.* icons,
   re-voiced per D-45 (scripture under law 3, the icon re-map at the renderer, cfg names unchanged).
   These build strings only — no DOM, no storage — so AW._beatHtml is unit-testable headlessly and
   the DOM driver (AwbaLesson) only inserts + wires the result. */

/* markerChip — a marginalia chip: the marker glyph (--icon-accent) + its AW.MLAB label, then the
   marker body as a plain note beneath (never uppercased). */
function markerChip(m) {
  if (!m) return '';
  var label = AW.MLAB[m.type] || '';
  return (
    '<div class="marker">' + AW.icon(m.type) + '<span>' + label + '</span></div>' +
    (m.body ? '<p>' + m.body + '</p>' : '')
  );
}

/* sceneIco — a centred scene icon above a beat (the Gen-3 "illustration" slot), Page crimson
   detail via --icon-accent. Token-only inline style (no new token). */
function sceneIco(name) {
  return '<div class="beat-ico" style="text-align:center;line-height:0;color:var(--icon-accent)">' +
    AW.icon(name, { size: '52px' }) + '</div>';
}

/* the six content-beat builders (read/frame/verse/panel/depth/reflect) */
function readHtml(it) {
  return (
    '<div class="read">' +
    (it.kicker ? '<div class="kicker">' + it.kicker + '</div>' : '') +
    (it.title ? '<h2 class="pintro">' + it.title + '</h2>' : '') +
    (it.html || '') +
    markerChip(it.marker) +
    '</div>'
  );
}
function frameHtml(it) {
  return (
    '<div class="frame">' +
    '<div class="kicker">' + (it.kicker || 'The idea to hold onto') + '</div>' +
    '<p class="fstmt">' + (it.lead || '') + '</p>' +
    '</div>'
  );
}
/* verse — scripture law (law 3): .scard on clean ground (--go:0, emitted inline to reinforce the
   law), the ayah in Amiri Quran with lang/dir, the translation carrying the ˹ ˺ brackets, the fixed
   source line. NOTHING celebratory is authored in this panel. */
function verseHtml(it) {
  return (
    sceneIco('quran-stand') +
    '<div class="scard" style="--go:0">' +
    (it.label ? '<div class="slabel">' + it.label + '</div>' : '') +
    '<p class="ayah" lang="ar" dir="rtl">' + (it.ar || '') + '</p>' +
    '<p class="trans">' + (it.tr || '') + '</p>' +
    '<p class="tsrc">Translation of the meaning: The Clear Quran, Dr. Mustafa Khattab · pending review</p>' +
    '</div>' +
    (it.after || '')
  );
}
function panelHtml(it) {
  var variant = it.variant || 'pull';
  var rows = (it.items || []).map(function (x, i) {
    var n = x.n || i + 1;
    var name = x.name ? '<strong>' + x.name + '.</strong> ' : '';
    return '<div class="pnl-i"><span class="pn">' + n + '</span><span>' + name + (x.body || '') + '</span></div>';
  }).join('');
  var tell = variant === 'tell' && it.intro ? '<div class="tkick">' + it.intro + '</div>' : '';
  var intro = it.intro && variant !== 'tell' ? '<p>' + it.intro + '</p>' : '';
  return (
    '<div class="pnl v-' + variant + '">' +
    (it.title ? '<h2 class="pintro">' + it.title + '</h2>' : '') +
    tell + intro + rows +
    '</div>' +
    markerChip(it.marker)
  );
}
/* depth — the 3-lens accordion (§S2). Fixed order reality → revelation → ruling; each lens is
   SHAPE-cued (a distinct header glyph + the CSS left-rule style) AND label-cued, never colour-only.
   The lenses are closed at build; the driver toggles the shipped `.lens.open > .lb` reveal. */
var DEPTH_LENSES = [
  { k: 'reality', cls: 'l-reality', label: 'Reality', glyph: 'angle' },
  { k: 'revelation', cls: 'l-revelation', label: 'Revelation', glyph: 'cite' },
  { k: 'ruling', cls: 'l-ruling', label: 'Ruling', glyph: 'fard' },
];
function depthHtml(it) {
  var lenses = (it.lenses || {});
  var accs = DEPTH_LENSES.map(function (l) {
    return (
      '<div class="lens ' + l.cls + '">' +
      '<button class="lh" type="button" aria-expanded="false">' + AW.icon(l.glyph) + '<span>' + l.label + '</span></button>' +
      '<div class="lb"><p>' + (lenses[l.k] || '') + '</p></div>' +
      '</div>'
    );
  }).join('');
  return (
    sceneIco('beads') +
    '<div class="kicker">Go deeper</div>' +
    (it.point ? '<h2 class="pintro">' + it.point + '</h2>' : '') +
    '<div class="lacc">' + accs + '</div>'
  );
}
/* reflect — a private textarea (never persisted, never re-rendered — T-04-03a) + the model slot. */
function reflectHtml(it) {
  return (
    sceneIco('dua') +
    '<div class="kicker">Take a moment</div>' +
    '<div class="reflect">' +
    '<label for="lsrt">' + (it.prompt || '') + '</label>' +
    '<textarea id="lsrt" placeholder="Write a line, only if you feel like it."></textarea>' +
    '<div class="tsrc">This stays private, and you can skip it.</div>' +
    '<div id="lsmodel"></div>' +
    '</div>'
  );
}

/* the three quiz-beat builders (mc/tf/tile) — layout wrappers over the SHIPPED .opt/.tf/.tile; the
   verdicts (.opt.correct gold dot / .opt.wrong grey blot / .opt-why / .btn.retry) are applied by the
   driver on resolve, never authored here. */
function mcHtml(it) {
  var opts = (it.o || []).map(function (o, i) {
    return '<button class="opt" type="button" data-i="' + i + '">' + o + '</button>';
  }).join('');
  return (
    '<h2 class="pintro">' + (it.q || '') + '</h2>' +
    (it.quote ? '<p class="trans">“' + it.quote + '”</p>' : '') +
    '<div class="opts">' + opts + '</div>'
  );
}
function tfHtml(it) {
  return (
    '<div class="kicker">True or false</div>' +
    '<h2 class="pintro">' + (it.q || '') + '</h2>' +
    '<div class="tfrow">' +
    '<button class="tf" type="button" data-v="true">True</button>' +
    '<button class="tf" type="button" data-v="false">False</button>' +
    '</div>'
  );
}
function tileHtml(it) {
  var bank = (it.bank || []).map(function (w, i) {
    return '<button class="tile" type="button" data-w="' + i + '">' + w + '</button>';
  }).join('');
  return (
    '<div class="kicker">Build the answer</div>' +
    '<h2 class="pintro">' + (it.prompt || '') + '</h2>' +
    '<div class="tilebox" id="lstilebox"></div>' +
    '<div class="bank" id="lsbank">' + bank + '</div>'
  );
}

/* AW._beatHtml(it, cfg) — the pure view dispatcher (test seam). Returns the beat's inner HTML
   string for any of the nine beat types; the driver wraps it in `.stage`, inserts, and wires. */
AW._beatHtml = function (it, cfg) {
  if (!it) return '';
  if (it.t === 'read') return readHtml(it);
  if (it.t === 'frame') return frameHtml(it);
  if (it.t === 'verse') return verseHtml(it);
  if (it.t === 'panel') return panelHtml(it);
  if (it.t === 'depth') return depthHtml(it);
  if (it.t === 'reflect') return reflectHtml(it);
  if (it.t === 'mc') return mcHtml(it);
  if (it.t === 'tf') return tfHtml(it);
  if (it.t === 'tile') return tileHtml(it);
  return '';
};

/* AW._resolveScore(s, ok) — the pure, byte-preserved scoring reducer (Gen-3 resolve() 274-287). A
   correct answer accrues +1 correct, +1 combo (best-of tracked), +AW.PER_LESSON (12) noor; a miss
   banks +1 mistake and zeroes the combo, costing no noor (the un-loseable promise). No DOM, no
   storage — the driver applies the returned tallies and the 04-01 helpers gate combo/streak/stars. */
AW._resolveScore = function (s, ok) {
  var n = {
    correct: s.correct, combo: s.combo, comboBest: s.comboBest,
    mistakes: s.mistakes, noorEarned: s.noorEarned,
  };
  if (ok) {
    n.correct++;
    n.combo++;
    n.comboBest = Math.max(n.comboBest, n.combo);
    n.noorEarned += AW.PER_LESSON;
  } else {
    n.mistakes++;
    n.combo = 0;
  }
  return n;
};

/* AW._noorClaimer() — the persist-once claimer behind the reward "noor moment" (RWD-01 / T-04-04a).
   Returns claim(amount): it adds `amount` to stored noor through the AW.S seam (D-24) EXACTLY ONCE
   (Gen-3 parity — the noor moment credits a single time). The first call persists and returns true;
   every later call is an idempotent no-op returning false, so a re-entry, a double-tap, or a
   back-then-forward through the six-moment terminus can never double-credit. This is the 04-03
   `noorClaimed` closure guard, extracted so the once-only invariant is unit-testable DOM-free. No
   DOM, no timers — pure persistence discipline (parse-time-safe). */
AW._noorClaimer = function () {
  var claimed = false;
  return function (amount) {
    if (claimed) return false;
    claimed = true;
    AW.S.set('noor', AW.S.get('noor', 0) + (amount | 0));
    return true;
  };
};

/* ---------- the shared 44px HUD mute toggle (§S6 / MOT-05) — ONE pattern for BOTH runners.
   The speaker glyph is an inline control affordance (currentColor, inherits --icon-accent via
   .ls-mute svg — crimson on Page, gold on Orbit), NOT a KIT/GLYPHS entry: the registry has no
   sound mark and its two counts are frozen by the components suite. aria-pressed + the accessible
   name swap ("Mute sounds"/"Unmute sounds") ride awba_prefs.soundMuted via AW.prefs only. */
var SPEAKER_ON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9 h4 l5 -4 v14 l-5 -4 H4 Z" fill="currentColor"/><path d="M16 8 a5 5 0 0 1 0 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
var SPEAKER_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9 h4 l5 -4 v14 l-5 -4 H4 Z" fill="currentColor"/><line x1="16" y1="9" x2="21" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="21" y1="9" x2="16" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
function muteBtnHtml() {
  var muted = AW.prefs.get('soundMuted', false);
  var label = muted ? 'Unmute sounds' : 'Mute sounds';
  return '<button class="ls-mute" id="lsmute" type="button" aria-pressed="' + (muted ? 'true' : 'false') +
    '" aria-label="' + label + '">' + (muted ? SPEAKER_OFF : SPEAKER_ON) + '</button>';
}
function bindMuteBtn(refresh) {
  var m = document.getElementById('lsmute');
  if (!m) return;
  m.addEventListener('click', function () {
    var now = !AW.prefs.get('soundMuted', false);
    AW.prefs.set('soundMuted', now);
    document.documentElement.setAttribute('data-sound', now ? 'muted' : '');
    if (refresh) refresh();
  });
}

/* AW.muteBtnHtml / AW.bindMuteBtn — expose the module-private mute-toggle helpers above so a
   page-inline script (e.g. learn.html, D-60) can reach the ONE shared 44px mute pattern both
   runners already use. Behaviour-neutral: these are the same functions, just also reachable
   off AW (Pitfall 6). No new glyph — glyphCount (components.test.js) stays frozen at 13. */
AW.muteBtnHtml = muteBtnHtml;
AW.bindMuteBtn = bindMuteBtn;

/* PRAISE (single-source, S4) — the four correct-answer praise words, cycled by the running correct
   count. Hoisted to module scope so BOTH the lesson runner's resolve() AND AW.practiceRun read the
   SAME const (a behaviour-preserving move; no test pinned its former in-function location). The
   curly apostrophes are byte-preserved from the Gen-3 runner. */
var PRAISE = ['That’s it.', 'Beautiful.', 'Exactly right.', 'Masha’Allah.'];

/* DUA_DEFAULT (G3 · CONTENT-DECISIONS §G3) — the engine-level default closing du'a, used ONLY when a
   lesson omits cfg.dua (a per-lesson cfg.dua overrides it entirely). Provenance: class-b, corroborated
   byte-identical across two of the owner's own prior collections (awba-app find.ts + handoff Zone E9),
   Ibn Ḥibbān 974, graded Sahih — spliced from the owner's documents, never generated. The pending-review
   honesty posture rides until scholar sign-off (the " · pending review" suffix is appended by _duaBlock).
   `tr` is the corroborated English translation, rendered as a quiet workhorse line — never the Amiri
   Quran face, and no transliteration is surfaced. No SHA-frozen content file is touched (splice law). */
var DUA_DEFAULT = {
  ar: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
  tr: 'O Allah, nothing is easy except what You make easy — and You make the hard thing, when You will, easy.',
  source: 'Ibn Ḥibbān 974 · Sahih',
};

/* AW._duaBlock(dua) — the du'a-close scripture-block builder (pure test seam, like AW._beatHtml). With
   no per-lesson `dua`, the engine default (DUA_DEFAULT) is used and its English translation rides as a
   quiet .close line UNDER the Arabic (Arabic→translation→source order, in the du'a-close screen's own
   type/tokens — not the Quran face). A per-lesson `dua` (string or {ar,source}) overrides the default
   entirely (Arabic + source only — Josh's asset, splice-not-retype). The engine auto-appends
   " · pending review" to the source; do not double it. */
AW._duaBlock = function (dua) {
  var ar, tr, source;
  if (dua) {
    ar = typeof dua === 'string' ? dua : (dua.ar || '');
    tr = '';
    source = (dua && dua.source) ? dua.source : '';
  } else {
    ar = DUA_DEFAULT.ar;
    tr = DUA_DEFAULT.tr;
    source = DUA_DEFAULT.source;
  }
  if (!ar) return '';
  return '<p class="scripture" lang="ar" dir="rtl">' + ar + '</p>' +
    (tr ? '<p class="close">' + tr + '</p>' : '') +
    (source ? '<p class="close">' + source + ' · pending review</p>' : '');
};

/* ============================================================================================
   AwbaLesson(cfg) — the lesson runner (ENG-01/03/05, CNT-01/04, MOT-05). Josh's Gen-3 cfg shape is
   consumed byte-unchanged; the mechanics are byte-preserved (the numbers come from the 04-01 pure
   helpers) and the expression is re-voiced to the Athar Page register (D-45/D-47). This pass ships
   the shell + flow + opener + the six content beats; quiz resolution + the reward terminus + the
   mute toggle land next. DOM access is confined here — the beat markup is the pure AW._beatHtml.
   ============================================================================================ */
function AwbaLesson(cfg) {
  if (typeof document === 'undefined') return; // headless load (tests) — the runner is DOM-driven
  cfg = cfg || {};
  var beats = cfg.beats || [];
  var steps = beats.length;

  /* Gen-3 setup vars, byte-preserved (115-128) EXCEPT the retired body builder + the retired
     unit-accent wiring line (the cfg unit-tint field stays inert — no register recolour, D-45). */
  var pos = -1, stepIndex = 0, answered = false, combo = 0, comboBest = 0, correct = 0, mistakes = 0,
    quizN = 0, noorEarned = 0;
  var flourishTimer = null;            // WR-02 — the pending 3-streak flourish timer, closure-scoped so resolve() can clear a stale one before it writes into a later answer's #lsflourish
  var claimNoor = AW._noorClaimer();   // the noor moment persists exactly once (RWD-01 / T-04-04a)
  beats.forEach(function (b) { if (['mc', 'tf', 'tile'].indexOf(b.t) >= 0) quizN++; });

  /* Pitfall 7 / WR-01 — the Ring's animateFrom is captured HERE, at INIT: BEFORE the opener, BEFORE
     AW.touchDay, BEFORE this lesson's best-of star persists at done(). Pre-lesson atoms are the
     exact taught-atom frontier (D-57/R-1, AW.atomsDone — the verified NODE_ATOMS map, never a
     *3 proxy). On a genuine first completion done() adds THIS node's star key, so postAtoms >
     preLessonAtoms and the Ring inks ONLY the new frontier [preLessonAtoms, postAtoms). On a
     replay the key already exists at init, so postAtoms === preLessonAtoms, the span is empty,
     and the established Ring never re-draws (law 9) — no phantom celebration. */
  var preLessonAtoms = AW.atomsDone(AW.state());

  /* Athar skeleton — a Page-register manuscript shell (never the retired Gen-3 body builder). */
  document.body.innerHTML =
    '<main class="reg-page ls-shell">' +
    '<div class="ls-hud" id="lshud"></div>' +
    '<div class="ls-prog" id="lsprog"></div>' +
    '<div id="root"></div>' +
    '</main>';
  var root = document.getElementById('root');
  var hudEl = document.getElementById('lshud');
  var progEl = document.getElementById('lsprog');
  var shellEl = document.querySelector('.ls-shell');   // the register carrier — swapped Page→Orbit→Sky at the terminus

  /* the mute control — the shared 44px HUD toggle (§S6 / MOT-05), one pattern for both runners. */
  var hudStats = false;
  function setHUD(showStats) {
    hudStats = showStats;
    var stats = showStats
      ? '<span class="ls-stats">' +
        '<span class="hstat">' + AW.icon('spark') + '<span>' + (AW.S.get('noor', 0) + noorEarned) + '</span></span>' +
        '<span class="hstat">' + AW.icon('flame') + '<span>' + AW.S.get('returns', 0) + '</span></span>' +
        '</span>'
      : '<span class="ls-stats"></span>';
    hudEl.innerHTML = stats + muteBtnHtml();
    bindMuteBtn(function () { setHUD(hudStats); });
  }
  function bumpNoor() { setHUD(true); }

  function paintProg() {
    if (pos < 0) { progEl.innerHTML = ''; return; }
    var dabs = '';
    for (var i = 0; i < steps; i++) {
      var state = i < stepIndex ? 'mastered' : (i === pos ? 'progress' : 'not-yet');
      dabs += '<span class="ls-dab" data-state="' + state + '">' + (state === 'mastered' ? AW.icon('check') : '') + '</span>';
    }
    progEl.innerHTML = dabs + '<span class="ls-count">' + Math.min(pos + 1, steps) + ' / ' + steps + '</span>';
  }

  function foot(inner) { return '<div class="foot" id="lsfoot">' + inner + '</div>'; }
  function btn(label, cls, id) { return '<button class="btn ' + (cls || '') + '" id="' + (id || 'cont') + '" type="button">' + label + '</button>'; }
  function backCtl() { return '<button class="ls-back" id="lsback" type="button"' + (pos < 0 ? ' hidden' : '') + '>Back a step</button>'; }
  function next() { pos++; render(); }
  function bindBack() {
    var b = document.getElementById('lsback');
    if (b) b.addEventListener('click', function () { if (pos >= 0) { pos--; stepIndex = Math.max(pos, 0); render(); } });
  }
  function bindCont(advance) {
    var c = document.getElementById('cont');
    if (c) c.addEventListener('click', function () { if (advance) stepIndex++; next(); });
  }

  function opener() {
    setHUD(false);
    paintProg();
    var mode = AW.greetMode(), ret = AW.S.get('returns', 0);
    var chip = '', greet = cfg.opener && cfg.opener.h2 ? cfg.opener.h2 : 'In the name of God';
    var p = (cfg.opener && cfg.opener.p) || '';
    if (mode === 'streak' && ret > 1) {
      chip = '<div class="kicker">' + ret + ' returns</div>';
    } else if (mode === 'returning') {
      chip = '<div class="kicker">welcome back</div>';
      greet = 'It’s good to see you again';
      p = 'However long it has been, nothing is lost. A clean page. ' + ((cfg.opener && cfg.opener.p) || '');
    }
    var uicon = AW.UNIT_ICON[(cfg.id || '').slice(0, 2)] || 'lantern';
    var journey = cfg.journey ? '<div class="kicker">' + cfg.journey + '</div>' : '';
    var thought = cfg.opener && cfg.opener.thought ? '<p class="thought">' + cfg.opener.thought + '</p>' : '';
    root.innerHTML =
      '<div class="hero">' +
      journey + chip +
      '<div class="hero-ico">' + AW.icon(uicon, { size: '96px' }) + '</div>' +
      '<h1 class="greet">' + greet + '</h1>' +
      (p ? '<p>' + p + '</p>' : '') +
      thought +
      '</div>' +
      foot(btn('Begin, gently'));
    document.getElementById('cont').addEventListener('click', function () {
      AW.touchDay();
      stepIndex = 0;
      next();
    });
  }

  function render() {
    if (pos < 0) { opener(); return; }
    if (pos >= steps) { verdict(); return; }
    var it = beats[pos];
    answered = false;
    setHUD(true);
    paintProg();

    if (it.t === 'mc' || it.t === 'tf' || it.t === 'tile') { quiz(it); return; }

    root.innerHTML = '<div class="stage">' + AW._beatHtml(it, cfg) + '</div>' + foot(btn('Continue') + backCtl());
    AW.wire(root, cfg);

    if (it.t === 'depth') {
      root.querySelectorAll('.lens').forEach(function (lens) {
        var head = lens.querySelector('.lh');
        head.addEventListener('click', function () {
          var open = lens.classList.toggle('open');
          head.setAttribute('aria-expanded', open ? 'true' : 'false');
          // WR-03 — no re-wire on open. AW.wire(root, cfg) above already bound every .cite/.term
          // inside the still-hidden (display:none) lens bodies (querySelectorAll ignores visibility),
          // so re-wiring the lens body on each toggle only stacked duplicate listeners.
        });
      });
    }

    if (it.t === 'reflect') {
      var c = document.getElementById('cont'); c.textContent = 'Show a reflection'; c.classList.add('ghost');
      var shown = false;
      c.addEventListener('click', function (e) {
        if (!shown) {
          e.stopImmediatePropagation();
          shown = true;
          noorEarned += AW.REFLECT;
          bumpNoor();
          AW.announce('+' + AW.REFLECT + ' noor — a reflection');   // the reflect reveal earns AW.REFLECT — announced once, reusing the verbatim amount
          document.getElementById('lsmodel').innerHTML =
            '<div class="model"><div class="kicker">A reflection · +' + AW.REFLECT + ' noor</div><p>' + (it.model || '') + '</p></div>';
          c.textContent = 'Continue';
          c.classList.remove('ghost');
        }
      });
    }

    bindCont(true);
    bindBack();
  }

  /* quiz — render the beat + a Check foot; wire the choice, then resolve on Check. */
  function quiz(it) {
    root.innerHTML = '<div class="stage">' + AW._beatHtml(it, cfg) + '</div>' +
      foot(btn('Check', 'disabled', 'check') + backCtl());
    if (it.t === 'tile') bindTile(it); else bindChoice(it);
    bindBack();
  }

  function bindChoice(it) {
    var sel = it.t === 'mc' ? '.opt' : '.tf';
    var nodes = root.querySelectorAll(sel), chosen = null;
    var check = document.getElementById('check');
    check.disabled = true;   // ACC-01/Pitfall 4: the class-only 'disabled' Check was focusable + silently inert — a real disabled attribute keeps it out of the tab order until an option is chosen
    nodes.forEach(function (n) {
      n.addEventListener('click', function () {
        if (answered) return;
        nodes.forEach(function (x) { x.style.borderColor = ''; x.style.borderWidth = ''; x.style.transform = ''; x.setAttribute('aria-pressed', 'false'); });   // clear the prior selection cue on re-selection
        n.style.borderColor = 'var(--crimson)';           // persistent selection cue (token-only)
        n.style.borderWidth = '3px';                       // ACC-03 non-colour channel: 2→3px "thicker" (box-sizing:border-box → no reflow), zero new hex
        n.style.transform = 'translateY(1px)';             // ACC-03 "pushed in": the shipped paper-press held static (law 9, no new keyframe — rides the existing --dur-press transition)
        n.setAttribute('aria-pressed', 'true');            // ACC-03/R-11: the non-colour selection state a SR + a colourblind eye can read (WCAG 1.4.1)
        chosen = it.t === 'mc' ? +n.dataset.i : (n.dataset.v === 'true');
        check.classList.remove('disabled'); check.disabled = false;   // an option is chosen — the Check is now a live control
      });
    });
    check.addEventListener('click', function () {
      if (answered || chosen === null) return;
      answered = true;
      var ok = chosen === it.c;
      nodes.forEach(function (x) { x.style.pointerEvents = 'none'; x.style.borderColor = ''; x.style.borderWidth = ''; x.style.transform = ''; x.disabled = true; });   // resolved options leave the tab order (real disabled, not just pointer-events — Pitfall 4); the selection cue clears so the verdict styling reads clean
      if (it.t === 'mc') {
        nodes[it.c].classList.add('correct');            // gold dot draws on the answer
        if (!ok) nodes[chosen].classList.add('wrong');   // law-8 grey ink-blot on the miss
      } else {
        nodes.forEach(function (x) { if ((x.dataset.v === 'true') === it.c) x.classList.add('correct'); });
        if (!ok) nodes.forEach(function (x) { if (x.dataset.v === String(chosen)) x.classList.add('wrong'); });
      }
      resolve(ok, it);
    });
  }

  function bindTile(it) {
    var box = document.getElementById('lstilebox'), bankEl = document.getElementById('lsbank'),
      check = document.getElementById('check');
    var placed = [];
    check.disabled = true;   // ACC-01/Pitfall 4: the class-only 'disabled' Check gets a real disabled attribute until a tile is placed
    function refresh() { var empty = placed.length === 0; check.classList.toggle('disabled', empty); check.disabled = empty; }
    bankEl.querySelectorAll('.tile').forEach(function (t) {
      t.addEventListener('click', function () {
        if (answered || t.classList.contains('used')) return;
        t.classList.add('used'); t.style.opacity = '.35'; t.style.pointerEvents = 'none';
        var bt = document.createElement('button'); bt.className = 'tile'; bt.type = 'button'; bt.textContent = t.textContent;
        bt.setAttribute('aria-pressed', 'true');   // ACC-03/R-11: a placed token reads as pressed (its non-colour state — the bank tile also dims to .35)
        bt.style.borderWidth = '3px';              // ACC-03 "thicker" (border-box → no reflow), zero new hex
        bt.style.transform = 'translateY(1px)';    // ACC-03 "pushed in": the shipped paper-press held static (law 9, no new keyframe)
        bt.addEventListener('click', function () {
          if (answered) return;
          bt.remove(); t.classList.remove('used'); t.style.opacity = ''; t.style.pointerEvents = '';
          placed = placed.filter(function (x) { return x !== bt; });
          refresh();
        });
        box.appendChild(bt); placed.push(bt); refresh();
      });
    });
    check.addEventListener('click', function () {
      if (answered || placed.length === 0) return;
      answered = true;
      var built = placed.map(function (b) { return b.textContent; });
      var ok = JSON.stringify(built) === JSON.stringify(it.solution);
      box.querySelectorAll('.tile').forEach(function (b) { b.style.pointerEvents = 'none'; b.style.transform = ''; b.style.borderColor = ok ? 'var(--gold)' : 'var(--rule)'; b.disabled = true; });   // resolved tokens leave the tab order (real disabled — Pitfall 4)
      bankEl.querySelectorAll('.tile').forEach(function (b) { b.style.pointerEvents = 'none'; b.disabled = true; });
      resolve(ok, it);
    });
  }

  /* resolve — the mechanics come from AW._resolveScore (Gen-3 numbers); the expression is Athar
     (D-45): correct → praise + a META gold .dab when comboShow, a quiet .thread flourish at
     comboPerfect; miss → law-8 "Nothing lost" + the it.gentle line + a --rose retry that advances
     (the miss is already banked, so the star math stays byte-preserved). PRAISE is the module-level
     single-source const (S4) shared with AW.practiceRun. */
  function resolve(ok, it) {
    clearTimeout(flourishTimer);   // WR-02 — cancel any 3-streak flourish still pending from a prior beat before this resolve rebuilds #lsflourish (D-45: fires once, only at combo===3)
    var st = AW._resolveScore(
      { correct: correct, combo: combo, comboBest: comboBest, mistakes: mistakes, noorEarned: noorEarned }, ok);
    correct = st.correct; combo = st.combo; comboBest = st.comboBest; mistakes = st.mistakes; noorEarned = st.noorEarned;
    bumpNoor();
    if (ok) AW.sound('correct'); else AW.sound('incorrect');
    var fw = document.getElementById('lsfoot');
    var say = '';   // R-10: ONE composed line per resolve() into the body-level region — the visible #lsfoot is NEVER made a live region (Pitfall 9); numbers reuse AW.PER_LESSON verbatim (no mechanics change)
    if (ok) {
      var title = PRAISE[correct % PRAISE.length];
      // reuse the SAME praise word the foot shows + the shipped noor amount; fold the combo/3-streak into the one string (comboShow gates it exactly as the visible chip does)
      say = title + ' +' + AW.PER_LESSON + ' noor' + (AW.comboShow(combo) ? ' — ' + combo + ' in a row' : '');
      var chip = AW.comboShow(combo)
        ? '<span class="dab">' + AW.icon('spark') + '</span><span class="ls-count">' + combo + ' in a row</span>'
        : '';
      fw.innerHTML =
        '<h2 class="pintro">' + title + '</h2>' +
        '<p>' + (it.good || '') + '</p>' +
        '<div class="meta">' + chip +
        '<span class="ls-count">' + AW.icon('spark') + ' +' + AW.PER_LESSON + ' noor</span>' +
        '<span class="flourish" id="lsflourish"></span></div>' +
        btn('Continue') + backCtl();
      if (AW.comboPerfect(combo)) {
        AW.sound('streak');
        flourishTimer = setTimeout(function () {          // Gen-3's 260ms once-per-streak delay (captured so a stale one gets cleared)
          var fl = document.getElementById('lsflourish');
          if (fl) fl.innerHTML = '<svg viewBox="0 0 64 12" width="64" height="12" aria-hidden="true"><path class="thread" d="M2 8 Q32 -2 62 8"/></svg>';
        }, 260);
      }
    } else {
      say = 'Nothing lost. ' + (it.gentle || '');   // law-8 mercy line + the beat's own gentle line — no noor is lost, nothing scolds
      fw.innerHTML =
        '<h2 class="pintro">Nothing lost</h2>' +
        '<p class="opt-why">' + (it.gentle || '') + '</p>' +
        btn('Continue', 'retry') + backCtl();
    }
    AW.announce(say);   // the single in-place announce for this answer (correct or miss)
    document.getElementById('cont').addEventListener('click', function () { stepIndex++; next(); });
    bindBack();
  }

  /* ---------- the reward choreography (RWD-01/02/03 · D-51) — the flagship post-lesson sequence.
     SIX moments, ONE register per screen (law 1): verdict → noor → returns → done on Page cream,
     the Ring moment on Orbit, the du'a close on Sky. Every staggered reveal chains through
     AW.animate(el, kf, '--dur-*', '--ease').finished with a 60ms gap (each anim self-guards reduced
     motion → 1ms, so the centre never animates). Celebration is INK (drifting .dab stars + the Ring
     drawing your new frontier), and it NEVER touches scripture — the du'a block authors no
     celebration primitive. Noor persists once at the noor moment (claimNoor); best-of stars persist
     at done() and never downgrade. ---------------------------------------------------------------- */

  function setGround(reg) { if (shellEl) shellEl.className = reg + ' ls-shell'; }   // Page → Orbit → Sky
  function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }   // the 60ms stagger gap
  /* focusHeading — R-10: after a reward screen swap, land focus on that screen's heading (tabindex=-1)
     so focus never evaporates to <body> and the SR reads the new screen from its start. focus() for the
     screen change; the heading is NEVER also announced (Pitfall 2 — no double-speak). */
  function focusHeading(sel) { var h = root.querySelector(sel); if (h) h.focus(); }

  /* verdict stars — shape-first gold INK: a filled .dab (gold + check) per earned star, a hollow
     .dab (ring) per unearned, in the shipped [data-state] grammar (D-45). The .dab primitive drifts
     into place (Circle verb) and rests static under reduced motion; the grade reads by SHAPE — gold
     is only the fill, never the sole signal. */
  function starRow(n) {
    var s = '';
    for (var i = 0; i < 3; i++) {
      var on = i < n;
      s += '<span class="dab" data-state="' + (on ? 'mastered' : 'not-yet') + '"' +
        ' style="--dx:' + (i % 2 ? 7 : -7) + 'px;--dy:-6px">' + (on ? AW.icon('check') : '') + '</span>';
    }
    return '<div class="rw-stars">' + s + '</div>';
  }
  /* each stat tile starts hidden (opacity:0) so its staggered settle reveal reads cleanly. */
  function statTile(glyph, num, lab) {
    return '<div class="rw-stat" style="opacity:0">' + AW.icon(glyph) +
      '<span class="num">' + num + '</span><span class="lab">' + lab + '</span></div>';
  }
  /* countUp — a Marcellus display flourish that rides an AW.animate's OWN progress (no raw ms, no
     hand-rolled duration parsing): the numeral tracks the reveal 0 → total, snapping to total when
     it finishes. Under reduced motion the reveal is ~1ms, so the number simply appears at its final
     value. Degrades to an immediate final value where rAF is unavailable. */
  function countUp(el, total, anim) {
    if (typeof requestAnimationFrame !== 'function' || total <= 0) { el.textContent = '+' + total; return; }
    (function tick() {
      var p = 1;
      try { var ct = anim.effect && anim.effect.getComputedTiming(); if (ct && ct.progress != null) p = ct.progress; } catch (e) {}
      el.textContent = '+' + Math.round(p * total);
      if (anim.playState === 'running') requestAnimationFrame(tick);
    })();
  }

  /* 1 · Verdict (Page) — shape-first stars drift in, the verdict word, then three stat tiles settle
     in staggered on the Page verb (settle, 60ms gaps). Marks from shipped GLYPHS (spark/check/star). */
  async function verdict() {
    setGround('reg-page');
    setHUD(false);
    paintProg();
    var acc = quizN ? Math.round((correct / quizN) * 100) : 100;
    var stars = AW.lessonStars(mistakes);
    var word = mistakes === 0 ? 'Flawless' : (mistakes === 1 ? 'Beautifully done' : 'You made it through');
    var sub = mistakes === 0 ? 'Every answer, clean. A lamp with a deep well of oil.'
      : (mistakes === 1 ? 'One gentle miss, and you carried on. That is exactly the spirit.'
        : 'You stayed with it to the end. That is what counts here.');
    root.innerHTML =
      '<div class="rw-verdict">' +
      starRow(stars) +
      '<h1 class="rw-word" tabindex="-1">' + word + '</h1>' +
      '<p>' + sub + '</p>' +
      '<div class="rw-stats">' +
      statTile('spark', '+' + noorEarned, 'Noor') +
      statTile('check', acc + '%', 'Accuracy') +
      statTile('star', comboBest + '×', 'Best run') +
      '</div></div>' +
      foot(btn('Claim your noor'));
    document.getElementById('cont').addEventListener('click', rewardNoor);   // wire before the reveal
    focusHeading('.rw-word');   // R-10: focus this screen's heading (screen change → focus, not announce; no double-speak)
    var tiles = root.querySelectorAll('.rw-stat');
    for (var i = 0; i < tiles.length; i++) {
      var anim = AW.animate(tiles[i],
        [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
        '--dur-settle', '--ease');
      await (i < tiles.length - 1 ? delay(60) : anim.finished);
    }
  }

  /* 2 · Noor claim (Page) — persist EXACTLY once at the noor moment (claimNoor, interruption-safe),
     then the Marcellus count-up rides the settle reveal. AW.sound('complete') peaks here. */
  async function rewardNoor() {
    setGround('reg-page');
    claimNoor(noorEarned);                                // the noor moment — persists once (T-04-04a)
    AW.sound('complete');
    root.innerHTML =
      '<div class="rw-noor">' + sceneIco('pattern') +
      '<h1 class="noorbig">' + AW.icon('spark') + ' <span id="lsnoornum">+0</span></h1>' +
      '<h2 class="rw-word" style="font-size:var(--fs-h2)" tabindex="-1">Noor gathered</h2>' +
      '<p>Light you collect as you learn. It never runs out on you.</p>' +
      (cfg.grew ? '<div class="grew"><div class="kicker">What changed</div><p>' + cfg.grew + '</p></div>' : '') +
      '</div>' +
      foot(btn('Lovely'));
    document.getElementById('cont').addEventListener('click', rewardReturns);
    focusHeading('.rw-word');   // land on the static "Noor gathered" heading — NOT .noorbig (its #lsnoornum count animates; the countUp numeral must never be read)
    var numEl = document.getElementById('lsnoornum');
    var anim = AW.animate(root.querySelector('.noorbig'),
      [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
      '--dur-settle', '--ease');
    countUp(numEl, noorEarned, anim);
    await anim.finished;
    numEl.textContent = '+' + noorEarned;                 // exact final, regardless of tick timing
  }

  /* 3 · Returns (Page) — the decorative --apricot horizon glow (CSS ::before, never apricot text)
     behind a big Marcellus --kiswah returns count; AW.weekCal() days are lighter-ink presence dots
     that NEVER show a gap/red/miss (RWD-02). The count then the week settle in, staggered. */
  async function rewardReturns() {
    setGround('reg-page');
    var ret = AW.S.get('returns', 0);
    var days = AW.weekCal().map(function (d) {
      return '<span class="day' + (d.on ? ' here' : '') + '" aria-hidden="true"></span>';
    }).join('');
    root.innerHTML =
      '<div class="rw-returns">' +
      '<div class="num" style="opacity:0" tabindex="-1">' + ret + '</div>' +
      '<div class="rlabel">' + (ret === 1 ? 'day you came back' : 'days you came back') + '</div>' +
      '<p>Not a score to protect. Proof that you keep returning — and that is the whole point of this place.</p>' +
      '<div class="weekcal" style="opacity:0">' + days + '</div>' +
      '</div>' +
      foot(btn('Keep it gentle'));
    document.getElementById('cont').addEventListener('click', done);
    focusHeading('.rw-returns .num');   // land on the returns count (this screen's first content); SR then reads the label + line naturally
    AW.animate(root.querySelector('.rw-returns .num'),
      [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], '--dur-settle', '--ease');
    await delay(60);
    await AW.animate(root.querySelector('.weekcal'),
      [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], '--dur-settle', '--ease').finished;
  }

  /* 4 · Done (Page) — best-of star persist (never downgrade); recap + the onward "Continue" into the
     Ring. The path handoff itself moves to the du'a terminal (steps 5–6 must render before nav). */
  function done() {
    setGround('reg-page');
    var st = AW.S.get('stars', {}), prev = st[cfg.id] || 0, now = AW.lessonStars(mistakes);
    if (now > prev) { st[cfg.id] = now; AW.S.set('stars', st); }   // best-of only — never downgrade
    var rec = (cfg.recap || []).map(function (r) {
      return '<li>' + AW.icon('check') + '<span>' + r + '</span></li>';
    }).join('');
    root.innerHTML =
      '<div class="rw-done">' + sceneIco('crescent') +
      '<h1 class="rw-word" tabindex="-1">' + (cfg.doneTitle || 'Carried a little further') + '</h1>' +
      (cfg.doneLine ? '<p>' + cfg.doneLine + '</p>' : '') +
      (rec ? '<ul class="recl">' + rec + '</ul>' : '') +
      '</div>' +
      foot(btn('Continue'));
    document.getElementById('cont').addEventListener('click', ringMoment);
    focusHeading('.rw-word');   // land on the done screen's heading after the swap
  }

  /* 5 · The Ring moment (Orbit) — the terminal tawaf-fingerprint. postAtoms is recomputed HERE,
     AFTER done() persisted this lesson's best-of star (Pitfall 7 / WR-01), via AW.atomsDone(AW.state())
     (D-57/R-1 — the exact taught-atom frontier, never a *3 proxy): on a genuine first
     completion the star KEY was newly added, so postAtoms > preLessonAtoms and AW.ringSVG inks ONLY
     the new frontier [preLessonAtoms, postAtoms); on a replay the key already existed at init, so
     postAtoms === preLessonAtoms, the span is empty, and the established Ring renders static — no
     phantom celebration. Reduced motion → final inked state, static (handled inside AW.ringSVG).
     Crimson is banned on Orbit — the ring's accents are gold/ember only. */
  function ringMoment() {
    setGround('reg-orbit');
    setHUD(false);
    progEl.innerHTML = '';
    var postAtoms = AW.atomsDone(AW.state());
    var grew = postAtoms > preLessonAtoms;
    root.innerHTML = '<div class="rw-ring"></div>' + foot(btn('Continue'));
    root.querySelector('.rw-ring').innerHTML =
      AW.ringSVG({ atomsDone: postAtoms, animateFrom: preLessonAtoms }) +
      '<p class="rcap" tabindex="-1">' + (grew ? 'A new mark, inked into your ring.' : 'Your ring, as it stands.') + '</p>';
    document.getElementById('cont').addEventListener('click', duaClose);
    focusHeading('.rcap');   // land on the ring caption (the ring SVG itself is aria-hidden ink) after the swap
  }

  /* 6 · The du'a close (Sky) — the terminal moment on the Last-Third night ground. The du'a renders
     in Amiri under scripture law (lang="ar" dir="rtl"; the permitted glow lives on this dark ground)
     ONLY when the cfg carries one — a du'a is religious content: it is Josh's asset, never generated
     or retyped here (splice-not-retype law; CLAUDE.md content integrity). The reverent close line
     "Alhamdulillah — continue." always renders, with the onward path handoff. NO celebration
     primitive (.dab/.thread/.plate/.rosette) is authored in this block (grep-gated, D-51). */
  function duaClose() {
    setGround('reg-sky-night');
    setHUD(false);
    progEl.innerHTML = '';
    /* G3 — a per-lesson cfg.dua overrides entirely; absent one, AW._duaBlock renders the engine-level
       default du'a (class-b, Ibn Ḥibbān 974 · Sahih, pending review) + its quiet translation line. */
    var duaBlock = AW._duaBlock(cfg.dua);
    var nextBtn = cfg.next ? '<a class="btn" href="' + cfg.next.href + '">Next: ' + cfg.next.label + '</a>' : '';
    root.innerHTML =
      '<div class="rw-dua">' +
      duaBlock +
      '<p class="close" tabindex="-1">Alhamdulillah — continue.</p>' +
      '</div>' +
      foot(nextBtn + '<a class="ls-back" href="../learn.html">Back to the path</a>');
    focusHeading('.close[tabindex="-1"]');   // land on the reverent close line — NEVER the scripture .close (Arabic, its own reverent frame)
  }

  render(); // pos = -1 → opener
}

/* ============================================================================================
   AwbaReview(cfg) — the legendary review runner (ENG-02/ENG-04, CNT-01, RWD-03, MOT-05).
   cfg = { id, title, sub, mastery, items:[{q,quote?,o,c,t} | {tf:true,q,c,t}], next:{href,label} }
   — Josh's Gen-3 cfg shape consumed byte-unchanged (item `t` is the explanation text; a naming
   collision with the lesson beat `t` in a different context, no code conflict).

   MECHANICS BYTE-PRESERVED from Gen-3 AwbaReview (startTimer/timeUp/advance/circleBackOffer/
   renderQ/bind/result): the 14s soft timer (tleft = AW.QTIME*10 deciseconds, 100ms tick, .low
   under 28%), a single timeout permanently kills allInTime and parks the question in `skipped`
   (options disabled, 1500ms auto-skip, no penalty), queue-exhausted-with-skipped in the main
   phase offers the circle-back (phase='back', queue=skipped.slice(), untimed, NO noor — but a
   named answer still lights its thread), and the numbers come ONLY from the 04-01 pure helpers:
   AW.reviewScore(thisInTime) = 15+swift5 per main-phase correct, AW.reviewStars(correct, total,
   allInTime) = 3 all-in-time / 2 any-timeout / 1 partial (never 0). Noor persists ONCE at result
   (AW._noorClaimer, T-04-05a); best-of stars never downgrade; AW.touchDay() fires on "Begin the
   review". NO back button anywhere (awback hidden).

   EXPRESSION RE-VOICED per D-45/§S5: the WHOLE session lives on the Orbit register (.reg-orbit,
   Kiswah Black + Hajar Gold — the retired Gen-3 gold ground class and big intro art are gone);
   the intro is "the circle gathers" (.dab drift-in ring + a gold trophy glyph); the lamp row is
   re-voiced to gold .thread arcs lit i<correct; the .low timer state is a QUIET ember deepen
   (never red, never a buzzer, no shake); mastery is sealed by the shipped gold .rosette, stamped
   via AW.animate('--dur-stamp'). AW.sound cues land on meta moments only (§S6); the shared 44px
   mute toggle sits in the review HUD. Crimson never appears on this register.
   ============================================================================================ */
function AwbaReview(cfg) {
  if (typeof document === 'undefined') return; // headless load (tests) — the runner is DOM-driven
  cfg = cfg || {};
  var CH = cfg.items || [];

  /* Gen-3 state vars, byte-preserved (339-354). */
  var qi = 0, noorEarned = 0, correct = 0, allInTime = true, answered = false, timer = null,
    tleft = 0, thisInTime = true;
  var queue = CH.map(function (_, i) { return i; }), skipped = [], phase = 'main';
  var claimNoor = AW._noorClaimer();   // noor persists exactly once at result (T-04-05a)

  /* No back button, ever (Gen-3 348) — the review has no back affordance on any screen. */
  var rb = document.getElementById('awback'); if (rb) rb.style.display = 'none';

  /* Athar skeleton — the whole session on the Orbit ground (never the retired Gen-3 shell). */
  document.body.innerHTML =
    '<main class="reg-orbit rv-shell">' +
    '<div class="ls-hud" id="rvhud"></div>' +
    '<div class="rv-timerwrap" id="rvtimerwrap">' +
    '<div class="rv-timer" id="rvtbar"><div class="rv-timer-fill" id="rvtfill"></div></div>' +
    '<div class="rv-tnote" id="rvtnote"></div>' +
    '</div>' +
    '<div class="rv-thread" id="rvthread"></div>' +
    '<div id="root"></div>' +
    '</main>';
  var root = document.getElementById('root');
  var hudEl = document.getElementById('rvhud');
  var shellEl = document.querySelector('.rv-shell');
  var timerwrap = document.getElementById('rvtimerwrap');
  var tbar = document.getElementById('rvtbar');
  var tfill = document.getElementById('rvtfill');
  var tnote = document.getElementById('rvtnote');
  var threadEl = document.getElementById('rvthread');

  /* the thread progress row — one arc per question (the retired lamp row, re-voiced): lit arcs
     get the SHIPPED .thread (gold, Orbit draw verb); unlit rest navy-faint (@layer screens). */
  threadEl.innerHTML = CH.map(function () {
    return '<svg class="rv-arc" viewBox="0 0 28 12" aria-hidden="true" focusable="false"><path d="M2 10 Q14 -2 26 10"/></svg>';
  }).join('');
  function paintThread() {
    Array.prototype.forEach.call(threadEl.children, function (arcEl, i) {
      var p = arcEl.firstChild;
      if (p) p.classList.toggle('thread', i < correct);   // toggle(force) never re-adds — no draw replay
    });
  }

  function setHUD(showStats) {
    hudEl.innerHTML = (showStats
      ? '<span class="ls-stats">' +
        '<span class="hstat">' + AW.icon('spark') + '<span>' + (AW.S.get('noor', 0) + noorEarned) + '</span></span>' +
        '<span class="hstat">' + AW.icon('flame') + '<span>' + AW.S.get('returns', 0) + '</span></span>' +
        '</span>'
      : '<span class="ls-stats"></span>') + muteBtnHtml();
    bindMuteBtn(function () { setHUD(showStats); });
  }

  function foot(inner, cls) { return '<div class="foot ' + (cls || '') + '" id="footwrap">' + inner + '</div>'; }
  function btn(label, cls, id) { return '<button class="btn ' + (cls || '') + '" id="' + (id || 'cont') + '" type="button">' + label + '</button>'; }

  /* startTimer — Gen-3 364, byte-preserved via AW.QTIME: 140 deciseconds, a 100ms tick, the bar
     width in %, .low under 28% (the quiet ember deepen — expression only, the numbers untouched);
     tleft<=0 permanently kills allInTime and hands over to timeUp. */
  function startTimer() {
    tleft = AW.QTIME * 10; thisInTime = true; tbar.classList.remove('low'); tnote.textContent = ''; tfill.style.width = '100%';
    clearInterval(timer);
    timer = setInterval(function () {
      tleft--; var pct = Math.max(0, tleft / (AW.QTIME * 10)) * 100; tfill.style.width = pct + '%';
      if (pct < 28) tbar.classList.add('low');
      if (tleft === 100) AW.announce('10 seconds');   // ONE soft warning at 10s left (tleft is monotonic → free single-fire); the 100ms tick itself is NEVER announced (Pitfall 3, ENG-04 byte-preserved)
      if (tleft <= 0) { clearInterval(timer); thisInTime = false; allInTime = false; timeUp(); }
    }, 100);
  }

  /* timeUp — Gen-3 371: park the question for the end, disable the options, note the mercy,
     auto-skip after 1500ms. No penalty — nothing is ever failed or lost. */
  function timeUp() {
    if (answered) return; answered = true;
    skipped.push(queue[qi]);
    tnote.textContent = 'time — it will wait at the end';
    root.querySelectorAll('.opt,.tf').forEach(function (x) { x.style.pointerEvents = 'none'; x.style.borderWidth = ''; x.style.transform = ''; x.disabled = true; });   // the parked question's options leave the tab order too (real disabled — Pitfall 4)
    var fw = document.getElementById('footwrap');
    fw.className = 'foot rv-timeout';
    fw.innerHTML = '<h2 class="pintro">Time — this one will wait at the end</h2>' +
      '<p class="opt-why">Nothing lost. It comes back after the run, untimed.</p>';
    AW.announce('Time — this one will wait at the end. Nothing lost. It comes back after the run, untimed.');   // narrate the mercy into the region — the visible #footwrap alone is silent to a SR
    setTimeout(advance, 1500);   // the 1500ms auto-skip is byte-preserved (ENG-04) — narrated only at the announcement layer (renderQ), never paused/extended
  }

  /* advance — Gen-3 382: queue exhausted in the main phase with skipped questions → the
     circle-back offer; otherwise the result. */
  function advance() {
    qi++;
    if (qi < queue.length) { renderQ(); return; }
    if (phase === 'main' && skipped.length) { circleBackOffer(); return; }
    result();
  }

  /* circleBackOffer — Gen-3 388: an untimed replay of what the timer took ("no noor this time,
     but a named answer still lights its thread") or straight to the result. */
  function circleBackOffer() {
    clearInterval(timer); timerwrap.classList.remove('on'); threadEl.style.display = 'none';
    var old = document.getElementById('footwrap'); if (old) old.remove();
    var n = skipped.length;
    root.innerHTML = '<div class="rv-intro">' +
      '<div class="kicker">Almost there</div>' +
      '<div class="rv-glyph" style="position:static">' + AW.icon('lamp', { size: '44px' }) + '</div>' +
      '<h2 class="rv-title">' + n + (n === 1 ? ' question' : ' questions') + ' waited for you</h2>' +
      '<p>The timer beat you to ' + (n === 1 ? 'this one' : 'these') + '. Answer ' + (n === 1 ? 'it' : 'them') + ' untimed if you like — no noor this time, but a named answer still lights its thread.</p>' +
      '</div>' +
      foot(btn('Circle back', '', 'goback') + btn('See your result', 'ghost', 'skipres'));
    document.getElementById('goback').addEventListener('click', function () {
      phase = 'back'; queue = skipped.slice(); skipped = []; qi = 0; threadEl.style.display = ''; renderQ();
    });
    document.getElementById('skipres').addEventListener('click', result);
  }

  /* intro — "the circle gathers" (§S5): ink dabs drift in around the ring (Circle drift verb,
     staggered delays), the trophy glyph holds the centre in gold, and "Begin the review" fires
     AW.touchDay() (Gen-3 407). */
  function intro() {
    setHUD(false); timerwrap.classList.remove('on'); threadEl.style.display = 'none';
    var old = document.getElementById('footwrap'); if (old) old.remove();
    var dabs = '';
    for (var i = 0; i < 6; i++) {
      dabs += '<span class="dab" style="--dx:' + (i % 2 ? 9 : -9) + 'px;--dy:' + (i % 3 ? -7 : 6) + 'px;animation-delay:' + (i * 60) + 'ms"></span>';
    }
    root.innerHTML = '<div class="rv-intro">' +
      '<div class="kicker">The circle gathers</div>' +
      '<div class="rv-ringdabs" aria-hidden="true">' + dabs + '<span class="rv-glyph">' + AW.icon('trophy', { size: '44px' }) + '</span></div>' +
      '<h1 class="rv-title">' + (cfg.title || '') + '</h1>' +
      '<p>' + (cfg.sub || '') + '</p>' +
      '<p class="rv-soft">The timer is real here: run out and the question skips past you, waiting at the end — answerable untimed, but for no noor. Nothing is ever failed or lost.</p>' +
      '</div>' +
      foot(btn('Begin the review', '', 'start') + '<a class="btn ghost" href="../learn.html">Maybe later</a>');
    document.getElementById('start').addEventListener('click', function () {
      AW.touchDay();
      setHUD(true); threadEl.style.display = '';
      qi = 0; renderQ();
    });
  }

  /* renderQ — Gen-3 410: the question surface; the main phase re-arms the timer, the circle-back
     phase runs untimed (thisInTime=false so a swift bonus can never leak in). */
  function renderQ() {
    var it = CH[queue[qi]]; answered = false; paintThread();
    var old = document.getElementById('footwrap'); if (old) old.remove();
    var kickTail = ' · ' + (qi + 1) + ' of ' + queue.length;
    var body;
    if (it.tf) {
      body = '<div class="kicker">' + (phase === 'back' ? 'Circling back' : 'True or false') + kickTail + '</div>' +
        '<h2 class="rv-q">' + it.q + '</h2>' +
        '<div class="tfrow"><button class="tf" type="button" data-v="true">True</button><button class="tf" type="button" data-v="false">False</button></div>';
    } else {
      var opts = it.o.map(function (o, i) { return '<button class="opt" type="button" data-i="' + i + '">' + o + '</button>'; }).join('');
      body = '<div class="kicker">' + (phase === 'back' ? 'Circling back' : (it.quote ? 'Name it' : 'Mastery')) + kickTail + '</div>' +
        '<h2 class="rv-q">' + it.q + '</h2>' +
        (it.quote ? '<p class="rv-quote">“' + it.quote + '”</p>' : '') +
        '<div class="opts">' + opts + '</div>';
    }
    root.innerHTML = '<div class="rv-stage">' + body + '</div>';
    shellEl.insertAdjacentHTML('beforeend', '<div class="foot" id="footwrap">' + btn('Check', 'disabled', 'check') + '</div>');
    bind(it);
    if (phase === 'main') { timerwrap.classList.add('on'); startTimer(); }
    else { clearInterval(timer); timerwrap.classList.remove('on'); thisInTime = false; }
    AW.announce('Question ' + (qi + 1) + ' of ' + queue.length);   // narrate every question swap — the 1500ms auto-skip and the circle-back are otherwise silent screen changes (Pitfall 3, timer untouched)
  }

  /* bind — Gen-3 426: selection (gold cue on this register), then Check resolves. A main-phase
     correct earns AW.reviewScore(thisInTime) — 20 in time ("swift") / 15 not; the circle-back
     phase lights the thread only, no noor. Wrongness stays law 8: "Nothing lost". */
  function bind(it) {
    var sel = it.tf ? '.tf' : '.opt';
    var nodes = root.querySelectorAll(sel), chosen = null;
    var check = document.getElementById('check');
    check.disabled = true;   // ACC-01/Pitfall 4: the class-only 'disabled' Check gets a real disabled attribute until an option is chosen
    nodes.forEach(function (n) {
      n.addEventListener('click', function () {
        if (answered) return;
        nodes.forEach(function (x) { x.style.borderColor = ''; x.style.borderWidth = ''; x.style.transform = ''; x.setAttribute('aria-pressed', 'false'); });   // clear the prior selection cue on re-selection
        n.style.borderColor = 'var(--gold)';           // selection cue — gold on Orbit, never crimson
        n.style.borderWidth = '3px';                    // ACC-03 non-colour channel: 2→3px "thicker" (box-sizing:border-box → no reflow), zero new hex
        n.style.transform = 'translateY(1px)';          // ACC-03 "pushed in": the shipped paper-press held static (law 9, no new keyframe — rides the existing --dur-press transition)
        n.setAttribute('aria-pressed', 'true');         // ACC-03/R-11: the non-colour selection state a SR + a colourblind eye can read (WCAG 1.4.1)
        chosen = it.tf ? (n.dataset.v === 'true') : +n.dataset.i;
        check.classList.remove('disabled'); check.disabled = false;   // an option is chosen — the Check is now a live control
      });
    });
    check.addEventListener('click', function () {
      if (answered) return; if (chosen === null) return; answered = true; clearInterval(timer);
      var ok = chosen === it.c;
      nodes.forEach(function (x) { x.style.pointerEvents = 'none'; x.style.borderColor = ''; x.style.borderWidth = ''; x.style.transform = ''; x.disabled = true; });   // resolved options leave the tab order (real disabled — Pitfall 4); the selection cue clears for the verdict styling
      if (it.tf) {
        nodes.forEach(function (x) { if ((x.dataset.v === 'true') === it.c) x.classList.add('correct'); });
        if (!ok) nodes.forEach(function (x) { if (x.dataset.v === String(chosen)) x.classList.add('wrong'); });
      } else {
        nodes[it.c].classList.add('correct');          // the gold dot draws on the named answer
        if (!ok) nodes[chosen].classList.add('wrong'); // law-8 grey ink-blot on the miss
      }
      if (ok) { correct++; if (phase === 'main') noorEarned += AW.reviewScore(thisInTime); paintThread(); }
      setHUD(true);
      if (ok) AW.sound('correct'); else AW.sound('incorrect');   // meta moment, never scripture
      var word = ok ? (phase === 'back' ? 'Named — thread lit' : (thisInTime ? 'Swift and sound' : 'That’s it')) : 'Nothing lost';
      var noorSay = (ok && phase === 'main') ? ' +' + AW.reviewScore(thisInTime) + ' noor' : '';   // swift-noor only when this main-phase answer actually earned it (same gate as the visible meta)
      var swift = ok && phase === 'main'
        ? '<div class="meta"><span class="ls-count">' + AW.icon('spark', { size: '16px' }) + ' +' + AW.reviewScore(thisInTime) + (thisInTime ? ' swift' : '') + '</span></div>'
        : '';
      var fw = document.getElementById('footwrap');
      fw.className = 'foot ' + (ok ? 'rv-good' : '');
      fw.innerHTML =
        '<h2 class="pintro">' + word + '</h2>' +
        swift +
        '<p class="opt-why">' + it.t + '</p>' +
        btn(qi < queue.length - 1 || (phase === 'main' && skipped.length) ? 'Next' : 'See your result', '', 'next');
      document.getElementById('next').addEventListener('click', advance);
      AW.announce(word + '.' + noorSay);   // ONE composed answer line: the SAME verdict word the foot shows + the swift-noor if earned (reuses AW.reviewScore — no number change)
    });
  }

  /* result — Gen-3 447: stars via AW.reviewStars (a single timeout permanently caps at 2), the
     verdict word, noor persisted ONCE (claimNoor), best-of star persist, and the mastery sealed
     by the SHIPPED gold .rosette stamped via AW.animate('--dur-stamp','--ease'). */
  function result() {
    clearInterval(timer); timerwrap.classList.remove('on'); threadEl.style.display = 'none'; setHUD(false);
    var old = document.getElementById('footwrap'); if (old) old.remove();
    claimNoor(noorEarned);                             // the ONE persistence point (T-04-05a)
    AW.sound('complete');                              // the meta peak — never on scripture
    var stars = AW.reviewStars(correct, CH.length, allInTime);
    var st = AW.S.get('stars', {});
    if (stars > (st[cfg.id] || 0)) { st[cfg.id] = stars; AW.S.set('stars', st); }   // best-of only
    var sH = '';
    for (var i = 0; i < 3; i++) {
      var on = i < stars;
      sH += '<span class="dab" data-state="' + (on ? 'mastered' : 'not-yet') + '" style="--dx:' + (i % 2 ? 7 : -7) + 'px;--dy:-6px">' + (on ? AW.icon('check') : '') + '</span>';
    }
    var verdict = stars === 3 ? 'Legendary' : (stars === 2 ? 'Mastered' : 'Reviewed');
    var nextBtn = cfg.next ? ('<a class="btn" href="' + cfg.next.href + '">' + cfg.next.label + '</a>') : '';
    root.innerHTML = '<div class="rv-result">' +
      '<div class="kicker">Review complete</div>' +
      '<div class="rv-seal"><span class="rosette">' + AW.icon('check') + '</span></div>' +
      '<div class="rw-stars">' + sH + '</div>' +
      '<h1 class="rv-title" tabindex="-1">' + verdict + '</h1>' +
      '<p>' + correct + ' of ' + CH.length + ' named' + (allInTime && correct === CH.length ? ', every one in time' : '') + '.</p>' +
      '<div class="rv-mastery"><div class="kicker">What you can do now</div><p>' + (cfg.mastery || '') + '</p></div>' +
      '<div class="rv-noorline">' + AW.icon('spark') + ' <span>+' + noorEarned + ' noor gathered</span></div>' +
      '</div>' +
      foot(nextBtn + '<a class="btn ghost" href="../learn.html">Back to the path</a>');
    var seal = root.querySelector('.rv-seal');
    if (seal) AW.animate(seal,
      [{ transform: 'scale(1.03)', opacity: 0 }, { opacity: 1, offset: 0.6 }, { transform: 'scale(1)', opacity: 1 }],
      '--dur-stamp', '--ease');
    var rvt = root.querySelector('.rv-title'); if (rvt) rvt.focus();   // R-10: land focus on the result heading after the swap
    AW.announce(verdict + '. ' + correct + ' of ' + CH.length + ' named. +' + noorEarned + ' noor gathered.');   // announce the result stat once: verdict word + N of M + noor total (D-64)
  }

  intro();
}

/* ============================================================================================
   AW.practiceRun(mountEl, items, opts) — the practice mini-runner (Wave-A seam S4 · §B.8).
   --------------------------------------------------------------------------------------------
   A calm re-walk of quiz beats the learner has already finished. It re-authors ONLY the quiz
   interaction (never reuses AwbaLesson/AwbaReview, which write stars/noor/touchDay + fire the full
   reward choreography), rendering each mc/tf/tile item with the SHIPPED .opt/.tf/.tile markup (via
   AW._beatHtml) and the SHIPPED resolve verdicts — .opt.correct gold dot / .opt.wrong grey ink-blot
   (law 8, never red / flash / shake) / .opt-why / a --rose .btn.retry — mirroring bindChoice/bindTile
   EXACTLY. It shares the single module-level PRAISE with the lesson runner.

   IT WRITES NOTHING: no noor, no stars, no returns, no touchDay, no du'a, no Ring, no Festival, no
   document.body wipe — it renders ONLY into mountEl (100% read-only, §B.3). A wrong answer costs
   nothing and offers "Try again" (re-attempt the SAME item — practice protects nothing). `correct`
   counts the items answered right on the FIRST attempt ("came right away", §B.6): because every item
   must eventually be answered correctly to advance, counting every correct resolve would always sum
   to `total`, so first-attempt tracking is what makes the completion count meaningful. On the last
   item it calls opts.onDone({correct, total}). opts.refs/opts.terms → AW.wire binds .cite/.term taps
   to the shipped sheets (the pending pill rides in). No new glyph, no authored scripture, no new
   storage-API literal — every frozen count holds.
   ============================================================================================ */
AW.practiceRun = function (mountEl, items, opts) {
  if (typeof document === 'undefined' || !mountEl) return; // DOM-driven; headless load is a no-op
  items = items || [];
  opts = opts || {};
  var total = items.length;
  var i = 0, correct = 0, answered = false, firstAttempt = true;

  function foot(inner) { return '<div class="foot" id="prfoot">' + inner + '</div>'; }
  function btn(label, cls, id) {
    return '<button class="btn ' + (cls || '') + '" id="' + (id || 'prcont') + '" type="button">' + label + '</button>';
  }
  /* focusHeading — land focus on the item's .pintro (its question, tabindex=-1 so it doesn't
     evaporate on the innerHTML swap; the [tabindex="-1"]:focus-visible ring-suppression is shipped). */
  function focusHeading() { var h = mountEl.querySelector('.pintro'); if (h) { h.setAttribute('tabindex', '-1'); h.focus(); } }

  /* paint the current item (fresh advance OR a retry re-attempt): the SHIPPED beat markup + a
     real-disabled Check (the ACC-01 pattern — no pick, no live control). */
  function paint() {
    answered = false;
    var it = items[i];
    mountEl.innerHTML =
      '<p class="se-prog">Question ' + (i + 1) + ' of ' + total + '</p>' +
      '<div class="stage">' + AW._beatHtml(it, {}) + '</div>' +
      foot(btn('Check', 'disabled', 'prcheck'));
    if (opts.refs || opts.terms) AW.wire(mountEl, { refs: opts.refs || {}, terms: opts.terms || {} });
    if (it.t === 'tile') bindTile(it); else bindChoice(it);
    focusHeading();
  }

  function advance() {
    i++;
    if (i >= total) { if (typeof opts.onDone === 'function') opts.onDone({ correct: correct, total: total }); return; }
    firstAttempt = true;
    paint();
  }

  /* resolve — mirrors the shipped bindChoice/bindTile resolve, MINUS every write. Correct → the
     SHIPPED gold-dot verdict + single-source PRAISE + AW.sound('correct') + AW.announce('Correct.')
     + Continue. Wrong → the SHIPPED grey ink-blot (law 8) + the "Nothing lost" explain line +
     AW.sound('incorrect') + AW.announce + a --rose .btn.retry that re-attempts the SAME item. */
  function resolve(ok, it) {
    var fw = mountEl.querySelector('#prfoot');
    if (ok) {
      if (firstAttempt) correct++;                       // §B.6 — "came right away" = first-attempt only
      var title = PRAISE[correct % PRAISE.length];       // single-source PRAISE, shared with the lesson runner
      fw.innerHTML =
        '<h2 class="pintro">' + title + '</h2>' +
        '<p>' + (it.good || '') + '</p>' +
        btn('Continue');
      AW.sound('correct');
      AW.announce('Correct.');
      mountEl.querySelector('#prcont').addEventListener('click', advance);
    } else {
      firstAttempt = false;                              // a later retry-correct is no longer "right away"
      fw.innerHTML =
        '<h2 class="pintro">Nothing lost</h2>' +
        '<p class="opt-why">' + (it.gentle || '') + '</p>' +
        btn('Try again', 'retry');
      AW.sound('incorrect');
      AW.announce('Not quite — nothing lost. Look again.');
      mountEl.querySelector('#prcont').addEventListener('click', paint);   // clear marks + re-enable via a fresh render of the same item
    }
  }

  /* bindChoice — mc/tf selection + resolve, byte-mirrored from the lesson runner (crimson selection
     cue + 3px "thicker" + aria-pressed non-colour channel; real disabled Check). No score writes. */
  function bindChoice(it) {
    var sel = it.t === 'mc' ? '.opt' : '.tf';
    var nodes = mountEl.querySelectorAll(sel), chosen = null;
    var check = mountEl.querySelector('#prcheck');
    check.disabled = true;
    nodes.forEach(function (n) {
      n.addEventListener('click', function () {
        if (answered) return;
        nodes.forEach(function (x) { x.style.borderColor = ''; x.style.borderWidth = ''; x.style.transform = ''; x.setAttribute('aria-pressed', 'false'); });
        n.style.borderColor = 'var(--crimson)';
        n.style.borderWidth = '3px';
        n.style.transform = 'translateY(1px)';
        n.setAttribute('aria-pressed', 'true');
        chosen = it.t === 'mc' ? +n.dataset.i : (n.dataset.v === 'true');
        check.classList.remove('disabled'); check.disabled = false;
      });
    });
    check.addEventListener('click', function () {
      if (answered || chosen === null) return;
      answered = true;
      var ok = chosen === it.c;
      nodes.forEach(function (x) { x.style.pointerEvents = 'none'; x.style.borderColor = ''; x.style.borderWidth = ''; x.style.transform = ''; x.disabled = true; });
      if (it.t === 'mc') {
        nodes[it.c].classList.add('correct');            // gold dot draws on the answer
        if (!ok) nodes[chosen].classList.add('wrong');   // law-8 grey ink-blot on the miss
      } else {
        nodes.forEach(function (x) { if ((x.dataset.v === 'true') === it.c) x.classList.add('correct'); });
        if (!ok) nodes.forEach(function (x) { if (x.dataset.v === String(chosen)) x.classList.add('wrong'); });
      }
      resolve(ok, it);
    });
  }

  /* bindTile — word-bank assembly + resolve, byte-mirrored from the lesson runner (scoped to
     mountEl). Correct order (JSON deep-equal to it.solution) → resolve(true). No score writes. */
  function bindTile(it) {
    var box = mountEl.querySelector('#lstilebox'), bankEl = mountEl.querySelector('#lsbank'),
      check = mountEl.querySelector('#prcheck');
    var placed = [];
    check.disabled = true;
    function refresh() { var empty = placed.length === 0; check.classList.toggle('disabled', empty); check.disabled = empty; }
    bankEl.querySelectorAll('.tile').forEach(function (t) {
      t.addEventListener('click', function () {
        if (answered || t.classList.contains('used')) return;
        t.classList.add('used'); t.style.opacity = '.35'; t.style.pointerEvents = 'none';
        var bt = document.createElement('button'); bt.className = 'tile'; bt.type = 'button'; bt.textContent = t.textContent;
        bt.setAttribute('aria-pressed', 'true');
        bt.style.borderWidth = '3px';
        bt.style.transform = 'translateY(1px)';
        bt.addEventListener('click', function () {
          if (answered) return;
          bt.remove(); t.classList.remove('used'); t.style.opacity = ''; t.style.pointerEvents = '';
          placed = placed.filter(function (x) { return x !== bt; });
          refresh();
        });
        box.appendChild(bt); placed.push(bt); refresh();
      });
    });
    check.addEventListener('click', function () {
      if (answered || placed.length === 0) return;
      answered = true;
      var built = placed.map(function (b) { return b.textContent; });
      var ok = JSON.stringify(built) === JSON.stringify(it.solution);
      box.querySelectorAll('.tile').forEach(function (b) { b.style.pointerEvents = 'none'; b.style.transform = ''; b.style.borderColor = ok ? 'var(--gold)' : 'var(--rule)'; b.disabled = true; });
      bankEl.querySelectorAll('.tile').forEach(function (b) { b.style.pointerEvents = 'none'; b.disabled = true; });
      resolve(ok, it);
    });
  }

  if (!total) { if (typeof opts.onDone === 'function') opts.onDone({ correct: 0, total: 0 }); return; }
  paint();
};
