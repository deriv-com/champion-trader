# Trade Type Configuration Guide

This guide explains how to configure and add new trade types to the Champion Trader application. The configuration-driven approach makes it easy to add new trade types without modifying the core application logic.

## Overview

Trade types are defined in `src/config/tradeTypes.ts` using a type-safe configuration system. Each trade type specifies:

- Available fields (duration, stake, etc.)
- Trade buttons with their styling and actions
- Payout display configuration
- Performance optimization metadata

## Configuration Structure

### Trade Type Interface

```typescript
interface TradeTypeConfig {
    fields: {
        duration: boolean; // Show duration field
        stake: boolean; // Show stake field
        allowEquals?: boolean; // Allow equals option
    };
    buttons: TradeButton[]; // Trade action buttons
    payouts: {
        max: boolean; // Show max payout
        labels: Record<string, string>; // Button-specific payout labels
    };
    metadata?: {
        preloadFields?: boolean; // Preload field components
        preloadActions?: boolean; // Preload action handlers
    };
}
```

### Button Configuration

```typescript
interface TradeButton {
    title: string; // Button text
    label: string; // Payout label
    className: string; // Button styling
    position: "left" | "right"; // Button position
    actionName: TradeAction; // Action identifier
    contractType: string; // API contract type
}
```

## Adding a New Trade Type

To add a new trade type:

1. Define the configuration in `tradeTypeConfigs`:

```typescript
export const tradeTypeConfigs: Record<string, TradeTypeConfig> = {
    your_trade_type: {
        fields: {
            duration: true,
            stake: true,
            allowEquals: false, // Optional
        },
        metadata: {
            preloadFields: false, // Performance optimization
            preloadActions: false,
        },
        payouts: {
            max: true,
            labels: {
                buy_action: "Payout Label",
            },
        },
        buttons: [
            {
                title: "Button Text",
                label: "Payout",
                className: "bg-color-solid-emerald-700 hover:bg-color-solid-emerald-600",
                position: "right",
                actionName: "buy_action",
                contractType: "CONTRACT_TYPE",
            },
        ],
    },
};
```

2. Add the action name to the TradeAction type in `useTradeActions.ts`:

```typescript
export type TradeAction =
    | "buy_rise"
    | "buy_fall"
    | "buy_higher"
    | "buy_lower"
    | "buy_touch"
    | "buy_no_touch"
    | "buy_multiplier"
    | "your_new_action"; // Add your action here
```

3. Implement the action handler in the trade actions hook:

```typescript
// In useTradeActions.ts
const actions: Record<TradeAction, () => Promise<void>> = {
    // ... existing actions ...
    your_new_action: async () => {
        try {
            const response = await buyContract({
                price: Number(stake),
                duration: (() => {
                    const { value, type } = parseDuration(duration);
                    return formatDuration(Number(value), type);
                })(),
                instrument: instrument,
                trade_type: actionContractMap.your_new_action,
                currency,
                payout: Number(stake),
                strike: stake.toString(),
            });
            toast({
                content: `Successfully bought ${response.trade_type} contract`,
                variant: "success",
            });
        } catch (error) {
            toast({
                content: error instanceof Error ? error.message : "Failed to buy contract",
                varient: "error",
            });
        }
    },
};
```

The action handler:

- Uses the buyContract service to execute trades
- Automatically formats duration using utility functions
- Handles success/error states with toast notifications
- Uses the contract type mapping from the configuration

## Example: Rise/Fall Configuration

Here's the configuration for a basic Rise/Fall trade type:

```typescript
rise_fall: {
  fields: {
    duration: true,
    stake: true,
    allowEquals: false
  },
  metadata: {
    preloadFields: true,  // Most common type, preload components
    preloadActions: true
  },
  payouts: {
    max: true,
    labels: {
      buy_rise: "Payout (Rise)",
      buy_fall: "Payout (Fall)"
    }
  },
  buttons: [
    {
      title: "Rise",
      label: "Payout",
      className: "bg-color-rise-700 hover:bg-color-rise-600",
      position: "right",
      actionName: "buy_rise",
      contractType: "CALL"
    },
    {
      title: "Fall",
      label: "Payout",
      className: "bg-color-fall-700 hover:bg-color-fall-600",
      position: "left",
      actionName: "buy_fall",
      contractType: "PUT"
    }
  ]
}
```

## Trade Actions

### Action Handler Implementation

The trade actions system uses:

1. **Action Type Definition**: A union type of all possible trade actions
2. **Contract Type Mapping**: Automatically maps action names to contract types
3. **Zustand Store Integration**: Accesses trade parameters from the store
4. **Buy Contract Service**: Executes trades with proper formatting
5. **Toast Notifications**: Provides user feedback on trade execution

### Trade Actions Hook

The `useTradeActions` hook manages all trade actions and their integration with the store:

```typescript
export type TradeAction =
    | "buy_rise"
    | "buy_fall"
    | "buy_higher"
    | "buy_lower"
    | "buy_touch"
    | "buy_no_touch"
    | "buy_multiplier";

export const useTradeActions = () => {
    // Access trade parameters from store
    const { stake, duration, instrument } = useTradeStore();
    const { currency } = useClientStore();
    const { toast } = useToastStore();

    // Map action names to contract types
    const actionContractMap = Object.values(tradeTypeConfigs).reduce(
        (map, config) => {
            config.buttons.forEach((button) => {
                map[button.actionName] = button.contractType;
            });
            return map;
        },
        {} as Record<TradeAction, string>
    );

    // Define action handlers
    const actions: Record<TradeAction, () => Promise<void>> = {
        buy_rise: async () => {
            try {
                const response = await buyContract({
                    price: Number(stake),
                    duration: (() => {
                        const { value, type } = parseDuration(duration);
                        return formatDuration(Number(value), type);
                    })(),
                    instrument: instrument,
                    trade_type: actionContractMap.buy_rise,
                    currency,
                    payout: Number(stake),
                    strike: stake.toString(),
                });
                toast({
                    content: `Successfully bought ${response.trade_type} contract`,
                    variant: "success",
                });
            } catch (error) {
                toast({
                    content: error instanceof Error ? error.message : "Failed to buy contract",
                    variant: "error",
                });
            }
        },
        // ... other action handlers follow same pattern
    };

    return actions;
};
```

#### Hook Features

1. **Store Integration**

    - Uses `useTradeStore` for trade parameters (stake, duration, instrument)
    - Uses `useClientStore` for user settings (currency)
    - Uses `useToastStore` for notifications

2. **Contract Type Mapping**

    - Automatically maps action names to API contract types
    - Built from trade type configurations
    - Type-safe with TypeScript

3. **Action Handlers**

    - Each action is an async function
    - Handles parameter formatting
    - Manages API calls
    - Provides user feedback

4. **Error Handling**
    - Catches and formats API errors
    - Shows user-friendly messages
    - Maintains type safety

#### Using the Hook

```typescript
const TradeButton = () => {
  const actions = useTradeActions();

  return (
    <button onClick={actions.buy_rise}>
      Rise
    </button>
  );
};
```

### Contract Type Mapping

The hook automatically creates a map of actions to contract types:

```typescript
// Automatically created from trade type configurations
const actionContractMap = Object.values(tradeTypeConfigs).reduce(
    (map, config) => {
        config.buttons.forEach((button) => {
            map[button.actionName] = button.contractType;
        });
        return map;
    },
    {} as Record<TradeAction, string>
);
```

### API Integration

#### Buy Contract Service

The trade actions use the `buyContract` service to execute trades:

```typescript
const buyContract = async (data: BuyRequest): Promise<BuyResponse> => {
    try {
        const response = await apiClient.post<BuyResponse>("/buy", data);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error && (error as AxiosError).isAxiosError) {
            const axiosError = error as AxiosError<{ message: string }>;
            throw new Error(axiosError.response?.data?.message || "Failed to buy contract");
        }
        throw error;
    }
};
```

#### Request Parameters

When implementing a new trade action, the handler must provide:

```typescript
interface BuyRequest {
    price: number; // Trade stake amount
    duration: string; // Formatted duration string (e.g., "5t", "1h", "1d")
    instrument: string; // Trading instrument ID
    trade_type: string; // Contract type from configuration (e.g., "CALL", "PUT")
    currency: string; // Trading currency (e.g., "USD")
    payout: number; // Expected payout amount
    strike: string; // Strike price for the contract
}
```

#### Response Format

The buy service returns:

```typescript
interface BuyResponse {
    contract_id: string; // Unique identifier for the contract
    price: number; // Executed price
    trade_type: string; // The contract type that was bought
}
```

#### Parameter Formatting

The action handler automatically handles:

1. Duration formatting:

```typescript
const formattedDuration = (() => {
    const { value, type } = parseDuration(duration);
    return formatDuration(Number(value), type);
})();
```

2. Numeric conversions:

```typescript
price: Number(stake),
payout: Number(stake)
```

3. Contract type mapping:

```typescript
trade_type: actionContractMap[actionName]; // Maps action to API contract type
```

### Error Handling

Trade actions include comprehensive error handling:

```typescript
try {
    const response = await buyContract(params);
    toast(`Successfully bought ${response.trade_type} contract`, "success");
} catch (error) {
    toast(error instanceof Error ? error.message : "Failed to buy contract", "error");
}
```

## Performance Optimization

The `metadata` field allows for performance optimization:

```typescript
metadata: {
    preloadFields: boolean; // Preload field components when type selected
    preloadActions: boolean; // Preload action handlers
}
```

- Set `preloadFields: true` for commonly used trade types
- Set `preloadActions: true` for types needing immediate action availability
- Default to `false` for less common trade types

## Styling Guidelines

Button styling follows a consistent pattern:

```typescript
// Success/Buy/Rise buttons
className: "bg-color-rise-700 hover:bg-color-rise-600"

// Danger/Sell/Fall buttons
className: "bg-color-fall-700 hover:bg-color-fall-600"
```

## Best Practices

1. **Type Safety**

    - Use TypeScript interfaces for configuration
    - Add new action types to TradeAction type
    - Validate contract types against API documentation

2. **Performance**

    - Use preloading judiciously
    - Consider impact on initial load time
    - Test with performance monitoring

3. **Consistency**

    - Follow existing naming conventions
    - Use standard color schemes
    - Maintain button position conventions (buy/rise on right)

4. **Testing**
    - Add test cases for new trade types
    - Verify SSE integration
    - Test edge cases and error states

## Integration Points

The trade type configuration integrates with:

1. **Trade Form Controller**

    - Renders fields based on configuration
    - Handles layout and positioning
    - Manages component lifecycle

2. **Trade Actions**

    - Maps actions to API calls
    - Handles contract type specifics
    - Manages error states

3. **SSE Integration**

    - Real-time price updates
    - Contract-specific streaming
    - Error handling

4. **State Management**
    - Trade type selection
    - Field state management
    - Action state tracking

## Example: Adding a New Trade Type

Here's a complete example of adding a new "In/Out" trade type:

```typescript
in_out: {
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
      buy_in: "Payout (In)",
      buy_out: "Payout (Out)"
    }
  },
  buttons: [
    {
      title: "In",
      label: "Payout",
      className: "bg-color-rise-700 hover:bg-color-rise-600",
      position: "right",
      actionName: "buy_in",
      contractType: "EXPIN"
    },
    {
      title: "Out",
      label: "Payout",
      className: "bg-color-fall-700 hover:bg-color-fall-600",
      position: "left",
      actionName: "buy_out",
      contractType: "EXPOUT"
    }
  ]
}
```

## Troubleshooting

Common issues and solutions:

1. **Action not firing**

    - Verify action name is added to TradeAction type
    - Check action handler implementation
    - Verify contract type is valid

2. **Fields not showing**

    - Check fields configuration
    - Verify component lazy loading
    - Check for console errors

3. **Styling issues**
    - Verify className follows pattern
    - Check TailwindCSS configuration
    - Verify color scheme consistency

## Future Considerations

When adding new trade types, consider:

1. **API Compatibility**

    - Verify contract types with API
    - Check duration constraints
    - Validate stake limits

2. **Mobile Support**

    - Test responsive layout
    - Verify touch interactions
    - Check bottom sheet integration

3. **Performance Impact**
    - Monitor bundle size
    - Test loading times
    - Optimize where needed
