import { renderHook } from '@testing-library/react-hooks';
import { useContracts } from '../useContracts';
import { useRestAPI } from '../useRestAPI';
import { fetchContracts } from '@/services/api/rest/contracts/contractsService';

// Mock the useRestAPI hook
jest.mock('../useRestAPI');

describe('useContracts', () => {
  // Mock data
  const mockContracts = [
    {
      contract_id: '1',
      contract_details: {
        allow_equals: false,
        bid_price: '10.00',
        can_sell: true,
        duration: 60,
        duration_units: 'seconds',
        expiry: 1234567890,
        is_expired: false,
        pricing_tick_id: 1234567880,
        stake: '5.00',
        start_time: 1234567830,
        variant: 'rise'
      }
    },
    {
      contract_id: '2',
      contract_details: {
        allow_equals: true,
        bid_price: '15.00',
        can_sell: false,
        duration: 120,
        duration_units: 'seconds',
        expiry: 1234567990,
        is_expired: true,
        pricing_tick_id: 1234567880,
        stake: '10.00',
        start_time: 1234567870,
        variant: 'fall'
      }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return contracts data from useRestAPI', () => {
    // Mock the useRestAPI hook to return contracts data
    (useRestAPI as jest.Mock).mockReturnValue({
      data: mockContracts,
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    // Render the hook
    const { result } = renderHook(() => useContracts());

    // Check that the hook returns the expected data
    expect(result.current.contracts).toEqual(mockContracts);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.refetchContracts).toBe('function');

    // Check that useRestAPI was called with the correct parameters
    expect(useRestAPI).toHaveBeenCalledWith(fetchContracts);
  });

  it('should return empty array when data is null', () => {
    // Mock the useRestAPI hook to return null data
    (useRestAPI as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    // Render the hook
    const { result } = renderHook(() => useContracts());

    // Check that the hook returns an empty array
    expect(result.current.contracts).toEqual([]);
  });

  it('should return loading state from useRestAPI', () => {
    // Mock the useRestAPI hook to return loading state
    (useRestAPI as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: jest.fn()
    });

    // Render the hook
    const { result } = renderHook(() => useContracts());

    // Check that the hook returns the loading state
    expect(result.current.loading).toBe(true);
  });

  it('should return error state from useRestAPI', () => {
    const mockError = 'Failed to fetch contracts';

    // Mock the useRestAPI hook to return error state
    (useRestAPI as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: mockError,
      refetch: jest.fn()
    });

    // Render the hook
    const { result } = renderHook(() => useContracts());

    // Check that the hook returns the error state
    expect(result.current.error).toBe(mockError);
  });

  it('should provide refetchContracts function', () => {
    const mockRefetch = jest.fn();

    // Mock the useRestAPI hook to return a refetch function
    (useRestAPI as jest.Mock).mockReturnValue({
      data: mockContracts,
      loading: false,
      error: null,
      refetch: mockRefetch
    });

    // Render the hook
    const { result } = renderHook(() => useContracts());

    // Call the refetchContracts function
    result.current.refetchContracts();

    // Check that the refetch function was called
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});
