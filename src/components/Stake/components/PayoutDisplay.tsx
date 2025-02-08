import React from "react";
import { cn } from "@/lib/utils";

import { useTradeStore } from "@/stores/tradeStore";
import { tradeTypeConfigs } from "@/config/tradeTypes";
import { useClientStore } from "@/stores/clientStore";

interface PayoutItem {
  value: string;
  hasError: boolean;
}

interface PayoutDisplayProps {
  hasError: boolean;
}

export const PayoutDisplay: React.FC<PayoutDisplayProps> = ({
  hasError
}) => {
  const { trade_type, payouts } = useTradeStore();
  const { currency } = useClientStore();
  const config = tradeTypeConfigs[trade_type];

  return (
    <div className="space-y-1">
      {config.payouts.max && (
        <div className="flex justify-between">
          <span className="font-ibm text-[0.875rem] sm:text-[0.75rem] font-normal leading-[1.25rem] sm:leading-[1.125rem] text-black/48">
            Max. payout
          </span>
          <span className={cn(
            "font-ibm text-[0.875rem] sm:text-[0.75rem] font-normal leading-[1.25rem] sm:leading-[1.125rem]",
            hasError ? "text-red-500" : "text-black/72"
          )}>
            {`${payouts.max} ${currency}`}
          </span>
        </div>
      )}
      {config.buttons.map(button => (
        <div key={button.actionName} className="flex justify-between">
          <span className="font-ibm text-[0.875rem] sm:text-[0.75rem] font-normal leading-[1.25rem] sm:leading-[1.125rem] text-black/48">
            {config.payouts.labels[button.actionName]}
          </span>
          <span className={cn(
            "font-ibm text-[0.875rem] sm:text-[0.75rem] font-normal leading-[1.25rem] sm:leading-[1.125rem]",
            hasError ? "text-red-500" : "text-black/72"
          )}>
            {`${payouts.values[button.actionName]} ${currency}`}
          </span>
        </div>
      ))}
    </div>
  );
};
