import { render, screen, fireEvent } from "@testing-library/react";
import { BottomSheet } from "../BottomSheet";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";

// Mock the store and its types
const mockUseBottomSheetStore = useBottomSheetStore as unknown as jest.Mock;
jest.mock("@/stores/bottomSheetStore", () => ({
  useBottomSheetStore: jest.fn()
}));

// Mock the config
jest.mock("@/config/bottomSheetConfig", () => ({
  bottomSheetConfig: {
    'test-key': {
      body: <div>Test Body Content</div>
    }
  }
}));

describe("BottomSheet", () => {
  const mockSetBottomSheet = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  it("renders body content when showBottomSheet is true", () => {
    mockUseBottomSheetStore.mockReturnValue({
      showBottomSheet: true,
      key: 'test-key',
      height: '380px',
      setBottomSheet: mockSetBottomSheet
    });

    render(<BottomSheet />);

    expect(screen.getByText("Test Body Content")).toBeInTheDocument();
  });

  it("does not render when showBottomSheet is false", () => {
    mockUseBottomSheetStore.mockReturnValue({
      showBottomSheet: false,
      key: null,
      height: '380px',
      setBottomSheet: mockSetBottomSheet
    });

    render(<BottomSheet />);

    expect(screen.queryByText("Test Body Content")).not.toBeInTheDocument();
  });

  it("applies custom height from store", () => {
    mockUseBottomSheetStore.mockReturnValue({
      showBottomSheet: true,
      key: 'test-key',
      height: '50%',
      setBottomSheet: mockSetBottomSheet
    });

    const { container } = render(<BottomSheet />);

    const bottomSheet = container.querySelector('[class*="fixed bottom-0"]');
    expect(bottomSheet).toHaveStyle({ height: '50vh' });
  });

  it("handles drag to dismiss and calls onDragDown", () => {
    const mockOnDragDown = jest.fn();
    mockUseBottomSheetStore.mockReturnValue({
      showBottomSheet: true,
      key: 'test-key',
      height: '380px',
      onDragDown: mockOnDragDown,
      setBottomSheet: mockSetBottomSheet
    });

    const { container } = render(<BottomSheet />);

    const handleBar = container.querySelector('[class*="flex flex-col items-center"]');
    expect(handleBar).toBeInTheDocument();

    // Simulate drag down
    fireEvent.touchStart(handleBar!, { touches: [{ clientY: 0 }] });
    fireEvent.touchMove(document, { touches: [{ clientY: 150 }] });
    fireEvent.touchEnd(document);

    expect(mockOnDragDown).toHaveBeenCalled();
    expect(mockSetBottomSheet).toHaveBeenCalledWith(false);
  });

  it("applies animation classes when shown", () => {
    mockUseBottomSheetStore.mockReturnValue({
      showBottomSheet: true,
      key: 'test-key',
      height: '380px',
      setBottomSheet: mockSetBottomSheet
    });

    const { container } = render(<BottomSheet />);

    const overlay = container.querySelector('[class*="fixed inset-0"]');
    const sheet = container.querySelector('[class*="fixed bottom-0"]');

    expect(overlay?.className).toContain('animate-in fade-in-0');
    expect(sheet?.className).toContain('animate-in fade-in-0 slide-in-from-bottom');
    expect(sheet?.className).toContain('duration-300');
  });

  it("calls onDragDown when clicking overlay", () => {
    const mockOnDragDown = jest.fn();
    mockUseBottomSheetStore.mockReturnValue({
      showBottomSheet: true,
      key: 'test-key',
      height: '380px',
      onDragDown: mockOnDragDown,
      setBottomSheet: mockSetBottomSheet
    });

    const { container } = render(<BottomSheet />);

    const overlay = container.querySelector('[class*="fixed inset-0"]');
    expect(overlay).toBeInTheDocument();
    fireEvent.click(overlay!);

    expect(mockOnDragDown).toHaveBeenCalled();
    expect(mockSetBottomSheet).toHaveBeenCalledWith(false);
  });

  it("should close when clicking overlay", () => {
    mockUseBottomSheetStore.mockReturnValue({
      showBottomSheet: true,
      key: 'test-key',
      height: '380px',
      setBottomSheet: mockSetBottomSheet
    });

    const { container } = render(<BottomSheet />);

    const overlay = container.querySelector('[class*="fixed inset-0"]');
    expect(overlay).toBeInTheDocument();
    fireEvent.click(overlay!);

    expect(mockSetBottomSheet).toHaveBeenCalled();
  });
});
