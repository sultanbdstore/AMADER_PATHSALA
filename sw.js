/* Amader Pathshala service worker
   Works when deployed in the repository subfolder, e.g. /AMADER_PATHSALA/ */
const CACHE_NAME = "amader-pathshala-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon.png"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle this app's own origin and GET requests.
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // For page navigation, try the network first and fall back to the cached app.
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put("./index.html", response.clone());
        }
        return response;
      } catch (error) {
        return (await caches.match(request)) ||
               (await caches.match("./index.html")) ||
               new Response("অফলাইন: ইন্টারনেট সংযোগ নেই।", {
                 status: 503,
                 headers: { "Content-Type": "text/plain; charset=utf-8" }
               });
      }
    })());
    return;
  }

  // Cache-first for the app shell and same-origin assets.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      return new Response("", { status: 504, statusText: "Offline" });
    }
  })());
});
