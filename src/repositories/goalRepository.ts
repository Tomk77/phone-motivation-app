import { Goal } from '../types/models';
import { getDatabaseAdapter } from './database';

export const fetchGoal = async (): Promise<Goal | null> => {
  const db = await getDatabaseAdapter();
  const goal = await db.getFirst<Goal>('SELECT * FROM Goal LIMIT 1');
  return goal ?? null;
};

export const upsertGoal = async (goal: Goal): Promise<void> => {
  const db = await getDatabaseAdapter();
  await db.run(
    `INSERT INTO Goal (id, name, createdAt) VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET name=excluded.name, createdAt=excluded.createdAt`,
    [goal.id, goal.name, goal.createdAt],
  );
};

export const deleteGoal = async (): Promise<void> => {
  const db = await getDatabaseAdapter();
  await db.run('DELETE FROM Goal');
};
