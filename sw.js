
const CACHE_NAME = 'jjtravels-site-v2';

const CORE_ASSETS = [
  './',
  './index.html',
  './about.html',
  './vehicles.html',
  './packages.html',
  './contact.html',
  './offline.html',
  './manifest.json',
  './css/style.css',
  './js/script.js',
  './assets/logo.svg',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

// Install service worker and cache essential files.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
    await self.skipWaiting();
  })());
});

// Activate service worker and remove old caches.
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();

    await Promise.all(
      keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
    );

    await self.clients.claim();
  })());
});

// Handle network requests.
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // Pages: network first, cached page as fallback.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);

        if (fresh.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, fresh.clone());
        }

        return fresh;
      } catch (error) {
        return (
          await caches.match(request) ||
          await caches.match('./offline.html')
        );
      }
    })());

    return;
  }

  // Other files: cache first, then network.
  event.respondWith((async () => {
    const cached = await caches.match(request);

    if (cached) return cached;

    try {
      const response = await fetch(request);

      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }

      return response;
    } catch (error) {
      return Response.error();
    }
  })());
});
