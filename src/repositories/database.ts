import * as SQLite from 'expo-sqlite/next';

export interface DatabaseAdapter {
  run(sql: string, params?: any[]): Promise<void>;
  getAll<T = any>(sql: string, params?: any[]): Promise<T[]>;
  getFirst<T = any>(sql: string, params?: any[]): Promise<T | undefined>;
}

class ExpoSQLiteAdapter implements DatabaseAdapter {
  constructor(private readonly db: SQLite.SQLiteDatabase) {}

  async run(sql: string, params: any[] = []): Promise<void> {
    await this.db.runAsync(sql, params);
  }

  async getAll<T>(sql: string, params: any[] = []): Promise<T[]> {
    const result = await this.db.getAllAsync<T>(sql, params);
    return result;
  }

  async getFirst<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    const result = await this.db.getFirstAsync<T>(sql, params);
    return result ?? undefined;
  }
}

let adapter: DatabaseAdapter | null = null;

export const setDatabaseAdapter = (mock: DatabaseAdapter | null) => {
  adapter = mock;
};

export const getDatabaseAdapter = async (): Promise<DatabaseAdapter> => {
  if (adapter) {
    return adapter;
  }
  const db = await SQLite.openDatabaseAsync('crossday.db');
  adapter = new ExpoSQLiteAdapter(db);
  await runMigrations(adapter);
  return adapter;
};

export const runMigrations = async (db: DatabaseAdapter): Promise<void> => {
  await db.run(
    `CREATE TABLE IF NOT EXISTS Goal (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )`,
  );
  await db.run(
    `CREATE TABLE IF NOT EXISTS Entry (
        id TEXT PRIMARY KEY NOT NULL,
        goalId TEXT NOT NULL,
        dateISO TEXT NOT NULL,
        completed INTEGER NOT NULL,
        note TEXT,
        updatedAt TEXT NOT NULL,
        UNIQUE(goalId, dateISO)
      )`,
  );
  await db.run(
    `CREATE TABLE IF NOT EXISTS Settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      )`,
  );
};

export const clearDatabase = async (): Promise<void> => {
  const db = await getDatabaseAdapter();
  await db.run('DELETE FROM Goal');
  await db.run('DELETE FROM Entry');
  await db.run('DELETE FROM Settings');
};
