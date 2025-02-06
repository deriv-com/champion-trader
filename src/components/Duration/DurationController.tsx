import React from "react";
import { DurationTabList } from "./components/DurationTabList";
import { DurationValueList } from "./components/DurationValueList";
import { HoursDurationValue } from "./components/HoursDurationValue";
import { useTradeStore } from "@/stores/tradeStore";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { PrimaryButton } from "@/components/ui/primary-button";
import { getDurationValues } from "./utils";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";

interface DurationControllerProps {
  onClose?: () => void;
}

export const DurationController: React.FC<DurationControllerProps> = ({
  onClose,
}) => {
  const { duration, setDuration } = useTradeStore();
  const { isDesktop } = useDeviceDetection();
  const { setBottomSheet } = useBottomSheetStore();

  // Initialize local state with store value
  const [localDuration, setLocalDuration] = React.useState(duration);
  const [value, type] = localDuration.split(" ");
  const selectedType = type;
  const selectedValue: string | number =
    type === "hour" ? value : parseInt(value, 10);

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
    setDuration(localDuration);
    if (isDesktop) {
      onClose?.();
    } else {
      setBottomSheet(false);
    }
  };

  const content = (
    <>
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
    </>
  );

  if (isDesktop) {
    return (
      <div className="bg-white rounded-lg shadow-lg w-[480px]">{content}</div>
    );
  }

  return <div className="flex flex-col h-full">{content}</div>;
};
