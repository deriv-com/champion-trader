import React from "react";
import { StakeInput } from "./StakeInput";
import { PayoutDisplay } from "./PayoutDisplay";

interface StakeInputLayoutProps {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    error?: boolean;
    errorMessage?: string;
    maxPayout: number;
    payoutValues: Record<string, number>;
    isDesktop?: boolean;
    loading?: boolean;
    loadingStates?: Record<string, boolean>;
}

export const StakeInputLayout: React.FC<StakeInputLayoutProps> = ({
    value,
    onChange,
    onBlur,
    error,
    errorMessage,
    maxPayout,
    payoutValues,
    isDesktop,
    loading = false,
    loadingStates = {},
}) => {
    const amount = value ? parseFloat(value.split(" ")[0]) : 0;
    const hasError = Boolean(error && amount > maxPayout);

    return (
        <div className="flex flex-col h-full justify-between">
            <StakeInput
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                isDesktop={isDesktop}
                error={error}
                errorMessage={errorMessage}
                maxPayout={maxPayout}
            />
            <div className="mt-4">
                <PayoutDisplay
                    hasError={hasError}
                    loading={loading}
                    loadingStates={loadingStates}
                    maxPayout={maxPayout}
                    payoutValues={payoutValues}
                />
            </div>
        </div>
    );
};
