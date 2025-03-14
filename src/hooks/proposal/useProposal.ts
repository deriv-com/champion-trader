import { useSSESubscription } from "@/api/hooks";
import { subscribeToProposalStream } from "@/api/services/proposal/proposal-sse";
import { ProposalRequest, ProposalData } from "@/api/services/proposal/types";
import { useTradeStore } from "@/stores/tradeStore";
import { useClientStore } from "@/stores/clientStore";
import { useMemo } from "react";

/**
 * Helper function to parse duration string into value and unit
 * @param durationString Duration string from tradeStore (e.g., "5 minutes")
 * @returns Tuple of [value, unit]
 */
const parseDuration = (durationString: string): [number, string] => {
    const match = durationString.match(/(\d+)\s+(\w+)/);
    if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();
        return [value, unit];
    }
    return [0, ""];
};

/**
 * Hook for subscribing to proposal stream
 * @param options Additional options for the subscription
 * @returns Subscription result with proposal data containing variants for rise and fall
 */
export const useProposalStream = (options?: { enabled?: boolean }) => {
    // Get parameters directly from tradeStore
    const { trade_type, instrument, stake, duration, allowEquals, productConfig } = useTradeStore();

    // Get account_uuid from clientStore
    const { account_uuid } = useClientStore();

    // Parse duration into value and unit
    const [durationValue, durationUnit] = parseDuration(duration);

    // Default enabled to true if not provided, and ensure productConfig is available
    const isEnabled =
        (options?.enabled !== undefined ? options.enabled : true) &&
        Boolean(productConfig?.data) &&
        !!durationValue &&
        !!durationUnit;

    // Create proposal parameters from store values
    const proposalParams = useMemo<ProposalRequest>(
        () => ({
            product_id: trade_type,
            instrument_id: instrument,
            duration: durationValue,
            duration_unit: durationUnit,
            allow_equals: allowEquals,
            stake: stake,
            ...(account_uuid ? { account_uuid } : {}),
        }),
        [trade_type, instrument, durationValue, durationUnit, allowEquals, stake, account_uuid]
    );

    // ALWAYS call useSSESubscription, but conditionally create the subscription
    const { data, error } = useSSESubscription<ProposalData>(
        (onData: (data: ProposalData) => void, onError: (error: any) => void) => {
            // Only create subscription if enabled
            if (!isEnabled) {
                return () => {}; // Return no-op cleanup function
            }

            // Use the current proposal parameters
            return subscribeToProposalStream(proposalParams, { onData, onError });
        },
        // Include all parameters in the dependency array
        [isEnabled, proposalParams]
    );

    // If not enabled, return null data and error
    if (!isEnabled) {
        return { data: null, error: null };
    }

    return { data, error };
};
