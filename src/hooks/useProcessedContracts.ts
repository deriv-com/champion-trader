import { useMemo } from 'react';
import { useContracts } from './useContracts';

export interface ProcessedContract {
  id: number;
  originalId: string;
  type: string;
  market: string;
  duration: string;
  stake: string;
  profit: string;
  isOpen: boolean;
  // Additional fields from ContractDetails
  barrier?: string;
  payout?: string;
  referenceId?: string;
  startTime?: string;
  startTimeGMT?: string;
  entrySpot?: string;
  entryTimeGMT?: string;
  exitTime?: string;
  exitTimeGMT?: string;
  exitSpot?: string;
}

/**
 * Hook to process contracts data into a consistent format for both mobile and desktop views
 * @returns Object containing processed contracts data and utility functions
 */
export const useProcessedContracts = () => {
  const { contracts, loading, error, refetchContracts } = useContracts();
  
  // Process contracts into a consistent format
  const processedContracts = useMemo(() => {
    return contracts.map(contract => ({
      id: parseInt(contract.contract_id) || Math.floor(Math.random() * 10000),
      originalId: contract.contract_id,
      type: contract.contract_details.variant.charAt(0).toUpperCase() + 
            contract.contract_details.variant.slice(1),
      market: contract.contract_details.instrument_name || "",
      duration: formatDuration(
        contract.contract_details.duration, 
        contract.contract_details.duration_units
      ),
      stake: `${contract.contract_details.stake} USD`,
      profit: contract.contract_details.profit_loss || "+0.00 USD",
      isOpen: !contract.contract_details.is_expired && !contract.contract_details.is_sold,
    }));
  }, [contracts]);
  
  // Separate open and closed positions
  const openContracts = useMemo(() => 
    processedContracts.filter(contract => contract.isOpen),
  [processedContracts]);
  
  const closedContracts = useMemo(() => 
    processedContracts.filter(contract => !contract.isOpen),
  [processedContracts]);
  
  // Calculate total profit
  const calculateTotalProfit = (contracts: ProcessedContract[]): number => {
    return contracts.reduce((total, contract) => {
      const profitStr = contract.profit.replace(' USD', '');
      const profit = parseFloat(profitStr) || 0;
      return total + profit;
    }, 0);
  };
  
  return {
    processedContracts,
    openContracts,
    closedContracts,
    loading,
    error,
    refetchContracts,
    calculateTotalProfit
  };
};

// Helper function to format duration
const formatDuration = (duration: number, units: string): string => {
  if (units === 'ticks') {
    return `0/${duration} ticks`;
  } else if (units === 'seconds') {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:00`;
  }
  return `${duration} ${units}`;
};
