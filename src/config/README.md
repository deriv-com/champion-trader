# Configuration Directory

This directory contains configuration files that define various aspects of the application's behavior.

## Files

### `tradeTypes.ts`
Defines the configuration for different trade types, including their fields, buttons, and lazy loading behavior. See [Trade Types Configuration](#trade-types-configuration) for details on adding new trade types.

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

## Trade Types Configuration

The trade types configuration system allows you to define new trade types with their specific fields, buttons, and behaviors.

### Adding a New Trade Type

1. Add the action type and handler in `src/hooks/useTradeActions.ts`:
```typescript
export type TradeAction = 'existing_actions' | 'your_new_action';

// Add action handler
your_new_action: async () => {
  // Implementation
}
```

2. Add the trade type configuration in `tradeTypes.ts`:
```typescript
your_trade_type: {
  fields: {
    duration: boolean,  // Show/hide duration field
    stake: boolean,     // Show/hide stake field
    allowEquals?: boolean  // Show/hide equals controller
  },
  metadata: {
    preloadFields: boolean,  // Preload field components
    preloadActions: boolean  // Preload action handlers
  },
  payouts: {
    max: boolean,  // Show/hide max payout display
    labels: {
      [actionName: string]: string  // Custom label for each button's payout
    }
  },
  buttons: [
    {
      title: string,  // Button text
      label: string,  // Secondary label (e.g., "Payout")
      className: string,  // Button styling
      position: 'left' | 'right',  // Button position
      actionName: TradeAction,  // Action to execute
      contractType: string  // API contract type (e.g., "CALL", "PUT")
    }
  ]
}
```

### Examples

#### Duration Configuration Example

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

#### Stake Configuration Example

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

### Trade Type Example

Here's an example of adding a new "touch/no-touch" trade type:

1. Add the action:
```typescript
// src/hooks/useTradeActions.ts
export type TradeAction = 'existing_actions' | 'buy_touch' | 'buy_no_touch';

// Add handlers
buy_touch: async () => {
  const { stake, duration } = useTradeStore();
  // Implementation
},
buy_no_touch: async () => {
  const { stake, duration } = useTradeStore();
  // Implementation
}
```

2. Add the configuration:
```typescript
// src/config/tradeTypes.ts
touch: {
  fields: {
    duration: true,
    stake: true
  },
  metadata: {
    preloadFields: false,
    preloadActions: false
  },
  payouts: {
    max: true,
    labels: {
      buy_touch: "Payout (Touch)",
      buy_no_touch: "Payout (No Touch)"
    }
  },
  buttons: [
    {
      title: "Touch",
      label: "Payout",
      className: "bg-color-solid-emerald-700",
      position: "right",
      actionName: "buy_touch",
      contractType: "TOUCH"
    },
    {
      title: "No Touch",
      label: "Payout",
      className: "bg-color-solid-cherry-700",
      position: "left",
      actionName: "buy_no_touch",
      contractType: "NOTOUCH"
    }
  ]
}
```

### Lazy Loading

The trade form controller uses React.lazy to dynamically load components based on the trade type configuration:

- Fields are lazy loaded when needed
- Preloading can be enabled through metadata
- Components are wrapped in Suspense boundaries

### Best Practices

1. **Field Configuration**
   - Only enable fields that are relevant to the trade type
   - Consider mobile/desktop layouts when configuring fields

2. **Button Configuration**
   - Use consistent styling (emerald for positive, cherry for negative)
   - Keep button labels clear and concise
   - Consider button positioning for UX
   - Map buttons to appropriate contract types
   - Ensure payout labels match button actions

3. **Payout Configuration**
   - Use clear, descriptive labels for payouts
   - Consider whether max payout is relevant
   - Keep labels consistent with button actions
   - Use proper capitalization and spacing

4. **Lazy Loading**
   - Enable preloading for commonly used trade types
   - Disable preloading for rarely used types
   - Consider bundle size impact

5. **Action Handlers**
   - Keep handlers focused and specific to the trade type
   - Use store values appropriately
   - Handle errors gracefully
   - Consider contract type in implementation

### Testing

When adding a new trade type:

1. Test field visibility
2. Test button interactions
3. Verify lazy loading behavior
4. Test action handler execution
5. Verify mobile/desktop layouts
