import { renderHook, act } from '@testing-library/react-hooks';
import { useTradeStore } from '../tradeStore';

describe('tradeStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useTradeStore());
    act(() => {
      result.current.setStake('10');
      result.current.setDuration('1 minute');
      result.current.toggleAllowEquals();
      result.current.toggleAllowEquals(); // Reset to false
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTradeStore());
    
    expect(result.current.stake).toBe('10');
    expect(result.current.duration).toBe('1 minute');
    expect(result.current.allowEquals).toBe(false);
    expect(result.current.trade_type).toBe('rise_fall');
    expect(result.current.instrument).toBe('R_100');
  });

  it('should update stake', () => {
    const { result } = renderHook(() => useTradeStore());
    
    act(() => {
      result.current.setStake('20');
    });

    expect(result.current.stake).toBe('20');
  });

  it('should update duration', () => {
    const { result } = renderHook(() => useTradeStore());
    
    act(() => {
      result.current.setDuration('2 minute');
    });

    expect(result.current.duration).toBe('2 minute');
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

  it('should update instrument', () => {
    const { result } = renderHook(() => useTradeStore());
    
    act(() => {
      result.current.setInstrument('1HZ100V');
    });

    expect(result.current.instrument).toBe('1HZ100V');
  });

  it('should update trade type and reset payouts', () => {
    const { result } = renderHook(() => useTradeStore());
    
    act(() => {
      result.current.setTradeType('rise_fall');
    });

    expect(result.current.trade_type).toBe('rise_fall');
    expect(result.current.payouts).toEqual({
      max: 50000,
      values: {
        buy_rise: 0,
        buy_fall: 0,
      },
    });
  });

  it('should update payouts', () => {
    const { result } = renderHook(() => useTradeStore());
    
    const newPayouts = {
      max: 50000,
      values: {
        buy_rise: 95,
        buy_fall: 95,
      },
    };

    act(() => {
      result.current.setPayouts(newPayouts);
    });

    expect(result.current.payouts).toEqual(newPayouts);
  });
});
