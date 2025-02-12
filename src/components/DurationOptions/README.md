# Duration Options Component (Legacy)

> **Note**: This is a legacy component that will be deprecated. New implementations should use the `Duration` component instead.

## Overview

The Duration Options component was the original implementation for trade duration selection in the Champion Trader application. While still functional, it is being phased out in favor of the new `Duration` component which provides enhanced functionality and better user experience.

## Component Structure

```
DurationOptions/
├── DurationOptions.tsx   # Main component (Legacy)
├── index.ts            # Public exports
└── __tests__/         # Test suite
    └── DurationOptions.test.tsx
```

## Current Status

This component is maintained for backward compatibility but is scheduled for deprecation. All new features and improvements are being implemented in the new `Duration` component.

### Migration Plan

If you're currently using this component, plan to migrate to the new `Duration` component which offers:
- Enhanced duration selection interface
- Better mobile responsiveness
- Improved error handling
- More flexible configuration options
- Better TypeScript support

## Legacy Usage

```typescript
import { DurationOptions } from '@/components/DurationOptions';

function TradePage() {
  return (
    <div>
      <DurationOptions
        value={duration}
        onChange={handleDurationChange}
      />
    </div>
  );
}
```

## Features

- Basic duration selection
- Simple validation
- Standard form integration

## Implementation Details

The component follows basic React patterns:
- Controlled component behavior
- Form integration
- Basic error handling

### Props

```typescript
interface DurationOptionsProps {
  value: number;
  onChange: (duration: number) => void;
  disabled?: boolean;
}
```

## Testing

While the component maintains test coverage, new test cases are being added to the new `Duration` component instead.

## Deprecation Timeline

1. Current: Maintained for backward compatibility
2. Next Release: Mark as deprecated in documentation
3. Future Release: Remove component and migrate all usages to new `Duration` component

## Migration Guide

To migrate to the new `Duration` component:

1. Import the new component:
```typescript
import { DurationController } from '@/components/Duration';
```

2. Update the implementation:
```typescript
// Old implementation
<DurationOptions
  value={duration}
  onChange={handleDurationChange}
/>

// New implementation
<DurationController
  value={duration}
  onChange={handleDurationChange}
  options={durationOptions}
/>
```

3. Update any tests to use the new component's API

For detailed migration instructions, refer to the [Duration component documentation](../Duration/README.md).
