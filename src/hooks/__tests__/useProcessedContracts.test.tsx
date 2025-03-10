import { renderHook } from '@testing-library/react-hooks';
import { useProcessedContracts } from '../useProcessedContracts';
import { useContracts } from '../useContracts';

// Mock the useContracts hook
jest.mock('../useContracts', () => ({
  useContracts: jest.fn()
}));

describe('useProcessedContracts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process contracts correctly', () => {
    // Mock the return value of useContracts
    (useContracts as jest.Mock).mockReturnValue({
      contracts: [
        {
          contract_id: '123',
          contract_details: {
            variant: 'rise',
            instrument_name: 'Volatility 100 Index',
            duration: 60,
            duration_units: 'seconds',
            stake: '10.00',
            profit_loss: '+1.50',
            is_expired: false,
            is_sold: false
          }
        },
        {
          contract_id: '456',
          contract_details: {
            variant: 'fall',
            instrument_name: 'Volatility 75 Index',
            duration: 5,
            duration_units: 'ticks',
            stake: '20.00',
            profit_loss: '-2.50',
            is_expired: true,
            is_sold: false
          }
        }
      ],
      loading: false,
      error: null,
      refetchContracts: jest.fn()
    });

    // Render the hook
    const { result } = renderHook(() => useProcessedContracts());

    // Check the processed contracts
    expect(result.current.processedContracts).toHaveLength(2);
    
    // Check the first contract
    expect(result.current.processedContracts[0]).toEqual(expect.objectContaining({
      id: 123,
      originalId: '123',
      type: 'Rise',
      market: 'Volatility 100 Index',
      duration: '01:00:00',
      stake: '10.00 USD',
      profit: '+1.50',
      isOpen: true
    }));

    // Check the second contract
    expect(result.current.processedContracts[1]).toEqual(expect.objectContaining({
      id: 456,
      originalId: '456',
      type: 'Fall',
      market: 'Volatility 75 Index',
      duration: '0/5 ticks',
      stake: '20.00 USD',
      profit: '-2.50',
      isOpen: false
    }));

    // Check open and closed contracts
    expect(result.current.openContracts).toHaveLength(1);
    expect(result.current.closedContracts).toHaveLength(1);

    // Check total profit calculation
    expect(result.current.calculateTotalProfit(result.current.processedContracts)).toEqual(-1);
  });

  it('should handle loading state', () => {
    (useContracts as jest.Mock).mockReturnValue({
      contracts: [],
      loading: true,
      error: null,
      refetchContracts: jest.fn()
    });

    const { result } = renderHook(() => useProcessedContracts());

    expect(result.current.loading).toBe(true);
    expect(result.current.processedContracts).toEqual([]);
  });

  it('should handle error state', () => {
    const errorMessage = 'Failed to fetch contracts';
    (useContracts as jest.Mock).mockReturnValue({
      contracts: [],
      loading: false,
      error: errorMessage,
      refetchContracts: jest.fn()
    });

    const { result } = renderHook(() => useProcessedContracts());

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.processedContracts).toEqual([]);
  });
});
