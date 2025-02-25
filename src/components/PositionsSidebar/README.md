# PositionsSidebar Component

A sidebar component that displays and manages trading positions, including both open and closed positions. It provides filtering capabilities and real-time updates of position statuses.

## Features

- Tab switching between open and closed positions
- Dynamic filtering:
  - Trade type filtering for open positions
  - Time period filtering for closed positions
- Real-time position updates
- Total profit/loss display
- Responsive layout with proper overflow handling

## Component Structure

```
PositionsSidebar/
├── components/
│   └── FilterDropdown.tsx    # Reusable dropdown for position filtering
├── hooks/
│   └── useFilteredPositions.ts   # Custom hook for position filtering logic
├── positionsSidebarStub.ts   # Stub data and types
├── PositionsSidebar.tsx      # Main component
└── README.md                 # This file
```

## Usage

```tsx
import { PositionsSidebar } from '@/components/PositionsSidebar';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <PositionsSidebar
      isOpen={isSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
    />
  );
}
```

## Props

### PositionsSidebar

| Prop | Type | Description |
|------|------|-------------|
| isOpen | boolean | Controls the visibility of the sidebar |
| onClose | () => void | Callback function when closing the sidebar |

### FilterDropdown

| Prop | Type | Description |
|------|------|-------------|
| isOpenTab | boolean | Determines filter options (trade types vs time periods) |
| selectedFilter | string | Currently selected filter value |
| onFilterSelect | (filter: string) => void | Callback when a filter is selected |

## Custom Hooks

### useFilteredPositions

Custom hook that manages position filtering logic.

```tsx
const { filteredPositions, selectedFilter, handleFilterSelect } = useFilteredPositions({
  isOpenTab,
  allPositions,
  closedPositions,
});
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| isOpenTab | boolean | Current tab state |
| allPositions | Position[] | List of all open positions |
| closedPositions | Position[] | List of all closed positions |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| filteredPositions | Position[] | Filtered list of positions |
| selectedFilter | string | Currently selected filter |
| handleFilterSelect | (filter: string) => void | Filter selection handler |

## Types

```typescript
interface Position {
  id: number;
  type: string;
  market: string;
  ticks: string;
  stake: string;
  profit: string;
}
```

## Constants

```typescript
const TRADE_TYPES = [
  "Rise/Fall",
  "Multiplier",
  "Even/Odd",
  "Over/Under",
  "Touch/No Touch"
] as const;

const TIME_PERIODS = [
  "All time",
  "Today",
  "Yesterday",
  "Last 7 days",
  "Last 30 days",
  "Last 60 days",
  "Last 90 days"
] as const;
```

## Styling

The component uses TailwindCSS for styling with a responsive layout:
- Fixed header and footer
- Scrollable content area
- Smooth transitions for opening/closing
- Proper spacing and alignment

## Testing

The component includes comprehensive test coverage:
- Component rendering
- Tab switching
- Filter functionality
- Position display
- Navigation
- Outside click handling

Example test:
```typescript
describe("PositionsSidebar", () => {
  it("renders correctly when open", () => {
    render(<PositionsSidebar isOpen={true} onClose={() => {}} />);
    expect(screen.getByText("Positions")).toBeInTheDocument();
  });
});
```

## Best Practices

1. Always provide both isOpen and onClose props
2. Handle outside clicks for closing
3. Manage proper cleanup of event listeners
4. Use proper TypeScript types for props and data
5. Follow atomic design principles
6. Maintain test coverage for all features

## Related Components

- MarketInfo: Displays market information
- TradeButton: Initiates trades
- ContractDetailsPage: Shows detailed contract information
