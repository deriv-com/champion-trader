import { render, screen, fireEvent } from '@testing-library/react';
import { PrimaryButton } from '../primary-button';

// Mock the Button component
jest.mock('../button', () => ({
  Button: ({ children, className, ...props }: any) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
}));

describe('PrimaryButton', () => {
  it('renders children correctly', () => {
    render(<PrimaryButton>Test Content</PrimaryButton>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default styles', () => {
    const { container } = render(<PrimaryButton>Test</PrimaryButton>);
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveClass('w-full', 'py-6', 'text-base', 'font-semibold', 'rounded-lg');
  });

  it('merges custom className with default styles', () => {
    const { container } = render(
      <PrimaryButton className="custom-class">Test</PrimaryButton>
    );
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('w-full', 'py-6', 'text-base', 'font-semibold', 'rounded-lg');
  });

  it('passes props to underlying Button component', () => {
    const onClick = jest.fn();
    render(
      <PrimaryButton onClick={onClick} disabled>
        Test
      </PrimaryButton>
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
