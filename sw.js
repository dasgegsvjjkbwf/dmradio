const CACHE_NAME = 'damas-radio-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    if (e.request.url.includes('stream') || e.request.url.includes('cdnstream')) {
        e.respondWith(
            fetch(e.request).catch(() => caches.match('/index.html'))
        );
        return;
    }
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
    );
});