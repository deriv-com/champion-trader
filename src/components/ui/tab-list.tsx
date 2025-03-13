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

const ChipTabList: React.FC<BaseTabListProps> = ({ tabs, selectedValue, onSelect }) => {
    return (
        <div
            className="overflow-x-auto [&::-webkit-scrollbar]:hidden"
            style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
            }}
        >
            <div className="max-w-full flex gap-2">
                {tabs.map(({ label, value }) => (
                    <div key={value} className="shrink-0">
                        <button
                            onClick={() => onSelect(value)}
                            className={`
                                flex items-center h-8 min-h-8 max-h-8 px-4 rounded-full text-sm font-medium transition-colors gap-2
                                ${
                                    selectedValue === value
                                        ? "bg-theme-text text-theme-bg border border-theme-text"
                                        : "border border-theme text-theme hover:bg-theme-hover"
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

const VerticalTabList: React.FC<BaseTabListProps> = ({ tabs, selectedValue, onSelect }) => {
    return (
        <div className="w-28">
            {tabs.map(({ label, value }) => (
                <button
                    key={value}
                    onClick={() => onSelect(value)}
                    className={`
            relative w-full text-left py-3 px-6 transition-colors font-ibm-plex text-base leading-6 font-normal
            text-theme cursor-pointer
            before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[4px]
            ${selectedValue === value ? "bg-theme" : "hover:theme-hover before:bg-transparent"}
          `}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export const TabList: React.FC<TabListProps> = ({ variant, ...props }) => {
    return variant === "chip" ? <ChipTabList {...props} /> : <VerticalTabList {...props} />;
};
