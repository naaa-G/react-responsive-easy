// Service Worker for React Responsive Easy Vite Example
const CACHE_NAME = 'rre-vite-v1';
const STATIC_CACHE = 'rre-vite-static-v1';
const DYNAMIC_CACHE = 'rre-vite-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/favicon.ico'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        // Cache files one by one to handle failures gracefully
        return Promise.allSettled(
          STATIC_FILES.map(url => 
            cache.add(url).catch(error => {
              console.warn(`Failed to cache ${url}:`, error);
              return null; // Continue with other files
            })
          )
        );
      })
      .then(() => {
        console.log('Static files caching completed');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker installation failed:', error);
        // Continue with installation even if caching fails
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    // Static assets (CSS, JS, images)
    if (isStaticAsset(request)) {
      event.respondWith(cacheFirst(request, STATIC_CACHE));
      return;
    }

    // API requests
    if (isApiRequest(request)) {
      event.respondWith(networkFirst(request, DYNAMIC_CACHE));
      return;
    }

    // HTML pages
    if (request.destination === 'document') {
      event.respondWith(networkFirst(request, DYNAMIC_CACHE));
      return;
    }

    // Default: try network first, fallback to cache
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// Cache first strategy for static assets
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return a fallback response if available
    const fallbackResponse = await caches.match('/offline.html');
    if (fallbackResponse) {
      return fallbackResponse;
    }
    throw error;
  }
}

// Network first strategy for dynamic content
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for HTML requests
    if (request.destination === 'document') {
      const offlineResponse = await caches.match('/offline.html');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    throw error;
  }
}

// Check if request is for a static asset
function isStaticAsset(request) {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2'];
  const url = request.url.toLowerCase();
  return staticExtensions.some(ext => url.includes(ext));
}

// Check if request is an API request
function isApiRequest(request) {
  const url = request.url.toLowerCase();
  return url.includes('/api/') || url.includes('jsonplaceholder.typicode.com');
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Background sync implementation
async function doBackgroundSync() {
  try {
    // Get all clients
    const clients = await self.clients.matchAll();
    
    // Send message to update UI
    clients.forEach((client) => {
      client.postMessage({
        type: 'BACKGROUND_SYNC',
        message: 'Background sync completed'
      });
    });
    
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from React Responsive Easy',
    icon: '/android-chrome-192x192.png',
    badge: '/android-chrome-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/android-chrome-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/android-chrome-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('React Responsive Easy', options)
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

// Message handling from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('Service Worker loaded successfully');
