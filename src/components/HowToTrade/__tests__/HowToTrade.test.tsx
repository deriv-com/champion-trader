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
    expect(mockSetBottomSheet).toHaveBeenCalledWith(true, 'how-to-trade', '90%');
  });
});
