# BottomSheet Component

A mobile-first modal component that slides up from the bottom of the screen, providing a native-like sheet interface for content display and user interactions.

## Features

- Smooth animations
- Gesture support
- Backdrop interaction
- Multiple snap points
- Safe area handling
- Dynamic content

## Component Structure

```
BottomSheet/
├── BottomSheet.tsx        # Main component
├── BottomSheet.example.tsx # Usage examples
├── index.ts               # Exports
└── README.md             # This file
```

## Usage

```tsx
import { BottomSheet } from '@/components/BottomSheet';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      snapPoints={['25%', '50%', '90%']}
    >
      <div className="p-4">
        <h2>Bottom Sheet Content</h2>
        {/* Your content here */}
      </div>
    </BottomSheet>
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| isOpen | boolean | Controls sheet visibility |
| onClose | () => void | Close handler |
| children | ReactNode | Sheet content |
| snapPoints? | string[] | Array of height snap points |
| initialSnap? | number | Initial snap point index |
| enableDrag? | boolean | Enable drag gesture (default: true) |
| enableBackdropPress? | boolean | Enable closing on backdrop press (default: true) |
| className? | string | Optional CSS classes |

## Features

### Gestures
- Drag to expand/collapse
- Velocity-based animations
- Snap point detection
- Momentum scrolling
- Pull to refresh

### Positioning
- Multiple snap points
- Safe area awareness
- Keyboard avoidance
- Dynamic height

### Interactions
- Backdrop press
- Swipe to dismiss
- Content scrolling
- Nested scrolling

## Styling

The component uses TailwindCSS for styling:
- Smooth transitions
- Backdrop blur
- Border radius
- Shadow effects
- iOS/Android adaptations

## Best Practices

1. Use appropriate snap points
2. Handle content overflow
3. Consider keyboard interaction
4. Implement loading states
5. Follow atomic design principles
6. Maintain test coverage

## Platform Considerations

### iOS
- Bottom safe area
- Native-like bounce
- Momentum scrolling
- Sheet appearance

### Android
- Material Design
- System back button
- Touch feedback
- Sheet behavior

## Examples

### Basic Usage
```tsx
<BottomSheet isOpen={isOpen} onClose={handleClose}>
  <div>Basic Content</div>
</BottomSheet>
```

### With Snap Points
```tsx
<BottomSheet
  isOpen={isOpen}
  onClose={handleClose}
  snapPoints={['25%', '50%', '75%']}
  initialSnap={1}
>
  <div>Snappable Content</div>
</BottomSheet>
```

## Related Components

- Modal: Full-screen modal
- Drawer: Side drawer
- Dialog: Alert dialogs
- NotificationProvider: Notifications
