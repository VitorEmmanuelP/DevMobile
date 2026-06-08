import * as SQLite from 'expo-sqlite';

const DB_NAME = 'mensagemmqtt.db';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS settings (
  id          INTEGER PRIMARY KEY CHECK (id = 1),
  nickname    TEXT    NOT NULL,
  broker_host TEXT    NOT NULL,
  broker_port INTEGER NOT NULL,
  use_ssl     INTEGER NOT NULL DEFAULT 1,
  client_id   TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS conversations (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  topic      TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id              TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender          TEXT NOT NULL,
  body            TEXT NOT NULL,
  direction       TEXT NOT NULL CHECK (direction IN ('sent', 'received')),
  created_at      TEXT NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation
  ON messages(conversation_id);
`;

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function open(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  // foreign_keys é por conexão e volta a OFF ao reabrir: ligar sempre (RN06).
  await db.execAsync('PRAGMA foreign_keys = ON;');
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
  if (!row || row.user_version === 0) {
    await db.execAsync(SCHEMA);
    await db.execAsync('PRAGMA user_version = 1;');
  }
  return db;
}

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = open();
  }
  return dbPromise;
}
