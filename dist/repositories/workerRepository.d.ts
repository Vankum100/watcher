import { Pool } from 'pg';
import { Worker, DashboardResponse } from '../domain/types.js';
export declare class WorkerRepository {
    private pool;
    constructor(pool: Pool);
    findByUserId(userId: string): Promise<Worker[]>;
    getDashboardData(userId: string): Promise<DashboardResponse>;
}
//# sourceMappingURL=workerRepository.d.ts.map