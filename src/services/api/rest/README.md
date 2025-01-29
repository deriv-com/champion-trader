# REST API Architecture

This directory contains the REST API implementation using Axios with TypeScript support. The architecture is designed to be modular, type-safe, and easy to test.

## Structure

```
rest/
├── service.ts       # REST API service implementations
├── types.ts         # TypeScript interfaces for requests/responses
└── __tests__/      # Test files
    └── service.test.ts
```

## Configuration

The REST API services use environment-specific configuration from `src/config/api.ts`. The base URL and other settings can be configured through environment variables:

```typescript
interface ApiConfig {
  rest: {
    baseUrl: string;
  };
}
```

## Available Endpoints

### POST /available_instruments

Retrieves a list of available trading instruments.

#### Request
```typescript
interface AvailableInstrumentsRequest {
  context: {
    app_id: number;
    account_type: string;
  };
  trace?: boolean;
}
```

#### Response
```typescript
interface AvailableInstrumentsResponse {
  instruments: Array<{
    id: string;    // e.g., "EURUSD"
    name: string;  // e.g., "EUR/USD"
  }>;
}
```

#### Error Responses
- 400 Bad Request: Missing or invalid parameters
  ```typescript
  {
    error: "context is required" |
           "app_id is required in context" |
           "account_type is required in context"
  }
  ```
- 500 Internal Server Error
  ```typescript
  {
    error: "Failed to fetch available instruments"
  }
  ```

#### Usage Example
```typescript
import { getAvailableInstruments } from '@/services/api/rest/service';

try {
  const response = await getAvailableInstruments({
    context: {
      app_id: 1001,
      account_type: 'real'
    }
  });
  
  // Handle successful response
  console.log('Available instruments:', response.instruments);
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Handle API errors
    console.error('API Error:', error.response?.data.error);
  } else {
    // Handle other errors
    console.error('Error:', error);
  }
}
```

## Features

- **Type Safety**: Full TypeScript support with request/response type checking
- **Error Handling**: Comprehensive error handling with typed error responses
- **Axios Integration**: Uses configured Axios instance with interceptors
- **Environment Support**: Configuration for development, staging, and production
- **Testing**: Comprehensive test coverage with mocked Axios responses

## Best Practices

1. **Type Safety**:
   - Use TypeScript interfaces for all requests and responses
   - Leverage type inference for better developer experience
   - Keep types in sync with API specifications

2. **Error Handling**:
   - Always wrap API calls in try/catch blocks
   - Use axios.isAxiosError for type-safe error handling
   - Handle both API errors and network errors appropriately

3. **Testing**:
   - Mock Axios responses for predictable tests
   - Test both success and error scenarios
   - Verify correct request parameters
   - Test error handling logic

4. **Configuration**:
   - Use environment variables for configuration
   - Follow environment-specific settings
   - Use the configured Axios instance from axios_interceptor.ts

## Testing Example

```typescript
import { getAvailableInstruments } from '../service';
import { apiClient } from '../../axios_interceptor';

jest.mock('../../axios_interceptor');
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('REST API Service', () => {
  describe('getAvailableInstruments', () => {
    it('should successfully fetch instruments', async () => {
      const mockResponse = {
        instruments: [
          { id: 'EURUSD', name: 'EUR/USD' }
        ]
      };
      
      mockApiClient.post.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await getAvailableInstruments({
        context: {
          app_id: 1001,
          account_type: 'real'
        }
      });
      
      expect(result).toEqual(mockResponse);
    });
  });
});
