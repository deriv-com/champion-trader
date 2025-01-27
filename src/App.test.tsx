import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';

// Mock BrowserRouter to prevent double Router issue
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock lazy-loaded components
jest.mock('@/screens/TradePage', () => ({
  TradePage: () => <div>Trade Page with Stake</div>
}));

jest.mock('@/screens/PositionsPage', () => ({
  PositionsPage: () => <div>Positions Page</div>
}));

jest.mock('@/screens/MenuPage', () => ({
  MenuPage: () => <div>Menu Page</div>
}));

describe('App', () => {
  const renderWithRouter = (route = '/') => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    );
  };

  it('renders trade page by default', async () => {
    renderWithRouter();
    expect(await screen.findByText('Trade Page with Stake')).toBeInTheDocument();
  });

  it('renders positions page on /positions route', async () => {
    renderWithRouter('/positions');
    expect(await screen.findByText('Positions Page')).toBeInTheDocument();
  });

  it('renders menu page on /menu route', async () => {
    renderWithRouter('/menu');
    expect(await screen.findByText('Menu Page')).toBeInTheDocument();
  });
});
