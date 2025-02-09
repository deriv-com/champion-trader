import { render, screen } from '@testing-library/react';
import { DurationValueList } from '../DurationValueList';

// Mock ScrollSelect component
jest.mock('@/components/ui/scroll-select', () => ({
  ScrollSelect: ({ options, selectedValue }: any) => (
    <div 
      data-testid="scroll-select" 
      data-options={JSON.stringify(options)} 
      data-selected={selectedValue}
    >
      {options.map((opt: any) => (
        <div key={opt.value}>{opt.label}</div>
      ))}
    </div>
  ),
}));

describe('DurationValueList', () => {
  const defaultProps = {
    selectedValue: 1,
    durationType: 'tick' as const,
    onValueSelect: jest.fn(),
    onValueClick: jest.fn(),
    getDurationValues: () => [1, 2, 3],
  };

  beforeEach(() => {
    defaultProps.onValueSelect.mockClear();
    defaultProps.onValueClick.mockClear();
  });

  it('formats tick values correctly', () => {
    render(<DurationValueList {...defaultProps} />);
    
    expect(screen.getByText('1 tick')).toBeInTheDocument();
    expect(screen.getByText('2 ticks')).toBeInTheDocument();
    expect(screen.getByText('3 ticks')).toBeInTheDocument();
  });

  it('formats minute values correctly', () => {
    render(
      <DurationValueList
        {...defaultProps}
        durationType="minute"
        getDurationValues={() => [1, 2, 5]}
      />
    );

    expect(screen.getByText('1 minute')).toBeInTheDocument();
    expect(screen.getByText('2 minutes')).toBeInTheDocument();
    expect(screen.getByText('5 minutes')).toBeInTheDocument();
  });

  it('formats day values without pluralization', () => {
    render(
      <DurationValueList
        {...defaultProps}
        durationType="day"
        getDurationValues={() => [1, 2]}
      />
    );

    expect(screen.getByText('1 day')).toBeInTheDocument();
    expect(screen.getByText('2 day')).toBeInTheDocument();
  });

  it('passes correct props to ScrollSelect', () => {
    render(<DurationValueList {...defaultProps} />);
    
    const scrollSelect = screen.getByTestId('scroll-select');
    const options = JSON.parse(scrollSelect.getAttribute('data-options') || '[]');
    
    expect(options).toEqual([
      { value: 1, label: '1 tick' },
      { value: 2, label: '2 ticks' },
      { value: 3, label: '3 ticks' }
    ]);
    expect(scrollSelect.getAttribute('data-selected')).toBe('1');
  });
});
