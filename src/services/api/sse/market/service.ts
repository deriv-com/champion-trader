import { PublicSSEService } from '../base/public';
import {
  SSEMessage,
  SSEMessageMap,
} from '@/services/api/sse/base/types';
import {
  InstrumentPriceRequest,
  InstrumentPriceResponse
} from '@/services/api/websocket/types';

interface MarketSSEMap extends SSEMessageMap {
  'instrument_price': {
    request: InstrumentPriceRequest;
    response: InstrumentPriceResponse;
  };
}

export class MarketSSEService extends PublicSSEService<MarketSSEMap> {
  private subscriptions = new Set<string>();

  constructor() {
    super({
      reconnectAttempts: 5,
      reconnectInterval: 5000,
    });
  }

  public subscribeToPrice(instrumentId: string): void {
    this.subscriptions.add(instrumentId);
    const url = new URL(this.getEndpoint());
    url.searchParams.append('instrument_id', instrumentId);
    
    // Close existing connection if any
    this.disconnect();
    
    // Create new EventSource with updated query parameters
    this.connect();
  }

  public unsubscribeFromPrice(instrumentId: string): void {
    this.subscriptions.delete(instrumentId);
    if (this.subscriptions.size === 0) {
      this.disconnect();
    } else {
      // Reconnect with remaining subscriptions
      this.disconnect();
      this.connect();
    }
  }

  protected handleMessage(message: SSEMessage): void {
    if (message.action === 'instrument_price') {
      const handlers = this.messageHandlers.get('instrument_price');
      handlers?.forEach(handler => handler(message.data as InstrumentPriceResponse));
    }
  }

  protected override getEndpoint(): string {
    const url = new URL(super.getEndpoint());
    // First append the action parameter
    url.searchParams.append("action", "instrument_price");

    // Then append all instrument IDs
    this.subscriptions.forEach(instrumentId => {
      url.searchParams.append('instrument_id', instrumentId);
    });

    return url.toString();
  }

  public override connect(): void {
    if (this.subscriptions.size === 0) {
      return;
    }
    super.connect();
  }
}
