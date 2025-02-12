import { render, screen } from '@testing-library/react';
import { DurationOptions } from '../DurationOptions';

describe('DurationOptions', () => {
  it('renders duration buttons', () => {
    render(<DurationOptions />);
    
    expect(screen.getByText('1t')).toBeInTheDocument();
    expect(screen.getByText('1m')).toBeInTheDocument();
    expect(screen.getByText('2m')).toBeInTheDocument();
    expect(screen.getByText('3m')).toBeInTheDocument();
    expect(screen.getByText('5m')).toBeInTheDocument();
    expect(screen.getByText('10m')).toBeInTheDocument();
    expect(screen.getByText('15m')).toBeInTheDocument();
    expect(screen.getByText('30m')).toBeInTheDocument();
  });

  it('renders chart control buttons', () => {
    render(<DurationOptions />);
    
    expect(screen.getByRole('button', { name: /chart/i })).toBeInTheDocument();
  });
});
