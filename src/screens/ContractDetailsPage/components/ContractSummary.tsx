import React from "react";
import { useTradeStore } from "@/stores/tradeStore";
import { useThemeStore } from "@/stores/themeStore";
import { MarketIcon } from "@/components/MarketSelector/MarketIcon";

export const ContractSummary: React.FC = () => {
  const contractDetails = useTradeStore(state => state.contractDetails);

  if (!contractDetails) {
    return null;
  }

  const { type, market, stake, profit } = contractDetails;
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`h-[104px] w-full p-4 rounded-lg border-b border-gray-300 border-secondary shadow-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
      <div className="flex justify-between">
        <div>
          <div className=" mb-1">
            <MarketIcon symbol="R_100" size="small" />
          </div>
          <div>
            <div className={`overflow-hidden text-ellipsis font-ibm-plex text-[14px] leading-[22px] font-normal pb-1 ${isDarkMode ? "text-white" : "text-gray-900 text-primary"}`}>{type}</div>
            <div className={`overflow-hidden text-ellipsis font-ibm-plex text-[14px] leading-[22px] font-normal ${isDarkMode ? "text-gray-300" : "text-gray-600 text-black"}`}>{market}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`font-ibm-plex text-[14px] leading-[22px] font-normal text-right bg-gray-100 bg-background-dark px-2 rounded-md mb-1 py-0.5 inline-block text-black`}>0/10 ticks</div>
          <div className={`overflow-hidden text-ellipsis mb-1 font-ibm-plex text-[14px] leading-[22px] font-normal text-right ${isDarkMode ? "text-gray-300" : "text-[rgba(0,0,0,0.48)] text-black"}`}>{`${stake} USD`}</div>
          <div className="text-highlight-color font-ibm-plex text-[14px] leading-[22px] font-normal text-right">{`${profit} USD`}</div>
        </div>
      </div>
    </div>
  );
};
