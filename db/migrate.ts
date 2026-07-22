import fs from 'fs';
import path from 'path';
import { pool } from '../services/api/src/db';

async function runMigrations() {
  console.log('Running GeoAtlas SQL database migrations...');
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  const client = await pool.connect();
  try {
    await client.query('BEGIN;');
    for (const file of files) {
      if (file.endsWith('.sql')) {
        console.log(`Applying migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await client.query(sql);
      }
    }
    await client.query('COMMIT;');
    console.log('All migrations applied successfully!');
  } catch (err) {
    await client.query('ROLLBACK;');
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations();
}
