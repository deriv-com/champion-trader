import { createSSEConnection } from "@/api/base/sse";
import { ProposalRequest, ProposalData } from "./types";

/**
 * Subscribe to proposal stream for real-time price updates
 * @param params Proposal request parameters
 * @param callbacks Callbacks for handling data and errors
 * @returns Cleanup function to unsubscribe
 */
export const subscribeToProposalStream = (
    params: ProposalRequest,
    callbacks: {
        onData: (data: ProposalData) => void;
        onError?: (error: any) => void;
    }
): (() => void) => {
    return createSSEConnection({
        params: {
            action: "subscribe",
            stream: "proposal",
            ...Object.entries(params).reduce(
                (acc, [key, value]) => {
                    // Only include defined values in the parameters
                    if (value !== undefined) {
                        acc[key] = value.toString();
                    }
                    return acc;
                },
                {} as Record<string, string>
            ),
        },
        customPath: "/v1/trading/proposal/stream", // Use the new API endpoint path
        onMessage: callbacks.onData,
        onError: callbacks.onError,
    });
};
