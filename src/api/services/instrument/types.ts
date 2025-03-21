/**
 * Request parameters for available instruments
 */
export interface AvailableInstrumentsRequest {
    product_id?: string; // Optional, e.g., "rise_fall"
    account_uuid?: string; // Optional, e.g., "9f8c1b23-4e2a-47ad-92c2-b1e5d2a7e65f"
}

/**
 * Instrument data structure
 */
export interface Instrument {
    id: string;
    display_name: string;
    categories: string[];
    pip_size: number;
    is_market_open: boolean;
    opens_at?: number; // Optional timestamp in milliseconds
    closes_at?: number; // Optional timestamp in milliseconds
}

/**
 * Response from available instruments API
 */
export interface AvailableInstrumentsResponse {
    data: {
        instruments: Instrument[];
    };
}
