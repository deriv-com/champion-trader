import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DurationController } from "../DurationController";
import { useTradeStore } from "@/stores/tradeStore";
import { useOrientationStore } from "@/stores/orientationStore";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { adaptDurationRanges } from "@/utils/duration-config-adapter";

// Mock Loader component
jest.mock("@/components/ui/loader", () => ({
  Loader: () => <div data-testid="loading-spinner" role="status" />,
}));

// Mock the store modules themselves, not the hooks
jest.mock("@/stores/tradeStore", () => ({
  useTradeStore: jest.fn(),
}));

jest.mock("@/stores/orientationStore", () => ({
  useOrientationStore: jest.fn(),
}));

jest.mock("@/stores/bottomSheetStore", () => ({
  useBottomSheetStore: jest.fn(),
}));

jest.mock("@/utils/duration-config-adapter");
jest.mock("@/hooks/useDebounce", () => ({
  useDebounce: (value: any, callback: any) => {
    React.useEffect(() => {
      callback(value);
    }, [value, callback]);
  },
}));

// Mock child components
jest.mock("@/components/ui/tab-list", () => ({
  TabList: ({ tabs, selectedValue, onSelect }: any) => (
    <div data-testid="mock-tab-list">
      {tabs.map((tab: any) => (
        <button
          key={tab.value}
          data-testid={`tab-${tab.value}`}
          data-selected={tab.value === selectedValue}
          onClick={() => onSelect(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  ),
  Tab: () => null,
}));

jest.mock("../components/DurationValueList", () => ({
  DurationValueList: ({ selectedValue, onValueSelect, onValueClick }: any) => (
    <div
      data-testid="mock-duration-value-list"
      data-selected-value={selectedValue}
    >
      <button
        data-testid="value-select"
        onClick={() => {
          onValueSelect(selectedValue + 1);
          onValueClick?.(selectedValue + 1);
        }}
      >
        Select Value
      </button>
    </div>
  ),
}));

jest.mock("../components/HoursDurationValue", () => ({
  HoursDurationValue: ({ onValueSelect, onValueClick }: any) => (
    <div data-testid="mock-hours-duration-value">
      <button
        data-testid="hours-select"
        onClick={() => {
          onValueSelect("3:00");
          onValueClick?.("3:00");
        }}
      >
        Select Hours
      </button>
    </div>
  ),
}));

describe("DurationController", () => {
  const mockSetDuration = jest.fn();
  const mockSetBottomSheet = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock store values
    (
      useTradeStore as jest.MockedFunction<typeof useTradeStore>
    ).mockReturnValue({
      duration: "1 minutes",
      isConfigLoading: false,
      setDuration: mockSetDuration,
      productConfig: {
        data: {
          validations: {
            durations: {
              supported_units: ["ticks", "seconds", "minutes", "hours", "days"],
            },
          },
        },
      },
    });

    (
      useOrientationStore as jest.MockedFunction<typeof useOrientationStore>
    ).mockReturnValue({
      isLandscape: false,
    });

    (
      useBottomSheetStore as jest.MockedFunction<typeof useBottomSheetStore>
    ).mockReturnValue({
      setBottomSheet: mockSetBottomSheet,
    });

    (adaptDurationRanges as jest.Mock).mockReturnValue({
      ticks: [1, 2],
      seconds: [1, 2],
      minutes: [1, 2],
      hours: [1, 2],
      days: [1, 2],
    });
  });

  it("handles duration value selection", () => {
    render(<DurationController />);

    // Select value in minutes tab
    fireEvent.click(screen.getByTestId("value-select"));

    // Should update duration in store
    expect(mockSetDuration).toHaveBeenCalledWith("2 minutes");
  });

  it("uses default duration value when switching to new tab", () => {
    (
      useTradeStore as jest.MockedFunction<typeof useTradeStore>
    ).mockReturnValue({
      duration: "1 minutes",
      isConfigLoading: false,
      setDuration: mockSetDuration,
      productConfig: {
        data: {
          validations: {
            durations: {
              supported_units: ["ticks", "seconds", "minutes", "hours", "days"],
              ticks: { min: 1, max: 10 },
            },
          },
        },
      },
    });

    render(<DurationController />);

    // Switch to ticks tab
    fireEvent.click(screen.getByTestId("tab-ticks"));

    // Should use min value (1) from duration range as default
    const valueList = screen.getByTestId("mock-duration-value-list");
    expect(valueList).toHaveAttribute("data-selected-value", "1");
  });

  it("handles hours duration selection", () => {
    render(<DurationController />);

    // Switch to hours tab
    fireEvent.click(screen.getByTestId("tab-hours"));

    // Select hours value
    fireEvent.click(screen.getByTestId("hours-select"));

    // Should update duration in store
    expect(mockSetDuration).toHaveBeenCalledWith("3:00 hours");
  });

  it("shows loading state", () => {
    (
      useTradeStore as jest.MockedFunction<typeof useTradeStore>
    ).mockReturnValue({
      duration: "1 minutes",
      isConfigLoading: true,
      setDuration: mockSetDuration,
      productConfig: null,
    });

    render(<DurationController />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("handles save in portrait mode", () => {
    render(<DurationController onClose={mockOnClose} />);

    // Click save button
    fireEvent.click(screen.getByText("Save"));

    // Should close bottom sheet
    expect(mockSetBottomSheet).toHaveBeenCalledWith(false);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("handles save in landscape mode", () => {
    (
      useOrientationStore as jest.MockedFunction<typeof useOrientationStore>
    ).mockReturnValue({
      isLandscape: true,
    });

    render(<DurationController onClose={mockOnClose} />);

    // Select a value (auto-saves in landscape)
    fireEvent.click(screen.getByTestId("value-select"));

    // Should call onClose
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockSetBottomSheet).not.toHaveBeenCalled();
  });
});
