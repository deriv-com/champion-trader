# Development Practices & Testing Specification

## TDD Methodology Overview
The Champion Trader platform follows a strict Test-Driven Development (TDD) approach. This methodology ensures high code quality, comprehensive test coverage, and maintainable code.

## TDD Process
The TDD process follows these steps:

1. **Red**: Write failing tests first
   - Define expected behavior through test cases
   - Consider edge cases and error scenarios
   - Write clear test descriptions
   - Ensure tests fail for the right reasons

2. **Green**: Implement minimal code to pass tests
   - Focus on making tests pass
   - Avoid premature optimization
   - Keep implementation simple
   - Ensure all tests pass

3. **Refactor**: Improve code while keeping tests green
   - Apply SOLID principles
   - Ensure code readability
   - Maintain test coverage
   - Improve performance where needed

## Testing Structure
Tests are organized by component type:

```
__tests__/
├── components/     # UI component tests
│   ├── Button/
│   ├── TradeForm/
│   └── Chart/
├── hooks/         # Custom hook tests
│   ├── useTradeActions.test.ts
│   └── useSSE.test.ts
├── services/      # Service tests
│   ├── api/
│   │   ├── rest/
│   │   └── sse/
│   └── utils/
└── stores/        # Store tests
    ├── tradeStore.test.ts
    └── userStore.test.ts
```

## Component Testing
UI components are tested using:

1. **Rendering Tests**
   - Verify components render without errors
   - Check for correct default props
   - Verify responsive behavior
   - Test accessibility

2. **Interaction Tests**
   - Simulate user interactions (clicks, inputs)
   - Verify correct event handlers are called
   - Check state updates after interactions
   - Test keyboard navigation

3. **Snapshot Tests**
   - Capture component output
   - Detect unintended UI changes
   - Verify visual consistency

Example of a component test:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders correctly with default props', () => {
    render(<Button onClick={() => {}}>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies the correct class for primary variant', () => {
    render(<Button onClick={() => {}} variant="primary">Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-color-solid-emerald-700');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button onClick={() => {}} disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});
```

## Integration Testing
Integration tests verify that components work together correctly:

1. **Component Composition**
   - Test components working together
   - Verify data flow between components
   - Check event propagation

2. **Store Integration**
   - Test components with stores
   - Verify state updates affect components
   - Check component actions update stores

3. **API Integration**
   - Test components with mocked API responses
   - Verify loading states
   - Test error handling

Example of an integration test:
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TradeForm } from '@/components/TradeForm';
import { useTradeStore } from '@/stores/tradeStore';

// Mock the API
jest.mock('@/services/api/rest/buy/buyService', () => ({
  buyContract: jest.fn().mockResolvedValue({ contract_id: '123', price: 100 }),
}));

describe('TradeForm Integration', () => {
  it('updates trade store when parameters change', async () => {
    render(<TradeForm />);
    
    // Change duration
    fireEvent.change(screen.getByLabelText('Duration'), {
      target: { value: '1d' },
    });
    
    // Verify store was updated
    expect(useTradeStore.getState().duration).toBe('1d');
    
    // Change stake
    fireEvent.change(screen.getByLabelText('Stake'), {
      target: { value: '100' },
    });
    
    // Verify store was updated
    expect(useTradeStore.getState().stake).toBe(100);
  });

  it('calls buy API when trade button is clicked', async () => {
    render(<TradeForm />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Stake'), {
      target: { value: '100' },
    });
    
    // Click trade button
    fireEvent.click(screen.getByText('Rise'));
    
    // Verify loading state
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    
    // Wait for API response
    await waitFor(() => {
      expect(screen.getByText('Trade Successful')).toBeInTheDocument();
    });
  });
});
```

## API Testing
API services are tested with:

1. **Mock Responses**
   - Test with predefined responses
   - Verify correct parsing
   - Check error handling

2. **Request Validation**
   - Verify correct request format
   - Check authentication headers
   - Test parameter validation

3. **Error Scenarios**
   - Test network failures
   - Test API errors
   - Test timeout handling

Example of an API test:
```typescript
import { buyContract } from '@/services/api/rest/buy/buyService';
import { apiClient } from '@/services/api/axios_interceptor';

// Mock axios
jest.mock('@/services/api/axios_interceptor', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe('buyContract', () => {
  it('sends the correct request', async () => {
    // Mock successful response
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      data: { contract_id: '123', price: 100, trade_type: 'CALL' },
    });
    
    // Call the service
    const result = await buyContract({
      price: 100,
      instrument: 'frx_EURUSD',
      duration: '1d',
      trade_type: 'CALL',
      currency: 'USD',
      payout: 200,
      strike: '1.2345',
    });
    
    // Verify request
    expect(apiClient.post).toHaveBeenCalledWith('/buy', {
      price: 100,
      instrument: 'frx_EURUSD',
      duration: '1d',
      trade_type: 'CALL',
      currency: 'USD',
      payout: 200,
      strike: '1.2345',
    });
    
    // Verify response
    expect(result).toEqual({
      contract_id: '123',
      price: 100,
      trade_type: 'CALL',
    });
  });

  it('handles API errors', async () => {
    // Mock error response
    (apiClient.post as jest.Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        data: {
          message: 'Insufficient balance',
        },
      },
    });
    
    // Call the service and expect error
    await expect(buyContract({
      price: 100,
      instrument: 'frx_EURUSD',
      duration: '1d',
      trade_type: 'CALL',
      currency: 'USD',
      payout: 200,
      strike: '1.2345',
    })).rejects.toThrow('Insufficient balance');
  });
});
```

## Store Testing
Zustand stores are tested with:

1. **Initial State**
   - Verify correct initial state
   - Check default values

2. **Actions**
   - Test each action individually
   - Verify state updates correctly
   - Check computed values

3. **Selectors**
   - Test selector functions
   - Verify memoization works correctly

Example of a store test:
```typescript
import { useTradeStore } from '@/stores/tradeStore';

describe('tradeStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useTradeStore.setState({
      tradeType: 'rise_fall',
      duration: '1d',
      stake: 10,
    });
  });

  it('has correct initial state', () => {
    const state = useTradeStore.getState();
    expect(state.tradeType).toBe('rise_fall');
    expect(state.duration).toBe('1d');
    expect(state.stake).toBe(10);
  });

  it('updates trade type', () => {
    const { setTradeType } = useTradeStore.getState();
    setTradeType('high_low');
    expect(useTradeStore.getState().tradeType).toBe('high_low');
  });

  it('updates duration', () => {
    const { setDuration } = useTradeStore.getState();
    setDuration('7d');
    expect(useTradeStore.getState().duration).toBe('7d');
  });

  it('updates stake', () => {
    const { setStake } = useTradeStore.getState();
    setStake(100);
    expect(useTradeStore.getState().stake).toBe(100);
  });
});
```

## Coverage Requirements
Test coverage requirements:

1. **Minimum Coverage**
   - 90% statement coverage
   - 85% branch coverage
   - 90% function coverage
   - 90% line coverage

2. **Critical Areas**
   - 100% coverage for core trade execution logic
   - 100% coverage for API error handling
   - 100% coverage for validation functions

3. **Reporting**
   - Coverage reports generated on each CI run
   - Coverage trends tracked over time
   - Coverage gates in CI pipeline

## Performance Testing
Performance testing includes:

1. **Rendering Performance**
   - Component render time
   - Re-render optimization
   - Memory usage

2. **Network Performance**
   - API response time
   - Connection handling
   - Retry strategies

3. **Animation Performance**
   - Frame rate monitoring
   - Animation smoothness
   - Resource usage during animations

## Code Quality Standards
Code quality is maintained through:

1. **Linting**
   - ESLint for JavaScript/TypeScript
   - Stylelint for CSS
   - Prettier for formatting

2. **Static Analysis**
   - TypeScript strict mode
   - SonarQube for code quality
   - Security scanning

3. **Code Reviews**
   - Pull request reviews
   - Pair programming
   - Code quality checklists

## Continuous Integration
CI pipeline includes:

1. **Build**
   - Compile TypeScript
   - Bundle assets
   - Generate types

2. **Test**
   - Run unit tests
   - Run integration tests
   - Generate coverage reports

3. **Quality**
   - Run linters
   - Check formatting
   - Run static analysis

4. **Deploy**
   - Deploy to staging
   - Run E2E tests
   - Deploy to production
