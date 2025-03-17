import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ContractSummary } from "../ContractDetailsPage/components";
import { usePositionsData } from "@/hooks/contract/usePositionsData";
import { Briefcase } from "lucide-react";

const PositionsPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
    const [swipedCard, setSwipedCard] = useState<string | null>(null);

    // Get positions data using the centralized hook
    const { openPositions, closedPositions, positionsLoading, positionsError, totalProfitLoss } =
        usePositionsData();

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
        <div className="flex flex-col flex-1 h-full bg-theme">
            {/* Tabs */}
            <div className="flex sticky top-0 z-10 px-4 bg-theme border-b border-theme">
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
                <div className="px-4 py-3 bg-theme-secondary">
                    <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-theme">Total profit/loss:</span>
                        <span
                            className={`font-semibold ${
                                parseFloat(totalProfitLoss) >= 0 ? "text-[#008832]" : "text-red-500"
                            }`}
                        >
                            {parseFloat(totalProfitLoss) >= 0 ? "+" : ""}
                            {totalProfitLoss} USD
                        </span>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {positionsLoading && (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-theme">Loading positions...</p>
                </div>
            )}

            {/* Error State */}
            {positionsError && (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-red-500">
                        Error loading positions: {positionsError.message}
                    </p>
                </div>
            )}

            {/* Empty State */}
            {!positionsLoading && !positionsError && currentPositions.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center bg-theme-secondary">
                    <div className="text-gray-400 mb-4">
                        <Briefcase size={64} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-semibold text-theme-muted mb-2">
                        No {activeTab} positions
                    </h3>
                    <p className="text-theme-muted text-sm">
                        Your {activeTab} positions will appear here.
                    </p>
                </div>
            )}

            {/* Positions List */}
            {!positionsLoading && !positionsError && currentPositions.length > 0 && (
                <div className="flex-1 overflow-y-auto px-2 pb-4 pt-2 space-y-2 bg-theme-secondary">
                    {currentPositions.map((position) => (
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
                                    }`}
                                    onClick={() =>
                                        console.log(
                                            "Close action triggered for",
                                            position.contract_id
                                        )
                                    }
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PositionsPage;
