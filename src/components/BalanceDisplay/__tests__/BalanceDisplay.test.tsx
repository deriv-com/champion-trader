import { render, screen, fireEvent } from '@testing-library/react';
import { BalanceDisplay } from '../BalanceDisplay';

jest.mock('@/stores/clientStore', () => ({
  useClientStore: jest.fn(() => ({
    token: 'test-token',
    isLoggedIn: true,
    balance: '1,000',
    currency: 'USD',
    setBalance: jest.fn(),
    setToken: jest.fn(),
    logout: jest.fn()
  })),
  getState: () => ({
    token: 'test-token',
    isLoggedIn: true,
    balance: '1,000',
    currency: 'USD',
    setBalance: jest.fn(),
    setToken: jest.fn(),
    logout: jest.fn()
  })
}));

describe('BalanceDisplay', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('when logged in', () => {
    beforeEach(() => {
      // Import the mocked module inside the test
      const { useClientStore } = require('@/stores/clientStore');
      (useClientStore as jest.Mock).mockReturnValue({ 
        isLoggedIn: true,
        balance: '1,000',
        currency: 'USD'
      });
    });

    it('renders balance from store and default deposit label', () => {
      render(<BalanceDisplay />);
      
      expect(screen.getByText('Real')).toBeInTheDocument();
      expect(screen.getByText('1,000 USD')).toBeInTheDocument(); // matches combined balance and currency
      expect(screen.getByText('Deposit')).toBeInTheDocument();
    });

    it('renders custom deposit label when provided', () => {
      render(<BalanceDisplay depositLabel="Add Funds" />);
      
      expect(screen.getByText('Add Funds')).toBeInTheDocument();
    });

    it('calls onDeposit when deposit button is clicked', () => {
      const mockOnDeposit = jest.fn();
      render(<BalanceDisplay onDeposit={mockOnDeposit} />);
      
      fireEvent.click(screen.getByText('Deposit'));
      expect(mockOnDeposit).toHaveBeenCalledTimes(1);
    });

    it('applies custom className when provided', () => {
      render(<BalanceDisplay className="custom-class" />);
      
      expect(screen.getByText('Real').parentElement?.parentElement).toHaveClass('custom-class');
    });
  });

  describe('when logged out', () => {
    beforeEach(() => {
      const { useClientStore } = require('@/stores/clientStore');
      (useClientStore as jest.Mock).mockReturnValue({ 
        isLoggedIn: false,
        balance: '0',
        currency: 'USD'
      });
    });

    it('renders login button', () => {
      render(<BalanceDisplay />);
      
      expect(screen.getByText('Log in')).toBeInTheDocument();
      expect(screen.queryByText('Real')).not.toBeInTheDocument();
      expect(screen.queryByText('0 USD')).not.toBeInTheDocument();
    });

    it('renders login button with default login URL', () => {
      render(<BalanceDisplay />);
      
      const loginLink = screen.getByText('Log in');
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('renders login button with custom login URL when provided', () => {
      const customUrl = 'https://custom-login.example.com';
      render(<BalanceDisplay loginUrl={customUrl} />);
      
      const loginLink = screen.getByText('Log in');
      expect(loginLink).toHaveAttribute('href', customUrl);
    });

    it('applies custom className when provided', () => {
      render(<BalanceDisplay className="custom-class" />);
      
      expect(screen.getByText('Log in').parentElement).toHaveClass('custom-class');
    });
  });
});
