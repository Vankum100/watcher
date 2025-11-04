"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const crypto_1 = require("crypto");
class TokenService {
    static generateToken() {
        const payload = (0, crypto_1.randomBytes)(16);
        const checksum = this.doubleSha256(payload).slice(0, 4);
        const combined = Buffer.concat([payload, checksum]);
        return this.base58Encode(combined);
    }
    static validateToken(token) {
        try {
            const decoded = this.base58Decode(token);
            if (decoded.length !== 20)
                return { valid: false }; // 16 bytes payload + 4 bytes checksum
            const payload = decoded.slice(0, 16);
            const checksum = decoded.slice(16);
            const expectedChecksum = this.doubleSha256(payload).slice(0, 4);
            if (!checksum.equals(expectedChecksum)) {
                return { valid: false };
            }
            return { valid: true, payload };
        }
        catch {
            return { valid: false };
        }
    }
    static hashPayload(payload) {
        return (0, crypto_1.createHash)('sha256').update(payload).digest();
    }
    static doubleSha256(data) {
        return (0, crypto_1.createHash)('sha256').update((0, crypto_1.createHash)('sha256').update(data).digest()).digest();
    }
    static base58Encode(buffer) {
        let num = BigInt('0x' + buffer.toString('hex'));
        let result = '';
        while (num > 0) {
            const remainder = Number(num % 58n);
            num = num / 58n;
            result = this.BASE58_ALPHABET[remainder] + result;
        }
        // Add leading '1's for each leading zero byte
        for (let i = 0; i < buffer.length; i++) {
            if (buffer[i] === 0) {
                result = '1' + result;
            }
            else {
                break;
            }
        }
        return result;
    }
    static base58Decode(encoded) {
        let num = 0n;
        for (let i = 0; i < encoded.length; i++) {
            const char = encoded[i];
            const digit = this.BASE58_ALPHABET.indexOf(char);
            if (digit === -1)
                throw new Error('Invalid Base58 character');
            num = num * 58n + BigInt(digit);
        }
        // Convert to hex
        let hex = num.toString(16);
        // Add leading zeros if needed
        if (hex.length % 2 !== 0) {
            hex = '0' + hex;
        }
        // Add leading zero bytes for each leading '1' in the encoded string
        let leadingZeros = 0;
        for (let i = 0; i < encoded.length && encoded[i] === '1'; i++) {
            leadingZeros++;
        }
        if (leadingZeros > 0) {
            hex = '00'.repeat(leadingZeros) + hex;
        }
        return Buffer.from(hex, 'hex');
    }
}
exports.TokenService = TokenService;
TokenService.BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
