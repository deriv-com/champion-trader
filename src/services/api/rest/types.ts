export interface AvailableInstrumentsRequest {
  context: {
    app_id: number;
    account_type: string;
  };
  trace?: boolean;
}

export interface Instrument {
  id: string;
  name: string;
}

export interface AvailableInstrumentsResponse {
  instruments: Instrument[];
}

export interface ErrorResponse {
  error: string;
}
