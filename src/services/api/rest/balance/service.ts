import axios from "axios";
import { apiConfig } from "@/config/api";
import { useClientStore } from "@/stores/clientStore";

export const fetchBalance = async () => {
    if (typeof useClientStore.getState !== "function") return;
    const token = useClientStore.getState().token;
    if (!token) return;

    try {
        const response = await axios.get(
            `${apiConfig.rest.baseUrl}/v1/accounting/balance`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const { balance, currency } = response.data;
        useClientStore.getState().setBalance(balance, currency);
    } catch (error) {
        console.error("Failed to fetch balance:", error);
    }
};
