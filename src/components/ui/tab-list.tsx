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
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
    <div className="w-48 border-r border-gray-200">
      {tabs.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={`
            w-full text-left py-2 px-4 transition-colors
            ${
              selectedValue === value
                ? "bg-gray-100 font-bold"
                : "hover:bg-gray-50"
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
