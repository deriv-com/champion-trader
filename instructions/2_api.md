# API Integration Specification

## API Architecture Overview
The Champion Trader platform uses two primary API communication methods:
1. **Server-Sent Events (SSE)** for real-time data streaming
2. **RESTful API** for contract purchase, market data retrieval, and account management

This document outlines both communication methods, their implementation, and integration patterns.

## Part 1: Real-Time Data Communication (SSE)

### SSE Architecture Overview
The platform uses Server-Sent Events (SSE) for real-time data streaming. This provides efficient unidirectional communication for market price updates, contract price streaming, and position updates.

### Connection Management
The SSE implementation is based on the `createSSEConnection` function in `src/api/base/sse/client.ts` and managed by the `connectionManager` in `src/api/base/sse/connection-manager.ts`. This architecture:
- Creates and manages EventSource connections
- Ensures only one connection exists per endpoint
- Automatically closes existing connections when new ones are created
- Handles connection lifecycle (open, message, error, close)
- Provides a clean teardown mechanism
- Supports both protected and public endpoints

### Message Format
SSE messages follow a standard format:
- Messages are sent as JSON strings
- Each message contains a data payload with price information
- Messages are parsed and typed using TypeScript interfaces
- Service-specific interfaces define the structure for different types of updates

### Reconnection Strategy
The SSE implementation includes a robust reconnection strategy:
- Automatic reconnection on connection loss
- Configurable reconnection attempts (default: 3)
- Configurable reconnection interval (default: 1000ms)
- Exponential backoff is implemented for failed reconnection attempts

### Authentication
Authentication for protected SSE endpoints:
- Authentication tokens are passed via headers
- The system automatically selects protected or public paths based on token presence
- Token validation occurs on the server side
- Unauthorized requests are rejected with appropriate error codes

### Error Handling
The SSE implementation includes comprehensive error handling:
- Connection errors trigger the reconnection strategy
- Parsing errors are caught and reported
- Network errors are handled gracefully
- Error callbacks provide detailed error information

### Performance Considerations
For optimal SSE performance:
- Keep connections open only when needed
- Clean up connections when components unmount
- Use debouncing for high-frequency updates
- Consider bandwidth usage for mobile devices

### Custom EventSource
The platform uses a custom EventSource implementation (`custom-event-source.ts`) that:
- Extends the standard EventSource API
- Adds support for custom headers
- Improves error handling
- Provides better cross-browser compatibility

### SSE Integration Examples
Example of using SSE for proposal updates using hooks:
```typescript
import { useProposal } from '@/hooks/proposal';

function ProposalPrice({ instrumentId }: { instrumentId: string }) {
  const { data: proposal, error } = useProposal({
    instrumentId,
    duration: '1d',
    tradeType: 'CALL',
  });

  if (error) return <p>Error loading proposal: {error.message}</p>;
  
  return (
    <div>
      {proposal ? (
        <p>Proposal price: {proposal.price}</p>
      ) : (
        <p>Loading proposal...</p>
      )}
    </div>
  );
}
```

## Part 2: RESTful API Integration

### API Overview
The Champion Trader platform uses a RESTful API architecture for contract purchase, market data retrieval, and account management. The API is organized by service type and follows standard HTTP conventions.

### API Structure
The API is structured into service-specific modules:
- `api/services/contract`: Contract-related endpoints
- `api/services/instrument`: Market instruments endpoints
- `api/services/product`: Product configuration endpoints
- `api/services/proposal`: Proposal streaming endpoints
- `api/services/user`: User and account endpoints

### Base API Hooks
The platform provides several base hooks for API interaction:
- `useQuery`: For fetching data from REST endpoints
- `useMutation`: For modifying data via REST endpoints
- `useSubscription`: For subscribing to SSE streams

### Service-Specific Hooks
Service-specific hooks built on top of base hooks:
- `useContract`: For contract operations
- `useInstrument` and `useInstruments`: For instrument data
- `useProduct`: For product configuration
- `useProposal`: For streaming price proposals
- `useUser` and `useBalance`: For user data and balance

### Error Handling
API errors follow a standard format:
```typescript
interface ErrorResponse {
    error: {
        code: string;
        message: string;
    };
}
```

Common error codes:
- `INVALID_PARAMETERS`: Request parameters are invalid
- `INSUFFICIENT_BALANCE`: Account balance is insufficient
- `MARKET_CLOSED`: Market is currently closed
- `UNAUTHORIZED`: Authentication failed
- `RATE_LIMIT_EXCEEDED`: API rate limit exceeded

### Authentication
Authentication is handled via:
- Bearer tokens in the Authorization header
- Token validation on the server side
- Automatic token refresh mechanism
- Session timeout handling

### Rate Limiting
The API implements rate limiting to prevent abuse:
- Limits are applied per endpoint
- Rate limit headers indicate remaining requests
- Backoff strategy for rate limit exceeded errors
- Different limits for authenticated vs. unauthenticated requests

### Response Codes
The API uses standard HTTP response codes:
- `200 OK`: Request successful
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Permission denied
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### RESTful API Implementation Example
Example of buying a contract using the contract service:
```typescript
import { useContract } from '@/hooks/contract';

function BuyContractButton() {
  const { buyContract, isLoading, error } = useContract();
  
  const handleBuy = async () => {
    try {
      const result = await buyContract({
        price: 100,
        instrument_id: 'frx_EURUSD',
        duration: '1d',
        trade_type: 'CALL',
        currency: 'USD',
      });
      
      console.log('Contract purchased:', result.contract_id);
    } catch (err) {
      console.error('Failed to purchase contract:', err);
    }
  };

  return (
    <button 
      onClick={handleBuy}
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : 'Buy Contract'}
    </button>
  );
}
