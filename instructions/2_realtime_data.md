# Real-Time Data Communication Specification

## SSE Architecture Overview
The Champion Trader platform uses Server-Sent Events (SSE) for real-time data streaming. This provides efficient unidirectional communication for market price updates, contract price streaming, and position updates.

## Connection Management
The SSE implementation is based on the `createSSEConnection` function in `src/services/api/sse/createSSEConnection.ts`. This function:
- Creates and manages EventSource connections
- Handles connection lifecycle (open, message, error, close)
- Provides a clean teardown mechanism
- Supports both protected and public endpoints

## Message Format
SSE messages follow a standard format:
- Messages are sent as JSON strings
- Each message contains a data payload with price information
- Messages are parsed and typed using TypeScript interfaces
- The `ContractPriceResponse` interface defines the structure of price updates

## Reconnection Strategy
The SSE implementation includes a robust reconnection strategy:
- Automatic reconnection on connection loss
- Configurable reconnection attempts (default: 3)
- Configurable reconnection interval (default: 1000ms)
- Exponential backoff is implemented for failed reconnection attempts

## Authentication
Authentication for protected SSE endpoints:
- Authentication tokens are passed via headers
- The system automatically selects protected or public paths based on token presence
- Token validation occurs on the server side
- Unauthorized requests are rejected with appropriate error codes

## Error Handling
The SSE implementation includes comprehensive error handling:
- Connection errors trigger the reconnection strategy
- Parsing errors are caught and reported
- Network errors are handled gracefully
- Error callbacks provide detailed error information

## Performance Considerations
For optimal SSE performance:
- Keep connections open only when needed
- Clean up connections when components unmount
- Use debouncing for high-frequency updates
- Consider bandwidth usage for mobile devices

## Custom EventSource
The platform uses a custom EventSource implementation (`custom-event-source.ts`) that:
- Extends the standard EventSource API
- Adds support for custom headers
- Improves error handling
- Provides better cross-browser compatibility

## Integration Examples
Example of using SSE for market price updates:
```typescript
import { useMarketSSE } from '@/hooks/sse';

function MarketPrice({ instrumentId }: { instrumentId: string }) {
  const { price, isConnected } = useMarketSSE(instrumentId, {
    onPrice: (price) => {
      console.log('New price:', price);
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
