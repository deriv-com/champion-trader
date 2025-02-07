import { render, screen, fireEvent } from '@testing-library/react';
import { TradeButton } from '../Button';

describe('TradeButton', () => {
  const defaultProps = {
    title: 'Rise',
    label: 'Payout',
    value: '19.55 USD',
    title_position: 'left' as const,
  };

  it('renders with left position', () => {
    render(<TradeButton {...defaultProps} />);

    expect(screen.getByText('Rise')).toBeInTheDocument();
    expect(screen.getByText('Payout')).toBeInTheDocument();
    expect(screen.getByText('19.55 USD')).toBeInTheDocument();
  });

  it('renders with right position', () => {
    render(
      <TradeButton
        {...defaultProps}
        title="Fall"
        title_position="right"
      />
    );

    expect(screen.getByText('Fall')).toBeInTheDocument();
    expect(screen.getByText('Payout')).toBeInTheDocument();
    expect(screen.getByText('19.55 USD')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <TradeButton
        {...defaultProps}
        className="bg-teal-500"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-teal-500');
  });

  it('has correct button type and ARIA label', () => {
    render(<TradeButton {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label', 'Rise - Payout: 19.55 USD');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<TradeButton {...defaultProps} onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard interactions', () => {
    const handleClick = jest.fn();
    render(<TradeButton {...defaultProps} onClick={handleClick} />);

    const button = screen.getByRole('button');

    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    // Test Space key
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('maintains text color and font styles', () => {
    render(<TradeButton {...defaultProps} />);

    const title = screen.getByText('Rise');
    const label = screen.getByText('Payout');
    const value = screen.getByText('19.55 USD');

    expect(title).toHaveClass('text-xl font-bold text-white');
    expect(label).toHaveClass('text-sm text-white/80');
    expect(value).toHaveClass('text-xl font-bold text-white');
  });

  it('maintains layout and spacing', () => {
    const { container } = render(<TradeButton {...defaultProps} />);

    const button = container.firstChild as HTMLElement;
    expect(button).toHaveClass('flex items-center justify-between w-full px-6 py-4 rounded-full');
  });
});
