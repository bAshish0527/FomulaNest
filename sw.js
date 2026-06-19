const CACHE_NAME = "formulanest-cache-v16";
const ASSETS_TO_CACHE = [
  "./",
  "index.html",
  "app.html",
  "dashboard.html",
  "notes.html",
  "style.css?v=73",
  "script.js?v=77",
  "manifest.webmanifest",
  "icons/formulanest-logo.svg",
  "icons/icon-192.svg",
  "icons/icon-512.svg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return key !== CACHE_NAME;
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(function (networkResponse) {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      })
      .catch(function () {
        return caches.match(event.request).then(function (cachedResponse) {
          if (cachedResponse) {
            return cachedResponse;
          }
          return caches.match("index.html");
        });
      })
  );
});
