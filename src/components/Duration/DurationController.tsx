import React, { useEffect, useRef } from "react";
import { TabList, Tab } from "@/components/ui/tab-list";
import { BottomSheetHeader } from "@/components/ui/bottom-sheet-header";
import { DurationValueList } from "./components/DurationValueList";
import { HoursDurationValue } from "./components/HoursDurationValue";
import { useTradeStore } from "@/stores/tradeStore";
import { PrimaryButton } from "@/components/ui/primary-button";
import { generateDurationValues as getDurationValues } from "@/utils/duration";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useDebounce } from "@/hooks/useDebounce";
import { DesktopTradeFieldCard } from "@/components/ui/desktop-trade-field-card";
import type { DurationRangesResponse } from "@/services/api/rest/duration/types";
import { useOrientationStore } from "@/stores/orientationStore";

const DURATION_TYPES: Tab[] = [
  { label: "Ticks", value: "tick" },
  { label: "Seconds", value: "second" },
  { label: "Minutes", value: "minute" },
  { label: "Hours", value: "hour" },
  // { label: "End Time", value: "day" },
] as const;

type DurationType = keyof DurationRangesResponse;

interface DurationControllerProps {
  onClose?: () => void;
}

export const DurationController: React.FC<DurationControllerProps> = ({
  onClose,
}) => {
  const { duration, setDuration } = useTradeStore();
  const { isLandscape } = useOrientationStore();
  const { setBottomSheet } = useBottomSheetStore();
  const isInitialRender = useRef(true);

  useEffect(() => {
    isInitialRender.current = true;
    return () => {
      isInitialRender.current = false;
    };
  }, []);

  // Initialize local state for both mobile and desktop
  const [localDuration, setLocalDuration] = React.useState(duration);
  const [value, type] = localDuration.split(" ");
  const selectedType = type as DurationType;
  const selectedValue: string | number =
    type === "hour" ? value : parseInt(value, 10);

  // Use debounced updates for desktop scroll
  useDebounce(
    localDuration,
    (value) => {
      if (isLandscape) {
        setDuration(value);
      }
    },
    300
  );

  const handleTypeSelect = (type: DurationType) => {
    const newDuration =
      type === "hour" ? "1:0 hour" : `${getDurationValues(type)[0]} ${type}`;
    setLocalDuration(newDuration);
  };

  const handleValueSelect = (value: number | string) => {
    const newDuration = `${value} ${selectedType}`;
    setLocalDuration(newDuration);
  };

  const handleValueClick = (value: number | string) => {
    const newDuration = `${value} ${selectedType}`;
    setLocalDuration(newDuration);
    setDuration(newDuration); // Update store immediately on click
    if (isLandscape) {
      onClose?.();
    }
  };

  const handleSave = () => {
    setDuration(localDuration);
    if (isLandscape) {
      onClose?.();
    } else {
      setBottomSheet(false);
    }
  };

  const content = (
    <>
      <div className={isLandscape ? "flex" : ""}>
        {!isLandscape && <BottomSheetHeader title="Duration" />}
        <TabList
          tabs={DURATION_TYPES}
          selectedValue={selectedType}
          onSelect={handleTypeSelect as (value: string) => void}
          variant={isLandscape ? "vertical" : "chip"}
        />
        <div className={`flex-1 relative bg-white ${isLandscape ? "px-2" : "px-8"}`}>
          {selectedType === "hour" ? (
            <HoursDurationValue
              selectedValue={selectedValue.toString()}
              onValueSelect={(value) => {
                handleValueSelect(value);
              }}
              onValueClick={handleValueClick}
              isInitialRender={isInitialRender}
            />
          ) : (
            <DurationValueList
              key={selectedType}
              selectedValue={selectedValue as number}
              durationType={selectedType}
              onValueSelect={handleValueSelect}
              onValueClick={handleValueClick}
              getDurationValues={getDurationValues}
            />
          )}
        </div>
      </div>
      {!isLandscape && (
        <div className="w-full p-3">
          <PrimaryButton className="rounded-3xl" onClick={handleSave}>
            Save
          </PrimaryButton>
        </div>
      )}
    </>
  );

  if (isLandscape) {
    return (
      <DesktopTradeFieldCard className="p-0">
        <div className="w-[368px]">{content}</div>
      </DesktopTradeFieldCard>
    );
  }

  return <div className="flex flex-col h-full">{content}</div>;
};
