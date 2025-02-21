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
                ${
                  selectedValue === value
                    ? "bg-gray-900 text-black dark:bg-gray-700 dark:text-white rounded-3xl"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black dark:bg-gray-700 dark:text-gray-300 hover:dark:bg-gray-600 hover:dark:text-white"
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
    <div className="w-28 bg-[#F6F7F8]">
      {tabs.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={`
            relative w-full text-left py-3 px-6 transition-colors font-ibm-plex text-base leading-6 font-normal
            text-primary cursor-pointer
            before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[4px]
            ${selectedValue === value
              ? "bg-gray-100 font-bold text-black dark:bg-gray-800 dark:text-white"
              : "hover:bg-gray-50 hover:text-black dark:hover:bg-gray-700 dark:text-gray-300 hover:dark:text-black"
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
