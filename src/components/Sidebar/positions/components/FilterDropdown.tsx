import { FC, useRef, useEffect, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { TRADE_TYPES, TIME_PERIODS } from "../../positions/positionsSidebarStub";

interface FilterDropdownProps {
    isOpenTab: boolean;
    selectedFilters: string[];
    onFiltersChange: (filters: string[]) => void;
}

export const FilterDropdown: FC<FilterDropdownProps> = ({
    isOpenTab,
    selectedFilters,
    onFiltersChange,
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleFilter = (filter: string) => {
        if (selectedFilters.includes(filter)) {
            onFiltersChange(selectedFilters.filter((f) => f !== filter));
        } else {
            onFiltersChange([...selectedFilters, filter]);
        }
    };

    // Display text for the button
    const getDisplayText = () => {
        if (selectedFilters.length === 0) {
            return isOpenTab ? "All trade types" : "All time";
        } else if (selectedFilters.length === 1) {
            return selectedFilters[0];
        } else {
            return `${selectedFilters.length} selected`;
        }
    };

    return (
        <div
            className="relative"
            ref={dropdownRef}
            onMouseDown={(event) => event.stopPropagation()}
        >
            <button
                className="w-fit text-sm h-9 px-4 border rounded-full text-gray-500 flex items-center justify-between gap-2"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                <span>{getDisplayText()}</span>
                <span
                    className={`transform transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                >
                    <ChevronDown className="text-black-400" />
                </span>
            </button>
            {dropdownOpen && (
                <ul
                    className="absolute text-sm left-0 w-full bg-white border rounded-lg shadow-md mt-1 py-1"
                    onMouseDown={(event) => event.stopPropagation()}
                >
                    {isOpenTab
                        ? TRADE_TYPES.map((type) => (
                              <li
                                  key={type}
                                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                  onClick={() => toggleFilter(type)}
                              >
                                  <div
                                      className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${selectedFilters.includes(type) ? "border-transparent bg-black" : "border-gray-300"}`}
                                  >
                                      {selectedFilters.includes(type) && (
                                          <Check size={12} className="text-white" />
                                      )}
                                  </div>
                                  {type}
                              </li>
                          ))
                        : TIME_PERIODS.map((period) => (
                              <li
                                  key={period}
                                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                  onClick={() => toggleFilter(period)}
                              >
                                  <div
                                      className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${selectedFilters.includes(period) ? "bg-black border-transparent" : "border-gray-300"}`}
                                  >
                                      {selectedFilters.includes(period) && (
                                          <Check size={12} className="text-white" />
                                      )}
                                  </div>
                                  {period}
                              </li>
                          ))}
                </ul>
            )}
        </div>
    );
};
