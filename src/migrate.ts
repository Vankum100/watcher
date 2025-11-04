import { Client } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/watcher'
});

async function runMigrations() {
  try {
    await client.connect();
    console.log('Running migrations...');

    const migration = readFileSync(join(process.cwd(), 'migrations', '001_initial_schema.sql'), 'utf8');
    await client.query(migration);

    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
