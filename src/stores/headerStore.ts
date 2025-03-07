import { create } from "zustand";

interface HeaderState {
    isVisible: boolean;
    setIsVisible: (visible: boolean) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
    isVisible: true,
    setIsVisible: (visible) => set({ isVisible: visible }),
}));
