import { renderHook, act } from '@testing-library/react-hooks';
import { useTradeStore } from '../tradeStore';

describe('tradeStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useTradeStore());
    act(() => {
      result.current.setStake('10 USD');
      result.current.setDuration('10 tick');
      result.current.toggleAllowEquals();
      result.current.toggleAllowEquals(); // Reset to false
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTradeStore());
    
    expect(result.current.stake).toBe('10 USD');
    expect(result.current.duration).toBe('10 tick');
    expect(result.current.allowEquals).toBe(false);
  });

  it('should update stake', () => {
    const { result } = renderHook(() => useTradeStore());
    
    act(() => {
      result.current.setStake('20 USD');
    });

    expect(result.current.stake).toBe('20 USD');
  });

  it('should update duration', () => {
    const { result } = renderHook(() => useTradeStore());
    
    act(() => {
      result.current.setDuration('20 tick');
    });

    expect(result.current.duration).toBe('20 tick');
  });

  it('should toggle allowEquals', () => {
    const { result } = renderHook(() => useTradeStore());
    
    expect(result.current.allowEquals).toBe(false);

    act(() => {
      result.current.toggleAllowEquals();
    });

    expect(result.current.allowEquals).toBe(true);

    act(() => {
      result.current.toggleAllowEquals();
    });

    expect(result.current.allowEquals).toBe(false);
  });
});
