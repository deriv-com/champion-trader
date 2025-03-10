import { useEffect } from 'react';
import { useContracts } from '@/hooks/useContracts';
import { useTradeStore } from '@/stores/tradeStore';
import { transformContractData } from '@/utils/contractUtils';

/**
 * Hook to fetch contract details from the regular contracts endpoint
 * This serves as a fallback when the streaming endpoint doesn't return expected data
 * 
 * @param id - The ID of the contract to fetch details for
 * @returns Object containing loading and error states
 */
export const useContractDetailsRest = (id: string | undefined) => {
  const { contracts, loading, error } = useContracts();
  const { setContractDetails } = useTradeStore();
  const contractDetails = useTradeStore((state) => state.contractDetails);

  useEffect(() => {
    // Only use fallback if we have contracts data and no contract details yet
    if (!contractDetails && !loading && contracts.length > 0 && id) {
      const selectedContract = contracts.find(c => c.contract_id === id);
      if (selectedContract) {
        // Transform contract data using utility function
        const processedContract = transformContractData(selectedContract);
        
        // Set contract details in store
        setContractDetails(processedContract);
      }
    }
  }, [id, contracts, contractDetails, loading, setContractDetails]);

  return { loading, error };
};
