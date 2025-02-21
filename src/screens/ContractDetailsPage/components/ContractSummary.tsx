import React from "react";
import { useTradeStore } from "@/stores/tradeStore";
import { MarketIcon } from "@/components/MarketSelector/MarketIcon";

export const ContractSummary: React.FC = () => {
  const contractDetails = useTradeStore(state => state.contractDetails);

  if (!contractDetails) {
    return null;
  }

  const { type, market, stake, profit } = contractDetails;
  return (
    <div className="h-[104px] p-4 bg-white dark:bg-gray-800 rounded-lg mb-4 border-b border-gray-300" style={{ boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 2px 0px rgba(0, 0, 0, 0.03)' }}>
      <div className="flex justify-between">
        <div>
          <div className=" mb-1">
            <MarketIcon symbol="R_100" size="small" />
          </div>
          <div>
            <div className="overflow-hidden text-ellipsis text-[rgba(0,0,0,0.72)] dark:text-white font-ibm-plex text-[14px] leading-[22px] font-normal pb-1">{type}</div>
            <div className="overflow-hidden text-ellipsis text-[rgba(0,0,0,0.48)] dark:text-gray-300 font-ibm-plex text-[14px] leading-[22px] font-normal">{market}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[rgba(0,0,0,0.48)] dark:text-gray-300 font-ibm-plex text-[14px] leading-[22px] font-normal text-right bg-[rgba(0,0,0,0.04)] dark:bg-gray-700 px-2 rounded-md mb-1   py-0.5 inline-block">0/10 ticks</div>
          <div className="overflow-hidden text-ellipsis text-[rgba(0,0,0,0.48)] dark:text-gray-300 mb-1 font-ibm-plex text-[14px] leading-[22px] font-normal text-right">{`${stake} USD`}</div>
          <div className="text-[#008832] font-ibm-plex text-[14px] leading-[22px] font-normal text-right">{`${profit} USD`}</div>
        </div>
      </div>
    </div>
  );
};
