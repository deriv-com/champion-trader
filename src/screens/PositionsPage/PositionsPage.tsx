import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "@/stores/themeStore";
import { ContractSummary } from "../ContractDetailsPage/components";

const positions = [
  {
    id: 1,
    type: "Rise",
    market: "Volatility 100 (1s) Index",
    stake: "10.00 USD",
    profit: "+0.00 USD",
    duration: "0/10 ticks",
    isOpen: true,
  },
  {
    id: 2,
    type: "Rise",
    market: "Volatility 100 (1s) Index",
    stake: "10.00 USD",
    profit: "+0.00 USD",
    duration: "00:05:00",
    isOpen: false,
  },
  {
    id: 3,
    type: "Rise",
    market: "Volatility 100 (1s) Index",
    stake: "10.00 USD",
    profit: "+0.00 USD",
    duration: "00:05:00",
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

  const { isDarkMode } = useThemeStore();

  return (
    <div className={`flex flex-col flex-1 h-full ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      {/* Tabs */}
      <div className="flex sticky top-0 z-10 px-4 bg-background border-b border-border">
        <button
          className={`flex-1 py-3 border-b-2 transition-colors ${
            activeTab === "open"
              ? "border-primary text-primary"
              : "border-transparent text-gray-800"
          }`}
          onClick={() => setActiveTab("open")}
        >
          Open
        </button>
        <button
          className={`flex-1 py-3 border-b-2 transition-colors ${
            activeTab === "closed"
              ? "border-primary text-primary"
              : "border-transparent text-gray-800"
          }`}
          onClick={() => setActiveTab("closed")}
        >
          Closed
        </button>
      </div>

      {/* Positions List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 pt-2 space-y-2 bg-background">
        {positions
          .filter((position) =>
            activeTab === "open" ? position.isOpen : !position.isOpen
          )
          .map((position) => (
            <div
              key={position.id}
              className="relative flex transition-transform duration-300"
              onTouchStart={handleTouchStart}
              onTouchMove={(e) => handleTouchMove(e, position.id)}
              onTouchEnd={handleTouchEnd}
              onMouseEnter={() => setSwipedCard(position.id)}
              onMouseLeave={() => setSwipedCard(null)}
            >
              <div
                className={`relative flex transition-transform duration-300 w-full cursor-pointer ${
                  swipedCard === position.id
                    ? "translate-x-[-4rem]"
                    : "translate-x-0"
                }`}
                onClick={() => {
                  navigate(`/contract/${position.id}`);
                }}
              >
                <div className="w-full">
                  <ContractSummary />
                </div>
              </div>
              <button
                className={`absolute right-0 h-[104px] w-16 bg-red-600 text-xs text-white font-bold flex items-center justify-center transition-all duration-300 rounded-r-lg ${
                  swipedCard === position.id ? "flex" : "hidden"
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
