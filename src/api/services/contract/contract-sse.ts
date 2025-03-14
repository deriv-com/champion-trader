import { createSSEConnection } from "@/api/base/sse";
import { OpenContractsResponse, ClosedContractsResponse } from "./types";

/**
 * Subscribe to open contracts stream
 * @param callbacks Callbacks for handling data and errors
 * @returns Cleanup function to unsubscribe
 */
export const subscribeToOpenContracts = (callbacks: {
    onData: (data: OpenContractsResponse) => void;
    onError?: (error: any) => void;
}): (() => void) => {
    return createSSEConnection({
        customPath: "/v1/trading/contracts/open/stream",
        params: {},
        onMessage: callbacks.onData,
        onError: callbacks.onError,
    });
};

/**
 * Subscribe to closed contracts stream
 * @param callbacks Callbacks for handling data and errors
 * @returns Cleanup function to unsubscribe
 */
export const subscribeToClosedContracts = (callbacks: {
    onData: (data: ClosedContractsResponse) => void;
    onError?: (error: any) => void;
}): (() => void) => {
    return createSSEConnection({
        customPath: "/v1/trading/contracts/close/stream",
        params: {},
        onMessage: callbacks.onData,
        onError: callbacks.onError,
    });
};
