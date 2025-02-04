import { useEffect } from "react";
import {
  InstrumentPriceResponse,
  WebSocketError,
} from "@/services/api/websocket/types";
import { useSSEStore } from "@/stores/sseStore";

export interface UseMarketSSEOptions {
  onPrice?: (price: InstrumentPriceResponse) => void;
  onError?: (error: WebSocketError | Event) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const useMarketSSE = (
  instrumentId: string,
  options: UseMarketSSEOptions = {}
) => {
  const {
    initializeMarketService,
    subscribeToInstrumentPrice,
    unsubscribeFromInstrumentPrice,
    instrumentPrices,
    isMarketConnected,
    marketError,
  } = useSSEStore();

  useEffect(() => {
    initializeMarketService();
    subscribeToInstrumentPrice(instrumentId);

    return () => {
      unsubscribeFromInstrumentPrice(instrumentId);
    };
  }, [instrumentId]);

  useEffect(() => {
    if (instrumentPrices[instrumentId]) {
      options.onPrice?.(instrumentPrices[instrumentId]);
    }
  }, [instrumentPrices[instrumentId]]);

  useEffect(() => {
    if (isMarketConnected) {
      options.onConnect?.();
      subscribeToInstrumentPrice(instrumentId);
    } else {
      options.onDisconnect?.();
    }
  }, [isMarketConnected]);

  useEffect(() => {
    if (marketError) {
      options.onError?.(marketError);
    }
  }, [marketError]);

  return {
    price: instrumentPrices[instrumentId] || null,
    isConnected: isMarketConnected,
    error: marketError,
  };
};
