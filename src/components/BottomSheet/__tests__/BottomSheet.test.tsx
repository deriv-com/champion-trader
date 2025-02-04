import { render, screen, fireEvent } from "@testing-library/react";
import { BottomSheet } from "../BottomSheet";

describe("BottomSheet", () => {
  const mockHeader = <div>Test Header</div>;
  const mockBody = <div>Test Body</div>;
  const mockFooter = <div>Test Footer</div>;
  const mockOnClose = jest.fn();

  it("renders header, body, and footer correctly", () => {
    render(
      <BottomSheet
        isOpen={true}
        onClose={mockOnClose}
        header={mockHeader}
        body={mockBody}
        footer={mockFooter}
      />
    );

    expect(screen.getByText("Test Header")).toBeInTheDocument();
    expect(screen.getByText("Test Body")).toBeInTheDocument();
    expect(screen.getByText("Test Footer")).toBeInTheDocument();
  });

  it("applies custom height when provided", () => {
    const { container } = render(
      <BottomSheet
        isOpen={true}
        onClose={mockOnClose}
        header={mockHeader}
        body={mockBody}
        footer={mockFooter}
        height="50%"
      />
    );

    const bottomSheet = container.firstChild as HTMLElement;
    expect(bottomSheet).toHaveStyle({ height: "50%" });
  });

  it("applies full screen height when isFullScreen is true", () => {
    const { container } = render(
      <BottomSheet
        isOpen={true}
        onClose={mockOnClose}
        header={mockHeader}
        body={mockBody}
        footer={mockFooter}
        isFullScreen={true}
      />
    );

    const bottomSheet = container.firstChild as HTMLElement;
    expect(bottomSheet).toHaveStyle({ height: "100vh" });
  });

  it("calls onClose when backdrop is clicked", () => {
    render(
      <BottomSheet
        isOpen={true}
        onClose={mockOnClose}
        header={mockHeader}
        body={mockBody}
        footer={mockFooter}
      />
    );

    const backdrop = screen.getByTestId("bottom-sheet-backdrop");
    fireEvent.click(backdrop);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("does not render when isOpen is false", () => {
    render(
      <BottomSheet
        isOpen={false}
        onClose={mockOnClose}
        header={mockHeader}
        body={mockBody}
        footer={mockFooter}
      />
    );

    expect(screen.queryByText("Test Header")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Body")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Footer")).not.toBeInTheDocument();
  });
});
