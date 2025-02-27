import { FC, useRef, useEffect, useState } from 'react';
import { useThemeStore } from "@/stores/themeStore";
import { ChevronDown } from "lucide-react";
import { TRADE_TYPES, TIME_PERIODS } from '../../positions/positionsSidebarStub';

interface FilterDropdownProps {
  isOpenTab: boolean;
  selectedFilter: string;
  onFilterSelect: (filter: string) => void;
}

export const FilterDropdown: FC<FilterDropdownProps> = ({
  isOpenTab,
  selectedFilter,
  onFilterSelect,
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

  const handleSelect = (filter: string) => {
    onFilterSelect(filter);
    setDropdownOpen(false);
  };

  const { isDarkMode } = useThemeStore();

  return (
    <div className="relative w-[50%]" ref={dropdownRef} onMouseDown={(event) => event.stopPropagation()}>
      <button 
        className={`text-sm h-9 w-full p-2 border rounded-full flex items-center justify-between ${isDarkMode ? "bg-gray-800 text-white border-gray-600" : "text-gray-500 bg-white border-gray-300"}`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span>{selectedFilter}</span>
        <span className={`transform transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="text-black-400" />
        </span>
      </button>
      {dropdownOpen && (
        <ul className={`absolute text-sm left-0 w-full border rounded-lg shadow-md mt-1 ${isDarkMode ? "bg-black text-gray-300 border-gray-700" : "bg-white text-black border-gray-300"}`} onMouseDown={(event) => event.stopPropagation()}>
          {isOpenTab ? (
            <>
              <li 
                className={`p-2 cursor-pointer ${isDarkMode ? "hover:bg-gray-800 hover:text-white" : "hover:bg-gray-100"}`}
                onClick={() => handleSelect("Trade types")}
              >
                Trade types
              </li>
              {TRADE_TYPES.map((type) => (
                <li 
                  key={type} 
                  className={`p-2 cursor-pointer ${isDarkMode ? "hover:bg-gray-800 hover:text-white" : "hover:bg-gray-100"}`}
                  onClick={() => handleSelect(type)}
                >
                  {type}
                </li>
              ))}
            </>
          ) : (
            TIME_PERIODS.map((period) => (
              <li 
                key={period} 
                className={`p-2 cursor-pointer ${isDarkMode ? "hover:bg-gray-700 hover:text-black" : "hover:bg-gray-100"}`}
                onClick={() => handleSelect(period)}
              >
                {period}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
