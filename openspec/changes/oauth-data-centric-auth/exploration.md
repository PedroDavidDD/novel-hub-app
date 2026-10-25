# Exploration: OAuth Data-Centric Authentication

## Current State

### End-to-end flow today

1. `LoginPageComponent.onSocialLogin()` calls `AuthFacade.loginWithSocial()`, which delegates to `AuthService.loginWithSocial()`.
2. `SocialAuthService` selects `GoogleAuthService` from an in-memory provider map. `GoogleAuthService.login()` writes the full current URL and provider name to `sessionStorage`, configures `angular-oauth2-oidc`, and calls `initLoginFlow()`.
3. The development and production environments configure Google with `responseType: 'id_token'`, so this is an implicit OIDC token response rather than Authorization Code + PKCE.
4. `AppComponent.ngOnInit()` detects `access_token` or `id_token` in `window.location.hash`, invokes `GoogleAuthService.handleAuthCallback()`, then incorrectly calls `AuthService.loginWithSocial('google')` again. That second call starts a new Google login instead of sending the callback result to the backend.
5. When `AuthService.loginWithSocial()` does reach the backend, it maps browser-derived Google claims into a `SocialLoginDto` containing provider, provider ID, email, names, avatar, and arbitrary raw data, and posts them to `POST /auth/social/login`.
6. `AuthController.socialLogin()` delegates to `SocialLoginUseCase`; the use case trusts every identity field supplied by the browser. It finds a user by email, stores provider fields on `User`, issues application JWTs, hashes one refresh token onto the user, and returns both tokens in the JSON body.
7. The frontend stores access token, refresh token, user data, and expiration in `sessionStorage`. `authInterceptor` adds the access token as a Bearer header and sends the refresh token as a Bearer header to `POST /auth/refresh`.

### Existing contract interactions

- **Backend `Result<T>`** carries only a value or an untyped/string error. It has no stable error code or HTTP status, so the controller cannot reliably distinguish conflict, inactive-user, provider failure, or unauthorized cases.
- **Backend `ApiResponse<T>`** uses `statusCode` as an application success marker (`1`) or, inconsistently, as an HTTP-like error number. Returning `ApiResponse.error(..., 409)` does not set the real HTTP response status; controller methods currently return error bodies under their configured/default HTTP status.
- **Frontend `ApiResponse<T>`** declares `statusCode: 0 | 1`, which is already incompatible with backend error bodies containing values such as 401. It has no stable `code` field.
- **Frontend `Result<T>`** can preserve an optional code, but `AuthService` generally discards backend codes because the API contract does not expose them.
- **`SocialLoginUseCase`** correctly sits behind the controller and repository port, but it combines identity trust, account matching, user creation, token issuance, and refresh-token persistence. No provider verification port/adapter exists.
- **`ModalAlertService`** dynamically mounts the shared modal component and returns a `Promise<boolean>`. It is currently used for navbar logout, not OAuth callback/cancel errors; OAuth failures instead navigate silently or go through `ActionHandler`/toast behavior.

### Confirmed conflicts with the target

1. Google implicit `id_token` flow conflicts with Authorization Code + PKCE.
2. The browser is treated as the identity authority; the backend never verifies Google tokens/codes, issuer, audience, signature, state, nonce, or email verification.
3. The callback result is discarded and social login is restarted, creating a redirect-loop/double-login risk.
4. Full callback URLs are restored from `sessionStorage` without internal-URL validation, enabling an open-redirect class of behavior.
5. Application tokens are exposed to JavaScript through `sessionStorage`, conflicting with HttpOnly cookie storage.
6. Refresh tokens are single-user fields, not per-device sessions; a new login rotates/replaces the only stored hash and invalidates other devices.
7. Provider identity is stored on `User`, conflicting with the separate `AuthIdentity` aggregate/collection decision.
8. `UserSchemaClass.password` is marked `required: true`, while social user creation supplies no password; a first-time OAuth user can fail MongoDB validation.
9. `UserMapper` does not map `authProvider`, `authProviderId`, or `avatar` in either direction, so the current provider fields are lost on persistence/reconstitution even though schema and entity fields exist.
10. Email collision, inactive user, and social login failures all collapse to an unauthorized-style body. The endpoint cannot produce the required real HTTP 409/403 responses and stable codes.
11. `withHashLocation()` makes the URL fragment part of Angular routing while the current callback also uses the fragment for tokens. A PKCE callback should have a dedicated route and query parameters, or the callback should terminate at the backend before redirecting to Angular.
12. `app.enableCors()` is not configured for credentialed cookies, and frontend HTTP requests do not use `withCredentials` globally.

## Affected Areas

### Frontend — existing files

- `src/app/features/auth/pages/login-page/login-page.component.ts` and `.html` — initiate Google login, capture a validated internal return target, expose loading state, and show provider/cancel failures through `ModalAlertService`.
- `src/app/features/auth/components/social/google-login-button.component.ts` and `social-login-button.component.ts` — reusable provider trigger remains appropriate; loading/disabled state should follow the redirect initiation result.
- `src/app/features/auth/services/social/google-auth.service.ts` — replace implicit-token parsing with a PKCE-capable initiation/callback boundary; it must never persist provider or application tokens in web storage.
- `src/app/features/auth/services/social/oauth-config.service.ts` — change Google response type and PKCE/callback settings if the SPA performs the authorization step; remove insecure `skipIssuerCheck` behavior.
- `src/app/features/auth/services/social/social-auth.service.ts` and `src/app/features/auth/interfaces/social/social-auth.interface.ts` — reshape the provider strategy contract around authorization initiation/callback outcome rather than returning trusted user claims and provider access tokens.
- `src/app/features/auth/services/auth.service.ts` — remove social-claim submission and token persistence; use credentialed session endpoints, keep only non-sensitive user/auth state in memory, and refresh through cookies.
- `src/app/features/auth/mappers/social/social-user.mapper.ts`, `google-user.mapper.ts`, and the browser-side Google JWT adapter — delete or narrow browser identity mapping because verified claims must originate from the backend.
- `src/app/features/auth/interfaces/auth.interface.ts` — align `ApiResponse` with success data plus stable error `code`/`msg`; remove access/refresh token fields from browser-facing auth data when cookies own them.
- `src/app/core/interceptors/auth.interceptor.ts` — stop injecting Bearer tokens; opt API requests into credentials and preserve one coordinated refresh attempt without exposing refresh tokens.
- `src/app/app.component.ts` — remove hash-token parsing and callback orchestration from the application root.
- `src/app/app.routes.ts` and `src/app/app.config.ts` — add/route a dedicated callback result surface if needed and reconcile hash routing with OAuth callback semantics.
- `src/app/core/guards/auth.guard.ts`, `notAuthenticated.guard.ts`, and `permission.guard.ts` — derive state from a backend session/bootstrap check rather than storage presence.
- `src/app/shared/services/modal-alert.service.ts` — reuse unchanged or with a small domain-independent helper to show OAuth cancel/provider/error messages consistently.
- `src/environments/environments.ts` and `environments.prod.ts` — hold public OAuth/client and API settings only; development cookie behavior must be environment-aware without weakening production security.

### Backend — existing files

- `src/modules/auth/infrastructure/api/auth.controller.ts` — expose OAuth start/callback or token-verification completion endpoints, set/clear cookies, validate return URLs, and throw/return real 409 and 403 statuses with stable codes.
- `src/modules/auth/application/use-cases/social-login.use-case.ts` and `social-login.dto.ts` — accept verified provider identity (or an authorization completion command), not browser-supplied email/profile/rawData; preserve Controller → Use Case → Port layering.
- `src/modules/auth/domain/entities/user.entity.ts` — remove provider identity and refresh-token ownership from `User`; retain local account/profile and active-state rules.
- `src/modules/auth/domain/ports/user.repository.interface.ts` and `MongoUserRepository.ts` — continue local-user lookup/creation; email lookup remains necessary for the explicit no-link conflict.
- `src/modules/auth/infrastructure/persistence/mongodb/schemas/user.schema.ts` and `mappers/user.mapper.ts` — remove legacy provider/refresh fields after migration and make password optional for OAuth-created users while password login still rejects missing passwords.
- `src/modules/auth/infrastructure/adapters/jwt-token.service.ts` and `domain/ports/token-service.interface.ts` — issue short-lived access tokens and opaque/identifiable refresh material suitable for hashed per-device persistence; avoid treating one JWT hash on `User` as the session store.
- `src/modules/auth/application/use-cases/refresh-token.use-case.ts` and `logout.use-case.ts` — rotate/revoke the current device session atomically and clear only that session unless an explicit all-device logout is requested.
- `src/common/core/result.ts` — adopt typed application failures or an equivalent mapping seam so stable code and HTTP status survive from use case to controller.
- `src/common/responses/api-response.dto.ts`, `transform.interceptor.ts`, and `exception.filter.ts` — define one response meaning and include a stable error code without confusing application status with real HTTP status.
- `src/main.ts` — configure cookie parsing, exact credentialed CORS origins, credentials, and environment-specific secure-cookie settings.
- `src/modules/auth/auth.module.ts` — register provider strategies/adapters and new persistence ports/schemas.

### Backend — new domain/application/infrastructure seams

- `AuthIdentity` entity, repository port, Mongo schema/mapper/repository — fields at minimum: `provider`, `providerUserId`, `userId`, timestamps; unique compound index on `(provider, providerUserId)` and normally `(userId, provider)`.
- `RefreshSession` (or equivalent) entity, repository port, Mongo schema/mapper/repository — per-device token hash, user ID, session/family ID, expiry, revocation/replacement metadata, and device metadata bounded for privacy.
- `ExternalIdentityProvider` strategy port plus `GoogleIdentityProvider` adapter — build/validate authorization state and PKCE flow, exchange/verify Google output, validate issuer/audience/nonce/email verification, and return a provider-neutral verified identity.
- Typed authentication errors/codes — at minimum `AUTH_EMAIL_ALREADY_EXISTS`, an inactive-user code, invalid/expired OAuth state, provider-cancel/provider-failure, and invalid refresh-session errors.

## Data and Migration Concerns

- Existing `users.authProvider`, `users.authProviderId`, and `users.hashedRefreshToken` are legacy fields. Migration must backfill valid provider identities before removing them, but the current mapper omission means production data may be absent or inconsistent; migration needs an audit/report path rather than assuming completeness.
- Enforce uniqueness before accepting new OAuth traffic. Duplicate `(provider, providerUserId)` records must be detected and resolved deterministically.
- Do not automatically link an existing email account. If verified Google email matches a user without the same existing Google identity, return real HTTP 409 with `code: AUTH_EMAIL_ALREADY_EXISTS` and the required guidance in `msg`.
- Social-only users require an optional persisted password. Password authentication must continue to return generic invalid credentials when no password hash exists.
- Backfilling the single legacy refresh-token hash into a device session is not reliable because device/session metadata and raw token identity are unavailable. Prefer invalidating legacy refresh tokens at cutover and requiring re-authentication; document this user impact.
- Cookie rollout must be coordinated with frontend deployment. A compatibility window that accepts both Bearer and cookie credentials increases complexity and attack surface; if used, make it explicitly time-bounded.
- Use TTL/index cleanup for expired refresh sessions where appropriate, while application logic remains responsible for rotation/revocation correctness.

## Security Constraints

- Generate high-entropy OAuth `state`, PKCE verifier/challenge, and OIDC nonce; bind them to a short-lived, one-time server-side transaction or protected HttpOnly cookie and reject mismatch/replay.
- Allow only normalized internal paths as return URLs. Reject scheme-relative (`//`), absolute, encoded bypass, backslash, control-character, and origin-changing values; default to `/home`.
- Verify Google identity server-side using authoritative metadata/keys and exact client audience. Never trust decoded-but-unverified browser claims or `rawData`.
- Set application cookies `HttpOnly`, `Secure` in production, explicit `SameSite` (prefer `Lax` for the top-level OAuth redirect unless deployment topology requires `None`), narrow `Path`, bounded `Max-Age`, and appropriate domain omission/scope.
- Credentialed CORS must use an allowlist and `credentials: true`; wildcard origins are invalid with credentials. Frontend API requests must use `withCredentials`.
- Cookie authentication requires an explicit CSRF position. SameSite helps but does not cover every same-site/subdomain threat; validate `Origin`/`Referer` for unsafe methods and add CSRF tokens if deployment topology requires them.
- Refresh rotation must be atomic: a presented token is matched by hash, revoked/replaced once, and replay should revoke the token family/session rather than silently issuing parallel descendants.
- Never log authorization codes, provider tokens, application tokens, cookie values, PKCE verifiers, or full Google claim payloads.

## Testing Seams

### Backend (Jest)

- Unit-test provider-neutral social login with mocked user, identity, refresh-session, provider, token, and hashing ports: new user, known identity, email conflict 409 code, inactive user 403 code, provider mismatch, and persistence failure.
- Unit-test `GoogleIdentityProvider` with mocked HTTP/JWKS boundaries: valid exchange, invalid state/nonce/audience/issuer/signature, unverified/missing email, cancel, timeout, and Google error payload.
- Unit-test refresh-session rotation: independent devices, single-use rotation, replay/family revocation, expiry, logout-current-device, and concurrent refresh attempts.
- Repository tests with `mongodb-memory-server` should prove unique indexes, mappings, optional password behavior, identity lookup, and atomic session updates.
- Controller/e2e tests should assert real HTTP status separately from JSON envelope, stable `code` and `msg`, `Set-Cookie` security attributes, cookie clearing, credentialed CORS, safe return redirects, and absence of tokens in response bodies/URLs.

### Frontend (Karma/Jasmine)

- `AuthService` tests should assert no token storage, `withCredentials`, bootstrap/refresh/logout state transitions, and preservation of backend `code`/`msg` in `Result` or a typed frontend error.
- Interceptor tests should prove Bearer headers are absent, credential behavior is correct, refresh requests are coalesced, and 409/403 are not incorrectly converted into refresh loops.
- Login/callback tests should cover internal return URLs, rejected external URLs, default `/home`, cancel/provider errors, `AUTH_EMAIL_ALREADY_EXISTS`, inactive user, and `ModalAlertService` invocation.
- Route/guard tests should cover initial checking state and authenticated/anonymous redirects without relying on `sessionStorage`.
- Provider strategy contract tests should make adding a future provider possible without changing the use case or controller orchestration.

No frontend or backend `*.spec.ts` tests currently exist in the inspected source trees, so these are new seams rather than extensions of existing auth tests.

## Approaches

1. **Backend-owned OAuth/BFF callback (recommended)** — Angular redirects to a backend start endpoint; the backend owns state, nonce, PKCE verifier, Google code exchange/verification, local account resolution, cookie issuance, and safe redirect back to Angular.
   - Pros: provider and application tokens never need JavaScript storage; centralizes trust, return-URL validation, error/status mapping, and future provider strategies; best fit for HttpOnly cookies and the existing backend use-case/port architecture.
   - Cons: requires new backend endpoints, short-lived OAuth transaction persistence/cookies, careful cross-origin/cookie/CORS configuration, and frontend callback-result messaging.
   - Effort: High.

2. **SPA-managed Authorization Code + PKCE, backend-verified ID token** — `angular-oauth2-oidc` performs code exchange in Angular; Angular sends the resulting ID token to the backend, which verifies it before local login and cookie issuance.
   - Pros: smaller initial backend OAuth orchestration change and reuses the installed frontend library.
   - Cons: Google tokens remain exposed to browser JavaScript; return/state handling is split across tiers; the backend receives a token rather than owning the complete transaction; harder to align cleanly with the data-centric cookie session model.
   - Effort: Medium.

## Recommendation

Use the backend-owned OAuth/BFF callback. Add a provider-neutral strategy port in the auth application/domain boundary and a Google infrastructure adapter. Keep controllers thin: parse request/cookies, delegate to start/complete/refresh/logout use cases, then set/clear cookies and map typed failures to real HTTP responses. Persist `AuthIdentity` and per-device `RefreshSession` through repository ports and Mongo adapters; keep `User` provider-agnostic.

On Angular, reduce social auth to initiating the backend flow and consuming a sanitized callback outcome. Remove provider claim mapping and all application token storage. Reuse `ModalAlertService` for cancel/provider/conflict/inactive outcomes, and keep return-path validation in a shared, independently testable helper only if the frontend must also process it; backend validation remains authoritative.

## Risks

- The current social-login work is uncommitted and internally inconsistent (required password plus missing provider mappings); implementation must preserve unrelated work and deliberately replace, not layer over, the broken flow.
- Cookie behavior can differ between localhost and production domains/schemes; environment-specific integration tests are necessary.
- Migrating existing social identities may be lossy because current mapper behavior may have prevented provider fields from persisting.
- Refresh-session rotation needs atomic persistence to avoid concurrent-use races and replay gaps.
- Response-envelope normalization may affect non-auth controllers that reuse the shared `ApiResponse`, interceptor, and exception filter; scope and compatibility must be specified before implementation.
- The frontend CodeGraph index was available and used. Backend CodeGraph was absent; `gentle-ai codegraph init --cwd <backend>` failed with exit status 1, so backend exploration used bounded direct inspection.

## Ready for Proposal

Yes. The confirmed product decisions resolve the major business forks, and the backend-owned OAuth/BFF approach provides a coherent technical direction. The proposal should explicitly bound whether shared `ApiResponse` normalization is auth-only or a cross-API migration, define the cookie deployment topology, and record legacy refresh-token invalidation as the preferred migration behavior.
