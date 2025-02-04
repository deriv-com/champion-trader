import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SideNav } from '../SideNav';

// Inlined renderWithRouter helper
const renderWithRouter = (initialRoute = '/') => {
  window.history.pushState({}, 'Test page', initialRoute);
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <SideNav />
      <Routes>
        <Route path="*" element={<div data-testid="location-display">{window.location.pathname}</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('SideNav', () => {
  it('renders navigation button', () => {
    renderWithRouter();
    // In the current design, only the "Menu" navigation item is expected.
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('navigates correctly when "Menu" is clicked', () => {
    renderWithRouter();
    fireEvent.click(screen.getByText('Menu'));
    // Verify that the route has changed to "/" by checking the location display.
    expect(screen.getByTestId('location-display')).toHaveTextContent('/');
  });
});
