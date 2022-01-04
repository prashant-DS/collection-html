//  service worker file should be at root level to capture fetch of all the pages

const CACHE_NAME = "v1";

// call install event
self.addEventListener("install", (e) => {
  console.log("Service Worker: Installed");
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
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) return res;
      return fetch(e.request).then((response) => {
        // The promise does not reject on HTTP errors — it only rejects on network errors
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseClone);
        });
        return response;
      });
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
