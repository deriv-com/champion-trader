# ContractSSEHandler Component

The ContractSSEHandler component is responsible for managing the Server-Sent Events (SSE) connection specifically for contract price streaming. It handles establishing the connection, receiving updates, and propagating contract price data throughout the application.

## Features
- Establishes a protected SSE connection for contract pricing data.
- Automatically handles reconnection and error events.
- Provides a simple interface for consuming contract price updates.
- Integrates with authentication mechanisms by accepting an auth token.
- Designed with atomic component principles and TDD practices in mind.

## Props
- **authToken**: *string* — The authentication token required for establishing a protected SSE connection.
- **onPriceUpdate**: *function* (optional) — Callback function that is invoked when a new contract price is received.
- **config**: *object* (optional) — Additional configuration options such as query parameters or connection options.

## Usage Example

```tsx
import { ContractSSEHandler } from '@/components/ContractSSEHandler';

function TradePage() {
  const authToken = 'your-auth-token';

  const handlePriceUpdate = (priceData: any) => {
    console.log('Received contract price update:', priceData);
  };

  return (
    <div>
      <ContractSSEHandler 
        authToken={authToken}
        onPriceUpdate={handlePriceUpdate}
      />
    </div>
  );
}

export default TradePage;
```

## Testing
- Unit tests are located in the __tests__ folder (`__tests__/ContractSSEHandler.test.tsx`).
- Tests cover connection establishment, reconnection logic, and callback invocation on receiving price data.
- Error scenarios and edge cases are also tested to ensure robust operation.

## Integration Notes
- The component leverages internal SSE service logic to handle the protected connection by appending the necessary authentication tokens.
- It is designed to be easily integrated into screen components where real-time contract price data is required.
- Follows atomic design and TDD, ensuring modularity and ease of maintenance.
