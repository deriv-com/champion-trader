import { create } from 'zustand';

interface BottomSheetState {
  showBottomSheet: boolean;
  key: string | null;
  height: string;
  onDragDown?: () => void;
  setBottomSheet: (show: boolean, key?: string, height?: string, onDragDown?: () => void) => void;
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
}));
