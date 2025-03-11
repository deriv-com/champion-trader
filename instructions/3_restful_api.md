# RESTful API Integration Specification

## API Overview
The Champion Trader platform uses a RESTful API architecture for contract purchase, market data retrieval, and account management. The API is organized by resource type and follows standard HTTP conventions.

## Endpoint Catalog
The platform interacts with the following key API endpoints:

| Endpoint | Method | Purpose | Authentication |
|----------|--------|---------|----------------|
| `/buy` | POST | Purchase a contract | Required |
| `/balance` | GET | Retrieve account balance | Required |
| `/instruments` | GET | Get available trading instruments | Optional |
| `/products` | GET | Get available products | Optional |
| `/duration` | GET | Get available durations | Optional |

## Buy Contract API
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

## Error Handling
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

## Authentication
Authentication is handled via:
- Bearer tokens in the Authorization header
- Token validation on the server side
- Automatic token refresh mechanism
- Session timeout handling

## Rate Limiting
The API implements rate limiting to prevent abuse:
- Limits are applied per endpoint
- Rate limit headers indicate remaining requests
- Backoff strategy for rate limit exceeded errors
- Different limits for authenticated vs. unauthenticated requests

## Response Codes
The API uses standard HTTP response codes:
- `200 OK`: Request successful
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Permission denied
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Implementation Example
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
