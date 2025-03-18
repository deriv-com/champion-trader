import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ContractSummary } from "../ContractDetailsPage/components";
import { usePositionsData } from "@/hooks/contract/usePositionsData";
import { useTradeActions } from "@/hooks/useTradeActions";
import {
    PositionLoadingState,
    PositionErrorState,
    PositionEmptyState,
    PositionMapper,
    PositionProfitLoss,
} from "@/components/PositionComponents";
import { useToastStore } from "@/stores/toastStore";
import { TradeNotification } from "@/components/ui/trade-notification";
import { useOrientationStore } from "@/stores/orientationStore";
import { StandaloneFlagCheckeredFillIcon } from "@deriv/quill-icons";

const PositionsPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
    const [swipedCard, setSwipedCard] = useState<string | null>(null);
    const [closingContracts, setClosingContracts] = useState<Record<string, boolean>>({});

    // Get positions data using the centralized hook
    const { openPositions, closedPositions, positionsLoading, positionsError, totalProfitLoss } =
        usePositionsData();

    // Get trade actions including sell_contract
    const tradeActions = useTradeActions();
    const { toast, hideToast } = useToastStore();
    const { isLandscape } = useOrientationStore();

    // Handle closing a contract
    const handleCloseContract = async (contractId: string) => {
        // Find the position object for this contract ID
        const position = openPositions.find((p) => p.contract_id === contractId);
        if (!position) return;

        try {
            console.log("Closing contract:", contractId);

            // Set loading state
            setClosingContracts((prev) => ({ ...prev, [contractId]: true }));

            const response = await tradeActions.sell_contract(contractId);
            console.log("Sell contract response:", response);
            const isProfit = Number(response.data.profit) >= 0;

            // Show success toast with TradeNotification
            toast({
                content: (
                    <TradeNotification
                        stake={`Profit: ${response.data.profit} ${position.details.bid_price_currency}`}
                        market={position.details.instrument_id}
                        type={
                            position.details.variant.charAt(0).toUpperCase() +
                            position.details.variant.slice(1)
                        }
                        onClose={hideToast}
                        icon={
                            <StandaloneFlagCheckeredFillIcon
                                fill={Number(response.data.profit) >= 0 ? "#007a22" : "#FF4D4D"}
                                iconSize="sm"
                                className={`rounded-full ${isProfit ? "#0088323D" : "#E6190E3D"}`}
                            />
                        }
                    />
                ),
                variant: "default",
                duration: 3000,
                position: isLandscape ? "bottom-left" : "top-center",
            });

            // Clear loading state
            setClosingContracts((prev) => ({ ...prev, [contractId]: false }));
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

            // Clear loading state on error
            setClosingContracts((prev) => ({ ...prev, [contractId]: false }));
            console.error("Error closing contract:", error);
        }
    };

    const handleTouchStart = () => {
        setSwipedCard(null);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>, id: string) => {
        const touch = e.touches[0];
        if (touch.clientX < 250) {
            setSwipedCard(id);
        }
    };

    const handleTouchEnd = () => {
        // Optionally reset swipe after some time
    };

    useEffect(() => {
        function handleClickOutside() {
            if (swipedCard !== null) {
                setSwipedCard(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [swipedCard]);

    // Get the current positions based on active tab
    const currentPositions = activeTab === "open" ? openPositions : closedPositions;

    return (
        <div className="flex flex-col h-full bg-theme-secondary overflow-auto pb-2">
            {/* Tabs section */}
            <div className="flex px-4 bg-theme border-b border-theme sticky top-0 z-10">
                <button
                    className={`flex-1 py-3 border-b-2 transition-colors ${
                        activeTab === "open"
                            ? "border-theme-text text-theme"
                            : "border-transparent text-theme-muted"
                    }`}
                    onClick={() => setActiveTab("open")}
                >
                    Open
                </button>
                <button
                    className={`flex-1 py-3 border-b-2 transition-colors ${
                        activeTab === "closed"
                            ? "border-theme-text text-theme"
                            : "border-transparent text-theme-muted"
                    }`}
                    onClick={() => setActiveTab("closed")}
                >
                    Closed
                </button>
            </div>

            {/* Total Profit/Loss - Only show when in open tab AND there are open positions */}
            {activeTab === "open" && openPositions.length > 0 && (
                <PositionProfitLoss
                    totalProfitLoss={totalProfitLoss}
                    containerClassName="px-4 py-3"
                    labelClassName="text-theme text-sm font-semibold"
                    valueClassName="text-sm font-semibold"
                />
            )}

            {/* Scrollable content area - Only this part should scroll */}
            <div className="flex-1 overflow-y-auto">
                {/* Loading State */}
                {positionsLoading && (
                    <PositionLoadingState className="flex-1 flex items-center justify-center" />
                )}

                {/* Error State */}
                {positionsError && (
                    <PositionErrorState
                        error={positionsError}
                        className="flex-1 flex items-center justify-center"
                    />
                )}

                {/* Empty State */}
                {!positionsLoading && !positionsError && currentPositions.length === 0 && (
                    <PositionEmptyState
                        positionType={activeTab}
                        className="flex-1 flex flex-col items-center h-full justify-center"
                    />
                )}

                {/* Positions List */}
                {!positionsLoading && !positionsError && currentPositions.length > 0 && (
                    <PositionMapper
                        positions={currentPositions}
                        positionType={activeTab}
                        className="flex-1 overflow-y-auto px-2 pt-2 space-y-2"
                        renderPosition={(position) => (
                            <div
                                key={position.contract_id}
                                className="relative flex transition-transform duration-300"
                                onTouchStart={handleTouchStart}
                                onTouchMove={(e) => handleTouchMove(e, position.contract_id)}
                                onTouchEnd={handleTouchEnd}
                                onMouseEnter={() => setSwipedCard(position.contract_id)}
                                onMouseLeave={() => setSwipedCard(null)}
                            >
                                <div
                                    className={`relative flex transition-transform duration-300 w-full cursor-pointer ${
                                        swipedCard === position.contract_id
                                            ? "translate-x-[-4rem]"
                                            : "translate-x-0"
                                    }`}
                                    onClick={() => {
                                        navigate(`/contract/${position.contract_id}`);
                                    }}
                                >
                                    <div className="w-full">
                                        <ContractSummary contract={position} />
                                    </div>
                                </div>
                                {activeTab === "open" && position.details.is_valid_to_sell && (
                                    <button
                                        className={`absolute right-0 h-[104px] w-16 bg-red-600 text-xs text-white font-bold flex items-center justify-center transition-all duration-300 rounded-r-lg ${
                                            swipedCard === position.contract_id ? "flex" : "hidden"
                                        } ${closingContracts[position.contract_id] ? "opacity-75" : ""}`}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent navigation
                                            handleCloseContract(position.contract_id);
                                        }}
                                        disabled={closingContracts[position.contract_id]}
                                    >
                                        {closingContracts[position.contract_id]
                                            ? "Closing..."
                                            : "Close"}
                                    </button>
                                )}
                            </div>
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default PositionsPage;
