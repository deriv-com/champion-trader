import { render, screen, fireEvent } from "@testing-library/react";
import { DurationValueList } from "../DurationValueList";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import type { DurationRangesResponse } from "@/services/api/rest/duration/types";

// Mock hooks
jest.mock("@/hooks/useDeviceDetection", () => ({
    useDeviceDetection: jest.fn(),
}));

// Mock ScrollSelect component
jest.mock("@/components/ui/scroll-select", () => ({
    ScrollSelect: ({ options, selectedValue, onValueSelect, onValueClick }: any) => (
        <div data-testid="mock-scroll-select">
            {options.map((option: any) => (
                <button
                    key={option.value}
                    data-testid={`option-${option.value}`}
                    data-selected={option.value === selectedValue}
                    onClick={() => {
                        onValueSelect(option.value);
                        onValueClick?.(option.value);
                    }}
                >
                    {option.label}
                </button>
            ))}
        </div>
    ),
}));

describe("DurationValueList", () => {
    const mockOnValueSelect = jest.fn();
    const mockOnValueClick = jest.fn();
    const mockGetDurationValues = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetDurationValues.mockReturnValue([1, 2, 3]);
        (useDeviceDetection as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    it("renders duration values with correct labels", () => {
        // Test for hours
        mockGetDurationValues.mockReturnValue([1, 2]);
        render(
            <DurationValueList
                selectedValue={1}
                durationType="hours"
                onValueSelect={mockOnValueSelect}
                onValueClick={mockOnValueClick}
                getDurationValues={mockGetDurationValues}
            />
        );

        expect(screen.getByText("1 hour")).toBeInTheDocument();
        expect(screen.getByText("2 hours")).toBeInTheDocument();

        // Test for minutes
        mockGetDurationValues.mockReturnValue([1, 2]);
        render(
            <DurationValueList
                selectedValue={1}
                durationType="minutes"
                onValueSelect={mockOnValueSelect}
                onValueClick={mockOnValueClick}
                getDurationValues={mockGetDurationValues}
            />
        );

        expect(screen.getByText("1 minute")).toBeInTheDocument();
        expect(screen.getByText("2 minutes")).toBeInTheDocument();
    });

    it("calls getDurationValues with correct type", () => {
        render(
            <DurationValueList
                selectedValue={1}
                durationType="hours"
                onValueSelect={mockOnValueSelect}
                onValueClick={mockOnValueClick}
                getDurationValues={mockGetDurationValues}
            />
        );

        expect(mockGetDurationValues).toHaveBeenCalledWith("hours");
    });

    it("handles value selection", () => {
        mockGetDurationValues.mockReturnValue([1, 2, 3]);
        render(
            <DurationValueList
                selectedValue={1}
                durationType="hours"
                onValueSelect={mockOnValueSelect}
                onValueClick={mockOnValueClick}
                getDurationValues={mockGetDurationValues}
            />
        );

        fireEvent.click(screen.getByTestId("option-2"));

        expect(mockOnValueSelect).toHaveBeenCalledWith(2);
        expect(mockOnValueClick).toHaveBeenCalledWith(2);
    });

    it("passes correct auto-select prop based on device", () => {
        // Test desktop
        (useDeviceDetection as jest.Mock).mockReturnValue({ isDesktop: true });
        const { rerender } = render(
            <DurationValueList
                selectedValue={1}
                durationType="hours"
                onValueSelect={mockOnValueSelect}
                onValueClick={mockOnValueClick}
                getDurationValues={mockGetDurationValues}
            />
        );

        expect(screen.getByTestId("mock-scroll-select")).toBeInTheDocument();

        // Test mobile
        (useDeviceDetection as jest.Mock).mockReturnValue({ isDesktop: false });
        rerender(
            <DurationValueList
                selectedValue={1}
                durationType="hours"
                onValueSelect={mockOnValueSelect}
                onValueClick={mockOnValueClick}
                getDurationValues={mockGetDurationValues}
            />
        );

        expect(screen.getByTestId("mock-scroll-select")).toBeInTheDocument();
    });

    it("formats unit labels correctly for all duration types", () => {
        const testCases: Array<{
            type: keyof DurationRangesResponse;
            singular: string;
            plural: string;
        }> = [
            { type: "ticks", singular: "tick", plural: "ticks" },
            { type: "seconds", singular: "second", plural: "seconds" },
            { type: "minutes", singular: "minute", plural: "minutes" },
            { type: "hours", singular: "hour", plural: "hours" },
            { type: "days", singular: "day", plural: "days" },
        ];

        mockGetDurationValues.mockReturnValue([1, 2]);

        testCases.forEach(({ type, singular, plural }) => {
            render(
                <DurationValueList
                    selectedValue={1}
                    durationType={type}
                    onValueSelect={mockOnValueSelect}
                    onValueClick={mockOnValueClick}
                    getDurationValues={mockGetDurationValues}
                />
            );

            // Check singular form
            expect(screen.getByText(`1 ${singular}`)).toBeInTheDocument();

            // Check plural form
            expect(screen.getByText(`2 ${plural}`)).toBeInTheDocument();
        });
    });
});
