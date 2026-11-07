const CACHE_NAME = "gelzzstore-v1";
const ASSETS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./image/logo/logo.jpg",
    "./image/banner/banner1.jpg",
    "./image/banner/banner2.jpg",
    "./image/banner/banner3.jpg",
    "./image/qris.png",
    "./image/produk/produk1.jpg",
    "./image/produk/produk2.jpg",
    "./image/produk/produk3.jpg",
    "./image/produk/produk4.jpg",
    "./image/produk/produk5.jpg",
    "./image/produk/produk6.jpg",
    "./image/produk/produk7.jpg",
    "./image/produk/produk8.jpg",
    "./image/produk/produk9.jpg",
    "./image/produk/produk10.jpg"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.allSettled(
                ASSETS.map((url) => cache.add(url).catch(() => {}))
            );
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const req = event.request;
    if (req.method !== "GET") return;

    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;

    if (req.mode === "navigate") {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
                    return res;
                })
                .catch(() => caches.match("./index.html"))
        );
        return;
    }

    event.respondWith(
        caches.match(req).then((cached) => {
            if (cached) return cached;
            return fetch(req)
                .then((res) => {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
                    return res;
                })
                .catch(() => cached);
        })
    );
});
