import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TradeButton } from '../TradeButton';

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// Mock orientation store
jest.mock('@/stores/orientationStore', () => ({
  useOrientationStore: () => ({
    isLandscape: false
  })
}));

describe('TradeButton', () => {
  const defaultProps = {
    title: 'Rise',
    label: 'Payout',
    value: '19.55 USD',
    title_position: 'left' as const,
  };

  it('renders with left position', () => {
    render(<TradeButton {...defaultProps} />);

    expect(screen.getByText('Rise')).toBeInTheDocument();
    expect(screen.getByText('Payout')).toBeInTheDocument();
    expect(screen.getByText('19.55 USD')).toBeInTheDocument();
  });

  it('renders with right position', () => {
    render(
      <TradeButton
        {...defaultProps}
        title="Fall"
        title_position="right"
      />
    );

    expect(screen.getByText('Fall')).toBeInTheDocument();
    expect(screen.getByText('Payout')).toBeInTheDocument();
    expect(screen.getByText('19.55 USD')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <TradeButton
        {...defaultProps}
        className="bg-teal-500"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-teal-500');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<TradeButton {...defaultProps} onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard interactions', async () => {
    const handleClick = jest.fn();
    render(<TradeButton {...defaultProps} onClick={handleClick} />);

    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('maintains text color and font styles', () => {
    render(<TradeButton {...defaultProps} />);

    const title = screen.getByText('Rise');
    const label = screen.getByText('Payout');
    const value = screen.getByText('19.55 USD');

    expect(title).toHaveClass('font-bold');
    expect(label).toHaveClass('opacity-80');
    expect(value).toBeInTheDocument();
  });

  it('maintains layout and spacing', () => {
    const { container } = render(<TradeButton {...defaultProps} />);

    const button = container.firstChild as HTMLElement;
    expect(button).toHaveClass('flex-1');
    expect(button).toHaveClass('rounded-full');
    expect(button).toHaveClass('text-white');
  });

  it('shows loading spinner when loading prop is true', () => {
    render(<TradeButton {...defaultProps} loading={true} />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  it('is disabled when disabled prop is true', () => {
    render(<TradeButton {...defaultProps} disabled={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('shows tooltip on hover when there is an Event error', async () => {
    const error = new Event('error');
    render(<TradeButton {...defaultProps} error={error} />);
    
    const button = screen.getByRole('button');
    await userEvent.hover(button);
    
    await waitFor(() => {
      expect(screen.getAllByText('Failed to get price')[0]).toBeInTheDocument();
    });
  });

  it('shows tooltip on hover when there is a WebSocket error', async () => {
    const error = { error: 'Connection failed' };
    render(<TradeButton {...defaultProps} error={error} />);
    
    const button = screen.getByRole('button');
    await userEvent.hover(button);
    
    await waitFor(() => {
      expect(screen.getAllByText('Connection failed')[0]).toBeInTheDocument();
    });
  });

  it('does not show tooltip when there is no error', async () => {
    render(<TradeButton {...defaultProps} error={null} />);
    
    const button = screen.getByRole('button');
    await userEvent.hover(button);
    
    await waitFor(() => {
      expect(screen.queryByText('Failed to get price')).not.toBeInTheDocument();
      expect(screen.queryByText('Connection failed')).not.toBeInTheDocument();
    });
  });
});
