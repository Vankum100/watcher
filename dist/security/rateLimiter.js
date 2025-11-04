"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
class RateLimiter {
    constructor() {
        this.requests = new Map();
        this.windowMs = 60 * 1000; // 1 minute
        this.maxRequests = 30;
    }
    checkLimit(token) {
        const now = Date.now();
        const windowStart = now - this.windowMs;
        if (!this.requests.has(token)) {
            this.requests.set(token, []);
        }
        const tokenRequests = this.requests.get(token);
        const recentRequests = tokenRequests.filter(time => time > windowStart);
        if (recentRequests.length >= this.maxRequests) {
            return false;
        }
        recentRequests.push(now);
        this.requests.set(token, recentRequests);
        return true;
    }
    cleanup() {
        const now = Date.now();
        const windowStart = now - this.windowMs;
        for (const [token, requests] of this.requests.entries()) {
            const recentRequests = requests.filter(time => time > windowStart);
            if (recentRequests.length === 0) {
                this.requests.delete(token);
            }
            else {
                this.requests.set(token, recentRequests);
            }
        }
    }
}
exports.RateLimiter = RateLimiter;
