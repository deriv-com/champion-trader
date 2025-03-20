import { useTradeStore } from "@/stores/tradeStore";
import { useClientStore } from "@/stores/clientStore";
import { useToastStore } from "@/stores/toastStore";
import { useOrientationStore } from "@/stores/orientationStore";
import { useBuyContract, useSellContract } from "@/hooks/contract/useContract";
import {
    BuyContractResponse,
    SellContractResponse,
    ContractDetails,
} from "@/api/services/contract/types";
import { TradeNotification } from "@/components/ui/trade-notification";
import { StandaloneFlagCheckeredFillIcon } from "@deriv/quill-icons";
import { parseDuration } from "@/utils/duration";
import { v4 as uuidv4 } from "uuid";
import { BuyAction } from "@/config/tradeTypes";

export type TradeAction =
    | "buy_rise"
    | "buy_fall"
    | "buy_higher"
    | "buy_lower"
    | "buy_touch"
    | "buy_no_touch"
    | "buy_multiplier"
    | "sell_contract";

// Map of action names to their variant values
const ACTION_VARIANT_MAP: Record<BuyAction, string> = {
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
    const { toast, hideToast } = useToastStore();

    // Use the hooks from useContract.ts with success and error callbacks
    const { mutate: buyContractMutate } = useBuyContract({
        onSuccess: (data) => {
            // Show success toast
            toast({
                content: `Successfully bought contract: ${data.data.contract_id}`,
                variant: "success",
            });

            // Update contract details in store if needed
            if (data.data.contract_details) {
                setContractDetails({
                    contract_id: data.data.contract_id,
                    product_id: data.data.product_id,
                    buy_price: data.data.buy_price,
                    buy_time: data.data.buy_time,
                    instrument_id: instrument,
                    ...data.data.contract_details,
                });
            }
        },
        onError: (error) => {
            // Show error toast
            toast({
                content: error instanceof Error ? error.message : "Failed to buy contract",
                variant: "error",
            });
        },
    });

    const { mutate: sellContractMutate } = useSellContract({
        onSuccess: (data) => {
            // Show success toast
            toast({
                content: `Successfully closed contract: ${data.data.contract_id}`,
                variant: "success",
            });
        },
        onError: (error) => {
            // Show error toast
            toast({
                content: error instanceof Error ? error.message : "Failed to close contract",
                variant: "error",
            });
        },
    });

    // Generic function to handle buying a contract
    const handleBuyAction = async (actionName: BuyAction): Promise<BuyContractResponse> => {
        try {
            // Parse duration into value and unit
            const parsedDuration = parseDuration(duration);
            const variant = ACTION_VARIANT_MAP[actionName];
            const payout = payouts.values[actionName]?.toString() || "0";

            // Create the request body
            const requestBody = {
                idempotency_key: uuidv4(),
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
            // Add account_uuid to the request if available
            const requestWithAccount = account_uuid
                ? { ...requestBody, account_uuid }
                : requestBody;
            // Validate required fields before making the request
            if (!instrument) {
                throw new Error("Instrument ID is required");
            }
            if (!trade_type) {
                throw new Error("Product ID is required");
            }
            if (!parsedDuration.value || !parsedDuration.type) {
                throw new Error("Duration and duration unit are required");
            }
            if (!stake || Number(stake) <= 0) {
                throw new Error("Valid stake amount is required");
            }
            if (!variant) {
                throw new Error("Trade variant is required");
            }
            if (!payout || Number(payout) <= 0) {
                throw new Error("Valid payout amount is required");
            }

            const response = await buyContractMutate(requestWithAccount);

            if (!response) {
                throw new Error("Failed to buy contract: No response received");
            }

            return response;
        } catch (error) {
            // Error is already handled in onError callback
            throw error;
        }
    };

    // Function to handle selling a contract with notifications
    const handleSellAction = async (
        contractId: string,
        contractDetails?: Partial<ContractDetails>,
        options?: {
            onSuccess?: (response: SellContractResponse) => void;
            onError?: (error: any) => void;
            setLoading?: (isLoading: boolean) => void;
        }
    ): Promise<SellContractResponse> => {
        // Set loading state if provided
        if (options?.setLoading) {
            options.setLoading(true);
        }

        try {
            // Call the API with contract_id and account_uuid as query parameters
            const response = await sellContractMutate({
                contract_id: contractId,
                ...(account_uuid ? { account_uuid } : {}),
            });

            // Handle null response
            if (!response) {
                throw new Error("Failed to sell contract: No response received");
            }

            // Get contract details either from parameter or response
            const details = contractDetails || response.data.contract_details;
            const isProfit = Number(response.data.profit) >= 0;
            const { isLandscape } = useOrientationStore.getState();

            // Show success toast with TradeNotification
            toast({
                content: (
                    <TradeNotification
                        stake={`${isProfit ? "Profit" : "Loss"}: ${response.data.profit} ${details.bid_price_currency || ""}`}
                        market={details.instrument_id || ""}
                        type={
                            details.variant
                                ? details.variant.charAt(0).toUpperCase() + details.variant.slice(1)
                                : ""
                        }
                        onClose={hideToast}
                        icon={
                            <div>
                                <StandaloneFlagCheckeredFillIcon
                                    fill={isProfit ? "#007a22" : "#FF4D4D"}
                                    iconSize="sm"
                                    className={`rounded-full bg-[${isProfit ? "#0088323D" : "#E6190E3D"}]`}
                                />
                            </div>
                        }
                    />
                ),
                duration: 3000,
                position: isLandscape ? "bottom-left" : "top-center",
            });

            // Call onSuccess callback if provided
            if (options?.onSuccess) {
                options.onSuccess(response);
            }

            return response;
        } catch (error: any) {
            // Extract error message from API response if available
            let errorMessage = "Failed to close contract";

            if (error.response?.data?.errors?.[0]?.message) {
                errorMessage = error.response.data.errors[0].message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            // Show error toast
            toast({
                content: errorMessage,
                variant: "error",
            });

            // Call onError callback if provided
            if (options?.onError) {
                options.onError(error);
            }

            // Error is already handled in onError callback
            throw error;
        } finally {
            // Reset loading state if provided
            if (options?.setLoading) {
                options.setLoading(false);
            }
        }
    };

    // Create action handlers for each buy action
    const buyActions: Record<BuyAction, () => Promise<BuyContractResponse>> = {
        buy_rise: async () => handleBuyAction("buy_rise"),
        buy_fall: async () => handleBuyAction("buy_fall"),
        buy_higher: async () => handleBuyAction("buy_higher"),
        buy_lower: async () => handleBuyAction("buy_lower"),
        buy_touch: async () => handleBuyAction("buy_touch"),
        buy_no_touch: async () => handleBuyAction("buy_no_touch"),
        buy_multiplier: async () => handleBuyAction("buy_multiplier"),
    };

    // Create a type for the actions object that includes both buy actions and sell_contract
    // Use an index signature to allow accessing any string key
    type ActionFunctions = {
        [K in BuyAction]: () => Promise<BuyContractResponse>;
    } & {
        sell_contract: (
            contractId: string,
            contractDetails?: Partial<ContractDetails>,
            options?: {
                onSuccess?: (response: SellContractResponse) => void;
                onError?: (error: unknown) => void;
                setLoading?: (isLoading: boolean) => void;
            }
        ) => Promise<SellContractResponse>;
    } & {
        // Add an index signature to handle any string key access
        [key: string]: ((...args: any[]) => Promise<any>) | undefined;
    };

    // Add the sell_contract action separately with backward compatibility
    const actions: ActionFunctions = {
        ...buyActions,
        sell_contract: (
            contractId: string,
            contractDetails?: Partial<ContractDetails>,
            options?: any
        ) => handleSellAction(contractId, contractDetails, options),
    };

    return actions;
};
