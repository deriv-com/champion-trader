import { create } from "zustand";

interface ProcessedInstrument {
    symbol: string;
    displayName: string;
    shortName: string;
    market_name: string;
    isClosed?: boolean;
    type: "volatility" | "boom" | "crash";
}

interface MarketState {
    selectedMarket: ProcessedInstrument;
    setSelectedMarket: (market: ProcessedInstrument) => void;
}

// Default market (Volatility 100 (1s))
const defaultMarket: ProcessedInstrument = {
    symbol: "R_100", // Using the format that matches marketIcons mapping
    displayName: "Volatility 100 Index",
    shortName: "100",
    market_name: "synthetic_index",
    type: "volatility",
};

export const useMarketStore = create<MarketState>((set) => ({
    selectedMarket: defaultMarket,
    setSelectedMarket: (market) => set({ selectedMarket: market }),
}));
