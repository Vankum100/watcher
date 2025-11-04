"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerRepository = void 0;
class WorkerRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async findByUserId(userId) {
        const result = await this.pool.query(`
      SELECT id, user_id, name, last_seen_at, hashrate_mh, status
      FROM workers 
      WHERE user_id = $1
      ORDER BY hashrate_mh DESC, name ASC, id ASC
    `, [userId]);
        return result.rows;
    }
    async getDashboardData(userId) {
        const workers = await this.findByUserId(userId);
        // Initialize accumulator with proper values
        const agg = workers.reduce((acc, worker) => {
            acc[worker.status] = (acc[worker.status] || 0) + 1;
            acc.totalHashrate = (acc.totalHashrate || 0) + Number(worker.hashrate_mh);
            return acc;
        }, {
            online: 0,
            offline: 0,
            inactive: 0,
            totalHashrate: 0
        });
        const formattedWorkers = workers.map(worker => ({
            id: worker.id,
            name: worker.name,
            status: worker.status,
            last_seen_at: worker.last_seen_at.toISOString(),
            hashrate_th: (Number(worker.hashrate_mh) / 1000000).toFixed(3)
        }));
        return {
            workers: formattedWorkers,
            agg: {
                online: agg.online,
                offline: agg.offline,
                inactive: agg.inactive,
                total_hashrate_th: (agg.totalHashrate / 1000000).toFixed(3)
            }
        };
    }
}
exports.WorkerRepository = WorkerRepository;
