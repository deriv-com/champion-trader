import { create } from "zustand";
import { accountData } from "@/config/accountConfig";

interface ClientState {
  token: string | null;
  isLoggedIn: boolean;
  balance: string;
  currency: string;
  accountType: "real" | "demo";
  selectedAccountId: string;
  setToken: (token: string | null) => void;
  setBalance: (balance: string, currency: string) => void;
  setAccountType: (type: "real" | "demo") => void;
  setSelectedAccountId: (id: string) => void;
  resetState: () => void;
}

export const useClientStore = create<ClientState>((set) => ({
  isLoggedIn: false,
  token: null,
  balance: "0",
  currency: "USD",
  accountType: "demo",
  selectedAccountId: accountData[0].id,
  setToken: (token: string | null) => set({ token, isLoggedIn: !!token }),
  setBalance: (balance: string, currency: string) => set({ balance, currency }),
  setAccountType: (type) => set({ accountType: type }),
  setSelectedAccountId: (id: string) => set({ selectedAccountId: id }),
  resetState: () => {
    set({
      token: null,
      isLoggedIn: false,
      balance: "0",
      currency: "USD",
      accountType: "demo",
      selectedAccountId: accountData[0].id,
    });
  },
}));
