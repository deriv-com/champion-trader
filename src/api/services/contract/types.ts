/**
 * Request parameters for buying a contract
 */
export interface BuyContractRequest {
    instrument_id: string;
    trade_type: string;
    duration: string;
    amount: number;
    currency: string;
    price?: number;
    // Add other buy parameters as needed
}

/**
 * Response from buy contract API
 */
export interface BuyContractResponse {
    contract_id: string;
    price: number;
    // Add other buy response properties as needed
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
