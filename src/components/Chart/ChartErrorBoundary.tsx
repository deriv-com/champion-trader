import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ChartErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // You can log the error to an error reporting service
        console.error("Chart error:", error);
        console.error("Error info:", errorInfo);
    }

    handleRetry = (): void => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Fallback UI when an error occurs
            return (
                <div className="chart-error">
                    <div className="chart-error-icon">⚠️</div>
                    <h3>Chart Error</h3>
                    <p className="chart-error-message">
                        {this.state.error?.message || "An error occurred while loading the chart."}
                    </p>
                    <button className="chart-error-retry" onClick={this.handleRetry}>
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ChartErrorBoundary;
