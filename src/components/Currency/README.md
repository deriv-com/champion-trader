# Currency Component

A component that provides currency-related functionality, primarily focused on displaying currency icons and formatting.

## Components

### CurrencyIcon

A component that renders currency icons based on the provided currency code.

## Usage

```tsx
import { CurrencyIcon } from '@/components/Currency/CurrencyIcon';

function App() {
  return (
    <div>
      <CurrencyIcon currency="USD" />
      <span>1,000.00 USD</span>
    </div>
  );
}
```

## Props

### CurrencyIcon

| Prop | Type | Description |
|------|------|-------------|
| currency | string | The currency code (e.g., "USD", "EUR") |
| className? | string | Optional CSS classes for styling |

## Styling

The component uses TailwindCSS for styling:
- Proper icon sizing
- Consistent alignment with text
- Responsive scaling

## Best Practices

1. Always provide a valid currency code
2. Use with appropriate text size and alignment
3. Consider accessibility for icon display
4. Follow atomic design principles
5. Maintain test coverage

## Related Components

- BalanceDisplay: Uses CurrencyIcon for balance display
- Stake: Uses CurrencyIcon in stake input
- TradeFields: Incorporates currency display in trade parameters
