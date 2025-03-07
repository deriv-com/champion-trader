import React from "react";
import { TradeChart as BaseChart } from "./Chart";
import { ChartErrorBoundary } from "./ChartErrorBoundary";

const ChartWithErrorBoundary = (props: React.ComponentProps<typeof BaseChart>) => {
    return (
        <ChartErrorBoundary>
            <BaseChart {...props} />
        </ChartErrorBoundary>
    );
};

export { ChartWithErrorBoundary as Chart, ChartErrorBoundary };
