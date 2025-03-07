import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { StakeInput } from "../StakeInput";
import { useClientStore } from "@/stores/clientStore";
import { incrementStake, decrementStake } from "@/utils/stake";

// Mock dependencies
jest.mock("@/stores/clientStore", () => ({
    useClientStore: jest.fn(),
}));

jest.mock("@/utils/stake", () => ({
    incrementStake: jest.fn(),
    decrementStake: jest.fn(),
}));

// Mock child components
jest.mock("@/components/ui/desktop-number-input-field", () => ({
    DesktopNumberInputField: React.forwardRef<HTMLInputElement>((props: any, ref) => (
        <div data-testid="desktop-input">
            <input
                data-testid="desktop-field"
                ref={ref}
                value={props.value}
                onChange={props.onChange}
                onBlur={props.onBlur}
            />
            <span data-testid="desktop-prefix">{props.prefix}</span>
            {props.error && <span data-testid="desktop-error">{props.errorMessage}</span>}
            {props.leftIcon}
            {props.rightIcon}
        </div>
    )),
}));

jest.mock("@/components/ui/mobile-number-input-field", () => ({
    MobileNumberInputField: React.forwardRef<HTMLInputElement>((props: any, ref) => (
        <div data-testid="mobile-input">
            <input
                data-testid="mobile-field"
                ref={ref}
                value={props.value}
                onChange={props.onChange}
                onBlur={props.onBlur}
            />
            <span data-testid="mobile-prefix">{props.prefix}</span>
            {props.error && <span data-testid="mobile-error">{props.errorMessage}</span>}
            <button data-testid="mobile-decrement" onClick={props.onDecrement}>
                -
            </button>
            <button data-testid="mobile-increment" onClick={props.onIncrement}>
                +
            </button>
        </div>
    )),
}));

jest.mock("@/components/ui/button", () => ({
    Button: ({ children, onClick, "aria-label": ariaLabel }: any) => (
        <button onClick={onClick} aria-label={ariaLabel}>
            {children}
        </button>
    ),
}));

describe("StakeInput", () => {
    const mockOnChange = jest.fn();
    const mockOnBlur = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useClientStore as jest.MockedFunction<typeof useClientStore>).mockReturnValue({
            currency: "USD",
        } as any);

        (incrementStake as jest.Mock).mockReturnValue("11");
        (decrementStake as jest.Mock).mockReturnValue("9");
    });

    describe("Desktop Mode", () => {
        it("renders desktop input with currency prefix", () => {
            render(<StakeInput value="10" onChange={mockOnChange} isDesktop={true} />);

            expect(screen.getByTestId("desktop-input")).toBeInTheDocument();
            expect(screen.getByTestId("desktop-prefix")).toHaveTextContent("USD");
            expect(screen.getByTestId("desktop-field")).toHaveValue("10");
        });

        it("handles numeric input", () => {
            render(<StakeInput value="10" onChange={mockOnChange} isDesktop={true} />);

            fireEvent.change(screen.getByTestId("desktop-field"), {
                target: { value: "20" },
            });

            expect(mockOnChange).toHaveBeenCalledWith("20");
        });

        it("filters non-numeric input", () => {
            render(<StakeInput value="10" onChange={mockOnChange} isDesktop={true} />);

            fireEvent.change(screen.getByTestId("desktop-field"), {
                target: { value: "abc123.45def" },
            });

            expect(mockOnChange).toHaveBeenCalledWith("123.45");
        });

        it("handles increment/decrement", () => {
            render(<StakeInput value="10" onChange={mockOnChange} isDesktop={true} />);

            fireEvent.click(screen.getByLabelText("Increase stake"));
            expect(incrementStake).toHaveBeenCalledWith("10");
            expect(mockOnChange).toHaveBeenCalledWith("11");

            fireEvent.click(screen.getByLabelText("Decrease stake"));
            expect(decrementStake).toHaveBeenCalledWith("10");
            expect(mockOnChange).toHaveBeenCalledWith("9");
        });

        it("shows error message", () => {
            render(
                <StakeInput
                    value="10"
                    onChange={mockOnChange}
                    isDesktop={true}
                    error={true}
                    errorMessage="Invalid amount"
                />
            );

            expect(screen.getByTestId("desktop-error")).toHaveTextContent("Invalid amount");
        });

        it("handles focus and blur", () => {
            const { container } = render(
                <StakeInput
                    value="10"
                    onChange={mockOnChange}
                    onBlur={mockOnBlur}
                    isDesktop={true}
                />
            );

            const input = container.querySelector("input");
            expect(input).toHaveFocus();

            fireEvent.blur(screen.getByTestId("desktop-field"));
            expect(mockOnBlur).toHaveBeenCalled();
        });
    });

    describe("Mobile Mode", () => {
        it("renders mobile input with currency prefix", () => {
            render(<StakeInput value="10" onChange={mockOnChange} isDesktop={false} />);

            expect(screen.getByTestId("mobile-input")).toBeInTheDocument();
            expect(screen.getByTestId("mobile-prefix")).toHaveTextContent("USD");
            expect(screen.getByTestId("mobile-field")).toHaveValue("10");
        });

        it("handles numeric input", () => {
            render(<StakeInput value="10" onChange={mockOnChange} isDesktop={false} />);

            fireEvent.change(screen.getByTestId("mobile-field"), {
                target: { value: "20" },
            });

            expect(mockOnChange).toHaveBeenCalledWith("20");
        });

        it("filters non-numeric input", () => {
            render(<StakeInput value="10" onChange={mockOnChange} isDesktop={false} />);

            fireEvent.change(screen.getByTestId("mobile-field"), {
                target: { value: "abc123.45def" },
            });

            expect(mockOnChange).toHaveBeenCalledWith("123.45");
        });

        it("handles increment/decrement", () => {
            render(<StakeInput value="10" onChange={mockOnChange} isDesktop={false} />);

            fireEvent.click(screen.getByTestId("mobile-increment"));
            expect(incrementStake).toHaveBeenCalledWith("10");
            expect(mockOnChange).toHaveBeenCalledWith("11");

            fireEvent.click(screen.getByTestId("mobile-decrement"));
            expect(decrementStake).toHaveBeenCalledWith("10");
            expect(mockOnChange).toHaveBeenCalledWith("9");
        });

        it("shows error message", () => {
            render(
                <StakeInput
                    value="10"
                    onChange={mockOnChange}
                    isDesktop={false}
                    error={true}
                    errorMessage="Invalid amount"
                />
            );

            expect(screen.getByTestId("mobile-error")).toHaveTextContent("Invalid amount");
        });

        it("handles focus and blur", () => {
            const { container } = render(
                <StakeInput
                    value="10"
                    onChange={mockOnChange}
                    onBlur={mockOnBlur}
                    isDesktop={false}
                />
            );

            const input = container.querySelector("input");
            expect(input).toHaveFocus();

            fireEvent.blur(screen.getByTestId("mobile-field"));
            expect(mockOnBlur).toHaveBeenCalled();
        });
    });

    describe("Common Functionality", () => {
        it.each([true, false])(
            "prevents adding more digits when above max payout (isDesktop: %s)",
            (isDesktop) => {
                render(
                    <StakeInput
                        value="100"
                        onChange={mockOnChange}
                        error={true}
                        maxPayout={100}
                        isDesktop={isDesktop}
                    />
                );

                const inputField = screen.getByTestId(isDesktop ? "desktop-field" : "mobile-field");

                // Try to add more digits (100 -> 1000)
                fireEvent.change(inputField, { target: { value: "1000" } });
                expect(mockOnChange).not.toHaveBeenCalled();

                // Changing to a shorter number should work
                fireEvent.change(inputField, { target: { value: "10" } });
                expect(mockOnChange).toHaveBeenCalledWith("10");
            }
        );

        it.each([true, false])(
            "allows decreasing value when above max payout (isDesktop: %s)",
            (isDesktop) => {
                render(
                    <StakeInput
                        value="150"
                        onChange={mockOnChange}
                        error={true}
                        maxPayout={100}
                        isDesktop={isDesktop}
                    />
                );

                const inputField = screen.getByTestId(isDesktop ? "desktop-field" : "mobile-field");
                fireEvent.change(inputField, { target: { value: "50" } });

                expect(mockOnChange).toHaveBeenCalledWith("50");
            }
        );

        it.each([true, false])("handles empty input (isDesktop: %s)", (isDesktop) => {
            render(<StakeInput value="10" onChange={mockOnChange} isDesktop={isDesktop} />);

            const inputField = screen.getByTestId(isDesktop ? "desktop-field" : "mobile-field");
            fireEvent.change(inputField, { target: { value: "" } });

            expect(mockOnChange).toHaveBeenCalledWith("");
        });

        it.each([true, false])(
            "uses 0 as base value when incrementing/decrementing empty value (isDesktop: %s)",
            (isDesktop) => {
                render(<StakeInput value="" onChange={mockOnChange} isDesktop={isDesktop} />);

                if (isDesktop) {
                    fireEvent.click(screen.getByLabelText("Increase stake"));
                    expect(incrementStake).toHaveBeenCalledWith("0");

                    fireEvent.click(screen.getByLabelText("Decrease stake"));
                    expect(decrementStake).toHaveBeenCalledWith("0");
                } else {
                    fireEvent.click(screen.getByTestId("mobile-increment"));
                    expect(incrementStake).toHaveBeenCalledWith("0");

                    fireEvent.click(screen.getByTestId("mobile-decrement"));
                    expect(decrementStake).toHaveBeenCalledWith("0");
                }
            }
        );
    });
});
