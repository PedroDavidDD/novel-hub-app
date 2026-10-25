# Apply Progress: OAuth Data-Centric Authentication

## Cumulative Status

- Mode: Strict TDD
- Delivery: feature-branch-chain, Unit 1 only
- Completed: 1/6 work units
- Previous apply progress: none

## Completed Tasks

- [x] 1.1 Unit 1 — typed HTTP errors
- [ ] 1.2 Unit 2 — OAuth identities and sessions
- [ ] 2.1 Unit 3 — Google PKCE flow
- [ ] 2.2 Unit 4 — per-device cookie sessions
- [ ] 3.1 Unit 5 — Angular BFF OAuth sessions
- [ ] 3.2 Unit 6 — coordinated cutover

## Implementation

Added a framework-neutral `AppError`, stable auth error codes/factories, typed `Result<T, E>` support, and a reusable HTTP exception mapper. Auth use cases now return typed conflict, inactive-user, invalid-credential, provider-identity, and invalid-session failures. Auth controllers throw mapped exceptions so Nest emits real HTTP 409/403/401 statuses while `ApiResponse` preserves legacy success fields and adds optional `code` only for typed errors. The global exception filter preserves `code`.

### Changed Backend Files

- `src/common/core/app-error.ts`
- `src/common/core/result.ts`
- `src/common/responses/api-response.dto.ts`
- `src/common/responses/exception.filter.ts`
- `src/common/responses/http-error.mapper.ts`
- `src/common/responses/index.ts`
- `src/modules/auth/application/errors/auth.errors.ts`
- `src/modules/auth/application/use-cases/login.use-case.ts`
- `src/modules/auth/application/use-cases/register-user.use-case.ts`
- `src/modules/auth/application/use-cases/refresh-token.use-case.ts`
- `src/modules/auth/application/use-cases/social-login.use-case.ts`
- `src/modules/auth/infrastructure/api/auth.controller.ts`
- `src/common/responses/auth-error-contract.spec.ts`
- `src/common/responses/auth-error-http.integration.spec.ts`
- `src/modules/auth/infrastructure/api/auth.controller.spec.ts`

## TDD Cycle Evidence

| Task | Test files | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|---|---|---|---|---|---|---|---|
| 1.1 | `auth-error-contract.spec.ts`, `auth.controller.spec.ts`, `auth-error-http.integration.spec.ts` | Unit + HTTP integration | No prior auth tests existed | 2 suites failed on missing mapper/error modules | 2 suites, 8 tests passed | Real Nest HTTP 409/403: 1 suite, 2 tests passed | 3 suites, 10 tests passed; build passed |

## Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused tests | `npm test -- --runInBand auth-error-contract.spec.ts auth-error-http.integration.spec.ts auth.controller.spec.ts` — PASS, 3 suites/10 tests |
| Runtime harness | Focused Nest HTTP integration through global exception filter — PASS, 409 conflict and 403 inactive-user envelopes |
| Build | `npm run build` — PASS |
| Changed-line count | 361 authored backend additions + deletions from the pre-task baseline; preserved pre-existing edits excluded |
| Rollback boundary | Revert the 15 backend files listed above; unrelated auth module/entity/schema/social DTO work remains untouched |

## Deviations and Risks

- No design deviation.
- CodeGraph initialization was attempted but unavailable in the restricted runtime (EPERM); targeted filesystem inspection was used.
- No commit, push, or PR was created.

