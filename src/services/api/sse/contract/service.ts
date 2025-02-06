import { ProtectedSSEService } from "../base/protected";
import { SSEMessage, SSEMessageMap } from "@/services/api/sse/base/types";
import {
  ContractPriceRequest,
  ContractPriceResponse,
} from "@/services/api/websocket/types";

interface ContractSSEMap extends SSEMessageMap {
  contract_price: {
    request: ContractPriceRequest;
    response: ContractPriceResponse;
  };
}

export class ContractSSEService extends ProtectedSSEService<ContractSSEMap> {
  private activeContracts = new Map<string, ContractPriceRequest>();

  constructor(authToken: string) {
    super(authToken, {
      reconnectAttempts: 5,
      reconnectInterval: 5000,
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
    const handlers = this.messageHandlers.get("contract_price");
    handlers?.forEach((handler) =>
      handler(message as unknown as ContractPriceResponse)
    );
  }

  protected override getEndpoint(): string {
    const url = new URL(super.getEndpoint());
    // First append the action parameter
    url.searchParams.append("action", "contract_price");

    // Then append all contract parameters
    this.activeContracts.forEach((contract) => {
      Object.entries(contract).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
      });
    });

    return url.toString();
  }

  public override connect(): void {
    if (this.activeContracts.size === 0) {
      return;
    }
    super.connect();
  }

  private getContractKey(params: ContractPriceRequest): string {
    return JSON.stringify({
      duration: params.duration,
      instrument: params.instrument,
      trade_type: params.trade_type,
      payout: params.payout,
      strike: params.strike,
    });
  }
}
