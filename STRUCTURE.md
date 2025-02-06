# Project Structure

## Overview

The Champion Trader application follows a modular architecture with clear separation of concerns. This document outlines the project structure and key architectural decisions.

## Directory Structure

```
src/
├── components/       # Reusable UI components
│   ├── BalanceDisplay/       # Displays the user balance.
│   ├── BalanceHandler/       # Manages balance state.
│   ├── Chart/               # Displays market data with error handling and data integrity.
│   └── ContractSSEHandler/   # Handles contract SSE streaming.
├── hooks/           # Custom React hooks
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
└── types/          # TypeScript type definitions
```

## Development Practices

### Test-Driven Development (TDD)

All components and features follow TDD methodology:

```
__tests__/
├── components/     # Component tests
│   ├── AddMarketButton/
│   ├── BottomNav/
│   ├── BottomSheet/
│   ├── Chart/
│   ├── DurationOptions/
│   └── TradeButton/
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

### Atomic Component Design

Components follow atomic design principles and are organized by feature:

```
components/
├── AddMarketButton/     # Market selection
├── BottomNav/           # Navigation component
├── BottomSheet/         # Modal sheet component
├── Chart/               # Price chart
├── Duration/           # Trade duration selection
│   ├── components/     # Duration subcomponents
│   │   ├── DurationTab.tsx
│   │   ├── DurationTabList.tsx
│   │   ├── DurationValueList.tsx
│   │   └── HoursDurationValue.tsx
│   └── DurationController.tsx
├── DurationOptions/     # Legacy trade duration (to be deprecated)
├── TradeButton/         # Trade execution
├── TradeFields/         # Trade parameters
└── ui/                  # Shared UI components
    ├── button.tsx
    ├── card.tsx
    ├── chip.tsx        # Selection chip component
    ├── primary-button.tsx # Primary action button
    ├── switch.tsx
    └── toggle.tsx
```

Each component:
- Is self-contained with its own tests
- Uses TailwindCSS for styling
- Handles its own state management
- Has clear documentation

## Key Components

### Real-time Data Services

#### SSE Services (`src/services/api/sse/`)

The SSE implementation provides efficient unidirectional streaming for real-time data:

```
sse/
├── base/           # Base SSE functionality
│   ├── service.ts  # Core SSE service
│   ├── public.ts   # Public endpoint service
│   ├── protected.ts # Protected endpoint service
│   └── types.ts    # Shared types
├── market/         # Market data streaming
│   └── service.ts  # Market SSE service
└── contract/       # Contract price streaming
    └── service.ts  # Contract SSE service
```

Features:
- Automatic reconnection handling
- Type-safe message handling
- Authentication support
- Error handling and recovery
- Connection state management

#### React Hooks (`src/hooks/sse/`)

Custom hooks for SSE integration:

```typescript
// Market data hook
const { price, isConnected, error } = useMarketSSE(instrumentId, {
  onPrice: (price) => void,
  onError: (error) => void,
  onConnect: () => void,
  onDisconnect: () => void
});

// Contract price hook
const { price, isConnected, error } = useContractSSE(params, authToken, {
  onPrice: (price) => void,
  onError: (error) => void,
  onConnect: () => void,
  onDisconnect: () => void
});
```

### State Management

#### Zustand Stores (`src/stores/`)

- `bottomSheetStore.ts`: Manages bottom sheet state and interactions
- `clientStore.ts`: Handles client configuration and settings
- `sseStore.ts`: Manages SSE connections and real-time data
- `tradeStore.ts`: Handles trade-related state
- `websocketStore.ts`: Legacy WebSocket state (to be deprecated)

Features:
- TypeScript type safety
- Atomic updates
- Middleware support
- DevTools integration

Features:
- Centralized state management
- TypeScript support
- Minimal boilerplate
- Automatic state persistence
- DevTools integration

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
- Connection management tests

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
   - Implement reusable UI components in ui/ directory
   - Use TailwindCSS for consistent styling
   - Support theme customization through design tokens

3. **State Management**
   - Use local state for UI-only state
   - Use Zustand for shared state
   - Keep stores focused and minimal
   - Document store interfaces

2. **Error Handling**
   - Implement proper error boundaries
     - Chart component uses ChartErrorBoundary for graceful error recovery
     - Provides user-friendly error messages with retry options
   - Handle network errors gracefully
   - Handle data integrity issues (e.g., timestamp ordering)

3. **Testing**
   - Write tests for all new features
   - Maintain high test coverage
   - Use meaningful test descriptions

4. **Performance**
   - Implement proper cleanup in hooks
   - Use memoization where appropriate
   - Handle reconnection scenarios
   - Ensure data integrity through sorting and deduplication
   - Optimize real-time data updates

5. **Code Organization**
   - Follow consistent file naming
   - Group related functionality
   - Document complex logic

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
