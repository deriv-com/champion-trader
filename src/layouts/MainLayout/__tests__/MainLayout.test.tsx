import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MainLayout } from '../MainLayout';

describe('MainLayout', () => {
  const renderWithRouter = (children: React.ReactNode) => {
    return render(
      <MemoryRouter>
        <MainLayout>{children}</MainLayout>
      </MemoryRouter>
    );
  };

  it('renders children content', () => {
    renderWithRouter(<div>Test Content</div>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies correct layout classes', () => {
    renderWithRouter(<div>Test Content</div>);
    const container = screen.getByText('Test Content').parentElement?.parentElement;
    expect(container).toHaveClass('flex flex-col flex-1');
  });

  it('renders with footer', () => {
    renderWithRouter(<div>Test Content</div>);
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('border-t');
  });
});
