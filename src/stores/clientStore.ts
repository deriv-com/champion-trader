import { create } from 'zustand';

interface ClientState {
  isLoggedIn: boolean;
  token: string | null;
  balance: string;
  currency: string;
  setToken: (token: string | null) => void;
  setBalance: (balance: string, currency: string) => void;
  logout: () => void;
}

export const useClientStore = create<ClientState>((set) => ({
  isLoggedIn: false,
  token: null,
  balance: '0',
  currency: 'USD',
  setToken: (token: string | null) => 
    set({ token, isLoggedIn: !!token }),
  setBalance: (balance: string, currency: string) => 
    set({ balance, currency }),
  logout: () => {
    localStorage.removeItem("loginToken");
    set({ token: null, isLoggedIn: false, balance: '0', currency: 'USD' });
    window.location.href = "/logout";
  },
}));
