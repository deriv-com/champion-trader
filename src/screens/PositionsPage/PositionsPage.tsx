import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ContractSummary } from "../ContractDetailsPage/components";

const positions = [
    {
        contract_id: "1",
        product_id: "rise_fall",
        contract_details: {
            instrument_id: "R_100",
            instrument_name: "Volatility 100 (1s) Index",
            profit_loss: "+0.00 USD",
            reference_id: "1",
            contract_start_time: 1711222333000,
            contract_expiry_time: 1711223233000,
            entry_tick_time: 1711222332000,
            entry_spot: "122",
            duration: 10,
            duration_unit: "ticks",
            allow_equals: false,
            stake: "10.00",
            bid_price: "10.00",
            bid_price_currency: "USD",
            variant: "rise",
            barrier: "133.450",
            is_expired: false,
            is_valid_to_sell: true,
            is_sold: false,
            potential_payout: "20.00",
        },
        isOpen: true,
    },
    {
        contract_id: "2",
        product_id: "rise_fall",
        contract_details: {
            instrument_id: "R_100",
            instrument_name: "Volatility 100 (1s) Index",
            profit_loss: "+0.00 USD",
            reference_id: "2",
            contract_start_time: 1711222333000,
            contract_expiry_time: 1711223233000,
            entry_tick_time: 1711222332000,
            entry_spot: "122",
            duration: 5,
            duration_unit: "minutes",
            allow_equals: false,
            stake: "10.00",
            bid_price: "10.00",
            bid_price_currency: "USD",
            variant: "rise",
            barrier: "133.450",
            is_expired: false,
            is_valid_to_sell: false,
            is_sold: true,
            potential_payout: "20.00",
            exit_spot: "120",
            exit_tick_time: 1722222332000,
        },
        isOpen: false,
    },
    {
        contract_id: "3",
        product_id: "rise_fall",
        contract_details: {
            instrument_id: "R_100",
            instrument_name: "Volatility 100 (1s) Index",
            profit_loss: "+0.00 USD",
            reference_id: "3",
            contract_start_time: 1711222333000,
            contract_expiry_time: 1711223233000,
            entry_tick_time: 1711222332000,
            entry_spot: "122",
            duration: 5,
            duration_unit: "minutes",
            allow_equals: false,
            stake: "10.00",
            bid_price: "10.00",
            bid_price_currency: "USD",
            variant: "rise",
            barrier: "133.450",
            is_expired: false,
            is_valid_to_sell: false,
            is_sold: true,
            potential_payout: "20.00",
            exit_spot: "120",
            exit_tick_time: 1722222332000,
        },
        isOpen: false,
    },
];

const PositionsPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
    const [swipedCard, setSwipedCard] = useState<number | null>(null);

    const handleTouchStart = () => {
        setSwipedCard(null);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>, id: number) => {
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

            {/* Positions List */}
            <div className="flex-1 overflow-y-auto px-2 pb-4 pt-2 space-y-2 bg-theme-secondary">
                {positions
                    .filter((position) =>
                        activeTab === "open" ? position.isOpen : !position.isOpen
                    )
                    .map((position) => (
                        <div
                            key={position.contract_id}
                            className="relative flex transition-transform duration-300"
                            onTouchStart={handleTouchStart}
                            onTouchMove={(e) => handleTouchMove(e, parseInt(position.contract_id))}
                            onTouchEnd={handleTouchEnd}
                            onMouseEnter={() => setSwipedCard(parseInt(position.contract_id))}
                            onMouseLeave={() => setSwipedCard(null)}
                        >
                            <div
                                className={`relative flex transition-transform duration-300 w-full cursor-pointer ${
                                    swipedCard === parseInt(position.contract_id)
                                        ? "translate-x-[-4rem]"
                                        : "translate-x-0"
                                }`}
                                onClick={() => {
                                    navigate(`/contract/${position.contract_id}`);
                                }}
                            >
                                <div className="w-full">
                                    <ContractSummary
                                        contractDetails={{
                                            ...position.contract_details,
                                            contract_id: position.contract_id,
                                            product_id: position.product_id,
                                            buy_price: position.contract_details.stake,
                                            buy_time: position.contract_details.contract_start_time,
                                        }}
                                    />
                                </div>
                            </div>
                            <button
                                className={`absolute right-0 h-[104px] w-16 bg-red-600 text-xs text-white font-bold flex items-center justify-center transition-all duration-300 rounded-r-lg ${
                                    swipedCard === parseInt(position.contract_id)
                                        ? "flex"
                                        : "hidden"
                                }`}
                                onClick={() => console.log("Close action triggered")}
                            >
                                Close
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default PositionsPage;
