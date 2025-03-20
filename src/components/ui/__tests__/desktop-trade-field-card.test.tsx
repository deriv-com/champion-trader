import { render, screen } from "@testing-library/react";
import { DesktopTradeFieldCard } from "../desktop-trade-field-card";

describe("DesktopTradeFieldCard", () => {
    it("renders children correctly", () => {
        render(
            <DesktopTradeFieldCard>
                <div>Test Content</div>
            </DesktopTradeFieldCard>
        );

        expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("applies default styles", () => {
        const { container } = render(
            <DesktopTradeFieldCard>
                <div>Content</div>
            </DesktopTradeFieldCard>
        );

        const card = container.firstChild as HTMLElement;
        expect(card).toHaveClass(
            "rounded-lg",
            "py-2 px-4",
            "bg-theme-secondary",
            "border",
            "border-transparent"
        );
    });

    it("merges custom className with default styles", () => {
        const { container } = render(
            <DesktopTradeFieldCard className="custom-class">
                <div>Content</div>
            </DesktopTradeFieldCard>
        );

        const card = container.firstChild as HTMLElement;
        expect(card).toHaveClass(
            "bg-theme-secondary rounded-lg py-2 px-4 border border-transparent custom-class"
        );
    });
});
