# Stake Component

A component for managing trade stake amounts with real-time payout calculations that adapts to different trade types.

## Structure

The Stake component follows a clean architecture pattern with clear separation of concerns, mirroring the Duration component pattern:

```
src/components/Stake/
├── StakeController.tsx      # Business logic and state management
├── components/
│   ├── StakeInputLayout.tsx # Layout for stake input and payout
│   ├── StakeInput.tsx      # Input with +/- buttons
│   └── PayoutDisplay.tsx   # Dynamic payout information display
├── hooks/
│   └── useStakeSSE.ts      # SSE integration for real-time updates
├── utils/
│   ├── duration.ts         # Duration-related utilities
│   └── validation.ts       # Input validation utilities
└── index.ts                # Exports
```

### Component Responsibilities

- **StakeController**: Business logic, state management, and validation
- **StakeInputLayout**: Layout component that composes StakeInput and PayoutDisplay
- **StakeInput**: Input field component with increment/decrement buttons
- **PayoutDisplay**: Payout information display component
- **useStakeSSE**: Hook for real-time stake and payout updates via SSE
- **duration.ts**: Utilities for duration-related calculations and validations
- **validation.ts**: Input validation and error handling utilities

## Usage

```tsx
import { StakeController } from "@/components/Stake";

// In your component:
<StakeController />

// StakeController internally manages:
// - Real-time updates via SSE
// - Input validation and error states
// - Duration calculations
// - Mobile/desktop layouts
```

## Features

- Stake amount input with increment/decrement buttons
- Currency display (USD)
- Dynamic payout display based on trade type:
  - Configurable payout labels per button
  - Optional max payout display
  - Support for multiple payout values
- Real-time updates via SSE:
  - Automatic payout recalculation
  - Debounced stake updates
  - Error handling and retry logic
- Comprehensive validation:
  - Min/max stake amounts
  - Duration-based restrictions
  - Input format validation
- Responsive design (mobile/desktop layouts)
- Integration with trade store

## PayoutDisplay Component

The PayoutDisplay component renders payout information based on the current trade type configuration:

```tsx
// Example trade type configuration
{
  payouts: {
    max: true,  // Show max payout
    labels: {
      buy_rise: "Payout (Rise)",
      buy_fall: "Payout (Fall)"
    }
  }
}

// Component automatically adapts to configuration
<PayoutDisplay hasError={hasError} />
```

Features:
- Dynamic rendering based on trade type
- Configurable labels from trade type config
- Error state handling
- Responsive layout

## Configuration

### Stake Settings

Stake settings are configured in `src/config/stake.ts`:

```typescript
{
  min: 1,            // Minimum stake amount
  max: 50000,        // Maximum stake amount
  step: 1,           // Increment/decrement step
  currency: "USD"    // Currency display
}
```

### Payout Configuration

Payout display is configured through the trade type configuration:

```typescript
// In tradeTypes.ts
{
  payouts: {
    max: boolean,     // Show/hide max payout
    labels: {         // Custom labels for each button
      [actionName: string]: string
    }
  }
}
```

## State Management

Uses the global trade store and SSE integration for stake and payout management:

```typescript
// Trade store integration
const { 
  stake, 
  setStake,
  payouts: { max, values }
} = useTradeStore();

// SSE integration
const { 
  payouts,
  isLoading,
  error 
} = useStakeSSE({
  stake,
  duration,
  contractType
});
```

## Mobile vs Desktop

- Mobile: Shows in bottom sheet with save button
- Desktop: Shows in dropdown with auto-save on change

## Best Practices

1. **Payout Display**
   - Use clear, consistent labels
   - Show appropriate error states
   - Handle loading states gracefully
   - Consider mobile/desktop layouts

2. **Trade Type Integration**
   - Follow trade type configuration
   - Handle dynamic number of payouts
   - Support custom labels
   - Consider max payout visibility

3. **Error Handling**
   - Show validation errors clearly
   - Handle API errors gracefully
   - Maintain consistent error states
   - Implement retry logic for SSE failures

4. **Real-time Updates**
   - Debounce stake input changes
   - Handle SSE connection issues
   - Show loading states during updates
   - Validate incoming data

5. **Duration Integration**
   - Validate duration constraints
   - Update payouts on duration changes
   - Handle special duration cases
   - Consider timezone effects

6. **Input Validation**
   - Use validation utilities consistently
   - Show clear error messages
   - Prevent invalid submissions
   - Handle edge cases
