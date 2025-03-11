import { create } from "zustand";

interface BottomNavState {
    isVisible: boolean;
    setIsVisible: (visible: boolean) => void;
}

export const useBottomNavStore = create<BottomNavState>((set) => ({
    isVisible: true,
    setIsVisible: (visible) => set({ isVisible: visible }),
}));
