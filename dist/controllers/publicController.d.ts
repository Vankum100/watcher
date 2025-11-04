import { Request, Response } from 'express';
import { Pool } from 'pg';
export declare class PublicController {
    private pool;
    private watcherLinkRepo;
    private workerRepo;
    private rateLimiter;
    constructor(pool: Pool);
    getDashboard: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=publicController.d.ts.map