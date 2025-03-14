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

## Trade Store
The Trade Store is the primary store for managing trade-related state. It interacts directly with trade type configurations to determine which fields are available and how trade actions are processed.

> **Note:** For details on trade type configuration, refer to the [Trade Types instruction](./1_trade_types.md) document.

### Trade Store Structure

```typescript
interface TradeState {
  // Selected trade type (e.g., 'rise_fall', 'touch_no_touch')
  tradeType: TradeType;
  
  // Duration value and unit
  duration: string;
  
  // Stake amount
  stake: number;
  
  // Selected instrument
  instrument: string;
  
  // Equals option (for trade types that support it)
  equals: boolean;
  
  // Actions for updating state
  setTradeType: (type: TradeType) => void;
  setDuration: (duration: string) => void;
  setStake: (stake: number) => void;
  setInstrument: (instrument: string) => void;
  setEquals: (equals: boolean) => void;
}
```

### Trade Type Integration

The Trade Store integrates with trade type configurations in the following ways:

1. **Field Visibility**
   - The selected trade type determines which fields are displayed
   - Components check the trade type configuration to determine visibility
   - Example: `const showDuration = tradeTypeConfigs[tradeType].fields.duration;`

2. **Trade Actions**
   - Trade actions are determined by the selected trade type
   - The `useTradeActions` hook maps action names to handlers
   - Example: `const actions = useTradeActions(); actions.buy_rise();`

3. **Trade Parameters**
   - Trade parameters are stored in the trade store
   - Components read and update these parameters
   - Example: `const { stake, setStake } = useTradeStore();`

### Adding Support for a New Trade Type

When adding a new trade type, you need to ensure the Trade Store can handle it:

1. Add the new trade type to the `TradeType` type:
   ```typescript
   export type TradeType = 
     | 'rise_fall'
     | 'touch_no_touch'
     | 'your_new_trade_type';
   ```

2. Update the `useTradeActions` hook to handle the new trade type's actions:
   ```typescript
   export type TradeAction =
     | 'buy_rise'
     | 'buy_fall'
     | 'your_new_action';
   ```

3. Implement the action handlers in the `useTradeActions` hook.

No changes to the Trade Store itself are typically needed, as it's designed to be flexible and configuration-driven.

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
```

## Best Practices

1. **Store Organization**
   - Keep stores focused on specific domains
   - Avoid storing derived state that can be computed
   - Use selectors for efficient state access

2. **State Updates**
   - Use atomic updates with the function form of `set`
   - Avoid retrieving state outside updaters
   - Keep actions close to the state they modify

3. **Performance**
   - Use selectors to prevent unnecessary re-renders
   - Split large stores into smaller ones
   - Avoid storing large objects or arrays directly

4. **TypeScript**
   - Define clear interfaces for store state
   - Type all actions and selectors
   - Use discriminated unions for complex state
