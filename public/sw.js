const CACHE_NAME = 'memomed-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  // Add other assets and pages you want to cache
];

self.addEventListener('install', event => {
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
        self.registration.showNotification('Time for your medication!', {
          body: `Take ${dose} of ${medicationName}.`,
          icon: '/icon-192x192.png',
          tag: id,
        });
      }, delay);
    }
  } else if (event.data.type === 'CANCEL_NOTIFICATIONS') {
    const { ids } = event.data.payload;
    self.registration.getNotifications().then(notifications => {
        notifications.forEach(notification => {
            if (ids.includes(notification.tag)) {
                notification.close();
            }
        });
    });
  }
});
