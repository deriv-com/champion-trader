import React from "react";
import { MarketIcon } from "@/components/MarketSelector/MarketIcon";

interface ContractSummaryInfoProps {
    type: string;
    market: string;
    marketSymbol?: string;
    className?: string;
}

export const ContractSummaryInfo: React.FC<ContractSummaryInfoProps> = ({
    type,
    market,
    marketSymbol = "R_100",
    className = "",
}) => {
    return (
        <div className={`flex flex-col items-start ${className}`}>
            <div className="flex items-center gap-2 mb-1">
                <MarketIcon symbol={marketSymbol} size="small" />
            </div>
            <div className="overflow-hidden text-ellipsis text-theme font-ibm-plex text-[14px] leading-[22px] font-normal pb-1">
                {type}
            </div>
            <div className="overflow-hidden text-ellipsis text-theme-muted font-ibm-plex text-[14px] leading-[22px] font-normal">
                {market}
            </div>
        </div>
    );
};
