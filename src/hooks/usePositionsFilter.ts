import { useState } from "react";

/**
 * Custom hook to manage position filter state and logic
 * @param isOpenTab Boolean indicating if the open positions tab is active
 * @returns Object containing the selected filter and handler function
 */
export function usePositionsFilter(isOpenTab: boolean) {
    const [openPositionsFilter, setOpenPositionsFilter] = useState<string>("Trade types");
    const [closedPositionsFilter, setClosedPositionsFilter] = useState<string>("All time");

    // Get the current filter based on active tab
    const selectedFilter = isOpenTab ? openPositionsFilter : closedPositionsFilter;

    const handleFilterSelect = (filter: string) => {
        if (isOpenTab) {
            setOpenPositionsFilter(filter);
        } else {
            setClosedPositionsFilter(filter);
        }
        // Filter implementation would go here
    };

    return {
        selectedFilter,
        handleFilterSelect,
    };
}
