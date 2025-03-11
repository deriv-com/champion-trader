import { useClientStore } from "@/stores/clientStore";
import { accountData } from "@/config/accountConfig";
import type { AccountInfo } from "@/config/accountConfig";
import { useEffect } from "react";

export const useAccount = () => {
    const { token, group, account_uuid, setAccount } = useClientStore();

    const selectedAccount = accountData.find((account) => account.uuid === account_uuid);

    // Initialize account data when token changes
    useEffect(() => {
        if (!token) return;

        // If no account is selected, select the first account
        if (!account_uuid && accountData.length > 0) {
            // Default to demo account
            const demoAccounts = accountData.filter((account) => account.group === "demo");
            if (demoAccounts.length > 0) {
                setAccount(demoAccounts[0]);
            } else {
                setAccount(accountData[0]);
            }
        }
    }, [token, account_uuid, setAccount]);

    const switchAccountType = (type: "demo" | "real") => {
        // When switching account type, select the first account of that type
        const accountsOfType = accountData.filter((account) => account.group === type);
        if (accountsOfType.length > 0) {
            setAccount(accountsOfType[0]);
        }
    };

    const selectAccount = (uuid: string) => {
        const account = accountData.find((acc) => acc.uuid === uuid);
        if (!account) {
            throw new Error(`Invalid account UUID: ${uuid}`);
        }
        setAccount(account);
    };

    const getAvailableAccounts = (): AccountInfo[] => {
        return accountData.filter((account) => account.group === group);
    };

    return {
        group,
        account_uuid,
        selectedAccount,
        switchAccountType,
        selectAccount,
        getAvailableAccounts,
        isDemo: group === "demo",
        isReal: group === "real",
    };
};
