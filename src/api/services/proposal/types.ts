/**
 * Proposal request parameters
 */
export interface ProposalRequest {
    product_id: string; // e.g., "rise_fall"
    instrument_id: string; // e.g., "frxUSDJPY"
    duration: number; // e.g., 900
    duration_unit: string; // e.g., "seconds"
    allow_equals?: boolean; // e.g., false
    stake: string; // e.g., "2.00"
    account_uuid?: string; // e.g., "9f8c1b23-4e2a-47ad-92c2-b1e5d2a7e65f"
}

/**
 * Contract details in the proposal response
 */
export interface ContractDetails {
    payout: string;
    stake: string;
    probability: number;
    pricing_spot: string;
    barrier: string;
    allow_equals: boolean;
    contract_expiry_time: number;
}

/**
 * Proposal variant (rise or fall)
 */
export interface ProposalVariant {
    variant: string; // e.g., "rise" or "fall"
    contract_details: ContractDetails;
}

/**
 * Proposal data from SSE stream
 */
export interface ProposalData {
    data: {
        variants: ProposalVariant[];
    };
}
