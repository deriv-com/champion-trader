import { useEffect, useState } from 'react';
import { createSSEConnection } from '@/services/api/sse/createSSEConnection';
import { Contract } from '@/hooks/useContracts';
import { useTradeStore } from '@/stores/tradeStore';
import { transformContractData } from '@/utils/contractUtils';

/**
 * Hook to stream contract details for a specific contract
 * @param id - The ID of the contract to stream details for
 * @returns Object containing loading and error states
 */
export const useContractDetailsStream = (id: string | undefined) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { setContractDetails } = useTradeStore();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Create SSE connection for contract details
    const cleanup = createSSEConnection({
      params: {},
      endpoint: `/v1/trading/contracts/${id}/stream`,
      onMessage: (data) => {
        setLoading(false);
        
        // Ensure we're handling Contract type
        if ('contract_id' in data) {
          const contractData = data as Contract;
          
          // Transform contract data using utility function
          const processedContract = transformContractData(contractData);
          
          setContractDetails(processedContract);
        }
      },
      onError: (err) => {
        console.error('Contract details stream error:', err);
        setLoading(false);
        setError('Failed to stream contract details');
      },
      onOpen: () => {
        // Stream opened successfully
      }
    });

    // Return cleanup function
    return cleanup;
  }, [id, setContractDetails]);

  return { loading, error };
};
