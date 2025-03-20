import { useCallback } from "react";
import { Instrument } from "@/api/services/instrument/types";
import {
    getAvailableInstruments,
    InstrumentApiError,
} from "@/api/services/instrument/instrument-rest";
import { useMarketStore } from "@/stores/marketStore";
import { useTradeStore } from "@/stores/tradeStore";

// Cache expiration time in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

// In-memory cache for instruments data
interface InstrumentsCache {
    [key: string]: {
        data: Instrument[];
        timestamp: number;
    };
}

const instrumentsCache: InstrumentsCache = {};

/**
 * Hook that provides utility functions for working with instruments
 */
export const useInstrumentUtils = () => {
    const {
        instruments,
        setInstruments,
        setIsLoading,
        setError,
        setErrorDetails,
        selectedMarket,
        setSelectedMarket,
    } = useMarketStore();

    const { setInstrument } = useTradeStore();

    /**
     * Helper function to select the first available market from a list of instruments
     */
    const selectFirstAvailableMarketFromList = useCallback(
        (instruments: Instrument[]) => {
            if (instruments.length > 0) {
                // Find the first open market
                const firstOpenMarket = instruments.find((instrument) => instrument.is_market_open);

                // If no open markets, use the first one regardless
                const marketToSelect = firstOpenMarket || instruments[0];

                // Set the selected market and instrument
                setSelectedMarket(marketToSelect);
                setInstrument(marketToSelect.id);

                console.log("Selected first available market:", marketToSelect.display_name);
                return marketToSelect;
            }
            return null;
        },
        [setSelectedMarket, setInstrument]
    );

    /**
     * Fetch instruments from the API or cache
     */
    const fetchInstruments = useCallback(
        async (params: { productId?: string; accountUuid?: string } = {}) => {
            const { productId, accountUuid } = params;

            // Create a cache key based on the request parameters
            const cacheKey = `${productId || "all"}_${accountUuid || "none"}`;

            // Set loading state and clear selected market when switching trade types
            setIsLoading(true);

            // Clear selected market when switching trade types
            // This ensures we don't show an instrument that might not be available in the new trade type
            if (selectedMarket) {
                setSelectedMarket(null);
            }

            // Check if we have valid cached data
            const cachedData = instrumentsCache[cacheKey];
            const isCacheValid = cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRATION;

            if (isCacheValid) {
                console.log("Using cached instruments data for:", cacheKey);
                // Use cached data
                setInstruments(cachedData.data);
                setIsLoading(false);
                setError(null);
                setErrorDetails(null);

                // Select the first available market when using cached data
                selectFirstAvailableMarketFromList(cachedData.data);

                return;
            }

            console.log("Fetching fresh instruments data for:", cacheKey);

            try {
                // Make API request
                const response = await getAvailableInstruments({
                    product_id: productId,
                    account_uuid: accountUuid,
                });

                const instrumentsData = response.data.instruments;

                // Update state
                setInstruments(instrumentsData);
                setIsLoading(false);
                setError(null);
                setErrorDetails(null);

                // Update cache
                instrumentsCache[cacheKey] = {
                    data: instrumentsData,
                    timestamp: Date.now(),
                };

                // Select the first available market after fetching new instruments
                selectFirstAvailableMarketFromList(instrumentsData);
            } catch (err) {
                // Handle errors
                if (err instanceof InstrumentApiError) {
                    setError(err.message);
                    setErrorDetails({
                        statusCode: err.statusCode,
                        errorCode: err.errorCode,
                    });
                    setIsLoading(false);
                } else {
                    setError(err instanceof Error ? err.message : "Failed to fetch instruments");
                    setErrorDetails(null);
                    setIsLoading(false);
                }

                // If we have cached data and encounter an error, use the cached data
                if (instrumentsCache[cacheKey]) {
                    setInstruments(instrumentsCache[cacheKey].data);
                }
            }
        },
        [
            setInstruments,
            setIsLoading,
            setError,
            setErrorDetails,
            selectedMarket,
            setSelectedMarket,
            selectFirstAvailableMarketFromList,
        ]
    );

    /**
     * Filter instruments by category
     */
    const filterByCategory = useCallback(
        (category: string): Instrument[] => {
            return instruments.filter((instrument) =>
                instrument.categories.some((cat) =>
                    cat.toLowerCase().includes(category.toLowerCase())
                )
            );
        },
        [instruments]
    );

    /**
     * Get an instrument by ID
     */
    const getInstrumentById = useCallback(
        (id: string): Instrument | undefined => {
            return instruments.find((instrument) => instrument.id === id);
        },
        [instruments]
    );

    /**
     * Check if a market is open
     */
    const isMarketOpen = useCallback(
        (id: string): boolean => {
            const instrument = getInstrumentById(id);
            return instrument ? instrument.is_market_open : false;
        },
        [getInstrumentById]
    );

    /**
     * Select the first available market from the current instruments list
     */
    const selectFirstAvailableMarket = useCallback(() => {
        return selectFirstAvailableMarketFromList(instruments);
    }, [instruments, selectFirstAvailableMarketFromList]);

    /**
     * Determine market type from categories
     */
    const getMarketType = useCallback((categories: string[]): "volatility" | "boom" | "crash" => {
        const categoryStr = categories.join(" ").toLowerCase();
        if (categoryStr.includes("crash")) return "crash";
        if (categoryStr.includes("boom")) return "boom";
        return "volatility";
    }, []);

    /**
     * Determine market name from categories
     */
    const getMarketName = useCallback((categories: string[]): string => {
        const categoryStr = categories.join(" ").toLowerCase();
        if (categoryStr.includes("synthetic") || categoryStr.includes("volatility")) {
            return "synthetic_index";
        }
        if (categoryStr.includes("crash") || categoryStr.includes("boom")) {
            return "crash_boom";
        }
        if (categoryStr.includes("forex") || categoryStr.includes("major pairs")) {
            return "forex";
        }
        return "other";
    }, []);

    return {
        fetchInstruments,
        filterByCategory,
        getInstrumentById,
        isMarketOpen,
        selectFirstAvailableMarket,
        getMarketType,
        getMarketName,
    };
};
