export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Trade Types
export interface Trade {
  id: string;
  symbol: string;
  type: 'RISE' | 'FALL';
  amount: number;
  payout: number;
  status: 'OPEN' | 'WON' | 'LOST';
  createdAt: string;
  expiresAt: string;
}

export interface TradeRequest {
  symbol: string;
  type: 'RISE' | 'FALL';
  amount: number;
  duration: number;
}

export interface TradeResponse {
  trade: Trade;
  message: string;
}

// Market Types
export interface Market {
  symbol: string;
  name: string;
  type: string;
  active: boolean;
  volatility: number;
}

export interface MarketPrice {
  symbol: string;
  price: number;
  timestamp: string;
}

// WebSocket Types
export type WebSocketAction = 
  | 'instrument_price'
  | 'trade_status'
  | 'account_info';

export interface WebSocketMessage {
  action: WebSocketAction;
  data: any;
}

export interface WebSocketRequest {
  action: WebSocketAction;
  data: {
    symbol?: string;
    duration?: number;
    type?: 'RISE' | 'FALL';
    [key: string]: any;
  };
}

export interface WebSocketInstrumentPrice {
  action: 'instrument_price';
  data: {
    symbol: string;
    price: number;
    timestamp: string;
  };
}

export interface WebSocketTradeStatus {
  action: 'trade_status';
  data: Trade;
}

export interface WebSocketAccountInfo {
  action: 'account_info';
  data: {
    balance: number;
    currency: string;
    [key: string]: any;
  };
}

export type WebSocketEventMap = {
  open: Event;
  close: CloseEvent;
  error: Event;
  message: MessageEvent;
};

export type WebSocketEventHandler = (event: Event | CloseEvent | MessageEvent) => void;
