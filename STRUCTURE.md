# Project Structure

## Root Directory

```
/
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── components.json          # UI components configuration
├── global.css              # Global styles
├── index.html              # Entry HTML file
├── jest.config.cjs         # Jest testing configuration
├── package.json            # Project dependencies and scripts
├── postcss.config.cjs      # PostCSS configuration
├── rsbuild.config.ts       # Rsbuild configuration
├── styleguide.css         # Style guide definitions
├── tailwind.config.cjs    # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Source Code (/src)

### Core Files
```
src/
├── App.tsx                # Root React component
├── index.tsx             # Application entry point
├── global.css           # Global styles
└── env.d.ts             # Environment type definitions
```

### Components
```
src/components/
├── AddMarketButton/      # Market selection functionality
├── BottomNav/           # Bottom navigation bar
├── Chart/               # Trading chart visualization
├── DurationOptions/     # Trade duration selection
├── TradeButton/        # Trade execution controls
├── TradeFields/        # Trade parameter inputs
└── ui/                 # Shared UI components
    ├── button.tsx
    ├── card.tsx
    ├── switch.tsx
    └── toggle.tsx
```

### Layouts
```
src/layouts/
└── MainLayout/          # Main application layout
    ├── Footer.tsx
    ├── Header.tsx
    ├── MainLayout.tsx
    └── __tests__/
```

### Screens
```
src/screens/
├── MenuPage/           # Menu screen
├── PositionsPage/      # Trading positions screen
└── TradePage/         # Main trading screen
```

### State Management
```
src/stores/
├── tradeStore.ts       # Trading state management
└── websocketStore.ts   # WebSocket connection state
```

### Services
```
src/services/
└── api/
    ├── rest/           # REST API services
    │   └── instrument/ # Instrument-related endpoints
    └── websocket/      # WebSocket services
        ├── base/       # Base WebSocket functionality
        ├── contract/   # Contract-specific WebSocket
        └── market/     # Market data WebSocket
```

### Hooks
```
src/hooks/
└── websocket/          # WebSocket integration hooks
    ├── useContractWebSocket.ts
    └── useMarketWebSocket.ts
```

### Configuration & Utilities
```
src/config/
└── api.ts             # API configuration

src/lib/
└── utils.ts           # Utility functions

src/types/
└── jest.d.ts         # Jest type definitions
```

## Module Dependencies

### Core Dependencies
- React and ReactDOM for UI
- TypeScript for type safety
- TailwindCSS for styling
- Zustand for state management
- Axios for HTTP requests

### Development Dependencies
- Rsbuild for build tooling
- Jest and React Testing Library for testing
- ESLint for code quality
- PostCSS and Autoprefixer for CSS processing

## Key Patterns

1. **Component Organization**
   - Atomic design principles
   - Each component in its own directory
   - Co-located tests with components

2. **State Management**
   - Zustand stores for global state
   - Component-local state where appropriate
   - WebSocket state centralization

3. **API Integration**
   - REST services for static data
   - WebSocket services for real-time data
   - Type-safe API interfaces

4. **Testing Structure**
   - Tests co-located with implementation
   - Separate test directories for complex modules
   - Shared test utilities and mocks

## Configuration Files

1. **Build & Development**
   - `rsbuild.config.ts`: Build configuration
   - `tsconfig.json`: TypeScript settings
   - `postcss.config.cjs`: CSS processing
   - `tailwind.config.cjs`: Styling utilities

2. **Testing**
   - `jest.config.cjs`: Test runner configuration
   - `src/setupTests.ts`: Test environment setup

3. **Environment**
   - `.env.example`: Environment variable template
   - `src/env.d.ts`: Environment type definitions

## Best Practices

1. **File Organization**
   - Feature-based directory structure
   - Clear separation of concerns
   - Co-located tests and types

2. **Naming Conventions**
   - PascalCase for components
   - camelCase for utilities and hooks
   - kebab-case for CSS classes

3. **Import Paths**
   - Alias imports from `@/*`
   - Relative imports for closely related files
   - Explicit import ordering

4. **Testing Organization**
   - `__tests__` directories for test files
   - `.test.tsx` suffix for test files
   - Shared test utilities in appropriate directories
