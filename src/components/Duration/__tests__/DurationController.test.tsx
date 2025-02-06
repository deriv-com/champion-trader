import { render, screen, fireEvent, act } from '@testing-library/react';
import { DurationController } from '../DurationController';
import { useTradeStore } from '@/stores/tradeStore';
import { useBottomSheetStore } from '@/stores/bottomSheetStore';
import type { TradeState } from '@/stores/tradeStore';
import type { BottomSheetState } from '@/stores/bottomSheetStore';

// Mock the stores
jest.mock('@/stores/tradeStore', () => ({
  useTradeStore: jest.fn(),
}));

jest.mock('@/stores/bottomSheetStore', () => ({
  useBottomSheetStore: jest.fn(),
}));

// Mock scrollIntoView and IntersectionObserver
window.HTMLElement.prototype.scrollIntoView = jest.fn();
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe('DurationController', () => {
  const mockSetDuration = jest.fn();
  const mockSetBottomSheet = jest.fn();
  const mockSetStake = jest.fn();
  const mockToggleAllowEquals = jest.fn();

  const setupMocks = (initialDuration = '1 tick') => {
    // Setup store mocks with proper typing
    (useTradeStore as jest.MockedFunction<typeof useTradeStore>).mockReturnValue({
      stake: '10 USD',
      duration: initialDuration,
      allowEquals: false,
      setStake: mockSetStake,
      setDuration: mockSetDuration,
      toggleAllowEquals: mockToggleAllowEquals,
    } as TradeState);

    (useBottomSheetStore as jest.MockedFunction<typeof useBottomSheetStore>).mockReturnValue({
      showBottomSheet: false,
      key: null,
      height: '380px',
      setBottomSheet: mockSetBottomSheet,
    } as BottomSheetState);
  };

  beforeEach(() => {
    setupMocks();
    // Clear mocks
    mockSetDuration.mockClear();
    mockSetBottomSheet.mockClear();
    mockSetStake.mockClear();
    mockToggleAllowEquals.mockClear();
    mockIntersectionObserver.mockClear();
  });

  describe('Initial Render', () => {
    it('renders duration types and initial value', () => {
      render(<DurationController />);

      expect(screen.getByText('Duration')).toBeInTheDocument();
      expect(screen.getByText('Ticks')).toBeInTheDocument();
      expect(screen.getByText('Seconds')).toBeInTheDocument();
      expect(screen.getByText('Minutes')).toBeInTheDocument();
      expect(screen.getByText('Hours')).toBeInTheDocument();
      expect(screen.getByText('End Time')).toBeInTheDocument();
    });

    it('syncs with store on mount', () => {
      setupMocks('5 tick');
      render(<DurationController />);
      
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      expect(mockSetDuration).toHaveBeenCalledWith('5 tick');
    });
  });

  describe('Ticks Duration', () => {
    it('shows correct tick values', () => {
      render(<DurationController />);
      
      const valueItems = screen.getAllByRole('radio');
      const values = valueItems.map(item => item.getAttribute('value'));
      
      expect(values).toEqual(['1', '2', '3', '4', '5']);
    });

    it('selects default tick value', () => {
      render(<DurationController />);
      
      const selectedValue = screen.getByRole('radio', { checked: true });
      expect(selectedValue.getAttribute('value')).toBe('1');
    });

    it('updates duration on tick selection', () => {
      render(<DurationController />);

      const valueItems = screen.getAllByRole('radio');
      const threeTicks = valueItems.find(item => item.getAttribute('value') === '3');

      if (threeTicks) {
        act(() => {
          fireEvent.click(threeTicks);
        });
      }

      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      expect(mockSetDuration).toHaveBeenCalledWith('3 tick');
    });
  });

  describe('Minutes Duration', () => {
    beforeEach(() => {
      render(<DurationController />);
      act(() => {
        fireEvent.click(screen.getByText('Minutes'));
      });
    });

    it('shows correct minute values', () => {
      const valueItems = screen.getAllByRole('radio');
      const values = valueItems.map(item => item.getAttribute('value'));
      
      expect(values).toEqual(['1', '2', '3', '5', '10', '15', '30']);
    });

    it('selects default minute value', () => {
      const selectedValue = screen.getByRole('radio', { checked: true });
      expect(selectedValue.getAttribute('value')).toBe('1');
    });

    it('updates duration on minute selection', () => {
      const valueItems = screen.getAllByRole('radio');
      const fiveMinutes = valueItems.find(item => item.getAttribute('value') === '5');

      if (fiveMinutes) {
        act(() => {
          fireEvent.click(fiveMinutes);
        });
      }

      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      expect(mockSetDuration).toHaveBeenCalledWith('5 minute');
    });
  });

  describe('Hours Duration', () => {
    beforeEach(() => {
      render(<DurationController />);
      act(() => {
        fireEvent.click(screen.getByText('Hours'));
      });
    });

    it('handles hour:minute format correctly', () => {
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      expect(mockSetDuration).toHaveBeenCalledWith('1:0 hour');
    });

    it('preserves hour selection when switching tabs', () => {
      // Switch to minutes
      act(() => {
        fireEvent.click(screen.getByText('Minutes'));
      });

      // Switch back to hours
      act(() => {
        fireEvent.click(screen.getByText('Hours'));
      });

      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      expect(mockSetDuration).toHaveBeenCalledWith('1:0 hour');
    });
  });

  describe('End Time Duration', () => {
    beforeEach(() => {
      render(<DurationController />);
      act(() => {
        fireEvent.click(screen.getByText('End Time'));
      });
    });

    it('updates duration for end time selection', () => {
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      expect(mockSetDuration).toHaveBeenCalledWith('1 day');
    });
  });

  describe('State Management', () => {
    it('preserves local state until save', () => {
      render(<DurationController />);

      // Change to minutes
      act(() => {
        fireEvent.click(screen.getByText('Minutes'));
      });

      // Select 5 minutes
      const valueItems = screen.getAllByRole('radio');
      const fiveMinutes = valueItems.find(item => item.getAttribute('value') === '5');

      if (fiveMinutes) {
        act(() => {
          fireEvent.click(fiveMinutes);
        });
      }

      // Verify store hasn't been updated yet
      expect(mockSetDuration).not.toHaveBeenCalled();

      // Save changes
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      // Verify store is updated with new value
      expect(mockSetDuration).toHaveBeenCalledWith('5 minute');
      expect(mockSetBottomSheet).toHaveBeenCalledWith(false);
    });

    it('handles rapid tab switching without losing state', () => {
      render(<DurationController />);

      // Rapid switches between duration types
      act(() => {
        fireEvent.click(screen.getByText('Minutes'));
        fireEvent.click(screen.getByText('Hours'));
        fireEvent.click(screen.getByText('End Time'));
        fireEvent.click(screen.getByText('Minutes'));
      });

      // Select and save a value
      const valueItems = screen.getAllByRole('radio');
      const threeMinutes = valueItems.find(item => item.getAttribute('value') === '3');

      if (threeMinutes) {
        act(() => {
          fireEvent.click(threeMinutes);
        });
      }

      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      expect(mockSetDuration).toHaveBeenCalledWith('3 minute');
    });

    it('handles invalid duration format gracefully', () => {
      setupMocks('invalid duration');
      render(<DurationController />);

      // Should use the provided invalid duration
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      expect(mockSetDuration).toHaveBeenCalledWith('invalid duration');
    });
  });
});
