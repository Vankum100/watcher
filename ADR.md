# ADR: Security-First Token Architecture

## Context
The project required secure public links with strict time constraints (4 hours). While the specification outlined Base58Check tokens, it didn't specify implementation details for enterprise-grade security.

## Key Security Decisions

### 1. Hash-Only Token Storage
**Decision**: Store only SHA256(payload) in database, never the actual token.

**Rationale**:
- Prevents token exposure in database breaches
- Follows password storage best practices
- Maintains verification capability without plaintext storage

**Consequence**: Tokens become single-use - if lost, cannot be recovered from database.

### 2. Uniform 404 Error Strategy
**Decision**: Return 404 for all token validation failures (invalid, expired, revoked).

**Rationale**:
- Prevents timing attacks and token enumeration
- Eliminates information leakage about token state
- Consistent with security-through-obscurity principle

### 3. Custom Base58Check Implementation
**Decision**: Implement Base58Check algorithm rather than using external library.

**Rationale**:
- Eliminates dependency vulnerabilities
- Full control over cryptographic operations
- Reduced attack surface from third-party code

### 4. Time-Insensitive ETag Calculation
**Decision**: Ignore last_seen_at changes under 60 seconds in ETag generation.

**Rationale**:
- Prevents cache thrashing from minor time fluctuations
- Maintains data consistency while optimizing caching
- Balances accuracy with performance

## Trade-offs
- **Development Speed**: Custom implementations took longer but provided security control
- **Operational Complexity**: Hash-only storage requires careful token management
- **Cache Accuracy**: ETag time tolerance sacrifices minor accuracy for major performance gains

## Security Outcome
The architecture provides defense-in-depth: tokens are protected at storage, transmission, and validation layers while maintaining system performance and developer experience within tight time constraints.
