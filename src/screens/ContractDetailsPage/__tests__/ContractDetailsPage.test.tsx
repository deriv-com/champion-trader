import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ContractDetailsPage from "../ContractDetailsPage";

describe("ContractDetailsPage", () => {
  test("renders contract details page correctly", () => {
    render(
      <MemoryRouter initialEntries={["/contract/1"]}>
        <Routes>
          <Route path="/contract/:id" element={<ContractDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /contract details/i })).toBeInTheDocument();
  });
});
