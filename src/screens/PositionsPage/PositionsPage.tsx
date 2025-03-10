import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProcessedContracts } from "@/hooks/useProcessedContracts";
import { ContractCard } from "@/components/ContractCard";

const PositionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
  const [swipedCard, setSwipedCard] = useState<number | null>(null);
  const { openContracts, closedContracts, loading, error } = useProcessedContracts();
  
  // Get the contracts based on the active tab
  const displayedContracts = activeTab === "open" ? openContracts : closedContracts;

  // Handle contract selection
  const handleContractSelect = (contractId: string) => {
    navigate(`/contract/${contractId}`);
  };

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
    <div className="flex flex-col flex-1 h-full bg-white">
      {/* Tabs */}
      <div className="flex sticky top-0 z-10 px-4 bg-white border-b border-border">
        <button
          className={`flex-1 py-3 border-b-2 transition-colors ${
            activeTab === "open"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground"
          }`}
          onClick={() => setActiveTab("open")}
        >
          Open
        </button>
        <button
          className={`flex-1 py-3 border-b-2 transition-colors ${
            activeTab === "closed"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground"
          }`}
          onClick={() => setActiveTab("closed")}
        >
          Closed
        </button>
      </div>

      {/* Positions List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 pt-2 space-y-2 bg-gray-100">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <p>Loading contracts...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-red-500">{error}</p>
          </div>
        ) : displayedContracts.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <p>No {activeTab} contracts found</p>
          </div>
        ) : (
          displayedContracts.map((contract) => (
              <div
                key={contract.id}
                className="relative flex transition-transform duration-300"
                onTouchStart={handleTouchStart}
                onTouchMove={(e) => handleTouchMove(e, contract.id)}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() => setSwipedCard(contract.id)}
                onMouseLeave={() => setSwipedCard(null)}
              >
                <div
                  className={`relative flex transition-transform duration-300 w-full cursor-pointer ${
                    swipedCard === contract.id
                      ? "translate-x-[-4rem]"
                      : "translate-x-0"
                  }`}
                  onClick={() => handleContractSelect(contract.originalId)}
                >
                  <div className="w-full">
                    <ContractCard 
                      contract={contract} 
                      onClick={handleContractSelect}
                      variant="mobile"
                    />
                  </div>
                </div>
                <button
                  className={`absolute right-0 h-[104px] w-16 bg-red-600 text-xs text-white font-bold flex items-center justify-center transition-all duration-300 rounded-r-lg ${
                    swipedCard === contract.id ? "flex" : "hidden"
                  }`}
                  onClick={() => console.log("Close action triggered")}
                >
                  Close
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default PositionsPage;
