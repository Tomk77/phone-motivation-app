export const openDatabaseAsync = async () => ({
  runAsync: async () => undefined,
  getAllAsync: async () => [],
  getFirstAsync: async () => null,
});
export type SQLiteDatabase = Awaited<ReturnType<typeof openDatabaseAsync>>;
