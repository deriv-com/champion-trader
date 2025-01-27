import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { BottomNav } from '../BottomNav';

// Mock component to track route changes
const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

describe('BottomNav', () => {
  const renderWithRouter = (initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <LocationDisplay />
        <BottomNav />
      </MemoryRouter>
    );
  };

  it('renders navigation buttons', () => {
    renderWithRouter();
    
    expect(screen.getByText('Trade')).toBeInTheDocument();
    expect(screen.getByText('Positions')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('navigates to correct routes when clicked', () => {
    renderWithRouter();
    
    fireEvent.click(screen.getByText('Positions'));
    expect(screen.getByTestId('location-display')).toHaveTextContent('/positions');

    fireEvent.click(screen.getByText('Menu'));
    expect(screen.getByTestId('location-display')).toHaveTextContent('/menu');

    fireEvent.click(screen.getByText('Trade'));
    expect(screen.getByTestId('location-display')).toHaveTextContent('/trade');
  });

  it('applies active styles to current route', () => {
    renderWithRouter('/trade');
    
    const tradeButton = screen.getByText('Trade').closest('button');
    const positionsButton = screen.getByText('Positions').closest('button');
    const menuButton = screen.getByText('Menu').closest('button');

    expect(tradeButton).toHaveClass('text-primary');
    expect(positionsButton).toHaveClass('text-gray-500');
    expect(menuButton).toHaveClass('text-gray-500');
  });
});
