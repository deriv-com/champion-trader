import React from "react";

import { useTradeStore } from "@/stores/tradeStore";

export const OrderDetails: React.FC = () => {
    const contractDetails = useTradeStore((state) => state.contractDetails);

    if (!contractDetails) {
        return null;
    }

    const { duration, barrier, stake, potential_payout } = contractDetails;
    const details = [
        { label: "Reference ID", value: contractDetails.contract_id },
        { label: "Duration", value: `${duration} ${contractDetails.duration_unit}` },
        { label: "Barrier", value: barrier },
        { label: "Stake", value: `${stake} ${contractDetails.bid_price_currency}` },
        {
            label: "Potential payout",
            value: `${potential_payout} ${contractDetails.bid_price_currency}`,
        },
    ];

    return (
        <div
            className="mt-4 p-4 bg-theme rounded-lg border-b border-theme"
            style={{
                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
            }}
        >
            <h2 className="text-[14px] leading-[22px] font-ibm-plex font-bold text-theme mb-4">
                Order details
            </h2>
            {details.map((detail, index) => (
                <div
                    key={index}
                    className="col-span-2 flex justify-between border-b border-theme py-2"
                >
                    <span className="text-theme-muted font-ibm-plex text-[14px] leading-[22px] font-normal">
                        {detail.label}
                    </span>
                    <span className="text-theme font-ibm-plex text-[14px] leading-[22px] font-normal text-right">
                        {detail.value}
                    </span>
                </div>
            ))}
        </div>
    );
};
