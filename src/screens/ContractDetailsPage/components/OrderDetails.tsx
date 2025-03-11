import React from "react";
import { useTradeStore } from "@/stores/tradeStore";

export const OrderDetails: React.FC = () => {
    const { contractDetails } = useTradeStore();

    if (!contractDetails) {
        return null;
    }

    // Use optional chaining and default values for potentially undefined fields
    const {
        duration = "",
        barrier = "",
        stake = "",
        payout = "",
        referenceId = "",
    } = contractDetails;

    const details = [
        {
            label: "Reference ID",
            value: (
                <div>
                    <div>{referenceId || "547294814948"} (Buy)</div>
                    <div>547294818528 (Sell)</div>
                </div>
            ),
        },
        { label: "Duration", value: duration },
        { label: "Barrier", value: barrier },
        { label: "Stake", value: stake },
        { label: "Potential payout", value: payout },
    ];

    return (
        <div
            className="mt-4 p-4 bg-white rounded-lg border-b border-gray-300"
            style={{
                boxShadow:
                    "0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 2px 0px rgba(0, 0, 0, 0.03)",
            }}
        >
            <h2 className="text-[14px] leading-[22px] font-ibm-plex font-bold text-[rgba(0,0,0,0.72)] mb-4">
                Order details
            </h2>
            {details.map((detail, index) => (
                <div
                    key={index}
                    className="col-span-2 flex justify-between border-b border-gray-300 py-2"
                >
                    <span className="text-[rgba(0,0,0,0.48)] font-ibm-plex text-[14px] leading-[22px] font-normal">
                        {detail.label}
                    </span>
                    <div className="text-[rgba(0,0,0,0.72)] font-ibm-plex text-[14px] leading-[22px] font-normal text-right">
                        {detail.value}
                    </div>
                </div>
            ))}
        </div>
    );
};
