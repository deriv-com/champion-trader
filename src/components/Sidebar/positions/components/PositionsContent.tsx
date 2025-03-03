import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  OPEN_POSITIONS,
  CLOSED_POSITIONS,
  Position,
} from "../positionsSidebarStub";
import { useFilteredPositions } from "../hooks/useFilteredPositions";
import { FilterDropdown } from "./FilterDropdown";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { useThemeStore } from "@/stores/themeStore";

export const PositionsContent: FC = () => {
  const [isOpenTab, setIsOpenTab] = useState(true);
  const navigate = useNavigate();
  const { setSidebar } = useMainLayoutStore();
  const [allPositions, setAllPositions] = useState<Position[]>(OPEN_POSITIONS);

  const { filteredPositions, selectedFilter, handleFilterSelect } =
    useFilteredPositions({
      isOpenTab,
      allPositions,
      closedPositions: CLOSED_POSITIONS,
    });

  useEffect(() => {
    fetch("/api/positions")
      .then((response) => response.json())
      .then((data) => {
        setAllPositions(data);
      })
      .catch((error) => console.error("Error fetching positions:", error));
  }, []);

  const { isDarkMode } = useThemeStore();

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 flex-1 overflow-auto">
        <div className={`flex gap-2 p-1 rounded-lg ${isDarkMode ? 'bg-[#020817]' : 'bg-gray-100'}`}>
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
        <div className="mt-4 space-y-4">
          {filteredPositions.map((position) => (
            <div
              key={position.id}
              className="p-3 rounded-lg shadow-sm cursor-pointer"
              onClick={() => {
                navigate(`/contract/${position.id}`);
                setSidebar(null);
              }}
            >
              <div className="flex justify-between text-sm font-medium">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <img
                      src="/market icon.svg"
                      alt="Market Icon"
                      className="w-5 h-8 mb-1"
                    />
                  </div>
                  <span className="mb-[5] font-light text-black-400">
                    {position.type}
                  </span>
                  <span className="text-s font-light text-gray-500 mb-4">
                    {position.market}
                  </span>
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
                    <span className="text-s font-light text-gray-400 mb-[2]">
                      {position.stake}
                    </span>
                    <span
                      className={`text-sm ${
                        position.profit.startsWith("+")
                          ? "text-[#008832]"
                          : "text-red-500"
                      }`}
                    >
                      {position.profit}
                    </span>
                  </div>
                </div>
              </div>
              {isOpenTab && (
                <button className="w-full h-6 flex items-center justify-center py-2 border border-black text-xs font-bold rounded-[8] no-hover">
                  Close {position.stake}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 font-bold border-t flex justify-between mt-auto">
        <span className="text-black-300">Total profit/loss: </span>
        <span className="text-[#008832]">+2.00 USD</span>
      </div>
    </div>
  );
};

export default PositionsContent;
