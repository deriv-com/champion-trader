import { ReactNode } from "react";
import { DurationController } from "@/components/Duration";
import { MarketSelectorList } from "@/components/MarketSelector/MarketSelectorList";
import { StakeController } from "@/components/Stake";
import { guideConfig } from "./guideConfig";

export interface BottomSheetConfig {
    [key: string]: {
        body: ReactNode;
        height?: string;
    };
}

export const bottomSheetConfig: BottomSheetConfig = {
    "market-info": {
        body: <MarketSelectorList />,
    },
    stake: {
        body: <StakeController />,
    },
    duration: {
        body: <DurationController />,
    },
    "how-to-trade": {
        body: (
            <div className="flex flex-col h-full px-6 pt-6">
                {guideConfig["rise_fall"].header}
                <div className="flex-1 overflow-y-auto">{guideConfig["rise_fall"].body}</div>
            </div>
        ),
    },
};
