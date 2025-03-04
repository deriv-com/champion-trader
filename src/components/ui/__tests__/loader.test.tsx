import { render, screen } from "@testing-library/react";
import { Loader } from "../loader";

describe("Loader", () => {
  it("renders with default size", () => {
    render(<Loader />);
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toHaveClass("h-8 w-8"); // md size
  });

  it("renders with different sizes", () => {
    const { rerender } = render(<Loader size="sm" />);
    expect(screen.getByTestId("loading-spinner")).toHaveClass("h-4 w-4");

    rerender(<Loader size="md" />);
    expect(screen.getByTestId("loading-spinner")).toHaveClass("h-8 w-8");

    rerender(<Loader size="lg" />);
    expect(screen.getByTestId("loading-spinner")).toHaveClass("h-12 w-12");
  });

  it("applies custom className", () => {
    render(<Loader className="custom-class" />);
    expect(screen.getByTestId("loading-spinner")).toHaveClass("custom-class");
  });

  it("maintains accessibility features", () => {
    render(<Loader />);

    // Check for status role
    const loader = screen.getByRole("status");
    expect(loader).toHaveAttribute("aria-label", "Loading");

    // Check for screen reader text
    expect(screen.getByText("Loading...")).toHaveClass("sr-only");
  });

  it("spreads additional props to container", () => {
    render(<Loader data-custom="test" />);
    expect(screen.getByRole("status")).toHaveAttribute("data-custom", "test");
  });
});
