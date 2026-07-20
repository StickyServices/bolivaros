// Service worker de BolívarOS: la app abre aunque no haya internet.
// Estrategia: red primero (para recibir actualizaciones), cache como respaldo.
const CACHE = 'bolivaros-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      try {
        const net = await fetch(e.request)
        if (net.ok) cache.put(e.request, net.clone())
        return net
      } catch {
        const hit = await cache.match(e.request, { ignoreSearch: true })
        return hit || cache.match('./index.html')
      }
    }),
  )
})
