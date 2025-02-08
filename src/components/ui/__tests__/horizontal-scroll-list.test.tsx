import { render, screen } from '@testing-library/react';
import { HorizontalScrollList } from '../horizontal-scroll-list';

describe('HorizontalScrollList', () => {
  it('should render children', () => {
    render(
      <HorizontalScrollList>
        <div>Child 1</div>
        <div>Child 2</div>
      </HorizontalScrollList>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('should apply className', () => {
    render(
      <HorizontalScrollList className="custom-class">
        <div>Child</div>
      </HorizontalScrollList>
    );

    expect(screen.getByRole('list')).toHaveClass('custom-class');
  });
});
