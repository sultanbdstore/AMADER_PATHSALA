
/* AMADER PATHSALA - Service Worker */
const VERSION = 'pa-v2';

const CORE_FILES = [
  './',
  './index.html',
  './manifest.webmanifest'
];

const OPTIONAL_FILES = [
  './icons/logo-192.png',
  './icons/logo-512.png',
  './icons/apple-touch-icon.png',
  './icons/logo-192-maskable.png',
  './icons/logo-512-maskable.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);

    // Core files are required
    await cache.addAll(CORE_FILES);

    // Icons are optional; a missing icon must not stop installation
    await Promise.allSettled(
      OPTIONAL_FILES.map(file => cache.add(file))
    );

    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();

    await Promise.all(
      keys
        .filter(key => key !== VERSION)
        .map(key => caches.delete(key))
    );

    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin
  ) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(request);

      if (response && response.ok) {
        const cache = await caches.open(VERSION);
        cache.put(request, response.clone());
      }

      return response;
    } catch (error) {
      const cached = await caches.match(request);

      if (cached) return cached;

      if (request.mode === 'navigate') {
        return (
          await caches.match('./index.html')
        ) || new Response('Offline', { status: 503 });
      }

      return new Response('', { status: 504 });
    }
  })());
});

