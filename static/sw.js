// DiskTools Service Worker - Professional Offline Support
const CACHE_NAME = 'disktools-v2.0';
const urlsToCache = [
    '/',
    '/static/css/main.css',
    '/static/css/animations.css',
    '/static/js/main.js',
    '/static/js/animations.js',
    '/tools/gpa-calculator',
    '/tools/pomodoro-timer',
    '/tools/unit-converter',
    '/tools/study-planner',
    '/tools/assignment-tracker',
    '/tools/pdf-toolkit',
    '/tools/word-counter',
    '/tools/password-manager',
    '/tools/flashcard-maker',
    '/tools/note-taking'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('DiskTools: Caching resources');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('DiskTools: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
