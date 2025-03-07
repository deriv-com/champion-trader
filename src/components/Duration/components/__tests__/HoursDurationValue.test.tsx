import { render, screen, fireEvent } from "@testing-library/react";
import { HoursDurationValue } from "../HoursDurationValue";
import { generateDurationValues } from "@/utils/duration";

// Mock DurationValueList component
jest.mock("../DurationValueList", () => ({
  DurationValueList: ({
    selectedValue,
    onValueSelect,
    onValueClick,
    durationType,
  }: any) => {
    const value = selectedValue;
    return (
      <div
        data-testid="mock-duration-value-list"
        data-type={durationType}
        onClick={() => {
          onValueSelect(value);
          onValueClick?.(value);
        }}
      >
        {value}
      </div>
    );
  },
}));

jest.mock("@/utils/duration", () => ({
  generateDurationValues: jest.fn(),
  getSpecialCaseKey: jest.fn().mockReturnValue("key"),
}));

describe("HoursDurationValue", () => {
  const mockOnValueSelect = jest.fn();
  const mockOnValueClick = jest.fn();
  const mockIsInitialRender = { current: true };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock generateDurationValues to return test values
    (generateDurationValues as jest.Mock).mockImplementation((type) => {
      if (type === "hours") return [1, 2, 3];
      if (type === "minutes") return [0, 15, 30, 45];
      return [];
    });
  });

  it("renders with initial selected value", () => {
    render(
      <HoursDurationValue
        selectedValue="2:30"
        onValueSelect={mockOnValueSelect}
        onValueClick={mockOnValueClick}
        isInitialRender={mockIsInitialRender}
      />
    );

    // Check if component renders with proper structure and both lists
    expect(
      screen.getByRole("group", { name: /duration in hours and minutes/i })
    ).toBeInTheDocument();

    const [hoursList, minutesList] = screen.getAllByTestId(
      "mock-duration-value-list"
    );

    expect(hoursList).toHaveAttribute("data-type", "hours");
    expect(minutesList).toHaveAttribute("data-type", "minutes");
  });

  it("maintains accessibility attributes", () => {
    render(
      <HoursDurationValue
        selectedValue="2:30"
        onValueSelect={mockOnValueSelect}
        onValueClick={mockOnValueClick}
        isInitialRender={mockIsInitialRender}
      />
    );

    // Verify ARIA attributes
    expect(screen.getByRole("group")).toHaveAttribute(
      "aria-label",
      "Duration in hours and minutes"
    );
  });

  it("keeps minutes value during initial render", () => {
    render(
      <HoursDurationValue
        selectedValue="2:30"
        onValueSelect={mockOnValueSelect}
        onValueClick={mockOnValueClick}
        isInitialRender={mockIsInitialRender}
      />
    );

    const [hoursList] = screen.getAllByTestId("mock-duration-value-list");
    expect(hoursList).toHaveAttribute("data-type", "hours");
    fireEvent.click(hoursList);

    expect(mockOnValueSelect).toHaveBeenCalledWith("2:30");
  });

  it("resets minutes to 00 after initial render", () => {
    mockIsInitialRender.current = false;
    render(
      <HoursDurationValue
        selectedValue="2:30"
        onValueSelect={mockOnValueSelect}
        onValueClick={mockOnValueClick}
        isInitialRender={mockIsInitialRender}
      />
    );

    const [hoursList] = screen.getAllByTestId("mock-duration-value-list");
    expect(hoursList).toHaveAttribute("data-type", "hours");
    fireEvent.click(hoursList);

    expect(mockOnValueSelect).toHaveBeenCalledWith("2:00");
  });

  it("updates minutes value when minutes are selected", () => {
    render(
      <HoursDurationValue
        selectedValue="2:30"
        onValueSelect={mockOnValueSelect}
        onValueClick={mockOnValueClick}
        isInitialRender={mockIsInitialRender}
      />
    );

    const [, minutesList] = screen.getAllByTestId("mock-duration-value-list");
    expect(minutesList).toHaveAttribute("data-type", "minutes");
    fireEvent.click(minutesList);

    expect(mockOnValueSelect).toHaveBeenCalledWith("2:30");
  });
});
