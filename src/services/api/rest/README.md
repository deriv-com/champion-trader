# REST API Architecture

This directory contains the REST API implementation using Axios with TypeScript support. The architecture is designed to be modular, type-safe, and easy to test.

## Structure

```
rest/
├── types.ts         # Common TypeScript interfaces
├── instrument/      # Instrument-specific endpoints
│   ├── service.ts  # Instrument service implementation
│   └── __tests__/  # Instrument service tests
└── __tests__/      # Common test files
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

## Common Types

### Instrument Types
```typescript
interface Instrument {
  id: string;    // e.g., "EURUSD"
  name: string;  // e.g., "EUR/USD"
}

interface ErrorResponse {
  error: string;
}
```

## Available Endpoints

### Instrument Service

The instrument service handles all instrument-related API endpoints.

#### POST /available_instruments

Retrieves a list of available trading instruments.

##### Request
```typescript
interface AvailableInstrumentsRequest {
  context: {
    app_id: number;
    account_type: string;
  };
  trace?: boolean;
}
```

##### Response
```typescript
interface AvailableInstrumentsResponse {
  instruments: Instrument[];
}
```

##### Error Responses
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

##### Usage Example
```typescript
import { getAvailableInstruments } from '@/services/api/rest/instrument/service';

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
- **Modular Architecture**: Services are organized by domain (e.g., instruments)

## Best Practices

1. **Type Safety**:
   - Use TypeScript interfaces for all requests and responses
   - Leverage type inference for better developer experience
   - Keep types in sync with API specifications
   - Define common types in types.ts

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

5. **Service Organization**:
   - Group related endpoints into domain-specific services
   - Keep service implementations focused and single-responsibility
   - Use clear, descriptive names for services and methods

## Testing Example

```typescript
import { AxiosError } from 'axios';
import { apiClient } from '../../axios_interceptor';
import { getAvailableInstruments } from '../instrument/service';
import {
  AvailableInstrumentsRequest,
  AvailableInstrumentsResponse,
  ErrorResponse,
} from '../types';

// Mock the axios client
jest.mock('../../axios_interceptor');
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('REST API Service', () => {
  describe('getAvailableInstruments', () => {
    const mockRequest: AvailableInstrumentsRequest = {
      context: {
        app_id: 1001,
        account_type: 'real',
      },
    };

    const mockResponse: AvailableInstrumentsResponse = {
      instruments: [
        { id: 'EURUSD', name: 'EUR/USD' },
        { id: 'GBPUSD', name: 'GBP/USD' },
      ],
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully fetch available instruments', async () => {
      mockApiClient.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await getAvailableInstruments(mockRequest);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/available_instruments',
        mockRequest
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle validation error', async () => {
      const errorResponse: ErrorResponse = {
        error: 'app_id is required in context',
      };

      mockApiClient.post.mockRejectedValueOnce(
        new AxiosError(
          'Bad Request',
          '400',
          undefined,
          undefined,
          { data: errorResponse, status: 400 } as any
        )
      );

      await expect(getAvailableInstruments({
        context: { app_id: 0, account_type: '' },
      })).rejects.toThrow('Bad Request');
    });

    it('should handle server error', async () => {
      const errorResponse: ErrorResponse = {
        error: 'Failed to fetch available instruments',
      };

      mockApiClient.post.mockRejectedValueOnce(
        new AxiosError(
          'Internal Server Error',
          '500',
          undefined,
          undefined,
          { data: errorResponse, status: 500 } as any
        )
      );

      await expect(getAvailableInstruments(mockRequest)).rejects.toThrow('Internal Server Error');
    });
  });
});
