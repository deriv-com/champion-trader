import { apiClient } from '../api/axios_interceptor';
import { ApiResponse, Trade, TradeRequest, TradeResponse, PaginatedResponse } from '../api/types';

export const tradeService = {
  /**
   * Place a new trade
   */
  placeTrade: async (data: TradeRequest): Promise<ApiResponse<TradeResponse>> => {
    const response = await apiClient.post<ApiResponse<TradeResponse>>('/trades', data);
    return response.data;
  },

  /**
   * Get all trades with pagination
   */
  getTrades: async (page = 1, limit = 10): Promise<PaginatedResponse<Trade>> => {
    const response = await apiClient.get<PaginatedResponse<Trade>>('/trades', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get a specific trade by ID
   */
  getTradeById: async (id: string): Promise<ApiResponse<Trade>> => {
    const response = await apiClient.get<ApiResponse<Trade>>(`/trades/${id}`);
    return response.data;
  },

  /**
   * Cancel an open trade
   */
  cancelTrade: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/trades/${id}`);
    return response.data;
  },
};
