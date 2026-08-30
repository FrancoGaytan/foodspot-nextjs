# Architecture Improvements

## Frontend Migration Log

### Scope and working agreement

This document tracks frontend-only improvements for `foodspot-nextjs`. Changes that require a coordinated backend contract remain documented as proposals and are not implemented from the frontend until the API agreement exists.

Each migration is intentionally incremental. After every implementation iteration, run `pnpm build` and repair any regression before starting the next slice.

### Migration order

1. Fix confirmed frontend correctness issues.
2. Consolidate authentication and browser/server service boundaries.
3. Document backend-dependent changes for later coordination.
4. Add frontend tests for authentication, route protection, event filters, and critical event actions.
5. Migrate the deprecated `next lint` script to the ESLint CLI.
6. Reduce unnecessary Client Components and optimize images, document preview, and event-detail loading.
7. Reassess the stabilized architecture before the redesign based on `foodspot-prototype`.

### Decision log

#### 2026-08-30: Fix modal portal initialization

`usePortalRoot` previously stored the dynamically created portal element in a ref. Updating a ref does not trigger a render, so `ModalProvider` could keep seeing a `null` portal element after mount. The first frontend change stores the element in state, which causes the provider to render the portal once the DOM node exists.

Validation: `pnpm build` must pass after this change.

#### 2026-08-30: Consolidate authenticated service access

The active application flow uses Server Actions and server-only services, which can read the `httpOnly` JWT cookie. The previous browser HTTP layer and its password hook had no consumers and attempted to read that cookie through `document.cookie`, which is incompatible with the cookie configuration. Those unused implementations were removed so the repository has one authenticated service boundary instead of two competing ones.

Validation: `pnpm build` must pass and no source import may reference the removed client layer.

#### 2026-08-30: Migrate the lint command

Next.js marks `next lint` as deprecated. The project now invokes ESLint directly against `src` with `--max-warnings=0`. Running ESLint over the repository root would incorrectly include generated `.next` types and `next-env.d.ts`, so the scope is intentionally limited to source files.

Validation: `pnpm lint` and `pnpm build` must both pass.

#### 2026-08-30: Make document-viewer styles explicit

The document viewer stylesheet was imported as a side effect from `utilities.ts`, causing a broadly shared utility module to carry an unrelated dependency. The stylesheet is now declared in the locale layout, while the utility module remains focused on reusable functions. The viewer component itself remains unchanged in this iteration to avoid changing its runtime loading behavior without a visual test.

The unused legacy preview implementation in `utils/common/filesUtilities.jsx` was also removed. The production preview has one remaining owner in `components/Shared/FilesPreview`. The event-detail bundle remains at approximately `285 kB` First Load JS, so dynamic loading of the viewer is reserved for a later iteration with browser validation.

#### 2026-08-30: Add the frontend test harness

Vitest, Testing Library, and `jsdom` are now available through `pnpm test`. The initial suite covers middleware behavior with deterministic `NextRequest` instances, including locale redirect, protected routes, authenticated access, and public access. Vite's native `tsconfig` path resolution is used instead of an additional alias plugin.

The suite also covers the registration Server Action with a mocked server service: password mismatch, invalid email domain, and successful registration. Tests intentionally mock the service boundary; deployed backend validation remains a separate integration check against the mock API environment.

### Validation workflow

Run the following commands before each test deployment:

```bash
pnpm test
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

After those checks pass, deploy the branch to the existing frontend test environment and verify the affected user flow against the mocked backend. Record behavioral findings in this document before making the next migration.

### Backend-dependent work deferred

- Add an aggregated event-home endpoint to remove the current `N + 2` request pattern. The proposal and acceptance criteria are described below.
- Align authentication/API contracts if the backend changes token or response formats.

## Event Home Aggregated Data Endpoint

### Status

Pending backend coordination. No frontend or backend behavior should change until the API contract is agreed with the backend owner.

### Current Flow

`EventsContainer` loads the event list and then requests the full detail for every event so each card can determine its member and payment state. For an authenticated user, this produces:

1. One request for the event list.
2. One request for the user's debtor state.
3. One `getEventById` request per event displayed.

The requests now run server-side, so they do not generate repeated browser Server Action requests. However, the backend workload still grows linearly with the number of events ($N + 2$ requests).

### Proposed Backend Contract

Expose one authenticated endpoint dedicated to the event home. The endpoint should return all data required to render the cards:

```ts
interface EventHomeResponse {
  events: IEvent[];
  debtorEventId: string | null;
}
```

The response should preserve the current visibility rules:

- Authenticated users receive public and eligible private events.
- Unauthenticated users receive only public events.
- `debtorEventId` is derived from the authenticated user, not from a user ID supplied by the client.

If returning the full `IEvent` shape is too large, define a dedicated `IEventHomeCard` DTO containing the current card fields plus the member identifiers needed to calculate participation.

### Frontend Follow-up

After the endpoint is available, update `EventsContainer` to make one server-side request and pass the returned event details and debtor state to `EventCard`. Remove the individual calls to `getEventById` and `isUserDebtor` from that container.

### Acceptance Criteria

- Loading `eventHome` makes one backend request for its event data.
- The endpoint derives identity from the JWT and never trusts a client-provided user ID.
- Public and authenticated event visibility remains unchanged.
- Existing card states remain unchanged: available, subscribed, full, canceled, closed, finished, ready for payment, debtor, and blocked.
- Add backend integration coverage for public users, authenticated users, and users with outstanding debt.
