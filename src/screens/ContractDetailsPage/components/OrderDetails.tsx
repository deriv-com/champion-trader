import React from "react";
import { Contract } from "@/api/services/contract/types";

interface OrderDetailsProps {
    contract: Contract;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ contract }) => {
    const { details } = contract;
    const orderDetails = [
        { label: "Reference ID", value: details.reference_id || "N/A" },
        {
            label: "Duration",
            value: `${details.duration} ${details.duration_unit}`,
        },
        { label: "Barrier", value: details.barrier || "N/A" },
        { label: "Stake", value: `${details.stake} ${details.bid_price_currency}` },
        {
            label: "Potential payout",
            value: `${details.potential_payout} ${details.bid_price_currency}` || "N/A",
        },
    ];

    return (
        <div
            className="mt-4 p-4 bg-theme rounded-lg border-b border-theme"
            style={{
                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
            }}
        >
            <h2 className="text-[14px] leading-[22px] font-bold text-theme mb-4">Order details</h2>
            {orderDetails.map((detail, index) => (
                <div
                    key={index}
                    className="col-span-2 flex justify-between border-b border-theme py-2"
                >
                    <span className="text-theme-muted text-[14px] leading-[22px] font-normal">
                        {detail.label}
                    </span>
                    <span className="text-theme text-[14px] leading-[22px] font-normal text-right">
                        {detail.value}
                    </span>
                </div>
            ))}
        </div>
    );
};
