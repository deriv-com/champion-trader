import { useEffect } from 'react';
import { fetchBalance } from '@/services/api/rest/balance/service';

interface BalanceHandlerProps {
  token: string;
}

export const BalanceHandler: React.FC<BalanceHandlerProps> = ({ token }) => {
  useEffect(() => {
    // Initial fetch
    fetchBalance();

    // Set up polling every 10 seconds
    const interval = setInterval(() => {
      fetchBalance();
    }, 10000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [token]);

  return null;
};
