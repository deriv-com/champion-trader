import { renderHook } from '@testing-library/react-hooks';
import { useMarketSSE } from '../useMarketSSE';
import { InstrumentPriceResponse, WebSocketError } from '@/services/api/websocket/types';

// Mock the SSE store
const mockStore = {
  initializeMarketService: jest.fn(),
  subscribeToInstrumentPrice: jest.fn(),
  unsubscribeFromInstrumentPrice: jest.fn(),
  instrumentPrices: {} as Record<string, InstrumentPriceResponse>,
  isMarketConnected: false,
  marketError: null as WebSocketError | Event | null
};

jest.mock('@/stores/sseStore', () => ({
  useSSEStore: jest.fn((selector) => {
    if (typeof selector === 'function') {
      return selector(mockStore);
    }
    return mockStore;
  })
}));

describe('useMarketSSE', () => {
  const mockInstrumentId = 'R_100';
  const mockPrice: InstrumentPriceResponse = {
    instrument_id: mockInstrumentId,
    bid: 1234.56,
    ask: 1234.78,
    timestamp: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.instrumentPrices = {};
    mockStore.isMarketConnected = false;
    mockStore.marketError = null;
  });

  it('should initialize market service and subscribe to price', () => {
    renderHook(() => useMarketSSE(mockInstrumentId));

    expect(mockStore.initializeMarketService).toHaveBeenCalled();
    expect(mockStore.subscribeToInstrumentPrice).toHaveBeenCalledWith(mockInstrumentId);
  });

  it('should unsubscribe on unmount', () => {
    const { unmount } = renderHook(() => useMarketSSE(mockInstrumentId));
    unmount();

    expect(mockStore.unsubscribeFromInstrumentPrice).toHaveBeenCalledWith(mockInstrumentId);
  });

  it('should call onPrice when price updates', () => {
    const onPrice = jest.fn();
    const { rerender } = renderHook(() => useMarketSSE(mockInstrumentId, { onPrice }));

    // Initially no price
    expect(onPrice).not.toHaveBeenCalled();

    // Simulate price update
    mockStore.instrumentPrices = { [mockInstrumentId]: mockPrice };
    rerender();

    expect(onPrice).toHaveBeenCalledWith(mockPrice);
  });

  it('should call onConnect and resubscribe when connection is established', () => {
    const onConnect = jest.fn();
    mockStore.isMarketConnected = false;

    const { rerender } = renderHook(() => useMarketSSE(mockInstrumentId, { onConnect }));

    // Initially not connected
    expect(onConnect).not.toHaveBeenCalled();
    expect(mockStore.subscribeToInstrumentPrice).toHaveBeenCalledTimes(1); // Initial subscription

    // Simulate connection established
    mockStore.isMarketConnected = true;
    rerender();

    expect(onConnect).toHaveBeenCalled();
    expect(mockStore.subscribeToInstrumentPrice).toHaveBeenCalledTimes(2); // Re-subscribed after connection
    expect(mockStore.subscribeToInstrumentPrice).toHaveBeenLastCalledWith(mockInstrumentId);
  });

  it('should call onDisconnect when connection is lost', () => {
    const onDisconnect = jest.fn();
    mockStore.isMarketConnected = true;

    const { rerender } = renderHook(() => useMarketSSE(mockInstrumentId, { onDisconnect }));

    // Initially connected
    expect(onDisconnect).not.toHaveBeenCalled();

    // Simulate connection lost
    mockStore.isMarketConnected = false;
    rerender();

    expect(onDisconnect).toHaveBeenCalled();
  });

  it('should call onError when WebSocketError occurs', () => {
    const onError = jest.fn();
    const mockError: WebSocketError = { error: 'Connection failed' };
    mockStore.marketError = mockError;

    renderHook(() => useMarketSSE(mockInstrumentId, { onError }));

    expect(onError).toHaveBeenCalledWith(mockError);
  });

  it('should call onError when Event error occurs', () => {
    const onError = jest.fn();
    const mockError = new Event('error');
    mockStore.marketError = mockError;

    renderHook(() => useMarketSSE(mockInstrumentId, { onError }));

    expect(onError).toHaveBeenCalledWith(mockError);
  });

  it('should return current price and connection state', () => {
    mockStore.instrumentPrices = { [mockInstrumentId]: mockPrice };
    mockStore.isMarketConnected = true;

    const { result } = renderHook(() => useMarketSSE(mockInstrumentId));

    expect(result.current).toEqual({
      price: mockPrice,
      isConnected: true,
      error: null
    });
  });

  it('should resubscribe when instrumentId changes', () => {
    const { rerender } = renderHook(
      ({ instrumentId }) => useMarketSSE(instrumentId),
      { initialProps: { instrumentId: mockInstrumentId } }
    );

    const newInstrumentId = 'R_50';
    rerender({ instrumentId: newInstrumentId });

    expect(mockStore.unsubscribeFromInstrumentPrice).toHaveBeenCalledWith(mockInstrumentId);
    expect(mockStore.subscribeToInstrumentPrice).toHaveBeenCalledWith(newInstrumentId);
  });
});
