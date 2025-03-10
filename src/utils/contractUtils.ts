/**
 * Format duration based on units
 * @param duration - The duration value
 * @param units - The units of the duration (ticks, seconds, etc.)
 * @returns Formatted duration string
 */
export const formatDuration = (duration: number, units: string): string => {
  if (units === 'ticks') {
    return `0/${duration} ticks`;
  } else if (units === 'seconds') {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:00`;
  }
  return `${duration} ${units}`;
};

/**
 * Transform contract data from API to ProcessedContract format
 * @param contractData - The contract data from the API
 * @returns ProcessedContract object
 */
export const transformContractData = (contractData: any) => {
  const { formatDate, formatGMTTime } = require('@/utils/dateUtils');
  
  return {
    id: parseInt(contractData.contract_id) || Math.floor(Math.random() * 10000),
    originalId: contractData.contract_id,
    type: contractData.contract_details.variant.charAt(0).toUpperCase() + 
          contractData.contract_details.variant.slice(1),
    market: contractData.contract_details.instrument_name || "",
    duration: formatDuration(
      contractData.contract_details.duration, 
      contractData.contract_details.duration_units
    ),
    stake: contractData.contract_details.stake,
    profit: contractData.contract_details.profit_loss || "+0.00",
    isOpen: !contractData.contract_details.is_expired && !contractData.contract_details.is_sold,
    // Additional fields
    barrier: contractData.contract_details.barrier,
    payout: contractData.contract_details.potential_payout || contractData.contract_details.bid_price,
    referenceId: contractData.contract_details.reference_id || "547294814948",
    startTime: formatDate(contractData.contract_details.start_time),
    startTimeGMT: formatGMTTime(contractData.contract_details.start_time),
    entrySpot: contractData.contract_details.entry_spot || "",
    entryTimeGMT: formatGMTTime(contractData.contract_details.start_time),
    exitTime: formatDate(contractData.contract_details.exit_time),
    exitTimeGMT: formatGMTTime(contractData.contract_details.exit_time),
    exitSpot: contractData.contract_details.exit_spot || ""
  };
};
