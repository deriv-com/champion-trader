import { DurationRangesResponse } from "@/services/api/rest/duration/types";

/**
 * Duration ranges for different duration types.
 * Will be replaced by API response later.
 */
export const DURATION_RANGES: DurationRangesResponse = {
    tick: { min: 1, max: 10 },
    second: { min: 15, max: 59 },
    minute: { min: 1, max: 59 },
    hour: { min: 1, max: 24, step: 1 },
    day: { min: 1, max: 30 },
};

// Pre-computed duration values for better performance
const DURATION_VALUES_MAP: Record<keyof DurationRangesResponse, number[]> = {
    tick: Array.from({ length: 10 }, (_, i) => i + 1),
    second: Array.from({ length: 45 }, (_, i) => i + 15),
    minute: Array.from({ length: 60 }, (_, i) => i),
    hour: Array.from({ length: 24 }, (_, i) => i + 1),
    day: Array.from({ length: 30 }, (_, i) => i + 1),
};

// Define special hour cases
interface SpecialHourCase {
    key: string;
    minutes: number[];
}

export const SPECIAL_HOUR_CASES: Record<number, SpecialHourCase> = {
    24: {
        key: "24h",
        minutes: [0],
    },
};

// Pre-computed minutes values for better performance
const ALL_MINUTES: number[] = Array.from({ length: 60 }, (_, i) => i);

// Map duration types to their SSE format
export const DURATION_FORMAT_MAP: Record<keyof DurationRangesResponse, string> = {
    tick: "t",
    second: "s",
    minute: "m",
    hour: "h",
    day: "d",
};

/**
 * Formats duration value and type for contract SSE.
 * @param value - The duration value
 * @param type - The duration type (tick, second, minute, hour, day)
 * @returns Formatted duration string (e.g., '5m', '1h', '10t')
 */
export function formatDuration(value: number, type: keyof DurationRangesResponse): string {
    return `${value}${DURATION_FORMAT_MAP[type]}`;
}

/**
 * Generates duration values for a given duration type.
 * Uses pre-computed values for better performance.
 * @param type - The duration type
 * @param hour - Optional hour value for minute type
 * @returns Array of valid duration values
 */
export function generateDurationValues(
    type: keyof DurationRangesResponse,
    hour?: number
): number[] {
    if (type === "minute" && hour !== undefined) {
        return SPECIAL_HOUR_CASES[hour]?.minutes || ALL_MINUTES;
    }
    return DURATION_VALUES_MAP[type] || [];
}

/**
 * Gets key suffix for special hour cases.
 * @param hour - The hour value
 * @returns Special case key (e.g., '24h') or empty string
 */
export function getSpecialCaseKey(hour?: number): string {
    if (hour === undefined) return "";
    return SPECIAL_HOUR_CASES[hour]?.key || "";
}

/**
 * Validates if a duration value is within allowed range for its type.
 * @param type - The duration type
 * @param value - The duration value to validate
 * @returns True if duration is valid, false otherwise
 */
export function isValidDuration(type: keyof DurationRangesResponse, value: number): boolean {
    const range = DURATION_RANGES[type];
    if (!range) return false;
    return value >= range.min && value <= range.max;
}

/**
 * Gets the default duration value for a given type.
 * @param type - The duration type
 * @returns Default duration value for the type
 */
export function getDefaultDuration(type: keyof DurationRangesResponse): number {
    const range = DURATION_RANGES[type];
    if (!range) return 0;
    return type === "minute" ? 1 : range.min;
}

/**
 * Interface for parsed duration result.
 */
export interface ParsedDuration {
    value: string;
    type: keyof DurationRangesResponse;
}

/**
 * Parses a duration string into value and type.
 * Handles special cases like hours with minutes.
 * @param duration - Duration string (e.g., '5 minute', '1:30 hour')
 * @returns Parsed duration with value and type
 */
export function parseDuration(duration: string): ParsedDuration {
    const [value, type] = duration.split(" ");
    let apiDurationValue = value;
    let apiDurationType = type as keyof DurationRangesResponse;

    if (type === "hour" && value.includes(":")) {
        apiDurationValue = convertHourToMinutes(value).toString();
        apiDurationType = "minute";
    } else if (type === "hour") {
        apiDurationValue = value.split(":")[0];
    }

    return {
        value: apiDurationValue,
        type: apiDurationType,
    };
}

/**
 * Converts hour:minute format to total minutes.
 * @param hourValue - Hour value in format 'HH:mm'
 * @returns Total minutes
 */
export function convertHourToMinutes(hourValue: string): number {
    const [hours, minutes] = hourValue.split(":").map(Number);
    return hours * 60 + (minutes || 0);
}

export const formatDurationDisplay = (duration: string): string => {
    const [value, type] = duration.split(" ");

    if (type === "hour") {
        const [hours, minutes] = value.split(":").map(Number);
        const hourText = hours === 1 ? "hour" : "hours";
        const minuteText = minutes === 1 ? "minute" : "minutes";
        return minutes > 0
            ? `${hours} ${hourText} ${minutes} ${minuteText}`
            : `${hours} ${hourText}`;
    }

    const numValue = parseInt(value, 10);
    switch (type) {
        case "tick":
            return `${numValue} ${numValue === 1 ? "tick" : "ticks"}`;
        case "second":
            return `${numValue} ${numValue === 1 ? "second" : "seconds"}`;
        case "minute":
            return `${numValue} ${numValue === 1 ? "minute" : "minutes"}`;
        case "day":
            return `${numValue} day`;
        default:
            return duration;
    }
};
