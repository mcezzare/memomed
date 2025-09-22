/// <reference lib="webworker" />

const CACHE_NAME = 'memomed-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

const self = this;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { medicationName, dose, scheduledAt, id } = event.data.payload;
    const delay = scheduledAt - Date.now();

    if (delay > 0) {
      // Use showTrigger for reliable scheduling
      self.registration.showNotification('Time for your medication!', {
        tag: id,
        body: `${medicationName} - ${dose}`,
        icon: '/icon-192x192.png',
        showTrigger: new TimestampTrigger(scheduledAt),
        data: {
          url: self.location.origin, 
        }
      });
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

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) {
                        client = clientList[i];
                    }
                }
                return client.focus();
            }
            return clients.openWindow(event.notification.data.url || '/');
        })
    );
});
