import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PositionsSidebar } from "../PositionsSidebar";

beforeAll(() => {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve([
        { id: 1, type: "Rise/Fall", market: "Volatility 100 Index", ticks: "2/150", stake: "10.00 USD", profit: "+1.00 USD" },
        { id: 2, type: "Rise/Fall", market: "Volatility 75 Index", ticks: "6/150", stake: "10.00 USD", profit: "+1.00 USD" }
      ]),
    } as Response)
  );
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("PositionsSidebar", () => {
  test("opens and selects an option from the custom dropdown", () => {
    const { getByText } = render(
      <MemoryRouter>
        <PositionsSidebar isOpen={true} onClose={() => {}} />
      </MemoryRouter>
    );

    const dropdownButton = getByText("Trade types");
    fireEvent.click(dropdownButton);

    const option = getByText("Option 1");
    fireEvent.click(option);

    expect(dropdownButton.textContent).toBe("Option 1");
  });
});
