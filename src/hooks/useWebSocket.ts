import { useEffect, useCallback, useState } from 'react';
import { websocketService } from '@/services/api/websocket';
import type { WebSocketMessage, WebSocketSubscription } from '@/services/api/types';

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  subscriptions?: WebSocketSubscription[];
  autoConnect?: boolean;
}

export const useWebSocket = ({
  onMessage,
  onOpen,
  onClose,
  onError,
  subscriptions = [],
  autoConnect = true,
}: UseWebSocketOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);

  const handleOpen = useCallback(() => {
    setIsConnected(true);
    onOpen?.();
  }, [onOpen]);

  const handleClose = useCallback(() => {
    setIsConnected(false);
    onClose?.();
  }, [onClose]);

  const handleError = useCallback(
    (event: Event) => {
      onError?.(event);
    },
    [onError]
  );

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (onMessage && event.data) {
        try {
          const message =
            typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          onMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      }
    },
    [onMessage]
  );

  const connect = useCallback(() => {
    websocketService.connect();
  }, []);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
  }, []);

  const send = useCallback((message: WebSocketMessage) => {
    websocketService.send(message);
  }, []);

  // Set up event listeners and subscriptions
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    // Add event listeners
    websocketService.on('open', handleOpen as any);
    websocketService.on('close', handleClose as any);
    websocketService.on('error', handleError as any);
    websocketService.on('message', handleMessage as any);

    // Set up subscriptions
    subscriptions.forEach((subscription) => {
      websocketService.subscribe(subscription);
    });

    // Cleanup
    return () => {
      // Remove event listeners
      websocketService.off('open', handleOpen as any);
      websocketService.off('close', handleClose as any);
      websocketService.off('error', handleError as any);
      websocketService.off('message', handleMessage as any);

      // Unsubscribe
      subscriptions.forEach((subscription) => {
        websocketService.unsubscribe(subscription);
      });

      if (autoConnect) {
        disconnect();
      }
    };
  }, [
    autoConnect,
    connect,
    disconnect,
    handleClose,
    handleError,
    handleMessage,
    handleOpen,
    subscriptions,
  ]);

  return {
    isConnected,
    connect,
    disconnect,
    send,
  };
};
