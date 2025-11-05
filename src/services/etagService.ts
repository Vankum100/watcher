import { createHash } from 'crypto';
import { DashboardResponse } from '../domain/types';

export class ETagService {
  static generateETag(data: DashboardResponse): string {
    const canonicalData = this.normalizeForETag(data);
    const jsonString = JSON.stringify(canonicalData);
    return createHash('sha256').update(jsonString).digest('hex');
  }

  private static normalizeForETag(data: DashboardResponse): any {
    const normalizedWorkers = data.workers.map(worker => ({
      ...worker,
      last_seen_at: this.normalizeTimestamp(worker.last_seen_at)
    }));

    return {
      agg: this.sortObjectKeys(data.agg),
      workers: normalizedWorkers.map(worker => this.sortObjectKeys(worker))
    };
  }

  private static normalizeTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const roundedMinutes = Math.floor(date.getTime() / 60000) * 60000;
    return String(roundedMinutes);
  }

  private static sortObjectKeys(obj: Record<string, any>): Record<string, any> {
    return Object.keys(obj).sort().reduce((sorted, key) => {
      sorted[key] = obj[key];
      return sorted;
    }, {} as Record<string, any>);
  }
}
