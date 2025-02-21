import React from "react";

import { useTradeStore } from "@/stores/tradeStore";

export const Payout: React.FC = () => {
  const contractDetails = useTradeStore(state => state.contractDetails);

  if (!contractDetails) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border-b border-gray-300" style={{ boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 2px 0px rgba(0, 0, 0, 0.03)' }}>
    </div>
  );
};
