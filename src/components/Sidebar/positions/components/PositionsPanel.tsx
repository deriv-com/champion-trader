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
import { useToastStore } from "@/stores/toastStore";
import { TradeNotification } from "@/components/ui/trade-notification";
import { useOrientationStore } from "@/stores/orientationStore";
import { StandaloneFlagCheckeredFillIcon } from "@deriv/quill-icons";

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
    const [closingContracts, setClosingContracts] = useState<Record<string, boolean>>({});
    const { toast, hideToast } = useToastStore();
    const { isLandscape } = useOrientationStore();

    const handleFilterSelect = (filter: string) => {
        setSelectedFilter(filter);
        // Filter implementation would go here
    };

    const { sell_contract } = useTradeActions();

    // Handle closing a contract
    const handleCloseContract = async (contractId: string, position: any) => {
        try {
            console.log("Closing contract:", contractId);

            // Set loading state
            setClosingContracts((prev) => ({ ...prev, [contractId]: true }));

            // Call the API
            const response = await sell_contract(contractId);
            console.log("Sell contract response:", response);
            const isProfit = Number(response.data.profit) >= 0;

            // Show success toast with TradeNotification
            toast({
                content: (
                    <TradeNotification
                        stake={`${isProfit ? "Profit" : "Loss"}: ${response.data.profit} ${position.details.bid_price_currency}`}
                        market={position.details.instrument_name || position.details.instrument_id}
                        type={
                            position.details.variant.charAt(0).toUpperCase() +
                            position.details.variant.slice(1)
                        }
                        onClose={hideToast}
                        icon={
                            <div>
                                <StandaloneFlagCheckeredFillIcon
                                    fill={isProfit ? "#4DBC6B" : "#0088323D"}
                                    iconSize="sm"
                                    className={`rounded-full ${isProfit ? "#0088323D" : "#E6190E3D"}`}
                                />
                            </div>
                        }
                    />
                ),
                variant: "default",
                duration: 3000,
                position: isLandscape ? "bottom-left" : "top-center",
            });
        } catch (error: any) {
            // Extract error message from API response if available
            let errorMessage = "Failed to close contract";

            if (error.response?.data?.errors?.[0]?.message) {
                errorMessage = error.response.data.errors[0].message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            // Show error toast
            toast({
                content: errorMessage,
                variant: "error",
            });

            console.error("Error closing contract:", error);
        } finally {
            // Clear loading state
            setClosingContracts((prev) => ({ ...prev, [contractId]: false }));
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 flex-1 overflow-auto scrollbar-thin">
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
