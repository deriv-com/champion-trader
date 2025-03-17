# Position State Components

This directory contains reusable UI components for displaying different states in position-related views.

## Components

### PositionLoadingState

A component for displaying a loading indicator while position data is being fetched.

```tsx
<PositionLoadingState 
  message="Loading positions..." // Optional, defaults to "Loading positions..."
  className="flex items-center justify-center" // Optional, additional CSS classes
/>
```

### PositionErrorState

A component for displaying error messages when position data fetching fails.

```tsx
<PositionErrorState 
  error={positionsError} // Required, error object with a message property
  className="flex items-center justify-center" // Optional, additional CSS classes
/>
```

### PositionEmptyState

A component for displaying an empty state when no positions are available.

```tsx
<PositionEmptyState
  positionType="open" // Required, the type of positions ("open" or "closed")
  icon={<CustomIcon />} // Optional, defaults to Briefcase icon
  className="flex items-center justify-center" // Optional, additional CSS classes
/>
```

### PositionMapper

A component for mapping through position data and rendering each position using a render prop.

```tsx
<PositionMapper
  positions={positions} // Required, array of position objects
  positionType="open" // Required, the type of positions ("open" or "closed")
  className="space-y-4" // Optional, additional CSS classes for the container
  containerProps={{ id: "positions-list" }} // Optional, additional props for the container
  renderPosition={(position, index) => (
    // Required, render function for each position
    <div key={position.contract_id}>
      {/* Your custom position rendering */}
    </div>
  )}
/>
```

### PositionProfitLoss

A component for displaying the total profit/loss information.

```tsx
<PositionProfitLoss
  totalProfitLoss="10.50" // Required, the total profit/loss value as a string
  containerClassName="p-4 bg-theme-secondary" // Optional, additional CSS classes for the container
  labelClassName="text-theme font-semibold" // Optional, additional CSS classes for the label
  valueClassName="font-bold" // Optional, additional CSS classes for the value
  currency="USD" // Optional, defaults to "USD"
/>
```

## Usage

These components are used in:

1. `src/screens/PositionsPage/PositionsPage.tsx`
2. `src/components/Sidebar/positions/components/PositionsPanel.tsx`

They help maintain consistency across the application and follow the DRY (Don't Repeat Yourself) principle by eliminating code duplication.
