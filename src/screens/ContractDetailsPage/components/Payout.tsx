import React from "react";

import { useTradeStore } from "@/stores/tradeStore";

export const Payout: React.FC = () => {
  const contractDetails = useTradeStore(state => state.contractDetails);

  if (!contractDetails) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-[var(--card-background)] text-[var(--text-color)] rounded-lg shadow-md">
    </div>
  );
};
