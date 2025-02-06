export const getDurationValues = (type: string): number[] => {
  switch (type) {
    case 'tick':
      return [1, 2, 3, 4, 5];
    case 'second':
      return Array.from({ length: 60 }, (_, i) => i + 1);
    case 'minute':
      return [1, 2, 3, 5, 10, 15, 30];
    case 'hour':
      return [1, 2, 3, 4, 6, 8, 12, 24];
    case 'day':
      return [1];
    default:
      return [];
  }
};
