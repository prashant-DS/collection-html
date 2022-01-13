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

// managing sync
self.addEventListener("sync", (event) => {
  console.log("Sync Called with tag: ", event.tag);
  if (event.tag == "uploadDataSync") {
    event.waitUntil(
      uploadAllNames()
        .then(() => {
          console.log("All NAmes Uploaded");
          if (Notification.permission === "granted")
            self.registration.showNotification("All Names Uploaded");
        })
        .catch(() => {
          console.log("Some or All Names Upload Failed");
          if (Notification.permission === "granted")
            self.registration.showNotification(
              "Some or All Names Upload Failed"
            );
        })
    );
  }
});

// indexed db
const getNamesFromDb = async () => {
  return new Promise((resolve) => {
    let idb;
    let dbRequest = self.indexedDB.open("MyTestDb", 1);
    dbRequest.onsuccess = (e) => {
      idb = dbRequest.result;
      let transaction = idb.transaction("namesStore");
      const valuesRequest = transaction.objectStore("namesStore").getAll();
      transaction.oncomplete = function (event) {
        const results = valuesRequest.result;
        idb
          .transaction("namesStore", "readwrite")
          .objectStore("namesStore")
          .clear();
        resolve(results);
      };
    };
  });
};
const uploadAllNames = async () => {
  const namesArr = await getNamesFromDb();
  return Promise.all(
    namesArr.map((name) => {
      fetch("https://reqres.in/api/users", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })
        .then((res) => {
          console.log(`${name} uploaded to server`);
          console.log("res", res);
        })
        .catch((error) => {
          console.log(`${name} uploaded Error`);
          console.log("error", error);
        });
    })
  );
};
