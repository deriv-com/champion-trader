import { render, screen, fireEvent, act } from '@testing-library/react';
import { DurationController } from '../DurationController';
import { useTradeStore } from '@/stores/tradeStore';
import { useBottomSheetStore } from '@/stores/bottomSheetStore';
import type { BottomSheetState } from '@/stores/bottomSheetStore';

// Mock the stores
jest.mock("@/stores/tradeStore", () => ({
  useTradeStore: jest.fn(),
}))

jest.mock("@/stores/bottomSheetStore", () => ({
  useBottomSheetStore: jest.fn(),
}))

// Mock scrollIntoView and IntersectionObserver
window.HTMLElement.prototype.scrollIntoView = jest.fn()
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver

describe("DurationController", () => {
  const mockSetDuration = jest.fn()
  const mockSetBottomSheet = jest.fn()
  const mockSetStake = jest.fn()
  const mockToggleAllowEquals = jest.fn()
  const mockSetSymbol = jest.fn()

  const setupMocks = () => {
    // Setup store mocks with proper typing
    (useTradeStore as jest.MockedFunction<typeof useTradeStore>).mockReturnValue({
      stake: '10 USD',
      duration: '5 minute',
      allowEquals: false,
      trade_type: 'rise_fall',
      instrument: 'R_100',
      payouts: { max: 50000, values: {} },
      setStake: mockSetStake,
      setDuration: mockSetDuration,
      toggleAllowEquals: mockToggleAllowEquals,
      setPayouts: jest.fn(),
      setTradeType: jest.fn()
    });

    ;(
      useBottomSheetStore as jest.MockedFunction<typeof useBottomSheetStore>
    ).mockReturnValue({
      showBottomSheet: false,
      key: null,
      height: "380px",
      setBottomSheet: mockSetBottomSheet,
    } as BottomSheetState)
  }

  beforeEach(() => {
    setupMocks()
    // Clear mocks
    mockSetDuration.mockClear()
    mockSetBottomSheet.mockClear()
    mockSetStake.mockClear()
    mockToggleAllowEquals.mockClear()
    mockIntersectionObserver.mockClear()
  })

  describe('Initial Render', () => {
    it('renders duration types', () => {
      render(<DurationController />);

      expect(screen.getByText('Duration')).toBeInTheDocument();
      expect(screen.getByText('Ticks')).toBeInTheDocument();
      expect(screen.getByText('Seconds')).toBeInTheDocument();
      expect(screen.getByText('Minutes')).toBeInTheDocument();
      expect(screen.getByText('Hours')).toBeInTheDocument();
    });

    it('syncs with store on mount', () => {
      setupMocks();
      render(<DurationController />);
      
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      expect(mockSetDuration).toHaveBeenCalledWith('5 minute');
    });
  });

  
  describe('Minutes Duration', () => {
    beforeEach(() => {
      render(<DurationController />)
      act(() => {
        fireEvent.click(screen.getByText("Minutes"))
      })
    })

    it('shows minute values from 0 to 59', () => {
      const valueItems = screen.getAllByRole('radio');
      const values = valueItems.map(item => item.getAttribute('value'));
      
      // Verify we have values from 0 to 59
      expect(values.length).toBe(60);
      expect(values[0]).toBe('0');
      expect(values[59]).toBe('59');
    });

    it('selects default minute value as 0', () => {
      const selectedValue = screen.getByRole('radio', { checked: true });
      expect(selectedValue.getAttribute('value')).toBe('0');
    });

    it("selects default minute value", () => {
      const selectedValue = screen.getByRole("radio", { checked: true })
      expect(selectedValue.getAttribute("value")).toBe("1")
    })

    it("updates duration on minute selection", () => {
      const valueItems = screen.getAllByRole("radio")
      const fiveMinutes = valueItems.find(
        (item) => item.getAttribute("value") === "5"
      )

      if (fiveMinutes) {
        act(() => {
          fireEvent.click(fiveMinutes)
        })
      }

      const saveButton = screen.getByText("Save")
      fireEvent.click(saveButton)

      expect(mockSetDuration).toHaveBeenCalledWith("5 minute")
    })
  })

  
  
  });
