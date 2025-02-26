# NotificationProvider Component

A component that manages and displays various types of notifications across the application, providing consistent user feedback.

## Features

- Multiple notification types
- Customizable duration
- Animation effects
- Queue management
- Position control
- Auto-dismiss

## Component Structure

```
NotificationProvider/
├── NotificationProvider.tsx  # Main component
├── index.ts                 # Exports
└── README.md                # This file
```

## Usage

```tsx
import { NotificationProvider, useNotification } from '@/components/NotificationProvider';

// Wrap your app
function App() {
  return (
    <NotificationProvider>
      <YourApp />
    </NotificationProvider>
  );
}

// Use in components
function YourComponent() {
  const { showNotification } = useNotification();

  const handleAction = () => {
    showNotification({
      type: 'success',
      message: 'Action completed successfully',
      duration: 3000
    });
  };

  return <button onClick={handleAction}>Do Action</button>;
}
```

## Props

### NotificationProvider

| Prop | Type | Description |
|------|------|-------------|
| position? | 'top' \| 'bottom' | Notification position (default: 'top') |
| maxNotifications? | number | Maximum concurrent notifications (default: 3) |
| children | ReactNode | Application components |

### Notification Options

| Option | Type | Description |
|--------|------|-------------|
| type | 'success' \| 'error' \| 'warning' \| 'info' | Notification type |
| message | string | Notification message |
| duration? | number | Display duration in ms (default: 3000) |
| action? | { label: string; onClick: () => void } | Optional action button |

## Features

### Notification Types
- Success notifications
- Error notifications
- Warning notifications
- Info notifications

### Queue Management
- Maximum notifications limit
- FIFO queue system
- Auto-dismiss older notifications
- Manual dismiss support

## Styling

The component uses TailwindCSS for styling:
- Type-based colors
- Smooth animations
- Responsive design
- Proper spacing
- Accessible contrast

## Best Practices

1. Keep messages concise
2. Use appropriate type
3. Set reasonable duration
4. Handle queue properly
5. Follow atomic design principles
6. Maintain test coverage

## Error Handling

The component handles:
- Invalid notification types
- Queue overflow
- Animation interruptions
- Component unmounting

## Related Components

- ToastProvider: Alternative notification system
- ErrorBoundary: Error handling
- LoadingIndicator: Loading states
