[file name]: service-worker.js
[file content begin]
// NexGenAiTech Service Worker
const CACHE_NAME = 'nexgenaitech-v1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/industries.html',
  '/process.html',
  '/contact.html',
  '/privacy.html',
  '/terms.html',
  '/css/main.css',
  '/css/animations.css',
  '/css/responsive.css',
  '/js/main.js',
  '/js/animations.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap',
  'https://i.ibb.co/5XvqqqpL/Nex-Gen-Ai-Tech-logo.jpg'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch Events
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // If offline and page not cached, show custom offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
          });
      })
  );
});
[file content end]
