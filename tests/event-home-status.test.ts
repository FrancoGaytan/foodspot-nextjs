import { describe, expect, it } from 'vitest';
import { EventStatus, getEventStatus } from '../src/hooks/useEventHome';
import { IEventHomeDetails } from '../src/models/event';

function createEvent(overrides: Partial<IEventHomeDetails> = {}): IEventHomeDetails {
  return {
    _id: 'event-1',
    memberLimit: 3,
    state: 'available',
    members: [],
    ...overrides,
  };
}

describe('Event Home card status', () => {
  it('marks the debtor event and blocks every other event for a debtor', () => {
    expect(getEventStatus(createEvent(), 'user-1', 'event-1')).toBe(EventStatus.DEBTOR);
    expect(getEventStatus(createEvent(), 'user-1', 'event-2')).toBe(EventStatus.BLOCKED);
  });

  it('distinguishes available, subscribed, and full available events', () => {
    expect(getEventStatus(createEvent(), 'user-1', null)).toBe(EventStatus.AVAILABLE);
    expect(getEventStatus(createEvent({ members: [{ _id: 'user-1' }] }), 'user-1', null)).toBe(EventStatus.SUBSCRIBED);
    expect(getEventStatus(createEvent({ memberLimit: 1, members: [{ _id: 'other-user' }] }), 'user-1', null)).toBe(EventStatus.FULL);
  });

  it('keeps members subscribed after an event is closed', () => {
    const closedEvent = createEvent({ state: 'closed', members: [{ _id: 'user-1' }] });

    expect(getEventStatus(closedEvent, 'user-1', null)).toBe(EventStatus.SUBSCRIBED);
    expect(getEventStatus(closedEvent, 'other-user', null)).toBe(EventStatus.CLOSED);
  });

  it('maps canceled and finished events to their terminal statuses', () => {
    expect(getEventStatus(createEvent({ state: 'canceled' }), 'user-1', null)).toBe(EventStatus.CANCELED);
    expect(getEventStatus(createEvent({ state: 'finished' }), 'user-1', null)).toBe(EventStatus.FINISHED);
  });

  it('allows payment only for members when an event is ready for payment', () => {
    const paymentEvent = createEvent({ state: 'readyforpayment', members: [{ _id: 'user-1' }] });

    expect(getEventStatus(paymentEvent, 'user-1', null)).toBe(EventStatus.READY_FOR_PAYMENT);
    expect(getEventStatus(paymentEvent, 'other-user', null)).toBe(EventStatus.CLOSED);
  });

  it('defaults missing or unknown event state to available', () => {
    expect(getEventStatus(null, 'user-1', null)).toBe(EventStatus.AVAILABLE);
    expect(getEventStatus(createEvent({ state: 'future-state' }), 'user-1', null)).toBe(EventStatus.AVAILABLE);
  });
});
