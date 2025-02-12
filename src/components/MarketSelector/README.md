# Market Selector Component

A responsive market selection interface that adapts between desktop and mobile views.

## Components

### MarketSelector
The main controller component that manages the market selection interface.

```typescript
import { MarketSelector } from '@/components/MarketSelector';

<MarketSelector 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

#### Props
- `isOpen`: boolean - Controls the visibility of the market selector
- `onClose`: () => void - Callback function when the selector is closed

#### Responsive Behavior
- **Desktop**: Renders as a LeftSidebar component
- **Mobile**: Uses BottomSheet component via bottomSheetStore

### MarketSelectorList
The main content component that displays the list of markets with search and filtering capabilities.

### MarketIcon
Custom SVG icons for different market types:
- Volatility indices with candlestick pattern
- Boom indices with upward trend
- Crash indices with downward trend
- Support for 1s badge on applicable markets

## Features

### Market Categories
- All markets
- Favorites (persistent storage)
- Derived (Synthetic indices)
- Forex
- Crash/Boom indices
- Stocks & indices
- Commodities

### Market Display
- Custom icons per market type
- Market symbol and name
- Market status (open/closed)
- Favorite status
- Market grouping by type

### Search and Filtering
- Real-time search across all markets
- Filter by market category
- Show/hide closed markets
- Favorites filtering

### Responsive Design
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
  displayName: string;   // Formatted name (e.g., "Volatility 100 Index")
  shortName: string;     // Short identifier (e.g., "100", "EUR")
  market_name: string;   // Market category
  isOneSecond: boolean;  // Whether it's a 1-second market
  isClosed?: boolean;    // Market availability status
  type: "volatility" | "boom" | "crash"; // Icon type
}
```

## State Management

The component integrates with several stores:
- `bottomSheetStore`: Manages mobile bottom sheet display
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
   - Persistent storage in localStorage
   - Immediate UI updates
   - Clear favorite/unfavorite feedback

4. **Performance**:
   - Efficient filtering
   - Smooth transitions
   - Optimized re-renders
   - Lazy loading where applicable

5. **Responsive Behavior**:
   - Use useDeviceDetection for viewport detection
   - Smooth transitions between views
   - Consistent behavior across devices
   - Proper touch interaction on mobile

## Error Handling

The component handles various states:
- Loading state with spinner
- Error state with message
- Empty search results
- Network errors
- Invalid market data
- Fallback to stub data when API fails

## Accessibility

- Keyboard navigation support
- ARIA labels
- Focus management
- Screen reader friendly structure
- Touch targets for mobile

## Styling

The component uses Tailwind CSS for styling with:
- Responsive design
- Smooth transitions
- Custom market icons
- Consistent theming
- Mobile-first approach
