import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from '../Footer';

describe('Footer', () => {
  const renderWithRouter = (route = '/') => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Footer />
      </MemoryRouter>
    );
  };

  it('renders navigation items', () => {
    renderWithRouter();
    
    expect(screen.getByRole('button', { name: /trade/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /positions/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });

  it('shows correct active states based on route', () => {
    renderWithRouter('/positions');
    
    const tradeButton = screen.getByRole('button', { name: /trade/i });
    const positionsButton = screen.getByRole('button', { name: /positions/i });
    const menuButton = screen.getByRole('button', { name: /menu/i });

    expect(tradeButton).toHaveClass('text-gray-500');
    expect(positionsButton).toHaveClass('text-primary');
    expect(menuButton).toHaveClass('text-gray-500');
  });

  it('renders navigation icons', () => {
    renderWithRouter();
    
    const tradeButton = screen.getByRole('button', { name: /trade/i });
    const positionsButton = screen.getByRole('button', { name: /positions/i });
    const menuButton = screen.getByRole('button', { name: /menu/i });

    expect(tradeButton.querySelector('svg')).toBeInTheDocument();
    expect(positionsButton.querySelector('svg')).toBeInTheDocument();
    expect(menuButton.querySelector('svg')).toBeInTheDocument();
  });
});
