import { CustomEventSource } from './custom-event-source';
import { ContractPriceResponse } from './types';
import { Contract } from '@/hooks/useContracts';
import { apiConfig } from '@/config/api';

interface SSEOptions {
  params: Record<string, string>;
  headers?: Record<string, string>;
  onMessage: (data: ContractPriceResponse | Contract) => void;
  onError?: (error: any) => void;
  onOpen?: () => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  endpoint?: string; // New parameter for custom endpoints
}

export const createSSEConnection = (options: SSEOptions) => {
  const {
    params,
    headers,
    onMessage,
    onError,
    onOpen,
    reconnectAttempts = 3,
    reconnectInterval = 1000
  } = options;
  
  let eventSource: CustomEventSource | null = null;
  let attemptCount = 0;
  let isDestroyed = false;

  const connect = () => {
    if (isDestroyed) return;
    
    // Construct full URL using apiConfig
    const baseUrl = apiConfig.sse.baseUrl;
    const sseUrl = new URL(baseUrl);
    
    // Use custom endpoint if provided, otherwise use protected or public path
    if (options.endpoint) {
      sseUrl.pathname = options.endpoint;
    } else {
      sseUrl.pathname = headers?.['Authorization'] 
        ? apiConfig.sse.protectedPath 
        : apiConfig.sse.publicPath;
    }
      
    // Add query parameters
    sseUrl.search = new URLSearchParams(params).toString();

    eventSource = new CustomEventSource(sseUrl.toString(), { headers });
    
    eventSource.onmessage = (event) => {
      try {
        const rawMessage = event.data;
        let jsonString = rawMessage;
        
        if (typeof rawMessage === 'string' && rawMessage.includes('data:')) {
          const lines = rawMessage.split("\n");
          const dataLine = lines.find((line: string) => line.startsWith("data:"));
          if (!dataLine) {
            throw new Error('No "data:" field found in the message');
          }
          jsonString = dataLine.replace("data: ", "").trim();
        }

        const data = JSON.parse(jsonString);
        onMessage(data);
        attemptCount = 0; // Reset attempt count on successful message
      } catch (error) {
        onError?.(error);
      }
    };
    
    eventSource.onerror = (error) => {
      onError?.(error);
      
      // Attempt reconnection
      if (attemptCount < reconnectAttempts) {
        attemptCount++;
        setTimeout(() => {
          eventSource?.close();
          connect();
        }, reconnectInterval);
      }
    };
    
    eventSource.onopen = () => {
      attemptCount = 0; // Reset attempt count on successful connection
      onOpen?.();
    };
  };

  connect();
  
  return () => {
    isDestroyed = true;
    eventSource?.close();
  };
};
