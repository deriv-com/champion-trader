import React from "react";
import { Contract } from "@/api/services/contract/types";
import { ContractSummary } from "./ContractSummary";
import { OrderDetails } from "./OrderDetails";
import { EntryExitDetails } from "./EntryExitDetails";

interface ContractDetailsPageSummaryProps {
    contract: Contract | null;
    loading: boolean;
    error: Error | null;
    className?: string;
}

export const ContractDetailsPageSummary: React.FC<ContractDetailsPageSummaryProps> = ({
    contract,
    loading,
    error,
    className = "",
}) => {
    if (loading) {
        return (
            <div className={`space-y-4 ${className}`}>
                <div className="h-[104px] w-full p-4 bg-theme rounded-lg border-b border-theme flex items-center justify-center">
                    <p>Loading contract details...</p>
                </div>
                <div className="mt-4 p-4 bg-theme rounded-lg border-b border-theme flex items-center justify-center">
                    <p>Loading order details...</p>
                </div>
                <div className="mt-4 p-4 bg-theme rounded-lg border-b border-theme flex items-center justify-center">
                    <p>Loading entry & exit details...</p>
                </div>
            </div>
        );
    }

    if (error || !contract) {
        return (
            <div className={`space-y-4 ${className}`}>
                <div className="h-[104px] w-full p-4 bg-theme rounded-lg border-b border-theme flex items-center justify-center">
                    <p>Failed to load contract details</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <ContractSummary contract={contract} />
            <OrderDetails contract={contract} />
            <EntryExitDetails contract={contract} />
        </div>
    );
};
