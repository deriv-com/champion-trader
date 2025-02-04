import { SSEService } from '../base/service';
import { SSEMessageMap, SSEMessage } from '../base/types';

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

interface TestMessageMap extends SSEMessageMap {
  'test_event': {
    request: { id: string };
    response: { data: string };
  };
}

class TestSSEService extends SSEService<TestMessageMap> {
  constructor() {
    super({
      reconnectAttempts: 3,
      reconnectInterval: 1000
    });
  }

  protected getEndpoint(): string {
    return 'http://test-api.com/sse';
  }

  protected handleMessage(message: SSEMessage): void {
    const handlers = this.messageHandlers.get(message.action as keyof TestMessageMap);
    handlers?.forEach(handler => handler(message.data));
  }

  // Expose protected methods for testing
  public exposeHandleMessage(message: SSEMessage): void {
    this.handleMessage(message);
  }

  public exposeHandleError(error: { error: string }): void {
    this.handleError(error);
  }

  public getConnectionState(): boolean {
    return this.isConnecting;
  }

  public getReconnectCount(): number {
    return this.reconnectCount;
  }
}

describe('SSEService', () => {
  let service: TestSSEService;
  let mockEventSource: MockEventSource;

  beforeEach(() => {
    jest.useFakeTimers();
    service = new TestSSEService();
    service.connect();
    mockEventSource = (service as any).eventSource;
  });

  afterEach(() => {
    jest.useRealTimers();
    service.disconnect();
  });

  it('should create EventSource with correct URL', () => {
    expect(mockEventSource.url).toBe('http://test-api.com/sse');
  });

  it('should handle connection states correctly', () => {
    expect(service.getConnectionState()).toBe(true);

    if (mockEventSource.onopen) {
      mockEventSource.onopen();
    }

    expect(service.getConnectionState()).toBe(false);
  });

  it('should handle message events', () => {
    const mockHandler = jest.fn();
    service.on('test_event', mockHandler);

    const mockMessage = {
      action: 'test_event',
      data: { data: 'test data' }
    };

    if (mockEventSource.onmessage) {
      mockEventSource.onmessage(new MessageEvent('message', {
        data: JSON.stringify(mockMessage)
      }));
    }

    expect(mockHandler).toHaveBeenCalledWith({ data: 'test data' });
  });

  it('should handle error events', () => {
    const mockErrorHandler = jest.fn();
    service.onError(mockErrorHandler);

    service.exposeHandleError({ error: 'Test error' });

    expect(mockErrorHandler).toHaveBeenCalledWith({ error: 'Test error' });
  });

  it('should handle parse errors', () => {
    const mockErrorHandler = jest.fn();
    service.onError(mockErrorHandler);

    if (mockEventSource.onmessage) {
      mockEventSource.onmessage(new MessageEvent('message', {
        data: 'invalid json'
      }));
    }

    expect(mockErrorHandler).toHaveBeenCalledWith({ error: 'Failed to parse SSE message' });
  });

  it('should remove message handlers', () => {
    const mockHandler = jest.fn();
    service.on('test_event', mockHandler);
    service.off('test_event', mockHandler);

    service.exposeHandleMessage({
      action: 'test_event',
      data: { data: 'test data' }
    });

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should remove error handlers', () => {
    const mockErrorHandler = jest.fn();
    service.onError(mockErrorHandler);
    service.offError(mockErrorHandler);

    service.exposeHandleError({ error: 'Test error' });

    expect(mockErrorHandler).not.toHaveBeenCalled();
  });

  it('should stop reconnection after max attempts', () => {
    const mockErrorHandler = jest.fn();
    service.onError(mockErrorHandler);

    // Simulate max reconnection attempts
    for (let i = 0; i < 4; i++) {
      if (mockEventSource.onerror) {
        mockEventSource.onerror(new Event('error'));
      }
      jest.advanceTimersByTime(1000);
    }

    // Verify final state
    expect(mockErrorHandler).toHaveBeenLastCalledWith({
      error: 'SSE connection error'
    });
  });

  it('should reset reconnect count on successful connection', () => {
    // Trigger error to start reconnection
    if (mockEventSource.onerror) {
      mockEventSource.onerror(new Event('error'));
    }

    // Fast-forward timers to trigger reconnection
    jest.advanceTimersByTime(1000);

    // Simulate successful connection
    if (mockEventSource.onopen) {
      mockEventSource.onopen();
    }

    expect(service.getReconnectCount()).toBe(0);
  });
});
