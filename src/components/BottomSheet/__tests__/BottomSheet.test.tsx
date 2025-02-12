import { render, screen, fireEvent, act } from "@testing-library/react";
import { BottomSheet } from "../BottomSheet";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";

// Mock the store and its types
const mockUseBottomSheetStore = useBottomSheetStore as unknown as jest.Mock;
const mockUseDeviceDetection = useDeviceDetection as jest.Mock;

jest.mock("@/stores/bottomSheetStore", () => ({
  useBottomSheetStore: jest.fn()
}));

jest.mock("@/hooks/useDeviceDetection", () => ({
  useDeviceDetection: jest.fn()
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
    mockUseDeviceDetection.mockReturnValue({ isDesktop: false });
    // Mock requestAnimationFrame
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => setTimeout(cb, 0));
  });

  afterEach(() => {
    (window.requestAnimationFrame as jest.Mock).mockRestore();
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

  it("handles touch drag to dismiss, prevents default, and calls onDragDown", () => {
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

    // Create a mock event with preventDefault
    const mockPreventDefault = jest.fn();
    const touchStartEvent = { touches: [{ clientY: 0 }] };
    const touchMoveEvent = new TouchEvent('touchmove', {
      touches: [{ clientY: 150 } as Touch],
      bubbles: true,
      cancelable: true
    });
    Object.defineProperty(touchMoveEvent, 'preventDefault', {
      value: mockPreventDefault
    });

    // Simulate drag down
    fireEvent.touchStart(handleBar!, touchStartEvent);
    document.dispatchEvent(touchMoveEvent);
    fireEvent.touchEnd(document);

    // Verify preventDefault was called
    expect(mockPreventDefault).toHaveBeenCalled();
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

  it("closes bottom sheet when clicking handle bar on desktop", () => {
    mockUseDeviceDetection.mockReturnValue({ isDesktop: true });
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
    fireEvent.click(handleBar!);

    expect(mockOnDragDown).toHaveBeenCalled();
    expect(mockSetBottomSheet).toHaveBeenCalledWith(false);
  });

  it("does not close bottom sheet when clicking handle bar on mobile", () => {
    mockUseDeviceDetection.mockReturnValue({ isDesktop: false });
    mockUseBottomSheetStore.mockReturnValue({
      showBottomSheet: true,
      key: 'test-key',
      height: '380px',
      setBottomSheet: mockSetBottomSheet
    });

    const { container } = render(<BottomSheet />);

    const handleBar = container.querySelector('[class*="flex flex-col items-center"]');
    expect(handleBar).toBeInTheDocument();
    fireEvent.click(handleBar!);

    expect(mockSetBottomSheet).not.toHaveBeenCalled();
  });

  it("handles mouse drag to dismiss and calls onDragDown", async () => {
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

    // Simulate mouse drag down
    fireEvent.mouseDown(handleBar!, { clientY: 0 });
    
    await act(async () => {
      const mouseMoveEvent = new MouseEvent('mousemove', {
        clientY: 150,
        bubbles: true,
        cancelable: true
      });
      document.dispatchEvent(mouseMoveEvent);
      // Wait for requestAnimationFrame
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    fireEvent.mouseUp(document);

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
