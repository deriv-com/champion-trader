/**
 * Request parameters for buying a contract
 */
export interface BuyContractRequest {
    idempotency_key: string;
    product_id: string;
    proposal_details: {
        instrument_id: string;
        duration: number;
        duration_unit: string;
        allow_equals: boolean;
        stake: string;
        variant: string;
        payout: string;
    };
}

/**
 * Response from buy contract API
 */
export interface BuyContractResponse {
    data: {
        idempotency_key: string;
        contract_id: string;
        product_id: string;
        buy_price: string;
        buy_time: number;
        contract_details: {
            contract_start_time: number;
            contract_expiry_time: number;
            entry_tick_time: number;
            entry_spot: string;
            duration: number;
            duration_unit: string;
            allow_equals: boolean;
            stake: string;
            bid_price: string;
            bid_price_currency: string;
            variant: string;
            barrier: string;
            is_expired: boolean;
            is_valid_to_sell: boolean;
            is_sold: boolean;
            potential_payout: string;
        };
    };
}

/**
 * Request parameters for selling a contract
 */
export interface SellContractRequest {
    contract_id: string;
    price?: number;
}

/**
 * Response from sell contract API
 */
export interface SellContractResponse {
    contract_id: string;
    price: number;
    profit: number;
    // Add other sell response properties as needed
}

/**
 * Open contract data from SSE stream
 */
export interface OpenContract {
    contract_id: string;
    instrument_id: string;
    trade_type: string;
    entry_price: number;
    current_price: number;
    profit: number;
    status: string;
    // Add other open contract properties as needed
}

/**
 * Closed contract data from SSE stream
 */
export interface ClosedContract {
    contract_id: string;
    instrument_id: string;
    trade_type: string;
    entry_price: number;
    exit_price: number;
    profit: number;
    status: string;
    // Add other closed contract properties as needed
}
