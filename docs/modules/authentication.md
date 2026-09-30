# Authentication Module

## Responsibility

Authentication establishes and clears the server-side session used by protected routes and authenticated backend requests. It covers login, registration, password recovery, password reset, and logout. Authorization of protected pages is enforced by `src/middleware.ts`.

## Entry Points

| User flow         | Route                        | Server Action          | Service boundary                |
| ----------------- | ---------------------------- | ---------------------- | ------------------------------- |
| Login             | `/{lang}/login`              | `handleLogin`          | `loginServerSide`               |
| Registration      | `/{lang}/register`           | `handleRegister`       | `registerServerSide`            |
| Password recovery | `/{lang}/recoverKey`         | `handleRecoverKey`     | `forgotPassword`                |
| Password reset    | `/{lang}/settingNewPassword` | `handleSetNewPassword` | `verifyCode`, `recoverPassword` |
| Logout            | `/{lang}/logout`             | `handleLogout`         | `clearAuthCookies`              |

## Session Contract

On successful login, `setAuthCookies` stores two `httpOnly` cookies for one day:

- `jwt`: backend authentication token.
- `user`: URL-encoded JSON with the authenticated user's `id` and `name`.

The browser must not read either cookie. Server-only services use `getToken` to attach the JWT as the `Authorization` header. Logout deletes both cookies.

## Rules and Failure States

- Login requires `email`, `password`, and `lang`. A backend `400` and a missing JWT both become `invalidCredentials`; other failures become `loginFailed`.
- Registration accepts only `@endava.com` addresses, matching passwords, and the required identity fields.
- Password reset validates all fields, the password policy, matching passwords, then the verification code before changing the password.
- The middleware protects `userProfile`, `createEvent`, and `event`. Requests without a JWT redirect to `/{lang}/login`.

## Required Tests

- Middleware redirects and access with/without a JWT.
- Every action covers missing/invalid input, expected service rejection, unexpected rejection, and success.
- Login verifies that cookies are persisted only after a response with a JWT.
- Cookie utilities verify parsing, malformed cookie handling, and cookie deletion.
- Service contracts verify paths and payloads for login, registration, recovery, and reset.

## Current Automated Coverage

- Middleware access rules, registration, login, recovery, password reset, and logout actions have focused unit tests.
- Server cookie parsing/persistence/deletion and authentication/password service routes, payloads, and cancellation signals have focused tests.

## Dependencies and Boundaries

- UI forms only submit state to Server Actions.
- Server Actions own validation and response-to-form-state mapping.
- Services own backend request construction.
- Cookie utilities are the only owner of cookie names and options.

Changes to backend authentication fields, cookie names/options, or protected route policy require updating this document, focused tests, and the relevant service contract tests in the same change.
