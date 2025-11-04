"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicController = void 0;
const watcherLinkRepository_1 = require("../repositories/watcherLinkRepository");
const workerRepository_1 = require("../repositories/workerRepository");
const etagService_1 = require("../services/etagService");
const rateLimiter_1 = require("../security/rateLimiter");
class PublicController {
    constructor(pool) {
        this.pool = pool;
        this.getDashboard = async (req, res) => {
            const { token } = req.params;
            if (!this.rateLimiter.checkLimit(token)) {
                res.status(429).json({ error: 'Rate limit exceeded' });
                return;
            }
            const watcherLink = await this.watcherLinkRepo.findByToken(token);
            if (!watcherLink) {
                res.status(404).json({ error: 'Not found' });
                return;
            }
            const dashboardData = await this.workerRepo.getDashboardData(watcherLink.user_id);
            const etag = etagService_1.ETagService.generateETag(dashboardData);
            const clientETag = req.headers['if-none-match'];
            if (clientETag === etag) {
                res.status(304).end();
                return;
            }
            res.setHeader('ETag', etag);
            res.setHeader('Cache-Control', 'no-cache');
            res.status(200).json(dashboardData);
        };
        this.watcherLinkRepo = new watcherLinkRepository_1.WatcherLinkRepository(pool);
        this.workerRepo = new workerRepository_1.WorkerRepository(pool);
        this.rateLimiter = new rateLimiter_1.RateLimiter();
        setInterval(() => this.rateLimiter.cleanup(), 60000);
    }
}
exports.PublicController = PublicController;
