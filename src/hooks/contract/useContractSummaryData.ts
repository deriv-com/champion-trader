import { useTradeStore } from "@/stores/tradeStore";
import { Contract } from "@/api/services/contract/types";

export interface ContractData {
    type: string;
    market: string;
    stake: string;
    profit: string;
    duration: string;
    currency: string;
    isOpen: boolean;
    contractId?: string;
    isValidToSell?: boolean;
}

/**
 * Hook to extract and format contract data from a Contract object or from the trade store
 * @param contract Optional Contract object to extract data from
 * @returns Formatted contract data
 */
export const useContractSummaryData = (contract?: Contract): ContractData => {
    const contractDetails = useTradeStore((state) => state.contractDetails);

    // Use provided contract or fall back to contractDetails from tradeStore
    if (!contract && !contractDetails) {
        return {
            type: "",
            market: "",
            stake: "",
            profit: "",
            duration: "",
            currency: "",
            isOpen: false,
        };
    }

    let type, market, stake, profit, duration, currency, isOpen, contractId, isValidToSell;

    // If we have a contract from the API, use its data
    if (contract) {
        const { details } = contract;
        type = details.variant.charAt(0).toUpperCase() + details.variant.slice(1);
        market = details.instrument_name || details.instrument_id;
        stake = details.stake;
        currency = details.bid_price_currency;
        isOpen = !details.is_sold && !details.is_expired;
        contractId = contract.contract_id;
        isValidToSell = details.is_valid_to_sell;

        // Parse profit/loss string (format: "+0.00 / -2.00")
        const profitLossParts = details.profit_loss.split("/");
        profit = profitLossParts[0].trim();

        // Format duration based on duration_unit
        if (details.duration && details.duration_unit) {
            if (details.duration_unit === "seconds") {
                if (details.duration < 60) {
                    duration = `${details.duration} seconds`;
                } else if (details.duration < 3600) {
                    duration = `${Math.floor(details.duration / 60)} minutes`;
                } else {
                    duration = `${Math.floor(details.duration / 3600)} hours`;
                }
            } else {
                duration = `${details.duration} ${details.duration_unit}`;
            }
        } else {
            duration = "0/10 ticks";
        }
    } else {
        // Fall back to contractDetails from tradeStore
        // Map properties correctly from contractDetails
        type = contractDetails!.variant.charAt(0).toUpperCase() + contractDetails!.variant.slice(1);
        market = contractDetails!.instrument_id;
        stake = contractDetails!.stake;
        // Calculate profit or use a default value
        profit = (
            parseFloat(contractDetails!.bid_price) - parseFloat(contractDetails!.buy_price)
        ).toFixed(2);
        duration = "0/10 ticks";
        currency = contractDetails!.bid_price_currency;
        isOpen = !contractDetails!.is_sold && !contractDetails!.is_expired;
        isValidToSell = contractDetails!.is_valid_to_sell;
        contractId = contractDetails!.contract_id;
    }

    return {
        type,
        market,
        stake,
        profit,
        duration,
        currency,
        isOpen,
        contractId,
        isValidToSell,
    };
};
