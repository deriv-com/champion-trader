import { DurationRangesResponse, ProductConfigResponse } from "@/api/services/product/types";

/**
 * Filters duration types based on API configuration
 *
 * @param config - Product configuration from API
 * @param allDurationTypes - All available duration types
 * @returns Filtered duration types based on API support and valid ranges
 */
export function getAvailableDurationTypes<T extends { value: string; label: string }>(
    config: ProductConfigResponse | null,
    allDurationTypes: T[]
): T[] {
    if (!config?.data?.validations?.durations) {
        return allDurationTypes;
    }

    const { durations } = config.data.validations;
    const ranges = adaptDurationRanges(config);

    // Only show duration types that have valid ranges
    return allDurationTypes.filter((type) => {
        const hasRange = ranges[type.value as keyof DurationRangesResponse];
        const isTimeBasedType = type.value === "minutes" || type.value === "hours";
        const isSupported = isTimeBasedType
            ? durations.supported_units.includes("seconds") // minutes and hours are derived from seconds
            : durations.supported_units.includes(type.value);

        return isSupported && hasRange;
    });
}

/**
 * Converts seconds to appropriate duration ranges for each type
 */
export const convertSecondsToDurationRanges = (
    minSeconds: number,
    maxSeconds: number
): Partial<DurationRangesResponse> => {
    const result: Partial<DurationRangesResponse> = {};

    // Handle seconds (1-59)
    if (minSeconds < 60) {
        result.seconds = {
            min: minSeconds,
            max: Math.min(59, maxSeconds),
        };
    }

    // Handle minutes (1-59)
    if (maxSeconds >= 60) {
        result.minutes = {
            min: 1,
            max: Math.min(59, Math.floor(maxSeconds / 60)),
        };
    }

    // Handle hours (1-24)
    if (maxSeconds >= 3600) {
        result.hours = {
            min: 1,
            max: Math.min(24, Math.floor(maxSeconds / 3600)),
            step: 1,
        };
    }

    return result;
};

/**
 * Converts product config response to internal duration ranges format
 */
export const adaptDurationRanges = (config: ProductConfigResponse): DurationRangesResponse => {
    const { durations } = config.data.validations;
    const result: Partial<DurationRangesResponse> = {};

    // Process each supported unit
    durations.supported_units.forEach((unit) => {
        // Handle ticks separately as they're not time-based
        if (unit === "ticks" && durations.ticks) {
            result.ticks = {
                min: durations.ticks.min,
                max: durations.ticks.max,
            };
        }

        // Handle seconds-based units (seconds, minutes, hours)
        if (unit === "seconds" && durations.seconds) {
            // Convert seconds range to appropriate ranges for each duration type
            const secondsRanges = convertSecondsToDurationRanges(
                durations.seconds.min,
                durations.seconds.max
            );

            // Merge the converted ranges
            Object.assign(result, secondsRanges);
        }

        // Handle days directly from API
        if (unit === "days" && durations.days) {
            result.days = {
                min: durations.days.min,
                max: durations.days.max,
            };
        }
    });

    // Only include duration types that are supported by the API
    // and have valid ranges from the conversion
    const finalResult: DurationRangesResponse = {} as DurationRangesResponse;

    // Add each duration type only if it has a valid range
    if (result.ticks) finalResult.ticks = result.ticks;
    if (result.seconds) finalResult.seconds = result.seconds;
    if (result.minutes) finalResult.minutes = result.minutes;
    if (result.hours) finalResult.hours = result.hours;
    if (result.days) finalResult.days = result.days;

    // Ensure at least one duration type is available
    if (Object.keys(finalResult).length === 0) {
        // Use ticks as fallback if no valid ranges
        finalResult.ticks = { min: 1, max: 10 };
    }

    return finalResult;
};

/**
 * Converts API default duration to internal format
 */
export const adaptDefaultDuration = (config: ProductConfigResponse): string => {
    const { duration, duration_unit } = config.data.defaults;

    // If the default duration is in seconds, convert to the most appropriate unit
    if (duration_unit === "seconds") {
        if (duration >= 3600) {
            // 1 hour in seconds
            const hours = Math.floor(duration / 3600);
            const minutes = Math.floor((duration % 3600) / 60);
            return `${hours}:${minutes.toString().padStart(2, "0")} hours`;
        }
        if (duration >= 60) {
            // 1 minute in seconds
            return `${Math.floor(duration / 60)} minutes`;
        }
        return `${duration} seconds`;
    }

    // For other units, use as is
    if (duration_unit === "hours") {
        // For hours, use the HH:MM format
        return `${duration}:00 hours`;
    }

    return `${duration} ${duration_unit}`;
};
