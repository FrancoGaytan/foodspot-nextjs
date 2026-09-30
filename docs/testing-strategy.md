# Testing Strategy

## Purpose

This document defines how `foodspot-nextjs` verifies behavior while the product evolves. Tests protect observable behavior and business rules; they do not duplicate implementation details or static styles.

## Commands

| Command                  | Purpose                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------- |
| `pnpm test`              | Run the deterministic unit and component suite once.                                  |
| `pnpm test:watch`        | Run the suite in watch mode during development.                                       |
| `pnpm test:coverage`     | Run the suite and create terminal, HTML, and LCOV coverage reports under `coverage/`. |
| `pnpm lint`              | Check source lint rules.                                                              |
| `pnpm exec tsc --noEmit` | Check TypeScript types.                                                               |
| `pnpm build`             | Verify the production Next.js build.                                                  |

Before a deployment, run the commands above in that order. The coverage report is informational during the initial rollout and tracks the explicitly covered critical modules. Its scope grows with the suite; thresholds and a whole-source baseline will be enabled only after the critical flows have representative coverage.

## Test Layers

| Layer            | Location              | Scope                                                                              |
| ---------------- | --------------------- | ---------------------------------------------------------------------------------- |
| Unit             | `tests/**/*.test.ts`  | Pure helpers, state and permission rules, Server Actions with mocked dependencies. |
| Component        | `tests/**/*.test.tsx` | User-visible states, validation, accessibility, and emitted interactions.          |
| Service contract | `tests/**/*.test.ts`  | HTTP method, path, headers, payload, response mapping, and error mapping.          |
| End-to-end       | `e2e/`                | A small set of production-critical journeys against a deterministic API.           |

The current Vitest suite uses Node by default. A component test that needs DOM rendering must declare `// @vitest-environment jsdom` at the top of the file. This keeps server logic independent from browser-only APIs.

## Conventions

- Name tests after externally observable behavior: `returns invalid credentials for a 400 response`.
- Mock at the immediate boundary: a Server Action mocks its service; a service mocks `fetch`; a component mocks its action only when that action is outside the behavior under test.
- Cover happy path, validation failure, expected backend failure, and unexpected failure for every mutation.
- Do not assert private CSS classes, internal React state, or implementation-specific call order unless it is a contract.
- Add a regression test with every bug fix before or together with the fix.
- Keep fixtures local to the test until reuse is proven; then move them to `tests/fixtures/` by domain.

## Coverage Rollout

1. Publish coverage reports without global thresholds.
2. Cover authentication, middleware, event permissions, and payment mutations.
3. Require at least 90% branch coverage for these critical rules.
4. Add an initial repository-wide threshold after representative tests exist, then increase it only when new behavior is added.

## Pull Request Checklist

- The affected module document lists the changed rule, route, or backend contract.
- New behavior has focused tests at the lowest useful layer.
- Error and authorization behavior is covered where applicable.
- `pnpm test`, `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build` pass.
