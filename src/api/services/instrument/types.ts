/**
 * Context for instrument requests
 */
export interface Context {
    app_id: number | string;
    account_type?: string;
}

/**
 * Request parameters for available instruments
 */
export interface AvailableInstrumentsRequest {
    instrument: string;
    context: Context;
}

/**
 * Market group with instruments
 */
export interface MarketGroup {
    instruments: string[];
    market_name: string;
}

/**
 * Response from available instruments API
 */
export interface AvailableInstrumentsResponse {
    performance: string;
    result: MarketGroup[];
}
