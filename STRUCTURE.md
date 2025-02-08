# Project Structure

## Trade Configuration System

The application uses a configuration-driven approach for handling different trade types:

### Key Components

1. **Trade Type Configuration** (`src/config/tradeTypes.ts`)
   - Defines available trade types
   - Configures fields and buttons per trade type
   - Controls lazy loading behavior
   - See [Trade Types Configuration](src/config/README.md#trade-types-configuration)

2. **Trade Form Controller** (`src/screens/TradePage/components/TradeFormController.tsx`)
   - Renders trade form based on configuration
   - Handles responsive layouts
   - Implements lazy loading
   - See [Trade Form Controller](src/screens/TradePage/components/README.md#tradeformcontroller)

3. **Trade Actions** (`src/hooks/useTradeActions.ts`)
   - Provides action handlers for trade buttons
   - Integrates with trade store
   - Handles API interactions

### Data Flow

```
Trade Type Config → Trade Form Controller → Trade Actions → API
     ↑                      ↓                    ↓
     └──────────── Trade Store Integration ──────┘
```

### Lazy Loading Strategy

- Components are loaded on demand
- Preloading based on metadata
- Suspense boundaries for loading states


## Overview

The Champion Trader application follows a modular architecture with clear separation of concerns. This document outlines the project structure and key architectural decisions.

## Directory Structure

```
src/
├── components/       # Reusable UI components
│   ├── AddMarketButton/     # Market selection
│   ├── BalanceDisplay/      # Displays user balance
│   ├── BalanceHandler/      # Manages balance state
│   ├── BottomNav/          # Navigation component
│   ├── BottomSheet/        # Modal sheet component with drag support
│   ├── Chart/              # Price chart with error handling
│   ├── ContractSSEHandler/ # Contract SSE management
│   ├── Duration/          # Trade duration selection
│   ├── DurationOptions/    # Legacy duration component
│   ├── SideNav/           # Side navigation
│   ├── TradeButton/       # Trade execution
│   ├── TradeFields/       # Trade parameters
│   └── ui/               # Shared UI components
├── hooks/           # Custom React hooks
│   ├── useDeviceDetection.ts # Device type detection
│   ├── sse/        # SSE hooks for real-time data
│   └── websocket/  # Legacy WebSocket hooks
├── layouts/         # Page layouts
├── screens/         # Page components
├── services/        # API and service layer
│   └── api/
│       ├── rest/    # REST API services
│       ├── sse/     # SSE services
│       └── websocket/ # Legacy WebSocket services
├── stores/          # Zustand stores
│   ├── bottomSheetStore.ts   # Bottom sheet state
│   ├── clientStore.ts       # Client configuration
│   ├── orientationStore.ts  # Device orientation
│   ├── sseStore.ts         # SSE connection state
│   ├── tradeStore.ts       # Trade state
│   └── websocketStore.ts   # Legacy WebSocket state
└── types/          # TypeScript type definitions
```

## Development Practices

### Test-Driven Development (TDD)

All components and features follow TDD methodology:

```
__tests__/
├── components/     # Component tests
│   ├── AddMarketButton/
│   ├── BalanceDisplay/
│   ├── BalanceHandler/
│   ├── BottomNav/
│   ├── BottomSheet/
│   ├── Chart/
│   ├── Duration/
│   ├── DurationOptions/
│   ├── SideNav/
│   ├── TradeButton/
│   └── TradeFields/
├── hooks/         # Hook tests
│   ├── sse/
│   └── websocket/
├── services/      # Service tests
│   └── api/
│       ├── rest/
│       ├── sse/
│       └── websocket/
└── stores/        # Store tests
```

Test coverage requirements:
- Minimum 90% coverage for all new code
- All edge cases must be tested
- Integration tests for component interactions
- Mocked service responses for API tests
- Performance and animation tests
- Device-specific behavior tests

### Atomic Component Design

Components follow atomic design principles and are organized by feature:

```
components/
├── AddMarketButton/     # Market selection
├── BalanceDisplay/      # Displays user balance
├── BalanceHandler/      # Manages balance state
├── BottomNav/          # Navigation component
├── BottomSheet/        # Modal sheet component
│   ├── BottomSheet.tsx        # Main component
│   ├── BottomSheet.example.tsx # Usage examples
│   ├── README.md             # Documentation
│   └── __tests__/           # Test suite
├── Chart/              # Price chart
├── ContractSSEHandler/ # Contract SSE management
├── Duration/          # Trade duration selection
│   ├── components/     # Duration subcomponents
│   │   ├── DurationTab.tsx
│   │   ├── DurationTabList.tsx
│   │   ├── DurationValueList.tsx    # Future enhancement
│   │   └── HoursDurationValue.tsx   # Future enhancement
│   └── DurationController.tsx
├── DurationOptions/    # Legacy trade duration
├── EqualTrade/        # Equal trade functionality
│   ├── EqualTradeController.tsx
│   └── index.ts
├── SideNav/           # Side navigation
├── TradeButton/       # Trade execution
├── TradeFields/       # Trade parameters
└── ui/               # Shared UI components
    ├── button.tsx
    ├── card.tsx
    ├── chip.tsx        # Selection chip
    ├── primary-button.tsx # Primary action
    ├── switch.tsx
    └── toggle.tsx
```

Each component:
- Is self-contained with its own tests
- Uses TailwindCSS for styling
- Handles its own state management
- Has clear documentation
- Implements proper cleanup

## Key Components

### Bottom Sheet Component (`src/components/BottomSheet/`)

The BottomSheet provides a mobile-optimized modal interface:

Features:
- Performance-optimized drag animations using requestAnimationFrame
- Text selection prevention during drag
- Comprehensive event cleanup
- Mobile-first design with desktop fallback
- Theme-aware styling with TailwindCSS
- Zustand-based state management
- Edge case handling (pointer events, window blur)

### Real-time Data Services

#### SSE Services (`src/services/api/sse/`)

The SSE implementation provides efficient unidirectional streaming for real-time data:

```
sse/
├── createSSEConnection.ts  # Main SSE service
├── custom-event-source.ts  # Custom EventSource implementation
├── types.ts               # Contract request/response types
├── README.md             # Documentation
└── __tests__/           # Test suite
    └── createSSEConnection.test.ts
```

Features:
- Simple, function-based API
- Automatic endpoint selection (protected/public)
- Automatic reconnection handling
- Type-safe message handling
- Authentication support via headers
- Error handling and recovery
- Clean connection teardown

Example usage:
```typescript
useEffect(() => {
  const cleanup = createSSEConnection({
    params: {
      action: 'contract_price',
      duration: '5m',
      trade_type: 'CALL',
      instrument: 'R_100',
      currency: 'USD',
      payout: '10'
    },
    headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
    onMessage: (data) => {
      console.log('Price update:', data);
    },
    onError: (error) => {
      console.error('SSE error:', error);
    }
  });

  return cleanup;
}, [/* dependencies */]);
```

### State Management

#### Zustand Stores (`src/stores/`)

- `bottomSheetStore.ts`: Manages bottom sheet state and interactions
- `clientStore.ts`: Handles client configuration and settings
- `orientationStore.ts`: Manages device orientation state
- `sseStore.ts`: Manages SSE connections and real-time data
- `tradeStore.ts`: Handles trade-related state
- `websocketStore.ts`: Legacy WebSocket state (to be deprecated)

Features:
- TypeScript type safety
- Atomic updates
- Middleware support
- DevTools integration
- State persistence where needed

## Device Detection and Responsive Design

The application uses device detection for optimized experiences:

```typescript
// hooks/useDeviceDetection.ts
const { isDesktop, isMobile, isTablet } = useDeviceDetection();
```

Features:
- Device-specific interactions
- Responsive layouts
- Touch vs mouse optimizations
- Orientation handling

## Animation and Interaction Patterns

The project implements consistent animation patterns:

1. **Performance Optimizations**
   - Use requestAnimationFrame for smooth animations
   - Implement proper style cleanup
   - Handle edge cases (text selection, pointer events)
   - Device-specific optimizations
   - Efficient event handling

2. **Interaction Guidelines**
   - Touch-friendly targets
   - Smooth transitions
   - Responsive feedback
   - Error state animations

## Style Management

1. **TailwindCSS Usage**
   - Utility-first approach
   - Theme consistency
   - Dark mode support
   - Responsive design
   - Animation classes

2. **Style Cleanup**
   - Proper cleanup of dynamic styles
   - State-based style management
   - Animation cleanup
   - Transform resets

## Testing

The project uses Jest and React Testing Library for testing:

```
__tests__/
├── components/     # Component tests
├── hooks/         # Hook tests
├── services/      # Service tests
└── stores/        # Store tests
```

Test coverage includes:
- Unit tests for services and hooks
- Integration tests for components
- State management tests
- Error handling tests
- Animation and interaction tests
- Device-specific behavior tests
- Performance optimization tests

## API Integration

### SSE Endpoints

```typescript
// Configuration (src/config/api.ts)
interface ApiConfig {
  sse: {
    baseUrl: string;
    publicPath: string;
    protectedPath: string;
  };
  // ... other configs
}
```

### Environment Variables

```env
RSBUILD_REST_URL=https://api.example.com
RSBUILD_SSE_PUBLIC_PATH=/sse
RSBUILD_SSE_PROTECTED_PATH=/sse
```

## Best Practices

1. **Type Safety**
   - Use TypeScript for all new code
   - Define interfaces for all data structures
   - Use strict type checking
   - Leverage TypeScript's utility types

2. **Component Design**
   - Follow atomic design principles
   - Use composition over inheritance
   - Keep components focused and single-responsibility
   - Document props and side effects
   - Implement proper cleanup
   - Handle edge cases

3. **State Management**
   - Use local state for UI-only state
   - Use Zustand for shared state
   - Keep stores focused and minimal
   - Document store interfaces
   - Implement proper cleanup

4. **Error Handling**
   - Implement proper error boundaries
   - Handle network errors gracefully
   - Handle data integrity issues
   - Provide user-friendly error states
   - Implement recovery mechanisms

5. **Performance**
   - Use requestAnimationFrame for animations
   - Implement proper cleanup
   - Handle edge cases
   - Optimize real-time updates
   - Device-specific optimizations

6. **Code Organization**
   - Follow consistent file naming
   - Group related functionality
   - Document complex logic
   - Maintain clear separation of concerns

## Migration Notes

The project is transitioning from WebSocket to SSE for real-time data:

1. **Why SSE?**
   - Simpler protocol
   - Better load balancing
   - Automatic reconnection
   - Lower overhead
   - Firewall friendly

2. **Migration Strategy**
   - Implement SSE alongside WebSocket
   - Gradually migrate components
   - Test thoroughly
   - Remove WebSocket once complete

3. **Compatibility**
   - SSE services maintain similar interface
   - Hooks provide consistent API
   - State management remains unchanged
