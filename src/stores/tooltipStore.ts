import { create } from "zustand";

interface TooltipState {
    message: string;
    isVisible: boolean;
    position: { x: number; y: number };
    type: "error" | "info" | "warning" | "success";
    showTooltip: (
        message: string,
        position: { x: number; y: number },
        type?: "error" | "info" | "warning" | "success"
    ) => void;
    hideTooltip: () => void;
}

export const useTooltipStore = create<TooltipState>((set) => ({
    message: "",
    isVisible: false,
    position: { x: 0, y: 0 },
    type: "info",
    showTooltip: (message, position, type = "info") =>
        set({ message, position, isVisible: true, type }),
    hideTooltip: () => set({ isVisible: false }),
}));
