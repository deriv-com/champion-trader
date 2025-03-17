import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilterDropdown } from "./FilterDropdown";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { ContractSummary } from "@/screens/ContractDetailsPage/components";
import { usePositionsData } from "@/hooks/contract/usePositionsData";
import {
    PositionLoadingState,
    PositionErrorState,
    PositionEmptyState,
    PositionMapper,
    PositionProfitLoss,
} from "@/components/PositionComponents";

export const PositionsPanel: FC = () => {
    const [isOpenTab, setIsOpenTab] = useState(true);
    const navigate = useNavigate();
    const { setSidebar } = useMainLayoutStore();

    // Get positions data using the centralized hook
    const { openPositions, closedPositions, positionsLoading, positionsError, totalProfitLoss } =
        usePositionsData();

    // Get current positions based on active tab
    const currentPositions = isOpenTab ? openPositions : closedPositions;

    // Filter logic (simplified for now)
    const [selectedFilter, setSelectedFilter] = useState<string>("All trade types");

    const handleFilterSelect = (filter: string) => {
        setSelectedFilter(filter);
        // Filter implementation would go here
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 flex-1 overflow-auto">
                <div className="flex gap-2 p-1 bg-theme-secondary rounded-lg">
                    <button
                        className={`flex-1 h-8 flex items-center justify-center rounded-lg transition-all ${
                            isOpenTab
                                ? "bg-theme text-theme shadow-sm"
                                : "text-theme-muted hover:bg-theme-hover"
                        }`}
                        onClick={() => setIsOpenTab(true)}
                    >
                        Open
                    </button>
                    <button
                        className={`flex-1 h-8 flex items-center justify-center rounded-lg transition-all ${
                            isOpenTab
                                ? "text-theme-muted hover:bg-theme-hover"
                                : "bg-theme text-theme shadow-sm"
                        }`}
                        onClick={() => setIsOpenTab(false)}
                    >
                        Closed
                    </button>
                </div>
                <div className="mt-4">
                    <FilterDropdown
                        isOpenTab={isOpenTab}
                        selectedFilter={selectedFilter}
                        onFilterSelect={handleFilterSelect}
                    />
                </div>

                {/* Loading State */}
                {positionsLoading && (
                    <PositionLoadingState className="flex items-center justify-center mt-8" />
                )}

                {/* Error State */}
                {positionsError && (
                    <PositionErrorState
                        error={positionsError}
                        className="flex items-center justify-center mt-8"
                    />
                )}

                {/* Empty State */}
                {!positionsLoading && !positionsError && currentPositions.length === 0 && (
                    <PositionEmptyState
                        positionType={isOpenTab ? "open" : "closed"}
                        className="flex items-center justify-center min-h-[35rem]"
                    />
                )}

                {/* Positions List */}
                {!positionsLoading && !positionsError && currentPositions.length > 0 && (
                    <PositionMapper
                        positions={currentPositions}
                        positionType={isOpenTab ? "open" : "closed"}
                        className="mt-4 space-y-4"
                        renderPosition={(position) => (
                            <div
                                key={position.contract_id}
                                className="p-3 rounded-lg shadow-sm cursor-pointer"
                                onClick={() => {
                                    navigate(`/contract/${position.contract_id}`);
                                    setSidebar(null);
                                }}
                            >
                                <ContractSummary
                                    contract={position}
                                    variant="desktop"
                                    showCloseButton={isOpenTab && position.details.is_valid_to_sell}
                                    onClose={(id) => console.log("Close action triggered for", id)}
                                />
                            </div>
                        )}
                    />
                )}
            </div>

            {/* Total Profit/Loss - Only show when in open tab AND there are open positions */}
            {isOpenTab && openPositions.length > 0 && (
                <PositionProfitLoss
                    totalProfitLoss={totalProfitLoss}
                    containerClassName="p-4 border-t border-theme mt-auto"
                    labelClassName="text-theme font-bold"
                    valueClassName="font-bold"
                />
            )}
        </div>
    );
};

export default PositionsPanel;
