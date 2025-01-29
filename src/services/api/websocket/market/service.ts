import { PublicWebSocketService } from '../base/public';
import { 
  WebSocketMessage,
  WebSocketMessageMap,
  InstrumentPriceRequest,
  InstrumentPriceResponse
} from '@/services/api/websocket/types';

interface MarketWebSocketMap extends WebSocketMessageMap {
  'instrument_price': {
    request: InstrumentPriceRequest;
    response: InstrumentPriceResponse;
  };
}

export class MarketWebSocketService extends PublicWebSocketService<MarketWebSocketMap> {
  private subscriptions = new Set<string>();

  constructor() {
    super({
      reconnectAttempts: 5,
      reconnectInterval: 5000,
    });
  }

  public subscribeToPrice(instrumentId: string): void {
    this.subscriptions.add(instrumentId);
    this.send('instrument_price', { instrument_id: instrumentId });
  }

  public unsubscribeFromPrice(instrumentId: string): void {
    this.subscriptions.delete(instrumentId);
    // Note: Server should handle cleanup when connection is closed
  }

  protected handleMessage(message: WebSocketMessage): void {
    if (message.action === 'instrument_price') {
      const handlers = this.messageHandlers.get('instrument_price');
      handlers?.forEach(handler => handler(message.data as InstrumentPriceResponse));
    }
  }

  public override connect(): void {
    super.connect();
    // Resubscribe to all instruments after reconnect
    this.subscriptions.forEach(instrumentId => {
      this.subscribeToPrice(instrumentId);
    });
  }
}
