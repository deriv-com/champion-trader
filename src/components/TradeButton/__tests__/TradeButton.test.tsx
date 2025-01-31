import { render, screen } from '@testing-library/react';
import { TradeButton } from '../Button';

describe('TradeButton', () => {
  it('renders with left position', () => {
    render(
      <TradeButton
        title="Rise"
        label="Payout"
        value="19.55 USD"
        title_position="left"
      />
    );

    expect(screen.getByText('Rise')).toBeInTheDocument();
    expect(screen.getByText('Payout')).toBeInTheDocument();
    expect(screen.getByText('19.55 USD')).toBeInTheDocument();
  });

  it('renders with right position', () => {
    render(
      <TradeButton
        title="Fall"
        label="Payout"
        value="19.55 USD"
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
        title="Rise"
        label="Payout"
        value="19.55 USD"
        title_position="left"
        className="bg-teal-500"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-teal-500');
  });
});
