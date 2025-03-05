import React from "react";

import { useTradeStore } from "@/stores/tradeStore";
import { useThemeStore } from "@/stores/themeStore";

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

  const { isDarkMode } = useThemeStore();

  return (
    <div className={`w-full mt-4 p-4 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-background-dark text-primary"}`}>
      <h2 className={`text-[14px] leading-[22px] font-ibm-plex font-bold mb-4 ${isDarkMode ? "text-white" : "text-[rgba(0,0,0,0.72)] text-primary"}`}>Order details</h2>
      {details.map((detail, index) => (
        <div key={index} className="w-full flex justify-between items-center border-b border-gray-300 py-2">
          <span className="text-order-details text-primary font-ibm-plex text-[14px] leading-[22px] font-normal">{detail.label}</span>
          <span className={`text-primary font-ibm-plex text-[14px] leading-[22px] font-normal text-right ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>{detail.value}</span>
        </div>
      ))}
    </div>
  );
};
