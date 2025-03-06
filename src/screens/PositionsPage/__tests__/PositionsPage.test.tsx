import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import PositionsPage from '../PositionsPage';
import { useContracts } from '@/hooks/useContracts';
import * as tradeStore from '@/stores/tradeStore';
import { formatDate, formatGMTTime } from '@/utils/dateUtils';

// Mock the hooks
jest.mock('@/hooks/useContracts');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock the trade store
const setContractDetailsMock = jest.fn();
jest.spyOn(tradeStore, 'useTradeStore').mockImplementation(() => ({
  setContractDetails: setContractDetailsMock,
  contractDetails: null,
}));

const mockNavigate = jest.fn();

const mockContracts = [
  {
    contract_id: '1',
    product_id: 'prod_1',
    contract_details: {
      allow_equals: false,
      barrier: '100.00',
      bid_price: '10.00',
      bid_price_currency: 'USD',
      duration: 60,
      duration_units: 'seconds',
      entry_spot: '99.00',
      exit_spot: '101.00',
      exit_time: 1234567890,
      expiry: 1234567890,
      instrument_id: 'VOL100',
      instrument_name: 'Volatility 100 (1s) Index',
      is_expired: false,
      is_sold: false,
      is_valid_to_sell: true,
      potential_payout: '20.00',
      pricing_tick_id: '12345',
      profit_loss: '+10.00',
      reference_id: '547294814948',
      stake: '10.00',
      start_time: 1234567830,
      variant: 'rise'
    }
  }
];

const renderWithRouter = () => {
  return render(
    <MemoryRouter>
      <PositionsPage />
    </MemoryRouter>
  );
};

describe('PositionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useContracts as jest.Mock).mockReturnValue({
      contracts: mockContracts,
      loading: false,
      error: null,
      refetchContracts: jest.fn()
    });
    setContractDetailsMock.mockClear();
  });

  it('renders the positions page with tabs', () => {
    renderWithRouter();
    
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('displays contracts in the list', () => {
    renderWithRouter();
    
    expect(screen.getByText('Volatility 100 (1s) Index')).toBeInTheDocument();
  });

  it('navigates to contract details when clicking a position', () => {
    renderWithRouter();

    const position = screen.getByText('Volatility 100 (1s) Index');
    fireEvent.click(position);

    // Check that navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/contract/1');
    
    // Check that setContractDetails was called with the correct data
    expect(setContractDetailsMock).toHaveBeenCalledWith(expect.objectContaining({
      type: 'Rise',
      market: 'Volatility 100 (1s) Index',
      stake: '10.00',
      profit: '+10.00',
      barrier: '100.00',
      payout: '20.00',
      referenceId: '547294814948',
      startTime: formatDate(mockContracts[0].contract_details.start_time),
      startTimeGMT: formatGMTTime(mockContracts[0].contract_details.start_time),
      entrySpot: '99.00',
      entryTimeGMT: formatGMTTime(mockContracts[0].contract_details.start_time),
      exitTime: formatDate(mockContracts[0].contract_details.exit_time),
      exitTimeGMT: formatGMTTime(mockContracts[0].contract_details.exit_time),
      exitSpot: '101.00'
    }));
  });

  it('switches between open and closed tabs', () => {
    renderWithRouter();
    
    // Initially on Open tab
    expect(screen.getByText('Open').className).toContain('border-primary');
    
    // Click on Closed tab
    fireEvent.click(screen.getByText('Closed'));
    
    // Now Closed tab should be active
    expect(screen.getByText('Closed').className).toContain('border-primary');
    expect(screen.getByText('Open').className).not.toContain('border-primary');
  });

  it('shows loading state when contracts are loading', () => {
    (useContracts as jest.Mock).mockReturnValue({
      contracts: [],
      loading: true,
      error: null,
      refetchContracts: jest.fn()
    });
    
    renderWithRouter();
    
    expect(screen.getByText('Loading contracts...')).toBeInTheDocument();
  });

  it('shows error state when there is an error', () => {
    (useContracts as jest.Mock).mockReturnValue({
      contracts: [],
      loading: false,
      error: 'Failed to fetch contracts',
      refetchContracts: jest.fn()
    });
    
    renderWithRouter();
    
    expect(screen.getByText('Failed to fetch contracts')).toBeInTheDocument();
  });

  it('shows empty state when no contracts are found', () => {
    (useContracts as jest.Mock).mockReturnValue({
      contracts: [],
      loading: false,
      error: null,
      refetchContracts: jest.fn()
    });
    
    renderWithRouter();
    
    expect(screen.getByText('No open contracts found')).toBeInTheDocument();
  });
});
