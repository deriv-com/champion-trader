export interface SSEOptions {
  reconnectAttempts: number;
  reconnectInterval: number;
}

export interface SSEError {
  error: string;
}

export type SSEMessageHandler<T = any> = (data: T) => void;
export type SSEErrorHandler = (error: SSEError) => void;

export interface SSEMessageMap {
  [key: string]: {
    request?: any;
    response: any;
  };
  'open': {
    response: Record<string, never>;
  };
}

export interface SSEMessage {
  action: string;
  data: any;
}
