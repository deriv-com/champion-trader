import { FC, useRef, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { TRADE_TYPES, TIME_PERIODS } from "../../positions/positionsSidebarStub";

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

    return (
        <div
            className="relative w-[50%]"
            ref={dropdownRef}
            onMouseDown={(event) => event.stopPropagation()}
        >
            <button
                className="text-sm h-9 w-full p-2 border border-theme rounded-full text-theme-muted flex items-center justify-between"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                <span>{selectedFilter}</span>
                <span
                    className={`transform transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                >
                    <ChevronDown className="text-theme" />
                </span>
            </button>
            {dropdownOpen && (
                <ul
                    className="absolute text-sm left-0 w-full bg-theme bg-opacity-100 border border-theme rounded-lg shadow-md mt-1 z-50"
                    onMouseDown={(event) => event.stopPropagation()}
                >
                    {isOpenTab ? (
                        <>
                            <li
                                className="p-2 hover:bg-theme-hover cursor-pointer"
                                onClick={() => handleSelect("Trade types")}
                            >
                                Trade types
                            </li>
                            {TRADE_TYPES.map((type) => (
                                <li
                                    key={type}
                                    className="p-2 hover:bg-theme-hover cursor-pointer"
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
                                className="p-2 hover:bg-theme-hover cursor-pointer"
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
