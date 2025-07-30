// const CACHE_NAME = 'tari-cache-v1';
// const STATIC_ASSETS = [
//   '/',
//   '/index.html',
//   '/favicon.ico',
//   '/manifest.webmanifest',
//   // add more static files as needed
// ];

// // Install event: pre-cache static assets
// self.addEventListener('install', (event) => {
//   console.log('[SW] Install');
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll(STATIC_ASSETS);
//     })
//   );
//   self.skipWaiting();
// });

// // Activate event: clean up old caches
// self.addEventListener('activate', (event) => {
//   console.log('[SW] Activate');
//   event.waitUntil(
//     caches.keys().then((cacheNames) =>
//       Promise.all(
//         cacheNames.map((cache) => {
//           if (cache !== CACHE_NAME) {
//             console.log('[SW] Deleting old cache:', cache);
//             return caches.delete(cache);
//           }
//         })
//       )
//     )
//   );
//   self.clients.claim();
// });

// // Fetch event: handle only GET requests
// self.addEventListener('fetch', (event) => {
//   if (event.request.method !== 'GET') {
//     console.log(`[SW] Skipping non-GET request: ${event.request.method} ${event.request.url}`);
//     return;
//   }

//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       if (cachedResponse) {
//         return cachedResponse;
//       }

//       return fetch(event.request)
//         .then((networkResponse) => {
//           return caches.open(CACHE_NAME).then((cache) => {
//             // Only cache same-origin responses with status 200
//             if (
//               event.request.url.startsWith(self.location.origin) &&
//               networkResponse.status === 200 &&
//               networkResponse.type === 'basic'
//             ) {
//               cache.put(event.request, networkResponse.clone());
//             }
//             return networkResponse;
//           });
//         })
//         .catch((err) => {
//           console.error('[SW] Fetch failed:', err);
//           throw err;
//         });
//     })
//   );
// });


const CACHE_NAME = 'tari-cache-v1';

const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/manifest.webmanifest',
  // ✅ Add any other real static assets from the `public/` folder
];

// ✅ Install event – cache defined assets
self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ✅ Activate event – clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ✅ Fetch event – cache-first strategy for GET requests
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    console.log(`[SW] Skipping non-GET request: ${event.request.method} ${event.request.url}`);
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          // Cache only same-origin successful responses
          if (
            event.request.url.startsWith(self.location.origin) &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }

          return networkResponse;
        })
        .catch((err) => {
          console.error('[SW] Fetch failed:', err);
          throw err;
        });
    })
  );
});
