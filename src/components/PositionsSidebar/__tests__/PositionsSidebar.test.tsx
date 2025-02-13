import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PositionsSidebar } from "../PositionsSidebar";

describe("PositionsSidebar", () => {
  test("opens and selects an option from the custom dropdown", () => {
    const { getByText, queryByText } = render(
      <MemoryRouter>
        <PositionsSidebar isOpen={true} onClose={() => {}} />
      </MemoryRouter>
    );

    const dropdownButton = getByText("Trade types");
    fireEvent.click(dropdownButton);

    const option = getByText("Option 1");
    fireEvent.click(option);

    expect(queryByText("Option 1")).toBeTruthy();
  });
});
