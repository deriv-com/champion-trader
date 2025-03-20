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
 * Query parameters for selling a contract
 * According to API spec, contract_id and account_uuid should be query parameters
 */
export interface SellContractRequest {
    contract_id: string;
    account_uuid?: string;
}

/**
 * Response from sell contract API
 */
export interface SellContractResponse {
    data: {
        contract_id: string;
        product_id: string;
        buy_price: string;
        buy_time: number;
        sell_price: string;
        sell_time: number;
        profit: string;
        contract_details: ContractDetails;
    };
}

// Response structure for open contracts
export interface OpenContractsResponse {
    data: {
        contracts: Array<{
            contract_id: string;
            product_id: string;
            contract_details: ContractDetails;
        }>;
    };
}

// Response structure for closed contracts
export interface ClosedContractsResponse {
    data: {
        contracts: Array<{
            contract_id: string;
            product_id: string;
            contract_details: ContractDetails;
        }>;
        pagination: {
            current_page: number;
            limit: number;
            total_items: number;
            total_pages: number;
        };
    };
}

// Common contract details structure
export interface ContractDetails {
    allow_equals: boolean;
    barrier: string;
    bid_price: string;
    bid_price_currency: string;
    contract_expiry_time: number;
    contract_start_time: number;
    duration: number;
    duration_unit: string;
    entry_spot: string;
    entry_tick_time: number;
    exit_spot: string;
    exit_tick_time?: number;
    exit_time?: number;
    instrument_id: string;
    instrument_name: string;
    is_expired: boolean;
    is_sold: boolean;
    is_valid_to_sell: boolean;
    potential_payout: string;
    profit_loss: string;
    reference_id: string;
    stake: string;
    variant: string;
    buy_tick_id?: number;
    pricing_tick_id?: string;
    sell_tick_id?: number;
    tick_stream: Array<{
        ask: string;
        bid: string;
        epoch_ms: number;
        price: string;
    }>;
}

// Simplified contract type for UI display
export interface Contract {
    contract_id: string;
    product_id: string;
    details: ContractDetails;
}
