import { useClientStore } from "@/stores/clientStore";
import { accountData } from "@/config/accountConfig";
import type { AccountInfo } from "@/config/accountConfig";

export const useAccount = () => {
  const {
    accountType,
    selectedAccountId,
    setAccountType,
    setSelectedAccountId,
  } = useClientStore();

  const selectedAccount = accountData.find(
    (account) => account.id === selectedAccountId
  );

  const switchAccountType = (type: "real" | "demo") => {
    setAccountType(type);
    // When switching to demo, we don't need to change selectedAccountId as it's not used
    // When switching to real, ensure we have a valid account selected
    if (type === "real" && !selectedAccount) {
      setSelectedAccountId(accountData[0].id);
    }
  };

  const selectAccount = (id: string) => {
    const account = accountData.find((acc) => acc.id === id);
    if (!account) {
      throw new Error(`Invalid account ID: ${id}`);
    }
    setSelectedAccountId(id);
  };

  const getAvailableAccounts = (): AccountInfo[] => {
    return accountType === "real" ? accountData : [];
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
