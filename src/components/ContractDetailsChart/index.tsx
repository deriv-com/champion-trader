import React from "react";
import { ContractDetailsChart as BaseChart } from "./ContractDetailsChart";
import { ChartErrorBoundary } from "./ChartErrorBoundary";

const ContractDetailsChartWithErrorBoundary = (props: React.ComponentProps<typeof BaseChart>) => {
    return (
        <ChartErrorBoundary>
            <BaseChart {...props} />
        </ChartErrorBoundary>
    );
};

export { ContractDetailsChartWithErrorBoundary as ContractDetailsChart };
