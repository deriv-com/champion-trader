import { create } from 'zustand';
import { MarketWebSocketService } from '@/services/api/websocket/market/service';
import { ContractWebSocketService } from '@/services/api/websocket/contract/service';
import { WebSocketError } from '@/services';

// Types from OpenAPI spec
export interface ContractPriceRequest {
  duration: string;      // Format: <number><unit> (d/h/m/s)
  instrument: string;    // e.g. "R_100"
  trade_type: "CALL" | "PUT";
  currency: string;      // e.g. "USD"
  payout: string;       // e.g. "100"
  strike?: string;      // Optional, e.g. "1234.56"
}

export interface ContractPriceResponse {
  date_start: number;    // Unix timestamp
  date_expiry: number;   // Unix timestamp
  spot: string;         // Current market price
  strike: string;       // Strike price
  price: string;        // Contract price
  trade_type: "CALL" | "PUT";
  instrument: string;
  currency: string;
  payout: string;
  pricing_parameters: {
    volatility: string;
    duration_in_years: string;
  };
}

export interface InstrumentPriceResponse {
  instrument_id: string;
  bid: number;
  ask: number;
  timestamp: string;    // ISO date-time
}

interface InternalState {
  marketService: MarketWebSocketService | null;
  contractService: ContractWebSocketService | null;
}

export interface WebSocketStore {
  // Public State
  instrumentPrices: Record<string, InstrumentPriceResponse>;
  contractPrices: Record<string, ContractPriceResponse>;
  isMarketConnected: boolean;
  isContractConnected: boolean;
  marketError: WebSocketError | null;
  contractError: WebSocketError | null;

  // Market actions (from /ws endpoint)
  initializeMarketService: () => void;
  subscribeToInstrumentPrice: (instrumentId: string) => void;
  unsubscribeFromInstrumentPrice: (instrumentId: string) => void;

  // Contract actions (from /protected/ws endpoint)
  initializeContractService: (authToken: string) => void;
  requestContractPrice: (params: ContractPriceRequest) => void;
  cancelContractPrice: (params: ContractPriceRequest) => void;
}

type FullState = WebSocketStore & InternalState;

export const useWebSocketStore = create<FullState>((set, get) => ({
  // Internal state (not exposed in public interface)
  marketService: null,
  contractService: null,

  // Public state
  instrumentPrices: {},
  contractPrices: {},
  isMarketConnected: false,
  isContractConnected: false,
  marketError: null,
  contractError: null,

  // Market service actions
  initializeMarketService: () => {
    if (!get().marketService) {
      const service = new MarketWebSocketService();
      
      service.on('instrument_price', (data: InstrumentPriceResponse) => {
        set(state => ({
          instrumentPrices: {
            ...state.instrumentPrices,
            [data.instrument_id]: data
          }
        }));
      });

      service.onError((error) => set({ marketError: error }));
      
      Object.assign(service, {
        options: {
          onOpen: () => set({ isMarketConnected: true, marketError: null }),
          onClose: () => set({ isMarketConnected: false }),
          onError: (_error: Event) => set({ marketError: { error: 'WebSocket connection error' } }),
          reconnectAttempts: 5,
          reconnectInterval: 5000,
        }
      });

      set({ marketService: service });
      service.connect();
    }
  },

  subscribeToInstrumentPrice: (instrumentId: string) => {
    get().marketService?.subscribeToPrice(instrumentId);
  },

  unsubscribeFromInstrumentPrice: (instrumentId: string) => {
    get().marketService?.unsubscribeFromPrice(instrumentId);
  },

  // Contract service actions
  initializeContractService: (authToken: string) => {
    if (!get().contractService) {
      const service = new ContractWebSocketService(authToken);
      
      service.on('contract_price', (data: ContractPriceResponse) => {
        // Generate a unique key for the contract price
        const key = JSON.stringify({
          duration: data.date_expiry - data.date_start + '',
          instrument: data.instrument,
          trade_type: data.trade_type,
          currency: data.currency,
          payout: data.payout,
          strike: data.strike
        });

        set(state => ({
          contractPrices: {
            ...state.contractPrices,
            [key]: data
          }
        }));
      });

      service.onError((error) => set({ contractError: error }));
      
      Object.assign(service, {
        options: {
          onOpen: () => set({ isContractConnected: true, contractError: null }),
          onClose: () => set({ isContractConnected: false }),
          onError: (_error: Event) => set({ contractError: { error: 'WebSocket connection error' } }),
          reconnectAttempts: 5,
          reconnectInterval: 5000,
        }
      });

      set({ contractService: service });
      service.connect();
    }
  },

  requestContractPrice: (params: ContractPriceRequest) => {
    get().contractService?.requestPrice(params);
  },

  cancelContractPrice: (params: ContractPriceRequest) => {
    get().contractService?.cancelPrice(params);
  }
}));
