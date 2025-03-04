import React, { useEffect, useRef, useMemo } from "react";
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
import { adaptDurationRanges } from "@/utils/duration-config-adapter";

const DURATION_TYPES: Tab[] = [
  { label: "Ticks", value: "ticks" },
  { label: "Seconds", value: "seconds" },
  { label: "Minutes", value: "minutes" },
  { label: "Hours", value: "hours" },
  { label: "Days", value: "days" },
] as const;

type DurationType = keyof DurationRangesResponse;

interface DurationControllerProps {
  onClose?: () => void;
}

export const DurationController: React.FC<DurationControllerProps> = ({
  onClose,
}) => {
  const {
    productConfig: config,
    duration,
    isConfigLoading: isLoading,
    setDuration,
  } = useTradeStore();
  const { isLandscape } = useOrientationStore();
  const { setBottomSheet } = useBottomSheetStore();
  const isInitialRender = useRef(true);

  useEffect(() => {
    isInitialRender.current = true;
    return () => {
      isInitialRender.current = false;
    };
  }, []);

  // Filter duration types based on supported units and ranges from API
  const availableDurationTypes = useMemo(() => {
    if (!config?.data?.validations?.durations) {
      return DURATION_TYPES;
    }

    const { durations } = config.data.validations;
    const ranges = adaptDurationRanges(config);

    // Only show duration types that have valid ranges
    const filteredTypes = DURATION_TYPES.filter((type) => {
      const hasRange = ranges[type.value as keyof DurationRangesResponse];
      const isTimeBasedType =
        type.value === "minutes" || type.value === "hours";
      const isSupported = isTimeBasedType
        ? durations.supported_units.includes("seconds") // minutes and hours are derived from seconds
        : durations.supported_units.includes(type.value);

      return isSupported && hasRange;
    });
    return filteredTypes;
  }, [config]);

  // Initialize local states
  const [localDuration, setLocalDuration] = React.useState(duration);
  const [value, type] = localDuration.split(" ");

  // Track selected tab type separately from duration value
  const [selectedTabType, setSelectedTabType] = React.useState<DurationType>(
    type as DurationType
  );

  // Track selected values for each tab type - only initialize with current value
  const [selectedValues, setSelectedValues] = React.useState<
    Partial<Record<DurationType, string | number>>
  >({
    [type as DurationType]: type === "hours" ? value : parseInt(value, 10),
  });

  // Get the selected value for the current tab
  const selectedValue = selectedValues[selectedTabType];

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
    setSelectedTabType(type);
  };

  const handleValueSelect = (value: number | string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [selectedTabType]: value,
    }));
    const newDuration = `${value} ${selectedTabType}`;
    setLocalDuration(newDuration);
  };

  const handleValueClick = (value: number | string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [selectedTabType]: value,
    }));
    const newDuration = `${value} ${selectedTabType}`;
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
          tabs={availableDurationTypes}
          selectedValue={selectedTabType}
          onSelect={handleTypeSelect as (value: string) => void}
          variant={isLandscape ? "vertical" : "chip"}
        />
        <div
          className={`flex-1 relative bg-white ${
            isLandscape ? "px-2" : "px-8"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : selectedTabType === "hours" ? (
            <HoursDurationValue
              selectedValue={selectedValue?.toString() || ""}
              onValueSelect={(value) => {
                handleValueSelect(value);
              }}
              onValueClick={handleValueClick}
              isInitialRender={isInitialRender}
            />
          ) : (
            <DurationValueList
              key={selectedTabType}
              selectedValue={(selectedValue as number) || 0}
              durationType={selectedTabType}
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
