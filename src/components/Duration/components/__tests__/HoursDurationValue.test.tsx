import { render, screen, fireEvent } from '@testing-library/react';
import { HoursDurationValue } from '../HoursDurationValue';

// Mock the DurationValueList component since we're testing HoursDurationValue in isolation
jest.mock('../DurationValueList', () => ({
  DurationValueList: ({ selectedValue, durationType, onValueSelect }: any) => (
    <div data-testid={`duration-value-list-${durationType}`}>
      <button
        onClick={() => onValueSelect(selectedValue + 1)}
        data-testid={`increment-${durationType}`}
      >
        Increment {durationType}
      </button>
      <span>Current value: {selectedValue}</span>
    </div>
  ),
}));

describe('HoursDurationValue', () => {
  const defaultProps = {
    selectedValue: '2:30',
    onValueSelect: jest.fn(),
  };

  beforeEach(() => {
    defaultProps.onValueSelect.mockClear();
  });

  it('renders hours and minutes sections with proper ARIA labels', () => {
    render(<HoursDurationValue {...defaultProps} />);

    const container = screen.getByRole('group');
    expect(container).toHaveAttribute('aria-label', 'Duration in hours and minutes');

    const hoursSection = screen.getByLabelText('Hours');
    const minutesSection = screen.getByLabelText('Minutes');

    expect(hoursSection).toBeInTheDocument();
    expect(minutesSection).toBeInTheDocument();
  });

  it('initializes with correct hour and minute values', () => {
    render(<HoursDurationValue selectedValue="3:45" onValueSelect={jest.fn()} />);

    expect(screen.getByTestId('duration-value-list-hour')).toHaveTextContent('Current value: 3');
    expect(screen.getByTestId('duration-value-list-minute')).toHaveTextContent('Current value: 45');
  });

  it('handles hour selection', () => {
    render(<HoursDurationValue {...defaultProps} />);

    fireEvent.click(screen.getByTestId('increment-hour'));

    expect(defaultProps.onValueSelect).toHaveBeenCalledWith('3:30');
  });

  it('handles minute selection', () => {
    render(<HoursDurationValue {...defaultProps} />);

    fireEvent.click(screen.getByTestId('increment-minute'));

    expect(defaultProps.onValueSelect).toHaveBeenCalledWith('2:31');
  });

  it('maintains last valid values when selecting new values', () => {
    const { rerender } = render(<HoursDurationValue {...defaultProps} />);

    // Change hours
    fireEvent.click(screen.getByTestId('increment-hour'));
    expect(defaultProps.onValueSelect).toHaveBeenCalledWith('3:30');

    // Update component with new value
    rerender(<HoursDurationValue {...defaultProps} selectedValue="3:30" />);

    // Change minutes
    fireEvent.click(screen.getByTestId('increment-minute'));
    expect(defaultProps.onValueSelect).toHaveBeenCalledWith('3:31');
  });

  it('renders with correct layout', () => {
    const { container } = render(<HoursDurationValue {...defaultProps} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex w-full');

    const [hoursDiv, minutesDiv] = wrapper.childNodes;
    expect(hoursDiv).toHaveClass('flex-1');
    expect(minutesDiv).toHaveClass('flex-1');
  });

  it('passes correct props to DurationValueList components', () => {
    render(<HoursDurationValue {...defaultProps} />);

    const hoursList = screen.getByTestId('duration-value-list-hour');
    const minutesList = screen.getByTestId('duration-value-list-minute');

    expect(hoursList).toBeInTheDocument();
    expect(minutesList).toBeInTheDocument();
  });
});
