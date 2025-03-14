import { MarketGroup } from "@/api/services/instrument/types";

export interface Tab {
    id: string;
    label: string;
}

export const tabs: Tab[] = [
    { id: "favourites", label: "Favourites" },
    { id: "all", label: "All" },
    { id: "derived", label: "Derived" },
    { id: "forex", label: "Forex" },
    { id: "crash_boom", label: "Crash/Boom" },
    { id: "stocks", label: "Stocks & indices" },
    { id: "commodities", label: "Commodities" },
];

export const stubMarketGroups: MarketGroup[] = [
    {
        market_name: "synthetic_index",
        instruments: [
            "1HZ10V",
            "1HZ25V",
            "1HZ50V",
            "1HZ75V",
            "1HZ100V",
            "R_10",
            "R_25",
            "R_50",
            "R_75",
            "R_100",
        ],
    },
    {
        market_name: "crash_boom",
        instruments: ["BOOM300N", "BOOM500", "BOOM1000", "CRASH300N", "CRASH500", "CRASH1000"],
    },
    {
        market_name: "forex",
        instruments: ["AUDUSD", "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "USDCAD", "NZDUSD"],
    },
];
