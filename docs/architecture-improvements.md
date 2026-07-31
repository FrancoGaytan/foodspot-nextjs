# Architecture Improvements

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
