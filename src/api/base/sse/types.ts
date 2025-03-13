/**
 * Response from contract price SSE
 */
export interface ContractPriceResponse {
    price: string;
    id: string;
    date_start: number;
    date_expiry: number;
    currency: string;
    payout: number;
}

/**
 * Response from balance SSE
 */
export interface BalanceResponse {
    balance: string;
    currency: string;
    id: string;
    loginid: string;
}

/**
 * Generic SSE response
 */
export interface SSEResponse<T = any> {
    data: T;
    event: string;
    subscription_id?: string;
}
