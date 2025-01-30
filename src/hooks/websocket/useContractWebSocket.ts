import { useEffect } from "react";
import {
  ContractPriceResponse,
  WebSocketError,
  ContractPriceRequest,
} from "@/services/api/websocket/types";
import { useWebSocketStore } from "@/stores/websocketStore";

export interface UseContractWebSocketOptions {
  onPrice?: (price: ContractPriceResponse) => void;
  onError?: (error: WebSocketError | Event) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const useContractWebSocket = (
  params: ContractPriceRequest,
  authToken: string,
  options: UseContractWebSocketOptions = {}
) => {
  const {
    initializeContractService,
    requestContractPrice,
    cancelContractPrice,
    contractPrices,
    isContractConnected,
    contractError,
  } = useWebSocketStore();

  useEffect(() => {
    initializeContractService(authToken);
    requestContractPrice(params);

    return () => {
      cancelContractPrice(params);
    };
  }, [params, authToken]);

  // Generate the same key used in the store to look up the price
  const contractKey = JSON.stringify({
    duration: params.duration,
    instrument: params.instrument,
    trade_type: params.trade_type,
    currency: params.currency,
    payout: params.payout,
    strike: params.strike,
  });

  useEffect(() => {
    if (contractPrices[contractKey]) {
      options.onPrice?.(contractPrices[contractKey]);
    }
  }, [contractPrices[contractKey]]);

  useEffect(() => {
    if (isContractConnected) {
      options.onConnect?.();
      requestContractPrice(params);
    } else {
      options.onDisconnect?.();
    }
  }, [isContractConnected]);

  useEffect(() => {
    if (contractError) {
      options.onError?.(contractError);
    }
  }, [contractError]);

  return {
    price: contractPrices[contractKey] || null,
    isConnected: isContractConnected,
    error: contractError,
  };
};
