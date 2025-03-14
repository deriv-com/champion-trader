import { useTradeStore } from "@/stores/tradeStore";
import { useClientStore } from "@/stores/clientStore";
import { useToastStore } from "@/stores/toastStore";
import { buyContract } from "@/api/services/contract/contract-rest";
import { parseDuration } from "@/utils/duration";
import { generateUUID } from "@/utils/uuid";

export type TradeAction =
    | "buy_rise"
    | "buy_fall"
    | "buy_higher"
    | "buy_lower"
    | "buy_touch"
    | "buy_no_touch"
    | "buy_multiplier";

// Map of action names to their variant values
const ACTION_VARIANT_MAP: Record<TradeAction, string> = {
    buy_rise: "rise",
    buy_fall: "fall",
    buy_higher: "higher",
    buy_lower: "lower",
    buy_touch: "touch",
    buy_no_touch: "no_touch",
    buy_multiplier: "multiplier",
};

export const useTradeActions = () => {
    const { trade_type, stake, duration, instrument, allowEquals, payouts, setContractDetails } =
        useTradeStore();
    const { account_uuid } = useClientStore();
    const { toast } = useToastStore();

    // Generic function to handle buying a contract
    const handleBuyAction = async (actionName: TradeAction) => {
        try {
            // Parse duration into value and unit
            const parsedDuration = parseDuration(duration);
            const variant = ACTION_VARIANT_MAP[actionName];
            const payout = payouts.values[actionName]?.toString() || "0";

            // Create the request body
            const requestBody = {
                idempotency_key: generateUUID(),
                product_id: trade_type,
                proposal_details: {
                    instrument_id: instrument,
                    duration: Number(parsedDuration.value),
                    duration_unit: parsedDuration.type,
                    allow_equals: allowEquals,
                    stake: stake,
                    variant: variant,
                    payout: payout,
                },
            };

            // Call the API
            const response = await buyContract(
                requestBody,
                account_uuid ? { account_uuid } : undefined
            );

            // Show success toast
            toast({
                content: `Successfully bought ${variant} contract: ${response.data.contract_id}`,
                variant: "success",
            });

            // Update contract details in store if needed
            if (response.data.contract_details) {
                setContractDetails({
                    contract_id: response.data.contract_id,
                    product_id: response.data.product_id,
                    buy_price: response.data.buy_price,
                    buy_time: response.data.buy_time,
                    ...response.data.contract_details,
                });
            }

            return response;
        } catch (error) {
            // Show error toast
            toast({
                content: error instanceof Error ? error.message : "Failed to buy contract",
                variant: "error",
            });
            throw error;
        }
    };

    // Create action handlers for each trade action
    const actions = {
        buy_rise: async () => handleBuyAction("buy_rise"),
        buy_fall: async () => handleBuyAction("buy_fall"),
        buy_higher: async () => handleBuyAction("buy_higher"),
        buy_lower: async () => handleBuyAction("buy_lower"),
        buy_touch: async () => handleBuyAction("buy_touch"),
        buy_no_touch: async () => handleBuyAction("buy_no_touch"),
        buy_multiplier: async () => handleBuyAction("buy_multiplier"),
    };

    return actions;
};
