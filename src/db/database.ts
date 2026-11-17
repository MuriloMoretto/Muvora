import * as SQLite from 'expo-sqlite';

const DB_NAME = 'muvora.db';
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Abre o banco (uma única vez) e aplica as migrações. */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await migrate(db);
      return db;
    })();
  }
  return dbPromise;
}

const LATEST_VERSION = 1;

async function migrate(db: SQLite.SQLiteDatabase) {
  await db.execAsync('PRAGMA journal_mode = WAL;');
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const current = row?.user_version ?? 0;
  if (current >= LATEST_VERSION) return;

  if (current < 1) {
    await db.execAsync(`
      CREATE TABLE important_dates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'pessoal',
        notes TEXT,
        repeats_yearly INTEGER NOT NULL DEFAULT 0,
        remind_days_before INTEGER NOT NULL DEFAULT 1,
        notification_id TEXT
      );
      CREATE TABLE tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL DEFAULT 'pessoal',
        due_at TEXT,
        done INTEGER NOT NULL DEFAULT 0,
        remind_minutes_before INTEGER NOT NULL DEFAULT 30,
        notification_id TEXT
      );
    `);
  }
  await db.execAsync(`PRAGMA user_version = ${LATEST_VERSION};`);
}
