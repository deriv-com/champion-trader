import { createSSEConnection } from "@/api/base/sse";
import { BalanceResponse } from "./types";

/**
 * Subscribe to balance stream
 * @param callbacks Callbacks for handling data and errors
 * @returns Cleanup function to unsubscribe
 */
export const subscribeToBalanceStream = (callbacks: {
    onData: (data: BalanceResponse["data"]) => void;
    onError?: (error: any) => void;
}): (() => void) => {
    return createSSEConnection({
        params: {
            action: "subscribe",
            stream: "balance",
        },
        onMessage: callbacks.onData,
        onError: callbacks.onError,
    });
};

/**
 * Subscribe to balance updates for a specific account
 * @param accountUuid The account UUID to get balance for
 * @param onData Callback function to handle balance data
 * @param onError Callback function to handle errors
 * @returns Cleanup function to unsubscribe from balance updates
 */
export const subscribeToBalance = (
    accountUuid: string,
    onData: (data: BalanceResponse) => void,
    onError?: (error: any) => void
) => {
    const wrappedOnData = (data: BalanceResponse) => {
        onData(data);
    };

    const wrappedOnError = (error: any) => {
        if (onError) onError(error);
    };

    const cleanup = createSSEConnection({
        params: {
            account_uuid: accountUuid,
        },
        customPath: "/v1/accounting/balance/stream",
        onMessage: wrappedOnData,
        onError: wrappedOnError,
    });

    // Wrap the cleanup function to add logging
    return () => {
        cleanup();
    };
};
