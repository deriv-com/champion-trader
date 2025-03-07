// Cache name with version for easy updating
const CACHE_NAME = "champion-trader-v1";

// Assets to cache on install
const STATIC_ASSETS = [
    "/",
    "/index.html",
    "/offline.html",
    "/manifest.json",
    "/favicon.ico",
    "/logo.png",
    "/logo192.png",
    "/logo512.png",
    "/icons/trade.png",
    // Add CSS and JS files that are part of the build
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => {
                        return cacheName !== CACHE_NAME;
                    })
                    .map((cacheName) => {
                        return caches.delete(cacheName);
                    })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Handle API requests differently (network first)
    if (
        event.request.url.includes("/api/") ||
        event.request.url.includes("/sse/") ||
        event.request.headers.get("accept").includes("application/json")
    ) {
        event.respondWith(networkFirstStrategy(event.request));
        return;
    }

    // Apply cache-first strategy for static assets
    event.respondWith(cacheFirstStrategy(event.request));
});

// Cache-first strategy - try cache, then network
async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        // For HTML requests, serve the offline page as fallback
        if (request.headers.get("accept").includes("text/html")) {
            return caches.match("/offline.html");
        }
        throw error;
    }
}

// Network-first strategy - try network, then cache
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Handle background sync for offline functionality
self.addEventListener("sync", (event) => {
    if (event.tag === "sync-trades") {
        event.waitUntil(syncPendingTrades());
    }
});

// Background sync for pending trades
async function syncPendingTrades() {
    try {
        const db = await openDatabase();
        const pendingTrades = await db.getAll("pendingTrades");

        for (const trade of pendingTrades) {
            try {
                const response = await fetch("/api/trade", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(trade),
                });

                if (response.ok) {
                    await db.delete("pendingTrades", trade.id);
                }
            } catch (error) {
                console.error("Failed to sync trade:", error);
            }
        }
    } catch (error) {
        console.error("Sync failed:", error);
    }
}

// IndexedDB for offline data persistence
async function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("ChampionTraderDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("pendingTrades")) {
                db.createObjectStore("pendingTrades", { keyPath: "id" });
            }
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve({
                getAll: (storeName) => {
                    return new Promise((resolve, reject) => {
                        const transaction = db.transaction(storeName, "readonly");
                        const store = transaction.objectStore(storeName);
                        const request = store.getAll();

                        request.onsuccess = () => resolve(request.result);
                        request.onerror = () => reject(request.error);
                    });
                },
                delete: (storeName, id) => {
                    return new Promise((resolve, reject) => {
                        const transaction = db.transaction(storeName, "readwrite");
                        const store = transaction.objectStore(storeName);
                        const request = store.delete(id);

                        request.onsuccess = () => resolve();
                        request.onerror = () => reject(request.error);
                    });
                },
            });
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

// Push notification handler
self.addEventListener("push", (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body,
        icon: "/logo192.png",
        badge: "/logo192.png",
        vibrate: [100, 50, 100],
        data: {
            url: data.url || "/",
        },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: "window" }).then((clientList) => {
            // If a window is already open, focus it
            for (const client of clientList) {
                if (client.url === event.notification.data.url && "focus" in client) {
                    return client.focus();
                }
            }
            // Otherwise open a new window
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});
