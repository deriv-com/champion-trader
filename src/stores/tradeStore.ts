import { create } from 'zustand';

export interface TradeState {
  stake: string;
  duration: string;
  allowEquals: boolean;
  symbol: string;
  setStake: (stake: string) => void;
  setDuration: (duration: string) => void;
  setSymbol: (symbol: string) => void;
  toggleAllowEquals: () => void;
}

export const useTradeStore = create<TradeState>((set) => ({
  stake: '10 USD',
  duration: '10 tick',
  allowEquals: false,
  symbol: '1HZ100V',
  setStake: (stake) => set({ stake }),
  setDuration: (duration) => set({ duration }),
  setSymbol: (symbol) => set({ symbol }),
  toggleAllowEquals: () => set((state) => ({ allowEquals: !state.allowEquals })),
}));
