import { Pool } from 'pg';
import { WatcherLink } from '../domain/types.js';
export declare class WatcherLinkRepository {
    private pool;
    constructor(pool: Pool);
    findByToken(token: string): Promise<WatcherLink | null>;
}
//# sourceMappingURL=watcherLinkRepository.d.ts.map