# TradeTypesListController Component

A controller component that fetches and displays available trade types as a tab list, allowing users to select different trading modes.

## Features

- Fetches available trade types from the API
- Displays trade types as selectable tabs
- Manages selection state through Zustand store
- Handles loading and error states with skeleton UI
- Updates global trade type state on selection

## Usage

```tsx
import { TradeTypesListController } from '@/screens/TradePage/components/TradeTypesListController';

function TradePage() {
  return (
    <div className="trade-page">
      <TradeTypesListController />
      {/* Other trade components */}
    </div>
  );
}
```

## State Management

The component uses Zustand for state management:
- Trade type selection state via `useTradeStore`
- Local loading and error states

## Loading State

When loading, the component displays skeleton loaders to indicate content is being fetched:
- Uses the `Skeleton` component with rounded styling
- Displays multiple skeleton items to represent the tab list

## Error Handling

Provides user feedback when trade types cannot be loaded:
- Displays error message
- Logs detailed error information to console

## Dependencies

- `@/services/api/rest/product/service` - For fetching trade products
- `@/components/ui/tab-list` - For rendering the tab interface
- `@/stores/tradeStore` - For managing selected trade type
- `@/components/ui/skeleton` - For loading state visualization
