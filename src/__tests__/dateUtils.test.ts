import { calculateStreaks, getMonthGrid } from '../utils/date';

describe('date utilities', () => {
  it('produces six week grid', () => {
    const grid = getMonthGrid(new Date(2025, 0, 1));
    expect(grid).toHaveLength(42);
  });

  it('computes streaks', () => {
    const result = calculateStreaks(['2025-01-01', '2025-01-02', '2025-01-03']);
    expect(result.best).toBe(3);
  });
});
