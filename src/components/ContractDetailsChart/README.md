# ContractDetailsChart Component

A specialized chart component for displaying detailed contract information and price movements. This component extends the base Chart functionality with contract-specific features, including markers for entry/exit points, time lines, and barriers.

## Features

- Real-time contract data updates via contract service
- Contract entry and exit points visualization with spot markers
- Start time, end time, and purchase time line markers
- Profit/Loss indicators with color coding
- Contract barrier lines
- Responsive design for desktop and mobile
- Error boundary protection
- Dark/Light theme support
- Loading and error states handling

## Component Structure

```
ContractDetailsChart/
├── ChartErrorBoundary.tsx         # Error handling wrapper
├── ContractDetailsChart.tsx       # Main chart component
├── ContractDetailsChartExample.tsx # Example usage component
├── MarkerLine.tsx                 # Line marker component
├── SpotMarker.tsx                 # Spot marker component
├── contract-details-chart.css     # Component-specific styles
├── index.tsx                      # Exports
└── README.md                      # This file
```

## Usage

### Basic Usage with Contract ID

The component can fetch contract data automatically when provided with a contract ID:

```tsx
import { ContractDetailsChart } from '@/components/ContractDetailsChart';

function ContractDetails() {
  return (
    <ContractDetailsChart
      contractId="123456"
      accountId="active_account_id"
      isReplay={true}
    />
  );
}
```

### Manual Data Usage

You can also provide the contract data manually:

```tsx
import { ContractDetailsChart } from '@/components/ContractDetailsChart';

function ContractDetails() {
  return (
    <ContractDetailsChart
      symbol="R_100"
      startTime={1647852000} // Unix timestamp in seconds
      endTime={1647855600}
      entrySpot={1234.56}
      exitSpot={1245.67}
      barriers={[
        {
          barrier: 1240.00,
          color: '#4CAF50',
          label: 'Target'
        }
      ]}
      isReplay={true}
    />
  );
}
```

## Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| contractId | string | Unique identifier for the contract | undefined |
| accountId | string | Account ID to use for fetching contract data | 'active_account_id' |
| symbol | string | Trading symbol (e.g., "R_100") | "1HZ100V" |
| startTime | number | Contract start time (Unix timestamp in seconds) | undefined |
| endTime | number | Contract end time (Unix timestamp in seconds) | undefined |
| entrySpot | number | Entry spot price | undefined |
| exitSpot | number | Exit spot price | undefined |
| barriers | Array<{barrier: number, color: string, label?: string}> | Array of barrier objects | [] |
| isReplay | boolean | Whether to show the chart in replay mode | true |
| isVerticalScrollDisabled | boolean | Whether to disable vertical scrolling | false |
| is_dark_theme | boolean | Whether to use dark theme | false |
| is_accumulator_contract | boolean | Whether the contract is an accumulator contract | false |
| is_reset_contract | boolean | Whether the contract is a reset contract | false |

## Error Handling

The component includes a ChartErrorBoundary that:
- Catches and handles chart-related errors
- Displays user-friendly error messages
- Provides a retry button for failed data fetching
- Prevents app crashes
- Logs errors for debugging

```tsx
// This is done automatically when you import from the index file
import { WrappedContractDetailsChart } from '@/components/ContractDetailsChart';

function ContractDetails() {
  return <WrappedContractDetailsChart contractId="123456" />;
}
```

## Features

### Contract Data Integration
- Automatic fetching of contract data using contract service
- Real-time updates via SSE (Server-Sent Events)
- Proper cleanup of subscriptions on unmount

### Contract Visualization
- Entry spot marker with price label
- Exit spot marker with price and profit/loss
- Start time, end time, and purchase time line markers
- Barrier lines for relevant contract types
- Color coding for win/loss status

### Chart Markers
- Customizable spot markers for entry, exit, and intermediate points
- Line markers for significant time points
- Support for different contract types (vanilla, accumulator, ticks, etc.)

### Interactivity
- Zoom controls
- Price tooltips
- Responsive design for different screen sizes
- Loading and error states

## Styling

The component uses TailwindCSS for layout and styling:
- Responsive container sizing
- Proper spacing and padding
- Consistent colors for indicators
- Dark/Light theme support
- Custom CSS for chart-specific elements

## Best Practices

1. Always use the wrapped component from the index file for error boundary protection
2. Provide a contractId when possible for automatic data fetching
3. Handle loading and error states appropriately
4. Clean up subscriptions on unmount (done automatically)
5. Follow atomic design principles
6. Maintain test coverage

## Related Components and Utilities

- Chart: Base chart component
- SmartChart: Chart library integration
- contractApi: Utilities for fetching and processing contract data
- chart-marker-helpers: Utilities for creating chart markers
- chart-markers: Utilities for managing chart markers
