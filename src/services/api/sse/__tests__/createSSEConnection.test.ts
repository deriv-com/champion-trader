import { createSSEConnection } from '../createSSEConnection';
import { CustomEventSource } from '../custom-event-source';
import { apiConfig } from '@/config/api';

// Mock CustomEventSource
jest.mock('../custom-event-source');

describe('createSSEConnection', () => {
  let mockEventSource: jest.Mocked<CustomEventSource>;
  const mockOnMessage = jest.fn();
  const mockOnError = jest.fn();
  const mockOnOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockEventSource = new CustomEventSource('') as jest.Mocked<CustomEventSource>;
    (CustomEventSource as jest.Mock).mockImplementation(() => mockEventSource);
  });

  it('should create SSE connection with public path when no auth token', () => {
    createSSEConnection({
      params: {
        action: 'contract_price',
        duration: '5m',
        trade_type: 'CALL'
      },
      onMessage: mockOnMessage
    });

    expect(CustomEventSource).toHaveBeenCalledWith(
      expect.stringContaining(apiConfig.sse.publicPath),
      expect.any(Object)
    );
  });

  it('should create SSE connection with protected path when auth token present', () => {
    createSSEConnection({
      params: {
        action: 'contract_price',
        duration: '5m',
        trade_type: 'CALL'
      },
      headers: {
        'Authorization': 'Bearer token123'
      },
      onMessage: mockOnMessage
    });

    expect(CustomEventSource).toHaveBeenCalledWith(
      expect.stringContaining(apiConfig.sse.protectedPath),
      expect.any(Object)
    );
  });

  it('should handle SSE message data format correctly', () => {
    createSSEConnection({
      params: { action: 'contract_price' },
      onMessage: mockOnMessage
    });

    const mockData = {
      price: '5.36',
      trade_type: 'CALL'
    };

    // Test raw JSON message
    mockEventSource.onmessage?.({
      data: JSON.stringify(mockData)
    } as MessageEvent);

    expect(mockOnMessage).toHaveBeenCalledWith(mockData);

    // Test SSE format message
    mockEventSource.onmessage?.({
      data: `data: ${JSON.stringify(mockData)}`
    } as MessageEvent);

    expect(mockOnMessage).toHaveBeenCalledWith(mockData);
  });

  it('should attempt reconnection on error', () => {
    jest.useFakeTimers();

    createSSEConnection({
      params: { action: 'contract_price' },
      onMessage: mockOnMessage,
      onError: mockOnError,
      reconnectAttempts: 2,
      reconnectInterval: 1000
    });

    // Trigger error
    mockEventSource.onerror?.(new Event('error'));

    expect(mockOnError).toHaveBeenCalled();
    expect(mockEventSource.close).toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(CustomEventSource).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });

  it('should clean up connection on unmount', () => {
    const cleanup = createSSEConnection({
      params: { action: 'contract_price' },
      onMessage: mockOnMessage
    });

    cleanup();

    expect(mockEventSource.close).toHaveBeenCalled();
  });
});
