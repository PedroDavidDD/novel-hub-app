# Design: OAuth Data-Centric Authentication

## Technical Approach

NestJS becomes the OAuth/BFF authority: controllers translate HTTP, application use cases coordinate provider-neutral ports, and Mongo adapters persist `User`, `AuthIdentity`, `OAuthTransaction`, and `RefreshSession`. Angular only starts login, consumes a sanitized outcome, and bootstraps session state through credentialed requests; JavaScript never receives tokens.

## Architecture Decisions

| Decision | Choice and rationale | Rejected tradeoff |
|---|---|---|
| Provider boundary | `ExternalIdentityProvider` port with `GoogleIdentityProvider` adapter returning `VerifiedIdentity`; preserves Clean/Hexagonal boundaries and makes later providers additive. | SPA verification exposes provider tokens and splits trust. |
| Session transport | Short JWT access cookie plus opaque random refresh cookie, both HttpOnly; access is short-lived, refresh is stored only as a hash. | Web storage/Bearer tokens expose credentials to XSS. |
| CSRF | Exact credentialed CORS allowlist, `Origin`/`Referer` checks on unsafe endpoints, `SameSite=Lax` by default; add double-submit CSRF only when production requires cross-site `SameSite=None`. | Assuming SameSite alone ignores same-site subdomain threats. |
| Error compatibility | Typed `AppError { code, msg, httpStatus }` in `Result`; auth controllers throw/map it to real HTTP status. `ApiResponse` adds optional `code` while retaining legacy `statusCode/data/msg` for non-auth consumers. | Global envelope replacement risks unrelated APIs. |

## Data and Flow

`AuthIdentity`: `provider`, `providerUserId`, `userId`, timestamps; unique `(provider, providerUserId)` and `(userId, provider)`. `OAuthTransaction`: hashed state, PKCE verifier (encrypted/protected), nonce, safe return path, expiry, consumedAt; unique state hash plus TTL. `RefreshSession`: `userId`, `sessionId`, `familyId`, token hash, expiry, revokedAt, replacedBy, bounded device metadata; unique token hash/sessionId, indexes on user/family, TTL on expiry.

```text
Angular -> GET /auth/oauth/google/start?returnTo=/x
Nest -> store one-time transaction -> Google(code+PKCE)
Google -> GET /auth/oauth/google/callback -> verify state/code/nonce/identity
Nest -> resolve identity/user -> create cookies -> 302 /auth/oauth-result?ticket=<opaque>
Angular result -> GET /auth/oauth/outcome?ticket=... -> GET /auth/session -> safe return
```

Start stores the transaction server-side and an HttpOnly correlation cookie. Callback consumes it atomically; invalid, expired, or replayed state yields `AUTH_INVALID_STATE`. The redirect carries only a one-time opaque outcome ticket; consuming it returns real `409/AUTH_EMAIL_ALREADY_EXISTS`, `403/AUTH_USER_INACTIVE`, or provider codes with `msg`, then deletes it. No tokens or claims cross the URL/body boundary.

Refresh hashes the presented cookie, atomically changes one active record to revoked/replaced, inserts its successor in one Mongo transaction, then sets new cookies. A reused revoked token revokes the family and clears cookies. Logout revokes only the current session and clears both cookies.

## Component and File Boundaries

| Area | Files |
|---|---|
| Backend application/domain | Replace `social-login.use-case.ts`; add `start-oauth`, `complete-oauth`, `bootstrap-session`, revised `refresh-token`/`logout`; add entities and repository/provider ports under `src/modules/auth/domain`. |
| Backend adapters | Add Google HTTP/JWKS adapter and Mongo schemas/mappers/repositories under `infrastructure`; wire `auth.module.ts`; update `auth.controller.ts`, `auth.guard.ts`, `jwt-token.service.ts`, `main.ts`, and common Result/response mapping. |
| Angular auth | Replace social claim services with a provider initiation strategy; update `auth.service.ts`, contracts, interceptor, guards, login/register pages; add standalone `oauth-result` page/helper; update `app.routes.ts` and remove root hash parsing/OAuth client configuration. Reuse `ModalAlertService`. |

HttpOnly means Angular cannot read authentication tokens or expiration: `AuthService` holds only user/status signals, `GET /auth/session` is authoritative, the interceptor clones API requests with `withCredentials: true`, coalesces one `POST /auth/refresh` after 401, and never refreshes 403/409 or refresh/logout requests; `POST /auth/logout` clears state after the server clears cookies. Guards await bootstrap rather than storage. Locally, use one host name (`localhost`, not mixed with `127.0.0.1`), host-only non-Secure Lax cookies, and an explicit origin. Production uses HTTPS, Secure cookies, omitted Domain where possible, access `Path=/`, refresh `Path=/auth`, and coordinated frontend/API domains.

## Testing Strategy

Jest units cover provider validation, typed conflicts, safe-path normalization, and atomic rotation/replay. Mongo memory tests prove indexes, optional OAuth password, transaction consumption, and concurrent refresh. Supertest asserts real statuses, CORS, redirects, cookie attributes/clearing, and no token leakage. Jasmine tests session signals, `withCredentials`, refresh coalescing, guard bootstrap, callback/modal outcomes, and rejected external return paths.

## Threat Matrix

| Boundary | Applicability |
|---|---|
| Documentation-like paths | N/A — no executable-file classification. |
| Git repository selection | N/A — no Git execution. |
| Commit state | N/A — no commit automation. |
| Push state | N/A — no push automation. |
| PR commands | N/A — no PR automation. |

## Migration / Rollout / Rollback

Work units: (1) typed error compatibility and tests; (2) collections/indexes plus audit/backfill; (3) provider transactions and callback; (4) rotation/cookies/guards; (5) Angular BFF flow; (6) coordinated E2E/cutover. Deploy indexes before traffic, invalidate all legacy refresh hashes, then enable the Google entry point. Observe error codes, provider, opaque transaction/session IDs, latency, conflicts, replay, and CORS failures; never log authorization codes, tokens, cookies, verifiers, state, or claim payloads. Rollback disables OAuth entry, rolls both apps back together, retains new collections, and requires re-authentication.

## Open Questions

None.
