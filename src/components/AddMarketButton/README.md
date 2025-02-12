# Add Market Button Component

A button component that enables users to add and select trading markets in the Champion Trader application.

## Overview

The Add Market Button component provides functionality for market selection and addition. It follows atomic component design principles and is implemented using Test-Driven Development (TDD).

## Component Structure

```
AddMarketButton/
├── AddMarketButton.tsx   # Main component
├── index.ts             # Public exports
└── __tests__/          # Test suite
    └── AddMarketButton.test.tsx
```

## Usage

```typescript
import { AddMarketButton } from '@/components/AddMarketButton';

function TradePage() {
  const handleMarketSelect = (market: Market) => {
    // Handle market selection
  };

  return (
    <div>
      <AddMarketButton onSelect={handleMarketSelect} />
    </div>
  );
}
```

## Features

- Market selection interface
- Real-time market data via SSE
- Responsive design with TailwindCSS
- Error handling for market data fetching
- Loading states and animations

## Implementation Details

The component follows atomic design principles:
- Self-contained market selection logic
- Independent state management
- Clear prop interfaces
- Comprehensive test coverage

### Props

```typescript
interface AddMarketButtonProps {
  onSelect: (market: Market) => void;
  disabled?: boolean;
  className?: string;
}
```

### State Management

The component manages:
- Market selection state
- Loading states
- Error states
- UI interaction states

## Testing

The component includes comprehensive tests following TDD methodology:
- Unit tests for selection functionality
- Integration tests for SSE market data
- Error handling test cases
- UI interaction tests
- Loading state tests

## Best Practices

- Uses TailwindCSS for consistent styling
- Implements proper cleanup for SSE connections
- Handles all error cases gracefully
- Provides clear feedback for user actions
- Maintains accessibility standards
