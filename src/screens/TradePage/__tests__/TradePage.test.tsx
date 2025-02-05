import { render, screen, act } from '@testing-library/react';
import { TradePage } from '../TradePage';
import { useTradeStore } from '@/stores/tradeStore';
import type { TradeState } from '@/stores/tradeStore';

// Mock lazy-loaded components
jest.mock('@/components/TradeButton', () => ({
  TradeButton: ({ title, value }: { title: string; value: string }) => (
    <div>
      <div>{title}</div>
      <div>{value}</div>
    </div>
  )
}));

jest.mock('@/components/Chart', () => ({
  Chart: () => <div>Chart Component</div>
}));

jest.mock('@/components/AddMarketButton', () => ({
  AddMarketButton: () => <div>Add Market Button</div>
}));

// Mock shadcn components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: () => void }) => (
    <button 
      onClick={onCheckedChange} 
      data-state={checked ? 'checked' : 'unchecked'}
      data-testid="allow-equals-switch"
    >
      Switch
    </button>
  ),
}));

// Mock the store
const mockUseTradeStore = useTradeStore as unknown as jest.MockedFunction<() => TradeState>;
jest.mock('@/stores/tradeStore', () => ({
  useTradeStore: jest.fn()
}));

describe('TradePage', () => {
  beforeEach(() => {
    mockUseTradeStore.mockImplementation(() => ({
      stake: '10 USD',
      duration: '10 tick',
      allowEquals: false,
      setStake: jest.fn(),
      setDuration: jest.fn(),
      toggleAllowEquals: jest.fn(),
      numpadValue: "",
      setNumpadValue: jest.fn()
    }));
  });

  it('renders market information', async () => {
    await act(async () => {
      render(<TradePage />);
    });
    
    // Use getAllByText since the text appears in both landscape and portrait views
    expect(screen.getAllByText('Vol. 100 (1s) Index')).toHaveLength(2);
    expect(screen.getAllByText('Rise/Fall')).toHaveLength(2);
  });

  it('renders trade parameters from store', async () => {
    await act(async () => {
      render(<TradePage />);
    });
    
    expect(screen.getByText('10 USD')).toBeInTheDocument();
    expect(screen.getByText('10 tick')).toBeInTheDocument();
  });

  it('renders trade buttons', async () => {
    await act(async () => {
      render(<TradePage />);
    });
    
    expect(screen.getByText('Rise')).toBeInTheDocument();
    expect(screen.getByText('Fall')).toBeInTheDocument();
  });

  it('toggles allow equals when clicked', async () => {
    const toggleMock = jest.fn();
    mockUseTradeStore.mockImplementation(() => ({
      stake: '10 USD',
      duration: '10 tick',
      allowEquals: false,
      setStake: jest.fn(),
      setDuration: jest.fn(),
      toggleAllowEquals: toggleMock,
      numpadValue: "",
      setNumpadValue: jest.fn()
    }));

    await act(async () => {
      render(<TradePage />);
    });
    
    const switchButton = screen.getByTestId('allow-equals-switch');
    expect(switchButton).toHaveAttribute('data-state', 'unchecked');
    
    await act(async () => {
      switchButton.click();
    });
    
    expect(toggleMock).toHaveBeenCalled();
  });
});
