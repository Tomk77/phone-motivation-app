import { upsertEntry, getEntryByDate } from '../repositories/entryRepository';
import { setDatabaseAdapter, DatabaseAdapter } from '../repositories/database';

describe('entryRepository', () => {
  const store: Record<string, any> = {};
  const adapter: DatabaseAdapter = {
    run: async (sql: string, params: any[] = []) => {
      if (sql.trim().startsWith('INSERT INTO Entry')) {
        const [id, goalId, dateISO, completed, note, updatedAt] = params;
        store[id] = { id, goalId, dateISO, completed: completed === 1, note, updatedAt };
      }
      if (sql.trim().startsWith('DELETE FROM Entry')) {
        const [id] = params;
        delete store[id];
      }
    },
    getAll: async () => Object.values(store),
    getFirst: async (_sql: string, params: any[] = []) =>
      Object.values(store).find((item: any) => item.goalId === params[0] && item.dateISO === params[1]),
  };

  beforeAll(() => {
    setDatabaseAdapter(adapter);
  });

  it('persists and reads entries', async () => {
    const entry = {
      id: '1',
      goalId: 'g',
      dateISO: '2025-01-01',
      completed: true,
      note: 'note',
      updatedAt: new Date().toISOString(),
    };
    await upsertEntry(entry);
    expect(Object.keys(store)).toHaveLength(1);
    const fetched = await getEntryByDate('g', '2025-01-01');
    expect(fetched).toMatchObject({ id: '1', completed: true });
  });
});
