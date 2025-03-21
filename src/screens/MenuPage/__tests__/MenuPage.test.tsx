import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MenuPage } from "../MenuPage";

describe("MenuPage", () => {
    const renderWithRouter = () => {
        return render(
            <MemoryRouter>
                <MenuPage />
            </MemoryRouter>
        );
    };

    it("renders menu items", () => {
        renderWithRouter();

        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Theme")).toBeInTheDocument();
    });
});
