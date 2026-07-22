import * as SQLite from 'expo-sqlite';

const DB_NAME = 'geoatlas_cache.db';

export async function initOfflineCache(): Promise<SQLite.SQLiteDatabase | null> {
  try {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS place_cache (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        cached_at INTEGER NOT NULL
      );
    `);
    return db;
  } catch (err) {
    console.warn('SQLite init warning:', err);
    return null;
  }
}

export async function cachePlace(id: string, data: any): Promise<void> {
  try {
    const db = await initOfflineCache();
    if (!db) return;
    const now = Date.now();
    await db.runAsync(
      `INSERT OR REPLACE INTO place_cache (id, data, cached_at) VALUES (?, ?, ?);`,
      [id, JSON.stringify(data), now]
    );
  } catch (err) {
    console.warn('Cache write error:', err);
  }
}

export async function getCachedPlace(id: string, ttlMs: number = 24 * 60 * 60 * 1000): Promise<any | null> {
  try {
    const db = await initOfflineCache();
    if (!db) return null;
    const result: any = await db.getFirstAsync(
      `SELECT data, cached_at FROM place_cache WHERE id = ?;`,
      [id]
    );
    if (!result) return null;

    const age = Date.now() - result.cached_at;
    if (age > ttlMs) {
      // TTL expired
      return null;
    }

    return JSON.parse(result.data);
  } catch (err) {
    console.warn('Cache read error:', err);
    return null;
  }
}
