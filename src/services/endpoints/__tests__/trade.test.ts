const mockAxiosInstance = {
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  },
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn()
};

// Mock axios must be before imports
jest.mock('axios', () => ({
  create: () => mockAxiosInstance
}));

import { tradeService } from '../trade';
import { Trade, TradeRequest } from '../../api/types';

describe('tradeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('placeTrade', () => {
    it('should place a trade successfully', async () => {
      const mockTradeRequest: TradeRequest = {
        symbol: 'R_100',
        type: 'RISE',
        amount: 10,
        duration: 5,
      };

      const mockResponse = {
        data: {
          data: {
            trade: {
              id: '123',
              symbol: 'R_100',
              type: 'RISE',
              amount: 10,
              payout: 19.5,
              status: 'OPEN',
              createdAt: '2024-01-28T00:00:00Z',
              expiresAt: '2024-01-28T00:05:00Z',
            },
            message: 'Trade placed successfully',
          },
          status: 200,
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await tradeService.placeTrade(mockTradeRequest);

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/trades', mockTradeRequest);
    });

    it('should handle errors when placing a trade', async () => {
      const mockTradeRequest: TradeRequest = {
        symbol: 'R_100',
        type: 'RISE',
        amount: 10,
        duration: 5,
      };

      const mockError = {
        response: {
          data: {
            code: 'INSUFFICIENT_BALANCE',
            message: 'Insufficient balance',
            status: 400,
          },
        },
      };

      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      await expect(tradeService.placeTrade(mockTradeRequest)).rejects.toEqual(mockError);
    });
  });

  describe('getTrades', () => {
    it('should get trades with pagination', async () => {
      const mockTrades: Trade[] = [
        {
          id: '123',
          symbol: 'R_100',
          type: 'RISE',
          amount: 10,
          payout: 19.5,
          status: 'OPEN',
          createdAt: '2024-01-28T00:00:00Z',
          expiresAt: '2024-01-28T00:05:00Z',
        },
      ];

      const mockResponse = {
        data: {
          data: mockTrades,
          total: 1,
          page: 1,
          limit: 10,
        },
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const result = await tradeService.getTrades(1, 10);

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/trades', {
        params: { page: 1, limit: 10 },
      });
    });
  });

  describe('getTradeById', () => {
    it('should get a trade by ID', async () => {
      const mockTrade: Trade = {
        id: '123',
        symbol: 'R_100',
        type: 'RISE',
        amount: 10,
        payout: 19.5,
        status: 'OPEN',
        createdAt: '2024-01-28T00:00:00Z',
        expiresAt: '2024-01-28T00:05:00Z',
      };

      const mockResponse = {
        data: {
          data: mockTrade,
          status: 200,
        },
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const result = await tradeService.getTradeById('123');

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/trades/123');
    });
  });

  describe('cancelTrade', () => {
    it('should cancel a trade', async () => {
      const mockResponse = {
        data: {
          status: 200,
          message: 'Trade cancelled successfully',
        },
      };

      mockAxiosInstance.delete.mockResolvedValueOnce(mockResponse);

      const result = await tradeService.cancelTrade('123');

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/trades/123');
    });
  });
});
