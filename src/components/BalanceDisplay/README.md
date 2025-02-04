# BalanceDisplay Component

The BalanceDisplay component is responsible for presenting the user's current balance in a clear and concise manner.

## Features
- Displays the current balance along with the currency.
- Integrates with the clientStore for real-time updates.
- Built following atomic component design principles.

## Props
- **balance**: *number* — The current balance value.
- **currency**: *string* — The currency symbol or code (e.g., USD, EUR).

## Usage Example

```tsx
import { BalanceDisplay } from '@/components/BalanceDisplay';

function App() {
  return (
    <div>
      <BalanceDisplay balance={1000} currency="USD" />
    </div>
  );
}

export default App;
```

## Testing
- Unit tests are located in the __tests__ folder (`__tests__/BalanceDisplay.test.tsx`), covering rendering scenarios and prop validations.

## Integration Notes
- This component retrieves balance data from the global clientStore.
- Designed with TDD in mind, ensuring reliability and ease of maintenance.
