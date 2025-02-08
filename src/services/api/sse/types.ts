export interface ContractPriceRequest {
  action: 'contract_price';
  duration: string;
  trade_type: string;
  instrument: string;
  currency: string;
  payout: string;
}

export interface ContractPriceResponse {
  date_start: number;
  date_expiry: number;
  spot: string;
  strike: string;
  price: string;
  trade_type: string;
  instrument: string;
  currency: string;
  payout: string;
  pricing_parameters: {
    commission_percent: string;
    commission_amount: string;
    volatility: string;
    spot_price: string;
    duration_in_years: string;
  };
  account: null;
  transaction: null;
}
