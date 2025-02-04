# Server-Sent Events (SSE) Implementation

This directory contains the SSE implementation for real-time market and contract data streaming.

## Overview

The SSE implementation provides a more efficient, unidirectional streaming solution compared to WebSocket for our use case. It's particularly well-suited for our needs because:

1. We only need server-to-client communication
2. It automatically handles reconnection
3. It works better with HTTP/2 and load balancers
4. It has simpler implementation and maintenance

## Structure

```
src/services/api/sse/
├── base/
│   ├── service.ts     # Base SSE service with core functionality
│   ├── public.ts      # Public SSE service for unauthenticated endpoints
│   ├── protected.ts   # Protected SSE service for authenticated endpoints
│   └── types.ts       # Shared types for SSE implementation
├── market/
│   └── service.ts     # Market data streaming service
└── contract/
    └── service.ts     # Contract price streaming service
```

## Usage

### Market Data Streaming

```typescript
import { useMarketSSE } from '@/hooks/sse';

function MarketPriceComponent({ instrumentId }: { instrumentId: string }) {
  const { price, isConnected, error } = useMarketSSE(instrumentId, {
    onPrice: (price) => {
      console.log('New price:', price);
    },
    onError: (error) => {
      console.error('SSE error:', error);
    },
    onConnect: () => {
      console.log('Connected to market stream');
    },
    onDisconnect: () => {
      console.log('Disconnected from market stream');
    }
  });

  return (
    <div>
      {isConnected ? (
        <p>Current price: {price?.bid}</p>
      ) : (
        <p>Connecting...</p>
      )}
    </div>
  );
}
```

### Contract Price Streaming

```typescript
import { useContractSSE } from '@/hooks/sse';

function ContractPriceComponent({ params, authToken }: { params: ContractPriceRequest; authToken: string }) {
  const { price, isConnected, error } = useContractSSE(params, authToken, {
    onPrice: (price) => {
      console.log('New contract price:', price);
    },
    onError: (error) => {
      console.error('SSE error:', error);
    }
  });

  return (
    <div>
      {isConnected ? (
        <p>Contract price: {price?.price}</p>
      ) : (
        <p>Connecting...</p>
      )}
    </div>
  );
}
```

## State Management

The SSE implementation uses Zustand for state management. The store (`sseStore.ts`) handles:

- Connection state
- Price updates
- Error handling
- Service initialization
- Subscription management

## Error Handling

The SSE implementation includes robust error handling:

1. Automatic reconnection attempts
2. Error event handling
3. Connection state tracking
4. Typed error responses

## Configuration

SSE endpoints are configured in `src/config/api.ts`. The configuration includes:

- Base URL
- Public path
- Protected path
- Environment-specific settings

### Required Parameters

All SSE endpoints require an `action` parameter that specifies the type of data stream:

1. Market Data Stream:
   ```
   ?action=instrument_price&instrument_id=R_100
   ```

2. Contract Price Stream:
   ```
   ?action=contract_price&duration=1m&instrument=frxEURUSD&trade_type=CALL&currency=USD&payout=100
   ```

The action parameter determines how the server should process and stream the data:
- `instrument_price`: For market data streaming (public)
- `contract_price`: For contract price streaming (protected)

## Benefits Over WebSocket

1. **Simpler Protocol**: SSE is built on HTTP and is simpler to implement and maintain
2. **Automatic Reconnection**: Built-in reconnection handling
3. **Better Load Balancing**: Works well with HTTP/2 and standard load balancers
4. **Lower Overhead**: No need for ping/pong messages or connection heartbeats
5. **Firewall Friendly**: Uses standard HTTP port 80/443

## Migration Notes

When migrating from WebSocket to SSE:

1. Update API endpoints to use SSE endpoints
2. Replace WebSocket hooks with SSE hooks
3. Update components to use new SSE hooks
4. Test reconnection and error handling
5. Verify real-time updates are working as expected
