import React, { useState, useEffect } from "react";
import { getProducts } from "@/services/api/rest/product/service";
import { TradeTypesList } from "@/components/TradeTypes";
import { useTradeStore } from "@/stores/tradeStore";
import { TradeType } from "@/config/tradeTypes";

export const TradeTypesListController: React.FC = () => {
    // Get trade_type and setTradeType from tradeStore
    const trade_type = useTradeStore((state) => state.trade_type);
    const setTradeType = useTradeStore((state) => state.setTradeType);

    // State for trade types
    const [tradeTypes, setTradeTypes] = useState<
        Array<{ id: string; display_name: string }>
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch trade types on component mount
    useEffect(() => {
        const fetchTradeTypes = async () => {
            try {
                setIsLoading(true);
                const response = await getProducts();
                setTradeTypes(response.data.products);
                setError(null);
            } catch (err) {
                setError("Failed to load trade types");
                console.error(err);
                // Fallback to default trade types if API fails
                setTradeTypes([
                    { id: "rise_fall", display_name: "Rise/Fall" },
                    { id: "high_low", display_name: "Higher/Lower" },
                    { id: "touch", display_name: "Touch/No Touch" },
                    { id: "multiplier", display_name: "Multiplier" },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTradeTypes();
    }, []);

    // Handle trade type selection
    const handleTradeTypeSelect = (tradeTypeId: string) => {
        setTradeType(tradeTypeId as TradeType);
    };

    // Show loading state or error
    if (isLoading) {
        return <div>Loading trade types...</div>;
    }

    if (error && tradeTypes.length === 0) {
        return <div>Error: {error}</div>;
    }

    // Render TradeTypesList component
    return (
        <TradeTypesList
            selectedProductId={trade_type}
            products={tradeTypes}
            onProductSelect={handleTradeTypeSelect}
        />
    );
};
