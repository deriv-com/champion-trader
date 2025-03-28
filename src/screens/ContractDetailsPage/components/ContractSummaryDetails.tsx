import { cn } from "@/lib/utils";
import { StandaloneStopwatchRegularIcon } from "@deriv/quill-icons";
import React from "react";

interface ContractSummaryDetailsProps {
    duration: string;
    stake: string;
    profit: string;
    currency: string;
    isOpen: boolean;
    className?: string;
}

export const ContractSummaryDetails: React.FC<ContractSummaryDetailsProps> = ({
    duration,
    stake,
    profit,
    currency,
    isOpen,
    className = "",
}) => {
    return (
        <div className={`flex flex-col items-end ${className}`}>
            <div
                className={cn(
                    "text-theme-muted text-[14px] leading-[22px] font-normal text-right rounded-md mb-1 py-0.5 inline-block",
                    isOpen ? "bg-theme-secondary/50 px-2" : "px-0"
                )}
            >
                {isOpen ? (
                    <span className="flex items-center">
                        <StandaloneStopwatchRegularIcon fill="#737373" iconSize="sm" /> {duration}
                    </span>
                ) : (
                    <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-medium">
                        Closed
                    </span>
                )}
            </div>
            <div className="overflow-hidden text-ellipsis text-theme-muted mb-1 text-[14px] leading-[22px] font-normal text-right">
                {`${stake} ${currency}`}
            </div>
            <div
                className={`text-[14px] leading-[22px] font-normal text-right ${
                    profit.includes("+") ? "text-[#008832]" : "text-red-500"
                }`}
            >
                {`${profit} ${currency}`}
            </div>
        </div>
    );
};
