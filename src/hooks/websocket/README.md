# WebSocket Hooks

This directory contains React hooks for WebSocket integration, providing real-time market data and contract pricing functionality.

## Hook Organization

```
websocket/
├── index.ts                    # Public exports
├── useMarketWebSocket.ts      # Market data hook
├── useContractWebSocket.ts    # Contract pricing hook
└── __tests__/                # Hook tests
```

## Available Hooks

### useMarketWebSocket

Subscribe to real-time market data:

```typescript
import { useMarketWebSocket } from '@/hooks/websocket';

interface MarketHookOptions {
  onPrice?: (price: Price) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

function PriceDisplay({ instrumentId }: { instrumentId: string }) {
  const { price, isConnected } = useMarketWebSocket(instrumentId, {
    onPrice: (price) => {
      console.log('New price:', price);
    },
    onConnect: () => {
      console.log('Connected to market feed');
    }
  });

  return (
    <div>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      <div>Bid: {price?.bid}</div>
      <div>Ask: {price?.ask}</div>
    </div>
  );
}
```

### useContractWebSocket

Subscribe to real-time contract pricing:

```typescript
import { useContractWebSocket } from '@/hooks/websocket';

interface ContractHookOptions {
  onPrice?: (price: ContractPrice) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

function ContractPricing({ request, authToken }: { request: ContractRequest; authToken: string }) {
  const { price, isConnected } = useContractWebSocket(request, authToken, {
    onPrice: (price) => {
      console.log('New contract price:', price);
    }
  });

  return (
    <div>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      <div>Price: {price?.price}</div>
      <div>Spot: {price?.spot}</div>
    </div>
  );
}
```

## Implementation Details

The hooks use the WebSocket services and store:

```typescript
import { useEffect } from 'react';
import { useWebSocketStore } from '@/stores/websocketStore';

export function useMarketWebSocket(instrumentId: string, options?: MarketHookOptions) {
  const store = useWebSocketStore();

  useEffect(() => {
    // Subscribe to market data
    return () => {
      // Cleanup subscription
    };
  }, [instrumentId]);

  return {
    price: store.instrumentPrices[instrumentId],
    isConnected: store.isMarketConnected
  };
}
```

## Testing

Hooks are tested using React Testing Library:

```typescript
import { renderHook } from '@testing-library/react';
import { useMarketWebSocket } from '../useMarketWebSocket';

describe('useMarketWebSocket', () => {
  it('should subscribe to market data', () => {
    const { result } = renderHook(() => 
      useMarketWebSocket('BTCUSD')
    );

    expect(result.current.isConnected).toBe(false);
    // Test connection and data updates
  });
});
```

## Best Practices

1. **Connection Management**
   - Handle connection lifecycle properly
   - Implement automatic reconnection
   - Clean up subscriptions on unmount

2. **State Updates**
   - Use the WebSocket store for state
   - Handle race conditions
   - Implement proper error boundaries

3. **Performance**
   - Optimize re-renders
   - Use selective subscriptions
   - Clean up unused connections

4. **Error Handling**
   - Provide error callbacks
   - Handle connection failures
   - Implement retry logic

## Usage Guidelines

1. **Hook Setup**
   ```typescript
   function Component() {
     const { price, isConnected } = useMarketWebSocket('BTCUSD', {
       onPrice: handlePrice,
       onError: handleError
     });
   }
   ```

2. **Error Handling**
   ```typescript
   const handleError = (error: Error) => {
     console.error('WebSocket error:', error);
     // Implement error UI
   };
   ```

3. **Cleanup**
   ```typescript
   useEffect(() => {
     // Setup
     return () => {
       // Cleanup subscriptions
     };
   }, []);
   ```

4. **Multiple Subscriptions**
   ```typescript
   function MultiPrice({ instruments }: { instruments: string[] }) {
     const subscriptions = instruments.map(id => 
       useMarketWebSocket(id)
     );
     
     return (
       <div>
         {subscriptions.map(({ price, isConnected }, index) => (
           <PriceDisplay 
             key={instruments[index]}
             price={price}
             isConnected={isConnected}
           />
         ))}
       </div>
     );
   }
