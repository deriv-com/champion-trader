import { create } from "zustand";

interface ServerTimeStore {
    serverTime: Date;
    setServerTime: (time: Date) => void;
}

export const useServerTimeStore = create<ServerTimeStore>((set) => ({
    serverTime: new Date(),
    setServerTime: (time: Date) => set({ serverTime: time }),
}));
