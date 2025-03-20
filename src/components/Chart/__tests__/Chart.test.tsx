import React from "react";
import { render, screen } from "@testing-library/react";
import { Chart } from "../index";

// Mock the SmartChart component since it's likely complex and has external dependencies
jest.mock("../SmartChart", () => ({
    SmartChart: jest.fn(({ children, toolbarWidget }) => (
        <div data-testid="mock-smart-chart">
            {toolbarWidget && <div data-testid="toolbar-widget">{toolbarWidget()}</div>}
            {children}
        </div>
    )),
}));

// Mock hooks and services
jest.mock("@/hooks/useDeviceDetection", () => ({
    useDeviceDetection: jest.fn(() => ({
        isMobile: false,
        isDesktop: true,
    })),
}));

jest.mock("@/stores/mainLayoutStore", () => ({
    useMainLayoutStore: jest.fn(() => ({
        theme: "light",
    })),
}));

jest.mock("@/api/services/chart", () => ({
    fetchActiveSymbols: jest.fn(() =>
        Promise.resolve({ active_symbols: [], msg_type: "active_symbols" })
    ),
    handleChartApiRequest: jest.fn(),
    handleChartSubscribe: jest.fn(),
    handleChartForget: jest.fn(),
    handleChartForgetStream: jest.fn(),
}));

jest.mock("@/utils/generateHistoricalData", () => ({
    generateHistoricalCandles: jest.fn(() => []),
    generateHistoricalTicks: jest.fn(() => []),
}));

jest.mock("@/utils/transformChartData", () => ({
    transformCandleData: jest.fn(() => []),
    transformTickData: jest.fn(() => []),
}));

describe("Chart Component", () => {
    it("renders without crashing", () => {
        render(<Chart />);
        // The component should render without throwing an error
    });

    it("renders with error boundary", () => {
        // The error boundary should catch errors in the chart component
        const originalConsoleError = console.error;
        console.error = jest.fn();

        const ChartWithError = () => {
            throw new Error("Test error");
            return null;
        };

        jest.spyOn(React, "createElement")
            .mockImplementationOnce(React.createElement)
            .mockImplementationOnce((type, props, ...children) => {
                if (typeof type === "function" && type.displayName === "TradeChart") {
                    return React.createElement(ChartWithError, props, ...children);
                }
                return React.createElement(type, props, ...children);
            });

        render(<Chart />);

        // Error boundary should catch the error and display the fallback UI
        expect(screen.getByText(/Chart Error/i)).toBeInTheDocument();

        // Restore console.error
        console.error = originalConsoleError;
    });
});
