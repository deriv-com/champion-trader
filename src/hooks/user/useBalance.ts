import { useState, useEffect } from "react";
import { subscribeToBalance } from "@/api/services/user/user-sse";
import { BalanceResponse } from "@/api/services/user/types";

/**
 * Hook to subscribe to the balance stream for a specific account
 * @param accountUuid The account UUID to get balance for
 * @returns The balance data from the stream
 */
export const useAccountBalanceStream = (accountUuid: string) => {
    const [data, setData] = useState<BalanceResponse | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!accountUuid) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const cleanup = subscribeToBalance(
            accountUuid,
            (balanceData: BalanceResponse) => {
                setData(balanceData);
                setIsLoading(false);
            },
            (err: any) => {
                setError(err instanceof Error ? err : new Error(String(err)));
                setIsLoading(false);
            }
        );

        return cleanup;
    }, [accountUuid]);

    return { data, error, isLoading };
};
