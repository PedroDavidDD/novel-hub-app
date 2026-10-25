# Device Session Management Specification

## Purpose

Define cookie-based session bootstrap, independent device rotation, revocation, and transport protections.

## Requirements

### Requirement: Session bootstrap

The system MUST determine initial authentication state from a credentialed backend bootstrap request and MUST NOT infer it from browser token storage.

#### Scenario: Valid session bootstrap
- GIVEN a browser has valid session cookies
- WHEN the application bootstraps
- THEN authenticated user data is returned without exposing tokens

#### Scenario: Anonymous bootstrap
- GIVEN no valid session cookie exists
- WHEN the application bootstraps
- THEN the application enters an anonymous state without a refresh loop

### Requirement: Per-device refresh rotation

Each device MUST have an independently revocable refresh session. Refresh use MUST atomically consume the presented token and issue a replacement for only that device.

#### Scenario: Independent device rotation
- GIVEN two valid device sessions for one user
- WHEN one device refreshes
- THEN only that device token rotates and the other remains valid

#### Scenario: Concurrent refresh
- GIVEN the same refresh token is submitted concurrently
- WHEN rotation is attempted
- THEN at most one request succeeds

### Requirement: Replay containment

Reuse of a consumed or replaced refresh token MUST revoke the affected session family and MUST NOT issue another descendant.

#### Scenario: Rotated token replay
- GIVEN a refresh token was already consumed
- WHEN it is presented again
- THEN its session family is revoked and refresh fails

### Requirement: Current-device logout

Logout MUST revoke only the session identified by the current refresh credential and MUST clear that device's cookies.

#### Scenario: Logout with multiple devices
- GIVEN a user has two active device sessions
- WHEN one device logs out
- THEN that device is revoked and the other remains active

### Requirement: Legacy refresh cutover

Migration MUST invalidate legacy user-level refresh tokens rather than convert them into device sessions, requiring affected users to authenticate again.

#### Scenario: Legacy token after cutover
- GIVEN a refresh token predates device-session migration
- WHEN it is presented after cutover
- THEN refresh is rejected and no device session is created

### Requirement: Credentialed browser transport

Browser API requests MUST use credentials. CORS MUST allow only configured origins with credentials and MUST NOT use a wildcard origin. Unsafe cookie-authenticated requests MUST validate `Origin` or `Referer`; deployments not fully protected by same-site boundaries MUST additionally require a CSRF token.

#### Scenario: Allowed credentialed origin
- GIVEN a request originates from an allowed frontend origin
- WHEN it includes cookies
- THEN CORS permits the credentialed request

#### Scenario: Unsafe cross-origin request
- GIVEN an unsafe-method request has an untrusted or missing origin proof
- WHEN authorization is evaluated
- THEN the request is rejected before state changes

