import React from "react";
import { Chip } from "@/components/ui/chip";

interface TradeTypesListProps {
    selectedProductId: string;
    products: Array<{
        id: string;
        display_name: string;
    }>;
    onProductSelect: (productId: string) => void;
}

export const TradeTypesList: React.FC<TradeTypesListProps> = ({
    selectedProductId,
    products,
    onProductSelect,
}) => {
    return (
        <div className="w-full max-w-full flex gap-2 overflow-x-scroll py-2 px-4">
            {products.map((product) => (
                <div key={product.id} className="flex-shrink-0">
                    <Chip
                        isSelected={selectedProductId === product.id}
                        onClick={() => onProductSelect(product.id)}
                    >
                        {product.display_name}
                    </Chip>
                </div>
            ))}
        </div>
    );
};
