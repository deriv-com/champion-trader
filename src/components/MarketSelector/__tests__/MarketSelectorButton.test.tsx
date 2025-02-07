import { render, screen, fireEvent } from '@testing-library/react';
import { MarketSelectorButton } from '../MarketSelectorButton';
import { useBottomSheetStore } from '@/stores/bottomSheetStore';

// Mock the bottomSheetStore
jest.mock('@/stores/bottomSheetStore');

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  ChevronDown: () => <div data-testid="chevron-down">ChevronDown</div>,
  CandlestickChart: () => <div data-testid="candlestick-chart">CandlestickChart</div>
}));

describe('MarketSelectorButton', () => {
  const mockSetBottomSheet = jest.fn();

  beforeEach(() => {
    (useBottomSheetStore as unknown as jest.MockedFunction<typeof useBottomSheetStore>).mockReturnValue({
      setBottomSheet: mockSetBottomSheet,
      showBottomSheet: false,
      key: null,
      height: '87%',
      onDragDown: null
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders synthetic index correctly', () => {
    render(<MarketSelectorButton symbol="R_100" price="968.16" />);
    
    // Check main content
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Volatility 100 Index')).toBeInTheDocument();
    expect(screen.getByText('968.16')).toBeInTheDocument();
    
    // Check icons
    expect(screen.getByTestId('candlestick-chart')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
    
    // Check what should not be present
    expect(screen.queryByText('1s')).not.toBeInTheDocument();
    expect(screen.queryByText('Closed')).not.toBeInTheDocument();
    
    // Check styling
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-muted/50');
  });

  it('renders one-second synthetic index correctly', () => {
    render(<MarketSelectorButton symbol="1HZ100V" price="968.16" />);
    
    // Check main content
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Volatility 100 (1s) Index')).toBeInTheDocument();
    expect(screen.getByText('968.16')).toBeInTheDocument();
    
    // Check 1s badge
    const badge = screen.getByText('1s');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-rose-500', 'text-white');
  });

  it('renders forex pair correctly', () => {
    render(<MarketSelectorButton symbol="EURUSD" price="1.0923" />);
    
    // Check main content
    expect(screen.getByText('EUR')).toBeInTheDocument();
    expect(screen.getByText('EUR/USD')).toBeInTheDocument();
    expect(screen.getByText('1.0923')).toBeInTheDocument();
    
    // Check what should not be present
    expect(screen.queryByText('Closed')).not.toBeInTheDocument();
    
    // Check forex-specific styling
    const number = screen.getByText('EUR');
    expect(number).toHaveClass('text-sm');
  });

  it('renders closed market indicator for USDJPY', () => {
    render(<MarketSelectorButton symbol="USDJPY" price="145.23" />);
    
    // Check main content
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('USD/JPY')).toBeInTheDocument();
    
    // Check closed indicator
    const closedBadge = screen.getByText('Closed');
    expect(closedBadge).toBeInTheDocument();
    expect(closedBadge).toHaveClass('bg-rose-500/10', 'text-rose-500');
  });

  it('opens bottom sheet on click', () => {
    render(<MarketSelectorButton symbol="R_100" price="968.16" />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockSetBottomSheet).toHaveBeenCalledWith(true, 'market-info', '87%');
  });

  it('applies hover styles to button', () => {
    render(<MarketSelectorButton symbol="R_100" price="968.16" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-muted/70');
  });
});
