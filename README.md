# Champion Trader

A React-based trading application for options trading, built with Test-Driven Development (TDD) and atomic component design principles.

## Features

- Real-time market data streaming using SSE
- Contract price updates with automatic reconnection
- Position management with TypeScript type safety
- Trade execution with comprehensive error handling
- Responsive design using TailwindCSS
- Atomic component architecture
- Test-driven development methodology
- State management with Zustand

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Architecture

### Real-time Data Streaming

The application uses Server-Sent Events (SSE) for real-time data streaming, providing efficient unidirectional communication for:

- Market price updates
- Contract price streaming
- Position updates

#### Desktop Components

The following components are implemented for desktop support:

- `desktop-number-input-field`: Desktop-optimized number input
- `desktop-trade-field-card`: Desktop-optimized trade field

These components are part of our enhanced desktop support implementation.

#### Why SSE over WebSocket?

1. **Simpler Protocol**: SSE is built on HTTP and is simpler to implement and maintain
2. **Automatic Reconnection**: Built-in reconnection handling
3. **Better Load Balancing**: Works well with HTTP/2 and standard load balancers
4. **Lower Overhead**: No need for ping/pong messages or connection heartbeats
5. **Firewall Friendly**: Uses standard HTTP port 80/443

### Example Usage

```typescript
// Market Data Streaming
import { useMarketSSE } from '@/hooks/sse';

function MarketPrice({ instrumentId }: { instrumentId: string }) {
  const { price, isConnected } = useMarketSSE(instrumentId, {
    onPrice: (price) => {
      console.log('New price:', price);
    }
  });

  return (
    <div>
      {isConnected ? (
        <p>Current price: {price?.bid}</p>
      ) : (
        <p>Connecting...</p>
      )}
    </div>
  );
}

// Contract Price Streaming
import { useContractSSE } from '@/hooks/sse';

function ContractPrice({ params, authToken }: { params: ContractPriceRequest; authToken: string }) {
  const { price, isConnected } = useContractSSE(params, authToken, {
    onPrice: (price) => {
      console.log('Contract price:', price);
    }
  });

  return (
    <div>
      {isConnected ? (
        <p>Price: {price?.price}</p>
      ) : (
        <p>Connecting...</p>
      )}
    </div>
  );
}
```

### State Management

The application uses Zustand for state management, providing:

- Centralized store for application state
- Simple and predictable state updates
- TypeScript support
- Minimal boilerplate

### Project Structure

```
src/
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── layouts/         # Page layouts
├── screens/         # Page components
├── services/        # API and service layer
│   └── api/
│       ├── rest/    # REST API services
│       └── sse/     # SSE services for real-time data
├── stores/          # Zustand stores
└── types/           # TypeScript type definitions
```

## Development

### Conditional Rendering & Testing
Components such as Footer and BottomNav render differently based on the user's login status. Tests now use clientStore to simulate logged-in and logged-out views.

### Development Methodology

#### Test-Driven Development (TDD)

We follow a strict TDD approach:

1. **Red**: Write failing tests first
   - Define expected behavior through test cases
   - Consider edge cases and error scenarios
   - Write clear test descriptions

2. **Green**: Implement minimal code to pass tests
   - Focus on making tests pass
   - Avoid premature optimization
   - Keep implementation simple

3. **Refactor**: Improve code while keeping tests green
   - Apply SOLID principles
   - Ensure code readability
   - Maintain test coverage

#### Atomic Component Design

Components follow atomic design principles:

1. **Self-Contained**
   - Encapsulate markup, styles, and logic
   - Use TailwindCSS for styling
   - Handle their own state management

2. **Independent**
   - No implicit external dependencies
   - Clear prop interfaces
   - Documented side effects

3. **Reusable**
   - Generic and adaptable
   - Well-documented props
   - Consistent API

Example:
```typescript
interface ButtonProps {
  onClick: () => void;
  label: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button = ({ 
  onClick, 
  label, 
  variant = 'primary',
  disabled = false 
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'px-4 py-2 rounded',
        {
          'bg-blue-600 text-white': variant === 'primary',
          'bg-gray-200 text-gray-800': variant === 'secondary',
          'opacity-50 cursor-not-allowed': disabled
        }
      )}
    >
      {label}
    </button>
  );
};
```

### Code Style

- Follow TypeScript best practices with strict type checking
- Use functional components with React hooks
- Implement proper error handling and loading states
- Write comprehensive tests with meaningful descriptions
- Use TailwindCSS for consistent styling

### Testing

The project uses Jest and React Testing Library for testing. All new features must follow TDD:

```bash
# Run all tests
npm test

# Run tests with coverage (minimum 90% required)
npm test -- --coverage

# Run specific test file
npm test -- src/components/MyComponent.test.tsx

# Watch mode for TDD
npm test -- --watch
```

Example test structure:
```typescript
describe('Component', () => {
  describe('when initialized', () => {
    it('should render with default props', () => {
      // Test initial render
    });

    it('should handle required props correctly', () => {
      // Test prop handling
    });
  });

  describe('when interacting', () => {
    it('should handle user interactions', () => {
      // Test user interactions
    });

    it('should manage state changes', () => {
      // Test state management
    });
  });

  describe('when handling errors', () => {
    it('should display error states appropriately', () => {
      // Test error handling
    });
  });
});
```

### Environment Variables

Create a `.env` file in the root directory:

```env
RSBUILD_REST_URL=https://api.example.com
RSBUILD_SSE_PUBLIC_PATH=/sse
RSBUILD_SSE_PROTECTED_PATH=/sse
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
