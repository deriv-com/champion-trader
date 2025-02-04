import { create } from 'zustand';
import { MarketSSEService } from '@/services/api/sse/market/service';
import { ContractSSEService } from '@/services/api/sse/contract/service';
import { SSEError } from '@/services/api/sse/base/types';
import {
  ContractPriceRequest,
  ContractPriceResponse,
  InstrumentPriceResponse
} from '@/services/api/websocket/types';

interface InternalState {
  marketService: MarketSSEService | null;
  contractService: ContractSSEService | null;
}

export interface SSEStore {
  // Public State
  instrumentPrices: Record<string, InstrumentPriceResponse>;
  contractPrices: Record<string, ContractPriceResponse>;
  isMarketConnected: boolean;
  isContractConnected: boolean;
  marketError: SSEError | null;
  contractError: SSEError | null;

  // Market actions
  initializeMarketService: () => void;
  subscribeToInstrumentPrice: (instrumentId: string) => void;
  unsubscribeFromInstrumentPrice: (instrumentId: string) => void;

  // Contract actions
  initializeContractService: (authToken: string) => void;
  requestContractPrice: (params: ContractPriceRequest) => void;
  cancelContractPrice: (params: ContractPriceRequest) => void;
}

type FullState = SSEStore & InternalState;

const formatError = (error: SSEError | Event): SSEError => {
  if (error instanceof Event) {
    return { error: 'SSE connection error' };
  }
  return error;
};

export const useSSEStore = create<FullState>((set, get) => ({
  // Internal state
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
    const currentService = get().marketService;
    if (currentService) {
      currentService.disconnect();
    }

    const service = new MarketSSEService();

    // Store service with initial state
    set({ 
      marketService: service,
      isMarketConnected: false,
      marketError: null,
      instrumentPrices: {} // Reset prices on new service
    });

    // Set up event handlers
    service.on('open', () => {
      set({ 
        isMarketConnected: true,
        marketError: null
      });
    });

    service.on('instrument_price', (data: InstrumentPriceResponse) => {
      set(state => ({
        instrumentPrices: {
          ...state.instrumentPrices,
          [data.instrument_id]: data
        }
      }));
    });

    service.onError((error) => {
      const formattedError = formatError(error);
      set({ 
        marketError: formattedError,
        isMarketConnected: false
      });
    });

    // Connect after setting up handlers
    service.connect();
  },

  subscribeToInstrumentPrice: (instrumentId: string) => {
    const { marketService } = get();
    if (marketService) {
      marketService.subscribeToPrice(instrumentId);
    }
  },

  unsubscribeFromInstrumentPrice: (instrumentId: string) => {
    const { marketService } = get();
    if (marketService) {
      marketService.unsubscribeFromPrice(instrumentId);
    }
  },

  // Contract service actions
  initializeContractService: (authToken: string) => {
    const currentService = get().contractService;
    if (currentService) {
      currentService.disconnect();
    }

    const service = new ContractSSEService(authToken);

    // Store service with initial state
    set({ 
      contractService: service,
      isContractConnected: false,
      contractError: null,
      contractPrices: {} // Reset prices on new service
    });

    // Set up event handlers
    service.on('open', () => {
      set({ 
        isContractConnected: true,
        contractError: null
      });
    });

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

    service.onError((error) => {
      const formattedError = formatError(error);
      set({ 
        contractError: formattedError,
        isContractConnected: false
      });
    });

    // Connect after setting up handlers
    service.connect();
  },

  requestContractPrice: (params: ContractPriceRequest) => {
    const { contractService } = get();
    if (contractService) {
      contractService.requestPrice(params);
    }
  },

  cancelContractPrice: (params: ContractPriceRequest) => {
    const { contractService } = get();
    if (contractService) {
      contractService.cancelPrice(params);
    }
  }
}));
