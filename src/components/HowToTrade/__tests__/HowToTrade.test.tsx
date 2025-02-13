import { render, screen, fireEvent } from '@testing-library/react';
import HowToTrade from '../HowToTrade';

const mockSetBottomSheet = jest.fn();

// Mock the bottomSheetStore
jest.mock('@/stores/bottomSheetStore', () => ({
  useBottomSheetStore: () => ({
    setBottomSheet: mockSetBottomSheet
  })
}));

describe('HowToTrade', () => {
  beforeEach(() => {
    mockSetBottomSheet.mockClear();
  });

  it('renders correctly', () => {
    render(<HowToTrade />);
    expect(screen.getByText('How to trade Rise/Fall?')).toBeInTheDocument();
  });

  it('opens bottom sheet when clicked', () => {
    render(<HowToTrade />);
    fireEvent.click(screen.getByText('How to trade Rise/Fall?'));
    
    const call = mockSetBottomSheet.mock.calls[0];
    expect(call[0]).toBe(true);
    expect(call[1]).toBe('how-to-trade');
    expect(call[2]).toBe('90%');
    expect(call[3]).toEqual(expect.objectContaining({
      show: true,
      label: "Got it",
      onClick: expect.any(Function)
    }));
    call[3].onClick();
    expect(mockSetBottomSheet).toHaveBeenCalledWith(false);
  });
});
