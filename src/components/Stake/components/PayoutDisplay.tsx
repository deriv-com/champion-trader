import React from "react";
import { cn } from "@/lib/utils";
import { tradeTypeConfigs } from "@/config/tradeTypes";
import { useClientStore } from "@/stores/clientStore";
import { useTradeStore } from "@/stores/tradeStore";

interface PayoutDisplayProps {
  hasError: boolean;
  loading?: boolean;
  loadingStates?: Record<string, boolean>;
  maxPayout: number;
  payoutValues: Record<string, number>;
}

export const PayoutDisplay: React.FC<PayoutDisplayProps> = ({
  hasError,
  loading = false,
  loadingStates = {},
  maxPayout,
  payoutValues
}) => {
  const { trade_type } = useTradeStore();
  const { currency } = useClientStore();
  const config = tradeTypeConfigs[trade_type];

  return (
    <div className="space-y-1">
      {config.payouts.max && (
        <div className="flex justify-between">
          <span className="font-ibm-plex text-xs font-normal leading-[18px] text-[var(--text-color)]">
            Max payout
          </span>
          <span className={cn(
            "font-ibm-plex text-xs font-normal leading-[18px] text-right",
            hasError ? "text-red-500" : "text-[var(--text-color)]"
          )}>
            {loading ? "Loading..." : `${maxPayout} ${currency}`}
          </span>
        </div>
      )}
      {config.buttons.map(button => (
        <div key={button.actionName} className="flex justify-between">
          <span className="font-ibm-plex text-xs font-normal leading-[18px] text-[var(--text-color)]">
            {config.payouts.labels[button.actionName]}
          </span>
          <span className={cn(
            "font-ibm-plex text-xs font-normal leading-[18px] text-right",
            hasError ? "text-red-500" : "text-[var(--text-color)]"
          )}>
            {loadingStates[button.actionName] ? "Loading..." : `${payoutValues[button.actionName]} ${currency}`}
          </span>
        </div>
      ))}
    </div>
  );
};
