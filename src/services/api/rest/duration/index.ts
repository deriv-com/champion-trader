import { DurationRangesResponse } from './types';
import { DURATION_RANGES } from '@/config/duration';

export async function getDurationRanges(): Promise<DurationRangesResponse> {
  // TODO: Implement API call when ready
  // const response = await apiClient.get('/v3/duration-ranges');
  // return response.data;
  
  return DURATION_RANGES as DurationRangesResponse;
}
