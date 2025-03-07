import { create } from "zustand";

interface LeftSidebarStore {
    isOpen: boolean;
    key: string | null;
    setLeftSidebar: (isOpen: boolean, key?: string | null) => void;
}

export const useLeftSidebarStore = create<LeftSidebarStore>((set) => ({
    isOpen: false,
    key: null,
    setLeftSidebar: (isOpen, key = null) => set({ isOpen, key }),
}));
