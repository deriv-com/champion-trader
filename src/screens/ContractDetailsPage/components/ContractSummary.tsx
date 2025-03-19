import React from "react";
import { Contract } from "@/api/services/contract/types";
import { useContractSummaryData } from "@/hooks/contract/useContractSummaryData";
import { ContractSummaryInfo } from "./ContractSummaryInfo";
import { ContractSummaryDetails } from "./ContractSummaryDetails";

interface ContractSummaryProps {
    contract?: Contract;
    showCloseButton?: boolean;
    isClosing?: boolean;
    onClose?: (contractId: string) => void;
    className?: string;
    containerClassName?: string;
}

export const ContractSummary: React.FC<ContractSummaryProps> = ({
    contract,
    showCloseButton = false,
    isClosing = false,
    onClose,
    className = "",
    containerClassName = "",
}) => {
    // Extract contract data using our custom hook
    const contractData = useContractSummaryData(contract);

    if (!contractData.type) {
        return null;
    }

    // Calculate profit as potential_payout - stake
    // const profit =
    //     parseFloat(contractDetails.potential_payout || "0") -
    //     parseFloat(contractDetails.stake || "0");
    const handleClose = (e: React.MouseEvent) => {
        console.log("handleClose in ContractSummary");
        e.stopPropagation();
        if (onClose && contractData.contractId) {
            onClose(contractData.contractId);
        }
    };

    // Default container styles for mobile view
    const defaultContainerClass = "h-[104px] w-full p-4 bg-theme rounded-lg border-b border-theme";
    const containerStyle = {
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
    };

    return (
        <div
            className={`${containerClassName || defaultContainerClass} ${className}`}
            style={containerClassName ? {} : containerStyle}
        >
            <div className="flex justify-between">
                <ContractSummaryInfo
                    type={contractData.type}
                    market={contractData.market}
                    marketSymbol={contract?.details.instrument_id}
                />

                <ContractSummaryDetails
                    duration={contractData.duration}
                    stake={contractData.stake}
                    profit={contractData.profit}
                    currency={contractData.currency}
                    isOpen={contractData.isOpen}
                />
            </div>

            {showCloseButton && contractData.isOpen && (
                <button
                    className="w-full h-6 flex items-center justify-center py-2 border border-theme text-xs font-bold rounded-[8] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleClose}
                    disabled={isClosing || !contractData.isValidToSell}
                >
                    {isClosing
                        ? "Closing..."
                        : `Close ${contractData.stake} ${contractData.currency}`}
                </button>
            )}
        </div>
    );
};
