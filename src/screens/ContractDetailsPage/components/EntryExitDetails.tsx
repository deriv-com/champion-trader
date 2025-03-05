import React from "react";

import { useTradeStore } from "@/stores/tradeStore";
import { useThemeStore } from "@/stores/themeStore";

export const EntryExitDetails: React.FC = () => {
  const contractDetails = useTradeStore(state => state.contractDetails);

  if (!contractDetails) {
    return null;
  }

  const {
    startTime,
    startTimeGMT,
    entrySpot,
    entryTimeGMT,
    exitTime,
    exitTimeGMT,
    exitSpot,
  } = contractDetails;
  const details = [
    { label: "Start time", value: startTime, subValue: startTimeGMT },
    { label: "Entry spot", value: entrySpot, subValue: entryTimeGMT },
    { label: "Exit time", value: exitTime, subValue: exitTimeGMT },
    { label: "Exit spot", value: exitSpot, subValue: exitTimeGMT }
  ];

  const { isDarkMode } = useThemeStore();

  return (
    <div className={`w-full mt-4 p-4 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-background-light text-primary"}`}>
      <h2 className={`text-[14px] leading-[22px] font-ibm-plex font-bold mb-4 ${isDarkMode ? "text-white" : "text-[rgba(0,0,0,0.72)] text-primary"}`}>Entry & exit details</h2>
      {details.map((detail, index) => (
        <div key={index} className="w-full flex justify-between items-center border-b border-gray-300 py-2">
          <span className="text-entryExitDetailsTextColor text-primary font-ibm-plex text-[14px] leading-[22px] font-normal">{detail.label}</span>
          <div className="text-right">
            <span className={`font-ibm-plex text-[14px] leading-[22px] font-normal block pb-1 ${isDarkMode ? "text-gray-300" : "text-[rgba(0,0,0,0.72)] text-primary"}`}>{detail.value}</span>
            {detail.subValue && <span className={`font-ibm-plex text-[12px] leading-[18px] font-normal block ${isDarkMode ? "text-gray-400" : "text-[rgba(0,0,0,0.48)] text-secondary"}`}>{detail.subValue}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};
