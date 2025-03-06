import { Contract } from "@/hooks/useContracts";
import { apiClient } from "../../axios_interceptor";

interface ContractResponse {
  data: {
    contracts: Contract[];
    total_profit_loss: string;
  };
  meta: {
    endpoint: string;
    method: string;
    timing: number;
  };
}

/**
 * Fetches contracts from the external API
 * @returns Promise with the contracts response
 * @throws Error if the API call fails
 */
export const fetchContracts = async (): Promise<Contract[]> => {
  try {
    const response = await apiClient.get<ContractResponse>(
      "/v1/trading/contracts"
    );

    return response.data.data.contracts;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch contracts: ${error.message}`);
    }
    throw new Error("Failed to fetch contracts: Unknown error");
  }
};
