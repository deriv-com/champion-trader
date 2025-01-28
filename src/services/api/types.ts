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
export interface WebSocketMessage {
  type: string;
  data: any;
}

export interface WebSocketSubscription {
  type: 'subscribe' | 'unsubscribe';
  channel: string;
  symbol?: string;
}

export interface WebSocketPrice extends MarketPrice {
  channel: 'price';
}

export interface WebSocketTrade extends Trade {
  channel: 'trade';
}

export type WebSocketEventMap = {
  open: Event;
  close: CloseEvent;
  error: Event;
  message: MessageEvent;
};

export type WebSocketEventHandler = (event: Event | CloseEvent | MessageEvent) => void;
