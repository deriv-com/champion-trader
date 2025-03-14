import React from "react";

import { useTradeStore } from "@/stores/tradeStore";

export const Payout: React.FC = () => {
    const contractDetails = useTradeStore((state) => state.contractDetails);

    if (!contractDetails) {
        return null;
    }

    const { instrument_id: market, duration, duration_unit } = contractDetails;
    return (
        <div
            className="mt-4 p-4 bg-white rounded-lg border-b border-gray-300"
            style={{
                boxShadow:
                    "0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 2px 0px rgba(0, 0, 0, 0.03)",
            }}
        >
            <h2 className="text-[14px] leading-[22px] font-ibm-plex font-bold text-[rgba(0,0,0,0.72)] mb-2">
                How do I earn a payout?
            </h2>
            <p className="text-[rgba(0,0,0,0.72)] font-ibm-plex text-[14px] leading-[22px] font-normal">
                Win payout if {market} after {duration} {duration_unit} is strictly higher than
                entry spot.
            </p>
        </div>
    );
};
