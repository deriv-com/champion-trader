export interface BalanceRequest {
    account_uuid: string;
}

export interface BalanceResponse {
    balance: string;
    currency: string;
}
