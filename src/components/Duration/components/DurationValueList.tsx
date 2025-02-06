import React from "react";
import { ScrollSelect } from "@/components/ui/scroll-select";

interface DurationValueListProps {
  selectedValue: number;
  durationType: string;
  onValueSelect: (value: number) => void;
  getDurationValues: (type: string) => number[];
}

const getUnitLabel = (type: string, value: number): string => {
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
    />
  );
};
