/**
 * Proposal request parameters
 */
export interface ProposalRequest {
    instrument_id: string;
    trade_type: string;
    duration: string;
    amount: number;
    currency: string;
}

/**
 * Proposal data from SSE stream
 */
export interface ProposalData {
    id: string;
    price: number;
    payout: number;
    spot: number;
    spot_time: number;
    // Add other proposal properties as needed
}
