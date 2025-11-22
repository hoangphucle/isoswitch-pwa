const CACHE_NAME = "isofind-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/logo-spark.svg",
  "/devices.json",
  "/C&I.json",
  "/manifest.json",
  "/src/main.jsx",
  "/src/components/Button.css",
  // Thêm các file JS/CSS khác nếu cần
];

// Cài đặt cache khi install
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Pre-caching offline files");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Kích hoạt service worker
self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Intercept fetch requests
self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((resp) => {
      return resp || fetch(evt.request).then((response) => {
        // Cache các file mới
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(evt.request, response.clone());
          return response;
        });
      });
    })
  );
});
