"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatcherLinkRepository = void 0;
const tokenService_1 = require("../security/tokenService");
class WatcherLinkRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async findByToken(token) {
        const validation = tokenService_1.TokenService.validateToken(token);
        if (!validation.valid || !validation.payload) {
            return null;
        }
        const payloadHash = tokenService_1.TokenService.hashPayload(validation.payload);
        const result = await this.pool.query(`
      SELECT id, user_id, payload_hash, scope, expires_at, revoked_at, created_at
      FROM watcher_links
      WHERE payload_hash = $1
        AND expires_at > NOW()
        AND revoked_at IS NULL
    `, [payloadHash]);
        return result.rows[0] || null;
    }
}
exports.WatcherLinkRepository = WatcherLinkRepository;
