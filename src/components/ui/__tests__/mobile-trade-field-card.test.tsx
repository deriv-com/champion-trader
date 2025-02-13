import { render, screen, fireEvent } from '@testing-library/react';
import { MobileTradeFieldCard } from '../mobile-trade-field-card';

describe('MobileTradeFieldCard', () => {
  it('renders children correctly', () => {
    render(
      <MobileTradeFieldCard>
        <div>Test Content</div>
      </MobileTradeFieldCard>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className while preserving default styles', () => {
    const { container } = render(
      <MobileTradeFieldCard className="custom-class">
        <div>Content</div>
      </MobileTradeFieldCard>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('bg-black/[0.04]', 'rounded-lg', 'py-2', 'px-4', 'cursor-pointer');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(
      <MobileTradeFieldCard onClick={handleClick}>
        <div>Clickable Content</div>
      </MobileTradeFieldCard>
    );

    fireEvent.click(screen.getByText('Clickable Content'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
