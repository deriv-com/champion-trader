# SSE Service

A simple Server-Sent Events (SSE) implementation for real-time data streaming.

## Usage

```typescript
import { createSSEConnection } from '@/services/api/sse/createSSEConnection';

// In your component
useEffect(() => {
  const cleanup = createSSEConnection({
    params: {
      action: 'contract_price',
      duration: '5m',
      trade_type: 'CALL',
      instrument: 'R_100',
      currency: 'USD',
      payout: '10'
    },
    headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
    onMessage: (data) => {
      console.log('Received price update:', data);
    },
    onError: (error) => {
      console.error('SSE error:', error);
    }
  });

  return cleanup;
}, [/* dependencies */]);
```

## Features

- Automatic endpoint selection (protected/public) based on token presence
- Automatic reconnection with configurable attempts and interval
- SSE data format parsing
- TypeScript support with contract price request/response types
- Clean connection teardown on unmount

## API

### createSSEConnection

Creates an SSE connection with the specified options.

```typescript
interface SSEOptions {
  params: Record<string, string>;        // Query parameters
  headers?: Record<string, string>;      // Optional headers (e.g., auth token)
  onMessage: (data: T) => void;          // Message handler
  onError?: (error: any) => void;        // Error handler
  onOpen?: () => void;                   // Connection open handler
  reconnectAttempts?: number;            // Max reconnection attempts (default: 3)
  reconnectInterval?: number;            // Reconnection interval in ms (default: 1000)
}

function createSSEConnection(options: SSEOptions): () => void;
```

Returns a cleanup function that closes the connection when called.

## Implementation Details

The service uses a custom EventSource implementation that:
- Supports custom headers (unlike native EventSource)
- Handles SSE data format parsing
- Manages connection state
- Provides automatic reconnection
- Uses the API config for endpoints
