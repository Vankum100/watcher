export declare class TokenService {
    static generateToken(): string;
    static validateToken(token: string): {
        valid: boolean;
        payload?: Buffer;
    };
    static hashPayload(payload: Buffer): Buffer;
}
//# sourceMappingURL=tokenService.d.ts.map