import { render, screen, fireEvent } from '@testing-library/react';
import { PrimaryButton } from '../primary-button';

describe('PrimaryButton', () => {
  const defaultProps = {
    children: 'Test Button',
  };

  it('renders children correctly', () => {
    render(<PrimaryButton>{defaultProps.children}</PrimaryButton>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<PrimaryButton onClick={handleClick}>{defaultProps.children}</PrimaryButton>);
    fireEvent.click(screen.getByText('Test Button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies hover styles', () => {
    // This test can be enhanced with visual regression tools.
    const { container } = render(<PrimaryButton>{defaultProps.children}</PrimaryButton>);
    const button = container.firstChild as HTMLElement;
    expect(button.className).toContain('hover:bg-black/90');
  });

  it('spreads additional props to button element', () => {
    const { container } = render(
      <PrimaryButton data-testid="custom-button" aria-label="Custom Button">
        {defaultProps.children}
      </PrimaryButton>
    );
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveAttribute('data-testid', 'custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom Button');
  });
});
