# State Management

This directory contains Zustand stores that manage the application's global state. The stores are organized by domain and follow a consistent pattern for state management.

## Store Organization

```
stores/
├── bottomSheetStore.ts   # Bottom sheet UI state management
├── clientStore.ts        # Client configuration and settings
├── sseStore.ts          # SSE connection and data management
├── tradeStore.ts        # Trading-related state management
└── __tests__/          # Store tests with TDD approach
    ├── clientStore.test.ts
    ├── sseStore.test.ts
    └── tradeStore.test.ts
```

## Test-Driven Development

We follow a strict TDD approach for store development:

1. **Write Tests First**
   ```typescript
   describe('clientStore', () => {
     it('should initialize with default state', () => {
       const { getState } = useClientStore;
       expect(getState().config).toEqual(defaultConfig);
     });

     it('should update config', () => {
       const { getState, updateConfig } = useClientStore;
       const newConfig = { theme: 'dark' };
       updateConfig(newConfig);
       expect(getState().config.theme).toBe('dark');
     });
   });
   ```

2. **Implement Store**
   ```typescript
   interface ClientState {
     config: Config;
   }

   interface ClientActions {
     updateConfig: (config: Partial<Config>) => void;
   }

   const useClientStore = create<ClientState & ClientActions>((set) => ({
     config: defaultConfig,
     updateConfig: (newConfig) => 
       set((state) => ({
         config: { ...state.config, ...newConfig }
       }))
   }));
   ```

3. **Refactor and Optimize**
   - Ensure proper type safety
   - Implement error handling
   - Add performance optimizations

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

## Store Implementations

### Bottom Sheet Store

The bottom sheet store manages the application's modal sheet UI state:

```typescript
interface BottomSheetState {
  showBottomSheet: boolean;
  key: string | null;
  height: string;
  onDragDown?: () => void;
}

interface BottomSheetActions {
  setBottomSheet: (
    show: boolean,
    key?: string,
    height?: string,
    onDragDown?: () => void
  ) => void;
}

const useBottomSheetStore = create<BottomSheetState & BottomSheetActions>((set) => ({
  showBottomSheet: false,
  key: null,
  height: '50%',
  setBottomSheet: (show, key, height, onDragDown) =>
    set({ showBottomSheet: show, key, height, onDragDown })
}));
```

### Client Store

The client store manages application-wide settings and configuration:

```typescript
interface ClientState {
  config: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
  };
  isInitialized: boolean;
}

interface ClientActions {
  updateConfig: (config: Partial<Config>) => void;
  initialize: () => Promise<void>;
}

const useClientStore = create<ClientState & ClientActions>((set) => ({
  config: defaultConfig,
  isInitialized: false,
  updateConfig: (newConfig) => 
    set((state) => ({
      config: { ...state.config, ...newConfig }
    })),
  initialize: async () => {
    // Implementation
  }
}));
```

### SSE Store

The SSE store manages Server-Sent Events connections and real-time data:

```typescript
interface SSEState {
  isMarketConnected: boolean;
  isContractConnected: boolean;
  marketPrices: Record<string, Price>;
  contractPrices: Record<string, ContractPrice>;
}

interface SSEActions {
  initializeMarketService: () => void;
  initializeContractService: (authToken: string) => void;
  updateMarketPrice: (instrumentId: string, price: Price) => void;
  updateContractPrice: (contractId: string, price: ContractPrice) => void;
  // Other actions
}

const useSSEStore = create<SSEState & SSEActions>((set) => ({
  isMarketConnected: false,
  isContractConnected: false,
  marketPrices: {},
  contractPrices: {},
  // Implementation of actions
}));
```

## Trade Store

The trade store manages trading-related state, including dynamic payouts based on trade type:

```typescript
interface TradeState {
  // Trade parameters
  stake: string;
  duration: string;
  allowEquals: boolean;
  trade_type: TradeType;

  // Dynamic payout structure
  payouts: {
    max: number;
    values: Record<string, number>;  // Maps button action names to payout values
  };

  // Actions
  setStake: (stake: string) => void;
  setDuration: (duration: string) => void;
  toggleAllowEquals: () => void;
  setPayouts: (payouts: Payouts) => void;
  setTradeType: (trade_type: TradeType) => void;
}

// Example usage:
const store = useTradeStore();

// Update payouts for multiple buttons
store.setPayouts({
  max: 50000,
  values: {
    buy_rise: 19.50,
    buy_fall: 19.50
  }
});

// Get payout for a specific button
const payout = store.payouts.values['buy_rise'];
```

Key features:
- Dynamic payout structure based on trade type
- Support for multiple button payouts
- Automatic payout reset on trade type change
- Type-safe payout management

## Best Practices

1. **State Organization**
   - Keep stores focused on specific domains
   - Split complex stores into smaller ones
   - Use TypeScript for type safety
   - Follow single responsibility principle
   - Use configuration-driven state structures

2. **Test-Driven Development**
   - Write tests before implementation
   - Cover edge cases and error scenarios
   - Test asynchronous operations
   - Mock external dependencies properly
   - Test different trade type configurations

3. **Performance Optimization**
   - Use selective subscriptions
   - Implement proper cleanup
   - Avoid unnecessary state updates
   - Memoize selectors
   - Optimize payout updates

2. **Performance**
   - Use selective subscriptions
   - Implement proper cleanup
   - Avoid unnecessary state updates
   - Batch payout updates when possible
   - Consider memoization for derived values

3. **Testing**
   - Test store creation
   - Test state updates
   - Test action handlers
   - Mock external dependencies
   - Test trade type transitions

4. **Usage in Components**
   ```typescript
   import { useTradeStore } from '@/stores/tradeStore';

   function TradeComponent() {
     const { 
       trade_type,
       payouts: { max, values },
       setPayouts 
     } = useTradeStore();

     // Access payout for specific button
     const buttonPayout = values[buttonActionName];

     // Update payouts
     const handlePriceUpdate = (price: number) => {
       setPayouts({
         max: 50000,
         values: {
           ...values,
           [buttonActionName]: price
         }
       });
     };
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
    <select value={selectedInstrument} onChange={(e) => setInstrument(e.target.value)}}>
      {/* Options */}
    </select>
  );
}
