import { useState, useEffect } from "react";
import { getAvailableInstruments } from "@/services/api/rest/instrument/service";
import { MarketGroup } from "@/services/api/rest/types";
import { appConfig } from "@/config/app";

interface UseInstrumentsResult {
    marketGroups: MarketGroup[];
    isLoading: boolean;
    error: string | null;
}

export const useInstruments = (): UseInstrumentsResult => {
    const [marketGroups, setMarketGroups] = useState<MarketGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInstruments = async () => {
            try {
                const response = await getAvailableInstruments({
                    context: {
                        app_id: appConfig.app_id,
                        account_type: appConfig.account_type,
                    },
                });
                setMarketGroups(response.result);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch instruments");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInstruments();
    }, []);

    return {
        marketGroups,
        isLoading,
        error,
    };
};
