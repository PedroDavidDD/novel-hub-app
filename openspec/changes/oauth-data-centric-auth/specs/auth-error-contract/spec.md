# Authentication Error Contract Specification

## Purpose

Define stable authentication failures while preserving existing shared success consumers.

Internationalization and backend-driven select catalogs are outside this specification.

## Requirements

### Requirement: Real HTTP authentication status

Authentication failures MUST use their real HTTP status. Email collision MUST use 409, and inactive-user authorization MUST use 403; neither MAY be transported as HTTP success with an error marker.

#### Scenario: Email collision status
- GIVEN OAuth resolves a verified email collision without an existing link
- WHEN the response is emitted
- THEN its HTTP status is 409
- AND its body contains `code: AUTH_EMAIL_ALREADY_EXISTS` and `msg`

#### Scenario: Inactive user status
- GIVEN authentication resolves an inactive user
- WHEN the response is emitted
- THEN its HTTP status is 403
- AND its body contains `code: AUTH_USER_INACTIVE` and `msg`

### Requirement: Stable machine and human error fields

Every authentication error response MUST include a stable machine-readable `code` and a non-empty human-readable `msg`. Static Spanish wording MAY be carried in `msg`; localization behavior is outside this specification.

#### Scenario: OAuth cancellation
- GIVEN the provider reports user cancellation
- WHEN the failure is returned to the client
- THEN the body contains `code: AUTH_PROVIDER_CANCELLED` and a `msg`

#### Scenario: Provider failure
- GIVEN provider verification or exchange fails
- WHEN the failure is returned to the client
- THEN the body contains a stable provider-failure `code` and a `msg`

#### Scenario: Invalid session
- GIVEN a refresh session is expired, revoked, invalid, or replayed
- WHEN refresh fails
- THEN the body contains a stable session error `code` and a `msg`

### Requirement: Backward-compatible shared response handling

Shared response handling MUST preserve existing successful response data and fields consumed by non-auth clients. It MUST add error `code` and `msg` without redefining an application field as the HTTP transport status, and frontend handling MUST preserve those fields for authentication UX.

#### Scenario: Existing non-auth success
- GIVEN an existing successful non-auth endpoint uses the shared response envelope
- WHEN shared response handling is upgraded
- THEN its HTTP status and previously consumed success payload remain compatible

#### Scenario: Frontend receives typed auth failure
- GIVEN an authentication endpoint returns a non-2xx response with `code` and `msg`
- WHEN shared frontend response handling processes it
- THEN both fields remain available to the auth UI
- AND the failure is not converted into an authentication refresh loop

