import React from "react";
import { MarketIcon } from "@/components/MarketSelector/MarketIcon";
import { ContractDetails } from "@/screens/ContractDetailsPage/contractDetailsStub";

interface ContractSummaryProps {
    contractDetails?: ContractDetails;
}

export const ContractSummary: React.FC<ContractSummaryProps> = ({
    contractDetails: propContractDetails,
}) => {
    const contractDetails = propContractDetails;

    if (!contractDetails) {
        return null;
    }

    // Calculate profit as potential_payout - stake
    const profit =
        parseFloat(contractDetails.potential_payout || "0") -
        parseFloat(contractDetails.stake || "0");

    return (
        <div
            className="h-[104px] w-full p-4 bg-theme rounded-lg border-b border-theme"
            style={{
                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
            }}
        >
            <div className="flex justify-between">
                <div>
                    <div className=" mb-1">
                        <MarketIcon
                            symbol={contractDetails.instrument_id || "R_100"}
                            size="small"
                        />
                    </div>
                    <div>
                        <div className="overflow-hidden text-ellipsis text-theme font-ibm-plex text-[14px] leading-[22px] font-normal pb-1">
                            {contractDetails.variant}
                        </div>
                        <div className="overflow-hidden text-ellipsis text-theme-muted font-ibm-plex text-[14px] leading-[22px] font-normal">
                            {contractDetails.instrument_id}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-theme-muted font-ibm-plex text-[14px] leading-[22px] font-normal text-right bg-theme-secondary/50 px-2 rounded-md mb-1 py-0.5 inline-block">
                        {`${contractDetails.duration} ${contractDetails.duration_unit}`}
                    </div>
                    <div className="overflow-hidden text-ellipsis text-theme-muted mb-1 font-ibm-plex text-[14px] leading-[22px] font-normal text-right">{`${contractDetails.stake} ${contractDetails.bid_price_currency}`}</div>
                    <div className="text-[#008832] font-ibm-plex text-[14px] leading-[22px] font-normal text-right">{`${profit} ${contractDetails.bid_price_currency}`}</div>
                </div>
            </div>
        </div>
    );
};
