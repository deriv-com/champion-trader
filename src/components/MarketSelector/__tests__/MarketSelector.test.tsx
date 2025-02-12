import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { MarketSelector } from "../MarketSelector"
import * as deviceDetection from "@/hooks/useDeviceDetection"
import * as bottomSheetStore from "@/stores/bottomSheetStore"

// Mock the useDeviceDetection hook
jest.mock("@/hooks/useDeviceDetection")
const mockUseDeviceDetection = deviceDetection.useDeviceDetection as jest.Mock

// Mock the bottomSheetStore
jest.mock("@/stores/bottomSheetStore")
const mockSetBottomSheet = jest.fn()
jest.spyOn(bottomSheetStore, "useBottomSheetStore").mockImplementation(() => ({
  setBottomSheet: mockSetBottomSheet,
  isOpen: false,
  content: null,
  onClose: null,
}))

describe("MarketSelector", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders LeftSidebar on desktop", () => {
    mockUseDeviceDetection.mockReturnValue({ isMobile: false })

    render(<MarketSelector {...defaultProps} />)

    // Check for LeftSidebar
    expect(screen.getByRole("complementary")).toBeInTheDocument()
    expect(screen.getByText("Select Market")).toBeInTheDocument()
  })

  it("returns null and sets bottom sheet on mobile", () => {
    mockUseDeviceDetection.mockReturnValue({ isMobile: true })

    const { container } = render(<MarketSelector {...defaultProps} />)

    // Component should return null on mobile
    expect(container.firstChild).toBeNull()

    // Should set bottom sheet
    expect(mockSetBottomSheet).toHaveBeenCalledWith(
      true,
      "market-info",
      undefined,
      defaultProps.onClose
    )
  })

  it("closes sidebar when close button is clicked on desktop", () => {
    mockUseDeviceDetection.mockReturnValue({ isMobile: false })

    render(<MarketSelector {...defaultProps} />)

    // Click close button
    fireEvent.click(screen.getByRole("button"))

    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it("handles open/close state changes", () => {
    mockUseDeviceDetection.mockReturnValue({ isMobile: false })

    const { rerender } = render(<MarketSelector isOpen={false} onClose={defaultProps.onClose} />)

    // Initially closed
    expect(screen.queryByRole("complementary")).toHaveClass("-translate-x-full")

    // Open the sidebar
    rerender(<MarketSelector isOpen={true} onClose={defaultProps.onClose} />)
    expect(screen.queryByRole("complementary")).toHaveClass("translate-x-0")

    // Close the sidebar
    rerender(<MarketSelector isOpen={false} onClose={defaultProps.onClose} />)
    expect(screen.queryByRole("complementary")).toHaveClass("-translate-x-full")
  })

  it("sets bottom sheet only when open on mobile", () => {
    mockUseDeviceDetection.mockReturnValue({ isMobile: true })

    // Initially closed
    const { rerender } = render(<MarketSelector isOpen={false} onClose={defaultProps.onClose} />)
    expect(mockSetBottomSheet).not.toHaveBeenCalled()

    // Open
    rerender(<MarketSelector isOpen={true} onClose={defaultProps.onClose} />)
    expect(mockSetBottomSheet).toHaveBeenCalledWith(
      true,
      "market-info",
      undefined,
      defaultProps.onClose
    )
  })
})
