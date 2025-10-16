# BookTok — Security Checklist (OWASP Top 10–Aligned)

This checklist captures the 10 most critical controls to implement before launch, tailored to BookTok’s stack (React Native + NestJS + Postgres + Mux + AWS).

## A01: Broken Access Control
- Implement
  - Enforce object-level authorization on every read/write (trailers, playlists, profiles).
  - Role-based access (user, creator, moderator, admin) with least privilege; admin behind SSO and IP allowlists.
  - Opaque IDs (UUID/ULID) + strict server-side ownership checks.
  - S3 uploads via short-lived presigned POSTs constrained by MIME/size/path; CloudFront OAC; buckets non-public.
- Why
  - Prevents IDOR, privilege escalation, and unauthorized data access.

## A02: Cryptographic Failures
- Implement
  - TLS 1.2+ everywhere; HSTS; secure cookies; disable weak ciphers; cert transparency monitoring.
  - Encrypt at rest (RDS, S3 SSE-KMS); use KMS; key rotation policy.
  - Secrets in AWS Secrets Manager; never in code/images.
  - If storing passwords (not delegated): Argon2id with strong params, per-user salt.
- Why
  - Protects data in transit/at rest and limits blast radius.

## A03: Injection
- Implement
  - Schema validation (Zod/Joi) with strict allowlists; reject unknown fields.
  - Parameterized queries via ORM; no string concatenation.
  - Sanitize/escape user content (bios, titles, transcripts) and encode on output.
  - Media pipeline: no shell interpolation; allowlist FFmpeg args; isolate workers.
- Why
  - Blocks SQL/NoSQL/command injection and XSS.

## A04: Insecure Design (Abuse Prevention)
- Implement
  - Threat model key flows (register/login/upload/publish/click) with secure defaults (drafts private until publish).
  - Rate limits per-IP/user/endpoint; CAPTCHA on anomalies; device fingerprinting where appropriate.
  - File upload policy: audio-only allowlist, size/duration caps, server-side re-encode, AV scan.
  - Data minimization + retention/deletion SLAs.
- Why
  - Prevents spam, ATO, and media abuse by design.

## A05: Security Misconfiguration
- Implement
  - CORS: restrict to known origins; no wildcards; no auth over HTTP.
  - Web headers (Next.js): CSP (nonces), X-Frame-Options/Frame-Ancestors, Referrer-Policy, X-Content-Type-Options, Permissions-Policy.
  - AWS hardening: private RDS, SG least-access, WAF rules, CloudFront + OAC; no public S3.
  - Disable verbose errors/log PII in prod; remove debug/test routes.
- Why
  - Misconfig is a common root cause of breaches.

## A06: Vulnerable and Outdated Components
- Implement
  - Dependabot/Renovate; SCA (GitHub Advanced Security/Snyk).
  - Pin versions; audit transitive deps; avoid unmaintained libs.
  - Keep RN/Expo SDKs and OS images patched; minimal base images.
- Why
  - Reduces exposure to known CVEs and supply-chain risks.

## A07: Identification & Authentication Failures
- Implement
  - OIDC with PKCE for mobile; short-lived access tokens; rotating refresh tokens; server-side revocation.
  - Secure token storage: iOS Keychain/Android Keystore (expo-secure-store or react-native-keychain).
  - Login defenses: per-IP/user rate limit, progressive delays, captcha on anomalies; enforce email verification before creation.
  - Password reset: single-use short TTL; invalidate sessions post-change; MFA/TOTP for admins/creators optional.
- Why
  - Prevents auth bypass and account takeover.

## A08: Software and Data Integrity Failures
- Implement
  - CI/CD hardening: signed commits, branch protection, mandatory reviews, secret scanning, least-privilege deploy.
  - Build provenance (Sigstore/cosign where possible); immutable images; artifact promotion.
  - Verify webhooks (Mux/Auth0/etc.) with signatures and replay protection; IP allowlists.
  - Media integrity: server-side re-encode audio; strip metadata; checksums.
- Why
  - Stops tampered builds and forged events.

## A09: Security Logging & Monitoring
- Implement
  - Centralized logs (API/workers/CDN/WAF/Auth0) with PII redaction; tamper-evident storage and retention.
  - Audit log key actions: auth changes, role updates, uploads/publishes, moderation, buy/borrow clicks.
  - Alerts: brute-force patterns, token anomalies, upload spikes, sensitive moderation keywords.
  - Incident runbooks: severity matrix, on-call rotation, comms templates.
- Why
  - Enables rapid detection, response, and forensics.

## A10: Server-Side Request Forgery (SSRF)
- Implement
  - Deny-by-default egress; allow only required hosts (Mux, Auth0, Algolia, retailers).
  - Never fetch user-provided URLs server-side; if needed, use a safe proxy that blocks private ranges and enforces size/timeouts.
  - IMDSv2 only; cache external metadata (e.g., Google Books) keyed by safe fields (ISBN).
- Why
  - Prevents internal network exposure and lateral movement.

### Media Flow Hardening (BookTok-specific)
- AV scanning (e.g., ClamAV Lambda); quarantine suspicious files.
- Sandbox FFmpeg in hardened containers/Firecracker; read-only inputs, write-only outputs.
- Signed/expiring playback URLs for private/unlisted content.

### Go/No-Go Pre-Launch Checks
- External pen test with all criticals/highs remediated.
- All endpoints behind rate limiting and WAF; no public S3.
- Secrets rotation test; disaster recovery drill (RDS + S3 restore).
- Synthetic checks verify monitoring/alerts; privacy docs and data rights workflows tested.
