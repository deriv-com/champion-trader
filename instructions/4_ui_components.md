# UI Component System Specification

## Atomic Design Overview
The Champion Trader platform implements the atomic design methodology, organizing components into a hierarchical structure from simple to complex. This approach ensures consistency, reusability, and maintainability across the UI.

## Component Development Rules

When creating or modifying components, follow these rules:

1. **Documentation**
   - Update this instruction file when adding new components
   - Add the component to the Component Hierarchy section
   - Include a brief description in the Component Organization section

2. **Component Structure**
   - Create a dedicated folder for each component
   - Include an index.ts file for exports
   - Add a README.md with usage examples
   - Write unit tests in a __tests__ folder

3. **Component Prologue**
   - Add JSDoc comments with component description
   - Document props with TypeScript interfaces
   - Include usage examples
   - Add accessibility notes

4. **Security**
   - Sanitize all user inputs
   - Avoid using dangerouslySetInnerHTML
   - Use DOMPurify for any HTML rendering
   - Prevent XSS attacks in user-generated content

5. **Accessibility**
   - Use semantic HTML elements
   - Include ARIA attributes where needed
   - Ensure keyboard navigation works
   - Maintain proper focus management
   - Meet WCAG AA contrast requirements

6. **Performance**
   - Implement lazy loading for complex components
   - Optimize re-renders with memoization
   - Keep component dependencies minimal
   - Use code splitting for large components

7. **Testing**
   - Write unit tests for all components
   - Test accessibility with axe-core
   - Include visual regression tests
   - Test across different screen sizes

8. **Styling**
   - Use TailwindCSS utility classes
   - Follow the project's color scheme
   - Implement responsive design
   - Support dark mode where appropriate

## Component Hierarchy
```
src/components/
├── AccountSwitcher/                  # Account selection and management
│   ├── AccountInfo.tsx               # Displays account information
│   ├── AccountSwitcher.tsx           # Allows switching between accounts
│   └── index.ts                      # Export file
├── AddMarketButton/                  # Market addition functionality
│   ├── AddMarketButton.tsx           # Button to add markets to watchlist
│   └── index.ts                      # Export file
├── BottomNav/                        # Mobile bottom navigation
│   ├── BottomNav.tsx                 # Bottom navigation bar component
│   └── index.ts                      # Export file
├── BottomSheet/                      # Mobile bottom sheet UI
│   ├── BottomSheet.tsx               # Sliding bottom sheet component
│   └── index.ts                      # Export file
├── Chart/                            # Price chart components
│   ├── Chart.tsx                     # Main chart component
│   ├── ChartErrorBoundary.tsx        # Error handling for charts
│   ├── SmartChart.ts                 # Chart configuration and logic
│   └── index.tsx                     # Export file
├── ContractDetailsChart/             # Contract-specific charts
│   ├── ContractDetailsChart.tsx      # Chart for contract details
│   └── index.tsx                     # Export file
├── Currency/                         # Currency display components
│   └── CurrencyIcon.tsx              # Currency icon component
├── Duration/                         # Trade duration components
│   ├── DurationController.tsx        # Main duration control component
│   ├── DurationField.tsx             # Duration input field
│   ├── components/                   # Sub-components for duration
│   │   ├── DurationValueList.tsx     # List of duration values
│   │   └── HoursDurationValue.tsx    # Hours duration input
│   └── index.ts                      # Export file
├── DurationOptions/                  # Duration option selection
│   ├── DurationOptions.tsx           # Duration options component
│   └── index.ts                      # Export file
├── EqualTrade/                       # Equal trade option components
│   ├── EqualTradeController.tsx      # Controls for equal trade option
│   └── index.ts                      # Export file
├── HowToTrade/                       # Trading guide components
│   ├── GuideModal.tsx                # Modal with trading instructions
│   ├── HowToTrade.tsx                # How to trade component
│   └── index.ts                      # Export file
├── MarketInfo/                       # Market information display
│   ├── MarketInfo.tsx                # Market details component
│   └── index.ts                      # Export file
├── MarketSelector/                   # Market selection components
│   ├── MarketIcon.tsx                # Market icon component
│   ├── MarketSelector.tsx            # Market selection component
│   ├── MarketSelectorButton.tsx      # Button for market selection
│   ├── MarketSelectorList.tsx        # List of available markets
│   └── index.ts                      # Export file
├── NotificationProvider/             # Notification system
│   ├── NotificationProvider.tsx      # Notification context provider
│   └── index.ts                      # Export file
├── ServerTime/                       # Server time synchronization
│   ├── ServerTime.tsx                # Server time component
│   └── index.ts                      # Export file
├── Sidebar/                          # Application sidebar
│   ├── Sidebar.tsx                   # Main sidebar component
│   ├── menu/                         # Menu components
│   │   └── MenuContent.tsx           # Menu content component
│   ├── positions/                    # Position tracking components
│   │   └── components/               # Position sub-components
│   │       ├── FilterDropdown.tsx    # Filter for positions
│   │       └── PositionsContent.tsx  # Positions content display
│   └── index.ts                      # Export file
├── SideNav/                          # Side navigation
│   ├── SideNav.tsx                   # Side navigation component
│   └── index.ts                      # Export file
├── Stake/                            # Stake input components
│   ├── StakeController.tsx           # Main stake control component
│   ├── StakeField.tsx                # Stake input field
│   ├── components/                   # Stake sub-components
│   │   ├── PayoutDisplay.tsx         # Displays potential payout
│   │   ├── StakeInput.tsx            # Stake input component
│   │   └── StakeInputLayout.tsx      # Layout for stake input
│   ├── hooks/                        # Stake-specific hooks
│   │   ├── useStakeField.ts          # Hook for stake field logic
│   │   └── useStakeSSE.ts            # Hook for stake SSE integration
│   ├── utils/                        # Stake utilities
│   │   └── validation.ts             # Stake validation functions
│   └── index.ts                      # Export file
├── ThemeProvider/                    # Theme management
│   ├── ThemeProvider.tsx             # Theme context provider
│   └── index.ts                      # Export file
├── TradeButton/                      # Trade execution buttons
│   ├── Button.tsx                    # Base button component
│   ├── TradeButton.tsx               # Trade-specific button
│   └── index.ts                      # Export file
├── TradeFields/                      # Trade parameter fields
│   ├── ToggleButton.tsx              # Toggle button component
│   ├── TradeParam.tsx                # Trade parameter component
│   ├── TradeParamField.tsx           # Trade parameter field
│   └── index.ts                      # Export file
└── ui/                               # Shared UI components (atoms)
    ├── button.tsx                    # Button component
    ├── card.tsx                      # Card component
    ├── chip.tsx                      # Chip/tag component
    ├── modal.tsx                     # Modal dialog component
    ├── popover.tsx                   # Popover component
    ├── primary-button.tsx            # Primary button component
    ├── skeleton.tsx                  # Loading skeleton component
    ├── switch.tsx                    # Toggle switch component
    ├── toast.tsx                     # Toast notification component
    ├── tooltip.tsx                   # Tooltip component
    └── ... (other UI components)
```

## Component Organization
The platform organizes components by feature and functionality:

- **AccountSwitcher**: Allows users to view and switch between different trading accounts
- **AddMarketButton**: Allows users to add new markets to their watchlist
- **BottomNav**: Provides navigation for mobile devices at the bottom of the screen
- **BottomSheet**: Implements a sliding sheet from the bottom for mobile interfaces
- **Chart**: Displays price charts for trading instruments
- **ContractDetailsChart**: Shows charts specific to contract details
- **Currency**: Handles currency display and formatting
- **Duration**: Handles duration selection for trades
- **DurationOptions**: Provides options for selecting trade durations
- **EqualTrade**: Manages the equals option for applicable trade types
- **HowToTrade**: Provides guidance on how to use the trading platform
- **MarketInfo**: Displays market information and details
- **MarketSelector**: Allows users to select different markets for trading
- **NotificationProvider**: Manages system notifications
- **ServerTime**: Synchronizes with server time for accurate trading
- **Sidebar**: Provides navigation and content for the application sidebar
- **SideNav**: Implements side navigation for desktop interfaces
- **Stake**: Manages stake input for trades
- **ThemeProvider**: Manages application theming
- **TradeButton**: Handles trade execution actions
- **TradeFields**: Provides input fields for trade parameters
- **ui**: Contains shared atomic UI components (buttons, inputs, etc.)

## Trade-Related Components

The platform includes several components specifically designed to work with trade types. These components read their configuration from the trade type definitions in `src/config/tradeTypes.ts`.

> **Note:** For details on trade type configuration, refer to the [Trade Types instruction](./1_trade_types.md) document.

### Major Trade Components

- **Stake Controller** (`src/components/Stake/StakeController.tsx`): Handles stake input for trade types
- **Duration Controller** (`src/components/Duration/DurationController.tsx`): Handles duration selection for trade types
- **Equal Trade Controller** (`src/components/EqualTrade/EqualTradeController.tsx`): Handles the equals option for trade types
- **Trade Button** (`src/components/TradeButton/TradeButton.tsx`): Handles trade execution based on button configuration

These components automatically adapt to the trade type configuration. When implementing a new trade type, you typically don't need to modify these components - just configure them properly in the trade type definition.

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
