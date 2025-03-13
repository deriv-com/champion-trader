import { useState, useEffect } from "react";
import { createSSEConnection } from "@/api/base/sse";
import { ContractPriceResponse } from "@/api/base/sse";
import { tradeTypeConfigs } from "@/config/tradeTypes";
import { formatDuration } from "@/utils/duration";
import { DurationRangesResponse } from "@/api/services/product/types";

interface UseStakeSSEParams {
    duration: string;
    durationType: keyof DurationRangesResponse;
    trade_type: string;
    currency: string;
    stake: string | null;
    token: string | null;
}

export const useStakeSSE = (params: UseStakeSSEParams) => {
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const [payouts, setPayouts] = useState({
        max: 50000,
        values: {} as Record<string, number>,
    });

    // Compute overall loading state
    const loading = Object.values(loadingStates).some((isLoading) => isLoading);

    useEffect(() => {
        if (!params.stake || !params.token) {
            setLoadingStates({});
            return;
        }

        // Initialize loading states for all buttons
        setLoadingStates(
            tradeTypeConfigs[params.trade_type].buttons.reduce(
                (acc, button) => ({ ...acc, [button.actionName]: true }),
                {}
            )
        );
        const cleanupFunctions: Array<() => void> = [];

        // Create SSE connections for all buttons in the trade type
        tradeTypeConfigs[params.trade_type].buttons.forEach((button) => {
            const cleanup = createSSEConnection({
                params: {
                    action: "contract_price",
                    duration: formatDuration(Number(params.duration), params.durationType),
                    trade_type: button.contractType,
                    instrument: "R_100",
                    currency: params.currency,
                    payout: params.stake || "0",
                    strike: params.stake || "0",
                },
                headers: params.token ? { Authorization: `Bearer ${params.token}` } : undefined,
                onMessage: (priceData: ContractPriceResponse) => {
                    setLoadingStates((prev) => ({ ...prev, [button.actionName]: false }));
                    setPayouts((prev) => ({
                        ...prev,
                        values: {
                            ...prev.values,
                            [button.actionName]: Number(priceData.price),
                        },
                    }));
                },
                onError: () =>
                    setLoadingStates((prev) => ({ ...prev, [button.actionName]: false })),
                onOpen: () => setLoadingStates((prev) => ({ ...prev, [button.actionName]: true })),
            });

            cleanupFunctions.push(cleanup);
        });

        // Return a cleanup function that calls all individual cleanup functions
        return () => {
            cleanupFunctions.forEach((cleanup) => cleanup());
        };
    }, [
        params.stake,
        params.duration,
        params.durationType,
        params.trade_type,
        params.currency,
        params.token,
    ]);

    return { loading, loadingStates, payouts };
};
