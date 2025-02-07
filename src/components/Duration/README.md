# Duration Component

## Overview
The Duration component is a comprehensive solution for handling trade duration selection in the Champion Trader application. It provides an intuitive interface for users to select trade durations across different time units (ticks, seconds, minutes, hours, and days).

## Architecture

### Main Components
- `DurationController`: The main controller component that orchestrates duration selection
- `DurationTabList`: Handles the selection of duration types (tick, second, minute, hour, day)
- `DurationValueList`: Displays and manages the selection of specific duration values
- `HoursDurationValue`: Special component for handling hour-based durations with minute precision

### State Management
- Uses Zustand via `useTradeStore` for managing duration state
- Integrates with `useBottomSheetStore` for modal behavior

## Features
- Supports multiple duration types:
  - Ticks (1-5)
  - Seconds (1-60)
  - Minutes (1, 2, 3, 5, 10, 15, 30)
  - Hours (1, 2, 3, 4, 6, 8, 12, 24)
  - Days (1)
- Real-time duration updates
- Responsive and accessible UI
- Integration with bottom sheet for mobile-friendly interaction

## Usage

```tsx
import { DurationController } from '@/components/Duration';

// Inside your component
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

## Test Coverage
The component is thoroughly tested with Jest and React Testing Library, covering:
- Component rendering
- Duration type selection
- Duration value selection
- State management integration
- UI interactions

## Dependencies
- React
- Zustand (for state management)
- TailwindCSS (for styling)
- Primary Button component

## Styling
The component uses TailwindCSS for styling with a focus on:
- Mobile-first design
- Consistent spacing and typography
- Clear visual hierarchy
- Accessible color contrast

## Integration Points
- Integrates with the Trade Page for duration selection
- Works within the Bottom Sheet component for mobile interactions
- Connects with the global trade store for state management
