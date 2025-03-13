/**
 * User account information
 */
export interface Account {
    id: string;
    type: string;
    currency: string;
    balance: number;
    // Add other account properties as needed
}

/**
 * Response from accounts API
 */
export interface AccountsResponse {
    data: {
        accounts: Account[];
    };
}

/**
 * Response from the balance stream API
 */
export interface BalanceResponse {
    data: {
        balance: string;
        currency: string;
        timestamp: number;
        change?: string;
    };
}
