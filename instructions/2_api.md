# API Integration Specification

## API Architecture Overview
The Champion Trader platform uses two primary API communication methods:
1. **Server-Sent Events (SSE)** for real-time data streaming
2. **RESTful API** for contract purchase, market data retrieval, and account management

This document outlines both communication methods, their implementation, and integration patterns.

## API Integration Rules

When adding a new endpoint or using an existing endpoint, always follow these rules:

1. **Follow the Layered Architecture**
   - **Service Layer**: Create a service function in the appropriate service file (e.g., `src/api/services/*/service-rest.ts`)
   - **Hook Layer**: Create a custom hook that wraps the service function (e.g., `src/hooks/*/useService.ts`)
   - **Component Layer**: Use the hook in components, never call service functions directly

2. **Naming Conventions**
   - Service functions: Use camelCase verbs that describe the action (e.g., `getProducts`, `buyContract`)
   - Hook functions: Use camelCase with 'use' prefix (e.g., `useProducts`, `useBuyContract`)
   - Response interfaces: Use PascalCase with 'Response' suffix (e.g., `ProductsResponse`, `BuyContractResponse`)
   - Request interfaces: Use PascalCase with 'Request' suffix (e.g., `BuyContractRequest`)

3. **Error Handling**
   - Always include error handling in service functions
   - Always provide `onError` callbacks in hooks
   - Use the standard error response format for consistency

4. **Authentication**
   - Clearly document authentication requirements for each endpoint
   - Use the authentication mechanism provided by the platform
   - Handle authentication errors gracefully

5. **Documentation**
   - Document the endpoint in the Endpoint Catalog table
   - Include the endpoint path, method, description, and authentication requirements
   - For core trading endpoints, document the request and response formats

6. **Testing**
   - Create unit tests for new service functions and hooks
   - Mock API responses for testing
   - Test both success and error scenarios

7. **Performance**
   - Consider caching for frequently accessed data
   - Implement request debouncing for high-frequency calls
   - Clean up SSE connections when components unmount

8. **Versioning**
   - Always include the API version in the endpoint path (e.g., `/v1/market/products`)
   - Be aware of breaking changes when updating endpoint implementations

By following these rules, you ensure that API integration remains consistent, maintainable, and reliable across the platform.

## API Integration Pattern

The application follows a consistent pattern for API integration:

1. **Service Layer**: Direct API calls are encapsulated in service functions
2. **Hook Layer**: Service functions are wrapped in custom hooks
3. **Component Layer**: Components use hooks to interact with the API

This layered approach ensures separation of concerns and reusability.

### Service Layer
The service layer contains functions that directly interact with the API:

```typescript
// src/api/services/product/product-rest.ts
export const getProducts = async (): Promise<ProductsResponse> => {
  try {
    const response = await apiClient.get<ProductsResponse>('/products');
    return response.data;
  } catch (error) {
    // Error handling
    throw error;
  }
};
```

### Hook Layer
The hook layer wraps service functions in custom hooks using `useQuery`, `useMutation`, or `useSSESubscription`:

```typescript
// src/hooks/product/useProduct.ts
export const useProducts = (options?: {
  enabled?: boolean;
  onSuccess?: (data: ProductsResponse) => void;
  onError?: (error: Error) => void;
}) => {
  return useQuery<ProductsResponse, void>({
    queryFn: getProducts,
    params: undefined,
    enabled: options?.enabled,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};
```

### Component Layer
Components use the hooks to interact with the API:

```typescript
// Example component
function ProductList() {
  const { data, loading, error } = useProducts({
    onSuccess: (data) => console.log('Products loaded:', data),
    onError: (error) => console.error('Failed to load products:', error),
  });

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <ul>
      {data?.products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

## Part 1: Real-Time Data Communication (SSE)

### SSE Architecture Overview
The platform uses Server-Sent Events (SSE) for real-time data streaming. This provides efficient unidirectional communication for market price updates, contract price streaming, and position updates.

### SSE Integration Pattern

SSE integration follows the same layered approach:

1. **Service Layer**: SSE connection functions in `src/api/services/*/service-sse.ts`
2. **Hook Layer**: Custom hooks using `useSSESubscription` in `src/hooks/*/useService.ts`
3. **Component Layer**: Components using the hooks

Example of SSE subscription hook:

```typescript
// src/hooks/contract/useContract.ts
export const useOpenContractsStream = (options?: { enabled?: boolean }) => {
  return useSSESubscription<OpenContract>(
    (onData: (data: OpenContract) => void, onError: (error: any) => void) =>
      subscribeToOpenContracts({ onData, onError }),
    [options?.enabled]
  );
};
```

Example of component using SSE subscription:

```typescript
function OpenContractsList() {
  const { data, connected } = useOpenContractsStream({ enabled: true });
  
  return (
    <div>
      <h2>Open Contracts {connected ? '(Live)' : '(Connecting...)'}</h2>
      <ul>
        {data?.map(contract => (
          <li key={contract.id}>{contract.symbol} - {contract.amount}</li>
        ))}
      </ul>
    </div>
  );
}
```

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

## Part 2: RESTful API Integration

### API Overview
The Champion Trader platform uses a RESTful API architecture for contract purchase, market data retrieval, and account management. The API is organized by resource type and follows standard HTTP conventions.

### REST Integration Pattern

REST integration follows the same layered approach:

1. **Service Layer**: REST service functions in `src/api/services/*/service-rest.ts`
2. **Hook Layer**: 
   - For data fetching: Custom hooks using `useQuery` in `src/hooks/*/useService.ts`
   - For data mutations: Custom hooks using `useMutation` in `src/hooks/*/useService.ts`
3. **Component Layer**: Components using the hooks

Example of data fetching hook:

```typescript
// src/hooks/product/useProduct.ts
export const useProducts = (options?: {
  enabled?: boolean;
  onSuccess?: (data: ProductsResponse) => void;
  onError?: (error: Error) => void;
}) => {
  return useQuery<ProductsResponse, void>({
    queryFn: getProducts,
    params: undefined,
    enabled: options?.enabled,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};
```

Example of data mutation hook:

```typescript
// src/hooks/contract/useContract.ts
export const useBuyContract = (options?: {
  onSuccess?: (data: BuyContractResponse) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation<BuyContractResponse, BuyContractRequest>({
    mutationFn: buyContract,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};
```

### Endpoint Catalog

The platform interacts with the following API endpoints:

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| **Product Endpoints** |
| `/v1/market/products` | GET | Get the list of product types | Optional |
| `/v1/market/instruments` | GET | List available instruments based on product type | Optional |
| `/v1/market/products/config` | GET | Get initial config and default values for stake, duration, etc. | Optional |
| **Proposal Endpoints** |
| `/v1/trading/proposal/stream` | GET | Stream proposal updates for potential trades | Optional |
| **Contract Endpoints** |
| `/v1/trading/contracts/buy` | POST | Purchase a contract with specified parameters | Optional |
| `/v1/trading/contracts/sell` | POST | Sell an existing contract before expiry | Required |
| `/v1/trading/contracts/open/stream` | GET | Get list of all open contracts | Required |
| `/v1/trading/contracts/close/stream` | GET | Get details of closed contracts | Required |
| **Market Data Endpoints** |
| `/v1/market/instruments/candles/history` | POST | Get historical OHLC (candle) data | Optional |
| `/v1/market/instruments/candles/stream` | GET | Stream real-time candle data | Optional |
| `/v1/market/instruments/ticks/history` | POST | Get historical tick data | Optional |
| `/v1/market/instruments/ticks/stream` | GET | Stream real-time tick data | Optional |
| **Account Endpoints** |
| `/v1/accounting/balance/stream` | GET | Stream balance amount and currency | Required |
| `/v1/accounts` | GET | Get list of accounts for authenticated user | Required |
| **Authentication Endpoints** |
| `/v1/logout` | POST | Log out user and invalidate token | Required |

### Buy Contract API
The buy contract API is the core trading endpoint:

**Request Format:**
```typescript
interface BuyContractRequest {
    amount: number;
    price: number;
    instrument_id: string;
    duration: string;
    trade_type: string;
    currency: string;
}
```

**Response Format:**
```typescript
interface BuyContractResponse {
    contract_id: string;
    price: number;
    trade_type: string;
}
```

> **Note:** The `trade_type` field in the request corresponds to the `contractType` defined in trade type button configurations. For details on trade type configuration, refer to the [Trade Types instruction](./1_trade_types.md#contract-types) document.

### Trade Actions Integration

When implementing trade actions for a new trade type, you should use the `useBuyContract` hook:

```typescript
// Example of implementing a new trade action
import { useBuyContract } from "@/hooks/contract/useContract";
import { useTradeStore } from "@/stores/tradeStore";
import { parseDuration, formatDuration } from "@/utils/duration";

export const useMyTradeAction = () => {
  const { stake, duration, instrument } = useTradeStore();
  const { currency } = useClientStore();
  const { toast } = useToastStore();
  
  const { mutate, loading } = useBuyContract({
    onSuccess: (response) => {
      toast({
        content: `Successfully bought contract #${response.contract_id}`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        content: error.message || "Failed to buy contract",
        variant: "error",
      });
    },
  });
  
  const executeMyTradeAction = async () => {
    const { value, type } = parseDuration(duration);
    const formattedDuration = formatDuration(Number(value), type);
    
    mutate({
      amount: Number(stake),
      price: Number(stake),
      duration: formattedDuration,
      instrument_id: instrument,
      trade_type: "MY_CONTRACT_TYPE",
      currency,
    });
  };
  
  return {
    execute: executeMyTradeAction,
    loading,
  };
};
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

## API Services Structure

The API services are organized in a modular structure:

```
src/
├── api/
│   ├── base/
│   │   ├── rest/         # Base REST API functionality
│   │   └── sse/          # Base SSE functionality
│   ├── hooks/            # React hooks for API integration
│   │   ├── useQuery.ts   # Hook for data fetching
│   │   ├── useMutation.ts # Hook for data mutations
│   │   └── useSubscription.ts # Hook for SSE subscriptions
│   └── services/         # API service implementations
│       ├── contract/     # Contract-related services
│       ├── instrument/   # Instrument-related services
│       ├── product/      # Product-related services
│       └── proposal/     # Proposal-related services
```

## Best Practices

1. **Use Hooks for API Calls**
   - Always use the provided hooks for API calls
   - Avoid calling service functions directly from components
   - Follow the established pattern for consistency

2. **Error Handling**
   - Always provide onError callbacks for API hooks
   - Handle loading and error states in the UI
   - Provide user-friendly error messages

3. **Authentication**
   - Use secure storage for tokens
   - Implement automatic token refresh
   - Handle authentication failures gracefully
   - Log out users when authentication cannot be restored

4. **Performance**
   - Use caching for frequently accessed data
   - Implement request debouncing for high-frequency calls
   - Consider batch requests for multiple related items
   - Monitor API response times and optimize as needed

5. **Testing**
   - Mock API responses for unit tests
   - Test error handling paths
   - Verify authentication flows
   - Test reconnection strategies for SSE
