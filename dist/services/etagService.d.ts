import { DashboardResponse } from '../domain/types.js';
export declare class ETagService {
    static generateETag(data: DashboardResponse): string;
    private static normalizeForETag;
    private static normalizeTimestamp;
    private static sortObjectKeys;
}
//# sourceMappingURL=etagService.d.ts.map