import React from "react";
import { Plus } from "lucide-react";

interface AddMarketButtonProps {
    onClick?: () => void;
}

export const AddMarketButton: React.FC<AddMarketButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
            <Plus className="w-6 h-6 text-gray-600" />
        </button>
    );
};
