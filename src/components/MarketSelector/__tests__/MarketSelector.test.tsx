import { render, screen } from "@testing-library/react"
import { MarketSelector } from "../MarketSelector"
import * as leftSidebarStore from "@/stores/leftSidebarStore"

// Mock the leftSidebarStore
jest.mock("@/stores/leftSidebarStore")
const mockSetLeftSidebar = jest.fn()

// Mock useInstruments hook
jest.mock("@/hooks/useInstruments", () => ({
  useInstruments: () => ({
    marketGroups: [
      {
        market_name: "synthetic_index",
        instruments: ["1HZ100V", "R_100"]
      }
    ],
    isLoading: false,
    error: null
  })
}))

describe("MarketSelector", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders LeftSidebar when isOpen is true", () => {
    jest.spyOn(leftSidebarStore, "useLeftSidebarStore").mockImplementation(() => ({
      isOpen: true,
      title: "Select Market",
      setLeftSidebar: mockSetLeftSidebar,
    }))

    render(<MarketSelector />)

    // Check for LeftSidebar with MarketSelectorList
    const sidebar = screen.getByText("Select Market")
    expect(sidebar).toBeInTheDocument()
    expect(sidebar.closest("div")).toHaveClass("flex", "items-center", "justify-between")
  })

  it("returns null when isOpen is false", () => {
    jest.spyOn(leftSidebarStore, "useLeftSidebarStore").mockImplementation(() => ({
      isOpen: false,
      title: "Select Market",
      setLeftSidebar: mockSetLeftSidebar,
    }))

    const { container } = render(<MarketSelector />)
    expect(container.firstChild).toBeNull()
  })
})
