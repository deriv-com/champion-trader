# State Management

This directory contains Zustand stores that manage the application's global state. The stores are organized by domain and follow a consistent pattern for state management.

## Store Organization

```
stores/
├── tradeStore.ts         # Trading-related state management
├── websocketStore.ts     # WebSocket connection state management
└── __tests__/           # Store tests
```

## Store Implementation

The stores use Zustand for state management, providing a simple and efficient way to handle global state. Each store follows these principles:

1. **Type Safety**
   ```typescript
   interface StoreState {
     // State interface
   }

   interface StoreActions {
     // Actions interface
   }

   const useStore = create<StoreState & StoreActions>((set, get) => ({
     // Implementation
   }));
   ```

2. **Immutable Updates**
   ```typescript
   const useTradeStore = create((set) => ({
     positions: [],
     addPosition: (position) => 
       set((state) => ({
         positions: [...state.positions, position]
       }))
   }));
   ```

## WebSocket Store

The WebSocket store manages real-time connections and data:

```typescript
interface WebSocketState {
  isMarketConnected: boolean;
  isContractConnected: boolean;
  instrumentPrices: Record<string, Price>;
  contractPrices: Record<string, ContractPrice>;
}

interface WebSocketActions {
  initializeMarketService: () => void;
  initializeContractService: (authToken: string) => void;
  // Other actions
}
```

## Trade Store

The trade store manages trading-related state:

```typescript
interface TradeState {
  selectedInstrument: string | null;
  tradeAmount: number;
  duration: number;
  // Other trade parameters
}

interface TradeActions {
  setInstrument: (id: string) => void;
  setAmount: (amount: number) => void;
  // Other actions
}
```

## Best Practices

1. **State Organization**
   - Keep stores focused on specific domains
   - Split complex stores into smaller ones
   - Use TypeScript for type safety

2. **Performance**
   - Use selective subscriptions
   - Implement proper cleanup
   - Avoid unnecessary state updates

3. **Testing**
   - Test store creation
   - Test state updates
   - Test action handlers
   - Mock external dependencies

4. **Usage in Components**
   ```typescript
   import { useTradeStore } from '@/stores/tradeStore';

   function TradeComponent() {
     const { positions, addPosition } = useTradeStore();
     // Component implementation
   }
   ```

## Store Guidelines

1. **State Updates**
   - Use immutable updates
   - Avoid direct state mutations
   - Keep state normalized

2. **Actions**
   - Use descriptive action names
   - Keep actions focused
   - Handle errors gracefully

3. **Selectors**
   - Use selectors for derived state
   - Memoize complex calculations
   - Keep selectors pure

4. **Integration**
   - Use middleware when needed
   - Handle side effects properly
   - Implement proper error boundaries

## Example Usage

```typescript
// Store definition
const useTradeStore = create<TradeState & TradeActions>((set) => ({
  selectedInstrument: null,
  tradeAmount: 0,
  setInstrument: (id) => set({ selectedInstrument: id }),
  setAmount: (amount) => set({ tradeAmount: amount })
}));

// Component usage
function TradeForm() {
  const { selectedInstrument, setInstrument } = useTradeStore();
  return (
    <select value={selectedInstrument} onChange={(e) => setInstrument(e.target.value)}>
      {/* Options */}
    </select>
  );
}
