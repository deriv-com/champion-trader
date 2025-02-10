import { render, screen } from '@testing-library/react';
import { TradePage } from '../TradePage';
import * as tradeStore from '@/stores/tradeStore';
import * as bottomSheetStore from '@/stores/bottomSheetStore';
import * as orientationStore from '@/stores/orientationStore';
import * as clientStore from '@/stores/clientStore';

// Mock all required stores
jest.mock('@/stores/tradeStore');
jest.mock('@/stores/bottomSheetStore');
jest.mock('@/stores/orientationStore');
jest.mock('@/stores/clientStore');

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

// Mock lazy loaded components
jest.mock('@/components/Duration', () => ({
  DurationField: () => (
    <div className="h-auto bg-black/[0.04] rounded-lg py-4 px-4 cursor-pointer" onClick={() => {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(event);
    }}>
      <button data-testid="duration-field" aria-label="Duration">Duration Field</button>
    </div>
  )
}));

jest.mock('@/components/Stake', () => ({
  StakeField: () => (
    <div className="h-auto bg-black/[0.04] rounded-lg py-4 px-4 cursor-pointer" onClick={() => {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(event);
    }}>
      <button data-testid="stake-field" aria-label="Stake">Stake Field</button>
    </div>
  )
}));

jest.mock('@/components/EqualTrade', () => ({
  EqualTradeController: () => (
    <div data-testid="equal-trade">
      <button role="switch" aria-label="Allow equals" data-testid="allow-equals-toggle">Toggle</button>
    </div>
  )
}));

describe('TradePage', () => {
  const mockToggleAllowEquals = jest.fn();
  const mockSetBottomSheet = jest.fn();
  const mockSetPayouts = jest.fn();

  beforeEach(() => {
    // Setup store mocks
    jest.spyOn(tradeStore, 'useTradeStore').mockImplementation(() => ({
      trade_type: 'rise_fall',
      stake: '10.00',
      duration: '1 minute',
      allowEquals: false,
      toggleAllowEquals: mockToggleAllowEquals,
      setPayouts: mockSetPayouts
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

    // Clear mocks
    mockToggleAllowEquals.mockClear();
    mockSetBottomSheet.mockClear();
    mockSetPayouts.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders in portrait mode', async () => {
    render(<TradePage />);

    // Balance display should not be visible in portrait mode
    expect(screen.queryByTestId('balance-display')).not.toBeInTheDocument();
    expect(screen.getByTestId('bottom-sheet')).toBeInTheDocument();
    expect(screen.getByTestId('add-market-button')).toBeInTheDocument();
    expect(screen.getByTestId('duration-options')).toBeInTheDocument();

    // Check layout classes
    const tradePage = screen.getByTestId('trade-page');
    expect(tradePage).toHaveClass('flex flex-col flex-1 h-[100dvh]');
  });

  it('renders in landscape mode', async () => {
    jest.spyOn(orientationStore, 'useOrientationStore').mockImplementation(() => ({
      isLandscape: true
    }));

    render(<TradePage />);

    // Balance display should be visible in landscape mode
    expect(screen.getByTestId('balance-display')).toBeInTheDocument();
    expect(screen.getByTestId('bottom-sheet')).toBeInTheDocument();
    expect(screen.getByTestId('add-market-button')).toBeInTheDocument();
    expect(screen.getByTestId('duration-options')).toBeInTheDocument();

    // Check layout classes
    const tradePage = screen.getByTestId('trade-page');
    expect(tradePage).toHaveClass('flex flex-row relative flex-1 h-[100dvh]');
  });

});
