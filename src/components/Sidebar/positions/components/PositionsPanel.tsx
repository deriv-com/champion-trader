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
import { useTradeActions } from "@/hooks";

export const PositionsPanel: FC = () => {
    const [isOpenTab, setIsOpenTab] = useState(true);
    const navigate = useNavigate();
    const { setSidebar } = useMainLayoutStore();

    // Get positions data using the centralized hook
    const { openPositions, closedPositions, positionsLoading, positionsError, totalProfitLoss } =
        usePositionsData();

    // Get current positions based on active tab
    const currentPositions = isOpenTab ? openPositions : closedPositions;

    // Filter logic with separate states for open and closed positions
    const [openPositionsFilter, setOpenPositionsFilter] = useState<string>("Trade types");
    const [closedPositionsFilter, setClosedPositionsFilter] = useState<string>("All time");
    const [closingContracts, setClosingContracts] = useState<Record<string, boolean>>({});

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

    const { sell_contract } = useTradeActions();

    // Handle closing a contract
    const handleCloseContract = async (contractId: string, position: any) => {
        try {
            // Use the enhanced sell_contract function
            await sell_contract(contractId, position.details, {
                setLoading: (isLoading) => {
                    setClosingContracts((prev) => ({ ...prev, [contractId]: isLoading }));
                },
                onError: (error: unknown) => console.error("Error closing contract:", error),
            });
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col gap-2 flex-1 overflow-auto scrollbar-thin">
                <div className="flex gap-2 p-1 mx-4 bg-theme-secondary rounded-lg">
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
                <div className="mx-4">
                    <FilterDropdown
                        isOpenTab={isOpenTab}
                        selectedFilter={selectedFilter}
                        onFilterSelect={handleFilterSelect}
                    />
                </div>

                {/* Loading State */}
                {positionsLoading && (
                    <PositionLoadingState className="flex items-center justify-center mx-4" />
                )}

                {/* Error State */}
                {positionsError && (
                    <PositionErrorState
                        error={positionsError}
                        className="flex items-center justify-center mx-4"
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
                        className="mx-2"
                        renderPosition={(position) => (
                            <div
                                key={position.contract_id}
                                className="rounded-lg cursor-pointer"
                                onClick={() => {
                                    navigate(`/contract/${position.contract_id}`);
                                    setSidebar(null);
                                }}
                            >
                                <ContractSummary
                                    contract={position}
                                    containerClassName="bg-transparent shadow-none p-0"
                                    showCloseButton={isOpenTab && position.details.is_valid_to_sell}
                                    isClosing={closingContracts[position.contract_id]}
                                    onClose={(id) => {
                                        // Prevent navigation when clicking the close button
                                        handleCloseContract(id, position);
                                    }}
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
