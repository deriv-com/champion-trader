# State Management Architecture Specification

## State Management Overview
The Champion Trader platform uses Zustand for state management, providing a lightweight, flexible, and type-safe approach to managing application state. This document outlines the state management architecture and best practices.

## Store Structure
The application state is divided into several domain-specific stores:

1. **Trade Store** (`src/stores/tradeStore.ts`)
   - Manages trade parameters, selections, and state
   - Handles trade type, duration, stake, and other parameters
   - Provides actions for updating trade parameters

2. **Market Store** (`src/stores/marketStore.ts`)
   - Manages market data and selections
   - Tracks available instruments and markets
   - Provides actions for selecting and tracking markets

3. **User Store** (`src/stores/userStore.ts`)
   - Manages user authentication state
   - Tracks user balance and account information
   - Provides actions for user-related operations

4. **UI Store** (`src/stores/uiStore.ts`)
   - Manages UI state like modals, sheets, and navigation
   - Tracks device orientation and screen size
   - Provides actions for UI interactions

## Data Flow
The data flow in the application follows a unidirectional pattern:

1. **User Interaction** → Triggers an action in a store
2. **Store Action** → Updates store state
3. **State Update** → Triggers component re-renders
4. **Component Render** → Reflects updated state to the user

This pattern ensures predictable state updates and clear data flow throughout the application.

## Persistence Strategy
State persistence is implemented selectively:

- **Session Persistence**: Critical state is persisted in session storage
- **Local Storage**: User preferences and settings are stored in local storage
- **Memory-Only**: Transient state is kept in memory only

Persistence is implemented using Zustand middleware:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      // State and actions
    }),
    {
      name: 'user-storage',
      getStorage: () => localStorage,
    }
  )
);
```

## Update Patterns
State updates follow these patterns:

1. **Atomic Updates**: Update only what has changed
2. **Immutable Updates**: Create new state objects instead of mutating existing ones
3. **Selective Updates**: Use partial updates when possible
4. **Batched Updates**: Batch related updates together

Example of an atomic update:
```typescript
// Good: Atomic update
set((state) => ({ count: state.count + 1 }));

// Avoid: Retrieving state outside the updater
const count = get().count;
set({ count: count + 1 });
```

## TypeScript Integration
Zustand stores are fully typed using TypeScript:

```typescript
interface TradeState {
  tradeType: TradeType;
  duration: string;
  stake: number;
  setTradeType: (type: TradeType) => void;
  setDuration: (duration: string) => void;
  setStake: (stake: number) => void;
}

export const useTradeStore = create<TradeState>((set) => ({
  tradeType: 'rise_fall',
  duration: '1d',
  stake: 10,
  setTradeType: (type) => set({ tradeType: type }),
  setDuration: (duration) => set({ duration }),
  setStake: (stake) => set({ stake }),
}));
```

## Debugging
Zustand provides built-in debugging capabilities:

- **Redux DevTools Integration**: Using the `devtools` middleware
- **Logging**: Using the `log` middleware
- **State Inspection**: Using the `get()` method for debugging

Example of DevTools integration:
```typescript
import { devtools } from 'zustand/middleware';

export const useStore = create(
  devtools(
    (set) => ({
      // State and actions
    }),
    { name: 'Store Name' }
  )
);
```

## Examples
Example of a component using multiple stores:

```typescript
function TradeForm() {
  const { tradeType, setTradeType } = useTradeStore();
  const { balance } = useUserStore();
  const { isModalOpen } = useUIStore();
  
  return (
    <div>
      <TradeTypeSelector 
        value={tradeType} 
        onChange={setTradeType} 
      />
      <BalanceDisplay balance={balance} />
      {isModalOpen && <TradeConfirmationModal />}
    </div>
  );
}
