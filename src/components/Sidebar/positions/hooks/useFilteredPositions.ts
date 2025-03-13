import { useState, useEffect } from "react";
import { Position } from "../../positions/positionsSidebarStub";

interface UseFilteredPositionsProps {
    isOpenTab: boolean;
    allPositions: Position[];
    closedPositions: Position[];
}

interface UseFilteredPositionsReturn {
    filteredPositions: Position[];
    selectedFilters: string[];
    handleFiltersChange: (filters: string[]) => void;
}

export const useFilteredPositions = ({
    isOpenTab,
    allPositions,
    closedPositions,
}: UseFilteredPositionsProps): UseFilteredPositionsReturn => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [filteredPositions, setFilteredPositions] = useState<Position[]>(allPositions);

    useEffect(() => {
        // Reset filters when tab changes
        setSelectedFilters([]);
        setFilteredPositions(isOpenTab ? allPositions : closedPositions);
    }, [isOpenTab, allPositions, closedPositions]);

    const handleFiltersChange = (filters: string[]) => {
        setSelectedFilters(filters);

        // Filter positions based on selected filters
        const positions = isOpenTab ? allPositions : closedPositions;

        if (filters.length === 0) {
            // No filters selected, show all positions
            setFilteredPositions(positions);
        } else if (isOpenTab) {
            // Filter by trade types
            setFilteredPositions(positions.filter((position) => filters.includes(position.type)));
        } else {
            // Time-based filtering logic would go here
            // For now, just showing all positions
            setFilteredPositions(positions);

            // Actual implementation would filter based on time periods
            // Example (pseudocode):
            // const now = new Date();
            // setFilteredPositions(positions.filter(position => {
            //   const positionDate = new Date(position.timestamp);
            //   return filters.some(filter => {
            //     if (filter === "Today") return isSameDay(positionDate, now);
            //     if (filter === "Yesterday") return isYesterday(positionDate);
            //     // etc.
            //   });
            // }));
        }
    };

    return {
        filteredPositions,
        selectedFilters,
        handleFiltersChange,
    };
};
