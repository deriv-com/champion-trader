import { SSEService } from './service';
import { SSEOptions, SSEMessageMap, SSEMessage } from './types';
import { apiConfig } from '@/config/api';

export class PublicSSEService<T extends SSEMessageMap> extends SSEService<T> {
  constructor(options: SSEOptions) {
    super(options);
  }

  protected getEndpoint(): string {
    return `${apiConfig.sse.baseUrl}${apiConfig.sse.publicPath}`;
  }

  protected handleMessage(message: SSEMessage): void {
    const handlers = this.messageHandlers.get(message.action as keyof T);
    handlers?.forEach(handler => handler(message.data));
  }
}
