/**
 * Utility functions for chart operations
 */

/**
 * Ensures data points are in ascending order by timestamp
 * @param data Array of data points with timestamp property
 * @returns Sorted array with no duplicate timestamps
 */
export const sortAndDeduplicate = <T extends { timestamp: number }>(data: T[]): T[] => {
    // Create a map to store unique entries by timestamp
    const uniqueMap = new Map<number, T>();

    // Add each data point to the map, overwriting any duplicates
    data.forEach((point) => {
        uniqueMap.set(point.timestamp, point);
    });

    // Convert map back to array and sort by timestamp
    return Array.from(uniqueMap.values()).sort((a, b) => a.timestamp - b.timestamp);
};

/**
 * Formats a price value for display
 * @param price The price value to format
 * @param decimals Number of decimal places to show
 * @returns Formatted price string
 */
export const formatPrice = (price: number, decimals: number = 2): string => {
    return price.toFixed(decimals);
};

/**
 * Calculates the percentage change between two price values
 * @param oldPrice Previous price
 * @param newPrice Current price
 * @returns Percentage change as a string with % symbol
 */
export const calculatePercentageChange = (oldPrice: number, newPrice: number): string => {
    if (oldPrice === 0) return "0%";

    const change = ((newPrice - oldPrice) / oldPrice) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
};

/**
 * Determines if the chart should auto-scroll based on user interaction
 * @param lastUserInteraction Timestamp of last user interaction with chart
 * @param autoScrollThreshold Time in ms after which auto-scroll resumes
 * @returns Boolean indicating if auto-scroll should be active
 */
export const shouldAutoScroll = (
    lastUserInteraction: number,
    autoScrollThreshold: number = 5000
): boolean => {
    return Date.now() - lastUserInteraction > autoScrollThreshold;
};
