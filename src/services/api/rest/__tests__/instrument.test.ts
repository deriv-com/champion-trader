import { AxiosError } from 'axios';
import { apiClient } from '../../axios_interceptor';
import { getAvailableInstruments } from '../instrument/service';
import {
  AvailableInstrumentsRequest,
  AvailableInstrumentsResponse,
  ErrorResponse,
} from '../types';

// Mock the axios client
jest.mock('../../axios_interceptor');
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('REST API Service', () => {
  describe('getAvailableInstruments', () => {
    const mockRequest: AvailableInstrumentsRequest = {
      context: {
        app_id: 1001,
        account_type: 'real',
      },
    };

    const mockResponse: AvailableInstrumentsResponse = {
      instruments: [
        { id: 'EURUSD', name: 'EUR/USD' },
        { id: 'GBPUSD', name: 'GBP/USD' },
      ],
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully fetch available instruments', async () => {
      mockApiClient.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await getAvailableInstruments(mockRequest);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/available_instruments',
        mockRequest
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle validation error', async () => {
      const errorResponse: ErrorResponse = {
        error: 'app_id is required in context',
      };

      mockApiClient.post.mockRejectedValueOnce(
        new AxiosError(
          'Bad Request',
          '400',
          undefined,
          undefined,
          { data: errorResponse, status: 400 } as any
        )
      );

      await expect(getAvailableInstruments({
        context: { app_id: 0, account_type: '' },
      })).rejects.toThrow('Bad Request');
    });

    it('should handle server error', async () => {
      const errorResponse: ErrorResponse = {
        error: 'Failed to fetch available instruments',
      };

      mockApiClient.post.mockRejectedValueOnce(
        new AxiosError(
          'Internal Server Error',
          '500',
          undefined,
          undefined,
          { data: errorResponse, status: 500 } as any
        )
      );

      await expect(getAvailableInstruments(mockRequest)).rejects.toThrow('Internal Server Error');
    });
  });
});
