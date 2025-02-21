import { render, screen } from '@testing-library/react';
import { TradePage } from '../TradePage';
import * as tradeStore from '@/stores/tradeStore';
import * as bottomSheetStore from '@/stores/bottomSheetStore';
import * as orientationStore from '@/stores/orientationStore';
import * as clientStore from '@/stores/clientStore';
import * as deviceDetection from '@/hooks/useDeviceDetection';
import * as leftSidebarStore from '@/stores/leftSidebarStore';
import * as marketStore from '@/stores/marketStore';

// Mock all required stores
jest.mock('@/stores/tradeStore');
jest.mock('@/stores/bottomSheetStore');
jest.mock('@/stores/orientationStore');
jest.mock('@/stores/clientStore');
jest.mock('@/stores/leftSidebarStore');
jest.mock('@/stores/marketStore');
jest.mock('@/hooks/useDeviceDetection');

// Mock trade type config
jest.mock('@/config/tradeTypes', () => ({
  tradeTypeConfigs: {
    rise_fall: {
      buttons: [
        { actionName: 'rise', title: 'Rise', label: 'Payout', position: 'left' },
        { actionName: 'fall', title: 'Fall', label: 'Payout', position: 'right' }
      ],
      fields: {
        duration: true,
        stake: true,
        allowEquals: true
      },
      metadata: {
        preloadFields: true
      }
    }
  }
}));

// Mock SSE
jest.mock('@/services/api/sse/createSSEConnection', () => ({
  createSSEConnection: () => jest.fn()
}));

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
  MarketSelector: () => <div data-testid="market-selector">Market Selector</div>
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

jest.mock('../components/TradeFormController', () => ({
  TradeFormController: ({ isLandscape }: { isLandscape: boolean }) => (
    <div data-testid="trade-form-controller" data-landscape={isLandscape}>
      Trade Form Controller
    </div>
  )
}));

describe('TradePage', () => {
  const mockToggleAllowEquals = jest.fn();
  const mockSetBottomSheet = jest.fn();
  const mockSetPayouts = jest.fn();
  const mockSetLeftSidebar = jest.fn();

  const mockSelectedMarket = {
    symbol: '1HZ100V',
    displayName: 'Volatility 100 (1s) Index',
    shortName: '100',
    market_name: 'synthetic_index',
    isOneSecond: true,
    type: 'volatility' as const
  };

  beforeEach(() => {
    // Setup store mocks
    jest.spyOn(tradeStore, 'useTradeStore').mockImplementation(() => ({
      trade_type: 'rise_fall',
      stake: '10.00',
      duration: '1 minute',
      allowEquals: false,
      toggleAllowEquals: mockToggleAllowEquals,
      setPayouts: mockSetPayouts,
      instrument: '1HZ100V'
    }));

    jest.spyOn(bottomSheetStore, 'useBottomSheetStore').mockImplementation(() => ({
      setBottomSheet: mockSetBottomSheet,
      isOpen: false,
      type: null
    }));

    jest.spyOn(orientationStore, 'useOrientationStore').mockImplementation(() => ({
      isLandscape: false
    }));

    jest.spyOn(clientStore, 'useClientStore').mockImplementation(() => ({
      token: 'test-token',
      currency: 'USD'
    }));

    jest.spyOn(deviceDetection, 'useDeviceDetection').mockImplementation(() => ({
      isMobile: false,
      isDesktop: true
    }));

    jest.spyOn(leftSidebarStore, 'useLeftSidebarStore').mockImplementation(() => ({
      isOpen: false,
      title: "Select Market",
      setLeftSidebar: mockSetLeftSidebar
    }));

    jest.spyOn(marketStore, 'useMarketStore').mockImplementation(() => ({
      selectedMarket: mockSelectedMarket,
      setSelectedMarket: jest.fn()
    }));

    // Clear mocks
    mockToggleAllowEquals.mockClear();
    mockSetBottomSheet.mockClear();
    mockSetPayouts.mockClear();
    mockSetLeftSidebar.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders in portrait mode', async () => {
    jest.spyOn(deviceDetection, 'useDeviceDetection').mockImplementation(() => ({
      isMobile: true,
      isDesktop: false
    }));

    render(<TradePage />);

    // Balance display should not be visible in portrait mode
    expect(screen.queryByTestId('balance-display')).not.toBeInTheDocument();
    expect(screen.getByTestId('bottom-sheet')).toBeInTheDocument();
    expect(screen.getByTestId('duration-options')).toBeInTheDocument();

    expect(screen.getByText('Rise/Fall')).toBeInTheDocument();

    // Check layout classes
    const tradePage = screen.getByTestId('trade-page');
    expect(tradePage.className).toContain('flex');
    expect(tradePage.className).toContain('flex-col');
    expect(tradePage.className).toContain('flex-1');
    expect(tradePage.className).toContain('h-[100%]');
  });

  it('renders in landscape mode', async () => {
    jest.spyOn(orientationStore, 'useOrientationStore').mockImplementation(() => ({
      isLandscape: true
    }));

    jest.spyOn(deviceDetection, 'useDeviceDetection').mockImplementation(() => ({
      isMobile: false,
      isDesktop: true
    }));

    render(<TradePage />);

    // Balance display should be visible in landscape mode
    expect(screen.getByTestId('bottom-sheet')).toBeInTheDocument();
    expect(screen.getByTestId('market-selector')).toBeInTheDocument();

    // // Check for MarketInfo with selected market
    expect(screen.getByText('Rise/Fall')).toBeInTheDocument();

    // Check layout classes
    const tradePage = screen.getByTestId('trade-page');
    expect(tradePage.className).toContain('flex');
    expect(tradePage.className).toContain('flex-row');
    expect(tradePage.className).toContain('relative');
    expect(tradePage.className).toContain('flex-1');
    expect(tradePage.className).toContain('h-[100%]');
  });

  it('shows "Select Market" when no market is selected', () => {
    jest.spyOn(marketStore, 'useMarketStore').mockImplementation(() => ({
      selectedMarket: null,
      setSelectedMarket: jest.fn()
    }));

    render(<TradePage />);

    expect(screen.getByText('Select Market')).toBeInTheDocument();
  });
});
