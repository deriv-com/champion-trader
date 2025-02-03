# Project Structure

This document outlines the organization and structure of the Champion Trader application.

## Root Directory Structure

```
champion-trader/
├── .env                    # Environment variables (gitignored)
├── .env.example           # Example environment variables
├── .gitignore             # Git ignore rules
├── components.json        # Shadcn UI components configuration
├── global.css            # Global CSS styles
├── index.html            # Entry HTML file
├── jest.config.cjs       # Jest testing configuration
├── package.json          # Project dependencies and scripts
├── postcss.config.cjs    # PostCSS configuration for TailwindCSS
├── README.md             # Project documentation
├── rsbuild.config.ts     # Rsbuild configuration
├── styleguide.css        # Style guide specific CSS
├── tailwind.config.cjs   # TailwindCSS configuration
├── tsconfig.json         # TypeScript configuration
└── src/                  # Source code directory
```

## Source Code Organization

### Components (`src/components/`)

Follows Atomic Design principles with components organized by feature/domain:

```
components/
├── AddMarketButton/      # Market addition functionality
├── BottomNav/           # Bottom navigation component
├── Chart/               # Trading chart component
├── DurationOptions/     # Trade duration selection
├── TradeButton/        # Trade execution button
├── TradeFields/        # Trade parameter fields
└── ui/                 # Shared UI components
    ├── button.tsx
    ├── card.tsx
    ├── switch.tsx
    └── toggle.tsx
```

Each component directory typically includes:
- Main component file (e.g., `Component.tsx`)
- Index file for exports
- Test directory (`__tests__/`)
- Additional subcomponents if needed

### Configuration (`src/config/`)

Application-wide configuration and environment setup:

```
config/
├── api.ts              # API configuration and endpoints
└── env.ts             # Environment variables management
```

### Hooks (`src/hooks/`)

Custom React hooks organized by feature:

```
hooks/
└── websocket/         # WebSocket-related hooks
    ├── index.ts
    ├── useContractWebSocket.ts
    ├── useMarketWebSocket.ts
    └── __tests__/    # Hook-specific tests
```

### Layouts (`src/layouts/`)

Page layout components and structure:

```
layouts/
└── MainLayout/        # Main application layout
    ├── Footer.tsx
    ├── Header.tsx
    ├── index.ts
    ├── MainLayout.tsx
    └── __tests__/
```

### Library (`src/lib/`)

Utility functions and shared code:

```
lib/
└── utils.ts          # General utility functions
```

### Screens (`src/screens/`)

Page components organized by route/feature:

```
screens/
├── MenuPage/         # Menu/navigation page
├── PositionsPage/    # Trading positions page
└── TradePage/        # Main trading page
```

Each screen directory includes:
- Main component file
- Index for exports
- Tests directory
- Screen-specific components

### Services (`src/services/`)

API and external service integrations:

```
services/
├── index.ts
└── api/
    ├── axios_interceptor.ts     # Axios configuration
    ├── rest/                    # REST API services
    │   ├── README.md
    │   ├── types.ts
    │   └── instrument/
    │       └── service.ts
    └── websocket/              # WebSocket services
        ├── README.md
        ├── types.ts
        ├── base/
        │   ├── protected.ts
        │   ├── public.ts
        │   ├── service.ts
        │   └── types.ts
        ├── contract/
        │   └── service.ts
        └── market/
            └── service.ts
```

### Stores (`src/stores/`)

State management using Zustand:

```
stores/
├── tradeStore.ts         # Trading-related state
├── websocketStore.ts     # WebSocket connection state
└── __tests__/           # Store tests
```

### Types (`src/types/`)

TypeScript type definitions:

```
types/
└── jest.d.ts            # Jest-specific type definitions
```

## Testing Structure

Tests are co-located with their respective components/modules in `__tests__` directories:

```
__tests__/
├── Component.test.tsx   # Component tests
├── hook.test.tsx        # Hook tests
└── store.test.ts        # Store tests
```

Test files follow these conventions:
- Named after the file they test with `.test.tsx` extension
- Located in `__tests__` directory at the same level as tested code
- Include comprehensive unit tests
- Mock external dependencies appropriately

## Key Files

### Entry Points
- `src/index.tsx`: Application entry point
- `src/App.tsx`: Root React component
- `src/App.test.tsx`: Root component tests

### Configuration
- `rsbuild.config.ts`: Build and development configuration
- `tsconfig.json`: TypeScript compiler options
- `tailwind.config.cjs`: TailwindCSS customization
- `jest.config.cjs`: Testing configuration

### Environment
- `.env`: Environment variables (not in version control)
- `.env.example`: Example environment variables
- `src/config/env.ts`: Environment variable management

## Best Practices

1. **Component Organization**
   - Follow Atomic Design principles
   - Co-locate related files
   - Include index.ts for clean exports
   - Maintain comprehensive tests

2. **State Management**
   - Use Zustand for global state
   - Keep stores focused and minimal
   - Document store interfaces

3. **Testing**
   - Maintain high test coverage
   - Use meaningful test descriptions
   - Mock external dependencies
   - Test edge cases

4. **Code Style**
   - Follow TypeScript best practices
   - Use TailwindCSS for styling
   - Maintain consistent naming conventions
   - Document complex logic

5. **API Integration**
   - Use service layers for API calls
   - Handle errors gracefully
   - Type all requests and responses
   - Document API interfaces

## Development Workflow

1. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Configure environment variables
   - Install dependencies with `npm install`

2. **Development**
   - Run `npm run dev` for development server
   - Access at https://localhost:4113
   - Run tests with `npm test`

3. **Building**
   - Build with `npm run build`
   - Preview with `npm run preview`

## Adding New Features

When adding new features:

1. **Components**
   - Create in appropriate directory
   - Include tests
   - Export via index.ts
   - Document props and usage

2. **Services**
   - Add to relevant service directory
   - Include type definitions
   - Write comprehensive tests
   - Update documentation

3. **State**
   - Create/update stores as needed
   - Keep state normalized
   - Document state shape
   - Include tests

4. **Documentation**
   - Update relevant README files
   - Document new features
   - Include usage examples
   - Update this structure doc if needed
