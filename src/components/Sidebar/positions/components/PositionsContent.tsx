import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OPEN_POSITIONS, CLOSED_POSITIONS, Position } from "../positionsSidebarStub";
import { useFilteredPositions } from "../hooks/useFilteredPositions";
import { FilterDropdown } from "./FilterDropdown";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { Timer } from "lucide-react";

export const PositionsContent: FC = () => {
    const [isOpenTab, setIsOpenTab] = useState(true);
    const navigate = useNavigate();
    const { setSidebar } = useMainLayoutStore();
    const [allPositions, setAllPositions] = useState<Position[]>(OPEN_POSITIONS);

    const { filteredPositions, selectedFilters, handleFiltersChange } = useFilteredPositions({
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

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col p-6 gap-2 overflow-auto">
                <div className="w-[280px] h-10 flex items-center justify-center px-1 bg-gray-100 rounded-lg">
                    <button
                        className={`flex-1 h-8 px-2 flex items-center justify-center rounded-lg transition-all ${
                            isOpenTab
                                ? "bg-white text-black shadow-sm"
                                : "text-gray-500 hover:bg-gray-50"
                        }`}
                        onClick={() => setIsOpenTab(true)}
                    >
                        Open
                    </button>
                    <button
                        className={`flex-1 h-8 px-2 flex items-center justify-center rounded-lg transition-all ${
                            isOpenTab
                                ? "text-gray-500 hover:bg-gray-50"
                                : "bg-white text-black shadow-sm"
                        }`}
                        onClick={() => setIsOpenTab(false)}
                    >
                        Closed
                    </button>
                </div>
                <FilterDropdown
                    isOpenTab={isOpenTab}
                    selectedFilters={selectedFilters}
                    onFiltersChange={handleFiltersChange}
                />
                <div className="flex flex-col">
                    {filteredPositions.map((position) => (
                        <div
                            key={position.id}
                            className="p-4 cursor-pointer"
                            onClick={() => {
                                navigate(`/contract/${position.id}`);
                                setSidebar(null);
                            }}
                        >
                            <div className="flex justify-between text-sm font-medium">
                                <div className="w-full flex flex-col items-start">
                                    <div className="w-full flex items-center justify-between">
                                        <img
                                            src="/market icon.svg"
                                            alt="Market Icon"
                                            className="w-5 h-8 mb-1"
                                        />
                                        {isOpenTab || true ? (
                                            <div className="text-gray-500 w-35 text-xs flex items-center justify-center gap-2 bg-gray-50 px-2 py-1 rounded-md border border-transparent hover:border-gray-300 font-light">
                                                <Timer size={16} strokeWidth={1.5} />
                                                <div className="leading-[18px]">
                                                    {position.ticks}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-medium mb-3">
                                                Closed
                                            </span>
                                        )}
                                    </div>
                                    <div className="w-full flex justify-between">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-light text-black-400">
                                                {position.type}
                                            </span>
                                            <span className="text-s font-light text-gray-500 mb-4">
                                                {position.market}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="flex flex-col gap-1 items-end">
                                                <span className="text-s font-light text-gray-400">
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
            <div className="p-4 font-bold border-t flex justify-between mt-auto">
                <span className="text-black-300">Total profit/loss: </span>
                <span className="text-[#008832]">+2.00 USD</span>
            </div>
        </div>
    );
};

export default PositionsContent;
