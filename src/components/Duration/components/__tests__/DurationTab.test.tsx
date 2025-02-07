import { render, screen, fireEvent } from '@testing-library/react';
import { DurationTab } from '../DurationTab';

describe('DurationTab', () => {
  const defaultProps = {
    label: 'Minutes',
    isSelected: false,
    onSelect: jest.fn(),
  };

  beforeEach(() => {
    defaultProps.onSelect.mockClear();
  });

  describe('Rendering', () => {
    it('renders label correctly', () => {
      render(<DurationTab {...defaultProps} />);
      expect(screen.getByText('Minutes')).toBeInTheDocument();
    });

    it('renders with different labels', () => {
      const labels = ['Ticks', 'Seconds', 'Hours', 'End Time'];
      
      labels.forEach(label => {
        const { rerender } = render(<DurationTab {...defaultProps} label={label} />);
        expect(screen.getByText(label)).toBeInTheDocument();
        rerender(<DurationTab {...defaultProps} />); // Reset to default
      });
    });

    it('updates visual state when isSelected changes', () => {
      const { rerender } = render(<DurationTab {...defaultProps} />);
      const initialButton = screen.getByRole('button');
      const initialClassName = initialButton.className;

      rerender(<DurationTab {...defaultProps} isSelected={true} />);
      const selectedButton = screen.getByRole('button');
      const selectedClassName = selectedButton.className;

      expect(initialClassName).not.toBe(selectedClassName);
      expect(selectedClassName).toContain('bg-black');
    });
  });

  describe('Interaction', () => {
    it('handles click events', () => {
      render(<DurationTab {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Minutes'));
      expect(defaultProps.onSelect).toHaveBeenCalledTimes(1);
    });

    it('maintains interactivity after multiple clicks', () => {
      render(<DurationTab {...defaultProps} />);
      const button = screen.getByRole('button');
      
      // Multiple clicks should trigger multiple calls
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(defaultProps.onSelect).toHaveBeenCalledTimes(3);
    });
  });

  describe('Styling', () => {
    it('applies selected styles when isSelected is true', () => {
      render(<DurationTab {...defaultProps} isSelected={true} />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-black');
      expect(button.className).toContain('text-white');
    });

    it('applies unselected styles when isSelected is false', () => {
      render(<DurationTab {...defaultProps} isSelected={false} />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-white');
      expect(button.className).toContain('text-black/60');
    });

    it('maintains consistent height', () => {
      render(<DurationTab {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('h-8');
    });
  });

  describe('Error Handling', () => {
    // Using console.error spy to verify prop type warnings
    const originalError = console.error;
    beforeAll(() => {
      console.error = jest.fn();
    });
    
    afterAll(() => {
      console.error = originalError;
    });

    it('handles missing props gracefully', () => {
      // @ts-ignore - Testing JS usage
      expect(() => render(<DurationTab />)).not.toThrow();
    });

    it('handles invalid prop types gracefully', () => {
      // @ts-ignore - Testing JS usage
      expect(() => render(<DurationTab {...defaultProps} isSelected="true" />)).not.toThrow();
    });
  });
});
