import React from "react";

import { useTradeStore } from "@/stores/tradeStore";

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

  return (
    <div className="w-full mt-4 p-4 bg-background-light dark:bg-background-dark text-text-primary dark:text-white rounded-lg shadow-md">
      <h2 className="text-[14px] leading-[22px] font-ibm-plex font-bold text-[rgba(0,0,0,0.72)] dark:text-white mb-4">Entry & exit details</h2>
      {details.map((detail, index) => (
        <div key={index} className="w-full flex justify-between items-center border-b border-gray-300 py-2">
          <span className="text-entryExitDetailsTextColor dark:text-white font-ibm-plex text-[14px] leading-[22px] font-normal">{detail.label}</span>
          <div className="text-right">
            <span className="text-[rgba(0,0,0,0.72)] dark:text-white font-ibm-plex text-[14px] leading-[22px] font-normal block pb-1">{detail.value}</span>
            {detail.subValue && <span className="text-[rgba(0,0,0,0.48)] dark:text-gray-300 font-ibm-plex text-[12px] leading-[18px] font-normal block">{detail.subValue}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};
