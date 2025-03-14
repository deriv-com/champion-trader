# Trade Types and Configuration Specification

## Overview
This document describes the configuration-driven approach to trade types in the Champion Trader platform. The system uses a flexible configuration system to define different binary options trade types, their parameters, and UI elements.

## Trade Type Definition
Trade types are defined in `src/config/tradeTypes.ts` using a TypeScript interface-based configuration system. Each trade type has a specific set of fields, buttons, and metadata that control its behavior and appearance.

## Adding New Trade Types
To add a new trade type to the system:
1. Define a new entry in the `tradeTypeConfigs` object in `tradeTypes.ts`
2. Configure the required fields, buttons, and payouts
3. Add any necessary metadata for optimization
4. Update the `TradeType` type to include the new trade type key

### Field Configuration
Each trade type can configure the following fields:
- `duration`: Boolean flag to enable/disable duration selection
- `stake`: Boolean flag to enable/disable stake input
- `allowEquals`: Optional boolean to enable/disable equals option

> **Note:** For implementation details of duration and stake controllers, refer to the [UI Components instruction](./4_ui_components.md#trade-related-components) document.

### Button Configuration
Trade buttons are configured with:
- `title`: Display text for the button
- `label`: Label for associated values (e.g., "Payout")
- `className`: CSS classes for styling
- `position`: Button position ("left" or "right")
- `actionName`: Associated action name for the button
- `contractType`: API contract type (e.g., "CALL", "PUT")

### Metadata
Metadata provides optimization hints:
- `preloadFields`: Whether to preload field components when trade type is selected
- `preloadActions`: Whether to preload action handlers

## Contract Types
The platform supports various contract types:
- `CALL`: Rise/Higher contracts
- `PUT`: Fall/Lower contracts
- `TOUCH`: Touch contracts
- `NOTOUCH`: No Touch contracts
- `MULTUP`: Multiplier contracts

## State Management Integration
Trade types interact with the application state through the trade store. The selected trade type determines which fields are displayed and how trade actions are processed.

> **Note:** For details on how trade types interact with state management, refer to the [State Management instruction](./3_state_management.md#trade-store) document.

## Trade Actions Integration

The `useTradeActions` hook (`src/hooks/useTradeActions.ts`) is a critical component that connects trade type configurations to API calls. This hook:

1. Maps action names from button configurations to contract types
2. Creates action handlers for each trade action
3. Executes API calls when trade buttons are clicked

### How Trade Actions Work

1. **Action Mapping**: The hook creates a map of action names to contract types by reading from the trade type configurations:
   ```typescript
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

2. **Action Handlers**: The hook defines handlers for each trade action that:
   - Format parameters (stake, duration, etc.)
   - Call the API to execute the trade
   - Handle success and error cases

3. **API Integration**: Currently, the `useTradeActions` hook directly calls the `buyContract` service function:
   ```typescript
   const response = await buyContract({
       amount: Number(stake),
       price: Number(stake),
       duration: formattedDuration,
       instrument_id: instrument,
       trade_type: actionContractMap.buy_rise,
       currency,
   });
   ```

### Implementing New Trade Actions

When adding a new trade type, you need to:

1. **Add the action name** to the `TradeAction` type:
   ```typescript
   export type TradeAction =
       | "buy_rise"
       | "buy_fall"
       // ... other actions
       | "your_new_action";
   ```

2. **Implement the action handler** in the `actions` object:
   ```typescript
   const actions: Record<TradeAction, () => Promise<void>> = {
       // ... existing actions
       your_new_action: async () => {
           try {
               const response = await buyContract({
                   amount: Number(stake),
                   price: Number(stake),
                   duration: (() => {
                       const { value, type } = parseDuration(duration);
                       return formatDuration(Number(value), type);
                   })(),
                   instrument_id: instrument,
                   trade_type: actionContractMap.your_new_action,
                   currency,
               });
               toast({
                   content: `Successfully bought contract #${response.contract_id}`,
                   variant: "success",
               });
           } catch (error) {
               toast({
                   content: error instanceof Error ? error.message : "Failed to buy contract",
                   variant: "error",
               });
           }
       },
   };
   ```

> **Note:** While the current implementation directly calls the `buyContract` service function, the recommended pattern is to use the `useBuyContract` hook from `src/hooks/contract/useContract.ts`. For details on the recommended API integration pattern, refer to the [API Integration instruction](./2_api.md#trade-actions-integration) document.

## Examples
Sample configuration for Rise/Fall trade type:
```typescript
rise_fall: {
    displayName: "Rise/Fall",
    fields: {
        duration: true,
        stake: true,
        allowEquals: false,
    },
    metadata: {
        preloadFields: true,
        preloadActions: true,
    },
    payouts: {
        max: true,
        labels: {
            buy_rise: "Payout (Rise)",
            buy_fall: "Payout (Fall)",
        },
    },
    buttons: [
        {
            title: "Rise",
            label: "Payout",
            className: "bg-color-solid-emerald-700 hover:bg-color-solid-emerald-600",
            position: "right",
            actionName: "buy_rise",
            contractType: "CALL",
        },
        {
            title: "Fall",
            label: "Payout",
            className: "bg-color-solid-cherry-700 hover:bg-color-solid-cherry-600",
            position: "left",
            actionName: "buy_fall",
            contractType: "PUT",
        },
    ],
}
```

## Complete Implementation Process

When adding a new trade type, follow these steps:

1. **Define the trade type configuration** in `src/config/tradeTypes.ts`
2. **Update the TradeAction type** in `useTradeActions.ts` to include your new action names
3. **Implement action handlers** in the trade actions hook

> **Note:** For details on how to implement UI components that interact with trade types (such as stake and duration controllers), refer to the [UI Components instruction](./4_ui_components.md#trade-related-components) document.

> **Note:** For details on how to manage trade-related state, refer to the [State Management instruction](./3_state_management.md#trade-store) document.

> **Note:** For details on how to implement API integration for trade actions, refer to the [API Integration instruction](./2_api.md#trade-actions-integration) document. Always use the provided API hooks rather than directly calling API service functions.

## API Integration

When implementing action handlers for a new trade type, you should use the API hooks pattern:

1. Use the `useBuyContract` hook from `src/hooks/contract/useContract.ts`
2. Implement your action handler to call the `mutate` function with the appropriate parameters
3. Handle success and error cases with toast notifications

> **Note:** For detailed examples and best practices for API integration, refer to the [API Integration instruction](./2_api.md#trade-actions-integration) document.

## Best Practices

1. **Naming Conventions**
   - Use snake_case for trade type keys (e.g., `rise_fall`, `touch_no_touch`)
   - Use camelCase for action names (e.g., `buyRise`, `buyFall`)
   - Follow existing patterns for consistency

2. **Button Positioning**
   - Place positive/buy/rise actions on the right
   - Place negative/sell/fall actions on the left
   - Maintain consistent positioning across trade types

3. **Color Schemes**
   - Use emerald colors for positive/buy/rise buttons
   - Use cherry colors for negative/sell/fall buttons
   - Follow the established color patterns

4. **Field Configuration**
   - Only enable fields that are relevant to the trade type
   - Consider mobile usability when adding multiple fields
   - Test field combinations thoroughly
