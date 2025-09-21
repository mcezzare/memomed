// Define a unique cache name for your application resources.
const CACHE_NAME = 'dosewise-cache-v1';
// List all the assets that need to be cached for offline use.
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  // Next.js build files will be added to this list by the build process,
  // but for development and to ensure core files are cached, we specify them.
  // Note: In a real build, these paths would be dynamically generated.
];

// Install event: This is triggered when the service worker is first installed.
self.addEventListener('install', event => {
  // waitUntil() ensures that the service worker will not be considered installed
  // until the code inside it has finished executing.
  event.waitUntil(
    // Open a cache by name.
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Add all specified URLs to the cache.
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event: This is triggered after the installation is successful.
// It's a good place to clean up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    // Get all cache keys (cache names).
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If a cache is not in our whitelist, delete it.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: This is triggered for every request the page makes.
// It allows us to intercept the request and respond with cached assets if available.
self.addEventListener('fetch', event => {
  event.respondWith(
    // Check if the request is in the cache.
    caches.match(event.request)
      .then(response => {
        // If a cached response is found, return it.
        if (response) {
          return response;
        }
        // If not found in cache, fetch it from the network.
        return fetch(event.request);
      }
    )
  );
});


// Notification Scheduling Logic
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { medicationName, dose, scheduledAt } = event.data.payload;
    const now = Date.now();
    const delay = scheduledAt - now;

    if (delay > 0) {
      setTimeout(() => {
        self.registration.showNotification('Time for your medication!', {
          body: `It's time to take ${dose} of ${medicationName}.`,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png'
        });
      }, delay);
    }
  }
});