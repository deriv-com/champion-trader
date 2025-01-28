import { renderHook, act } from '@testing-library/react';
import { useWebSocket } from '../useWebSocket';
import { createWebSocketService } from '@/services/api/websocket';
import { WebSocketMessage, WebSocketRequest } from '@/services/api/types';

// Mock WebSocketService
jest.mock('@/services/api/websocket', () => {
  const mockService = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    send: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    stopAction: jest.fn(),
  };

  return {
    WebSocketService: jest.fn(() => mockService),
    createWebSocketService: jest.fn(() => mockService),
  };
});

describe('useWebSocket', () => {
  let mockService: ReturnType<typeof createWebSocketService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockService = createWebSocketService('test');
  });

  it('should connect on mount when autoConnect is true', () => {
    renderHook(() => useWebSocket({ service: mockService }));
    expect(mockService.connect).toHaveBeenCalled();
  });

  it('should not connect on mount when autoConnect is false', () => {
    renderHook(() => useWebSocket({ service: mockService, autoConnect: false }));
    expect(mockService.connect).not.toHaveBeenCalled();
  });

  it('should set up event listeners on mount', () => {
    renderHook(() => useWebSocket({ service: mockService }));
    expect(mockService.on).toHaveBeenCalledWith('open', expect.any(Function));
    expect(mockService.on).toHaveBeenCalledWith('close', expect.any(Function));
    expect(mockService.on).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mockService.on).toHaveBeenCalledWith('message', expect.any(Function));
  });

  it('should handle initial action on connect', () => {
    const initialAction: WebSocketRequest = {
      action: 'instrument_price',
      data: { symbol: 'BTCUSD' }
    };

    renderHook(() => useWebSocket({ service: mockService, initialAction }));

    // Get the open handler
    const openHandler = (mockService.on as jest.Mock).mock.calls.find(
      ([event]) => event === 'open'
    )?.[1];

    // Simulate connection open
    act(() => {
      openHandler();
    });

    expect(mockService.send).toHaveBeenCalledWith(initialAction);
  });

  it('should clean up on unmount', () => {
    const initialAction: WebSocketRequest = {
      action: 'instrument_price',
      data: { symbol: 'BTCUSD' }
    };

    const { unmount } = renderHook(() => useWebSocket({ 
      service: mockService,
      initialAction 
    }));
    
    unmount();

    expect(mockService.off).toHaveBeenCalledWith('open', expect.any(Function));
    expect(mockService.off).toHaveBeenCalledWith('close', expect.any(Function));
    expect(mockService.off).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mockService.off).toHaveBeenCalledWith('message', expect.any(Function));
    expect(mockService.stopAction).toHaveBeenCalledWith(initialAction.action);
    expect(mockService.disconnect).toHaveBeenCalled();
  });

  it('should handle message events', () => {
    const onMessage = jest.fn();
    const testMessage: WebSocketMessage = {
      action: 'instrument_price',
      data: { price: 100, symbol: 'BTCUSD', timestamp: '2025-01-28T12:00:00Z' }
    };

    let messageHandler: (event: MessageEvent) => void;
    (mockService.on as jest.Mock).mockImplementation((event, handler) => {
      if (event === 'message') {
        messageHandler = handler;
      }
    });

    renderHook(() => useWebSocket({ service: mockService, onMessage }));

    // Simulate message event
    act(() => {
      messageHandler(new MessageEvent('message', { data: JSON.stringify(testMessage) }));
    });

    expect(onMessage).toHaveBeenCalledWith(testMessage);
  });

  it('should handle connection state', () => {
    let openHandler: () => void;
    let closeHandler: () => void;

    (mockService.on as jest.Mock).mockImplementation((event, handler) => {
      if (event === 'open') openHandler = handler;
      if (event === 'close') closeHandler = handler;
    });

    const { result } = renderHook(() => useWebSocket({ service: mockService }));

    expect(result.current.isConnected).toBe(false);

    // Simulate connection open
    act(() => {
      openHandler();
    });
    expect(result.current.isConnected).toBe(true);

    // Simulate connection close
    act(() => {
      closeHandler();
    });
    expect(result.current.isConnected).toBe(false);
  });

  it('should provide send and stopAction functions', () => {
    const { result } = renderHook(() => useWebSocket({ service: mockService }));
    const testRequest: WebSocketRequest = {
      action: 'instrument_price',
      data: { symbol: 'BTCUSD' }
    };

    act(() => {
      result.current.send(testRequest);
    });
    expect(mockService.send).toHaveBeenCalledWith(testRequest);

    act(() => {
      result.current.stopAction('instrument_price');
    });
    expect(mockService.stopAction).toHaveBeenCalledWith('instrument_price');
  });
});
