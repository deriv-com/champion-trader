// Utility functions for handling offline functionality
import React from "react";

/**
 * Checks if the user is currently offline
 * @returns {boolean} True if the user is offline, false otherwise
 */
export function isOffline(): boolean {
    return !navigator.onLine;
}

/**
 * Adds event listeners for online/offline events
 * @param {Function} onOffline Callback function to execute when the user goes offline
 * @param {Function} onOnline Callback function to execute when the user comes back online
 * @returns {Function} Function to remove the event listeners
 */
export function addConnectivityListeners(onOffline: () => void, onOnline: () => void): () => void {
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);

    return () => {
        window.removeEventListener("offline", onOffline);
        window.removeEventListener("online", onOnline);
    };
}

/**
 * Creates a React hook for monitoring online/offline status
 * @returns {boolean} Current online status
 */
export function useOnlineStatus(): boolean {
    const [isOnline, setIsOnline] = React.useState(navigator.onLine);

    React.useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return isOnline;
}

/**
 * Detects if the app is running in standalone mode (installed PWA)
 * @returns {boolean} True if the app is running in standalone mode
 */
export function isRunningAsStandalone(): boolean {
    return (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true
    );
}

/**
 * Checks if the service worker is registered and active
 * @returns {Promise<boolean>} Promise that resolves to true if service worker is active
 */
export async function isServiceWorkerActive(): Promise<boolean> {
    if (!("serviceWorker" in navigator)) {
        return false;
    }

    const registrations = await navigator.serviceWorker.getRegistrations();
    return registrations.length > 0;
}

/**
 * Attempts to retrieve cached data for a specific URL
 * @param {string} url The URL to retrieve from cache
 * @returns {Promise<Response|null>} The cached response or null if not found
 */
export async function getCachedData(url: string): Promise<Response | null> {
    if (!("caches" in window)) {
        return null;
    }

    const cacheNames = await caches.keys();

    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const response = await cache.match(url);

        if (response) {
            return response;
        }
    }

    return null;
}

/**
 * Shows an offline notification to the user
 * @param {string} message Custom message to display (optional)
 */
export function showOfflineNotification(message?: string): void {
    const defaultMessage = "You are currently offline. Some features may be unavailable.";

    // This is a simple implementation - in a real app, you might use a toast or snackbar component
    const notification = document.createElement("div");
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.left = "50%";
    notification.style.transform = "translateX(-50%)";
    notification.style.backgroundColor = "#333";
    notification.style.color = "white";
    notification.style.padding = "12px 24px";
    notification.style.borderRadius = "4px";
    notification.style.zIndex = "9999";
    notification.textContent = message || defaultMessage;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transition = "opacity 0.5s ease";

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}
