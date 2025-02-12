import { render, screen, fireEvent } from '@testing-library/react';
import { Chip } from '../chip';

describe('Chip', () => {
  const defaultProps = {
    children: 'Test Chip',
  };

  it('renders children correctly', () => {
    render(<Chip>{defaultProps.children}</Chip>);
    expect(screen.getByText('Test Chip')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Chip onClick={handleClick}>{defaultProps.children}</Chip>);
    
    fireEvent.click(screen.getByText('Test Chip'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies selected styles when isSelected is true', () => {
    const { container } = render(
      <Chip isSelected>{defaultProps.children}</Chip>
    );
    
    const button = container.firstChild as HTMLElement;
    expect(button.className).toContain('bg-black text-white');
  });

  it('applies unselected styles when isSelected is false', () => {
    const { container } = render(
      <Chip isSelected={false}>{defaultProps.children}</Chip>
    );
    
    const button = container.firstChild as HTMLElement;
    expect(button.className).toContain('bg-white text-black/60');
  });

  it('maintains consistent height', () => {
    const { container } = render(<Chip>{defaultProps.children}</Chip>);
    
    const button = container.firstChild as HTMLElement;
    expect(button.className).toContain('h-8 min-h-[32px] max-h-[32px]');
  });

  it('handles long text with ellipsis', () => {
    const { container } = render(
      <Chip>{'Very long text that should be truncated'}</Chip>
    );
    
    const button = container.firstChild as HTMLElement;
    expect(button.className).toContain('whitespace-nowrap');
  });

  it('is accessible with keyboard navigation', () => {
    const handleClick = jest.fn();
    render(
      <Chip onClick={handleClick}>{defaultProps.children}</Chip>
    );
    
    const button = screen.getByText('Test Chip');
    button.focus();
    
    // Simulate Enter key press
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    expect(handleClick).toHaveBeenCalled();
    
    handleClick.mockClear();
    
    // Simulate Space key press
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    expect(handleClick).toHaveBeenCalled();
  });
});
