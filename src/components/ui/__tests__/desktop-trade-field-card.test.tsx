import React from 'react';
import { render, screen } from '@testing-library/react';
import { DesktopTradeFieldCard } from '../desktop-trade-field-card';

describe('DesktopTradeFieldCard', () => {
  it('should render children', () => {
    render(
      <DesktopTradeFieldCard>
        <div>Child</div>
      </DesktopTradeFieldCard>
    );

    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('should apply className', () => {
    render(
      <DesktopTradeFieldCard className="custom-class">
        <div>Child</div>
      </DesktopTradeFieldCard>
    );

    expect(screen.getByRole('generic')).toHaveClass('custom-class');
  });
});
