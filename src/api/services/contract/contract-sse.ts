import { createSSEConnection } from "@/api/base/sse";
import { OpenContract, ClosedContract } from "./types";

/**
 * Subscribe to open contracts stream
 * @param callbacks Callbacks for handling data and errors
 * @returns Cleanup function to unsubscribe
 */
export const subscribeToOpenContracts = (callbacks: {
    onData: (data: OpenContract) => void;
    onError?: (error: any) => void;
}): (() => void) => {
    return createSSEConnection({
        params: {
            action: "subscribe",
            stream: "open_contracts",
        },
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
    onData: (data: ClosedContract) => void;
    onError?: (error: any) => void;
}): (() => void) => {
    return createSSEConnection({
        params: {
            action: "subscribe",
            stream: "closed_contracts",
        },
        onMessage: callbacks.onData,
        onError: callbacks.onError,
    });
};
