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
interface TradeState {
    // Trade State
    /** Current stake amount (numeric value only) */
    stake: string;
    /** Duration value with unit */
    duration: string;
    /** Whether equals option is enabled */
    allowEquals: boolean;
    /** Current trade type (from trade type configuration) */
    trade_type: TradeType;
    /** Current trading instrument */
    instrument: string;
    /** Payout values for each button */
    payouts: Payouts;
    /** Current contract details */
    contractDetails: ContractDetails | null;

    // Product Config State
    /** Product configuration from API */
    productConfig: ProductConfigResponse | null;
    /** Loading state for product config */
    isConfigLoading: boolean;
    /** Error state for product config */
    configError: Error | null;
    /** Cache for product config responses */
    configCache: Record<string, ProductConfigResponse>;

    // Trade Actions
    /** Set the stake amount */
    setStake: (stake: string) => void;
    /** Set the duration value */
    setDuration: (duration: string) => void;
    /** Toggle the equals option */
    toggleAllowEquals: () => void;
    /** Set the equals option directly */
    setAllowEquals: (allowEquals: boolean) => void;
    /** Update all payout values */
    setPayouts: (payouts: Payouts) => void;
    /** Set the current trading instrument */
    setInstrument: (instrument: string) => void;
    /** Set the current trade type */
    setTradeType: (trade_type: TradeType) => void;
    /** Set contract details */
    setContractDetails: (details: ContractDetails | null) => void;

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
    // Trade State
    stake: "10",
    duration: "5 minutes",
    allowEquals: false,
    trade_type: "rise_fall",
    instrument: "R_100",
    payouts: {
        max: 50000,
        values: {
            buy_rise: 19.5,
            buy_fall: 19.5,
        },
    },
    contractDetails: contractDetailsStub,

    // Product Config State
    productConfig: null,
    isConfigLoading: false,
    configError: null,
    configCache: {},

    // Trade Actions
    setStake: (stake) => set({ stake }),
    setDuration: (duration) => set({ duration }),
    toggleAllowEquals: () => set((state) => ({ allowEquals: !state.allowEquals })),
    setAllowEquals: (allowEquals: boolean) => set({ allowEquals }),
    setPayouts: (payouts) => set({ payouts }),
    setInstrument: (instrument: string) => set({ instrument }),

    // Product Config Actions
    setProductConfig: (config: ProductConfigResponse | null) => set({ productConfig: config }),
    setConfigLoading: (loading: boolean) => set({ isConfigLoading: loading }),
    setConfigError: (error: Error | null) => set({ configError: error }),
    setConfigCache: (cache: Record<string, ProductConfigResponse>) => set({ configCache: cache }),
    setTradeType: (trade_type: TradeType) =>
        set((state) => ({
            trade_type,
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
    setContractDetails: (details) => set({ contractDetails: details }),
}));
