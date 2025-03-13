import { useState, useEffect } from "react";
import { useAvailableInstruments } from "./useInstrument";
import { MarketGroup } from "@/api/services/instrument/types";
import { appConfig } from "@/config/app";

interface UseInstrumentsResult {
    marketGroups: MarketGroup[];
    isLoading: boolean;
    error: string | null;
}

export const useInstruments = (): UseInstrumentsResult => {
    const [marketGroups, setMarketGroups] = useState<MarketGroup[]>([]);
    const [error, setError] = useState<string | null>(null);

    const { mutate, loading: isLoading } = useAvailableInstruments({
        onSuccess: (response) => {
            setMarketGroups(response.result);
            setError(null);
        },
        onError: (err) => {
            setError(err instanceof Error ? err.message : "Failed to fetch instruments");
        },
    });

    useEffect(() => {
        mutate({
            instrument: "",
            context: {
                app_id: appConfig.app_id,
                account_type: appConfig.account_type,
            },
        });
    }, [mutate]);

    return {
        marketGroups,
        isLoading,
        error,
    };
};
