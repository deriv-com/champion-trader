import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "../MainLayout";
import { useClientStore } from "../../../stores/clientStore";

// Inline renderWithRouter helper for MainLayout tests
const renderWithRouter = (ui: React.ReactElement, initialRoute = "/") => {
    window.history.pushState({}, "Test page", initialRoute);
    return render(
        <MemoryRouter initialEntries={[initialRoute]}>
            {ui}
            <Routes>
                <Route
                    path="*"
                    element={<div data-testid="location-display">{window.location.pathname}</div>}
                />
            </Routes>
        </MemoryRouter>
    );
};

jest.mock("../../../stores/headerStore", () => ({
    useHeaderStore: jest
        .fn()
        .mockImplementation((selector) => selector({ isVisible: true, setIsVisible: jest.fn() })),
}));

jest.mock("../../../stores/bottomNavStore", () => ({
    useBottomNavStore: jest
        .fn()
        .mockImplementation((selector) => selector({ isVisible: true, setIsVisible: jest.fn() })),
}));

beforeAll(() => {
    global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([]),
        } as Response)
    );
});

afterAll(() => {
    jest.restoreAllMocks();
});

describe("MainLayout", () => {
    beforeEach(() => {
        // Reset the logged-in state before each test.
        useClientStore.setState({
            isLoggedIn: false,
        });
    });

    it("renders children content", () => {
        renderWithRouter(<div>Test Content</div>);
        expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("applies correct layout classes", () => {
        const { container } = renderWithRouter(
            <MainLayout>
                <div>Content</div>
            </MainLayout>
        );
        // Check for base layout classes.
        expect(container.firstChild).toHaveClass("min-h-[100dvh]");
    });

    it("does not render footer when user is logged out", () => {
        useClientStore.getState().isLoggedIn = false;
        renderWithRouter(
            <MainLayout>
                <div>Test Content</div>
            </MainLayout>
        );
        // In logout view, footer should not be rendered.
        const footer = screen.queryByTestId("footer");
        expect(footer).toBeNull();
    });
});
