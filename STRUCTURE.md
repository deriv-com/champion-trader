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
│   ├── BottomSheet/        # Modal sheet component
│   ├── Chart/              # Price chart
│   ├── Duration/          # Trade duration selection
│   ├── SideNav/           # Side navigation
│   ├── Stake/            # Trade stake selection
│   │   ├── components/   # Stake subcomponents
│   │   ├── hooks/       # SSE integration
│   │   └── utils/       # Validation utils
│   ├── TradeButton/       # Trade execution
│   ├── TradeFields/       # Trade parameters
│   └── ui/               # Shared UI components
├── hooks/           # Custom React hooks
│   ├── useDebounce.ts     # Input debouncing
│   ├── useDeviceDetection.ts # Device type detection
│   └── sse/        # SSE hooks for real-time data
├── layouts/         # Page layouts
├── screens/         # Page components
├── services/        # API and service layer
│   └── api/
│       ├── rest/    # REST API services
│       └── sse/     # SSE services
├── stores/          # Zustand stores
│   ├── bottomSheetStore.ts   # Bottom sheet state
│   ├── clientStore.ts       # Client configuration
│   ├── orientationStore.ts  # Device orientation
│   ├── sseStore.ts         # SSE connection state
│   └── tradeStore.ts       # Trade state
├── types/          # TypeScript type definitions
└── utils/          # Shared utilities
    ├── debounce.ts # Debounce utility functions
    └── duration.ts # Centralized duration utilities for formatting, parsing, and validation
```

## Development Practices

### Test-Driven Development (TDD)

All components and features follow TDD methodology:

```
__tests__/
├── components/     # Component tests
├── hooks/         # Hook tests
├── services/      # Service tests
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

Components follow atomic design principles and are organized by feature. Each component:
- Is self-contained with its own tests
- Uses TailwindCSS for styling
- Handles its own state management
- Has clear documentation
- Implements proper cleanup

## Key Architecture Patterns

### Real-time Data Services

The SSE implementation provides efficient unidirectional streaming for real-time data:

```
sse/
├── createSSEConnection.ts  # Main SSE service
├── custom-event-source.ts  # Custom EventSource implementation
├── types.ts               # Contract request/response types
├── README.md             # Documentation
└── __tests__/           # Test suite
```

The Stake component integrates with SSE for real-time updates:

```
Stake/
├── hooks/
│   └── useStakeSSE.ts  # SSE integration for stake updates
└── utils/
    └── validation.ts  # Input validation
```

Features:
- Simple, function-based API
- Automatic endpoint selection (protected/public)
- Automatic reconnection handling
- Type-safe message handling
- Authentication support via headers
- Error handling and recovery
- Clean connection teardown

### State Management

Zustand stores provide centralized state management with:
- TypeScript type safety
- Atomic updates
- Middleware support
- DevTools integration
- State persistence where needed

## Device Detection and Responsive Design

The application uses device detection for optimized experiences:
- Device-specific interactions
- Responsive layouts
- Touch vs mouse optimizations
- Orientation handling

## Animation and Interaction Patterns

1. **Performance Optimizations**
   - Use requestAnimationFrame for smooth animations
   - Implement proper style cleanup
   - Handle edge cases
   - Device-specific optimizations

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
   - Centralize shared utilities (e.g., duration handling in utils/duration.ts)

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
