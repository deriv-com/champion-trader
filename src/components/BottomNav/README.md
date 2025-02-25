# BottomNav Component

A mobile-first navigation component that provides easy access to primary application features through a bottom navigation bar.

## Features

- Mobile-optimized navigation
- Icon and label display
- Active route indication
- Badge support
- Smooth transitions
- Touch-friendly design

## Component Structure

```
BottomNav/
├── BottomNav.tsx    # Main component
├── index.ts         # Exports
└── README.md        # This file
```

## Usage

```tsx
import { BottomNav } from '@/components/BottomNav';

function MobileLayout() {
  return (
    <div className="mobile-layout">
      <main>{/* Content */}</main>
      <BottomNav />
    </div>
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| className? | string | Optional CSS classes |
| items? | NavItem[] | Optional custom navigation items |

## Types

```typescript
interface NavItem {
  label: string;
  icon: IconComponent;
  path: string;
  badge?: number | string;
}
```

## Features

### Navigation Items
- Icon representation
- Text labels
- Active state
- Optional badges
- Touch targets

### Interactions
- Touch feedback
- Active highlighting
- Route transitions
- Badge updates

### Responsive Behavior
- Portrait/Landscape handling
- Safe area support
- Keyboard awareness
- Gesture handling

## Styling

The component uses TailwindCSS for styling:
- Mobile-first design
- Touch-friendly sizing
- Active states
- Badge styling
- iOS/Android adaptations

## State Management

The component integrates with:
- Route management
- Badge updates
- Device orientation
- Keyboard visibility

## Best Practices

1. Use clear, recognizable icons
2. Keep labels short and clear
3. Ensure adequate touch targets
4. Handle safe areas properly
5. Follow atomic design principles
6. Maintain test coverage

## Accessibility

The component implements:
- ARIA roles
- Touch targets
- Focus indicators
- Screen reader support
- High contrast modes

## Platform Considerations

### iOS
- Safe area insets
- Bottom sheet interaction
- Gesture handling
- Native-like feel

### Android
- Material Design alignment
- Back button handling
- Navigation patterns
- System UI integration

## Related Components

- SideNav: Desktop navigation
- MenuSidebar: Expanded menu
- Header: Top navigation
- PositionsSidebar: Trading panel
