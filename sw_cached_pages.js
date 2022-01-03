//  service worker file should be at root level to capture fetch of all the pages

const CACHE_NAME = "v1";
const cacheAssets = ["serviceWorker.html", "/scripts/serviceWorker.js"];

// call install event
self.addEventListener("install", (e) => {
  console.log("Service Worker: Installed");
  // caching files
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching Files");
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// call activate event
self.addEventListener("activate", (e) => {
  console.log("Service Worker: Activated");
  // removing unwanted caches
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`Service Worker: Clearing cache ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// call fetch event
self.addEventListener("fetch", (e) => {
  console.log("Service Worker: Fetching");
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
