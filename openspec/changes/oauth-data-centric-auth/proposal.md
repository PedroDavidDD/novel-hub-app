# Proposal: OAuth Data-Centric Authentication

## Intent and Current-State Gap

Deliver reliable Google sign-in without redirect loops, browser-trusted identity, exposed tokens, silent linking, or ambiguous failures. Angular submits self-derived claims and stores tokens; NestJS neither verifies the provider transaction nor supports per-device sessions or real typed HTTP errors.

## Users and Outcomes

- New users create an account with Google; returning users use independently revocable devices.
- Existing email owners receive conflict guidance without linking.
- Failures produce deterministic UX through `ModalAlertService`.

## Scope

### In Scope
- Backend-owned Google Authorization Code + PKCE with state, nonce, verification, and validated internal return paths.
- Provider-neutral Strategy/Adapter extensibility, separate `AuthIdentity`, and per-device `RefreshSession` persistence.
- Backend-issued access/refresh sessions in `HttpOnly`, production-`Secure`, explicit-`SameSite` cookies; credentialed CORS and CSRF controls.
- New-user auto-creation; real `409 AUTH_EMAIL_ALREADY_EXISTS` and typed `403` inactive-user errors with stable `code` and `msg`.
- Angular callback UX, reusable helpers, and cookie-based bootstrap/refresh/logout.

### Non-Goals / Follow-Ups
- Internationalization/centralized text architecture (next SDD change).
- Backend-driven input/select catalogs (third SDD change).
- Additional providers, automatic linking, and all-device logout UI.

## Capabilities

### New Capabilities
- `oauth-authentication`: Verified authorization, account resolution, safe redirects, typed outcomes.
- `device-session-management`: Cookie sessions, per-device rotation/revocation, replay handling.
- `auth-error-contract`: Real HTTP status with stable `code` and `msg`.

### Modified Capabilities
None; no existing OpenSpec capabilities exist.

## Business and Security Rules

- The backend is authoritative; browser claims/provider tokens are never trusted or persisted.
- Return targets MUST be normalized internal paths; invalid values fall back to `/home`.
- Provider identity is unique; email alone MUST NOT link accounts.
- Refresh rotation MUST be atomic; replay revokes the affected family/session.

## Migration and Compatibility

Audit/backfill recoverable legacy identities before enforcing uniqueness. Invalidate legacy refresh tokens at cutover, requiring re-authentication. Keep shared `ApiResponse` changes narrowly backward-compatible; non-auth envelope changes require cross-API consumer testing.

## Affected Areas

| Area | Impact |
|---|---|
| Frontend `src/app/features/auth`, `src/app/core` | OAuth UX, session state, guards, interceptor, contracts |
| Backend `src/modules/auth` | Provider flow, identities, sessions, cookies |
| Backend `src/common`, `src/main.ts` | Typed responses, credentialed CORS, cookie handling |

## Risks, Rollout, and Rollback

Risks: cookie/CSRF behavior, incomplete legacy identities, refresh races, and shared response impact. Deploy migrations/indexes first, then coordinated application changes; monitor callback, conflict, replay, and failure rates. Roll back both tiers together, disable OAuth entry points, and retain migrated collections; another sign-in may be required.

## Success Criteria

- No provider/application token appears in browser storage, URLs, logs, or bodies.
- New, returning, cancel, conflict, inactive, and invalid-state paths return deterministic contracts and UX.
- Multi-device sessions rotate/revoke independently and reject replay.
- Tests prove 409/403 statuses, codes/messages, cookie attributes, safe redirects, and credentialed CORS.
