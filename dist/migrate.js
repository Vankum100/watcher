"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const fs_1 = require("fs");
const path_1 = require("path");
const client = new pg_1.Client({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:password@postgres:5432/watcher'
});
async function runMigrations() {
    try {
        await client.connect();
        console.log('Running migrations...');
        // Get all migration files sorted by name
        const migrationsDir = (0, path_1.join)(process.cwd(), 'migrations');
        const files = (0, fs_1.readdirSync)(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();
        console.log(`Found ${files.length} migration files:`, files);
        for (const file of files) {
            console.log(`Executing migration: ${file}`);
            const migration = (0, fs_1.readFileSync)((0, path_1.join)(migrationsDir, file), 'utf8');
            await client.query(migration);
            console.log(`✓ ${file} completed`);
        }
        console.log('All migrations completed successfully');
    }
    catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
    finally {
        await client.end();
    }
}
runMigrations();
