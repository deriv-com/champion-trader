import { ProtectedWebSocketService } from '../base/protected';
import {
  WebSocketMessage,
  WebSocketMessageMap,
  ContractPriceRequest,
  ContractPriceResponse
} from '@/services/api/websocket/types';

interface ContractWebSocketMap extends WebSocketMessageMap {
  'contract_price': {
    request: ContractPriceRequest;
    response: ContractPriceResponse;
  };
}

export class ContractWebSocketService extends ProtectedWebSocketService<ContractWebSocketMap> {
  private activeContracts = new Map<string, ContractPriceRequest>();

  constructor(authToken: string) {
    super(authToken, {
      reconnectAttempts: 5,
      reconnectInterval: 5000
    });
  }

  public requestPrice(params: ContractPriceRequest): void {
    const key = this.getContractKey(params);
    this.activeContracts.set(key, params);
    this.send('contract_price', params);
  }

  public cancelPrice(params: ContractPriceRequest): void {
    const key = this.getContractKey(params);
    this.activeContracts.delete(key);
    // Note: Server should handle cleanup when connection is closed
  }

  protected handleMessage(message: WebSocketMessage): void {
    if (message.action === 'contract_price') {
      const handlers = this.messageHandlers.get('contract_price');
      handlers?.forEach(handler => handler(message.data as ContractPriceResponse));
    }
  }

  public override connect(): void {
    super.connect();
    // Resubscribe to all active contracts after reconnect
    this.activeContracts.forEach(params => {
      this.requestPrice(params);
    });
  }

  private getContractKey(params: ContractPriceRequest): string {
    return JSON.stringify({
      duration: params.duration,
      instrument: params.instrument,
      trade_type: params.trade_type,
      payout: params.payout,
      strike: params.strike
    });
  }
}
