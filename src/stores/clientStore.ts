import { create } from 'zustand';

interface ClientState {
  isLoggedIn: boolean;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useClientStore = create<ClientState>((set) => ({
  isLoggedIn: false,
  token: null,
  setToken: (token: string | null) => 
    set({ token, isLoggedIn: !!token }),
  logout: () => 
    set({ token: null, isLoggedIn: false }),
}));
