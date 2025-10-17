const CACHE_NAME = 'isoswitch-cache-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/icons/icon-192.png',
        '/icons/icon-512.png'
      ]))
      .catch(err => console.error('Cache addAll failed', err))
  );
});

self.addEventListener('fetch', (event) => {
  // Bỏ qua các request chrome-extension hoặc không phải http/https
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((res) => {
        // Chỉ cache nếu request thành công
        if (res.status === 200) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, res.clone());
          });
        }
        return res;
      }).catch(() => {
        console.warn('Fetch failed, offline fallback');
      });
    })
  );
});
