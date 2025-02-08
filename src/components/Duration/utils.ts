import { generateDurationValues, isValidDuration, getDefaultDuration } from '@/config/duration';
import type { DurationRangesResponse } from '@/services/api/rest/duration/types';

export const getDurationValues = (type: keyof DurationRangesResponse): number[] => {
  return generateDurationValues(type);
};

export const validateDuration = (type: keyof DurationRangesResponse, value: number): boolean => {
  return isValidDuration(type, value);
};

export const getDefaultDurationValue = (type: keyof DurationRangesResponse): number => {
  return getDefaultDuration(type);
};
