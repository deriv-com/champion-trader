import { render, screen, fireEvent } from "@testing-library/react";
import TradeParam from "../TradeParam";
import { formatDurationDisplay } from "@/utils/duration";

// Mock the duration utility
jest.mock("@/utils/duration", () => ({
    formatDurationDisplay: jest.fn(),
}));

describe("TradeParam", () => {
    const mockFormatDurationDisplay = formatDurationDisplay as jest.Mock;

    beforeEach(() => {
        mockFormatDurationDisplay.mockReset();
        mockFormatDurationDisplay.mockImplementation((value) => value);
    });

    it("renders label and value correctly", () => {
        render(<TradeParam label="Amount" value="100" />);

        expect(screen.getByText("Amount")).toBeInTheDocument();
        expect(screen.getByText("100")).toBeInTheDocument();
    });

    it('formats duration value when label is "Duration"', () => {
        mockFormatDurationDisplay.mockReturnValue("2 minutes");
        render(<TradeParam label="Duration" value="2 minute" />);

        expect(mockFormatDurationDisplay).toHaveBeenCalledWith("2 minute");
        expect(screen.getByText("2 minutes")).toBeInTheDocument();
    });

    it("does not format value for other labels", () => {
        render(<TradeParam label="Amount" value="100" />);

        expect(mockFormatDurationDisplay).not.toHaveBeenCalled();
        expect(screen.getByText("100")).toBeInTheDocument();
    });

    it("renders as a button with correct ARIA label when onClick is provided", () => {
        const handleClick = jest.fn();
        render(<TradeParam label="Amount" value="100" onClick={handleClick} />);

        const button = screen.getByRole("button", { name: "Amount: 100" });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute("type", "button");
    });

    it("handles click events", () => {
        const handleClick = jest.fn();
        render(<TradeParam label="Amount" value="100" onClick={handleClick} />);

        fireEvent.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("handles keyboard interactions", () => {
        const handleClick = jest.fn();
        render(<TradeParam label="Amount" value="100" onClick={handleClick} />);

        const button = screen.getByRole("button");

        // Test Enter key
        fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
        expect(handleClick).toHaveBeenCalledTimes(1);

        // Test Space key
        fireEvent.keyDown(button, { key: " ", code: "Space" });
        expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it("renders as a div when onClick is not provided", () => {
        render(<TradeParam label="Amount" value="100" />);

        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("applies custom className", () => {
        const { container } = render(
            <TradeParam label="Amount" value="100" className="custom-class" />
        );

        expect(container.firstChild).toHaveClass("custom-class");
    });
});
