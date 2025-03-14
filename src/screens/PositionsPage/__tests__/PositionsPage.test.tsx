import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PositionsPage from "../PositionsPage";

const renderWithRouter = () => {
    return render(
        <MemoryRouter>
            <PositionsPage />
        </MemoryRouter>
    );
};

describe("PositionsPage", () => {
    it("navigates to contract details when clicking a position", () => {
        renderWithRouter();

        const position = screen.getByText("R_100");
        fireEvent.click(position);

        expect(window.location.pathname).toMatch("/");
    });
});
