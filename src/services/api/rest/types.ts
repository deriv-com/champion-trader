export interface AvailableInstrumentsRequest {
  context: {
    app_id: number;
    account_type: string;
  };
  trace?: boolean;
}

export interface MarketGroup {
  instruments: string[];
  market_name: string;
}

export interface AvailableInstrumentsResponse {
  performance: string;
  result: MarketGroup[];
}

export interface ErrorResponse {
  error: string;
}
