import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Footer } from "../Footer";
import { useClientStore } from "../../../stores/clientStore";

// Inline renderWithRouter helper for Footer tests
const renderWithRouter = (initialRoute = "/") => {
    window.history.pushState({}, "Test page", initialRoute);
    return render(
        <MemoryRouter initialEntries={[initialRoute]}>
            <Footer />
            <Routes>
                <Route
                    path="*"
                    element={<div data-testid="location-display">{window.location.pathname}</div>}
                />
            </Routes>
        </MemoryRouter>
    );
};

describe("Footer", () => {
    beforeEach(() => {
        // Reset logged-in state before each test.
        useClientStore.setState({
            isLoggedIn: false,
            token: null,
            balance: null,
            currency: "USD",
            group: null,
            status: null,
            account_uuid: null,
        });
    });

    it("renders navigation items when user is logged in", () => {
        useClientStore.setState({
            isLoggedIn: true,
            token: "test-token",
            balance: "1,000",
            currency: "USD",
            group: "demo",
            status: "active",
            account_uuid: "96070fd6-e413-4743-8b12-2485e631cf45",
        });
        renderWithRouter();
        // Expect the Footer to render "Trade" and "Positions" buttons.
        expect(screen.getByText("Trade")).toBeInTheDocument();
        expect(screen.getByText("Positions")).toBeInTheDocument();
    });

    it("shows correct active style when route is active and user is logged in", () => {
        useClientStore.setState({
            isLoggedIn: true,
            token: "test-token",
            balance: "1,000",
            currency: "USD",
            group: "demo",
            status: "active",
            account_uuid: "96070fd6-e413-4743-8b12-2485e631cf45",
        });
        // Assume that the active route for the "Trade" button is "/trade".
        renderWithRouter("/trade");
        const tradeButton = screen.getByText("Trade").closest("button");
        expect(tradeButton).toHaveClass("text-primary");
    });
});
