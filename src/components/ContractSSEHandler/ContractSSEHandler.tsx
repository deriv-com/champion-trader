import React, { useEffect } from 'react';
import { useContractSSE } from "@/hooks/sse";
import { ContractPriceRequest } from "@/services/api/websocket/types";

// Initialize contract SSE for default parameters
const contractParams: ContractPriceRequest = {
  duration: "1m",
  instrument: "R_100",
  trade_type: "CALL",
  currency: "USD",
  payout: "100",
  strike: "1234.56",
};

interface ContractSSEHandlerProps {
  token: string;
}

export const ContractSSEHandler: React.FC<ContractSSEHandlerProps> = ({ token }) => {
  const { price } = useContractSSE(
    contractParams,
    token,
    {
      onPrice: (price) => console.log("Contract Price Update:", price),
      onError: (error) => console.log("Contract SSE Error:", error),
    }
  );

  useEffect(() => {
    if (price) {
      console.log("Contract Price:", price);
    }
  }, [price]);

  return null; // This component doesn't render anything
};
