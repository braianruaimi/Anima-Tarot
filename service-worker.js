const cacheName = 'anima-tarot-v5';
const assetsToCache = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/form.js',
  './js/chatbot.js',
  './js/pwa.js',
  './images/hero-tarot.svg',
  './images/service-reading.svg',
  './images/service-spread.svg',
  './images/service-guidance.svg',
  './images/icon-app.svg',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(assetsToCache)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))),
    ),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request)),
  );
});