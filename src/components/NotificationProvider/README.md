# Notification System

A flexible and configurable notification system built with Sonner toast and Zustand for state management.

## Features

- 🎯 Multiple notification types (success, error, info, warning)
- 🔄 Promise-based notifications for async operations
- ⚙️ Global configuration
- 🎨 Customizable styling with TailwindCSS
- 📱 Responsive design
- 💾 Persistent configuration
- 🔍 TypeScript support

## Installation

The notification system is already integrated into the application. The `NotificationProvider` is wrapped around the app in `App.tsx`.

## Usage

### Basic Usage

```typescript
import { useNotificationStore } from '@/stores/notificationStore';

const MyComponent = () => {
  const { success, error, info, warning } = useNotificationStore();

  const handleClick = () => {
    success('Success!', 'Operation completed successfully');
  };

  return <button onClick={handleClick}>Show Notification</button>;
};
```

### Notification Types

1. **Success Notification**
```typescript
const { success } = useNotificationStore();
success('Success!', 'Operation completed successfully');
```

2. **Error Notification**
```typescript
const { error } = useNotificationStore();
error('Error!', 'Something went wrong');
```

3. **Info Notification**
```typescript
const { info } = useNotificationStore();
info('Info', 'Here is some information');
```

4. **Warning Notification**
```typescript
const { warning } = useNotificationStore();
warning('Warning', 'Please be careful');
```

### Promise-Based Notifications

Perfect for async operations with loading, success, and error states:

```typescript
const { promise } = useNotificationStore();

const fetchData = async () => {
  try {
    await promise(
      api.getData(),
      {
        loading: 'Fetching data...',
        success: 'Data fetched successfully!',
        error: 'Failed to fetch data',
      }
    );
  } catch (error) {
    // Handle error
  }
};
```

### Configuration

You can configure the notification system globally:

```typescript
const { setConfig } = useNotificationStore();

setConfig({
  position: 'bottom-right',
  duration: 5000,
  closeButton: true,
  className: 'custom-class',
});
```

#### Available Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| position | ToastPosition | 'top-right' | Notification position |
| duration | number | 4000 | Display duration in ms |
| closeButton | boolean | true | Show close button |
| className | string | 'rounded-lg' | Custom CSS class |

Type `ToastPosition` = 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right' \| 'top-center' \| 'bottom-center'

## Implementation Details

### Components

1. **NotificationProvider**
```typescript
import { NotificationProvider } from '@/components/NotificationProvider';

// Wrap your app
<NotificationProvider>
  <App />
</NotificationProvider>
```

2. **NotificationStore**
```typescript
import { useNotificationStore } from '@/stores/notificationStore';

// Access notification methods
const { success, error, info, warning, promise, setConfig } = useNotificationStore();
```

### Styling

The notification system uses TailwindCSS for styling:

- Success notifications: Green theme
- Error notifications: Red theme
- Info notifications: Blue theme (`bg-blue-50`)
- Warning notifications: Yellow theme (`bg-yellow-50`)

## Best Practices

1. **Message Structure**
   - Title: Short and clear (first parameter)
   - Description: More detailed information (second parameter)
   ```typescript
   success('User Created', 'New user account was created successfully');
   ```

2. **Duration Guidelines**
   - Errors: Longer duration (5000ms+)
   - Success: Medium duration (3000-4000ms)
   - Info/Warning: Standard duration (3000ms)

3. **Promise Notifications**
   - Always provide all three states (loading, success, error)
   - Keep loading messages concise
   - Provide meaningful error messages

4. **Position Usage**
   - Use top positions for important messages
   - Use bottom positions for less critical information
   - Consider user interaction areas when choosing position

## Error Handling

```typescript
const handleSubmit = async (data: FormData) => {
  try {
    await promise(
      submitData(data),
      {
        loading: 'Submitting form...',
        success: 'Form submitted successfully!',
        error: 'Failed to submit form',
      }
    );
  } catch (err) {
    error('Error', err instanceof Error ? err.message : 'An unknown error occurred');
  }
};
```

## Testing

The notification system includes comprehensive tests:

- Store functionality tests
- Component rendering tests
- Configuration tests
- Integration tests

Run tests:
```bash
npm test src/components/NotificationProvider/__tests__
npm test src/stores/__tests__/notificationStore.test.ts
```

## Accessibility

- Color contrast compliance
- Screen reader support
- Keyboard navigation
- ARIA attributes
- Focus management

## Performance

- Efficient re-renders
- Debounced updates
- Cleanup on unmount
- Memory leak prevention
- Optimized state updates
