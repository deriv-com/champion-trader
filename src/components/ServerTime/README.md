# ServerTime Component

A component that displays and manages server time synchronization, ensuring accurate time display across the application.

## Features

- Real-time server time display
- Time synchronization
- Time format options
- Time zone handling
- Automatic updates

## Component Structure

```
ServerTime/
├── ServerTime.tsx    # Main component
├── index.ts         # Exports
└── README.md        # This file
```

## Usage

```tsx
import { ServerTime } from '@/components/ServerTime';

function Header() {
  return (
    <div className="header">
      <ServerTime format="HH:mm:ss" />
    </div>
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| format | string | Time format string (default: "HH:mm:ss") |
| className? | string | Optional CSS classes |
| showSeconds? | boolean | Whether to display seconds (default: true) |

## Features

### Time Display
- 24-hour format
- Optional seconds display
- Time zone indicator
- Synchronized with server

### Time Synchronization
- Regular server sync
- Drift correction
- Connection status handling
- Error recovery

## State Management

The component uses Zustand for state management:
- Server time
- Sync status
- Error states
- Update intervals

## Time Formats

Supported time formats:
```typescript
const formats = {
  full: "HH:mm:ss",
  short: "HH:mm",
  withDate: "DD/MM/YYYY HH:mm:ss"
};
```

## Styling

The component uses TailwindCSS for styling:
- Clean typography
- Status indicators
- Proper alignment
- Responsive text sizing

## Best Practices

1. Regular synchronization
2. Handle time zones properly
3. Show sync status
4. Error recovery
5. Follow atomic design principles
6. Maintain test coverage

## Error Handling

The component handles various scenarios:
- Connection issues
- Time drift
- Sync failures
- Invalid formats

## Related Components

- TradeButton: Uses server time for trade execution
- Chart: Time-based data display
- PositionsSidebar: Contract timing display
