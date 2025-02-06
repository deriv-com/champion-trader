import { render, screen, fireEvent } from '@testing-library/react';
import { DurationValueList } from '../DurationValueList';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
const mockUnobserve = jest.fn();

mockIntersectionObserver.mockImplementation(() => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
}));
window.IntersectionObserver = mockIntersectionObserver;

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('DurationValueList', () => {
  const defaultProps = {
    selectedValue: 1,
    durationType: 'tick',
    onValueSelect: jest.fn(),
    getDurationValues: () => [1, 2, 3, 4, 5],
  };

  beforeEach(() => {
    defaultProps.onValueSelect.mockClear();
    (window.HTMLElement.prototype.scrollIntoView as jest.Mock).mockClear();
    mockIntersectionObserver.mockClear();
    mockObserve.mockClear();
    mockDisconnect.mockClear();
    mockUnobserve.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders duration values with correct unit labels', () => {
    render(<DurationValueList {...defaultProps} />);

    // Check singular form
    expect(screen.getByText('1 tick')).toBeInTheDocument();
    // Check plural form
    expect(screen.getByText('2 ticks')).toBeInTheDocument();
  });

  it('handles different duration types correctly', () => {
    const props = {
      ...defaultProps,
      durationType: 'minute',
      getDurationValues: () => [1, 2, 5],
    };

    render(<DurationValueList {...props} />);

    expect(screen.getByText('1 minute')).toBeInTheDocument();
    expect(screen.getByText('2 minutes')).toBeInTheDocument();
    expect(screen.getByText('5 minutes')).toBeInTheDocument();
  });

  it('marks selected value as checked', () => {
    render(<DurationValueList {...defaultProps} />);

    const selectedInput = screen.getByDisplayValue('1') as HTMLInputElement;
    expect(selectedInput.checked).toBe(true);

    const unselectedInput = screen.getByDisplayValue('2') as HTMLInputElement;
    expect(unselectedInput.checked).toBe(false);
  });

  it('calls onValueSelect and scrolls when value is clicked', () => {
    render(<DurationValueList {...defaultProps} />);

    fireEvent.click(screen.getByText('3 ticks'));

    expect(defaultProps.onValueSelect).toHaveBeenCalledWith(3);
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
      block: 'center',
      behavior: 'smooth',
    });
  });

  it('applies correct styles to selected and unselected values', () => {
    render(<DurationValueList {...defaultProps} />);

    const selectedText = screen.getByText('1 tick');
    const unselectedText = screen.getByText('2 ticks');

    expect(selectedText.className).toContain('text-black');
    expect(unselectedText.className).toContain('text-gray-300');
  });

  it('renders with correct spacing and layout', () => {
    const { container } = render(<DurationValueList {...defaultProps} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('relative h-[268px]');

    const scrollContainer = wrapper.querySelector('div:nth-child(2)');
    expect(scrollContainer).toHaveClass('h-full overflow-y-auto scroll-smooth snap-y snap-mandatory [&::-webkit-scrollbar]:hidden');
  });

  it('handles day duration type without plural form', () => {
    const props = {
      ...defaultProps,
      durationType: 'day',
      getDurationValues: () => [1],
    };

    render(<DurationValueList {...props} />);

    expect(screen.getByText('1 day')).toBeInTheDocument();
  });

  it('initializes with correct scroll position', () => {
    render(<DurationValueList {...defaultProps} />);

    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
      block: 'center',
      behavior: 'instant',
    });
  });

  it('handles value changes after initial render', () => {
    const { rerender } = render(<DurationValueList {...defaultProps} />);

    // Change selected value
    rerender(<DurationValueList {...defaultProps} selectedValue={3} />);

    const newSelectedInput = screen.getByDisplayValue('3') as HTMLInputElement;
    expect(newSelectedInput.checked).toBe(true);
  });
});
