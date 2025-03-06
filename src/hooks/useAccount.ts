import { useClientStore } from "@/stores/clientStore";
import { accountData } from "@/config/accountConfig";
import type { AccountInfo } from "@/config/accountConfig";

export const useAccount = () => {
    const { accountType, selectedAccountId, setAccountType, setSelectedAccountId } =
        useClientStore();

    const selectedAccount = accountData.find((account) => account.id === selectedAccountId);

    const switchAccountType = (type: "real" | "demo") => {
        setAccountType(type);
    };

    const selectAccount = (id: string) => {
        const account = accountData.find((acc) => acc.id === id);
        if (!account) {
            throw new Error(`Invalid account ID: ${id}`);
        }
        setSelectedAccountId(id);
    };

    const getAvailableAccounts = (): AccountInfo[] => {
        return accountType === "real"
            ? accountData.filter((account) => !account.isDemo)
            : accountData.filter((account) => account.isDemo);
    };

    return {
        accountType,
        selectedAccountId,
        selectedAccount,
        switchAccountType,
        selectAccount,
        getAvailableAccounts,
        isDemo: accountType === "demo",
        isReal: accountType === "real",
    };
};
