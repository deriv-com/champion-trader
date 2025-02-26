# SideNav Component

A navigation component that provides the main application navigation structure with support for both collapsed and expanded states.

## Features

- Collapsible navigation
- Icon and text labels
- Active route highlighting
- Nested menu items
- Responsive design
- Smooth transitions

## Component Structure

```
SideNav/
├── MenuSidebar.tsx   # Menu content component
├── SideNav.tsx       # Main navigation component
├── index.ts          # Exports
└── README.md         # This file
```

## Usage

```tsx
import { SideNav } from '@/components/SideNav';

function Layout() {
  return (
    <div className="app-layout">
      <SideNav />
      <main>{/* Content */}</main>
    </div>
  );
}
```

## Components

### SideNav

Main navigation component that handles the navigation structure.

#### Props
None - The component uses internal state management.

### MenuSidebar

Component that renders the menu content.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| isCollapsed | boolean | Whether the sidebar is collapsed |
| onToggle | () => void | Callback to toggle collapse state |

## Features

### Navigation Structure
- Primary navigation items
- Secondary items
- Nested menu support
- Icon-only mode when collapsed

### State Management
- Collapse state
- Active route
- Menu expansion
- Route history

### Interactions
- Hover expand
- Click navigation
- Touch support
- Keyboard navigation

## Styling

The component uses TailwindCSS for styling:
- Smooth transitions
- Hover effects
- Active states
- Responsive layout
- Proper spacing

## Navigation Items

Example structure:
```typescript
const navItems = [
  {
    label: 'Trade',
    icon: TradeIcon,
    path: '/trade',
  },
  {
    label: 'Positions',
    icon: PositionsIcon,
    path: '/positions',
  },
  // ...
];
```

## Best Practices

1. Keep navigation structure flat
2. Use clear icons and labels
3. Handle route changes properly
4. Maintain responsive behavior
5. Follow atomic design principles
6. Maintain test coverage

## Accessibility

The component implements:
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support
- High contrast support

## Related Components

- MenuSidebar: Expanded menu content
- BottomNav: Mobile navigation
- Header: Top navigation
- PositionsSidebar: Trading positions panel
