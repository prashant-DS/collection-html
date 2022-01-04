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
