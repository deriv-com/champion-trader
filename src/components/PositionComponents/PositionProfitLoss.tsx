import React from "react";

interface PositionProfitLossProps {
    totalProfitLoss: string;
    containerClassName?: string;
    labelClassName?: string;
    valueClassName?: string;
    currency?: string;
}

export const PositionProfitLoss: React.FC<PositionProfitLossProps> = ({
    totalProfitLoss,
    containerClassName = "",
    labelClassName = "text-theme",
    valueClassName = "",
    currency = "USD",
}) => {
    const isPositive = parseFloat(totalProfitLoss) >= 0;
    const formattedValue = `${isPositive ? "+" : ""}${totalProfitLoss} ${currency}`;

    return (
        <div className={`flex justify-between items-center ${containerClassName}`}>
            <span className={labelClassName}>Total profit/loss:</span>
            <span className={`${isPositive ? "text-[#008832]" : "text-red-500"} ${valueClassName}`}>
                {formattedValue}
            </span>
        </div>
    );
};
