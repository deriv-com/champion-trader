import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import ContractDetailsPage from "../ContractDetailsPage";

describe("ContractDetailsPage", () => {
    test("renders contract details page correctly", () => {
        render(
            <Suspense fallback={<div>Loading...</div>}>
                <MemoryRouter initialEntries={["/contract/1"]}>
                    <Routes>
                        <Route path="/contract/:id" element={<ContractDetailsPage />} />
                    </Routes>
                </MemoryRouter>
            </Suspense>
        );

        expect(screen.getByText(/contract details/i)).toBeInTheDocument();
    });
});
