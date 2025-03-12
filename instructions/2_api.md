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
The SSE implementation is based on the `createSSEConnection` function in `src/services/api/sse/createSSEConnection.ts`. This function:
- Creates and manages EventSource connections
- Handles connection lifecycle (open, message, error, close)
- Provides a clean teardown mechanism
- Supports both protected and public endpoints

### Message Format
SSE messages follow a standard format:
- Messages are sent as JSON strings
- Each message contains a data payload with price information
- Messages are parsed and typed using TypeScript interfaces
- The `ContractPriceResponse` interface defines the structure of price updates

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
```

## Part 2: RESTful API Integration

### API Overview
The Champion Trader platform uses a RESTful API architecture for contract purchase, market data retrieval, and account management. The API is organized by resource type and follows standard HTTP conventions.

### Endpoint Catalog
The platform interacts with the following key API endpoints:

| Endpoint | Method | Purpose | Authentication |
|----------|--------|---------|----------------|
| `/buy` | POST | Purchase a contract | Required |
| `/balance` | GET | Retrieve account balance | Required |
| `/instruments` | GET | Get available trading instruments | Optional |
| `/products` | GET | Get available products | Optional |
| `/duration` | GET | Get available durations | Optional |

### Buy Contract API
The buy contract API is the core trading endpoint:

**Request Format:**
```typescript
interface BuyRequest {
    price: number;
    instrument: string;
    duration: string;
    trade_type: string;
    currency: string;
    payout: number;
    strike: string;
}
```

**Response Format:**
```typescript
interface BuyResponse {
    contract_id: string;
    price: number;
    trade_type: string;
}
```

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
Example of buying a contract:
```typescript
import { buyContract } from '@/services/api/rest/buy/buyService';

async function executeTrade() {
  try {
    const response = await buyContract({
      price: 100,
      instrument: 'frx_EURUSD',
      duration: '1d',
      trade_type: 'CALL',
      currency: 'USD',
      payout: 200,
      strike: '1.2345'
    });
    
    console.log('Contract purchased:', response.contract_id);
    return response;
  } catch (error) {
    console.error('Trade execution failed:', error.message);
    throw error;
  }
}
```
