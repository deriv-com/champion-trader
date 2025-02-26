# ContractDetailsChart Component

A specialized chart component for displaying detailed contract information and price movements. This component extends the base Chart functionality with contract-specific features.

## Features

- Real-time price updates
- Contract entry and exit points visualization
- Profit/Loss indicators
- Contract barrier lines
- Responsive design
- Error boundary protection

## Component Structure

```
ContractDetailsChart/
├── ChartErrorBoundary.tsx    # Error handling wrapper
├── ContractDetailsChart.tsx  # Main chart component
├── index.tsx                # Exports
└── README.md                # This file
```

## Usage

```tsx
import { ContractDetailsChart } from '@/components/ContractDetailsChart';

function ContractDetails() {
  return (
    <ContractDetailsChart
      contractId="123"
      symbol="frxEURUSD"
      granularity={60}
    />
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| contractId | string | Unique identifier for the contract |
| symbol | string | Trading symbol (e.g., "frxEURUSD") |
| granularity | number | Chart time granularity in seconds |
| height? | number | Optional chart height (default: 300) |
| width? | number | Optional chart width (default: 100%) |

## Error Handling

The component includes a ChartErrorBoundary that:
- Catches and handles chart-related errors
- Displays user-friendly error messages
- Prevents app crashes
- Logs errors for debugging

```tsx
<ChartErrorBoundary>
  <ContractDetailsChart {...props} />
</ChartErrorBoundary>
```

## Features

### Price Updates
- Real-time price streaming
- Smooth chart updates
- Historical data loading

### Contract Visualization
- Entry point marker
- Exit point (if contract closed)
- Barrier lines for relevant contract types
- Profit/Loss region shading

### Interactivity
- Zoom controls
- Price tooltips
- Time period selection
- Chart type switching

## Styling

The component uses TailwindCSS for layout and styling:
- Responsive container sizing
- Proper spacing and padding
- Consistent colors for indicators
- Dark/Light theme support

## Best Practices

1. Always wrap with ChartErrorBoundary
2. Provide appropriate granularity for contract type
3. Handle loading and error states
4. Clean up subscriptions on unmount
5. Follow atomic design principles
6. Maintain test coverage

## Related Components

- Chart: Base chart component
- MarketInfo: Displays market information
- PositionsSidebar: Lists trading positions
