import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ContractSummary } from "../ContractDetailsPage/components";
import { useContracts } from "@/hooks/useContracts";
import { useTradeStore } from "@/stores/tradeStore";
import { formatDate, formatGMTTime } from "@/utils/dateUtils";

const PositionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
  const [swipedCard, setSwipedCard] = useState<string | null>(null);
  const { contracts, loading, error } = useContracts();
  const {setContractDetails} = useTradeStore();

  // Helper function to format duration
  const formatDuration = (duration: number, units: string) => {
    if (units === 'ticks') {
      return `0/${duration} ticks`;
    } else if (units === 'seconds') {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:00`;
    }
    return `${duration} ${units}`;
  };

  // Map API contracts to UI format
  const mappedContracts = contracts.map(contract => ({
    id: contract.contract_id,
    type: contract.contract_details.variant.charAt(0).toUpperCase() + contract.contract_details.variant.slice(1),
    market: contract.contract_details.instrument_name || "",
    stake: `${contract.contract_details.stake}`,
    profit: contract.contract_details.profit_loss || "",
    duration: formatDuration(contract.contract_details.duration, contract.contract_details.duration_units),
    isOpen: !contract.contract_details.is_expired && !contract.contract_details.is_sold,
  }));

  // Handle contract selection
  const handleContractSelect = (contractId: string) => {
    const selectedContract = contracts.find(c => c.contract_id === contractId);
    if (selectedContract) {
      // Map API contract to ContractDetails format
      const contractDetails = {
        type: selectedContract.contract_details.variant.charAt(0).toUpperCase() + selectedContract.contract_details.variant.slice(1),
        market: selectedContract.contract_details.instrument_name,
        stake: selectedContract.contract_details.stake,
        profit: selectedContract.contract_details.profit_loss,
        duration: formatDuration(selectedContract.contract_details.duration, selectedContract.contract_details.duration_units),
        barrier: selectedContract.contract_details.barrier,
        payout: selectedContract.contract_details.potential_payout || selectedContract.contract_details.bid_price,
        referenceId: selectedContract.contract_details.reference_id || "547294814948", // Add reference ID
        startTime: formatDate(selectedContract.contract_details.start_time),
        startTimeGMT: formatGMTTime(selectedContract.contract_details.start_time),
        entrySpot: selectedContract.contract_details.entry_spot || "",
        entryTimeGMT: formatGMTTime(selectedContract.contract_details.start_time),
        exitTime: formatDate(selectedContract.contract_details.exit_time),
        exitTimeGMT: formatGMTTime(selectedContract.contract_details.exit_time),
        exitSpot: selectedContract.contract_details.exit_spot || ""
      };
      
      setContractDetails(contractDetails);
      navigate(`/contract/${contractId}`);
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
        ) : mappedContracts.filter((contract) =>
            activeTab === "open" ? contract.isOpen : !contract.isOpen
          ).length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <p>No {activeTab} contracts found</p>
          </div>
        ) : (
          mappedContracts
            .filter((contract) =>
              activeTab === "open" ? contract.isOpen : !contract.isOpen
            )
            .map((contract) => (
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
                  onClick={() => handleContractSelect(contract.id)}
                >
                  <div className="w-full">
                    <ContractSummary contract={contract} />
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
