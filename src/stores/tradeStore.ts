import { create } from "zustand";
import { TradeType, tradeTypeConfigs, TradeButton } from "@/config/tradeTypes";
import {
    ContractDetails,
    contractDetailsStub,
} from "@/screens/ContractDetailsPage/contractDetailsStub";
import { ProductConfigResponse } from "@/api/services/product/types";
import {
    Contract,
    OpenContractsResponse,
    ClosedContractsResponse,
} from "@/api/services/contract/types";

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
    /** Display name for the current trade type */
    tradeTypeDisplayName: string;
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

    // Positions State
    /** Open positions from API */
    openPositions: Contract[];
    /** Closed positions from API */
    closedPositions: Contract[];
    /** Loading state for positions */
    positionsLoading: boolean;
    /** Error state for positions */
    positionsError: Error | null;

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

    // Positions Actions
    /** Set open positions from API response */
    setOpenPositions: (response: OpenContractsResponse) => void;
    /** Set closed positions from API response */
    setClosedPositions: (response: ClosedContractsResponse) => void;
    /** Set the loading state for positions */
    setPositionsLoading: (isLoading: boolean) => void;
    /** Set the error state for positions */
    setPositionsError: (error: Error | null) => void;
}

export const useTradeStore = create<TradeState>((set) => ({
    // Trade State
    stake: "10",
    duration: "5 minutes",
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
    contractDetails: contractDetailsStub, // Initialize with stub data

    // Product Config State
    productConfig: null,
    isConfigLoading: false,
    configError: null,
    configCache: {},

    // Positions State
    openPositions: [],
    closedPositions: [],
    positionsLoading: false,
    positionsError: null,

    // Trade Actions
    setStake: (stake) => set({ stake }),
    setDuration: (duration) => set({ duration }),
    toggleAllowEquals: () => set((state) => ({ allowEquals: !state.allowEquals })),
    setAllowEquals: (allowEquals: boolean) => set({ allowEquals }),
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
    setContractDetails: (details) => set({ contractDetails: details }),

    // Product Config Actions
    setProductConfig: (config: ProductConfigResponse | null) => set({ productConfig: config }),
    setConfigLoading: (loading: boolean) => set({ isConfigLoading: loading }),
    setConfigError: (error: Error | null) => set({ configError: error }),
    setConfigCache: (cache: Record<string, ProductConfigResponse>) => set({ configCache: cache }),

    // Positions Actions
    setOpenPositions: (response) =>
        set({
            openPositions: response.data.contracts.map((contract) => ({
                contract_id: contract.contract_id,
                product_id: contract.product_id,
                details: contract.contract_details,
            })),
        }),

    setClosedPositions: (response) =>
        set({
            closedPositions: response.data.contracts.map((contract) => ({
                contract_id: contract.contract_id,
                product_id: contract.product_id,
                details: contract.contract_details,
            })),
        }),

    setPositionsLoading: (isLoading) => set({ positionsLoading: isLoading }),
    setPositionsError: (error) => set({ positionsError: error }),
}));
