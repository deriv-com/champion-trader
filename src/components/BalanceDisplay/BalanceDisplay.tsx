import React from "react";
import { AccountSwitcher } from "../AccountSwitcher";

interface BalanceDisplayProps {
  className?: string;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  className = "",
}) => {
  return (
    <div className={`flex flex-col px-4 ${className}`}>
      <AccountSwitcher />
    </div>
  );
};
