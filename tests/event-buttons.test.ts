import { describe, expect, it } from 'vitest';
import { EventStatesEnum } from '../src/enums/EventState.enum';
import {
  showCloseEventBtn,
  showPayBtn,
  showQuitEventBtn,
  showReadyToPayBtn,
} from '../src/components/Modules/Event/EventBtns/eventBtnsActions';
import { IEvent } from '../src/models/event';
import { IPublicUser } from '../src/models/user';

function createUser(id: string): IPublicUser {
  return { _id: id, name: id, email: `${id}@test.local` } as IPublicUser;
}

function createEvent(overrides: Partial<IEvent> = {}): IEvent {
  const organizer = createUser('organizer');
  const buyer = createUser('buyer');
  return {
    _id: 'event', title: 'Event', chef: null, datetime: new Date(), description: 'Description', memberLimit: 10,
    state: EventStatesEnum.AVAILABLE, members: [organizer, buyer], organizer, shoppingDesignee: [buyer],
    transferReceipts: [], purchaseReceipts: [], ratings: [], penalization: 0, penalizationStartDate: new Date(), __v: 0,
    ...overrides,
  };
}

describe('event button rules', () => {
  it('shows close for an event organizer in an available event', () => {
    const organizer = createUser('organizer');
    expect(showCloseEventBtn(createEvent({ shoppingDesignee: [] }), organizer)).toBe(true);
    expect(showCloseEventBtn(createEvent(), organizer)).toBe(true);
  });

  it('shows quit for a member while the event is available', () => {
    const buyer = createUser('buyer');
    expect(showQuitEventBtn(createEvent(), buyer)).toBe(true);
  });

  it('requires purchases before enabling ready for payment', () => {
    const organizer = createUser('organizer');
    expect(showReadyToPayBtn(createEvent({ state: EventStatesEnum.CLOSED }), organizer)).toBe(false);
  });

  it('shows pay only for a member with a positive balance and no receipt', () => {
    const organizer = createUser('organizer');
    const event = createEvent({ state: EventStatesEnum.READY_FOR_PAYMENT, purchaseReceipts: [{ _id: 'purchase' } as never] });
    expect(showPayBtn(event, organizer, [{ userId: 'organizer', hasUploaded: false } as never], { userId: 'organizer', amount: 100 } as never)).toBe(true);
    expect(showPayBtn(event, organizer, [{ userId: 'organizer', hasUploaded: true } as never], { userId: 'organizer', amount: 100 } as never)).toBe(false);
  });
});
