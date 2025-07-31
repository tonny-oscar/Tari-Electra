const CACHE_NAME = 'tari-cache-v2';
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/tari-logo.png',
  '/manifest.webmanifest'
];

// Firebase and API domains to bypass caching
const BYPASS_URLS = [
  'identitytoolkit.googleapis.com',
  'firestore.googleapis.com',
  'firebase-settings.crashlytics.com',
  'firebase.googleapis.com',
  'fcmregistrations.googleapis.com',
  'cloudconfig.googleapis.com'
];

// Helper function to check if URL should bypass cache
function shouldBypassCache(url) {
  return BYPASS_URLS.some(domain => url.includes(domain));
}

// ✅ Install event – cache defined assets
self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(err => {
            console.warn(`[SW] Failed to cache ${url}:`, err);
            return null;
          })
        )
      );
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

// ✅ Fetch event – network-first strategy for dynamic content
self.addEventListener('fetch', (event) => {
  // Bypass service worker for Firebase and API requests
  if (shouldBypassCache(event.request.url)) {
    return;
  }

  // Handle only GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache same-origin successful responses
        if (
          event.request.url.startsWith(self.location.origin) &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic'
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch((error) => {
        console.log('[SW] Network request failed, trying cache...', error);
        return caches.match(event.request);
      })
  );
});
