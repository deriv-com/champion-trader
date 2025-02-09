# Component Architecture

This directory contains React components following Test-Driven Development (TDD) and Atomic Component Design principles. The components are organized to be modular, self-contained, and independently testable.

## Component Organization

```
components/
├── AddMarketButton/    # Market selection functionality
├── BalanceDisplay/     # Displays user balance
├── BalanceHandler/     # Manages balance state
├── BottomNav/          # Bottom navigation bar
├── BottomSheet/        # Bottom sheet
├── Chart/              # Trading chart visualization
├── Duration/          # Trade duration selection
├── SideNav/           # Side navigation
├── Stake/            # Trade stake selection
│   ├── components/   # Stake subcomponents
│   ├── hooks/       # SSE integration
│   └── utils/       # Validation utils
├── TradeButton/        # Trade execution controls
├── TradeFields/        # Trade parameter inputs
└── ui/                 # Shared UI components
```

## Design Principles

1. **Test-Driven Development (TDD)**
   - Write tests before implementation (Red phase)
   - Implement minimal code to pass tests (Green phase)
   - Refactor while maintaining test coverage
   - Test edge cases and error scenarios
   - Maintain minimum 90% test coverage

2. **Atomic Design**
   - Components are built from smallest to largest
   - Each component has a single responsibility
   - Components are self-contained with their own styles and logic
   - No implicit dependencies on parent components
   - Clear and documented interfaces

3. **Styling**
   - Uses TailwindCSS for consistent styling
   - Styles are encapsulated within components
   - Follows utility-first CSS principles
   - Theme-aware using Tailwind variables

4. **State Management**
   - Local state for component-specific logic
   - Zustand for shared/global state
   - Props for component configuration
   - Clear state ownership and data flow

## Component Guidelines

1. **File Structure**
   ```
   ComponentName/
   ├── ComponentName.tsx       # Main component implementation
   ├── ComponentName.test.tsx  # Component tests (written first)
   ├── index.ts               # Public exports
   └── README.md              # Component documentation
   ```

2. **Test-First Implementation**
   ```typescript
   // ComponentName.test.tsx
   import { render, screen, fireEvent } from '@testing-library/react';
   import { ComponentName } from './ComponentName';

   describe('ComponentName', () => {
     describe('when initialized', () => {
       it('should render with default props', () => {
         render(<ComponentName />);
         expect(screen.getByRole('button')).toBeInTheDocument();
       });

       it('should handle required props correctly', () => {
         const onAction = jest.fn();
         render(<ComponentName onAction={onAction} />);
         expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
       });
     });

     describe('when interacting', () => {
       it('should handle user interactions', () => {
         const onAction = jest.fn();
         render(<ComponentName onAction={onAction} />);
         fireEvent.click(screen.getByRole('button'));
         expect(onAction).toHaveBeenCalled();
       });
     });

     describe('when in error state', () => {
       it('should display error message', () => {
         render(<ComponentName error="Error message" />);
         expect(screen.getByText('Error message')).toBeInTheDocument();
       });
     });
   });
   ```

3. **Component Implementation**
   ```typescript
   interface ComponentProps {
     onAction?: () => void;
     error?: string;
     disabled?: boolean;
   }

   export function ComponentName({ 
     onAction,
     error,
     disabled = false 
   }: ComponentProps) {
     return (
       <div className="relative">
         <button
           type="button"
           onClick={onAction}
           disabled={disabled}
           className={cn(
             "px-4 py-2 rounded",
             "bg-primary text-white",
             "hover:bg-primary-dark",
             "disabled:opacity-50",
             "transition-colors"
           )}
         >
           Click me
         </button>
         {error && (
           <p className="text-red-500 text-sm mt-1">{error}</p>
         )}
       </div>
     );
   }
   ```

## Best Practices

1. **Component Design**
   - Keep components focused and single-purpose
   - Use TypeScript interfaces for props
   - Implement proper error boundaries
   - Handle loading and error states
   - Document component APIs

2. **Testing**
   - Write tests first (TDD)
   - Test component rendering
   - Test user interactions
   - Test error states
   - Test edge cases
   - Mock external dependencies
   - Use meaningful test descriptions
   - Group related tests logically

3. **Performance**
   - Implement lazy loading where appropriate
   - Memoize expensive calculations
   - Optimize re-renders using React.memo when needed
   - Clean up effects and subscriptions

4. **Accessibility**
   - Use semantic HTML elements
   - Include ARIA attributes where necessary
   - Ensure keyboard navigation support
   - Maintain proper color contrast
   - Test with screen readers

5. **Code Quality**
   - Follow consistent naming conventions
   - Document complex logic
   - Write comprehensive tests
   - Use proper TypeScript types
   - Keep components small and focused
   - Use meaningful variable names

## Example Implementation

```typescript
// Button.test.tsx
describe('Button', () => {
  it('should render with primary variant by default', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');
  });
});

// Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit';
}

export function Button({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  loading = false,
  type = 'button'
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'px-4 py-2 rounded transition-colors',
        {
          'bg-primary text-white hover:bg-primary-dark': variant === 'primary',
          'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
          'opacity-50 cursor-not-allowed': disabled || loading
        }
      )}
    >
      {loading ? (
        <span className="flex items-center">
          <LoadingSpinner className="mr-2" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
