export interface ContractDetails {
    type: string;
    market: string;
    stake: string;
    profit: string;
    duration: string;
    barrier: string;
    payout: string;
    startTime: string;
    startTimeGMT: string;
    entrySpot: string;
    entryTimeGMT: string;
    exitTime: string;
    exitTimeGMT: string;
    exitSpot: string;
}

export const contractDetailsStub: ContractDetails = {
    type: "Rise",
    market: "Volatility 100 (1s) Index",
    stake: "10.00",
    profit: "+0.00",
    duration: "5 minutes",
    barrier: "329879.6438",
    payout: "11.00",
    startTime: "01 Jan 2024",
    startTimeGMT: "16:00:02 GMT",
    entrySpot: "238972.7174",
    entryTimeGMT: "01 Jan 2024, 16:00:02 GMT",
    exitTime: "01 Jan 2024",
    exitTimeGMT: "17:20:36 GMT",
    exitSpot: "283297.3823",
};
