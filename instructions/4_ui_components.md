# UI Component System Specification

## Atomic Design Overview
The Champion Trader platform implements the atomic design methodology, organizing components into a hierarchical structure from simple to complex. This approach ensures consistency, reusability, and maintainability across the UI.

## Component Hierarchy
Components are organized into the following hierarchy:

1. **Atoms**: Fundamental building blocks
   - Buttons, inputs, labels, icons
   - Self-contained with minimal dependencies
   - Examples: `Button`, `Input`, `Icon`

2. **Molecules**: Groups of atoms functioning together
   - Form fields, card headers, navigation items
   - Composed of multiple atoms
   - Examples: `FormField`, `CardHeader`, `NavItem`

3. **Organisms**: Complex UI sections
   - Forms, cards, navigation bars
   - Composed of molecules and atoms
   - Examples: `TradeForm`, `MarketCard`, `Navbar`

4. **Templates**: Page layouts
   - Define content structure
   - Arrange organisms into a complete interface
   - Examples: `TradePageTemplate`, `PortfolioPageTemplate`

5. **Pages**: Specific instances of templates
   - Implement templates with real content
   - Handle data fetching and state
   - Examples: `TradePage`, `PortfolioPage`

## Component Organization
Components are organized by feature and type:

```
src/
├── components/
│   ├── AddMarketButton/     # Feature-specific component
│   ├── Chart/               # Feature-specific component
│   ├── Duration/            # Feature-specific component
│   ├── Stake/               # Feature-specific component
│   │   ├── components/      # Sub-components
│   │   ├── hooks/           # Component-specific hooks
│   │   └── utils/           # Component-specific utilities
│   ├── ThemeProvider/       # Theme management component
│   └── ui/                  # Shared UI components (atoms)
│       ├── Button/
│       ├── Input/
│       └── Card/
```

## Theme System
The platform implements a flexible theming system with:

1. **Theme Provider**: Centralized theme management via `ThemeProvider` component
2. **Light/Dark Modes**: Support for both light and dark color schemes
3. **Theme Configuration**: Theme constants and values defined in a central location
4. **CSS Variables**: Dynamic theme values using CSS variables
5. **Consistent Styling**: Application of consistent styling across components

Theming is integrated directly into the component layer:
```tsx
// Example of ThemeProvider usage
function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes />
      </Router>
    </ThemeProvider>
  );
}
```

## Responsive Design
The platform implements a responsive design approach:

1. **Mobile-First**: Components are designed for mobile first, then enhanced for larger screens
2. **Breakpoints**: Standard breakpoints for different device sizes
3. **Fluid Layouts**: Layouts adapt to different screen sizes
4. **Responsive Typography**: Font sizes adjust based on screen size
5. **Touch Optimization**: UI elements are optimized for touch on mobile devices

Responsive design is implemented using:
- TailwindCSS responsive utilities
- CSS media queries
- React hooks for device detection

## Device Detection
Device detection is implemented using:

```typescript
// src/hooks/useDeviceDetection.ts
export function useDeviceDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return { isMobile, isTablet, isDesktop };
}
```

## Lazy Loading
The platform implements lazy loading for components:

1. **Route-Based**: Components are loaded when their route is accessed
2. **Component-Based**: Complex components are loaded on demand
3. **Preloading**: Critical components are preloaded based on user interactions
4. **Suspense**: React Suspense is used for loading states

Example of lazy loading:
```typescript
import React, { lazy, Suspense } from 'react';

const Chart = lazy(() => import('@/components/Chart'));

function TradePage() {
  return (
    <div>
      <Suspense fallback={<ChartSkeleton />}>
        <Chart />
      </Suspense>
    </div>
  );
}
```

## Styling Approach
The platform uses TailwindCSS for styling:

1. **Utility-First**: Components use utility classes for styling
2. **Theme Configuration**: Custom theme configuration in `tailwind.config.cjs`
3. **Dark Mode**: Support for light and dark modes
4. **Custom Utilities**: Extended utilities for platform-specific needs
5. **Component Classes**: Reusable component classes for consistent styling

Example of styled component:
```tsx
function Button({ variant = 'primary', children }) {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-md font-medium',
        {
          'bg-color-solid-emerald-700 text-white': variant === 'primary',
          'bg-color-solid-cherry-700 text-white': variant === 'danger',
          'bg-gray-200 text-gray-800': variant === 'secondary',
        }
      )}
    >
      {children}
    </button>
  );
}
```

## Accessibility
The platform follows accessibility best practices:

1. **Semantic HTML**: Using appropriate HTML elements
2. **ARIA Attributes**: Adding ARIA attributes where needed
3. **Keyboard Navigation**: Ensuring keyboard navigability
4. **Focus Management**: Proper focus handling
5. **Color Contrast**: Meeting WCAG color contrast requirements
6. **Screen Reader Support**: Ensuring screen reader compatibility

## Component Documentation
Each component includes:

1. **Props Documentation**: TypeScript interfaces for props
2. **Usage Examples**: Example usage code
3. **Variants**: Documentation of component variants
4. **Accessibility Notes**: Accessibility considerations
5. **Test Coverage**: Test coverage information

Example of component documentation:
```typescript
/**
 * Button component for user interactions
 * 
 * @example
 * <Button variant="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 * 
 * @accessibility
 * - Uses proper button element
 * - Includes focus states
 * - Color contrast meets WCAG AA standards
 */
interface ButtonProps {
  /** The button's visual style */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Function called when button is clicked */
  onClick: () => void;
  /** Button content */
  children: React.ReactNode;
  /** Whether the button is disabled */
  disabled?: boolean;
}
