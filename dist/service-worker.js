const CACHE_NAME = "isoswitch-cache-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/src/main.jsx",
  "/src/App.jsx",
  "/src/styles.css",
  "/src/data/devices.json"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (!url.startsWith('http')) return;
  
  event.respondWith(
    caches.open('my-cache').then((cache) => {
      return cache.match(event.request).then((response) => {
        return response || fetch(event.request).then((res) => {
          cache.put(event.request, res.clone());
          return res;
        });
      });
    })
  );
});

