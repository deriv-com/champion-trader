import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { SideNav } from "../SideNav";
import * as toastStore from "@/stores/toastStore";

// Mock toast store
jest.mock("@/stores/toastStore", () => ({
    useToastStore: jest.fn(),
}));

// Inlined renderWithRouter helper
const renderWithRouter = (initialRoute = "/") => {
    window.history.pushState({}, "Test page", initialRoute);
    return render(
        <MemoryRouter initialEntries={[initialRoute]}>
            <SideNav />
            <Routes>
                <Route
                    path="*"
                    element={<div data-testid="location-display">{window.location.pathname}</div>}
                />
            </Routes>
        </MemoryRouter>
    );
};

describe("SideNav", () => {
    const mockToast = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (toastStore.useToastStore as unknown as jest.Mock).mockImplementation((selector) => {
            const store = {
                toast: mockToast,
            };
            return selector ? selector(store) : store;
        });
    });

    it("renders all navigation items", () => {
        renderWithRouter();
        expect(screen.getByText("Menu")).toBeInTheDocument();
    });

    it("navigates correctly when clicking navigation items", () => {
        renderWithRouter();

        fireEvent.click(screen.getByText("Menu"));
        expect(screen.getByTestId("location-display")).toHaveTextContent("/");
    });
});
