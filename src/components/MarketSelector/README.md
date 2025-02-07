# Market Selector Component

A comprehensive market selection interface that allows users to browse, search, and favorite different trading markets.

## Components

### 1. MarketSelector
The main controller component that manages the bottom sheet display.

```typescript
import { MarketSelector } from '@/components/MarketSelector';

<MarketSelector 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

Props:
- `isOpen`: boolean - Controls the visibility of the market selector
- `onClose`: () => void - Callback function when the selector is closed

### 2. MarketSelectorList
The main content component that displays the list of markets with search and filtering capabilities.

Features:
- Search functionality
- Category filtering
- Favorites management
- Market grouping
- Loading states
- Error handling

### 3. MarketSelectorButton
A button component that triggers the market selector.

## Features

### Market Categories
- All markets
- Favorites
- Derived (Synthetic indices)
- Forex
- Stocks & indices
- Commodities

### Market Display
- Market symbol
- Display name
- Market status (open/closed)
- Favorite status
- Market grouping by type

### Search and Filtering
- Real-time search across all markets
- Filter by market category
- Show/hide closed markets
- Favorites filtering

### Favorites Management
- Add/remove markets from favorites
- Persistent storage in localStorage
- Dedicated favorites tab

## Usage

```typescript
import { MarketSelector } from '@/components/MarketSelector';
import { useState } from 'react';

const TradingPage = () => {
  const [isMarketSelectorOpen, setIsMarketSelectorOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsMarketSelectorOpen(true)}>
        Select Market
      </button>

      <MarketSelector
        isOpen={isMarketSelectorOpen}
        onClose={() => setIsMarketSelectorOpen(false)}
      />
    </div>
  );
};
```

## Market Data Structure

```typescript
interface ProcessedInstrument {
  symbol: string;        // Market symbol (e.g., "R_100", "EURUSD")
  displayName: string;   // Formatted name (e.g., "Volatility 100 Index", "EUR/USD")
  shortName: string;     // Short identifier (e.g., "100", "EUR")
  market_name: string;   // Market category (e.g., "synthetic_index", "forex")
  isOneSecond: boolean;  // Whether it's a 1-second market
  isClosed?: boolean;    // Market availability status
}
```

## Styling

The component uses Tailwind CSS for styling with the following features:
- Responsive design
- Smooth scrolling
- Custom scrollbar hiding
- Hover effects
- Active state indicators
- Loading animations

## State Management

The component integrates with several stores:
- `bottomSheetStore`: Manages the bottom sheet display
- `tradeStore`: Handles market selection
- Local state for:
  - Active tab
  - Search query
  - Favorites list

## Best Practices

1. **Market Selection**:
   - Validate market availability before selection
   - Prevent selection of closed markets
   - Provide clear feedback on selection

2. **Search Implementation**:
   - Case-insensitive search
   - Search across display names
   - Clear search option
   - "No results" feedback

3. **Favorites Management**:
   - Persistent storage
   - Immediate UI updates
   - Clear favorite/unfavorite feedback

4. **Performance**:
   - Efficient filtering
   - Smooth scrolling
   - Optimized re-renders
   - Lazy loading where applicable

## Error Handling

The component handles various states:
- Loading state with spinner
- Error state with message
- Empty search results
- Network errors
- Invalid market data

## Accessibility

- Keyboard navigation support
- ARIA labels
- Focus management
- Clear visual indicators
- Screen reader friendly structure
