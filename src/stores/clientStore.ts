import { create } from 'zustand';

interface ClientState {
  token: string | null;
  isLoggedIn: boolean;
  balance: string;
  currency: string;
  accountType: 'real' | 'demo';
  setToken: (token: string | null) => void;
  setBalance: (balance: string, currency: string) => void;
  setAccountType: (type: 'real' | 'demo') => void;
  logout: () => void;
}

export const useClientStore = create<ClientState>((set) => ({
  isLoggedIn: false,
  token: null,
  balance: '0',
  currency: 'USD',
  accountType: 'demo',
  setToken: (token: string | null) => 
    set({ token, isLoggedIn: !!token }),
  setBalance: (balance: string, currency: string) => 
    set({ balance, currency }),
  setAccountType: (type) => set({ accountType: type }),
  logout: () =>
    set({ token: null, isLoggedIn: false, balance: '0', currency: 'USD', accountType: 'demo' }),
}));
