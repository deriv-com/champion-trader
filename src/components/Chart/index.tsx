import React from "react";
// import { Chart as BaseChart } from "./Chart";
import { TradeChart as BaseChart1 } from "./Chart1";
import { ChartErrorBoundary } from "./ChartErrorBoundary";

const ChartWithErrorBoundary = (props: React.ComponentProps<typeof BaseChart1>) => {
  return (
    <ChartErrorBoundary>
      {/* <BaseChart1 {...props} /> */}
      <BaseChart1 {...props} />
    </ChartErrorBoundary>
  );
};

export { ChartWithErrorBoundary as Chart, ChartErrorBoundary };
