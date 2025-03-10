import React from "react";
import { ProcessedContract } from "@/hooks/useProcessedContracts";
import { MarketIcon } from "@/components/MarketSelector/MarketIcon";

interface ContractCardProps {
  contract: ProcessedContract;
  onClick?: (contractId: string) => void;
  variant?: "mobile" | "desktop";
  showCloseButton?: boolean;
  onClose?: (contractId: string) => void;
}

/**
 * Shared contract card component for both mobile and desktop views
 */
export const ContractCard: React.FC<ContractCardProps> = ({
  contract,
  onClick,
  variant = "mobile",
  showCloseButton = false,
  onClose,
}) => {
  const { type, market, stake, profit, duration, isOpen, originalId } = contract;
  
  const handleClick = () => {
    if (onClick) {
      onClick(originalId);
    }
  };
  
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClose) {
      onClose(originalId);
    }
  };
  
  if (variant === "mobile") {
    return (
      <div
        className="h-[104px] w-full p-4 bg-white rounded-lg border-b border-gray-300 cursor-pointer"
        style={{
          boxShadow:
            "0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 2px 0px rgba(0, 0, 0, 0.03)",
        }}
        onClick={handleClick}
      >
        <div className="flex justify-between">
          <div>
            <div className="mb-1">
              <MarketIcon symbol="R_100" size="small" />
            </div>
            <div>
              <div className="overflow-hidden text-ellipsis text-[rgba(0,0,0,0.72)] font-ibm-plex text-[14px] leading-[22px] font-normal pb-1">
                {type}
              </div>
              <div className="overflow-hidden text-ellipsis text-[rgba(0,0,0,0.48)] font-ibm-plex text-[14px] leading-[22px] font-normal">
                {market}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[rgba(0,0,0,0.48)] font-ibm-plex text-[14px] leading-[22px] font-normal text-right bg-[rgba(0,0,0,0.04)] px-2 rounded-md mb-1 py-0.5 inline-block">
              {duration}
            </div>
            <div className="overflow-hidden text-ellipsis text-[rgba(0,0,0,0.48)] mb-1 font-ibm-plex text-[14px] leading-[22px] font-normal text-right">
              {stake}
            </div>
            <div 
              className={`font-ibm-plex text-[14px] leading-[22px] font-normal text-right ${
                profit.startsWith("+") ? "text-[#008832]" : "text-red-500"
              }`}
            >
              {profit}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop variant
  return (
    <div
      className="p-3 rounded-lg shadow-sm cursor-pointer bg-white"
      onClick={handleClick}
    >
      <div className="flex justify-between text-sm font-medium">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <img
              src="/market icon.svg"
              alt="Market Icon"
              className="w-5 h-8 mb-1"
            />
          </div>
          <span className="mb-[5] font-light text-black-400">
            {type}
          </span>
          <span className="text-s font-light text-gray-500 mb-4">
            {market}
          </span>
        </div>
        <div>
          <div className="flex flex-col items-end">
            {isOpen ? (
              <span className="text-gray-500 w-35 text-xs flex items-center bg-gray-50 px-2 py-1 rounded-md border border-transparent hover:border-gray-300 mb-3">
                <span className="mr-2">⏳</span> {duration}
              </span>
            ) : (
              <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-medium mb-3">
                Closed
              </span>
            )}
            <span className="text-s font-light text-gray-400 mb-[2]">
              {stake}
            </span>
            <span
              className={`text-sm ${
                profit.startsWith("+")
                  ? "text-[#008832]"
                  : "text-red-500"
              }`}
            >
              {profit}
            </span>
          </div>
        </div>
      </div>
      {showCloseButton && isOpen && (
        <button 
          className="w-full h-6 flex items-center justify-center py-2 border border-black text-xs font-bold rounded-[8]"
          onClick={handleClose}
        >
          Close {stake}
        </button>
      )}
    </div>
  );
};
