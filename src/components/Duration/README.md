# Duration Component

## Overview
The Duration component is a comprehensive solution for handling trade duration selection in the Champion Trader application. It provides an intuitive interface for users to select trade durations across different time units with configurable ranges and API integration support.

## Architecture

### Main Components
- `DurationController`: The main controller component that orchestrates duration selection
- `DurationValueList`: Displays and manages the selection of specific duration values
- `HoursDurationValue`: Special component for handling hour-based durations with minute precision

### Configuration
Duration ranges are centrally configured in `src/config/duration.ts`:
```typescript
export const DURATION_RANGES = {
  tick: { min: 1, max: 10 },
  second: { min: 15, max: 59 },
  minute: { min: 1, max: 59 },
  hour: { min: 1, max: 23, step: 1 },
  day: { min: 1, max: 30 }
};
```

### State Management
- Uses Zustand via `useTradeStore` for managing duration state
- Integrates with `useBottomSheetStore` for modal behavior
- Implements debounced updates for desktop to prevent excessive API calls

## Features
- Configurable duration ranges with min/max values
- Type-safe implementation using TypeScript
- Supports multiple duration types:
  - Ticks (1-10)
  - Seconds (15-59)
  - Minutes (1-59, with preset steps: 1, 2, 3, 5, 10, 15, 30, 45, 59)
  - Hours (1-23)
  - Days (1-30)
- Real-time duration updates with debouncing
- Responsive and accessible UI
- Different behaviors for desktop and mobile:
  - Desktop: Direct updates with debouncing
  - Mobile: Save button for explicit confirmation

## Usage

```tsx
import { DurationController } from '@/components/Duration';

const YourComponent = () => {
  return (
    <DurationController />
  );
};
```

## State Format
The duration state follows the format: `"<value> <type>"`, for example:
- "5 tick"
- "30 second"
- "15 minute"
- "2 hour"
- "1 day"

For hours, the format supports minute precision: "1:30 hour"

## API Integration
The component is designed for future API integration:
- Duration ranges will be fetched from the API
- Configuration structure matches expected API response
- Validation helpers ensure values stay within allowed ranges
- Type-safe interfaces for API responses

## Dependencies
- React
- Zustand (for state management)
- TailwindCSS (for styling)
- TypeScript (for type safety)

## Styling
The component uses TailwindCSS for styling with:
- Mobile-first design
- Different layouts for desktop/mobile
- Consistent spacing and typography
- Clear visual hierarchy
- Accessible color contrast

## Integration Points
- Integrates with the Trade Page for duration selection
- Works within the Bottom Sheet component for mobile interactions
- Connects with the global trade store for state management
- Prepared for future API integration
