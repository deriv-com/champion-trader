import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PositionsSidebar } from "../PositionsSidebar";
import { BrowserRouter } from "react-router-dom";
import { OPEN_POSITIONS, CLOSED_POSITIONS } from "../positionsSidebarStub";

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(OPEN_POSITIONS),
  })
) as jest.Mock;

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("PositionsSidebar", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
  };

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <PositionsSidebar {...defaultProps} />
      </BrowserRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when open", () => {
    renderComponent();
    expect(screen.getByText("Positions")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText("Closed")).toBeInTheDocument();
  });

  it("shows open positions by default", async () => {
    renderComponent();
    await waitFor(() => {
      OPEN_POSITIONS.forEach((position) => {
        expect(screen.getByText(position.market)).toBeInTheDocument();
        expect(screen.getByText(position.type)).toBeInTheDocument();
        expect(screen.getByText(position.profit)).toBeInTheDocument();
      });
    });
  });

  it("switches to closed positions when clicking Closed tab", async () => {
    renderComponent();
    fireEvent.click(screen.getByText("Closed"));

    await waitFor(() => {
      CLOSED_POSITIONS.forEach((position) => {
        expect(screen.getByText(position.market)).toBeInTheDocument();
        expect(screen.getByText(position.type)).toBeInTheDocument();
        expect(screen.getByText(position.profit)).toBeInTheDocument();
      });
    });

    // Check for Closed badge
    const closedBadges = screen.getAllByText("Closed");
    expect(closedBadges.length).toBeGreaterThan(0);
  });

  it("shows trade type filter in open tab", () => {
    renderComponent();
    const filterButton = screen.getByText("All trade types");
    fireEvent.click(filterButton);
    expect(screen.getByText("Rise/Fall")).toBeInTheDocument();
    expect(screen.getByText("Multiplier")).toBeInTheDocument();
  });

  it("shows time period filter in closed tab", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Closed"));
    const filterButton = screen.getByText("All time");
    fireEvent.click(filterButton);
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Last 7 days")).toBeInTheDocument();
  });

  it("navigates to contract details when clicking a position", () => {
    renderComponent();
    const position = OPEN_POSITIONS[0];
    fireEvent.click(screen.getByText(position.market));
    expect(mockNavigate).toHaveBeenCalledWith(`/contract/${position.id}`);
  });

  it("closes sidebar when clicking outside", () => {
    renderComponent();
    fireEvent.mouseDown(document.body);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("rotates chevron when opening filter dropdown", () => {
    renderComponent();
    const button = screen.getByText("All trade types").parentElement;
    const chevron = button?.querySelector(".transform");
    
    expect(chevron).not.toHaveClass("rotate-180");
    fireEvent.click(button!);
    expect(chevron).toHaveClass("rotate-180");
  });

  it("filters positions by trade type in open tab", async () => {
    renderComponent();
    
    // Open filter dropdown
    fireEvent.click(screen.getByText("All trade types"));
    
    // Select Rise/Fall filter
    fireEvent.click(screen.getByText("Rise/Fall"));

    await waitFor(() => {
      // Should only show Rise/Fall positions
      const positions = screen.getAllByText("Rise/Fall");
      expect(positions.length).toBe(OPEN_POSITIONS.filter(p => p.type === "Rise/Fall").length);
    });
  });

  it("shows Close button only in open positions", () => {
    renderComponent();
    
    // Check Close buttons in open tab
    OPEN_POSITIONS.forEach(position => {
      expect(screen.getByText(`Close ${position.stake}`)).toBeInTheDocument();
    });

    // Switch to closed tab
    fireEvent.click(screen.getByText("Closed"));

    // Should not find any Close buttons
    CLOSED_POSITIONS.forEach(position => {
      expect(screen.queryByText(`Close ${position.stake}`)).not.toBeInTheDocument();
    });
  });
});
