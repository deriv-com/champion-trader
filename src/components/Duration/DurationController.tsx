import React, { useCallback } from "react";
import { TabList, Tab } from "@/components/ui/tab-list";
import { DurationValueList } from "./components/DurationValueList";
import { HoursDurationValue } from "./components/HoursDurationValue";
import { useTradeStore } from "@/stores/tradeStore";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { PrimaryButton } from "@/components/ui/primary-button";
import { getDurationValues } from "./utils";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useDebounce } from "@/hooks/useDebounce";

const DURATION_TYPES: Tab[] = [
  { label: "Ticks", value: "tick" },
  { label: "Seconds", value: "second" },
  { label: "Minutes", value: "minute" },
  { label: "Hours", value: "hour" },
  { label: "End Time", value: "day" }
];

interface DurationControllerProps {
  onClose?: () => void;
}

export const DurationController: React.FC<DurationControllerProps> = ({
  onClose,
}) => {
  const { duration, setDuration } = useTradeStore();
  const { isDesktop } = useDeviceDetection();
  const { setBottomSheet } = useBottomSheetStore();

  // Initialize local state for both mobile and desktop
  const [localDuration, setLocalDuration] = React.useState(duration);
  const [value, type] = localDuration.split(" ");
  const selectedType = type;
  const selectedValue: string | number =
    type === "hour" ? value : parseInt(value, 10);

  // Memoize the setDuration callback to prevent unnecessary effect triggers
  const handleDebouncedUpdate = useCallback(
    (value: string) => {
      setDuration(value);
    },
    [setDuration]
  );

  // Use debounced updates for desktop
  useDebounce(
    localDuration,
    (value) => {
      if (isDesktop) {
        handleDebouncedUpdate(value);
      }
    },
    100
  );

  const handleTypeSelect = (type: string) => {
    const newDuration = type === "hour" 
      ? "1:0 hour" 
      : `${getDurationValues(type)[0]} ${type}`;
    
    setLocalDuration(newDuration);
  };

  const handleValueSelect = (value: number | string) => {
    const newDuration = `${value} ${selectedType}`;
    setLocalDuration(newDuration);
  };

  const handleSave = () => {
    setDuration(localDuration);
    if (isDesktop) {
      onClose?.();
    } else {
      setBottomSheet(false);
    }
  };

  const content = (
    <>
      <h5 className="font-ubuntu text-[16px] font-bold leading-[24px] text-center py-4 px-2">
        Duration
      </h5>
      <div className={isDesktop ? "flex" : ""}>
        <TabList
          tabs={DURATION_TYPES}
          selectedValue={selectedType}
          onSelect={handleTypeSelect}
          variant={isDesktop ? "vertical" : "chip"}
        />
        <div className={`flex-1 relative ${isDesktop ? "px-4" : "px-8"}`}>
          {selectedType === "hour" ? (
            <HoursDurationValue
              selectedValue={selectedValue.toString()}
              onValueSelect={handleValueSelect}
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
      </div>
      {!isDesktop && (
        <div className="w-full p-3">
          <PrimaryButton onClick={handleSave}>Save</PrimaryButton>
        </div>
      )}
    </>
  );

  if (isDesktop) {
    return (
      <div className="bg-white rounded-lg shadow-lg w-[480px]">{content}</div>
    );
  }

  return <div className="flex flex-col h-full">{content}</div>;
};
