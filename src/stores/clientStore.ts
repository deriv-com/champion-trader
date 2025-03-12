import { create } from "zustand";
import { AccountInfo } from "@/config/accountConfig";

interface ClientState {
    token: string | null;
    isLoggedIn: boolean;
    balance: string | null;
    currency: string;
    group: "demo" | "real" | null;
    status: "active" | "inactive" | null;
    account_uuid: string | null;
    setToken: (token: string | null) => void;
    setBalance: (balance: string, currency: string) => void;
    setGroup: (group: "demo" | "real") => void;
    setStatus: (status: "active" | "inactive") => void;
    setAccountUuid: (uuid: string) => void;
    setAccount: (account: AccountInfo) => void;
    resetState: () => void;
}

export const useClientStore = create<ClientState>((set) => ({
    isLoggedIn: false,
    token: null,
    balance: null,
    currency: "USD",
    group: null,
    status: null,
    account_uuid: null,
    setToken: (token: string | null) => set({ token, isLoggedIn: !!token }),
    setBalance: (balance: string, currency: string) => {
        // Only update if the currency matches the current currency
        set((state) => {
            if (state.currency === currency) {
                return { balance, currency };
            }
            return state;
        });
    },
    setGroup: (group) => set({ group }),
    setStatus: (status) => set({ status }),
    setAccountUuid: (uuid: string) => set({ account_uuid: uuid }),
    setAccount: (account: AccountInfo) => {
        set({
            balance: account.balance,
            currency: account.currency,
            group: account.group,
            status: account.status,
            account_uuid: account.uuid,
        });
    },
    resetState: () => {
        set({
            token: null,
            isLoggedIn: false,
            balance: null,
            currency: "USD",
            group: null,
            status: null,
            account_uuid: null,
        });
    },
}));
