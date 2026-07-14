/* ============================================================================================
   sw.js  ·  Awba Gen-4 — the one hand-written root-scoped service worker (D-71/PLT-02)
   --------------------------------------------------------------------------------------------
   Zero dependency, < ~50 lines of logic. Registered (relative path, `location.protocol !== 'file:'`
   guarded) from learn.html + index.html — never registers over file:// (CLAUDE.md).

   install  → precache the app shell into a versioned cache, then skipWaiting.
   activate → clients.claim() + delete every cache key that isn't the current version.
   fetch    → non-GET / cross-origin pass straight through untouched; HTML navigations are
              NETWORK-FIRST (fresh when online, the cached page — then a cached learn.html
              shell — when offline); everything else (CSS/JS/fonts/img/icons) is CACHE-FIRST
              with a network fill-through on miss.

   PRECACHE is generated from the real on-disk file list (relative, no leading slash) so it
   can never drift: the 20 app pages (learn.html + the 15 lessons + the 4 reviews) + the engine
   CSS/JS + the 17 self-hosted fonts + grain.png + the 4 icon PNGs + manifest.webmanifest +
   index.html. preview.html is dev-only and deliberately excluded.
   ============================================================================================ */
'use strict';

var CACHE = 'awba-cache-v1';

var PRECACHE = [
  'learn.html',
  'index.html',
  'manifest.webmanifest',
  'shared/awba-engine.css',
  'shared/awba-engine.js',
  'shared/img/grain.png',
  'lessons/u1-m1.html',
  'lessons/u1-m2.html',
  'lessons/u1-m3.html',
  'lessons/u1-m4.html',
  'lessons/u2-m1.html',
  'lessons/u2-m2.html',
  'lessons/u2-m3.html',
  'lessons/u2-m3b.html',
  'lessons/u3-m1.html',
  'lessons/u3-m2.html',
  'lessons/u3-m3.html',
  'lessons/u4-m1.html',
  'lessons/u4-m2.html',
  'lessons/u4-m2b.html',
  'lessons/u4-m3.html',
  'reviews/u1-review.html',
  'reviews/u2-review.html',
  'reviews/u3-review.html',
  'reviews/u4-review.html',
  'shared/fonts/amiri-400.woff2',
  'shared/fonts/amiri-700.woff2',
  'shared/fonts/amiri-quran-400.woff2',
  'shared/fonts/aref-ruqaa-400.woff2',
  'shared/fonts/aref-ruqaa-700.woff2',
  'shared/fonts/courier-prime-400.woff2',
  'shared/fonts/inter-400.woff2',
  'shared/fonts/inter-500.woff2',
  'shared/fonts/inter-600.woff2',
  'shared/fonts/inter-700.woff2',
  'shared/fonts/marcellus-400.woff2',
  'shared/fonts/rakkas-400.woff2',
  'shared/fonts/readex-pro-300.woff2',
  'shared/fonts/readex-pro-400.woff2',
  'shared/fonts/readex-pro-500.woff2',
  'shared/fonts/readex-pro-600.woff2',
  'shared/fonts/readex-pro-700.woff2',
  'icons/apple-touch-icon-180.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(PRECACHE); }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) {
        return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  var accept = req.headers.get('Accept') || '';
  var isNavigate = req.mode === 'navigate' || accept.indexOf('text/html') !== -1;

  if (isNavigate) {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (cached) {
          return cached || caches.match('learn.html');
        });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function (cached) {
      return cached || fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      });
    })
  );
});
