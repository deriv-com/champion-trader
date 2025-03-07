export const TRADE_TYPES = [
    "Rise/Fall",
    "Multiplier",
    "Even/Odd",
    "Over/Under",
    "Touch/No Touch",
] as const;

export const TIME_PERIODS = [
    "All time",
    "Today",
    "Yesterday",
    "Last 7 days",
    "Last 30 days",
    "Last 60 days",
    "Last 90 days",
] as const;

export type Position = {
    id: number;
    type: string;
    market: string;
    ticks: string;
    stake: string;
    profit: string;
};

export const OPEN_POSITIONS: Position[] = [
    {
        id: 1,
        type: "Rise/Fall",
        market: "Volatility 100 Index",
        ticks: "2/150",
        stake: "10.00 USD",
        profit: "+1.00 USD",
    },
    {
        id: 2,
        type: "Rise/Fall",
        market: "Volatility 75 Index",
        ticks: "6/150",
        stake: "10.00 USD",
        profit: "+1.00 USD",
    },
];

export const CLOSED_POSITIONS: Position[] = [
    {
        id: 3,
        type: "Rise/Fall",
        market: "Volatility 100 Index",
        ticks: "2/150",
        stake: "10.00 USD",
        profit: "-1.50 USD",
    },
    {
        id: 4,
        type: "Rise/Fall",
        market: "Volatility 75 Index",
        ticks: "6/150",
        stake: "15.00 USD",
        profit: "+2.00 USD",
    },
    {
        id: 5,
        type: "Rise/Fall",
        market: "Volatility 50 Index",
        ticks: "4/150",
        stake: "20.00 USD",
        profit: "+3.00 USD",
    },
];
