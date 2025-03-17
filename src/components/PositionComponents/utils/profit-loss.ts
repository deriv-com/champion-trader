import { Contract } from "@/api/services/contract/types";

/**
 * Extracts the numeric profit/loss value from a string
 * @param profitLossStr The profit/loss string (e.g., "+0.00" or "-2.00")
 * @returns The numeric value
 */
export const extractProfitLoss = (profitLossStr: string): number => {
    // If format is like "+0.00 / -2.00", take the first part
    const parts = profitLossStr.split("/");
    const valueStr = parts[0].trim();
    // Remove any non-numeric characters except decimal point and minus sign
    const numericStr = valueStr.replace(/[^0-9.-]/g, "");
    return parseFloat(numericStr) || 0;
};

/**
 * Calculates the total profit/loss from an array of contracts
 * @param contracts Array of contracts
 * @returns Formatted total profit/loss string
 */
export const calculateTotalProfitLoss = (contracts: Contract[]): string => {
    if (!contracts || contracts.length === 0) {
        return "0.00";
    }

    const total = contracts.reduce((sum, contract) => {
        return sum + extractProfitLoss(contract.details.profit_loss);
    }, 0);

    return total.toFixed(2);
};
