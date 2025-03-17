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

## Usage

These components are used in:

1. `src/screens/PositionsPage/PositionsPage.tsx`
2. `src/components/Sidebar/positions/components/PositionsContent.tsx`

They help maintain consistency across the application and follow the DRY (Don't Repeat Yourself) principle by eliminating code duplication.
