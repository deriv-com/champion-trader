import { ProtectedSSEService } from '../base/protected';
import {
  SSEMessage,
  SSEMessageMap,
} from '@/services/api/sse/base/types';
import {
  ContractPriceRequest,
  ContractPriceResponse
} from '@/services/api/websocket/types';

interface ContractSSEMap extends SSEMessageMap {
  'contract_price': {
    request: ContractPriceRequest;
    response: ContractPriceResponse;
  };
}

export class ContractSSEService extends ProtectedSSEService<ContractSSEMap> {
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
    
    // Close existing connection if any
    this.disconnect();
    
    // Create new connection with contract parameters
    this.connect();
  }

  public cancelPrice(params: ContractPriceRequest): void {
    const key = this.getContractKey(params);
    this.activeContracts.delete(key);
    
    if (this.activeContracts.size === 0) {
      this.disconnect();
    } else {
      // Reconnect with remaining contracts
      this.disconnect();
      this.connect();
    }
  }

  protected handleMessage(message: SSEMessage): void {
    if (message.action === 'contract_price') {
      const handlers = this.messageHandlers.get('contract_price');
      handlers?.forEach(handler => handler(message.data as ContractPriceResponse));
    }
  }

  private setupEventHandlers(): void {
    if (!this.eventSource) return;

    this.eventSource.onopen = () => {
      this.isConnecting = false;
      this.reconnectCount = 0;
    };

    this.eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as SSEMessage;
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
        this.handleError({ error: 'Failed to parse SSE message' });
      }
    };

    this.eventSource.onerror = () => {
      this.isConnecting = false;
      this.handleError({ error: 'SSE connection error' });
      this.reconnect();
    };
  }

  public override connect(): void {
    if (this.eventSource || this.isConnecting || this.activeContracts.size === 0) {
      return;
    }

    this.isConnecting = true;
    const url = new URL(this.getEndpoint());
    // First append the action parameter
    url.searchParams.append("action", "contract_price");

    // Then append all contract parameters
    this.activeContracts.forEach(contract => {
      Object.entries(contract).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
      });
    });

    this.eventSource = new EventSource(url.toString());
    this.setupEventHandlers();
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
