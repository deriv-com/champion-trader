# TradeButton Component

A critical component that handles trade execution, providing users with the ability to place trades with proper validation and feedback.

## Features

- Trade execution
- Price validation
- Loading states
- Error handling
- Success feedback
- Responsive design

## Component Structure

```
TradeButton/
├── TradeButton.tsx   # Main component
└── README.md        # This file
```

## Usage

```tsx
import { TradeButton } from '@/components/TradeButton';

function TradeForm() {
  return (
    <TradeButton
      type="RISE"
      amount={100}
      duration={5}
      durationUnit="m"
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| type | TradeType | Type of trade (RISE, FALL, etc.) |
| amount | number | Trade stake amount |
| duration | number | Trade duration value |
| durationUnit | string | Duration unit (s, m, h, d) |
| onSuccess? | (response: TradeResponse) => void | Success callback |
| onError? | (error: Error) => void | Error callback |
| disabled? | boolean | Disable button state |
| className? | string | Optional CSS classes |

## Features

### Trade Execution
- Price validation before execution
- Server time synchronization
- Rate limiting
- Duplicate prevention

### State Management
- Loading state during execution
- Success/Error states
- Disabled state handling
- Price update tracking

### Validation
- Amount limits
- Duration constraints
- Market availability
- Account restrictions

## Styling

The component uses TailwindCSS for styling:
- State-based colors
- Loading animation
- Hover/Active states
- Disabled appearance
- Responsive sizing

## States

The button handles multiple states:
```typescript
type ButtonState = 
  | 'idle'      // Ready for trade
  | 'loading'   // Processing trade
  | 'success'   // Trade executed
  | 'error'     // Trade failed
  | 'disabled'  // Cannot trade
```

## Best Practices

1. Validate all inputs before execution
2. Show clear feedback states
3. Handle all error cases
4. Prevent duplicate submissions
5. Follow atomic design principles
6. Maintain test coverage

## Error Handling

The component handles various scenarios:
- Network errors
- Invalid parameters
- Market closure
- Insufficient balance
- Rate limiting
- Server errors

## Related Components

- Stake: Provides trade amount
- Duration: Sets trade duration
- MarketInfo: Shows market status
- PositionsSidebar: Displays executed trades
