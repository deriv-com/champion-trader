import { useEffect } from 'react';
import { InstrumentPriceResponse, WebSocketError } from '@/services/api/websocket/types';
import { useWebSocketStore } from '@/stores/websocketStore';

export interface UseMarketWebSocketOptions {
  onPrice?: (price: InstrumentPriceResponse) => void;
  onError?: (error: WebSocketError | Event) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const useMarketWebSocket = (
  instrumentId: string,
  options: UseMarketWebSocketOptions = {}
) => {
  const { 
    initializeMarketService, 
    subscribeToInstrumentPrice, 
    unsubscribeFromInstrumentPrice,
    instrumentPrices,
    isMarketConnected,
    marketError 
  } = useWebSocketStore();

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
    error: marketError
  };
};
