# Stake Component

A component for managing trade stake amounts with real-time payout calculations that adapts to different trade types.

## Structure

```
src/components/Stake/
├── StakeController.tsx       # Main controller component
├── components/
│   ├── StakeInput.tsx       # Input with +/- buttons
│   └── PayoutDisplay.tsx    # Dynamic payout information display
└── index.ts                 # Exports
```

## Usage

```tsx
import { StakeController } from "@/components/Stake";

// In your component:
<StakeController onClose={() => {/* handle close */}} />
```

## Features

- Stake amount input with increment/decrement buttons
- Currency display (USD)
- Dynamic payout display based on trade type:
  - Configurable payout labels per button
  - Optional max payout display
  - Support for multiple payout values
- Responsive design (mobile/desktop layouts)
- Input validation
- Debounced updates
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

Uses the global trade store for stake and payout management:

```typescript
const { 
  stake, 
  setStake,
  payouts: { max, values }
} = useTradeStore();
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
