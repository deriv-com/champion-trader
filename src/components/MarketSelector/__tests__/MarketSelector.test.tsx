import { render, screen } from "@testing-library/react"
import { MarketSelector } from "../MarketSelector"
import * as leftSidebarStore from "@/stores/leftSidebarStore"

// Mock the leftSidebarStore
jest.mock("@/stores/leftSidebarStore")
const mockSetLeftSidebar = jest.fn()

// Mock the market stub data
jest.mock("../marketSelectorStub", () => ({
  marketData: [
    {
      symbol: "R_100",
      displayName: "Volatility 100 Index",
      shortName: "100",
      market_name: "synthetic_index",
      type: "volatility"
    },
    {
      symbol: "1HZ100V",
      displayName: "Volatility 100 (1s) Index",
      shortName: "100",
      market_name: "synthetic_index",
      type: "volatility"
    }
  ],
  marketTitles: {
    synthetic_index: "Synthetics",
    crash_boom: "Crash/Boom",
    forex: "Forex"
  },
  marketTypeMap: {
    derived: "synthetic_index",
    forex: "forex",
    crash_boom: "crash_boom"
  }
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

    const sidebar = screen.getByText("Markets")
    expect(sidebar).toBeInTheDocument()
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
