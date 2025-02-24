import { FC, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { OPEN_POSITIONS, CLOSED_POSITIONS, Position } from "./positionsSidebarStub";
import { useFilteredPositions } from "./hooks/useFilteredPositions";
import { FilterDropdown } from "./components/FilterDropdown";

interface PositionsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PositionsSidebar: FC<PositionsSidebarProps> = ({ isOpen, onClose }) => {
  const [isOpenTab, setIsOpenTab] = useState(true);
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [allPositions, setAllPositions] = useState<Position[]>(OPEN_POSITIONS);

  const { filteredPositions, selectedFilter, handleFilterSelect } = useFilteredPositions({
    isOpenTab,
    allPositions,
    closedPositions: CLOSED_POSITIONS,
  });

  useEffect(() => {
    fetch("/api/positions")
      .then(response => response.json())
      .then(data => {
        setAllPositions(data);
      })
      .catch(error => console.error("Error fetching positions:", error));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className={`absolute top-0 left-0 h-full w-[20%] bg-white shadow-lg transform transition-all duration-500 ease-in-out ${isOpen ? "translate-x-0 left-[65px] opacity-100" : "-translate-x-full opacity-0"} z-[50]`}
      ref={sidebarRef}
    > 
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">Positions</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
      </div>
      <div className="p-6 ">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            className={`flex-1 py-2 text-center font-small rounded-lg transition-all ${
              isOpenTab 
                ? "bg-white text-black shadow-sm" 
                : "text-gray-500 hover:bg-gray-50"
            }`}
            onClick={() => setIsOpenTab(true)}
          >
            Open
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium rounded-lg transition-all ${
              !isOpenTab 
                ? "bg-white text-black shadow-sm" 
                : "text-gray-500 hover:bg-gray-50"
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
        <div className="mt-4 space-y-4">
          {filteredPositions.map((position) => (
            <div 
              key={position.id}
              className="p-3 rounded-lg shadow-sm cursor-pointer"
              onClick={() => {
                navigate(`/contract/${position.id}`);
                onClose();
              }}
            >
              <div className="flex justify-between text-sm font-medium">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <img src="/market icon.svg" alt="Market Icon" className="w-5 h-8 mb-1" />
                  </div>
                  <span className="mb-[5] font-light text-black-400">{position.type}</span>
                  <span className="text-s font-light text-gray-500 mb-4">{position.market}</span>
                </div>
                <div>
                  <div className="flex flex-col items-end">
                    {isOpenTab ? (
                      <span className="text-gray-500 w-35 text-xs flex items-center bg-gray-50 px-2 py-1 rounded-md border border-transparent hover:border-gray-300 mb-3">
                        <span className="mr-2">⏳</span> {position.ticks}
                      </span>
                    ) : (
                      <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-medium mb-3">
                        Closed
                      </span>
                    )}
                    <span className="text-s font-light text-gray-400 mb-[2]">{position.stake}</span>
                    <span className={`text-sm ${position.profit.startsWith('+') ? 'text-[#008832]' : 'text-red-500'}`}>
                      {position.profit}
                    </span>
                  </div>
                </div>
              </div>
              {isOpenTab && (
                <button className="w-full h-6 flex items-center justify-center py-2 border border-black text-xs font-bold rounded-[8]">
                  Close {position.stake}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 p-4 font-bold border-t flex justify-between">
        <span className="text-black-300">Total profit/loss: </span>
        <span className="text-red-500">-1.50 USD</span>
      </div>
    </div>
  );
};

export default PositionsSidebar;
