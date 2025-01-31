import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MenuPage } from '../MenuPage';

describe('MenuPage', () => {
  const renderWithRouter = () => {
    return render(
      <MemoryRouter>
        <MenuPage />
      </MemoryRouter>
    );
  };

  it('renders menu items', () => {
    renderWithRouter();
    
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders page title', () => {
    renderWithRouter();
    
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });
});
