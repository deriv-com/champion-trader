import { useState, useEffect } from "react";
import { Position } from "../../positions/positionsSidebarStub";

interface UseFilteredPositionsProps {
    isOpenTab: boolean;
    allPositions: Position[];
    closedPositions: Position[];
}

interface UseFilteredPositionsReturn {
    filteredPositions: Position[];
    selectedFilter: string;
    handleFilterSelect: (filter: string) => void;
}

export const useFilteredPositions = ({
    isOpenTab,
    allPositions,
    closedPositions,
}: UseFilteredPositionsProps): UseFilteredPositionsReturn => {
    const [selectedFilter, setSelectedFilter] = useState<string>("All trade types");
    const [filteredPositions, setFilteredPositions] = useState<Position[]>(allPositions);

    useEffect(() => {
        if (!isOpenTab) {
            setSelectedFilter("All time");
            setFilteredPositions(closedPositions);
        } else {
            setSelectedFilter("Trade types");
            setFilteredPositions(allPositions);
        }
    }, [isOpenTab, allPositions, closedPositions]);

    const handleFilterSelect = (filter: string) => {
        setSelectedFilter(filter);

        // Filter positions based on selected filter
        const positions = !isOpenTab ? closedPositions : allPositions;
        if (filter === "Trade types" || filter === "All time") {
            setFilteredPositions(positions);
        } else if (!isOpenTab) {
            // Time-based filtering logic would go here
            // For now, just showing all positions
            setFilteredPositions(positions);
        } else {
            setFilteredPositions(positions.filter((position) => position.type === filter));
        }
    };

    return {
        filteredPositions,
        selectedFilter,
        handleFilterSelect,
    };
};
