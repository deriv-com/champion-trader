import { SSEService } from './service';
import { SSEOptions, SSEMessageMap, SSEMessage } from './types';
import { apiConfig } from '@/config/api';
import { CustomEventSource } from './custom-event-source';

export class ProtectedSSEService<T extends SSEMessageMap> extends SSEService<T> {
  private authToken: string;

  constructor(authToken: string, options: SSEOptions) {
    super(options);
    this.authToken = authToken;
  }

  protected getEndpoint(): string {
    return `${apiConfig.sse.baseUrl}${apiConfig.sse.protectedPath}`;
  }

  protected override createEventSource(endpoint: string): EventSource {
    return new CustomEventSource(endpoint, {
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    });
  }

  public updateAuthToken(token: string): void {
    this.authToken = token;
    if (this.eventSource) {
      // Reconnect with new token
      this.disconnect();
      this.connect();
    }
  }

  protected handleMessage(message: SSEMessage): void {
    const handlers = this.messageHandlers.get(message.action as keyof T);
    handlers?.forEach(handler => handler(message.data));
  }
}
