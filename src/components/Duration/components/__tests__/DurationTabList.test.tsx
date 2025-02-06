import { render, screen, fireEvent } from '@testing-library/react';
import { DurationTabList } from '../DurationTabList';

describe('DurationTabList', () => {
  const defaultProps = {
    selectedType: 'tick',
    onTypeSelect: jest.fn(),
  };

  beforeEach(() => {
    defaultProps.onTypeSelect.mockClear();
  });

  it('renders all expected duration types', () => {
    render(<DurationTabList {...defaultProps} />);
    // Originally expected types are "Ticks", "Minutes", "Hours", and "End Time"
    expect(screen.getByText('Ticks')).toBeInTheDocument();
    expect(screen.getByText('Minutes')).toBeInTheDocument();
    expect(screen.getByText('Hours')).toBeInTheDocument();
    expect(screen.getByText('End Time')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const mockOnTypeSelect = jest.fn();
    render(<DurationTabList {...defaultProps} onTypeSelect={mockOnTypeSelect} />);
    fireEvent.click(screen.getByText('Minutes'));
    expect(mockOnTypeSelect).toHaveBeenCalledWith('minute');
  });

  it('handles keyboard navigation', () => {
    const mockOnTypeSelect = jest.fn();
    render(<DurationTabList {...defaultProps} onTypeSelect={mockOnTypeSelect} />);
    const minutesTab = screen.getByText('Minutes');
    minutesTab.focus();
    // Simulate Enter key press
    fireEvent.keyDown(minutesTab, { key: 'Enter', code: 'Enter' });
    expect(mockOnTypeSelect).toHaveBeenCalledWith('minute');
    mockOnTypeSelect.mockClear();
    // Simulate Space key press
    fireEvent.keyDown(minutesTab, { key: ' ', code: 'Space' });
    expect(mockOnTypeSelect).toHaveBeenCalledWith('minute');
  });
});
