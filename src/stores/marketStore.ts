import { create } from "zustand"

interface ProcessedInstrument {
  symbol: string
  displayName: string
  shortName: string
  market_name: string
  isOneSecond: boolean
  isClosed?: boolean
  type: "volatility" | "boom" | "crash"
}

interface MarketState {
  selectedMarket: ProcessedInstrument | null
  setSelectedMarket: (market: ProcessedInstrument) => void
}

export const useMarketStore = create<MarketState>((set) => ({
  selectedMarket: null,
  setSelectedMarket: (market) => set({ selectedMarket: market }),
}))
