//  service worker file should be at root level to capture fetch of all the pages

const CACHE_NAME = "v2";

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
    fetch(e.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(() => caches.match(e.request).then((res) => res))
  );
});
