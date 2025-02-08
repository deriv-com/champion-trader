import React from 'react';
import { render, screen } from '@testing-library/react';
import { MobileTradeFieldCard } from '../mobile-trade-field-card';

describe('MobileTradeFieldCard', () => {
  it('should render children', () => {
    render(
      <MobileTradeFieldCard>
        <div>Child</div>
      </MobileTradeFieldCard>
    );

    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('should apply className', () => {
    render(
      <MobileTradeFieldCard className="custom-class">
        <div>Child</div>
      </MobileTradeFieldCard>
    );

    expect(screen.getByRole('generic')).toHaveClass('custom-class');
  });
});
