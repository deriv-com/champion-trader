import { SSEService } from './service';
import { SSEOptions, SSEMessageMap, SSEMessage } from './types';
import { apiConfig } from '@/config/api';

export class ProtectedSSEService<T extends SSEMessageMap> extends SSEService<T> {
  private authToken: string;

  constructor(authToken: string, options: SSEOptions) {
    super(options);
    this.authToken = authToken;
  }

  protected getEndpoint(): string {
    const endpoint = `${apiConfig.sse.baseUrl}${apiConfig.sse.protectedPath}`;
    const url = new URL(endpoint);
    url.searchParams.append('token', this.authToken);
    return url.toString();
  }

  protected handleMessage(message: SSEMessage): void {
    const handlers = this.messageHandlers.get(message.action as keyof T);
    handlers?.forEach(handler => handler(message.data));
  }

  public updateAuthToken(token: string): void {
    this.authToken = token;
    if (this.eventSource) {
      // Reconnect with new token
      this.disconnect();
      this.connect();
    }
  }
}
