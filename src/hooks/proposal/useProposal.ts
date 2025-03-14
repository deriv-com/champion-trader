import { useSSESubscription } from "@/api/hooks";
import { subscribeToProposalStream } from "@/api/services/proposal/proposal-sse";
import { ProposalRequest, ProposalData } from "@/api/services/proposal/types";

/**
 * Hook for subscribing to proposal stream
 * @param params Proposal request parameters including:
 * - product_id: e.g., "rise_fall"
 * - instrument_id: e.g., "frxUSDJPY"
 * - duration: e.g., 900
 * - duration_unit: e.g., "seconds"
 * - allow_equals: e.g., false
 * - stake: e.g., "2.00"
 * - account_uuid: e.g., "9f8c1b23-4e2a-47ad-92c2-b1e5d2a7e65f"
 * @param options Additional options for the subscription
 * @returns Subscription result with proposal data containing variants for rise and fall
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
