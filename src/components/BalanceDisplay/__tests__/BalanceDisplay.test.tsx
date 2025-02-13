import { render, screen } from '@testing-library/react';
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
    });
  });
});
