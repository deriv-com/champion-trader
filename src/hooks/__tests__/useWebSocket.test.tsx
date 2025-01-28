import { renderHook, act } from '@testing-library/react';
import { useWebSocket } from '../useWebSocket';
import { websocketService } from '@/services/api/websocket';
import { WebSocketMessage, WebSocketSubscription } from '@/services/api/types';

// Mock websocketService
jest.mock('@/services/api/websocket', () => ({
  websocketService: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    send: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  },
}));

describe('useWebSocket', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should connect on mount when autoConnect is true', () => {
    renderHook(() => useWebSocket());
    expect(websocketService.connect).toHaveBeenCalled();
  });

  it('should not connect on mount when autoConnect is false', () => {
    renderHook(() => useWebSocket({ autoConnect: false }));
    expect(websocketService.connect).not.toHaveBeenCalled();
  });

  it('should set up event listeners on mount', () => {
    renderHook(() => useWebSocket());
    expect(websocketService.on).toHaveBeenCalledWith('open', expect.any(Function));
    expect(websocketService.on).toHaveBeenCalledWith('close', expect.any(Function));
    expect(websocketService.on).toHaveBeenCalledWith('error', expect.any(Function));
    expect(websocketService.on).toHaveBeenCalledWith('message', expect.any(Function));
  });

  it('should handle subscriptions', () => {
    const subscriptions: WebSocketSubscription[] = [
      { type: 'subscribe', channel: 'price', symbol: 'BTCUSD' },
    ];

    renderHook(() => useWebSocket({ subscriptions }));
    expect(websocketService.subscribe).toHaveBeenCalledWith(subscriptions[0]);
  });

  it('should clean up on unmount', () => {
    const subscriptions: WebSocketSubscription[] = [
      { type: 'subscribe', channel: 'price', symbol: 'BTCUSD' },
    ];

    const { unmount } = renderHook(() => useWebSocket({ subscriptions }));
    unmount();

    expect(websocketService.off).toHaveBeenCalledWith('open', expect.any(Function));
    expect(websocketService.off).toHaveBeenCalledWith('close', expect.any(Function));
    expect(websocketService.off).toHaveBeenCalledWith('error', expect.any(Function));
    expect(websocketService.off).toHaveBeenCalledWith('message', expect.any(Function));
    expect(websocketService.unsubscribe).toHaveBeenCalledWith(subscriptions[0]);
    expect(websocketService.disconnect).toHaveBeenCalled();
  });

  it('should handle message events', () => {
    const onMessage = jest.fn();
    const testMessage: WebSocketMessage = {
      type: 'price',
      data: { price: 100 },
    };

    let messageHandler: (event: MessageEvent) => void;
    (websocketService.on as jest.Mock).mockImplementation((event, handler) => {
      if (event === 'message') {
        messageHandler = handler;
      }
    });

    renderHook(() => useWebSocket({ onMessage }));

    // Simulate message event
    act(() => {
      messageHandler(new MessageEvent('message', { data: JSON.stringify(testMessage) }));
    });

    expect(onMessage).toHaveBeenCalledWith(testMessage);
  });

  it('should handle connection state', () => {
    let openHandler: () => void;
    let closeHandler: () => void;

    (websocketService.on as jest.Mock).mockImplementation((event, handler) => {
      if (event === 'open') openHandler = handler;
      if (event === 'close') closeHandler = handler;
    });

    const { result } = renderHook(() => useWebSocket());

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

  it('should provide send function', () => {
    const { result } = renderHook(() => useWebSocket());
    const testMessage: WebSocketMessage = {
      type: 'price',
      data: { price: 100 },
    };

    act(() => {
      result.current.send(testMessage);
    });

    expect(websocketService.send).toHaveBeenCalledWith(testMessage);
  });
});
