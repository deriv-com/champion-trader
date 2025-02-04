import { MarketSSEService } from '../market/service';
import { InstrumentPriceResponse } from '@/services/api/websocket/types';
import { apiConfig } from '@/config/api';

// Mock EventSource
class MockEventSource {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onopen: (() => void) | null = null;
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  close() {}
}

global.EventSource = MockEventSource as any;

describe('MarketSSEService', () => {
  let service: MarketSSEService;
  let mockEventSource: MockEventSource | null;

  beforeEach(() => {
    jest.useFakeTimers();
    service = new MarketSSEService();
    mockEventSource = null;
  });

  afterEach(() => {
    jest.useRealTimers();
    service.disconnect();
  });

  it('should handle connection states correctly', () => {
    const instrumentId = 'R_100';
    service.subscribeToPrice(instrumentId);
    mockEventSource = (service as any).eventSource;

    expect((service as any).isConnecting).toBe(true);

    if (mockEventSource?.onopen) {
      mockEventSource.onopen();
    }

    expect((service as any).isConnecting).toBe(false);
  });

  it('should subscribe to instrument price', () => {
    const instrumentId = 'R_100';
    service.subscribeToPrice(instrumentId);
    mockEventSource = (service as any).eventSource;

    const expectedUrl = new URL(`${apiConfig.sse.baseUrl}${apiConfig.sse.publicPath}`);
    expectedUrl.searchParams.append('action', 'instrument_price');
    expectedUrl.searchParams.append('instrument_id', instrumentId);

    expect(mockEventSource?.url).toBe(expectedUrl.toString());
  });

  it('should handle instrument price updates', () => {
    const mockHandler = jest.fn();
    const instrumentId = 'R_100';
    const mockPrice: InstrumentPriceResponse = {
      instrument_id: instrumentId,
      bid: 1234.56,
      ask: 1234.78,
      timestamp: new Date().toISOString()
    };

    service.on('instrument_price', mockHandler);
    service.subscribeToPrice(instrumentId);
    mockEventSource = (service as any).eventSource;

    if (mockEventSource?.onmessage) {
      mockEventSource.onmessage(new MessageEvent('message', {
        data: JSON.stringify({
          action: 'instrument_price',
          data: mockPrice
        })
      }));
    }

    expect(mockHandler).toHaveBeenCalledWith(mockPrice);
  });

  it('should handle parse errors', () => {
    const mockErrorHandler = jest.fn();
    const instrumentId = 'R_100';

    service.onError(mockErrorHandler);
    service.subscribeToPrice(instrumentId);
    mockEventSource = (service as any).eventSource;

    if (mockEventSource?.onmessage) {
      mockEventSource.onmessage(new MessageEvent('message', {
        data: 'invalid json'
      }));
    }

    expect(mockErrorHandler).toHaveBeenCalledWith({ error: 'Failed to parse SSE message' });
  });

  it('should unsubscribe from instrument price', () => {
    const instrumentId = 'R_100';
    const disconnectSpy = jest.spyOn(service, 'disconnect');

    service.subscribeToPrice(instrumentId);
    service.unsubscribeFromPrice(instrumentId);

    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('should handle multiple subscriptions', () => {
    const instrumentId1 = 'R_100';
    const instrumentId2 = 'R_50';

    service.subscribeToPrice(instrumentId1);
    service.subscribeToPrice(instrumentId2);
    mockEventSource = (service as any).eventSource;

    const expectedUrl = new URL(`${apiConfig.sse.baseUrl}${apiConfig.sse.publicPath}`);
    expectedUrl.searchParams.append('action', 'instrument_price');
    expectedUrl.searchParams.append('instrument_id', instrumentId1);
    expectedUrl.searchParams.append('instrument_id', instrumentId2);

    expect(mockEventSource?.url).toBe(expectedUrl.toString());
  });

  it('should reconnect with active subscriptions after error', () => {
    const instrumentId = 'R_100';
    const connectSpy = jest.spyOn(service, 'connect');
    const mockErrorHandler = jest.fn();
    service.onError(mockErrorHandler);

    service.subscribeToPrice(instrumentId);
    mockEventSource = (service as any).eventSource;

    // Initial connection
    expect((service as any).reconnectCount).toBe(0);

    // Trigger error to start reconnection
    if (mockEventSource?.onerror) {
      mockEventSource.onerror(new Event('error'));
    }

    // Verify error handler was called
    expect(mockErrorHandler).toHaveBeenCalledWith({ error: 'SSE connection error' });

    // Fast-forward timers to trigger reconnection
    jest.advanceTimersByTime(1000);

    // Verify reconnection attempt
    expect(connectSpy).toHaveBeenCalledTimes(1);

    // Verify subscription is maintained
    const expectedUrl = new URL(`${apiConfig.sse.baseUrl}${apiConfig.sse.publicPath}`);
    expectedUrl.searchParams.append('action', 'instrument_price');
    expectedUrl.searchParams.append('instrument_id', instrumentId);
    expect((service as any).eventSource.url).toBe(expectedUrl.toString());
  });

  it('should stop reconnection after max attempts', () => {
    const instrumentId = 'R_100';
    const mockErrorHandler = jest.fn();
    service.onError(mockErrorHandler);

    service.subscribeToPrice(instrumentId);
    mockEventSource = (service as any).eventSource;

    // Simulate max reconnection attempts
    for (let i = 0; i < 4; i++) {
      if (mockEventSource?.onerror) {
        mockEventSource.onerror(new Event('error'));
      }
      jest.advanceTimersByTime(1000);
    }

    // Verify final state
    expect((service as any).reconnectCount).toBe(0); // Should be reset after max attempts
    expect(mockErrorHandler).toHaveBeenLastCalledWith({
      error: 'SSE connection error'
    });
  });

  it('should reset reconnect count on successful connection', () => {
    const instrumentId = 'R_100';
    service.subscribeToPrice(instrumentId);
    mockEventSource = (service as any).eventSource;

    // Trigger error to start reconnection
    if (mockEventSource?.onerror) {
      mockEventSource.onerror(new Event('error'));
    }

    // Fast-forward timers to trigger reconnection
    jest.advanceTimersByTime(1000);

    // Simulate successful connection
    if (mockEventSource?.onopen) {
      mockEventSource.onopen();
    }

    expect((service as any).reconnectCount).toBe(0);
  });

  it('should maintain subscription list across reconnections', () => {
    const instrumentId1 = 'R_100';
    const instrumentId2 = 'R_50';

    service.subscribeToPrice(instrumentId1);
    service.subscribeToPrice(instrumentId2);
    mockEventSource = (service as any).eventSource;

    // Trigger error to start reconnection
    if (mockEventSource?.onerror) {
      mockEventSource.onerror(new Event('error'));
    }

    // Fast-forward timers to trigger reconnection
    jest.advanceTimersByTime(1000);

    // Verify subscriptions are maintained
    const expectedUrl = new URL(`${apiConfig.sse.baseUrl}${apiConfig.sse.publicPath}`);
    expectedUrl.searchParams.append('action', 'instrument_price');
    expectedUrl.searchParams.append('instrument_id', instrumentId1);
    expectedUrl.searchParams.append('instrument_id', instrumentId2);
    expect((service as any).eventSource.url).toBe(expectedUrl.toString());
  });
});
