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
