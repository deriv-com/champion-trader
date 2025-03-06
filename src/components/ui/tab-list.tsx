import React from "react";

import { useThemeStore } from "@/stores/themeStore";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";

export interface Tab {
  label: string;
  value: string;
}

interface BaseTabListProps {
  tabs: Tab[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

interface TabListProps extends BaseTabListProps {
  variant: "chip" | "vertical";
}

const ChipTabList: React.FC<BaseTabListProps> = ({
  tabs,
  selectedValue,
  onSelect,
}) => {
  const { isDarkMode } = useThemeStore();
  const { isMobile } = useDeviceDetection();

  return (
    <div
      className="overflow-x-auto [&::-webkit-scrollbar]:hidden"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div className="flex gap-4 min-w-min">
        {tabs.map(({ label, value }) => (
          <div key={value} className="shrink-0">
            <button
              onClick={() => onSelect(value)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-colors
${selectedValue === value
  ? (isDarkMode ? (isMobile ? "bg-gray-700 text-white" : "bg-blue-600 text-white") : "bg-gray-300 text-black")
  : (isDarkMode ? "text-white" : "bg-sidebar text-white bg-gray-400 text-black rounded-3xl")
}
              `}
            >
              {label}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const VerticalTabList: React.FC<BaseTabListProps> = ({
  tabs,
  selectedValue,
  onSelect,
}) => {
  const { isDarkMode } = useThemeStore();
  return (
    <div className={`w-28 ${isDarkMode ? "bg-sidebar" : "bg-white"}`}>
      {tabs.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={`
            relative w-full text-left py-3 px-6 transition-colors font-ibm-plex text-base leading-6 font-normal
            text-primary cursor-pointer
            before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[4px]
             bg-background-dark text-primary
            ${selectedValue === value
              ? " text-left bg-background-dark border-r-2 border-gray-400 scroll-select-item flex items-center justify-center snap-center cursor-pointer"
              : "hover:border-r-2 hover:border-gray-200  bg-background-dark hover:text-primary hover:border-light  hover:border-light"
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export const TabList: React.FC<TabListProps> = ({ variant, ...props }) => {
  return variant === "chip" ? (
    <ChipTabList {...props} />
  ) : (
    <VerticalTabList {...props} />
  );
};
