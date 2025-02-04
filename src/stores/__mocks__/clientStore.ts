const store = {
  token: 'test-token',
  isLoggedIn: true,
  balance: '1,000',
  currency: 'USD',
  setBalance: jest.fn(),
  setToken: jest.fn(),
  logout: jest.fn(),
};

export const useClientStore = () => store;
useClientStore.getState = () => store;

export default useClientStore;
