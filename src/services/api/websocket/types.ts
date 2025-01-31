// WebSocket Types
export type WebSocketAction =
  | "instrument_price"
  | "trade_status"
  | "account_info"
  | "contract_price";

export interface WebSocketMessage {
  action: WebSocketAction;
  data: any;
  error?: any;
}

export interface WebSocketRequest {
  action: WebSocketAction;
  data: {
    symbol?: string;
    duration?: number;
    type?: "CALL" | "PUT";
    [key: string]: any;
  };
}

export interface WebSocketInstrumentPrice {
  symbol: string;
  price: number;
  timestamp: string;
}

export interface WebSocketTradeStatus {
  action: "trade_status";
  data: {
    id: string;
    symbol: string;
    type: "CALL" | "PUT";
    amount: number;
    payout: number;
    status: "OPEN" | "WON" | "LOST";
    createdAt: string;
    expiresAt: string;
  };
}

export interface WebSocketAccountInfo {
  action: "account_info";
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

export type WebSocketEventHandler = (
  event: Event | CloseEvent | MessageEvent
) => void;

export interface WebSocketError {
  error: string;
  [key: string]: any;
}

// Contract WebSocket Types
export interface ContractPriceRequest {
  duration: string; // Format: <number><unit> (d/h/m/s)
  instrument: string; // e.g. "R_100"
  trade_type: "CALL" | "PUT";
  currency: string; // e.g. "USD"
  payout: string; // e.g. "100"
  strike?: string; // Optional, e.g. "1234.56"
}

export interface ContractPriceResponse {
  date_start: number; // Unix timestamp
  date_expiry: number; // Unix timestamp
  spot: string; // Current market price
  strike: string; // Strike price
  price: string; // Contract price
  trade_type: "CALL" | "PUT";
  instrument: string;
  currency: string;
  payout: string;
  pricing_parameters: {
    volatility: string;
    duration_in_years: string;
  };
}

// Instrument WebSocket Types
export interface InstrumentPriceRequest {
  instrument_id: string;
}

export interface InstrumentPriceResponse {
  instrument_id: string;
  bid: number;
  ask: number;
  timestamp: string; // ISO date-time
}

export interface WebSocketMessageMap {
  [key: string]: {
    request: any;
    response: any;
  };
}
