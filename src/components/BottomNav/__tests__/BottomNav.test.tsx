import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "../BottomNav";
import { useClientStore } from "../../../stores/clientStore";

// Component to display current route for testing navigation.
const LocationDisplay = () => {
    return <div data-testid="location-display">{window.location.pathname}</div>;
};

const renderWithRouter = (initialRoute = "/") => {
    window.history.pushState({}, "Test page", initialRoute);
    return render(
        <MemoryRouter initialEntries={[initialRoute]}>
            <BottomNav />
            <LocationDisplay />
            <Routes>
                <Route path="*" element={<div />} />
            </Routes>
        </MemoryRouter>
    );
};

describe("BottomNav", () => {
    beforeEach(() => {
        // Reset logged-in state to false before each test.
        useClientStore.getState().isLoggedIn = false;
    });

    it("renders navigation button when user is logged in", () => {
        useClientStore.getState().isLoggedIn = true;
        renderWithRouter();
        // Expect that the navigation button with test ID "bottom-nav-menu" is present.
        expect(screen.getByTestId("bottom-nav-menu")).toBeInTheDocument();
    });
});
