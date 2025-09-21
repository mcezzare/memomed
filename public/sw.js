const CACHE_NAME = 'memomed-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  // Add other assets like CSS, JS, and images if you have them
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('message', event => {
    if (event.data.type === 'SCHEDULE_NOTIFICATION') {
        const { medicationName, dose, scheduledAt, id } = event.data.payload;
        const delay = scheduledAt - Date.now();

        if (delay > 0) {
            setTimeout(() => {
                self.registration.showNotification('Hora do Medicamento!', {
                    body: `Está na hora de tomar seu ${medicationName} (${dose}).`,
                    icon: '/icon-192x192.png',
                    tag: id
                });
            }, delay);
        }
    }
});
