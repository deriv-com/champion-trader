import React from "react";
import { useClientStore } from "@/stores/clientStore";

interface BalanceDisplayProps {
  className?: string;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  className = "",
}) => {
  const { balance, currency } = useClientStore();

  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-sm font-semibold text-color-solid-glacier-700">Real</span>
      <span className="text-sm font-semibold">
        {balance} {currency}
      </span>
    </div>
  );
};
