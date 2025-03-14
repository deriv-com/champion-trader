import React from "react";
import { ScrollSelect } from "@/components/ui/scroll-select";
import type { DurationRangesResponse } from "@/api/services/product/types";

interface DurationValueListProps {
    selectedValue: number;
    durationType: keyof DurationRangesResponse;
    onValueSelect: (value: number) => void;
    onValueClick?: (value: number) => void;
    getDurationValues: (type: keyof DurationRangesResponse) => number[];
}

const getUnitLabel = (type: keyof DurationRangesResponse, value: number): string => {
    switch (type) {
        case "ticks":
            return value === 1 ? "tick" : "ticks";
        case "seconds":
            return value === 1 ? "second" : "seconds";
        case "minutes":
            return value === 1 ? "minute" : "minutes";
        case "hours":
            return value === 1 ? "hour" : "hours";
        case "days":
            return value === 1 ? "day" : "days";
        default:
            return "";
    }
};

export const DurationValueList: React.FC<DurationValueListProps> = ({
    selectedValue,
    durationType,
    onValueSelect,
    onValueClick,
    getDurationValues,
}) => {
    const values = getDurationValues(durationType);
    const options = values.map((value) => ({
        value,
        label: `${value} ${getUnitLabel(durationType, value)}`,
    }));

    return (
        <ScrollSelect
            options={options}
            selectedValue={selectedValue}
            onValueSelect={onValueSelect}
            onValueClick={onValueClick}
        />
    );
};
