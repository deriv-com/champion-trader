import { render, screen } from "@testing-library/react";
import ChartErrorBoundary from "../ChartErrorBoundary";

// Create a component that will throw an error
const ErrorComponent = () => {
    throw new Error("Test error");
    return null;
};

// Create a wrapper to catch the error during render
const ErrorBoundaryWrapper = ({ shouldThrow = false }) => (
    <ChartErrorBoundary>
        {shouldThrow ? <ErrorComponent /> : <div>No error</div>}
    </ChartErrorBoundary>
);

describe("ChartErrorBoundary", () => {
    // Suppress console errors during tests
    const originalConsoleError = console.error;
    beforeAll(() => {
        console.error = jest.fn();
    });

    afterAll(() => {
        console.error = originalConsoleError;
    });

    it("renders children when there is no error", () => {
        render(<ErrorBoundaryWrapper />);
        expect(screen.getByText("No error")).toBeInTheDocument();
    });

    it("renders fallback UI when an error occurs", () => {
        render(<ErrorBoundaryWrapper shouldThrow={true} />);

        // Check that the error UI is displayed
        expect(screen.getByText("Chart Error")).toBeInTheDocument();
        expect(screen.getByText(/Test error/)).toBeInTheDocument();
        expect(screen.getByText("Try Again")).toBeInTheDocument();
    });
});
