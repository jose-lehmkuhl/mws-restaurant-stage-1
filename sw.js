const staticCache = 'mws-restaurant-v2';

self.addEventListener('install', e => 
    e.waitUntil(
        caches.open(staticCache).then(cache => cache.addAll([
            '/',
            '/css/mobile.css',
            '/css/styles.css',
            '/js/dbhelper.js',
            '/js/main.js',
            '/js/restaurant_info.js'
        ]))
    )
);

self.addEventListener('activate' , e => 
    e.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
            cacheNames.filter(cacheName => cacheName.startsWith('mws-restaurant') && cacheName !== staticCache)
            .map(cacheN => caches.delete(cacheN))
        ))
    )
);

self.addEventListener('fetch', e => {
    const requestUrl = new URL(e.request.url);
    requestUrl.pathname.startsWith('/restaurants') ? fetch(e.request) :
    e.respondWith(
        caches.open(staticCache).then(cache => 
         cache.match(e.request).then(request => {
            if (request) {
                return request;
            }
            return fetch(e.request).then(response => {
                cache.put(e.request, response.clone());
                return response;
            });
        })
        )
    );
});