import { useSSESubscription } from "@/api/hooks";
import { subscribeToProposalStream } from "@/api/services/proposal/proposal-sse";
import { ProposalRequest, ProposalData } from "@/api/services/proposal/types";

/**
 * Hook for subscribing to proposal stream
 * @param params Proposal request parameters
 * @param options Additional options for the subscription
 * @returns Subscription result with proposal data
 */
export const useProposalStream = (
    params: ProposalRequest,
    options?: {
        enabled?: boolean;
    }
) => {
    return useSSESubscription<ProposalData>(
        (onData: (data: ProposalData) => void, onError: (error: any) => void) =>
            subscribeToProposalStream(params, { onData, onError }),
        [params, options?.enabled]
    );
};
