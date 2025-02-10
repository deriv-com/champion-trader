import { type AxiosError } from 'axios';
import { BuyRequest, BuyResponse } from '../types';
import { apiClient } from '@/services/api/axios_interceptor';

/**
 * Makes a buy request to purchase a contract
 * @param data The buy request data
 * @returns Promise with the buy response
 */
export const buyContract = async (data: BuyRequest): Promise<BuyResponse> => {
  try {
    const response = await apiClient.post<BuyResponse>('/buy', data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error && (error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(axiosError.response?.data?.message || 'Failed to buy contract');
    }
    throw error;
  }
};
