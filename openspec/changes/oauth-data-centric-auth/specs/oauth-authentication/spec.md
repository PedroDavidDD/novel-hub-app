# OAuth Authentication Specification

## Purpose

Define backend-authoritative Google authentication, account resolution, and safe browser outcomes.

## Requirements

### Requirement: Authoritative OAuth transaction

The system MUST use Authorization Code with PKCE. It MUST create one-time, short-lived state and nonce values, verify the provider response server-side against the expected issuer, audience, signature, nonce, and verified email, and MUST NOT trust browser-supplied identity claims.

#### Scenario: Verified provider response
- GIVEN a valid, unused transaction and Google response
- WHEN the callback is completed
- THEN the backend verifies the provider response before resolving an account

#### Scenario: Invalid or replayed state
- GIVEN state that is missing, expired, mismatched, or already consumed
- WHEN the callback is attempted
- THEN authentication fails with `AUTH_INVALID_STATE`

#### Scenario: Provider cancellation or failure
- GIVEN Google reports cancellation or a provider error
- WHEN the callback is processed
- THEN no account or session is created
- AND a stable provider outcome is returned for the login UX

### Requirement: Account resolution without implicit linking

The system MUST resolve users by provider identity. It MUST create a user and identity for a new verified identity, reuse the linked user for a returning identity, MUST NOT link by email alone, and MUST reject inactive users.

#### Scenario: New verified user
- GIVEN no identity or user owns the verified provider email
- WHEN authentication completes
- THEN one user and one provider identity are created

#### Scenario: Returning identity
- GIVEN the verified provider identity is linked to an active user
- WHEN authentication completes
- THEN that user is authenticated without creating duplicates

#### Scenario: Email collision
- GIVEN the verified email belongs to a user without that provider identity
- WHEN authentication completes
- THEN the response is HTTP 409 with `code: AUTH_EMAIL_ALREADY_EXISTS` and guidance in `msg`

#### Scenario: Inactive user
- GIVEN the provider identity resolves to an inactive user
- WHEN authentication completes
- THEN the response is HTTP 403 with `code: AUTH_USER_INACTIVE` and a `msg`

### Requirement: Safe return target

The system MUST accept only normalized internal path return targets. It MUST replace absolute, scheme-relative, backslash, control-character, encoded-bypass, or origin-changing values with `/home`.

#### Scenario: Safe internal return
- GIVEN a normalized internal path
- WHEN authentication succeeds
- THEN the browser is redirected to that path

#### Scenario: Unsafe return
- GIVEN an unsafe or malformed return target
- WHEN authentication completes
- THEN the browser is redirected to `/home`

### Requirement: Confidential browser session delivery

The system MUST issue application credentials only as bounded `HttpOnly` cookies with explicit `SameSite`, production `Secure`, and appropriately narrow scope. Provider or application tokens MUST NOT appear in JavaScript-visible storage, response bodies, or URLs.

#### Scenario: Successful cookie issuance
- GIVEN authentication succeeds
- WHEN the response is sent
- THEN protected cookies are issued and the body/URL contains no token

