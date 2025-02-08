import React, { useRef, useEffect, MutableRefObject } from "react";
import { DurationValueList } from "./DurationValueList";
import { generateDurationValues, getSpecialCaseKey } from "@/utils/duration";

interface HoursDurationValueProps {
  selectedValue: string; // "2:12" format
  onValueSelect: (value: string) => void;
  onValueClick?: (value: string) => void;
  isDesktop?: boolean;
  onClose?: () => void;
  isInitialRender: MutableRefObject<boolean>;
}

const getHoursValues = (): number[] => generateDurationValues("hour");
const getMinutesValues = (): number[] => generateDurationValues("minute");

export const HoursDurationValue: React.FC<HoursDurationValueProps> = ({
  selectedValue,
  onValueSelect,
  onValueClick,
  isDesktop,
  onClose,
  isInitialRender,
}) => {
  // Use refs to store last valid values
  const lastValidHours = useRef<number>();
  const lastValidMinutes = useRef<number>();
  const minutesRef = useRef<HTMLDivElement>(null);

  const scrollToMinutes = (value: number) => {
    const minutesContainer = minutesRef.current?.querySelector(
      `[data-value="${value}"]`
    );
    if (minutesContainer) {
      minutesContainer.scrollIntoView({ block: "center", behavior: "instant" });
    }
  };

  const scrollToZeroMinutes = () => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    scrollToMinutes(0);
  };

  // Initialize refs if they're undefined
  if (!lastValidHours.current || !lastValidMinutes.current) {
    const [h, m] = selectedValue.split(":").map(Number);
    lastValidHours.current = h;
    lastValidMinutes.current = m;
  }

  const handleHoursSelect = (newHours: number) => {
    lastValidHours.current = newHours;
    if (isInitialRender.current) {
      onValueSelect(`${newHours}:${lastValidMinutes.current}`);
    } else {
      lastValidMinutes.current = 0;
      onValueSelect(`${newHours}:0`);
    }
    scrollToZeroMinutes();
  };

  const handleMinutesSelect = (newMinutes: number) => {
    lastValidMinutes.current = newMinutes;
    onValueSelect(`${lastValidHours.current}:${newMinutes}`);
  };

  const handleHoursClick = (newHours: number) => {
    lastValidHours.current = newHours;
    if (isInitialRender.current) {
      onValueClick?.(`${newHours}:${lastValidMinutes.current}`);
    } else {
      lastValidMinutes.current = 0;
      onValueClick?.(`${newHours}:0`);
    }
    scrollToZeroMinutes();
  };

  const handleMinutesClick = (newMinutes: number) => {
    lastValidMinutes.current = newMinutes;
    onValueClick?.(`${lastValidHours.current}:${newMinutes}`);
  };

  return (
    <div
      className="flex w-full"
      role="group"
      aria-label="Duration in hours and minutes"
    >
      <div className="flex-1" aria-label="Hours">
        <DurationValueList
          selectedValue={lastValidHours.current || 0}
          durationType="hour"
          onValueSelect={handleHoursSelect}
          onValueClick={handleHoursClick}
          getDurationValues={getHoursValues}
          isDesktop={isDesktop}
          onClose={onClose}
        />
      </div>
      <div ref={minutesRef} className="flex-1" aria-label="Minutes">
          <DurationValueList
            key={`minutes${getSpecialCaseKey(lastValidHours.current)}`}
            selectedValue={lastValidMinutes.current || 0}
            durationType="minute"
            onValueSelect={handleMinutesSelect}
            onValueClick={handleMinutesClick}
            getDurationValues={() => generateDurationValues('minute', lastValidHours.current)}
            isDesktop={isDesktop}
            onClose={onClose}
          />
      </div>
    </div>
  );
};
