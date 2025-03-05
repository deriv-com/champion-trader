import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Footer } from '../Footer';
import { useClientStore } from '../../../stores/clientStore';

// Inline renderWithRouter helper for Footer tests
const renderWithRouter = (initialRoute = '/') => {
  window.history.pushState({}, 'Test page', initialRoute);
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Footer />
      <Routes>
        <Route path="*" element={<div data-testid="location-display">{window.location.pathname}</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Footer', () => {
  beforeEach(() => {
    // Reset logged-in state before each test.
    useClientStore.getState().isLoggedIn = false;
  });

  it('renders navigation items when user is logged in', () => {
    useClientStore.getState().isLoggedIn = true;
    renderWithRouter();
    // Expect the Footer to render "Trade" and "Positions" buttons.
    expect(screen.getByText('Trade')).toBeInTheDocument();
    expect(screen.getByText('Positions')).toBeInTheDocument();
  });

  it('shows correct active style when route is active and user is logged in', () => {
    useClientStore.getState().isLoggedIn = true;
    // Assume that the active route for the "Trade" button is "/trade".
    renderWithRouter('/trade');
    const tradeButton = screen.getByText('Trade').closest('button');
    expect(tradeButton).toHaveClass('flex flex-col items-center gap-1 font-bold text-white');
  });
});
