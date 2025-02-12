# Trade Button Components

A collection of button components for executing trades in the Champion Trader application.

## Overview

The Trade Button directory contains two main components:
- `Button`: A base button component with trade-specific styling
- `TradeButton`: A specialized button for trade execution with advanced features

## Component Structure

```
TradeButton/
├── Button.tsx         # Base button component
├── TradeButton.tsx    # Trade execution button
├── index.ts          # Public exports
└── __tests__/       # Test suite
    └── TradeButton.test.tsx
```

## Usage

### Base Button

```typescript
import { Button } from '@/components/TradeButton';

function TradeForm() {
  return (
    <Button
      onClick={handleClick}
      variant="primary"
      disabled={isLoading}
    >
      Execute Trade
    </Button>
  );
}
```

### Trade Button

```typescript
import { TradeButton } from '@/components/TradeButton';

function TradePage() {
  return (
    <TradeButton
      onTrade={handleTrade}
      price={currentPrice}
      loading={isProcessing}
    />
  );
}
```

## Features

### Base Button
- Multiple variants (primary, secondary)
- Loading state handling
- Disabled state styling
- Touch-optimized feedback
- Consistent TailwindCSS styling

### Trade Button
- Real-time price updates
- Trade execution handling
- Loading and error states
- Price change animations
- Comprehensive validation

## Implementation Details

Both components follow atomic design principles:
- Self-contained functionality
- Independent state management
- Clear prop interfaces
- Comprehensive test coverage

### Props

#### Button Props
```typescript
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}
```

#### Trade Button Props
```typescript
interface TradeButtonProps {
  onTrade: (params: TradeParams) => Promise<void>;
  price: number;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}
```

## State Management

The TradeButton component manages:
- Trade execution state
- Price update animations
- Loading states
- Error handling
- Validation state

## Testing

Components include comprehensive tests following TDD methodology:
- Unit tests for button functionality
- Integration tests for trade execution
- Price update animation tests
- Error handling test cases
- Loading state tests
- Validation logic tests

## Best Practices

- Uses TailwindCSS for consistent styling
- Implements proper loading states
- Handles all error cases gracefully
- Provides clear visual feedback
- Maintains accessibility standards
- Supports keyboard interaction

## Animation and Interaction

The components implement several interaction patterns:
- Price change animations
- Loading state transitions
- Click/touch feedback
- Error state indicators
- Disabled state styling

## Accessibility

Both components maintain high accessibility standards:
- Proper ARIA attributes
- Keyboard navigation support
- Clear focus indicators
- Screen reader support
- Color contrast compliance
