const store = {
    token: "test-token",
    isLoggedIn: true,
    balance: "1,000",
    currency: "USD",
    group: "demo",
    status: "active",
    account_uuid: "96070fd6-e413-4743-8b12-2485e631cf45",
    setBalance: jest.fn(),
    setToken: jest.fn(),
    setGroup: jest.fn(),
    setStatus: jest.fn(),
    setAccountUuid: jest.fn(),
    setAccount: jest.fn(),
    resetState: jest.fn(),
};

export const useClientStore = () => store;
useClientStore.getState = () => store;

export default useClientStore;
