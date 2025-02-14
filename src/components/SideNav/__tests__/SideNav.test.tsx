import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SideNav } from '../SideNav';

// Inlined renderWithRouter helper
const renderWithRouter = (initialRoute = '/') => {
  window.history.pushState({}, 'Test page', initialRoute);
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <SideNav 
        setSidebarOpen={jest.fn()} 
        setMenuOpen={jest.fn()} 
        isMenuOpen={false} 
        isSidebarOpen={false}
      />
      <Routes>
        <Route path="*" element={<div data-testid="location-display">{window.location.pathname}</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('SideNav', () => {
  it('renders all navigation items', () => {
    renderWithRouter();
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Trade')).toBeInTheDocument();
  });

  it('navigates correctly when clicking navigation items', () => {
    renderWithRouter();

    fireEvent.click(screen.getByText('Menu'));
    expect(screen.getByTestId('location-display')).toHaveTextContent('/');

    fireEvent.click(screen.getByText('Trade'));
    expect(screen.getByTestId('location-display')).toHaveTextContent('/');
  });
});
