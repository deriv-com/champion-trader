import { TradeChart } from "./Chart";
import ChartErrorBoundary from "./ChartErrorBoundary";
import "./chart-styles.css";

// Export the Chart component wrapped with error boundary
export const Chart = (props: any) => (
    <ChartErrorBoundary>
        <TradeChart {...props} />
    </ChartErrorBoundary>
);

// Export individual components
export { TradeChart };
export { ChartErrorBoundary };

// Export default wrapped component
export default Chart;
