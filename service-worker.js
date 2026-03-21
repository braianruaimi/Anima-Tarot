const cacheName = 'anima-tarot-v13';
const assetsToCache = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/form.js',
  './js/chatbot.js',
  './js/pwa.js',
  './images/anima-tarot.jpeg',
  './images/cartas.jpeg',
  './images/cartas-vela.jpeg',
  './images/carta-mano.jpeg',
  './images/icon-app.svg',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(assetsToCache)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))).then(() => self.clients.claim()),
    ),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;
  const isNavigationRequest = event.request.mode === 'navigate';

  if (!isSameOrigin) {
    return;
  }

  if (isNavigationRequest) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();

          caches.open(cacheName).then((cache) => {
            cache.put('./index.html', responseClone);
          });

          return networkResponse;
        })
        .catch(() => caches.match('./index.html')),
    );

    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkFetch = fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();

          caches.open(cacheName).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkFetch;
    }),
  );
});