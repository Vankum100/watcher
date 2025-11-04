export declare class RateLimiter {
    private requests;
    private readonly windowMs;
    private readonly maxRequests;
    checkLimit(token: string): boolean;
    cleanup(): void;
}
//# sourceMappingURL=rateLimiter.d.ts.map