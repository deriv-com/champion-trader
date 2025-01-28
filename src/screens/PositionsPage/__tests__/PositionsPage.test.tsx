import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PositionsPage } from '../PositionsPage';

describe('PositionsPage', () => {
  const renderWithRouter = () => {
    return render(
      <MemoryRouter>
        <PositionsPage />
      </MemoryRouter>
    );
  };

  it('renders page title', () => {
    renderWithRouter();
    
    expect(screen.getByText('Positions')).toBeInTheDocument();
  });

  it('renders empty state message', () => {
    renderWithRouter();
    
    expect(screen.getByText('No open positions')).toBeInTheDocument();
  });
});
