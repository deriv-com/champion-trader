import React, { useRef } from "react";
import { DurationValueList } from "./DurationValueList";

interface HoursDurationValueProps {
  selectedValue: string; // "2:12" format
  onValueSelect: (value: string) => void;
}

const getHoursValues = (): number[] => [1, 2, 3, 4, 6, 8, 12, 24];
const getMinutesValues = (): number[] => Array.from({ length: 60 }, (_, i) => i);

export const HoursDurationValue: React.FC<HoursDurationValueProps> = ({
  selectedValue,
  onValueSelect,
}) => {
  // Use refs to store last valid values
  const lastValidHours = useRef<number>();
  const lastValidMinutes = useRef<number>();
  
  // Initialize refs if they're undefined
  if (!lastValidHours.current || !lastValidMinutes.current) {
    const [h, m] = selectedValue.split(":").map(Number);
    lastValidHours.current = h;
    lastValidMinutes.current = m;
  }

  const handleHoursSelect = (newHours: number) => {
    lastValidHours.current = newHours;
    onValueSelect(`${newHours}:${lastValidMinutes.current}`);
  };

  const handleMinutesSelect = (newMinutes: number) => {
    lastValidMinutes.current = newMinutes;
    onValueSelect(`${lastValidHours.current}:${newMinutes}`);
  };

  return (
    <div 
      className="flex w-full" 
      role="group" 
      aria-label="Duration in hours and minutes"
    >
      <div 
        className="flex-1"
        aria-label="Hours"
      >
        <DurationValueList
          selectedValue={lastValidHours.current}
          durationType="hour"
          onValueSelect={handleHoursSelect}
          getDurationValues={getHoursValues}
        />
      </div>
      <div 
        className="flex-1"
        aria-label="Minutes"
      >
        <DurationValueList
          selectedValue={lastValidMinutes.current}
          durationType="minute"
          onValueSelect={handleMinutesSelect}
          getDurationValues={getMinutesValues}
        />
      </div>
    </div>
  );
};
