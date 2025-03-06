import { render, screen, fireEvent } from "@testing-library/react";
import { StakeField } from "../StakeField";
import { useTradeStore } from "@/stores/tradeStore";
import { useOrientationStore } from "@/stores/orientationStore";
import { useClientStore } from "@/stores/clientStore";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useTooltipStore } from "@/stores/tooltipStore";

// Mock components
jest.mock("@/components/ui/tooltip", () => ({
  Tooltip: () => <div data-testid="tooltip" />,
}));

jest.mock("@/components/ui/desktop-trade-field-card", () => ({
  DesktopTradeFieldCard: ({ children, isSelected, error }: any) => (
    <div
      data-testid="desktop-trade-field-card"
      data-selected={isSelected}
      data-error={error}
    >
      {children}
    </div>
  ),
}));

jest.mock("@/components/TradeFields/TradeParam", () => ({
  __esModule: true,
  default: ({ label, value, onClick }: any) => (
    <button
      data-testid="trade-param"
      data-label={label}
      data-value={value}
      onClick={onClick}
    >
      <span>{value}</span>
    </button>
  ),
}));

// Mock stores
jest.mock("@/stores/tradeStore", () => ({
  useTradeStore: jest.fn(),
}));

jest.mock("@/stores/orientationStore", () => ({
  useOrientationStore: jest.fn(),
}));

jest.mock("@/stores/clientStore", () => ({
  useClientStore: jest.fn(),
}));

jest.mock("@/stores/bottomSheetStore", () => ({
  useBottomSheetStore: jest.fn(),
}));

jest.mock("@/stores/tooltipStore", () => ({
  useTooltipStore: jest.fn(),
}));

describe("StakeField", () => {
  const mockShowTooltip = jest.fn();
  const mockHideTooltip = jest.fn();
  const mockSetBottomSheet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default store mocks
    (
      useTooltipStore as jest.MockedFunction<typeof useTooltipStore>
    ).mockReturnValue({
      showTooltip: mockShowTooltip,
      hideTooltip: mockHideTooltip,
    });
    (
      useTradeStore as jest.MockedFunction<typeof useTradeStore>
    ).mockReturnValue({
      stake: "100",
      setStake: jest.fn(),
      isConfigLoading: false,
    });

    (
      useOrientationStore as jest.MockedFunction<typeof useOrientationStore>
    ).mockReturnValue({
      isLandscape: false,
    });

    (
      useClientStore as jest.MockedFunction<typeof useClientStore>
    ).mockReturnValue({
      currency: "USD",
    });

    (
      useBottomSheetStore as jest.MockedFunction<typeof useBottomSheetStore>
    ).mockReturnValue({
      setBottomSheet: mockSetBottomSheet,
    });
  });

  describe("Loading State", () => {
    it("should show skeleton loader when config is loading", () => {
      (
        useTradeStore as jest.MockedFunction<typeof useTradeStore>
      ).mockReturnValue({
        stake: "100",
        setStake: jest.fn(),
        isConfigLoading: true,
      });

      render(<StakeField />);

      const skeleton = screen.getByTestId("stake-field-skeleton");
      expect(skeleton).toBeInTheDocument();
      expect(screen.queryByTestId("trade-param")).not.toBeInTheDocument();
    });

    it("should show stake value when not loading", () => {
      render(<StakeField />);

      const param = screen.getByTestId("trade-param");
      expect(param).toBeInTheDocument();
      expect(param).toHaveAttribute("data-label", "Stake");
      expect(param).toHaveAttribute("data-value", "100 USD");
      expect(
        screen.queryByTestId("stake-field-skeleton")
      ).not.toBeInTheDocument();
    });
  });

  describe("Portrait Mode", () => {
    beforeEach(() => {
      (
        useOrientationStore as jest.MockedFunction<typeof useOrientationStore>
      ).mockReturnValue({
        isLandscape: false,
      });
    });

    it("should open bottom sheet when clicked", () => {
      render(<StakeField />);

      fireEvent.click(screen.getByTestId("trade-param"));

      expect(mockSetBottomSheet).toHaveBeenCalledWith(true, "stake", "400px");
    });
  });

  describe("Landscape Mode", () => {
    beforeEach(() => {
      (
        useOrientationStore as jest.MockedFunction<typeof useOrientationStore>
      ).mockReturnValue({
        isLandscape: true,
      });
    });

    it("should show input field and increment/decrement buttons", () => {
      render(<StakeField />);

      expect(screen.getByLabelText("Stake amount")).toBeInTheDocument();
      expect(screen.getByLabelText("Decrease stake")).toBeInTheDocument();
      expect(screen.getByLabelText("Increase stake")).toBeInTheDocument();
    });

    it("should update isSelected state when clicked", () => {
      render(<StakeField />);

      const container = screen.getByTestId("desktop-trade-field-card")
        .firstChild as HTMLElement;
      expect(container.parentElement).toHaveAttribute("data-selected", "false");

      fireEvent.click(container);
      expect(container.parentElement).toHaveAttribute("data-selected", "true");

      // Blur should unselect
      fireEvent.blur(container);
      expect(container.parentElement).toHaveAttribute("data-selected", "false");
    });

    it("should handle increment/decrement with validation", () => {
      const mockSetStake = jest.fn();
      (
        useTradeStore as jest.MockedFunction<typeof useTradeStore>
      ).mockReturnValue({
        stake: "100",
        setStake: mockSetStake,
        isConfigLoading: false,
      });

      render(<StakeField />);

      // Test increment (step = 1)
      fireEvent.click(screen.getByLabelText("Increase stake"));
      expect(mockSetStake).toHaveBeenCalledWith("101"); // 100 + 1

      // Test decrement (step = 1)
      fireEvent.click(screen.getByLabelText("Decrease stake"));
      expect(mockSetStake).toHaveBeenCalledWith("99"); // 100 - 1
    });

    it("should show error state and tooltip when validation fails", () => {
      render(<StakeField />);

      const input = screen.getByLabelText("Stake amount");
      fireEvent.change(input, { target: { value: "" } }); // Empty value triggers error

      const card = screen.getByTestId("desktop-trade-field-card");
      expect(card).toHaveAttribute("data-error", "true");

      // Verify tooltip is shown with error message
      expect(mockShowTooltip).toHaveBeenCalledWith(
        "Please enter an amount",
        expect.any(Object),
        "error"
      );

      // Verify tooltip is hidden when valid value is entered
      fireEvent.change(input, { target: { value: "100" } });
      expect(mockHideTooltip).toHaveBeenCalled();
    });
  });
});
