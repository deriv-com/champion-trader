# Hooks

This directory contains React hooks used throughout the application.

## API Hooks

### useRestAPI

A generic hook for making REST API calls with built-in loading, error, and data state management.

```typescript
import { useRestAPI } from '@/hooks/useRestAPI';

// For API calls without parameters
const { data, loading, error, refetch } = useRestAPI<ResponseType>(apiFunction);

// For API calls with parameters
const { data, loading, error, refetch } = useRestAPI<ResponseType, ParamsType>(
  apiFunction,
  params
);

// With dependencies that trigger refetch when changed
const { data, loading, error, refetch } = useRestAPI<ResponseType>(
  apiFunction,
  undefined,
  [dependency1, dependency2]
);
```

#### Parameters

- `serviceFunction`: The API service function to call
- `params` (optional): Parameters to pass to the service function
- `dependencies` (optional): Array of dependencies for the useEffect hook

#### Returns

- `data`: The data returned by the API call (null if loading or error)
- `loading`: Boolean indicating if the API call is in progress
- `error`: Error message if the API call failed (null if successful)
- `refetch`: Function to manually trigger the API call again

### useContracts

A hook for fetching and managing contracts data.

```typescript
import { useContracts } from '@/hooks/useContracts';

const { contracts, loading, error, refetchContracts } = useContracts();
```

#### Returns

- `contracts`: Array of contracts
- `loading`: Boolean indicating if the contracts are being fetched
- `error`: Error message if the fetch failed
- `refetchContracts`: Function to manually trigger a refetch of contracts

### useBalance

A hook for fetching and managing user balance data.

```typescript
import { useBalance } from '@/hooks/useBalance';

const { balance, currency, loading, error, refetchBalance } = useBalance();
```

#### Returns

- `balance`: The user's balance
- `currency`: The currency of the balance
- `loading`: Boolean indicating if the balance is being fetched
- `error`: Error message if the fetch failed
- `refetchBalance`: Function to manually trigger a refetch of the balance

### useBuyContract

A hook for buying contracts and managing the response.

```typescript
import { useBuyContract } from '@/hooks/useBuyContract';
import { BuyRequest } from '@/services/api/rest/types';

// Without initial request
const { buyResponse, loading, error, buy, retryLastBuy } = useBuyContract();

// With initial request
const initialRequest: BuyRequest = {
  price: 100,
  instrument: 'EURUSD',
  duration: '1d',
  trade_type: 'CALL',
  currency: 'USD',
  payout: 200,
  strike: '1.2000'
};

const { buyResponse, loading, error, buy, retryLastBuy } = useBuyContract(initialRequest);

// Buy a contract
const handleBuy = async () => {
  try {
    const response = await buy({
      price: 100,
      instrument: 'EURUSD',
      duration: '1d',
      trade_type: 'CALL',
      currency: 'USD',
      payout: 200,
      strike: '1.2000'
    });
    console.log('Contract bought:', response);
  } catch (err) {
    console.error('Failed to buy contract:', err);
  }
};
```

#### Parameters

- `initialRequest` (optional): Initial buy request parameters

#### Returns

- `buyResponse`: The response from the buy operation
- `loading`: Boolean indicating if the buy operation is in progress
- `error`: Error message if the buy operation failed
- `buy`: Function to buy a contract with the provided parameters
- `retryLastBuy`: Function to retry the last buy operation
