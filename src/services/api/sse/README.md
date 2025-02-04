# Server-Sent Events (SSE) Services

This folder contains the SSE service implementations that power real-time data streaming for market and contract price updates. These services provide a robust, unidirectional channel from the server to the client—offering automatic reconnection, error handling, and type-safe messaging.

## Folder Structure

```
src/services/api/sse/
├── base/           
│   ├── service.ts    # Core service functionality for establishing SSE connections
│   ├── public.ts     # Service for unauthenticated (public) SSE endpoints
│   ├── protected.ts  # Service for authenticated (protected) SSE endpoints
│   └── types.ts      # Shared type definitions for SSE messages and events
├── market/          
│   └── service.ts    # SSE service for streaming market data
└── contract/        
    └── service.ts    # SSE service for streaming contract pricing data
```

## Overview

The SSE services enable efficient, real-time streaming by:
- Maintaining persistent HTTP connections with automatic reconnection logic.
- Supporting both public and protected endpoints for secure data streaming.
- Providing type-safe communication through clearly defined message types.
- Offering a modular design to easily integrate with various parts of the application.

## Configuration

SSE endpoint URLs and other relevant settings are configured in the main configuration file ([src/config/api.ts](../../config/api.ts)). Ensure that your environment variables (such as `RSBUILD_SSE_PUBLIC_PATH` and `RSBUILD_SSE_PROTECTED_PATH`) are set correctly for proper operation.

## Usage Example

Each SSE service requires an `action` parameter that determines the type of data stream:

### Market SSE Service

```typescript
import { MarketSSEService } from '@/services/api/sse/market/service';

const marketService = new MarketSSEService();

// Subscribe to real-time market updates
// This will create an SSE connection with ?action=instrument_price
marketService.subscribeToPrice('R_100');

// The service will handle the action parameter internally
marketService.on('instrument_price', (data) => {
  console.log('New market data received:', data);
});

// To unsubscribe or clean up
marketService.unsubscribeFromPrice('R_100');
```

### Contract SSE Service

```typescript
import { ContractSSEService } from '@/services/api/sse/contract/service';

const contractService = new ContractSSEService('your-auth-token');

// Request contract price updates
// This will create an SSE connection with ?action=contract_price
contractService.requestPrice({
  duration: '1m',
  instrument: 'frxEURUSD',
  trade_type: 'CALL',
  currency: 'USD',
  payout: '100'
});

// The service will handle the action parameter internally
contractService.on('contract_price', (data) => {
  console.log('New contract price:', data);
});

// To cancel the subscription
contractService.cancelPrice(params);
```

## Features

- **Action-Based Routing:** Each SSE connection requires an action parameter:
  - `instrument_price`: For market data streaming (public endpoint)
  - `contract_price`: For contract price streaming (protected endpoint)
- **Automatic Reconnection:** Seamlessly re-establish connections on interruptions.
- **Secure Endpoints:** Distinguish between public and protected data streams.
- **Type Safety:** Leverage TypeScript for strongly typed event handling.
- **Modular Design:** Each service is encapsulated, making it easy to extend or update.

## Error Handling

Each SSE service implements robust error handling:
- Capturing network or streaming errors.
- Providing callbacks for error events.
- Allowing for retries based on configurable parameters.
