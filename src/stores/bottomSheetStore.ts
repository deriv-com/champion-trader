import { create } from 'zustand';

interface BottomSheetState {
  showBottomSheet: boolean;
  key: string | null;
  height: string;
  setBottomSheet: (show: boolean, key?: string, height?: string) => void;
}

export const useBottomSheetStore = create<BottomSheetState>((set) => ({
  showBottomSheet: false,
  key: null,
  height: '400px',
  setBottomSheet: (show: boolean, key?: string, height?: string) => set({ 
    showBottomSheet: show,
    key: show ? key || null : null,
    height: height || '400px'
  }),
}));
