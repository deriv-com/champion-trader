import { MARKER_TYPES_CONFIG } from "@/config/markers";

/**
 * Creates a marker configuration by extending the base marker type config
 * @param marker_type - The type of marker to create
 * @param x - The x-coordinate (epoch) for the marker
 * @param y - The y-coordinate (price) for the marker
 * @param content_config - Additional configuration for the marker content
 * @returns The marker configuration
 */
const createMarkerConfig = (
    marker_type: string,
    x: number | string,
    y: number | string | null,
    content_config?: any
) => {
    return {
        ...MARKER_TYPES_CONFIG[marker_type as keyof typeof MARKER_TYPES_CONFIG],
        marker_config: {
            ...MARKER_TYPES_CONFIG[marker_type as keyof typeof MARKER_TYPES_CONFIG].marker_config,
            x: +x,
            y,
        },
        content_config: {
            ...MARKER_TYPES_CONFIG[marker_type as keyof typeof MARKER_TYPES_CONFIG].content_config,
            ...(content_config || {}),
        },
    };
};

/**
 * Gets the spot count for a contract
 * @param contract_info - The contract information
 * @param spot_count - The current spot count
 * @returns The updated spot count
 */
export const getSpotCount = (contract_info: any, spot_count: number) => {
    if (
        isDigitContract(contract_info.contract_type) ||
        (isTicksContract(contract_info.contract_type) &&
            spot_count + 1 === contract_info.selected_tick)
    )
        return spot_count + 1;

    if (
        isAccumulatorContract(contract_info.contract_type) ||
        isSmartTraderContract(contract_info.contract_type)
    )
        return null;

    return spot_count;
};

// Helper functions to check contract types
export const isDigitContract = (contract_type: string) => /digit/i.test(contract_type);
export const isTicksContract = (contract_type: string) => /tick/i.test(contract_type);
export const isAccumulatorContract = (contract_type: string) => /accumulator/i.test(contract_type);
export const isSmartTraderContract = (contract_type: string) => /smart_trader/i.test(contract_type);
export const isVanillaContract = (contract_type: string) => /vanilla/i.test(contract_type);

// -------------------- Lines --------------------
export const createMarkerEndTime = (contract_info: any) => {
    const end_time = getEndTime(contract_info);
    if (!end_time) return false;

    // Determine status based on contract status and profit
    let status = "open";
    if (contract_info.status === "sold") {
        status = "sold";
    } else if (contract_info.profit !== undefined) {
        status = contract_info.profit >= 0 ? "won" : "lost";
    }

    return createMarkerConfig(MARKER_TYPES_CONFIG.LINE_END.type, +end_time, null, {
        status,
        marker_config: MARKER_TYPES_CONFIG,
    });
};

export const createMarkerPurchaseTime = (contract_info: any) => {
    if (
        !contract_info.purchase_time ||
        !contract_info.date_start ||
        +contract_info.purchase_time === +contract_info.date_start
    )
        return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.LINE_PURCHASE.type,
        +contract_info.purchase_time,
        null
    );
};

export const createMarkerStartTime = (contract_info: any) => {
    if (!contract_info.date_start) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.LINE_START.type,
        +contract_info.date_start,
        null,
        {
            marker_config: MARKER_TYPES_CONFIG,
        }
    );
};

export const createMarkerResetTime = (contract_info: any) => {
    if (!contract_info.reset_time) return false;

    return createMarkerConfig(
        MARKER_TYPES_CONFIG.LINE_RESET.type,
        +contract_info.reset_time,
        null,
        {
            marker_config: MARKER_TYPES_CONFIG,
        }
    );
};

// -------------------- Spots --------------------
export const createMarkerSpotEntry = (contract_info: any) => {
    if (!contract_info.entry_tick_time) return false;

    const entry_tick = contract_info.entry_tick_display_value || contract_info.entry_tick;
    const spot_has_label =
        isDigitContract(contract_info.contract_type) ||
        isTicksContract(contract_info.contract_type);
    const marker_type = MARKER_TYPES_CONFIG.SPOT_ENTRY.type;
    let component_props = {};

    if (spot_has_label) {
        component_props = {
            spot_value: `${entry_tick}`,
            spot_epoch: `${contract_info.entry_tick_time}`,
            spot_count: 1,
        };
    }

    return createMarkerConfig(
        marker_type,
        contract_info.entry_tick_time,
        entry_tick,
        component_props
    );
};

export const createMarkerSpotExit = (contract_info: any, tick?: any, idx?: number) => {
    if (!contract_info.exit_tick_time) return false;
    const is_ticks_contract = isTicksContract(contract_info.contract_type);

    let spot_count, align_label;
    if (tick) {
        spot_count = getSpotCount(contract_info, idx || 0);
        align_label = tick.align_label;
    }

    const exit_tick = contract_info.exit_tick_display_value || contract_info.exit_tick;

    const should_show_spot_exit_2 =
        is_ticks_contract && (idx || 0) + 1 !== contract_info.selected_tick;
    const should_show_profit_label = isVanillaContract(contract_info.contract_type) && !isMobile();

    const marker_spot_type = should_show_spot_exit_2
        ? MARKER_TYPES_CONFIG.SPOT_EXIT_2.type
        : MARKER_TYPES_CONFIG.SPOT_EXIT.type;

    // Determine status based on contract status and profit
    let status = "open";
    if (contract_info.status === "sold") {
        status = "sold";
    } else if (contract_info.profit !== undefined) {
        status = +contract_info.profit >= 0 ? "won" : "lost";
    }

    const component_props = {
        spot_value: `${exit_tick}`,
        spot_epoch: `${contract_info.exit_tick_time}`,
        status,
        align_label: should_show_profit_label ? "middle" : align_label,
        spot_count: should_show_spot_exit_2 ? contract_info.tick_stream?.length : spot_count,
        spot_profit: should_show_profit_label
            ? `${formatMoney(contract_info.currency, contract_info.profit, true)} ${contract_info.currency}`
            : "",
    };

    return createMarkerConfig(
        marker_spot_type,
        +contract_info.exit_tick_time,
        +exit_tick,
        component_props
    );
};

// Helper functions
export const getEndTime = (contract_info: any) => {
    return contract_info.exit_tick_time || contract_info.date_expiry || contract_info.end_time;
};

export const isMobile = () => {
    return window.innerWidth <= 768;
};

export const formatMoney = (currency: string, amount: number, show_sign = false) => {
    const sign = amount < 0 ? "-" : show_sign && amount > 0 ? "+" : "";
    const abs_amount = Math.abs(amount);
    const formatted = abs_amount.toFixed(2);
    return `${sign}${formatted}`;
};

/**
 * Calculate the position of a marker on the chart based on price and time
 * @param chart - The chart instance
 * @param price - The price value
 * @param epoch - The epoch timestamp
 * @returns The x and y coordinates
 */
export const calculateMarkerPosition = (
    chart: any,
    price: number,
    epoch: number
): { x: number; y: number } => {
    if (!chart || typeof chart.pixelToPrice !== "function") {
        return { x: 0, y: 0 };
    }

    try {
        // Convert epoch to chart x-coordinate
        const x = chart.timeToPixel(epoch * 1000);

        // Convert price to chart y-coordinate
        const y = chart.priceToPixel(price);

        return { x, y };
    } catch (error) {
        console.error("Error calculating marker position:", error);
        return { x: 0, y: 0 };
    }
};

/**
 * Format price for display
 * @param price - The price value
 * @param digits - Number of decimal places
 * @returns Formatted price string
 */
export const formatPrice = (price: number | string, digits: number = 2): string => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return numPrice.toFixed(digits);
};

/**
 * Calculate profit/loss
 * @param entryPrice - Entry price
 * @param exitPrice - Exit price
 * @param contractType - Type of contract ('CALL' or 'PUT')
 * @returns Profit/loss amount
 */
export const calculateProfitLoss = (
    entryPrice: number,
    exitPrice: number,
    contractType: "CALL" | "PUT"
): number => {
    if (contractType === "CALL") {
        return exitPrice - entryPrice;
    } else {
        return entryPrice - exitPrice;
    }
};

/**
 * Determine if contract is a win or loss
 * @param entryPrice - Entry price
 * @param exitPrice - Exit price
 * @param contractType - Type of contract ('CALL' or 'PUT')
 * @returns Boolean indicating if contract is a win
 */
export const isContractWin = (
    entryPrice: number,
    exitPrice: number,
    contractType: "CALL" | "PUT"
): boolean => {
    const profitLoss = calculateProfitLoss(entryPrice, exitPrice, contractType);
    return profitLoss > 0;
};

/**
 * Format time from epoch
 * @param epoch - Epoch timestamp in seconds
 * @param format - Format type ('time', 'date', 'datetime')
 * @returns Formatted time string
 */
export const formatEpochTime = (
    epoch: number,
    format: "time" | "date" | "datetime" = "time"
): string => {
    const date = new Date(epoch * 1000);

    switch (format) {
        case "time":
            return date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
        case "date":
            return date.toLocaleDateString();
        case "datetime":
            return date.toLocaleString();
        default:
            return date.toLocaleTimeString();
    }
};
