export interface AccountInfo {
    balance: string;
    currency: string;
    uuid: string;
    group: "demo" | "real";
    status: "active" | "inactive";
}

export interface AccountsResponse {
    data: {
        accounts: AccountInfo[];
        total_balance?: string; // Not for MVP
        total_balance_currency?: string; // Not for MVP
    };
}

export const accountData: AccountInfo[] = [
    {
        uuid: "96070fd6-e413-4743-8b12-2485e631cf45",
        balance: "10000.00",
        currency: "USD",
        group: "demo",
        status: "active",
    },
    {
        uuid: "a7c8d9e0-f1a2-3b4c-5d6e-7f8a9b0c1d2e",
        balance: "100.00",
        currency: "USD",
        group: "real",
        status: "active",
    },
    {
        uuid: "3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b",
        balance: "0.000000",
        currency: "BTC",
        group: "real",
        status: "active",
    },
    {
        uuid: "9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
        balance: "0.000000",
        currency: "ETH",
        group: "real",
        status: "active",
    },
    {
        uuid: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
        balance: "0.00",
        currency: "USDC",
        group: "real",
        status: "active",
    },
    {
        uuid: "5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c",
        balance: "0.00",
        currency: "tUSDT",
        group: "real",
        status: "active",
    },
];
