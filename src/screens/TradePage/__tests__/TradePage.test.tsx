import { render, screen, fireEvent } from '@testing-library/react';
import { TradePage } from '../TradePage';
import { useTradeStore } from '@/stores/tradeStore';
import { useBottomSheetStore } from '@/stores/bottomSheetStore';
import { useOrientationStore } from '@/stores/orientationStore';

// Mock the stores
jest.mock('@/stores/tradeStore');
jest.mock('@/stores/bottomSheetStore');
jest.mock('@/stores/orientationStore');

// Mock the components that are loaded with Suspense
jest.mock('@/components/Chart', () => ({
  Chart: () => <div data-testid="chart">Chart</div>
}));

jest.mock('@/components/BalanceDisplay', () => ({
  BalanceDisplay: () => <div data-testid="balance-display">Balance Display</div>
}));

jest.mock('@/components/DurationOptions', () => ({
  DurationOptions: () => <div data-testid="duration-options">Duration Options</div>
}));

jest.mock('@/components/MarketSelector', () => ({
  MarketSelectorButton: ({ symbol, price }: { symbol: string; price: string }) => (
    <div data-testid="market-selector-button" data-symbol={symbol} data-price={price}>
      Market Selector Button
    </div>
  )
}));

jest.mock('@/components/TradeButton', () => ({
  TradeButton: ({ className, title }: { className: string; title: string }) => (
    <button className={className}>
      {title}
    </button>
  )
}));

jest.mock('@/components/BottomSheet', () => ({
  BottomSheet: () => <div data-testid="bottom-sheet">Bottom Sheet</div>
}));

// Type the mocked modules
const mockedUseTradeStore = useTradeStore as jest.MockedFunction<typeof useTradeStore>;
const mockedUseBottomSheetStore = useBottomSheetStore as jest.MockedFunction<typeof useBottomSheetStore>;
const mockedUseOrientationStore = useOrientationStore as jest.MockedFunction<typeof useOrientationStore>;

describe('TradePage', () => {
  const defaultSymbol = 'R_100';
  const mockToggleAllowEquals = jest.fn();
  const mockSetBottomSheet = jest.fn();

  beforeEach(() => {
    // Setup store mocks
    mockedUseTradeStore.mockReturnValue({
      stake: '10.00',
      duration: '1 minute',
      allowEquals: false,
      toggleAllowEquals: mockToggleAllowEquals,
      symbol: defaultSymbol
    } as any);

    mockedUseBottomSheetStore.mockReturnValue({
      setBottomSheet: mockSetBottomSheet
    } as any);

    mockedUseOrientationStore.mockReturnValue({
      isLandscape: false
    } as any);

    // Clear mocks
    mockToggleAllowEquals.mockClear();
    mockSetBottomSheet.mockClear();
  });

  it('renders all trade components in portrait mode', () => {
    render(<TradePage />);
    screen.debug();
    expect(screen.getByTestId('bottom-sheet')).toBeInTheDocument();
    expect(screen.getByTestId('duration-options')).toBeInTheDocument();
  });

  it('renders balance display in landscape mode', () => {
    mockedUseOrientationStore.mockReturnValue({
      isLandscape: true
    } as any);

    render(<TradePage />);

    expect(screen.getByTestId('balance-display')).toBeInTheDocument();
  });

  it('toggles allow equals', () => {
    render(<TradePage />);

    const toggleSwitch = screen.getByRole('switch', { name: 'Allow equals' });
    fireEvent.click(toggleSwitch);

    expect(mockToggleAllowEquals).toHaveBeenCalled();
  });

  it('renders market selector with correct props', () => {
    render(<TradePage />);

    const marketSelector = screen.getAllByTestId('market-selector-button')[0];
    expect(marketSelector).toHaveAttribute('data-symbol', defaultSymbol);
    expect(marketSelector).toHaveAttribute('data-price', '968.16');
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

  it('renders rise and fall trade buttons with correct styles', () => {
    render(<TradePage />);

    const riseButton = screen.getByText('Rise').closest('button');
    const fallButton = screen.getByText('Fall').closest('button');

    expect(riseButton).toHaveClass('bg-emerald-500');
    expect(fallButton).toHaveClass('bg-rose-500');
  });
});
