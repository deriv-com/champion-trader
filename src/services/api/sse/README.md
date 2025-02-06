# Server-Sent Events (SSE) Services

This directory contains services that handle real-time data streaming using Server-Sent Events (SSE). SSE provides a more efficient, unidirectional communication channel compared to WebSocket connections, with built-in reconnection handling and better compatibility with modern load balancers.

## Contract SSE Service

The ContractSSEService handles real-time contract price updates through SSE connections.

### Features

- Automatic reconnection with exponential backoff
- Maintains active contract subscriptions across reconnections
- Robust error handling and parsing
- Auth token management
- Event-based architecture for price updates

### Message Format

Contract price updates follow this format:

```typescript
interface ContractPriceMessage {
  action: 'contract_price';
  data: {
    date_start: number;      // Unix timestamp in milliseconds
    date_expiry: number;     // Unix timestamp in milliseconds
    spot: string;            // Current spot price
    strike: string;          // Strike price
    price: string;           // Contract price
    trade_type: string;      // e.g., 'CALL', 'PUT'
    instrument: string;      // e.g., 'R_100'
    currency: string;        // e.g., 'USD'
    payout: string;          // Payout amount
    pricing_parameters: {
      volatility: string;
      duration_in_years: string;
    }
  }
}
```

### Testing

The service is thoroughly tested with Jest:

- Connection state management
- Price update handling
- Error scenarios and recovery
- Auth token updates
- Multiple contract handling
- Reconnection behavior

See `__tests__/contract.test.ts` for comprehensive test examples.

### Usage

```typescript
import { ContractSSEService } from './contract/service';

// Initialize with auth token
const service = new ContractSSEService('your-auth-token');

// Subscribe to price updates
service.on('contract_price', (message) => {
  console.log('Received price update:', message);
});

// Handle errors
service.onError((error) => {
  console.error('SSE error:', error);
});

// Request contract price
service.requestPrice({
  duration: '1m',
  instrument: 'R_100',
  trade_type: 'CALL',
  currency: 'USD',
  payout: '100',
  strike: '1234.56'
});

// Cancel price subscription
service.cancelPrice(request);

// Update auth token
service.updateAuthToken('new-token');

// Disconnect when done
service.disconnect();
```

## Market SSE Service

[Documentation for MarketSSEService to be added...]
