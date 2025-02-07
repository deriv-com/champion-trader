import { formatDurationDisplay } from '../duration';

describe('formatDurationDisplay', () => {
  describe('hour format', () => {
    it('formats single hour without minutes', () => {
      expect(formatDurationDisplay('1:0 hour')).toBe('1 hour');
    });

    it('formats multiple hours without minutes', () => {
      expect(formatDurationDisplay('2:0 hour')).toBe('2 hours');
    });

    it('formats single hour with single minute', () => {
      expect(formatDurationDisplay('1:1 hour')).toBe('1 hour 1 minute');
    });

    it('formats single hour with multiple minutes', () => {
      expect(formatDurationDisplay('1:30 hour')).toBe('1 hour 30 minutes');
    });

    it('formats multiple hours with multiple minutes', () => {
      expect(formatDurationDisplay('2:45 hour')).toBe('2 hours 45 minutes');
    });
  });

  describe('tick format', () => {
    it('formats single tick', () => {
      expect(formatDurationDisplay('1 tick')).toBe('1 tick');
    });

    it('formats multiple ticks', () => {
      expect(formatDurationDisplay('5 tick')).toBe('5 ticks');
    });
  });

  describe('second format', () => {
    it('formats single second', () => {
      expect(formatDurationDisplay('1 second')).toBe('1 second');
    });

    it('formats multiple seconds', () => {
      expect(formatDurationDisplay('30 second')).toBe('30 seconds');
    });
  });

  describe('minute format', () => {
    it('formats single minute', () => {
      expect(formatDurationDisplay('1 minute')).toBe('1 minute');
    });

    it('formats multiple minutes', () => {
      expect(formatDurationDisplay('15 minute')).toBe('15 minutes');
    });
  });

  describe('day format', () => {
    it('formats day duration', () => {
      expect(formatDurationDisplay('1 day')).toBe('1 day');
    });
  });

  describe('error handling', () => {
    it('returns original string for unknown duration type', () => {
      const invalidDuration = '5 unknown';
      expect(formatDurationDisplay(invalidDuration)).toBe(invalidDuration);
    });

    it('handles malformed hour format gracefully', () => {
      const malformedDuration = '1: hour';
      expect(formatDurationDisplay(malformedDuration)).toBe('1 hour');
    });
  });
});
