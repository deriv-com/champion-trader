# REST API Integration

This directory contains the REST API service implementations for the trading application. The services are organized by domain and provide type-safe API interactions.

## Service Organization

```
rest/
├── instrument/          # Instrument-related API endpoints
│   └── service.ts      # Instrument service implementation
├── types.ts            # Shared type definitions
└── __tests__/         # Service tests
```

## API Configuration

The REST API uses environment-specific configuration from `src/config/api.ts`:

```typescript
interface ApiConfig {
  rest: {
    baseUrl: string;  // Base URL for REST API endpoints
  };
}
```

## Available Endpoints

### Instruments API

Fetch available trading instruments:

```typescript
import { getAvailableInstruments } from '@/services/api/rest/instrument/service';

interface InstrumentRequest {
  context: {
    app_id: number;
    account_type: 'demo' | 'real';
  };
}

interface Instrument {
  id: string;
  name: string;
  type: string;
  pip_size: number;
}

// Usage
const response = await getAvailableInstruments({
  context: {
    app_id: 1001,
    account_type: 'real'
  }
});
// Returns: { instruments: Instrument[] }
```

## Implementation Pattern

Services follow a consistent implementation pattern:

```typescript
import axios from 'axios';
import { apiConfig } from '@/config/api';

export class InstrumentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = apiConfig.rest.baseUrl;
  }

  async getInstruments(request: InstrumentRequest): Promise<InstrumentResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/instruments`, {
        params: request
      });
      return response.data;
    } catch (error) {
      // Error handling
      throw error;
    }
  }
}
```

## Error Handling

The services implement consistent error handling:

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

try {
  // API call
} catch (error) {
  if (axios.isAxiosError(error)) {
    const apiError: ApiError = error.response?.data;
    // Handle API error
  }
  throw error;
}
```

## Testing

Services are thoroughly tested:

```typescript
import { InstrumentService } from '../instrument/service';
import axios from 'axios';

jest.mock('axios');

describe('InstrumentService', () => {
  it('should fetch instruments', async () => {
    const mockResponse = {
      instruments: [
        { id: 'BTCUSD', name: 'Bitcoin' }
      ]
    };
    
    (axios.get as jest.Mock).mockResolvedValue({
      data: mockResponse
    });

    const service = new InstrumentService();
    const result = await service.getInstruments({
      context: {
        app_id: 1001,
        account_type: 'real'
      }
    });

    expect(result).toEqual(mockResponse);
  });
});
```

## Best Practices

1. **Type Safety**
   - Use TypeScript interfaces for request/response types
   - Validate API responses against types
   - Handle type mismatches gracefully

2. **Error Handling**
   - Implement consistent error handling
   - Provide meaningful error messages
   - Log errors appropriately

3. **Testing**
   - Mock API responses
   - Test error scenarios
   - Verify request parameters

4. **Performance**
   - Implement request caching where appropriate
   - Handle request cancellation
   - Optimize request payloads

## Usage Guidelines

1. **Service Instantiation**
   ```typescript
   const instrumentService = new InstrumentService();
   ```

2. **Making Requests**
   ```typescript
   try {
     const instruments = await instrumentService.getInstruments(request);
     // Handle success
   } catch (error) {
     // Handle error
   }
   ```

3. **Response Handling**
   ```typescript
   interface ApiResponse<T> {
     data: T;
     metadata?: {
       timestamp: string;
       version: string;
     };
   }

   // Usage
   const response = await instrumentService.getInstruments(request);
   const instruments = response.data;
   ```

4. **Error Recovery**
   ```typescript
   try {
     await instrumentService.getInstruments(request);
   } catch (error) {
     if (error.code === 'RATE_LIMIT') {
       // Implement retry logic
     }
     throw error;
   }
