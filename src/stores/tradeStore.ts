import { create } from 'zustand';

export interface TradeState {
  stake: string;
  duration: string;
  allowEquals: boolean;
  setStake: (stake: string) => void;
  setDuration: (duration: string) => void;
  toggleAllowEquals: () => void;
}

export const useTradeStore = create<TradeState>((set) => ({
  stake: '10 USD',
  duration: '10 tick',
  allowEquals: false,
  setStake: (stake) => set({ stake }),
  setDuration: (duration) => set({ duration }),
  toggleAllowEquals: () => set((state) => ({ allowEquals: !state.allowEquals })),
}));
