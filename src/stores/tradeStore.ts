import { create } from "zustand"
import { TradeType, tradeTypeConfigs, TradeButton } from "@/config/tradeTypes"

/**
 * Trade Store
 *
 * Manages the state for trade parameters and configuration.
 * Integrates with the trade type configuration system.
 *
 * @example
 * ```typescript
 * const { trade_type, setTradeType } = useTradeStore();
 *
 * // Change trade type
 * setTradeType('rise_fall');
 * ```
 */

/**
 * Payout values for trade buttons
 */
interface Payouts {
  max: number
  values: Record<string, number> // Map button actionName to payout value
}

/**
 * Trade store state and actions
 */
export interface TradeState {
  // State
  /** Current stake amount (numeric value only) */
  stake: string
  /** Duration value with unit */
  duration: string
  /** Whether equals option is enabled */
  allowEquals: boolean
  /** Current trade type (from trade type configuration) */
  trade_type: TradeType
  /** Current trading instrument */
  instrument: string
  /** Payout values for each button */
  payouts: Payouts

  // Actions
  /** Set the stake amount */
  setStake: (stake: string) => void
  /** Set the duration value */
  setDuration: (duration: string) => void
  /** Toggle the equals option */
  toggleAllowEquals: () => void
  /** Update all payout values */
  setPayouts: (payouts: Payouts) => void
  /**
   * Set the current trade type
   * This will update the form fields and buttons based on the trade type configuration
   *
   * @param trade_type - Trade type from configuration
   */
  setTradeType: (trade_type: TradeType) => void
}

export const useTradeStore = create<TradeState>((set) => ({
  stake: "10",
  duration: "5 minute",
  allowEquals: false,
  trade_type: "rise_fall", // Default to rise_fall trade type
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
  setSymbol: (symbol: string) => set({ symbol }),
  toggleAllowEquals: () =>
    set((state) => ({ allowEquals: !state.allowEquals })),
  setPayouts: (payouts) => set({ payouts }),
  setInstrument: (instrument: string) => set({ instrument }),
  setTradeType: (trade_type: TradeType) =>
    set((state) => ({
      trade_type,
      // Reset payouts for the new trade type with default values
      payouts: {
        max: state.payouts.max,
        values: tradeTypeConfigs[trade_type].buttons.reduce(
          (acc: Record<string, number>, button: TradeButton) => {
            acc[button.actionName] = 0
            return acc
          },
          {}
        ),
      },
    })),
}))
