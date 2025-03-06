import { fetchContracts } from '@/services/api/rest/contracts/contractsService';
import { useRestAPI } from '@/hooks/useRestAPI';

export interface Contract {
  contract_details: {
    allow_equals: boolean;
    barrier: string;
    bid_price: string;
    bid_price_currency: string;
    duration: number;
    duration_units: string;
    entry_spot: string;
    exit_spot: string;
    exit_time: number;
    expiry: number;
    instrument_id: string;
    instrument_name: string;
    is_expired: boolean;
    is_sold: boolean;
    is_valid_to_sell: boolean;
    potential_payout: string;
    pricing_tick_id: string;
    profit_loss: string;
    reference_id: string;
    stake: string;
    start_time: number;
    variant: string;
  };
  contract_id: string;
  product_id: string;
}

/**
 * Hook to fetch and manage contracts data
 * @returns Object containing contracts data, loading state, and error state
 */
export const useContracts = () => {
  const { data, loading, error, refetch } = useRestAPI<Contract[]>(fetchContracts);
  
  return { 
    contracts: data || [], 
    loading, 
    error,
    refetchContracts: refetch
  };
};
