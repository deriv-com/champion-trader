import React from "react";

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
                  ? "bg-gray-900 text-white dark:bg-gray-800 dark:text-white rounded-3xl"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black dark:bg-gray-700 dark:text-gray-300 hover:dark:bg-gray-600 hover:dark:text-gray-200"
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
  return (
    <div className="w-28 bg-white dark:bg-gray-900">
      {tabs.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={`
            relative w-full text-left py-3 px-6 transition-colors font-ibm-plex text-base leading-6 font-normal
            text-primary cursor-pointer
            before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[4px]
            dark:bg-gray-900 dark:text-white
            ${selectedValue === value
              ? "text-left dark:bg-gray-700 dark:text-white border-r-2 border-gray-500 dark:border-gray-300 dark:scroll-select-item flex items-center justify-center snap-center cursor-pointer"
              : "bg-white text-black text-gray-500 hover:border-r-2 hover:border-gray-400 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:border-r-2 dark:hover:border-gray-500"
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
