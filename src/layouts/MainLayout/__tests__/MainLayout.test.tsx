import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../MainLayout';
import { useClientStore } from '../../../stores/clientStore';

// Inline renderWithRouter helper for MainLayout tests
const renderWithRouter = (ui: React.ReactElement, initialRoute = '/') => {
  window.history.pushState({}, 'Test page', initialRoute);
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      {ui}
      <Routes>
        <Route path="*" element={<div data-testid="location-display">{window.location.pathname}</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('MainLayout', () => {
  beforeEach(() => {
    // Reset the logged-in state before each test.
    useClientStore.getState().isLoggedIn = false;
  });

  it('renders children content', () => {
    renderWithRouter(<div>Test Content</div>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies correct layout classes', () => {
    const { container } = renderWithRouter(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );
    // Check for base layout classes.
    expect(container.firstChild).toHaveClass('flex');
  });

  it('does not render footer when user is logged out', () => {
    useClientStore.getState().isLoggedIn = false;
    renderWithRouter(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    // In logout view, footer should not be rendered.
    const footer = screen.queryByTestId('footer');
    expect(footer).toBeNull();
  });

  it('renders with footer when user is logged in', () => {
    useClientStore.getState().isLoggedIn = true;
    renderWithRouter(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    // In logged in view, Footer should be rendered.
    const footer = screen.getByTestId('location-display');
    expect(footer).toBeInTheDocument();
  });
});
