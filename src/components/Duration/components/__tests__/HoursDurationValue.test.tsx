import { render, screen } from "@testing-library/react";
import { HoursDurationValue } from "../HoursDurationValue";
import { generateDurationValues } from "@/utils/duration";

// Mock the DurationValueList component
jest.mock("../DurationValueList", () => ({
    DurationValueList: ({
        selectedValue,
        durationType,
        onValueSelect,
        onValueClick,
        getDurationValues,
    }: any) => (
        <div data-testid={`duration-value-list-${durationType}`}>
            <span>Selected: {selectedValue}</span>
            <span>Type: {durationType}</span>
            <span>Values: {getDurationValues().join(",")}</span>
            <button
                onClick={() => onValueSelect(selectedValue + 1)}
                data-testid={`select-${durationType}`}
            >
                Select
            </button>
            {onValueClick && (
                <button
                    onClick={() => onValueClick(selectedValue + 1)}
                    data-testid={`click-${durationType}`}
                >
                    Click
                </button>
            )}
        </div>
    ),
}));

// Mock duration utils
jest.mock("@/utils/duration", () => ({
    generateDurationValues: jest.fn(),
    getSpecialCaseKey: jest.fn().mockReturnValue("key"),
}));

describe("HoursDurationValue", () => {
    const mockOnValueSelect = jest.fn();
    const mockOnValueClick = jest.fn();

    const defaultProps = {
        selectedValue: "2:30",
        onValueSelect: mockOnValueSelect,
        onValueClick: mockOnValueClick,
        isInitialRender: { current: true } as React.MutableRefObject<boolean>,
    };

    beforeEach(() => {
        mockOnValueSelect.mockClear();
        mockOnValueClick.mockClear();
        (generateDurationValues as jest.Mock).mockImplementation((type) =>
            type === "hour" ? [1, 2, 3] : [0, 15, 30, 45]
        );
    });

    it("renders hours and minutes sections with proper ARIA labels", () => {
        render(<HoursDurationValue {...defaultProps} />);

        expect(screen.getByRole("group")).toHaveAttribute(
            "aria-label",
            "Duration in hours and minutes"
        );
        expect(screen.getByLabelText("Hours")).toBeInTheDocument();
        expect(screen.getByLabelText("Minutes")).toBeInTheDocument();
    });

    it("initializes with correct hour and minute values", () => {
        render(<HoursDurationValue {...defaultProps} selectedValue="3:45" />);

        expect(screen.getByTestId("duration-value-list-hour")).toHaveTextContent("Selected: 3");
        expect(screen.getByTestId("duration-value-list-minute")).toHaveTextContent("Selected: 45");
    });

    it("resets minutes to 0 when selecting new hour after initial render", () => {
        const props = { ...defaultProps, isInitialRender: { current: false } };
        render(<HoursDurationValue {...props} />);

        screen.getByTestId("select-hour").click();
        expect(mockOnValueSelect).toHaveBeenCalledWith("3:0");
    });

    it("maintains minutes when selecting new hour during initial render", () => {
        render(<HoursDurationValue {...defaultProps} />);

        screen.getByTestId("select-hour").click();
        expect(mockOnValueSelect).toHaveBeenCalledWith("3:30");
    });

    it("handles minute selection", () => {
        render(<HoursDurationValue {...defaultProps} />);

        screen.getByTestId("select-minute").click();
        expect(mockOnValueSelect).toHaveBeenCalledWith("2:31");
    });

    it("handles click events", () => {
        render(<HoursDurationValue {...defaultProps} />);

        // Clicking hour always resets minutes to 0
        screen.getByTestId("click-hour").click();
        expect(mockOnValueClick).toHaveBeenCalledWith("3:0");

        // Clicking minute uses current hour with new minute value
        screen.getByTestId("click-minute").click();
        expect(mockOnValueClick).toHaveBeenCalledWith("3:31");
    });
});
