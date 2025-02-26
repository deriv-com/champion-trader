# MarketInfo Component

A component that displays comprehensive market information including market name, current price, and other relevant market data.

## Features

- Market name and icon display
- Real-time price updates
- Market status indicator
- Price movement indicators
- Responsive design

## Component Structure

```
MarketInfo/
├── MarketInfo.tsx    # Main component
├── index.ts         # Exports
└── README.md        # This file
```

## Usage

```tsx
import { MarketInfo } from '@/components/MarketInfo';

function TradingView() {
  return (
    <MarketInfo
      symbol="frxEURUSD"
      name="EUR/USD"
      price="1.2345"
      change="+0.0012"
      isOpen={true}
    />
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| symbol | string | Market symbol identifier |
| name | string | Display name of the market |
| price | string | Current market price |
| change | string | Price change value |
| isOpen | boolean | Market open/closed status |
| className? | string | Optional CSS classes |

## Features

### Price Display
- Current price with proper formatting
- Price change indicator (positive/negative)
- Price movement animation

### Market Status
- Open/Closed indicator
- Trading hours (if applicable)
- Market restrictions

### Real-time Updates
- Price updates
- Status changes
- Movement indicators

## State Management

The component integrates with market data stores:
- Price updates
- Market status
- Trading hours

## Styling

The component uses TailwindCSS for styling:
- Responsive layout
- Price movement animations
- Status indicators
- Proper spacing and alignment

## Best Practices

1. Handle loading states
2. Show proper error messages
3. Maintain responsive design
4. Clean up subscriptions
5. Follow atomic design principles
6. Maintain test coverage

## Error States

The component handles various error states:
- Connection issues
- Invalid market data
- Market closure
- Trading restrictions

## Related Components

- Chart: Displays market price chart
- MarketSelector: Market selection interface
- PositionsSidebar: Shows positions for the market
- TradeButton: Initiates trades for the market
