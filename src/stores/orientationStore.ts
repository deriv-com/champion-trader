import { create } from "zustand";

interface OrientationState {
    isLandscape: boolean;
    setIsLandscape: (value: boolean) => void;
}

export const useOrientationStore = create<OrientationState>((set) => ({
    isLandscape: false,
    setIsLandscape: (value) => set({ isLandscape: value }),
}));
