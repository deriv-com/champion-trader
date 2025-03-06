import { ReactNode } from "react";
import { MarketSelectorList } from "@/components/MarketSelector/MarketSelectorList";

export interface MarketSidebarConfig {
    [key: string]: {
        body: ReactNode;
        title?: string;
    };
}

export const marketSidebarConfig: MarketSidebarConfig = {
    "market-list": {
        body: <MarketSelectorList />,
    },
    // Add more sidebar components here as needed
};
