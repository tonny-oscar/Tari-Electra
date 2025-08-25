// const CACHE_NAME = 'tari-electra-v1';
// const urlsToCache = [
//   '/',
//   '/LOGO_1.png',
//   '/manifest.json',
// ];

// self.addEventListener('install', function(event) {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(function(cache) {
//         return cache.addAll(urlsToCache);
//       })
//   );
// });

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         if (response) {
//           return response;
//         }
//         return fetch(event.request);
//       }
//     )
//   );
// });


const CACHE_NAME = 'tari-electra-v1';
const urlsToCache = [
  '/',
  '/LOGO_1.png',
  '/manifest.json',
];

// Install Service Worker & cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch handler with offline fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // ✅ return cached resource
      }

      return fetch(event.request).catch(() => {
        // ✅ Handle errors (offline, blocked, 404, etc.)
        if (event.request.mode === 'navigate') {
          // React SPA fallback → serve index.html
          return caches.match('/');
        }

        // Generic offline response
        return new Response('You are offline', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' },
        });
      });
    })
  );
});
