import { useEffect } from "react";
import { useClientStore } from "@/stores/clientStore";
import { useAccountBalanceStream } from "@/hooks/user/useBalance";

interface BalanceHandlerProps {
    token: string;
}

/**
 * Component that handles balance updates from the streaming API
 * This component doesn't render anything, it just subscribes to the balance stream
 * and updates the client store with the latest balance data
 */
export const BalanceHandler: React.FC<BalanceHandlerProps> = ({ token }) => {
    const { selectedAccountId, setBalance } = useClientStore();
    const { data } = useAccountBalanceStream(selectedAccountId);

    useEffect(() => {
        if (data?.data) {
            const { balance, currency } = data.data;
            setBalance(balance, currency);
        }
    }, [data, setBalance]);

    return null;
};
