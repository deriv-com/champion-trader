import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProcessedContracts } from "@/hooks/useProcessedContracts";
import { useFilteredPositions } from "../hooks/useFilteredPositions";
import { FilterDropdown } from "./FilterDropdown";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { ContractCard } from "@/components/ContractCard";

export const PositionsContent: FC = () => {
  const [isOpenTab, setIsOpenTab] = useState(true);
  const navigate = useNavigate();
  const { setSidebar } = useMainLayoutStore();
  const { 
    openContracts, 
    closedContracts, 
    loading, 
    error, 
    calculateTotalProfit 
  } = useProcessedContracts();

  const { filteredPositions, selectedFilter, handleFilterSelect } =
    useFilteredPositions({
      isOpenTab,
      allPositions: openContracts,
      closedPositions: closedContracts,
    });

  const handleContractSelect = (contractId: string) => {
    navigate(`/contract/${contractId}`);
    setSidebar(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 flex-1 overflow-auto">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            className={`flex-1 h-8 flex items-center justify-center rounded-lg transition-all ${
              isOpenTab
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:bg-gray-50"
            }`}
            onClick={() => setIsOpenTab(true)}
          >
            Open
          </button>
          <button
            className={`flex-1 h-8 flex items-center justify-center rounded-lg transition-all ${
              isOpenTab
                ? "text-gray-500 hover:bg-gray-50"
                : "bg-white text-black shadow-sm"
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
        {loading ? (
          <div className="mt-4 flex justify-center">
            <p>Loading positions...</p>
          </div>
        ) : error ? (
          <div className="mt-4 text-red-500 text-center">
            <p>Error loading positions</p>
          </div>
        ) : filteredPositions.length === 0 ? (
          <div className="mt-4 text-center">
            <p>No {isOpenTab ? 'open' : 'closed'} positions found</p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {filteredPositions.map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                onClick={handleContractSelect}
                variant="desktop"
                showCloseButton={isOpenTab}
                onClose={(id) => console.log("Close contract", id)}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-4 font-bold border-t flex justify-between mt-auto">
        <span className="text-black-300">Total profit/loss: </span>
        <span className={`${calculateTotalProfit(filteredPositions) >= 0 ? 'text-[#008832]' : 'text-red-500'}`}>
          {calculateTotalProfit(filteredPositions) >= 0 ? '+' : ''}{calculateTotalProfit(filteredPositions).toFixed(2)} USD
        </span>
      </div>
    </div>
  );
};

export default PositionsContent;
