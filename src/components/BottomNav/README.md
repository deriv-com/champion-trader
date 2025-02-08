# Bottom Navigation Component

A responsive bottom navigation bar component for the Champion Trader application that provides primary navigation on mobile devices.

## Overview

The Bottom Navigation component implements a mobile-first navigation interface that adapts based on the user's authentication status and device type. It follows atomic component design principles and is implemented using Test-Driven Development (TDD).

## Component Structure

```
BottomNav/
├── BottomNav.tsx    # Main component
├── index.ts        # Public exports
└── __tests__/     # Test suite
    └── BottomNav.test.tsx
```

## Usage

```typescript
import { BottomNav } from '@/components/BottomNav';

function App() {
  return (
    <div>
      <main>{/* Main content */}</main>
      <BottomNav />
    </div>
  );
}
```

## Features

- Responsive mobile-first design
- Authentication-aware navigation
- Smooth transitions and animations
- Active route highlighting
- Device-type specific rendering

## Implementation Details

The component follows atomic design principles:
- Self-contained navigation logic
- Independent state management
- Clear prop interfaces
- Comprehensive test coverage

### State Management

The component manages:
- Authentication state via clientStore
- Active route state
- Device type detection
- Navigation state

### Navigation Items

Navigation items are conditionally rendered based on authentication status:

```typescript
interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  requiresAuth: boolean;
}
```

## Testing

The component includes comprehensive tests following TDD methodology:
- Unit tests for navigation logic
- Authentication state tests
- Device type rendering tests
- Route handling tests
- Transition animation tests

## Best Practices

- Uses TailwindCSS for consistent styling
- Implements proper cleanup for event listeners
- Handles all authentication states
- Provides clear visual feedback
- Maintains accessibility standards
- Supports keyboard navigation

## Responsive Design

The component implements responsive behavior:
- Full-width on mobile devices
- Hidden on desktop (uses side navigation instead)
- Adapts to device orientation changes
- Handles safe area insets on mobile devices
