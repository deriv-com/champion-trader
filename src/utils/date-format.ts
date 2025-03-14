/**
 * Format a timestamp to a localized time string
 * @param timestamp - Timestamp in milliseconds
 * @returns Formatted time string
 */
export const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
};

/**
 * Format a timestamp to a GMT string
 * @param timestamp - Timestamp in milliseconds
 * @returns Formatted GMT string
 */
export const formatGMT = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `GMT: ${date.toISOString()}`;
};
