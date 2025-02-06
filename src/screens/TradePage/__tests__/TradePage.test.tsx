import { render, screen, fireEvent } from '@testing-library/react';
import { TradePage } from '../TradePage';
import { useTradeStore } from '@/stores/tradeStore';
import { useBottomSheetStore } from '@/stores/bottomSheetStore';

// Mock the stores
jest.mock('@/stores/tradeStore');
jest.mock('@/stores/bottomSheetStore');

// Mock the components that are loaded with Suspense
jest.mock('@/components/AddMarketButton', () => ({
  AddMarketButton: () => <div data-testid="add-market-button">Add Market Button</div>
}));

jest.mock('@/components/Chart', () => ({
  Chart: () => <div data-testid="chart">Chart</div>
}));

jest.mock('@/components/BalanceDisplay', () => ({
  BalanceDisplay: () => <div data-testid="balance-display">Balance Display</div>
}));

jest.mock('@/components/DurationOptions', () => ({
  DurationOptions: () => <div data-testid="duration-options">Duration Options</div>
}));

jest.mock('@/components/TradeButton', () => ({
  TradeButton: () => <div data-testid="trade-button">Trade Button</div>
}));

jest.mock('@/components/BottomSheet', () => ({
  BottomSheet: () => <div data-testid="bottom-sheet">Bottom Sheet</div>
}));

// Type the mocked modules
const mockedUseTradeStore = useTradeStore as jest.MockedFunction<typeof useTradeStore>;
const mockedUseBottomSheetStore = useBottomSheetStore as jest.MockedFunction<typeof useBottomSheetStore>;

describe('TradePage', () => {
  const mockToggleAllowEquals = jest.fn();
  const mockSetBottomSheet = jest.fn();

  beforeEach(() => {
    // Setup store mocks
    mockedUseTradeStore.mockReturnValue({
      stake: '10.00',
      duration: '1 minute',
      allowEquals: false,
      toggleAllowEquals: mockToggleAllowEquals
    } as any);

    mockedUseBottomSheetStore.mockReturnValue({
      setBottomSheet: mockSetBottomSheet
    } as any);

    // Clear mocks
    mockToggleAllowEquals.mockClear();
    mockSetBottomSheet.mockClear();
  });

  it('renders all trade components', () => {
    render(<TradePage />);

    // Balance display is only visible in landscape mode
    expect(screen.queryByTestId('balance-display')).not.toBeInTheDocument();
    expect(screen.getByTestId('bottom-sheet')).toBeInTheDocument();
    expect(screen.getAllByTestId('add-market-button')).toHaveLength(1); // Only portrait mode by default
    expect(screen.getByTestId('duration-options')).toBeInTheDocument();
  });

  it('toggles allow equals', () => {
    render(<TradePage />);

    const toggleSwitch = screen.getByRole('switch', { name: 'Allow equals' });
    fireEvent.click(toggleSwitch);

    expect(mockToggleAllowEquals).toHaveBeenCalled();
  });

  it('renders market info', () => {
    render(<TradePage />);

    // Get all instances of market info
    const marketTitles = screen.getAllByText('Vol. 100 (1s) Index');
    const marketSubtitles = screen.getAllByText('Rise/Fall');

    // Verify both landscape and portrait instances
    expect(marketTitles).toHaveLength(1); // Only portrait mode by default
    expect(marketSubtitles).toHaveLength(1);
  });

  it('opens duration bottom sheet when duration is clicked', () => {
    render(<TradePage />);

    const durationParam = screen.getByText('Duration').closest('button');
    fireEvent.click(durationParam!);

    expect(mockSetBottomSheet).toHaveBeenCalledWith(true, 'duration', '470px');
  });

  it('opens stake bottom sheet when stake is clicked', () => {
    render(<TradePage />);

    const stakeParam = screen.getByText('Stake').closest('button');
    fireEvent.click(stakeParam!);

    expect(mockSetBottomSheet).toHaveBeenCalledWith(true, 'stake');
  });

  it('renders trade buttons', () => {
    render(<TradePage />);

    const tradeButtons = screen.getAllByTestId('trade-button');
    expect(tradeButtons).toHaveLength(2); // Rise and Fall buttons
  });
});
