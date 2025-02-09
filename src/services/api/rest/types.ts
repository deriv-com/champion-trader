export interface Context {
  app_id: string;
  account_type?: string;
}

export interface AvailableInstrumentsRequest {
  instrument: string;
  context: Context;
}

export interface Instrument {
  id: string;
  name: string;
}

export interface AvailableInstrumentsResponse {
  instruments: Instrument[];
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export interface BuyRequest {
  price: number;
  instrument: string;
  duration: string;
  trade_type: string;
  currency: string;
  payout: number;
  strike: string;
}

export interface BuyResponse {
  contract_id: string;
  price: number;
  trade_type: string;
}
