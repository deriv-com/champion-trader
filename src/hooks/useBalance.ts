import { useCallback, useEffect } from "react";
import { useClientStore } from "@/stores/clientStore";
import { getBalance } from "@/services/api/rest/balance/service";
import { useToastStore } from "@/stores/toastStore";

export const useBalance = () => {
    const { account_uuid, setBalance } = useClientStore();
    const { toast } = useToastStore();

    // Fetch balance for the current account
    const fetchBalance = useCallback(async () => {
        if (!account_uuid) return;

        try {
            const balanceData = await getBalance({ account_uuid });
            setBalance(balanceData.balance, balanceData.currency);
        } catch (error) {
            console.error("Failed to fetch balance:", error);
            toast({
                content: `Failed to load balance: ${(error as Error).message}`,
                variant: "error",
                duration: 5000,
            });
        }
    }, [account_uuid, setBalance, toast]);

    // Set up polling for balance updates
    useEffect(() => {
        if (!account_uuid) return;

        // Initial fetch
        fetchBalance();

        // Set up polling every 10 seconds
        const interval = setInterval(() => {
            fetchBalance();
        }, 10000);

        // Cleanup on unmount
        return () => clearInterval(interval);
    }, [account_uuid, fetchBalance]);

    return {
        fetchBalance,
    };
};
