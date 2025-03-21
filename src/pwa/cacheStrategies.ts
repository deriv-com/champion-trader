// Cache strategy definitions for different types of assets

// Cache names
export const CACHE_NAMES = {
    STATIC: "static-assets-v1",
    DYNAMIC: "dynamic-content-v1",
    IMAGES: "images-v1",
    API: "api-cache-v1",
};

// URLs to precache (critical assets)
export const PRECACHE_ASSETS = [
    "/",
    "/index.html",
    "/offline.html",
    "/manifest.json",
    "/favicon.ico",
    "/logo.svg",
    "/icons/apple-touch-icon.png",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/icons/maskable-icon.png",
    "/css/main.css",
    "/js/main.js",
];

// URLs to cache with network-first strategy
export const NETWORK_FIRST_URLS = [
    // API endpoints that should be fresh but can fall back to cache
    /\/api\/v1\/market/,
    /\/api\/v1\/user/,
];

// URLs to cache with cache-first strategy
export const CACHE_FIRST_URLS = [
    // Static assets that rarely change
    /\.(?:js|css)$/,
    /\/icons\//,
    /\/images\//,
];

// URLs to cache with stale-while-revalidate strategy
export const STALE_WHILE_REVALIDATE_URLS = [
    // Content that can be slightly stale but should be updated
    /\/api\/v1\/config/,
    /\/api\/v1\/static/,
];

// URLs that should never be cached
export const NEVER_CACHE_URLS = [
    // Sensitive or highly dynamic content
    /\/api\/v1\/auth/,
    /\/api\/v1\/payment/,
];

// Offline fallback mapping
export const OFFLINE_FALLBACKS = {
    // Route patterns and their fallback URLs
    "/": "/offline.html",
    "/trade": "/offline.html",
    "/positions": "/offline.html",
    "/menu": "/offline.html",
};

// Maximum age for cached resources (in seconds)
export const CACHE_EXPIRATION = {
    STATIC: 30 * 24 * 60 * 60, // 30 days
    DYNAMIC: 24 * 60 * 60, // 1 day
    IMAGES: 7 * 24 * 60 * 60, // 7 days
    API: 60 * 60, // 1 hour
};

// Helper function to determine cache strategy based on URL
export function getCacheStrategy(
    url: string
): "network-first" | "cache-first" | "stale-while-revalidate" | "no-cache" {
    // Check if URL should never be cached
    if (NEVER_CACHE_URLS.some((pattern) => pattern.test(url))) {
        return "no-cache";
    }

    // Check if URL should use network-first
    if (NETWORK_FIRST_URLS.some((pattern) => pattern.test(url))) {
        return "network-first";
    }

    // Check if URL should use cache-first
    if (CACHE_FIRST_URLS.some((pattern) => pattern.test(url))) {
        return "cache-first";
    }

    // Check if URL should use stale-while-revalidate
    if (STALE_WHILE_REVALIDATE_URLS.some((pattern) => pattern.test(url))) {
        return "stale-while-revalidate";
    }

    // Default to network-first for unspecified URLs
    return "network-first";
}
