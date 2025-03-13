import { DurationRangesResponse, ProductConfigResponse } from "@/api/services/product/types";
import { adaptDurationRanges } from "@/adapters/duration-config-adapter";

/**
 * Interface for centralized duration configuration
 */
interface DurationConfig {
    ranges: DurationRangesResponse;
    valuesMap: Record<keyof DurationRangesResponse, number[]>;
}

/**
 * Centralized duration configuration object
 * Contains all mutable state related to duration ranges and values
 */
const durationConfig: DurationConfig = {
    ranges: {
        ticks: { min: 1, max: 10 },
        seconds: { min: 15, max: 59 },
        minutes: { min: 1, max: 59 },
        hours: { min: 1, max: 24, step: 1 },
        days: { min: 1, max: 30 },
    },
    valuesMap: {
        ticks: Array.from({ length: 10 }, (_, i) => i + 1),
        seconds: Array.from({ length: 45 }, (_, i) => i + 15),
        minutes: Array.from({ length: 60 }, (_, i) => i),
        hours: Array.from({ length: 24 }, (_, i) => i + 1),
        days: Array.from({ length: 30 }, (_, i) => i + 1),
    },
};

/**
 * Gets a copy of the current duration ranges
 * @returns Current duration ranges configuration
 */
export function getDurationRanges(): DurationRangesResponse {
    return { ...durationConfig.ranges };
}

/**
 * Gets a copy of the current duration values map
 * @returns Current duration values map
 */
export function getDurationValuesMap(): Record<keyof DurationRangesResponse, number[]> {
    return { ...durationConfig.valuesMap };
}

/**
 * Updates duration ranges and pre-computed values from API config
 */
export function updateDurationRanges(config: ProductConfigResponse): void {
    const newRanges = adaptDurationRanges(config);
    durationConfig.ranges = newRanges;

    // Update the pre-computed values
    Object.keys(durationConfig.ranges).forEach((key) => {
        const typedKey = key as keyof DurationRangesResponse;
        const range = durationConfig.ranges[typedKey];

        if (range) {
            durationConfig.valuesMap[typedKey] = Array.from(
                { length: range.max - range.min + 1 },
                (_, i) => i + range.min
            );
        }
    });
}

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
    ticks: "t",
    seconds: "s",
    minutes: "m",
    hours: "h",
    days: "d",
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
    if (type === "minutes" && hour !== undefined) {
        return SPECIAL_HOUR_CASES[hour]?.minutes || ALL_MINUTES;
    }

    const range = durationConfig.ranges[type];
    if (!range) return [];

    const { min, max, step = 1 } = range;
    return Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => min + i * step);
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
    const range = durationConfig.ranges[type];
    if (!range) return false;
    return value >= range.min && value <= range.max;
}

/**
 * Gets the default duration value for a given type.
 * @param type - The duration type
 * @returns Default duration value for the type
 */
export function getDefaultDuration(type: keyof DurationRangesResponse): number {
    const range = durationConfig.ranges[type];
    if (!range) return 0;
    return type === "minutes" ? 1 : range.min;
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

    if (type === "hours" && value.includes(":")) {
        apiDurationValue = convertHourToMinutes(value).toString();
        apiDurationType = "minutes";
    } else if (type === "hours") {
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

    if (type === "hours") {
        const [hours, minutes] = value.split(":").map(Number);
        const hourText = hours === 1 ? "hour" : "hours";
        const minuteText = minutes === 1 ? "minute" : "minutes";
        return minutes > 0
            ? `${hours} ${hourText} ${minutes} ${minuteText}`
            : `${hours} ${hourText}`;
    }

    const numValue = parseInt(value, 10);
    switch (type) {
        case "ticks":
            return `${numValue} ${numValue === 1 ? "tick" : "ticks"}`;
        case "seconds":
            return `${numValue} ${numValue === 1 ? "second" : "seconds"}`;
        case "minutes":
            return `${numValue} ${numValue === 1 ? "minute" : "minutes"}`;
        case "days":
            return `${numValue} ${numValue === 1 ? "day" : "days"}`;
        default:
            return duration;
    }
};
