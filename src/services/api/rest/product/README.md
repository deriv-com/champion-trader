# Product Service

A service module that provides API functions for fetching product-related data from the backend.

## Functions

### getProducts

Fetches available trading products from the API.

```ts
getProducts(): Promise<ProductsResponse>
```

#### Returns
- Promise resolving to a `ProductsResponse` object containing product data

#### Throws
- `AxiosError` with ErrorResponse data on validation or server errors

#### Example

```ts
import { getProducts } from '@/services/api/rest/product/service';

async function fetchAvailableProducts() {
  try {
    const response = await getProducts();
    console.log('Available products:', response.data.products);
    return response.data.products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}
```

## Types

The service relies on the following types:

```ts
// From ../types.ts
interface ProductsResponse {
  data: {
    products: Array<{
      id: string;
      display_name: string;
      // Other product properties
    }>;
  };
}
```

## Dependencies

- Uses `apiClient` from `../../axios_interceptor` for making HTTP requests
- Imports types from `../types`
