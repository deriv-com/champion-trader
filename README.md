# Champion Trader

A React-based trading application for options trading.

## Features

- Real-time market data streaming
- Contract price updates
- Position management
- Trade execution
- Responsive design
- TypeScript support

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
│       └── sse/     # SSE services
├── stores/          # Zustand stores
└── types/           # TypeScript type definitions
```

## Development

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write comprehensive tests
- Use TailwindCSS for styling

### Testing

The project uses Jest and React Testing Library for testing:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/components/MyComponent.test.tsx
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
