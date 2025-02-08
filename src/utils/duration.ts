import { DurationRangesResponse } from '@/services/api/rest/duration/types';

// Current static config (will be replaced by API response later)
export const DURATION_RANGES: DurationRangesResponse = {
  tick: { min: 1, max: 10 },
  second: { min: 15, max: 59 },
  minute: { min: 1, max: 59 },
  hour: { min: 1, max: 24, step: 1 },
  day: { min: 1, max: 30 }
};

// Pre-computed duration values for better performance
const DURATION_VALUES_MAP: Record<keyof DurationRangesResponse, number[]> = {
  tick: Array.from({ length: 10 }, (_, i) => i + 1),
  second: Array.from({ length: 45 }, (_, i) => i + 15),
  minute: Array.from({ length: 60 }, (_, i) => i),
  hour: Array.from({ length: 24 }, (_, i) => i + 1),
  day: Array.from({ length: 30 }, (_, i) => i + 1)
};

// Define special hour cases
interface SpecialHourCase {
  key: string;
  minutes: number[];
}

export const SPECIAL_HOUR_CASES: Record<number, SpecialHourCase> = {
  24: {
    key: '24h',
    minutes: [0]
  }
};

// Pre-computed minutes values for better performance
const ALL_MINUTES = Array.from({ length: 60 }, (_, i) => i);

// Map duration types to their SSE format
export const DURATION_FORMAT_MAP: Record<keyof DurationRangesResponse, string> = {
  tick: 't',
  second: 's',
  minute: 'm',
  hour: 'h',
  day: 'd'
};

// Format duration for contract SSE
export function formatDuration(value: number, type: keyof DurationRangesResponse): string {
  return `${value}${DURATION_FORMAT_MAP[type]}`;
}

// Use pre-computed values instead of generating them
export function generateDurationValues(type: keyof DurationRangesResponse, hour?: number): number[] {
  if (type === 'minute' && hour !== undefined) {
    return SPECIAL_HOUR_CASES[hour]?.minutes || ALL_MINUTES;
  }
  return DURATION_VALUES_MAP[type] || [];
}

// Helper to get key suffix for special cases
export function getSpecialCaseKey(hour?: number): string {
  if (hour === undefined) return '';
  return SPECIAL_HOUR_CASES[hour]?.key || '';
}

// Validation helper (useful when API integration comes)
export function isValidDuration(type: keyof DurationRangesResponse, value: number): boolean {
  const range = DURATION_RANGES[type];
  if (!range) return false;
  return value >= range.min && value <= range.max;
}

// Helper to get the default value for a duration type
export function getDefaultDuration(type: keyof DurationRangesResponse): number {
  const range = DURATION_RANGES[type];
  if (!range) return 0;
  return type === "minute" ? 1 : range.min;
}

// Parse duration string into value and type
export interface ParsedDuration {
  value: string;
  type: keyof DurationRangesResponse;
}

export function parseDuration(duration: string): ParsedDuration {
  const [value, type] = duration.split(" ");
  let apiDurationValue = value;
  let apiDurationType = type as keyof DurationRangesResponse;

  if (type === "hour" && value.includes(":")) {
    apiDurationValue = convertHourToMinutes(value).toString();
    apiDurationType = "minute";
  } else if (type === "hour") {
    apiDurationValue = value.split(":")[0];
  }

  return {
    value: apiDurationValue,
    type: apiDurationType
  };
}

export function convertHourToMinutes(hourValue: string): number {
  const [hours, minutes] = hourValue.split(":").map(Number);
  return (hours * 60) + (minutes || 0);
}

export const formatDurationDisplay = (duration: string): string => {
  const [value, type] = duration.split(" ");
  
  if (type === "hour") {
    const [hours, minutes] = value.split(":").map(Number);
    const hourText = hours === 1 ? "hour" : "hours";
    const minuteText = minutes === 1 ? "minute" : "minutes";
    return minutes > 0 ? `${hours} ${hourText} ${minutes} ${minuteText}` : `${hours} ${hourText}`;
  }

  const numValue = parseInt(value, 10);
  switch (type) {
    case "tick":
      return `${numValue} ${numValue === 1 ? "tick" : "ticks"}`;
    case "second":
      return `${numValue} ${numValue === 1 ? "second" : "seconds"}`;
    case "minute":
      return `${numValue} ${numValue === 1 ? "minute" : "minutes"}`;
    case "day":
      return `${numValue} day`;
    default:
      return duration;
  }
};
