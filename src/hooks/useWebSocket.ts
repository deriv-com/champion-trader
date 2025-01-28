import { useEffect, useCallback, useState } from 'react';
import { WebSocketService } from '@/services/api/websocket';
import type { WebSocketMessage, WebSocketRequest, WebSocketAction } from '@/services/api/types';

interface UseWebSocketOptions {
  service: WebSocketService;
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  initialAction?: WebSocketRequest;
  autoConnect?: boolean;
}

export const useWebSocket = ({
  service,
  onMessage,
  onOpen,
  onClose,
  onError,
  initialAction,
  autoConnect = true,
}: UseWebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);

  const handleOpen = useCallback(() => {
    setIsConnected(true);
    if (initialAction) {
      service.send(initialAction);
    }
    onOpen?.();
  }, [onOpen, service, initialAction]);

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
    service.connect();
  }, [service]);

  const disconnect = useCallback(() => {
    service.disconnect();
  }, [service]);

  const send = useCallback((request: WebSocketRequest) => {
    service.send(request);
  }, [service]);

  const stopAction = useCallback((action: WebSocketAction) => {
    service.stopAction(action);
  }, [service]);

  // Set up event listeners and initial action
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    // Add event listeners
    service.on('open', handleOpen as any);
    service.on('close', handleClose as any);
    service.on('error', handleError as any);
    service.on('message', handleMessage as any);

    // Cleanup
    return () => {
      // Remove event listeners
      service.off('open', handleOpen as any);
      service.off('close', handleClose as any);
      service.off('error', handleError as any);
      service.off('message', handleMessage as any);

      if (initialAction) {
        service.stopAction(initialAction.action);
      }

      if (autoConnect) {
        disconnect();
      }
    };
  }, [
    service,
    autoConnect,
    connect,
    disconnect,
    handleClose,
    handleError,
    handleMessage,
    handleOpen,
    initialAction,
  ]);

  return {
    isConnected,
    connect,
    disconnect,
    send,
    stopAction,
  };
};
