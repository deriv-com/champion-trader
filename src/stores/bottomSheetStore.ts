import { create } from "zustand";

interface ActionButtonConfig {
    show: boolean;
    label: string;
    onClick: () => void;
}

export interface BottomSheetState {
    showBottomSheet: boolean;
    key: string | null;
    height: string;
    actionButton?: ActionButtonConfig;
    onDragDown?: () => void;
    setBottomSheet: (
        show: boolean,
        key?: string,
        height?: string,
        actionButton?: ActionButtonConfig,
        onDragDown?: () => void
    ) => void;
}

export const useBottomSheetStore = create<BottomSheetState>((set) => ({
    showBottomSheet: false,
    key: null,
    height: "380px",
    onDragDown: undefined,
    setBottomSheet: (
        show: boolean,
        key?: string,
        height?: string,
        actionButton?: ActionButtonConfig,
        onDragDown?: () => void
    ) => {
        return set({
            showBottomSheet: show,
            key: show ? key || null : null,
            height: height || "380px",
            actionButton,
            onDragDown: onDragDown,
        });
    },
}));
