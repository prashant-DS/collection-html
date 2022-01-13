// service worker update flow
function invokeServiceWorkerUpdateFlow(registration) {
  const consent = confirm(
    "A newer version of this web page is available, Refresh Now"
  );
  if (consent && registration.waiting) {
    registration.waiting.postMessage("SKIP_WAITING");
  }
}

// checking support
if ("serviceWorker" in navigator) {
  console.log("Service Worker: Supported");
  // registering service worker
  window.addEventListener("load", async () => {
    try {
      // registering
      const registration = await navigator.serviceWorker
        // .register("../sw_cached_pages.js")
        .register("../sw_cached_site.js");
      console.log("Service Worker: Registered");

      // missed update
      if (registration.waiting) {
        invokeServiceWorkerUpdateFlow(registration);
      }

      // new update
      registration.addEventListener("updatefound", () => {
        if (registration.installing) {
          // wait until the new Service worker is actually installed (ready to take over)
          registration.installing.addEventListener("statechange", () => {
            if (registration.waiting) {
              // if there's an existing controller (previous Service Worker), show the prompt
              if (navigator.serviceWorker.controller) {
                invokeServiceWorkerUpdateFlow(registration);
              } else {
                // otherwise it's the first install, nothing to do
                console.log("Service Worker initialized for the first time");
              }
            }
          });
        }
      });

      // refreshing pages
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          window.location.reload();
          refreshing = true;
        }
      });
    } catch (err) {
      console.log(`Service Worker: Error: ${err}`);
    }
  });
}

const RegisterNewSync = async () => {
  if ("SyncManager" in window) {
    console.log("BackgroundSync : Supported");
  }
  try {
    // registering background sync
    const swRegistration = await navigator.serviceWorker.ready;
    const permission = await Notification.requestPermission();
    swRegistration.sync.register("uploadDataSync");
  } catch (err) {
    console.log(`BackgroundSync: Error: ${err}`);
  }
};

let db = undefined;

const addInObjectStore = (data, callback) => {
  if (db) {
    let transaction = db.transaction("namesStore", "readwrite");
    transaction.oncomplete = function (event) {
      console.log(`${data} added to db`);
      callback();
    };
    transaction.onerror = function (event) {
      console.log(`Error Adding ${data} to db`);
    };
    transaction.objectStore("namesStore").add(data);
  }
};

const addInIndexedDb = (data, callback) => {
  if (!db) {
    if ("indexedDB" in window) {
      let request = window.indexedDB.open("MyTestDb", 1);
      request.onsuccess = (e) => {
        console.log("indexedDb: Creation Success");
        db = request.result;
        addInObjectStore(data, callback);
      };
      request.onerror = (e) => {
        console.log("indexedDb: Creation Error");
      };
      request.onupgradeneeded = (e) => {
        db = e.target.result;
        const objectStore = db.createObjectStore("namesStore", {
          autoIncrement: true,
        });
        console.log("indexedDb: Creating New Object");
      };
    } else {
      console.log("indexedDb: Not Supported");
    }
  } else {
    addInObjectStore(data, callback);
  }
};

const scheduleUpload = async () => {
  const data = document.querySelector("#name").value;
  if (!data) return;
  addInIndexedDb(data, RegisterNewSync);
};
const uploadDataToServer = () => {};
