import { TradeAction } from "@/hooks/useTradeActions";

// Define a type for buy actions only (excluding sell_contract)
export type BuyAction = Exclude<TradeAction, "sell_contract">;

export interface TradeButton {
    title: string;
    label: string;
    className: string;
    position: "left" | "right";
    actionName: BuyAction; // Use BuyAction instead of TradeAction
    contractType: string; // The actual contract type to use with the API (e.g., "CALL", "PUT")
}

export interface TradeTypeConfig {
    displayName: string; // default display name for the trade type
    fields: {
        duration: boolean;
        stake: boolean;
        allowEquals?: boolean;
    };
    buttons: TradeButton[];
    payouts: {
        max: boolean; // Whether to show max payout
        labels: Record<string, string>; // Map button actionName to payout label
    };
    metadata?: {
        preloadFields?: boolean; // If true, preload field components when trade type is selected
        preloadActions?: boolean; // If true, preload action handlers
    };
}

export const tradeTypeConfigs: Record<string, TradeTypeConfig> = {
    rise_fall: {
        displayName: "Rise/Fall",
        fields: {
            duration: true,
            stake: true,
            allowEquals: false,
        },
        metadata: {
            preloadFields: true, // Most common trade type, preload fields
            preloadActions: true,
        },
        payouts: {
            max: true,
            labels: {
                buy_rise: "Payout (Rise)",
                buy_fall: "Payout (Fall)",
            },
        },
        buttons: [
            {
                title: "Rise",
                label: "Payout",
                className: "bg-color-rise-700 hover:bg-color-rise-600",
                position: "right",
                actionName: "buy_rise",
                contractType: "CALL",
            },
            {
                title: "Fall",
                label: "Payout",
                className: "bg-color-fall-700 hover:bg-color-fall-600",
                position: "left",
                actionName: "buy_fall",
                contractType: "PUT",
            },
        ],
    },
    high_low: {
        displayName: "Higher/Lower",
        fields: {
            duration: true,
            stake: true,
        },
        metadata: {
            preloadFields: false,
            preloadActions: false,
        },
        payouts: {
            max: true,
            labels: {
                buy_higher: "Payout (Higher)",
                buy_lower: "Payout (Lower)",
            },
        },
        buttons: [
            {
                title: "Higher",
                label: "Payout",
                className: "bg-color-rise-700 hover:bg-color-rise-600",
                position: "right",
                actionName: "buy_higher",
                contractType: "CALL",
            },
            {
                title: "Lower",
                label: "Payout",
                className: "bg-color-fall-700 hover:bg-color-fall-600",
                position: "left",
                actionName: "buy_lower",
                contractType: "PUT",
            },
        ],
    },
    touch: {
        displayName: "Touch/No Touch",
        fields: {
            duration: true,
            stake: true,
        },
        metadata: {
            preloadFields: false,
            preloadActions: false,
        },
        payouts: {
            max: true,
            labels: {
                buy_touch: "Payout (Touch)",
                buy_no_touch: "Payout (No Touch)",
            },
        },
        buttons: [
            {
                title: "Touch",
                label: "Payout",
                className: "bg-color-rise-700 hover:bg-color-rise-600",
                position: "right",
                actionName: "buy_touch",
                contractType: "TOUCH",
            },
            {
                title: "No Touch",
                label: "Payout",
                className: "bg-color-fall-700 hover:bg-color-fall-600",
                position: "left",
                actionName: "buy_no_touch",
                contractType: "NOTOUCH",
            },
        ],
    },
    multiplier: {
        displayName: "Multipliers",
        fields: {
            duration: true,
            stake: true,
            allowEquals: false,
        },
        metadata: {
            preloadFields: false,
            preloadActions: false,
        },
        payouts: {
            max: true,
            labels: {
                buy_multiplier: "Potential Profit",
            },
        },
        buttons: [
            {
                title: "Buy",
                label: "Payout",
                className: "bg-color-rise-700 hover:bg-color-rise-600",
                position: "right",
                actionName: "buy_multiplier",
                contractType: "MULTUP",
            },
        ],
    },
};

export type TradeType = keyof typeof tradeTypeConfigs;
