export interface BuyRequest {
  duration: string;
  instrument: string;
  trade_type: string;
  currency: string;
  payout: string;
  strike: string;
}

export interface BuyResponse {
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
  account: {
    id: string;
    balance: string;
    currency: string;
  };
  transaction: {
    id: string;
    user_id: string;
    type: string;
    amount: string;
    timestamp: string;
  };
}
