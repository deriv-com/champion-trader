import React, { useState, useEffect } from "react";
import { getProducts } from "@/services/api/rest/product/service";
import { TabList, Tab } from "@/components/ui/tab-list";
import { useTradeStore } from "@/stores/tradeStore";
import { TradeType } from "@/config/tradeTypes";
import { Skeleton } from "@/components/ui/skeleton";

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
                // Set initial trade type with its display name
                const initialProduct = response.data.products[0];
                setTradeType(initialProduct.id, initialProduct.display_name);
                setError(null);
            } catch (err) {
                setError("Failed to load trade types");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTradeTypes();
    }, []);

    // Handle trade type selection
    const handleTradeTypeSelect = (tradeTypeId: TradeType) => {
        // Find the selected product to get its display name
        const selectedProduct = tradeTypes.find(
            (product) => product.id === tradeTypeId
        );
        // Pass both the trade type ID and display name to setTradeType
        setTradeType(tradeTypeId, selectedProduct?.display_name);
    };

    // Show loading state or error
    if (isLoading) {
        return (
            <div className="min-h-fit lg:min-h-14 flex items-center mx-4">
                <div className="max-w-full flex gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="shrink-0">
                            <Skeleton className="h-9 w-20 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error && tradeTypes.length === 0) {
        return (
            <div className="min-h-fit lg:min-h-14 flex items-center">
                Error: {error}
            </div>
        );
    }

    // Transform products into the format expected by TabList
    const tabs: Tab[] = tradeTypes.map((product) => ({
        label: product.display_name,
        value: product.id,
    }));

    // Render TabList component directly
    return (
        <div className="min-h-fit lg:min-h-14 flex items-center mx-4">
            <TabList
                variant="chip"
                tabs={tabs}
                selectedValue={trade_type}
                onSelect={handleTradeTypeSelect}
            />
        </div>
    );
};
