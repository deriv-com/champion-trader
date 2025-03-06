import React from "react";
import { useTradeStore } from "@/stores/tradeStore";
import { formatDate, formatGMTTime } from "@/utils/dateUtils";

export const EntryExitDetails: React.FC = () => {
  const contractDetails = useTradeStore((state) => state.contractDetails);

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
    {
      label: "Start time",
      value: startTime,
      subValue: startTimeGMT,
    },
    {
      label: "Entry spot",
      value: entrySpot,
      subValue: startTime,
      extraSubValue: entryTimeGMT,
    },
    {
      label: "Exit time",
      value: exitTime,
      subValue: exitTimeGMT,
    },
    {
      label: "Exit spot",
      value: exitSpot,
      subValue: exitTime,
      extraSubValue: exitTimeGMT,
    },
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
        Entry & exit details
      </h2>
      {details.map((detail, index) => (
        <div
          key={index}
          className="col-span-2 flex justify-between border-b border-gray-300 py-2"
        >
          <span className="text-[rgba(0,0,0,0.48)] font-ibm-plex text-[14px] leading-[22px] font-normal">
            {detail.label}
          </span>
          <div className="text-right">
            <span className="text-[rgba(0,0,0,0.72)] font-ibm-plex text-[14px] leading-[22px] font-normal block pb-1">
              {detail.value}
            </span>
            {detail.subValue && (
              <>
                <span className="text-[rgba(0,0,0,0.48)] font-ibm-plex text-[12px] leading-[18px] font-normal block">
                  {detail.subValue}
                </span>
                {detail.extraSubValue && (
                  <span className="text-[rgba(0,0,0,0.48)] font-ibm-plex text-[12px] leading-[18px] font-normal block">
                    {detail.extraSubValue}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
