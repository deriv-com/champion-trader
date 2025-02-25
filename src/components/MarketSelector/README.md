# MarketSelector Component

A component that enables users to browse, search, and select trading markets with comprehensive market information display.

## Features

- Market list display
- Market search
- Category filtering
- Market details preview
- Favorites management
- Real-time updates

## Component Structure

```
MarketSelector/
├── components/
├── MarketSelector.tsx       # Main component
├── MarketSelectorButton.tsx # Selection trigger
├── MarketSelectorList.tsx   # Market list display
├── MarketIcon.tsx          # Market icon component
├── data.ts                 # Market data types
├── marketIcons.ts          # Icon mappings
├── marketSelectorStub.ts   # Test data
├── index.ts                # Exports
└── README.md               # This file
```

## Usage

```tsx
import { MarketSelector } from '@/components/MarketSelector';

function TradingView() {
  const handleMarketSelect = (market: Market) => {
    console.log('Selected market:', market);
  };

  return (
    <MarketSelector
      onSelect={handleMarketSelect}
      defaultMarket="frxEURUSD"
    />
  );
}
```

## Props

### MarketSelector

| Prop | Type | Description |
|------|------|-------------|
| onSelect | (market: Market) => void | Market selection handler |
| defaultMarket? | string | Initial selected market |
| className? | string | Optional CSS classes |

### MarketSelectorButton

| Prop | Type | Description |
|------|------|-------------|
| selected | Market | Currently selected market |
| onClick | () => void | Click handler |
| className? | string | Optional CSS classes |

## Features

### Market Display
- Market name and symbol
- Market category
- Trading hours
- Market status
- Price information

### Filtering & Search
- Category filters
- Search by name/symbol
- Recent markets
- Favorite markets

### Market Information
- Current price
- Price change
- Trading status
- Market restrictions

## Styling

The component uses TailwindCSS for styling:
- Responsive layout
- Search input styling
- List virtualization
- Market card design
- Status indicators

## State Management

The component manages:
- Selected market
- Search query
- Filter state
- Favorites list
- Recent selections

## Best Practices

1. Implement search debouncing
2. Handle loading states
3. Show error messages
4. Cache market data
5. Follow atomic design principles
6. Maintain test coverage

## Error Handling

The component handles:
- Invalid market data
- Search errors
- Network issues
- Market restrictions
- Invalid selections

## Related Components

- MarketInfo: Displays market details
- Chart: Shows market price chart
- TradeButton: Initiates trades
- PositionsSidebar: Shows market positions
