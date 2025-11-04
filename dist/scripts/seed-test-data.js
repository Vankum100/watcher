"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTestData = seedTestData;
const pg_1 = require("pg");
const tokenService_1 = require("../security/tokenService");
async function seedTestData() {
    const pool = new pg_1.Pool({
        connectionString: process.env.DATABASE_URL || 'postgres://postgres:password@postgres:5432/watcher'
    });
    try {
        await pool.connect();
        console.log('Seeding test data...');
        // Generate token
        const token = tokenService_1.TokenService.generateToken();
        console.log('Generated token:', token);
        const validation = tokenService_1.TokenService.validateToken(token);
        if (!validation.valid || !validation.payload) {
            throw new Error('Failed to generate valid token');
        }
        const payloadHash = tokenService_1.TokenService.hashPayload(validation.payload);
        const userId = '550e8400-e29b-41d4-a716-446655440000';
        // Check if watcher link already exists for this user
        const existingLink = await pool.query('SELECT id FROM watcher_links WHERE user_id = $1', [userId]);
        if (existingLink.rows.length === 0) {
            // Insert watcher link
            await pool.query(`
        INSERT INTO watcher_links (user_id, payload_hash, scope, expires_at)
        VALUES ($1, $2, 'dashboard', NOW() + INTERVAL '1 year')
      `, [userId, payloadHash]);
            console.log('✅ Watcher link created');
        }
        else {
            console.log('✅ Watcher link already exists');
        }
        // Check if workers already exist for this user
        const existingWorkers = await pool.query('SELECT id FROM workers WHERE user_id = $1', [userId]);
        if (existingWorkers.rows.length === 0) {
            // Insert workers
            await pool.query(`
        INSERT INTO workers (user_id, name, last_seen_at, hashrate_mh, status) VALUES 
        ($1, 'worker-1', NOW(), 1500000.123, 'online'),
        ($1, 'worker-2', NOW() - INTERVAL '5 minutes', 800000.456, 'offline'),
        ($1, 'worker-3', NOW() - INTERVAL '1 hour', 2000000.789, 'online'),
        ($1, 'worker-4', NOW() - INTERVAL '1 day', 500000.111, 'inactive')
      `, [userId]);
            console.log('✅ Test workers created');
        }
        else {
            console.log('✅ Test workers already exist');
        }
        console.log('');
        console.log('🎉 Test data seeded successfully!');
        console.log('');
        console.log('📋 Test URL:');
        console.log(`   http://localhost:3000/public/w/${token}/dashboard`);
        console.log('');
        console.log('🔧 Test with curl:');
        console.log(`   curl -v "http://localhost:3000/public/w/${token}/dashboard"`);
        return token;
    }
    catch (error) {
        console.error('Error seeding test data:', error);
        throw error;
    }
    finally {
        await pool.end();
    }
}
if (require.main === module) {
    seedTestData().catch(console.error);
}
