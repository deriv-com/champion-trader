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
