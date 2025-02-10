# Configuration Directory

This directory contains configuration files that define various aspects of the application's behavior.

## Files

### `tradeTypes.ts`
Defines the configuration for different trade types, including their fields, buttons, and lazy loading behavior. See [Trade Types Configuration](TRADE_TYPES.md) for a comprehensive guide on adding new trade types and understanding the configuration system.

### `duration.ts`
Contains duration-related configurations including ranges, special cases, and validation helpers:

```typescript
{
  min: number,         // Minimum duration value
  max: number,         // Maximum duration value
  step: number,        // Increment/decrement step
  defaultValue: number // Default duration value
  units: {            // Available duration units
    minutes: boolean,
    hours: boolean,
    days: boolean
  },
  validation: {
    rules: {          // Validation rules per unit
      minutes: { min: number, max: number },
      hours: { min: number, max: number },
      days: { min: number, max: number }
    },
    messages: {       // Custom error messages
      min: string,
      max: string,
      invalid: string
    }
  }
}
```

### `stake.ts`
Defines stake-related configurations and validation rules:

```typescript
{
  min: number,        // Minimum stake amount
  max: number,        // Maximum stake amount
  step: number,       // Increment/decrement step
  currency: string,   // Currency display (e.g., "USD")
  sse: {             // SSE configuration
    endpoint: string, // SSE endpoint for price updates
    retryInterval: number, // Retry interval in ms
    debounceMs: number    // Debounce time for updates
  },
  validation: {
    rules: {
      min: number,    // Minimum allowed stake
      max: number,    // Maximum allowed stake
      decimals: number // Maximum decimal places
    },
    messages: {       // Custom error messages
      min: string,
      max: string,
      invalid: string,
      decimals: string
    }
  }
}
```

### `api.ts`
Contains API endpoint configurations for different environments.

## Configuration Examples

### Duration Configuration Example

```typescript
// src/config/duration.ts
export const durationConfig = {
  min: 1,
  max: 365,
  step: 1,
  defaultValue: 1,
  units: {
    minutes: true,
    hours: true,
    days: true
  },
  validation: {
    rules: {
      minutes: { min: 1, max: 60 },
      hours: { min: 1, max: 24 },
      days: { min: 1, max: 365 }
    },
    messages: {
      min: "Duration must be at least {min} {unit}",
      max: "Duration cannot exceed {max} {unit}",
      invalid: "Please enter a valid duration"
    }
  }
};
```

### Stake Configuration Example

```typescript
// src/config/stake.ts
export const stakeConfig = {
  min: 1,
  max: 50000,
  step: 1,
  currency: "USD",
  sse: {
    endpoint: "/api/v3/price",
    retryInterval: 3000,
    debounceMs: 500
  },
  validation: {
    rules: {
      min: 1,
      max: 50000,
      decimals: 2
    },
    messages: {
      min: "Minimum stake is {min} {currency}",
      max: "Maximum stake is {max} {currency}",
      invalid: "Please enter a valid amount",
      decimals: "Maximum {decimals} decimal places allowed"
    }
  }
};
```
