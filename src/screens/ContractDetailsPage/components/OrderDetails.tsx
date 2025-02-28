import React from "react";

import { useTradeStore } from "@/stores/tradeStore";

export const OrderDetails: React.FC = () => {
  const contractDetails = useTradeStore(state => state.contractDetails);

  if (!contractDetails) {
    return null;
  }

  const { duration, barrier, stake, payout } = contractDetails;
  const details = [
    { label: "Reference ID", value: "1234" }, // Hardcoded ID for stub data
    { label: "Duration", value: duration },
    { label: "Barrier", value: barrier },
    { label: "Stake", value: stake },
    { label: "Potential payout", value: payout }
  ];

  return (
    <div className="mt-4 p-4 bg-[var(--card-background)] text-[var(--text-color)] rounded-lg shadow-md">
      <h2 className="text-[14px] leading-[22px] font-ibm-plex font-bold text-[rgba(0,0,0,0.72)] dark:text-white mb-4">Order details</h2>
      {details.map((detail, index) => (
        <div key={index} className="col-span-2 flex justify-between border-b border-gray-300 py-2">
          <span className="text-[var(--text-color)] font-ibm-plex text-[14px] leading-[22px] font-normal">{detail.label}</span>
          <span className="text-gray-900 dark:text-white font-ibm-plex text-[14px] leading-[22px] font-normal text-right">{detail.value}</span>
        </div>
      ))}
    </div>
  );
};
