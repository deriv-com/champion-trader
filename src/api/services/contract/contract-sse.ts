import { createSSEConnection } from "@/api/base/sse";
import { OpenContractsResponse, ClosedContractsResponse } from "./types";

/**
 * Subscribe to open contracts stream
 * @param callbacks Callbacks for handling data and errors
 * @param contract_id Optional contract ID to filter results
 * @returns Cleanup function to unsubscribe
 */
export const subscribeToOpenContracts = (
    callbacks: {
        onData: (data: OpenContractsResponse) => void;
        onError?: (error: any) => void;
    },
    contract_id?: string
): (() => void) => {
    return createSSEConnection({
        customPath: "/v1/trading/contracts/open/stream",
        params: contract_id ? { contract_id } : {},
        onMessage: callbacks.onData,
        onError: callbacks.onError,
    });
};

/**
 * Subscribe to closed contracts stream
 * @param callbacks Callbacks for handling data and errors
 * @param contract_id Optional contract ID to filter results
 * @returns Cleanup function to unsubscribe
 */
export const subscribeToClosedContracts = (
    callbacks: {
        onData: (data: ClosedContractsResponse) => void;
        onError?: (error: any) => void;
    },
    contract_id?: string
): (() => void) => {
    return createSSEConnection({
        customPath: "/v1/trading/contracts/close/stream",
        params: contract_id ? { contract_id } : {},
        onMessage: callbacks.onData,
        onError: callbacks.onError,
    });
};
