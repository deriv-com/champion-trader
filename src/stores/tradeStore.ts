import { create } from 'zustand';

export interface TradeState {
  stake: string;
  duration: string;
  allowEquals: boolean;
  setStake: (stake: string) => void;
  setDuration: (duration: string) => void;
  toggleAllowEquals: () => void;
  numpadValue: string;
  setNumpadValue: (value: string) => void;
}

export const useTradeStore = create<TradeState>((set) => ({
  stake: '0',
  duration: '0',
  allowEquals: false,
  setStake: (stake) => set({ stake }),
  setDuration: (duration) => set({ duration }),
  toggleAllowEquals: () => set((state) => ({ allowEquals: !state.allowEquals })),
  numpadValue: "",
  setNumpadValue: (value) => set({ numpadValue: value }),
}));
