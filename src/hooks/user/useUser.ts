import { useQuery } from "@/api/hooks";
import { getAccounts } from "@/api/services/user/user-rest";
import { AccountsResponse } from "@/api/services/user/types";

/**
 * Hook for fetching user accounts
 * @param options Additional options for the query
 * @returns Query result with accounts data
 */
export const useAccounts = (options?: {
    enabled?: boolean;
    onSuccess?: (data: AccountsResponse) => void;
    onError?: (error: Error) => void;
}) => {
    return useQuery<AccountsResponse, void>({
        queryFn: getAccounts,
        params: undefined,
        enabled: options?.enabled,
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
};
