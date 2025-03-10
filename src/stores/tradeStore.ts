import { create } from "zustand";
import { TradeType, tradeTypeConfigs, TradeButton } from "@/config/tradeTypes";
import {
    ContractDetails,
    contractDetailsStub,
} from "@/screens/ContractDetailsPage/contractDetailsStub";
import { ProductConfigResponse } from "@/services/api/rest/product-config/types";

/**
 * Trade Store
 *
 * Manages the state for trade parameters and configuration.
 * Integrates with the trade type configuration system and product configuration.
 *
 * @example
 * ```typescript
 * const { trade_type, setTradeType, productConfig } = useTradeStore();
 *
 * // Change trade type
 * setTradeType('rise_fall');
 * ```
 */

/**
 * Payout values for trade buttons
 */
interface Payouts {
    max: number;
    values: Record<string, number>; // Map button actionName to payout value
}

/**
 * Trade store state and actions
 */
export interface TradeState {
    // State
    /** Current stake amount (numeric value only) */
    stake: string;
    /** Duration value with unit */
    duration: string;
    /** Whether equals option is enabled */
    allowEquals: boolean;
    /** Current trade type (from trade type configuration) */
    trade_type: TradeType;
    /** Display name for the current trade type */
    tradeTypeDisplayName: string;
    /** Current trading instrument */
    instrument: string;
    /** Payout values for each button */
    payouts: Payouts;

    // Actions
    /** Set the stake amount */
    setStake: (stake: string) => void;
    /** Set the duration value */
    setDuration: (duration: string) => void;
    /** Toggle the equals option */
    toggleAllowEquals: () => void;
    /** Update all payout values */
    setPayouts: (payouts: Payouts) => void;
    /** Set the current trading instrument */
    setInstrument: (instrument: string) => void;
    /**
     * Set the current trade type
     * This will update the form fields and buttons based on the trade type configuration
     * and set the display name if provided
     *
     * @param trade_type - Trade type from configuration
     * @param display_name - Optional display name to override the default
     */
    setTradeType: (trade_type: TradeType, display_name?: string) => void;
    /**
     * Set the display name for the current trade type
     *
     * @param displayName - The display name to set
     */
    setTradeTypeDisplayName: (displayName: string) => void;
    /** Current contract details */
    contractDetails: ContractDetails | null;
    /** Set contract details */
    setContractDetails: (details: ContractDetails | null) => void;

    // Product Config State
    /** Product configuration from API */
    productConfig: ProductConfigResponse | null;
    /** Loading state for product config */
    isConfigLoading: boolean;
    /** Error state for product config */
    configError: Error | null;
    /** Cache for product config responses */
    configCache: Record<string, ProductConfigResponse>;

    // Product Config State Actions
    /** Set the product configuration */
    setProductConfig: (config: ProductConfigResponse | null) => void;
    /** Set the loading state */
    setConfigLoading: (loading: boolean) => void;
    /** Set the error state */
    setConfigError: (error: Error | null) => void;
    /** Set the config cache */
    setConfigCache: (cache: Record<string, ProductConfigResponse>) => void;
}

export const useTradeStore = create<TradeState>((set) => ({
    stake: "10",
    duration: "5 minute",
    allowEquals: false,
    trade_type: "rise_fall", // Default to rise_fall trade type
    tradeTypeDisplayName: "", // Initialize with empty string
    instrument: "R_100", // Default to R_100
    payouts: {
        max: 50000,
        values: {
            buy_rise: 19.5,
            buy_fall: 19.5,
        },
    },
    setStake: (stake) => set({ stake }),
    setDuration: (duration) => set({ duration }),
    toggleAllowEquals: () => set((state) => ({ allowEquals: !state.allowEquals })),
    setPayouts: (payouts) => set({ payouts }),
    setInstrument: (instrument: string) => set({ instrument }),
    setTradeType: (trade_type: TradeType, display_name?: string) =>
        set((state) => ({
            trade_type,
            // Set display name if passed else use default value from config
            tradeTypeDisplayName: display_name || tradeTypeConfigs[trade_type].displayName,
            // Reset payouts for the new trade type with default values
            payouts: {
                max: state.payouts.max,
                values: tradeTypeConfigs[trade_type].buttons.reduce(
                    (acc: Record<string, number>, button: TradeButton) => {
                        acc[button.actionName] = 0;
                        return acc;
                    },
                    {}
                ),
            },
        })),
    setTradeTypeDisplayName: (displayName: string) => set({ tradeTypeDisplayName: displayName }),
    contractDetails: contractDetailsStub, // Initialize with stub data
    setContractDetails: (details) => set({ contractDetails: details }),

    // Product Config State
    productConfig: null,
    isConfigLoading: false,
    configError: null,
    configCache: {},

    // Trade Actions
    setAllowEquals: (allowEquals: boolean) => set({ allowEquals }),

    // Product Config Actions
    setProductConfig: (config: ProductConfigResponse | null) => set({ productConfig: config }),
    setConfigLoading: (loading: boolean) => set({ isConfigLoading: loading }),
    setConfigError: (error: Error | null) => set({ configError: error }),
    setConfigCache: (cache: Record<string, ProductConfigResponse>) => set({ configCache: cache }),
}));
