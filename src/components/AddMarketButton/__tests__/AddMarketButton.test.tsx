import { render, screen, fireEvent } from '@testing-library/react';
import { AddMarketButton } from '../AddMarketButton';

describe('AddMarketButton', () => {
  it('renders button with plus icon', () => {
    render(<AddMarketButton />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<AddMarketButton onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalled();
  });

  it('applies correct styles', () => {
    render(<AddMarketButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-100');
  });
});
