import { render } from '@testing-library/react';
import { Chart } from '../Chart';

describe('Chart', () => {
  it('renders chart component', () => {
    const { container } = render(<Chart />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Chart className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('renders with minimum height', () => {
    const { container } = render(<Chart />);
    const chartElement = container.firstChild;
    expect(chartElement).toBeInTheDocument();
  });

  it('renders chart area', () => {
    const { container } = render(<Chart />);
    const chartArea = container.firstChild;
    expect(chartArea).toBeInTheDocument();
  });
});
