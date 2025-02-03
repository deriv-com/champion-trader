# WebSocket Architecture

This directory contains the WebSocket implementation for real-time market data and contract pricing. The architecture is designed to be modular, type-safe, and easy to test.

## Structure

```
websocket/
├── base/
│   ├── service.ts       # Base WebSocket service with common functionality
│   ├── public.ts        # Public WebSocket service for unauthenticated endpoints
│   ├── protected.ts     # Protected WebSocket service for authenticated endpoints
│   └── types.ts         # Common WebSocket types
├── market/
│   └── service.ts       # Market data WebSocket service
├── contract/
│   └── service.ts       # Contract pricing WebSocket service
└── index.ts            # Public API exports
```

## Configuration

The WebSocket services use environment-specific configuration from `src/config/api.ts` which gets its values from our centralized environment module `src/config/env.ts`:

```typescript
// src/config/env.ts
export const env = {
  WS_URL: process.env.RSBUILD_WS_URL,
  WS_PUBLIC_PATH: process.env.RSBUILD_WS_PUBLIC_PATH,
  WS_PROTECTED_PATH: process.env.RSBUILD_WS_PROTECTED_PATH,
  REST_URL: process.env.RSBUILD_REST_URL,
  MODE: process.env.NODE_ENV || 'development'
} as const;

// src/config/api.ts
interface ApiConfig {
  ws: {
    baseUrl: string;
    publicPath: string;
    protectedPath: string;
  };
  rest: {
    baseUrl: string;
  };
}

// Environment-specific configurations
const config = {
  development: {
    ws: {
      baseUrl: env.WS_URL || 'ws://localhost:8080',
      publicPath: env.WS_PUBLIC_PATH || '/ws',
      protectedPath: env.WS_PROTECTED_PATH || '/ws'
    },
    rest: {
      baseUrl: env.REST_URL || 'http://localhost:8080'
    }
  },
  staging: {
    ws: {
      baseUrl: env.WS_URL || 'wss://staging-api.deriv.com',
      publicPath: env.WS_PUBLIC_PATH || '/ws',
      protectedPath: env.WS_PROTECTED_PATH || '/ws'
    },
    rest: {
      baseUrl: env.REST_URL || 'https://staging-api.deriv.com'
    }
  },
  production: {
    ws: {
      baseUrl: env.WS_URL || 'wss://api.deriv.com',
      publicPath: env.WS_PUBLIC_PATH || '/ws',
      protectedPath: env.WS_PROTECTED_PATH || '/ws'
    },
    rest: {
      baseUrl: env.REST_URL || 'https://api.deriv.com'
    }
  }
};
```

These configurations can be overridden using environment variables:
- RSBUILD_WS_URL - WebSocket server URL
- RSBUILD_WS_PUBLIC_PATH - Public WebSocket endpoint path
- RSBUILD_WS_PROTECTED_PATH - Protected WebSocket endpoint path
- RSBUILD_REST_URL - REST API server URL

## State Management

The WebSocket connections are managed through a centralized Zustand store that ensures:
- Single WebSocket instance per service type (market/contract)
- Shared state across components
- Automatic cleanup and reconnection

```typescript
import { useWebSocketStore } from '@/stores/websocketStore';

// Access the store in components
const { 
  instrumentPrices,
  contractPrices,
  isMarketConnected,
  isContractConnected
} = useWebSocketStore();
```

## Services

### Base Service

The base WebSocket service provides common functionality:
- Connection management
- Automatic reconnection
- Event handling
- Message type safety
- Environment-specific configuration
- Authentication handling for protected endpoints

```typescript
import { BaseWebSocketService } from '@/services/api/websocket';

class CustomService extends BaseWebSocketService<CustomMessageMap> {
  // Implementation
}
```

### Public Service

For endpoints that don't require authentication:

```typescript
import { PublicWebSocketService } from '@/services/api/websocket';

class CustomPublicService extends PublicWebSocketService<CustomMessageMap> {
  // Implementation
}
```

### Protected Service

For endpoints that require authentication:

```typescript
import { ProtectedWebSocketService } from '@/services/api/websocket';

class CustomProtectedService extends ProtectedWebSocketService<CustomMessageMap> {
  constructor(authToken: string) {
    super(authToken, {
      // Optional WebSocket options
      reconnectAttempts: 5,
      reconnectInterval: 5000
    });
  }
}
```

The authentication token is automatically handled by the service:
1. The token is passed to the ProtectedWebSocketService constructor
2. The service adds it to the request headers: `Authorization: Bearer <token>`
3. The base service passes the token in the WebSocket handshake via the Authorization header
4. The server validates the token and establishes the authenticated connection

Note: The WebSocket connection uses the standard Authorization header mechanism, ensuring secure token transmission during the WebSocket handshake.

## React Hooks

### Market WebSocket Hook

For subscribing to real-time market data:

```typescript
import { useMarketWebSocket } from '@/hooks/websocket';

function PriceDisplay({ instrumentId }: { instrumentId: string }) {
  const { price, isConnected } = useMarketWebSocket(instrumentId, {
    // Handle real-time price updates
    onPrice: (price) => {
      // Process new price data
    },
    // Handle connection state changes
    onConnect: () => {
      // Connection established
    },
    onDisconnect: () => {
      // Connection lost
    },
    // Handle any errors
    onError: (error) => {
      // Process error
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

### Contract WebSocket Hook

For subscribing to real-time contract pricing:

```typescript
import { useContractWebSocket } from '@/hooks/websocket';

function ContractPricing({ request, authToken }: { request: ContractPriceRequest; authToken: string }) {
  const { price, isConnected } = useContractWebSocket(request, authToken, {
    // Handle real-time price updates
    onPrice: (price) => {
      // Process new price data
    },
    // Handle connection state changes
    onConnect: () => {
      // Connection established
    },
    onDisconnect: () => {
      // Connection lost
    },
    // Handle any errors
    onError: (error) => {
      // Process error
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

## Features

- **Centralized State**: Single source of truth using Zustand store
- **Singleton WebSocket**: One WebSocket connection per service type
- **Type Safety**: Full TypeScript support with message type checking
- **Automatic Reconnection**: Configurable retry attempts and intervals
- **Authentication**: Token-based auth with proper header handling
- **Event Handling**: Strongly typed event handlers
- **React Integration**: Custom hooks for easy integration with React components
- **Testing**: Comprehensive test suite with mocked WebSocket functionality
- **Environment Support**: Configuration for development, staging, and production

## Best Practices

1. **State Management**:
   - Use the Zustand store for accessing WebSocket state
   - Don't create WebSocket instances directly, use the store's actions
   - Share WebSocket connections across components

2. **Error Handling**:
   - Always provide error handlers to catch and log WebSocket errors
   - Use the onError callback in hooks to handle errors at the component level

3. **Cleanup**:
   - The hooks automatically handle cleanup on unmount
   - Unsubscribe from specific data streams when no longer needed

4. **Authentication**:
   - Use ProtectedWebSocketService for authenticated endpoints
   - Pass auth tokens through the constructor, not directly to WebSocket
   - Let the service handle the token formatting and headers

5. **Performance**:
   - Subscribe only when necessary
   - Unsubscribe when data is no longer needed
   - Leverage the shared WebSocket connections

## Testing

The WebSocket services, hooks, and store are thoroughly tested:

```typescript
import { renderHook } from '@testing-library/react';
import { useMarketWebSocket } from '@/hooks/websocket';
import { useWebSocketStore } from '@/stores/websocketStore';

describe('useMarketWebSocket', () => {
  it('should connect and subscribe', () => {
    const { result } = renderHook(() => useMarketWebSocket('BTCUSD'));
    expect(result.current.isConnected).toBe(false);
    
    // Simulate connection
    const store = useWebSocketStore.getState();
    store.initializeMarketService();
    expect(result.current.isConnected).toBe(true);
  });
});
