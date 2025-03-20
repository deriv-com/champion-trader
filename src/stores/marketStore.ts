import { create } from "zustand";
import { Instrument } from "@/api/services/instrument/types";

/**
 * Market store interface
 * Only contains state and simple setters
 */
interface MarketState {
    // Market selection state
    selectedMarket: Instrument | null;
    setSelectedMarket: (market: Instrument | null) => void;

    // Instruments state
    instruments: Instrument[];
    setInstruments: (instruments: Instrument[]) => void;

    // Loading state
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;

    // Error state
    error: string | null;
    setError: (error: string | null) => void;

    errorDetails: {
        statusCode?: number;
        errorCode?: string;
    } | null;
    setErrorDetails: (errorDetails: { statusCode?: number; errorCode?: string } | null) => void;
}

/**
 * Market store
 * Only contains state and simple setters
 * Complex logic is moved to useInstrumentUtils hook
 */
export const useMarketStore = create<MarketState>((set) => ({
    // Market selection state
    selectedMarket: null,
    setSelectedMarket: (market: Instrument | null) => set({ selectedMarket: market }),

    // Instruments state
    instruments: [],
    setInstruments: (instruments: Instrument[]) => set({ instruments }),

    // Loading state
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),

    // Error state
    error: null,
    setError: (error: string | null) => set({ error }),

    errorDetails: null,
    setErrorDetails: (errorDetails: { statusCode?: number; errorCode?: string } | null) =>
        set({ errorDetails }),
}));
