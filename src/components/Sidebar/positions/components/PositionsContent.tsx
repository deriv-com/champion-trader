import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilterDropdown } from "./FilterDropdown";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { ContractSummary } from "@/screens/ContractDetailsPage/components";
import { usePositionsData } from "@/hooks/contract/usePositionsData";
import { Briefcase } from "lucide-react";

export const PositionsContent: FC = () => {
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
                    <div className="flex items-center justify-center mt-8">
                        <p className="text-theme">Loading positions...</p>
                    </div>
                )}

                {/* Error State */}
                {positionsError && (
                    <div className="flex items-center justify-center mt-8">
                        <p className="text-red-500">
                            Error loading positions: {positionsError.message}
                        </p>
                    </div>
                )}

                {/* Empty State */}
                {!positionsLoading && !positionsError && currentPositions.length === 0 && (
                    <div className="flex items-center justify-center min-h-[35rem]">
                        <div className="text-center">
                            <div className="text-gray-400 mb-4 flex justify-center">
                                <Briefcase size={64} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-semibold text-theme-muted mb-2">
                                No {isOpenTab ? "open" : "closed"} positions
                            </h3>
                            <p className="text-theme-muted text-sm">
                                Your {isOpenTab ? "open" : "closed"} positions will appear here.
                            </p>
                        </div>
                    </div>
                )}

                {/* Positions List */}
                {!positionsLoading && !positionsError && currentPositions.length > 0 && (
                    <div className="mt-4 space-y-4">
                        {currentPositions.map((position) => (
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
                        ))}
                    </div>
                )}
            </div>

            {/* Total Profit/Loss - Only show when in open tab AND there are open positions */}
            {isOpenTab && openPositions.length > 0 && (
                <div className="p-4 font-bold border-t border-theme flex justify-between mt-auto">
                    <span className="text-theme">Total profit/loss: </span>
                    <span
                        className={`${parseFloat(totalProfitLoss) >= 0 ? "text-[#008832]" : "text-red-500"}`}
                    >
                        {parseFloat(totalProfitLoss) >= 0 ? "+" : ""}
                        {totalProfitLoss} USD
                    </span>
                </div>
            )}
        </div>
    );
};

export default PositionsContent;
