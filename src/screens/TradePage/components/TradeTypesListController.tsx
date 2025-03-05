import React, { useState, useEffect } from "react";
import { getProducts } from "@/services/api/rest/product/service";
import { TabList, Tab } from "@/components/ui/tab-list";
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
                // setTradeTypes([
                //     { id: "rise_fall", display_name: "Rise/Fall" },
                //     { id: "high_low", display_name: "Higher/Lower" },
                //     { id: "touch", display_name: "Touch/No Touch" },
                //     { id: "multiplier", display_name: "Multiplier" },
                // ]);
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
    const handleTradeTypeSelect = (tradeTypeId: string) => {
        setTradeType(tradeTypeId as TradeType);
    };

    // Show loading state or error
    if (isLoading) {
        return (
            <div className="min-h-fit lg:min-h-14 flex items-center">
                Loading trade types...
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
