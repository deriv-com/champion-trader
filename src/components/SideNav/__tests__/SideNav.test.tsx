import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { SideNav } from '../SideNav';

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe('SideNav', () => {
  const mockNavigate = jest.fn();
  const mockLocation = { pathname: '/trade' };

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue(mockLocation);
  });

  it('renders navigation buttons', () => {
    render(
      <MemoryRouter>
        <SideNav />
      </MemoryRouter>
    );

    expect(screen.getByText('Trade')).toBeInTheDocument();
    expect(screen.getByText('Positions')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('navigates to correct routes when buttons are clicked', () => {
    render(
      <MemoryRouter>
        <SideNav />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Trade'));
    expect(mockNavigate).toHaveBeenCalledWith('/trade');

    fireEvent.click(screen.getByText('Positions'));
    expect(mockNavigate).toHaveBeenCalledWith('/positions');

    fireEvent.click(screen.getByText('Menu'));
    expect(mockNavigate).toHaveBeenCalledWith('/menu');
  });

  it('highlights active route', () => {
    render(
      <MemoryRouter>
        <SideNav />
      </MemoryRouter>
    );

    const tradeButton = screen.getByText('Trade').parentElement;
    expect(tradeButton).toHaveClass('text-primary');

    const positionsButton = screen.getByText('Positions').parentElement;
    expect(positionsButton).toHaveClass('text-gray-500');
  });

  it('is hidden in portrait and visible in landscape', () => {
    render(
      <MemoryRouter>
        <SideNav />
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('hidden landscape:flex');
  });
});
