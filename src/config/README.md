# Configuration Directory

This directory contains configuration files that define various aspects of the application's behavior.

## Files

### `tradeTypes.ts`
Defines the configuration for different trade types, including their fields, buttons, and lazy loading behavior. See [Trade Types Configuration](#trade-types-configuration) for details on adding new trade types.

### `duration.ts`
Contains duration-related configurations including ranges, special cases, and validation helpers.

### `stake.ts`
Defines stake-related configurations and validation rules.

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

### Example: Adding a New Trade Type

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
