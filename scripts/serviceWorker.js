// checking support
if ("serviceWorker" in navigator) {
  console.log("Service Worker: Supported");
  // registering service worker
  window.addEventListener("load", () => {
    navigator.serviceWorker
      // .register("../sw_cached_pages.js")
      .register("../sw_cached_site.js")
      .then(() => console.log("Service Worker: Registered"))
      .catch((err) => console.log(`Service Worker: Error: ${err}`));
  });
}
