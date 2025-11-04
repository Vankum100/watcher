"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETagService = void 0;
const crypto_1 = require("crypto");
class ETagService {
    static generateETag(data) {
        const canonicalData = this.normalizeForETag(data);
        const jsonString = JSON.stringify(canonicalData);
        return (0, crypto_1.createHash)('sha256').update(jsonString).digest('hex');
    }
    static normalizeForETag(data) {
        const normalizedWorkers = data.workers.map(worker => ({
            ...worker,
            last_seen_at: this.normalizeTimestamp(worker.last_seen_at)
        }));
        return {
            agg: this.sortObjectKeys(data.agg),
            workers: normalizedWorkers.map(worker => this.sortObjectKeys(worker))
        };
    }
    static normalizeTimestamp(timestamp) {
        const date = new Date(timestamp);
        date.setSeconds(0, 0);
        return date.toISOString();
    }
    static sortObjectKeys(obj) {
        return Object.keys(obj).sort().reduce((sorted, key) => {
            sorted[key] = obj[key];
            return sorted;
        }, {});
    }
}
exports.ETagService = ETagService;
