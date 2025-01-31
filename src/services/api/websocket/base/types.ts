export type MessageHandler<T> = (data: T) => void;

export interface WebSocketOptions {
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  headers?: Record<string, string>;
}
