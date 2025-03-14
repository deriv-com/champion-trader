import { useEffect } from "react";
import { useSSESubscription } from "@/api/hooks/useSubscription";
import {
    subscribeToOpenContracts,
    subscribeToClosedContracts,
} from "@/api/services/contract/contract-sse";
import { useTradeStore } from "@/stores/tradeStore";
import { OpenContractsResponse, ClosedContractsResponse } from "@/api/services/contract/types";

/**
 * Hook for subscribing to open positions data stream
 * @returns The subscription data and error state
 */
export const useOpenPositionsSubscription = () => {
    const { setOpenPositions, setPositionsLoading, setPositionsError } = useTradeStore();

    const { data, error } = useSSESubscription<OpenContractsResponse>((onData, onError) => {
        setPositionsLoading(true);
        return subscribeToOpenContracts({
            onData: (data) => {
                onData(data);
                setPositionsLoading(false);
            },
            onError,
        });
    });

    useEffect(() => {
        if (data) {
            setOpenPositions(data);
        }
    }, [data, setOpenPositions]);

    useEffect(() => {
        if (error) {
            setPositionsError(error);
        }
    }, [error, setPositionsError]);

    return { data, error };
};

/**
 * Hook for subscribing to closed positions data stream
 * @returns The subscription data and error state
 */
export const useClosedPositionsSubscription = () => {
    const { setClosedPositions, setPositionsLoading, setPositionsError } = useTradeStore();

    const { data, error } = useSSESubscription<ClosedContractsResponse>((onData, onError) => {
        setPositionsLoading(true);
        return subscribeToClosedContracts({
            onData: (data) => {
                onData(data);
                setPositionsLoading(false);
            },
            onError,
        });
    });

    useEffect(() => {
        if (data) {
            setClosedPositions(data);
        }
    }, [data, setClosedPositions]);

    useEffect(() => {
        if (error) {
            setPositionsError(error);
        }
    }, [error, setPositionsError]);

    return { data, error };
};
