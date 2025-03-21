import { ContractDetailsChart } from "./ContractDetailsChart";
import ChartErrorBoundary from "./ChartErrorBoundary";
import MarkerLine from "./MarkerLine";
import SpotMarker from "./SpotMarker";

// Export the ContractDetailsChart component wrapped with error boundary
export const WrappedContractDetailsChart = (props: any) => (
    <ChartErrorBoundary>
        <ContractDetailsChart {...props} />
    </ChartErrorBoundary>
);

// Export individual components
export { ContractDetailsChart };
export { ChartErrorBoundary };
export { MarkerLine };
export { SpotMarker };

// Export default wrapped component
export default WrappedContractDetailsChart;
