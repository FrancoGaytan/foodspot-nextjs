# Event Home Module

## Responsibility

The event home renders public events for anonymous visitors and public/private events for authenticated users. It presents each event according to membership, capacity, lifecycle state, payment debt, and pending transfer warnings.

## Data Flow

1. `app/[lang]/eventHome/page.tsx` accepts only `available` and `subscribed` query filters; any other value becomes `available`.
2. `EventHome` loads localized labels, the current server cookie user, and pending transfer event IDs.
3. `EventsContainer` loads public events for anonymous users or public/private events for authenticated users, then gets detail for each event to calculate card state.
4. `EventCard` delegates the visible state and navigation/subscription behavior to `useEventHome`.

## Filter Rules

- `available` displays non-canceled events.
- `subscribed` displays only events where the current user is a member.
- An event whose details cannot be loaded is hidden rather than rendered with incomplete membership data.

## Card Status Rules

`getEventStatus` is the canonical mapping used by cards:

- A debtor sees `debtor` on the debt event and `blocked` on all other events.
- An available event is `subscribed` for its members, `full` at capacity, otherwise `available`.
- Closed events remain `subscribed` for members and are `closed` for other users.
- Canceled and finished events retain their respective terminal statuses.
- A ready-for-payment event is `readyforpayment` only for members; it is `closed` for other users.
- Missing or unknown lifecycle states default to `available`.

## Dependencies and Risks

The current home flow makes one list request, one debtor request for authenticated users, and one detail request per listed event. The proposed aggregated endpoint and its acceptance criteria are documented in [architecture improvements](../architecture-improvements.md).

## Required Tests

- Query filter normalization and event filtering.
- The full card status matrix, including debt precedence.
- Public versus authenticated service selection and pending transfer warning behavior.
- Service contracts for list, event detail, participation, and leave-event requests.

## Current Automated Coverage

- The card status matrix and Event Home service contracts for list/detail, participation, debt, and pending transfers have focused tests.
- Query normalization, server-side filtering, and pending-transfer rendering remain the next increment because they require rendering the async server components with their dependencies.
