import React from "react";
import { DurationTabList } from "./components/DurationTabList";
import { DurationValueList } from "./components/DurationValueList";
import { HoursDurationValue } from "./components/HoursDurationValue";
import { useTradeStore } from "@/stores/tradeStore";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { PrimaryButton } from "@/components/ui/primary-button";

const getDurationValues = (type: string): number[] => {
  switch (type) {
    case "tick":
      return [1, 2, 3, 4, 5];
    case "second":
      return [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
        57, 58, 59, 60,
      ];
    case "minute":
      return [1, 2, 3, 5, 10, 15, 30];
    case "hour":
      return [1, 2, 3, 4, 6, 8, 12, 24];
    case "day":
      return [1];
    default:
      return [];
  }
};

export const DurationController: React.FC = () => {
  const { duration, setDuration } = useTradeStore();
  const { setBottomSheet } = useBottomSheetStore();
  
  // Initialize local state with store value
  const [localDuration, setLocalDuration] = React.useState(duration);
  const [value, type] = localDuration.split(" ");
  const selectedType = type;
  const selectedValue: string | number = type === "hour" ? value : parseInt(value, 10);

  const handleTypeSelect = (type: string) => {
    if (type === "hour") {
      setLocalDuration("1:0 hour");
    } else {
      const values = getDurationValues(type);
      const newValue = values[0];
      setLocalDuration(`${newValue} ${type}`);
    }
  };

  const handleValueSelect = (value: number) => {
    setLocalDuration(`${value} ${selectedType}`);
  };

  const handleSave = () => {
    setDuration(localDuration); // Update store with local state
    setBottomSheet(false);
  };

  return (
    <div className="flex flex-col h-full" id="DurationController">
      <div>
        <h5 className="font-ubuntu text-[16px] font-bold leading-[24px] text-center underline decoration-transparent py-4 px-2">
          Duration
        </h5>
        <DurationTabList
          selectedType={selectedType}
          onTypeSelect={handleTypeSelect}
        />
      </div>
      <div className="flex-1 relative px-8">
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[48px] pointer-events-none"
          id="duration-selection-zone"
        />
        {selectedType === "hour" ? (
          <HoursDurationValue
            selectedValue={selectedValue.toString()}
            onValueSelect={(value) => setLocalDuration(`${value} hour`)}
          />
        ) : (
          <DurationValueList
            key={selectedType}
            selectedValue={selectedValue as number}
            durationType={selectedType}
            onValueSelect={handleValueSelect}
            getDurationValues={getDurationValues}
          />
        )}
      </div>
      <div className="w-full p-3">
        <PrimaryButton onClick={handleSave}>Save</PrimaryButton>
      </div>
    </div>
  );
};
