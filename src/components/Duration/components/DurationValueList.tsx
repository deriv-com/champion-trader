import React from "react";
import { ScrollSelect } from "@/components/ui/scroll-select";
import type { DurationRangesResponse } from "@/services/api/rest/duration/types";

interface DurationValueListProps {
  selectedValue: number;
  durationType: keyof DurationRangesResponse;
  onValueSelect: (value: number) => void;
  onValueClick?: (value: number) => void;
  getDurationValues: (type: keyof DurationRangesResponse) => number[];
}

const getUnitLabel = (type: keyof DurationRangesResponse, value: number): string => {
  switch (type) {
    case "tick":
      return value === 1 ? "tick" : "ticks";
    case "second":
      return value === 1 ? "second" : "seconds";
    case "minute":
      return value === 1 ? "minute" : "minutes";
    case "hour":
      return value === 1 ? "hour" : "hours";
    case "day":
      return "day";
    default:
      return "";
  }
};

export const DurationValueList: React.FC<DurationValueListProps> = ({
  selectedValue,
  durationType,
  onValueSelect,
  onValueClick,
  getDurationValues
}) => {
  const values = getDurationValues(durationType);
  const options = values.map(value => ({
    value,
    label: `${value} ${getUnitLabel(durationType, value)}`
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
