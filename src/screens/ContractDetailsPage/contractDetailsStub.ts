export interface ContractDetails {
    contract_id: string;
    product_id: string;
    instrument_id: string;
    buy_price: string;
    buy_time: number;
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
}

export const contractDetailsStub: ContractDetails = {
    contract_id: "123ef4567-e89b-12d3-a456-426614174000",
    product_id: "rise_fall",
    instrument_id: "frxEURUSD",
    buy_price: "1.00",
    buy_time: 1741669445330,
    contract_start_time: 1741669445330,
    contract_expiry_time: 1741669449330,
    entry_tick_time: 1741669445330,
    entry_spot: "122",
    duration: 900,
    duration_unit: "seconds",
    allow_equals: false,
    stake: "2.00",
    bid_price: "1.90",
    bid_price_currency: "USD",
    variant: "rise",
    barrier: "133.450",
    is_expired: false,
    is_valid_to_sell: false,
    is_sold: false,
    potential_payout: "1.00",
};
