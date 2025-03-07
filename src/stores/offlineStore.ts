import { create } from "zustand";

interface OfflineState {
    isOnline: boolean;
    pendingTrades: any[];
    addPendingTrade: (trade: any) => void;
    removePendingTrade: (id: string) => void;
    clearPendingTrades: () => void;
    setOnlineStatus: (status: boolean) => void;
}

export const useOfflineStore = create<OfflineState>((set) => ({
    isOnline: navigator.onLine,
    pendingTrades: [],

    addPendingTrade: (trade) =>
        set((state) => ({
            pendingTrades: [...state.pendingTrades, { ...trade, id: Date.now().toString() }],
        })),

    removePendingTrade: (id) =>
        set((state) => ({
            pendingTrades: state.pendingTrades.filter((trade) => trade.id !== id),
        })),

    clearPendingTrades: () => set({ pendingTrades: [] }),

    setOnlineStatus: (status) => set({ isOnline: status }),
}));

// Set up listeners for online/offline events
if (typeof window !== "undefined") {
    window.addEventListener("online", () => {
        useOfflineStore.getState().setOnlineStatus(true);

        // Attempt to sync pending trades when coming back online
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then((registration) => {
                // Trigger background sync if available
                if ("sync" in registration) {
                    (registration as any).sync
                        .register("sync-trades")
                        .then(() => console.log("Background sync registered"))
                        .catch((err: Error) =>
                            console.error("Background sync registration failed:", err)
                        );
                } else {
                    console.log("Background sync not supported");
                }
            });
        }
    });

    window.addEventListener("offline", () => {
        useOfflineStore.getState().setOnlineStatus(false);
    });
}
