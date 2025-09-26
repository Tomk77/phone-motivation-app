import { Entry } from '../types/models';
import { getDatabaseAdapter } from './database';

export const listEntriesForGoal = async (goalId: string): Promise<Entry[]> => {
  const db = await getDatabaseAdapter();
  return db.getAll<Entry>('SELECT * FROM Entry WHERE goalId = ? ORDER BY dateISO ASC', [goalId]);
};

export const listEntriesBetween = async (
  goalId: string,
  startISO: string,
  endISO: string,
): Promise<Entry[]> => {
  const db = await getDatabaseAdapter();
  return db.getAll<Entry>(
    'SELECT * FROM Entry WHERE goalId = ? AND dateISO BETWEEN ? AND ? ORDER BY dateISO ASC',
    [goalId, startISO, endISO],
  );
};

export const getEntryByDate = async (goalId: string, dateISO: string): Promise<Entry | null> => {
  const db = await getDatabaseAdapter();
  const entry = await db.getFirst<Entry>('SELECT * FROM Entry WHERE goalId = ? AND dateISO = ?', [
    goalId,
    dateISO,
  ]);
  return entry ?? null;
};

export const upsertEntry = async (entry: Entry): Promise<void> => {
  const db = await getDatabaseAdapter();
  await db.run(
    `INSERT INTO Entry (id, goalId, dateISO, completed, note, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        goalId=excluded.goalId,
        dateISO=excluded.dateISO,
        completed=excluded.completed,
        note=excluded.note,
        updatedAt=excluded.updatedAt`,
    [entry.id, entry.goalId, entry.dateISO, entry.completed ? 1 : 0, entry.note ?? null, entry.updatedAt],
  );
};

export const deleteEntry = async (id: string): Promise<void> => {
  const db = await getDatabaseAdapter();
  await db.run('DELETE FROM Entry WHERE id = ?', [id]);
};
