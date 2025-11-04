import { Client } from 'pg';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:password@postgres:5432/watcher'
});

async function runMigrations() {
  try {
    await client.connect();
    console.log('Running migrations...');

    const migrationsDir = join(process.cwd(), 'migrations');
    const files = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`Found ${files.length} migration files:`, files);

    for (const file of files) {
      console.log(`Executing migration: ${file}`);
      const migration = readFileSync(join(migrationsDir, file), 'utf8');
      await client.query(migration);
      console.log(`✓ ${file} completed`);
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
