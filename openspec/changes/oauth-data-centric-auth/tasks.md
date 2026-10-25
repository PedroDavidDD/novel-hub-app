# Tasks: OAuth Data-Centric Authentication

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 1,300-2,000 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | Six behavior work units below |
| Delivery strategy | ask-on-risk |
| Chain strategy | feature-branch-chain |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

Preserve both repos' uncommitted work; never reset, clean, or overwrite unrelated changes. Each unit is one Conventional Commit with tests.

### Suggested Work Units

| Unit | Goal / dependencies / file areas | Focused test command | Runtime harness | Rollback boundary |
|---|---|---|---|---|
| 1 | Typed errors; `nest-novel-hub-app/src/common/**`, `src/modules/auth/**`; none | `npm test -- --runInBand -- auth` | `npm run test:e2e -- --runInBand` | Error additions/auth mapping |
| 2 | Auth schemas/indexes/migration; `auth/domain/**`, `auth/infrastructure/**`, `scripts/**`; after 1 | `npm test -- --runInBand -- auth` | In-memory Mongo index/concurrency scenario | Collections/indexes/cutover script |
| 3 | Google PKCE flow; `auth/application/**`, provider adapter/controller/module; after 1-2 | `npm test -- --runInBand -- oauth` | `npm run test:e2e -- --runInBand` | OAuth endpoints/wiring |
| 4 | Cookie sessions/CORS/CSRF; auth service/guard/controller, `src/main.ts`; after 2 | `npm test -- --runInBand -- refresh` | `npm run test:e2e -- --runInBand` | Session endpoints/transport config |
| 5 | Angular BFF and reusable login/callback boundaries; `novel-hub-app/src/app/features/auth/**`, `src/app/core/**`, `app.routes.ts`; after 3-4 | `npm test -- --watch=false --browsers=ChromeHeadless --include=**/*auth*.spec.ts` | Localhost login/callback/logout; no browser tokens | Angular auth/routes |
| 6 | Coordinated cutover; both apps; after 1-5 | Backend `npm test -- --runInBand`; frontend `npm test -- --watch=false --browsers=ChromeHeadless` | E2E plus `npm run build` per app | Disable OAuth; retain collections; re-authenticate |

## Phase 1: Backend Contracts and Persistence

- [x] 1.1 Unit 1 (`feat(auth): add typed HTTP errors`): RED 409/403, stable provider/session codes, `msg`, compatibility; GREEN `AppError`/`ApiResponse` mapping; REFACTOR shared boundaries.
- [ ] 1.2 Unit 2 (`feat(auth): persist OAuth identities and sessions`): RED uniqueness, optional OAuth password, TTL, atomic consume, concurrent refresh, legacy rejection; GREEN `AuthIdentity`, `OAuthTransaction`, `OAuthOutcomeTicket` (hashed opaque ticket, payload/status/code/msg/return path, expiry, consumedAt), `RefreshSession`, indexes, one-time atomic consume/delete and TTL/cleanup; REFACTOR repositories/mappers.

## Phase 2: Backend OAuth and Sessions

- [ ] 2.1 Unit 3 (`feat(auth): complete Google PKCE flow`): RED verified/new/returning, invalid/replayed state, provider failure, unsafe return, token leakage, real 409/403; GREEN provider port/adapter and start/callback/outcome endpoints; REFACTOR orchestration.
- [ ] 2.2 Unit 4 (`feat(auth): add per-device cookie sessions`): RED bootstrap anonymous/valid, independent/concurrent rotation, replay family revocation, current-device logout, allowed CORS, rejected unsafe origin; GREEN atomic rotation, cookies, guard, CORS/CSRF; REFACTOR cookie policy helpers.

## Phase 3: Angular and Cutover

- [ ] 3.1 Unit 5 (`feat(auth): adopt BFF OAuth sessions`): RED credentialed bootstrap, 401 refresh coalescing, no 403/409 loop, guard wait, safe callback/modal outcomes; GREEN session signals, interceptor, provider initiation, reusable login/callback helpers/components; REFACTOR remove storage/hash/client-OAuth code.
- [ ] 3.2 Unit 6 (`test(auth): prove coordinated OAuth cutover`): RED cross-tier journeys; GREEN migration/cutover, cookie/redirect/error/CORS/no-leak evidence and builds; REFACTOR fixtures/docs. Internationalization and backend-driven catalogs remain out of scope.
