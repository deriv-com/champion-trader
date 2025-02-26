# AccountSwitcher Component

A component that enables users to view and switch between different trading accounts. It displays account information and provides a smooth switching mechanism.

## Features

- Account list display
- Account switching functionality
- Current account information display
- Real-time balance updates
- Smooth transitions

## Component Structure

```
AccountSwitcher/
├── AccountInfo.tsx      # Account information display
├── AccountSwitcher.tsx # Main switcher component
├── index.ts            # Exports
└── README.md           # This file
```

## Usage

```tsx
import { AccountSwitcher } from '@/components/AccountSwitcher';

function Header() {
  return (
    <div className="header">
      <AccountSwitcher />
    </div>
  );
}
```

## Components

### AccountSwitcher

Main component that handles the account switching functionality.

#### Props
None - The component uses internal state management through stores.

### AccountInfo

Component that displays individual account information.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| accountId | string | Unique identifier for the account |
| balance | string | Account balance |
| currency | string | Account currency code |
| isActive | boolean | Whether this is the currently selected account |

## State Management

The component uses Zustand for state management:
- Account list
- Current account
- Loading states
- Error states

## Features

### Account Display
- Account ID
- Account type
- Balance with currency
- Active status indicator

### Switching Mechanism
- Smooth transition animation
- Loading state handling
- Error handling
- Success confirmation

## Styling

The component uses TailwindCSS for styling:
- Responsive dropdown
- Hover and active states
- Proper spacing and alignment
- Consistent typography

## Best Practices

1. Handle loading states appropriately
2. Provide error feedback
3. Maintain responsive design
4. Clean up listeners on unmount
5. Follow atomic design principles
6. Maintain test coverage

## Related Components

- BalanceDisplay: Shows account balance
- CurrencyIcon: Displays currency symbols
- NotificationProvider: Shows switching notifications
