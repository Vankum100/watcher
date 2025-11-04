import { Request, Response } from 'express';
import { Pool } from 'pg';
import { WatcherLinkRepository } from '../repositories/watcherLinkRepository';
import { WorkerRepository } from '../repositories/workerRepository';
import { ETagService } from '../services/etagService';
import { RateLimiter } from '../security/rateLimiter';

export class PublicController {
  private watcherLinkRepo: WatcherLinkRepository;
  private workerRepo: WorkerRepository;
  private rateLimiter: RateLimiter;

  constructor(private pool: Pool) {
    this.watcherLinkRepo = new WatcherLinkRepository(pool);
    this.workerRepo = new WorkerRepository(pool);
    this.rateLimiter = new RateLimiter();
    setInterval(() => this.rateLimiter.cleanup(), 60000);
  }

  getDashboard = async (req: Request, res: Response): Promise<void> => {
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


    const etag = ETagService.generateETag(dashboardData);


    const clientETag = req.headers['if-none-match'];
    if (clientETag === etag) {
      res.status(304).end();
      return;
    }

    res.setHeader('ETag', etag);
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json(dashboardData);
  };
}
