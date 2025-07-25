const CACHE_NAME = 'blacktable-v1';
const urlsToCache = [
  '/',
  '/game',
  '/rooms',
  '/settings',
  '/index.css',
  '/main.tsx',
  '/models/card.glb',
  '/models/card2.glb',
  '/images/banuhaqim.svg',
  '/images/brujah.svg',
  '/images/camarilla.svg',
  '/images/hecata.svg',
  '/images/toreador.svg',
  '/images/ventrue.svg',
  '/images/vtes.svg',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle offline actions when connection is restored
  console.log('Background sync triggered');
  return Promise.resolve();
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/images/vtes.svg',
    badge: '/images/vtes.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'Open BlackTable',
        icon: '/images/vtes.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/vtes.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('BlackTable', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
