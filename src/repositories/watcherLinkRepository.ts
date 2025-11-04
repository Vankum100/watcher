import { Pool } from 'pg';
import { WatcherLink } from '../domain/types';
import { TokenService } from '../security/tokenService';

export class WatcherLinkRepository {
  constructor(private pool: Pool) {}

  async findByToken(token: string): Promise<WatcherLink | null> {
    const validation = TokenService.validateToken(token);
    if (!validation.valid || !validation.payload) {
      return null;
    }

    const payloadHash = TokenService.hashPayload(validation.payload);

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
