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

## Field Configuration
Each trade type can configure the following fields:
- `duration`: Boolean flag to enable/disable duration selection
- `stake`: Boolean flag to enable/disable stake input
- `allowEquals`: Optional boolean to enable/disable equals option

## Button Configuration
Trade buttons are configured with:
- `title`: Display text for the button
- `label`: Label for associated values (e.g., "Payout")
- `className`: CSS classes for styling
- `position`: Button position ("left" or "right")
- `actionName`: Associated action name for the button
- `contractType`: API contract type (e.g., "CALL", "PUT")

## Metadata
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
