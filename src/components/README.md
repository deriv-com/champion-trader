# Component Architecture

This directory contains React components following Atomic Component Design principles. The components are organized to be modular, self-contained, and independently testable.

## Component Organization

```
components/
├── AddMarketButton/    # Market selection functionality
├── BottomNav/          # Bottom navigation bar
├── BottomSheet/        # Bottom sheet
├── Chart/              # Trading chart visualization
├── DurationOptions/    # Trade duration selection
├── TradeButton/        # Trade execution controls
├── TradeFields/        # Trade parameter inputs
└── ui/                 # Shared UI components
```

## Design Principles

1. **Atomic Design**
   - Components are built from smallest to largest
   - Each component has a single responsibility
   - Components are self-contained with their own styles and logic

2. **Styling**
   - Uses TailwindCSS for consistent styling
   - Styles are encapsulated within components
   - Follows utility-first CSS principles

3. **State Management**
   - Local state for component-specific logic
   - Zustand for shared/global state
   - Props for component configuration

4. **Testing**
   - Each component has its own test suite
   - Tests cover component rendering and interactions
   - Mock external dependencies when needed

## Component Guidelines

1. **File Structure**
   ```
   ComponentName/
   ├── ComponentName.tsx    # Main component implementation
   ├── index.ts            # Public exports
   └── __tests__/          # Test files
       └── ComponentName.test.tsx
   ```

2. **Component Implementation**
   ```typescript
   import { useState } from 'react';
   import { cn } from '@/lib/utils';

   interface ComponentProps {
     // Props interface
   }

   export function Component({ ...props }: ComponentProps) {
     // Implementation
   }
   ```

3. **Testing Pattern**
   ```typescript
   import { render, screen } from '@testing-library/react';
   import { Component } from './Component';

   describe('Component', () => {
     it('should render correctly', () => {
       render(<Component />);
       // Assertions
     });
   });
   ```

## Best Practices

1. **Component Design**
   - Keep components focused and single-purpose
   - Use TypeScript interfaces for props
   - Implement proper error boundaries
   - Handle loading and error states

2. **Performance**
   - Implement lazy loading where appropriate
   - Memoize expensive calculations
   - Optimize re-renders using React.memo when needed

3. **Accessibility**
   - Use semantic HTML elements
   - Include ARIA attributes where necessary
   - Ensure keyboard navigation support
   - Maintain proper color contrast

4. **Code Quality**
   - Follow consistent naming conventions
   - Document complex logic
   - Write comprehensive tests
   - Use proper TypeScript types
