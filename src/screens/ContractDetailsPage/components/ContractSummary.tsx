import React from "react";
import { useTradeStore } from "@/stores/tradeStore";
import { MarketIcon } from "@/components/MarketSelector/MarketIcon";
import { Contract } from "@/api/services/contract/types";

interface ContractSummaryProps {
    contract?: Contract;
    variant?: "mobile" | "desktop";
    showCloseButton?: boolean;
    onClose?: (contractId: string) => void;
}

export const ContractSummary: React.FC<ContractSummaryProps> = ({
    contract,
    variant = "mobile",
    showCloseButton = false,
    onClose,
}) => {
    const contractDetails = useTradeStore((state) => state.contractDetails);

    // Use provided contract or fall back to contractDetails from tradeStore
    if (!contract && !contractDetails) {
        return null;
    }

    let type, market, stake, profit, duration, currency, isOpen;

    // If we have a contract from the API, use its data
    if (contract) {
        const { details } = contract;
        type = details.variant.charAt(0).toUpperCase() + details.variant.slice(1);
        market = details.instrument_name || details.instrument_id;
        stake = details.stake;
        currency = details.bid_price_currency;
        isOpen = !details.is_sold && !details.is_expired;

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
        ({ type, market, stake, profit } = contractDetails!);
        duration = "0/10 ticks";
        currency = "USD";
        isOpen = true;
    }

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClose && contract) {
            onClose(contract.contract_id);
        }
    };
    // Mobile variant
    if (variant === "mobile") {
        return (
            <div
                className="h-[104px] w-full p-4 bg-theme rounded-lg border-b border-theme"
                style={{
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
                }}
            >
                <div className="flex justify-between">
                    <div>
                        <div className="mb-1">
                            <MarketIcon
                                symbol={contract?.details.instrument_id || "R_100"}
                                size="small"
                            />
                        </div>
                        <div>
                            <div className="overflow-hidden text-ellipsis text-theme font-ibm-plex text-[14px] leading-[22px] font-normal pb-1">
                                {type}
                            </div>
                            <div className="overflow-hidden text-ellipsis text-theme-muted font-ibm-plex text-[14px] leading-[22px] font-normal">
                                {market}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-theme-muted font-ibm-plex text-[14px] leading-[22px] font-normal text-right bg-theme-secondary/50 px-2 rounded-md mb-1 py-0.5 inline-block">
                            {duration}
                        </div>
                        <div className="overflow-hidden text-ellipsis text-theme-muted mb-1 font-ibm-plex text-[14px] leading-[22px] font-normal text-right">{`${stake} ${currency}`}</div>
                        <div
                            className={`font-ibm-plex text-[14px] leading-[22px] font-normal text-right ${
                                profit.includes("+") ? "text-[#008832]" : "text-red-500"
                            }`}
                        >
                            {`${profit} ${currency}`}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Desktop variant
    return (
        <>
            <div className="flex justify-between text-sm font-medium">
                <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                        <img src="/market icon.svg" alt="Market Icon" className="w-5 h-8 mb-1" />
                    </div>
                    <span className="mb-[5] font-light text-theme">{type}</span>
                    <span className="text-s font-light text-theme-muted mb-4">{market}</span>
                </div>
                <div>
                    <div className="flex flex-col items-end">
                        {isOpen ? (
                            <span className="text-theme-muted w-35 text-xs flex items-center bg-theme-secondary px-2 py-1 rounded-md border border-transparent hover:border-theme mb-3">
                                <span className="mr-2">⏳</span> {duration}
                            </span>
                        ) : (
                            <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-medium mb-3">
                                Closed
                            </span>
                        )}
                        <span className="text-s font-light text-theme-muted mb-[2]">
                            {`${stake} ${currency}`}
                        </span>
                        <span
                            className={`text-sm ${
                                profit.includes("+") ? "text-[#008832]" : "text-red-500"
                            }`}
                        >
                            {`${profit} ${currency}`}
                        </span>
                    </div>
                </div>
            </div>
            {showCloseButton && isOpen && contract?.details.is_valid_to_sell && (
                <button
                    className="w-full h-6 flex items-center justify-center py-2 border border-theme text-xs font-bold rounded-[8] mt-2"
                    onClick={handleClose}
                >
                    Close {`${stake} ${currency}`}
                </button>
            )}
        </>
    );
};
