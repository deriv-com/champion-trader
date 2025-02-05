import { create } from 'zustand';

interface BottomSheetState {
  showBottomSheet: boolean;
  key: string | null;
  height: string;
  onDragDown?: () => void;
  setBottomSheet: (show: boolean, key?: string, height?: string, onDragDown?: () => void) => void;
  setKey: (key: string) => void;
  stakeValue: number;
  setStakeValue: (newValue: number) => void;
}

export const useBottomSheetStore = create<BottomSheetState>((set) => ({
  showBottomSheet: false,
  key: null,
  height: '380px',
  onDragDown: undefined,
  setBottomSheet: (show: boolean, key?: string, height?: string, onDragDown?: () => void) => set({ 
    showBottomSheet: show,
    key: show ? key || null : null,
    height: height || '380px',
    onDragDown: onDragDown
  }),
  setKey: (key: string) => set({ key }),
  stakeValue: 0,
  setStakeValue: (newValue: number) => set({ stakeValue: newValue }),
}));
